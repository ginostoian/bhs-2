import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { withPublicForm } from "../../libs/publicForm.js";
import {
  issueToken,
  verifyToken,
  validateForm,
  trustedIP,
} from "../../libs/formSecurity.js";
import { consumeCounter } from "../../libs/formStore.js";
import { memoryCollections, formRequest } from "./form-harness.mjs";
process.env.NEXTAUTH_SECRET = "isolated-test-secret-not-production";
const legitimate = {
  firstName: "Zoë",
  lastName: "Nguyễn",
  email: "homeowner@example.test",
  topic: "New Project",
  message: "Please call me about an extension.",
};
function setup(
  purpose = "contact",
  handler = async () => Response.json({ accepted: true }),
) {
  const store = memoryCollections();
  let called = 0,
    connections = 0;
  const post = withPublicForm(
    async (req) => {
      called++;
      return handler(req);
    },
    purpose,
    {
      collections: async () => {
        connections++;
        return store;
      },
    },
  );
  return { post, store, counts: () => ({ called, connections }) };
}
test("missing, forged, wrong-session, wrong-purpose and expired tokens cannot reach database or handler", async () => {
  const session = randomBytes(24).toString("hex");
  for (const token of [
    "",
    "forged",
    issueToken("lead", session),
    issueToken("contact", randomBytes(24).toString("hex")),
    issueToken("contact", session, Date.now() - 31 * 60000),
  ]) {
    const h = setup();
    assert.equal(
      (await h.post(formRequest(legitimate, "contact", { token, session })))
        .status,
      403,
    );
    assert.deepEqual(h.counts(), { called: 0, connections: 0 });
  }
});
test("numeric campaigns, honeypots, structured types and malformed JSON fail before storage", async () => {
  for (const body of [
    { ...legitimate, message: "9283581813" },
    { ...legitimate, brief: "9283581813", message: "Project: Extension" },
    { ...legitimate, website: "spam" },
    { ...legitimate, email: { $ne: null } },
    { ...legitimate, company: [] },
    "{invalid",
  ]) {
    const h = setup();
    assert.equal((await h.post(formRequest(body))).status, 400);
    assert.deepEqual(h.counts(), { called: 0, connections: 0 });
  }
});
test("payload byte limit and cross-origin checks precede database access", async () => {
  const h = setup();
  assert.equal(
    (await h.post(formRequest({ ...legitimate, message: "x".repeat(70000) })))
      .status,
    413,
  );
  assert.equal(
    (
      await h.post(
        formRequest(legitimate, "contact", {
          headers: { origin: "https://untrusted.example" },
        }),
      )
    ).status,
    403,
  );
  assert.equal(h.counts().connections, 0);
});
test("legitimate names, separate brief and optional phone survive validation", async () => {
  let parsed;
  const h = setup("contact", async (req) => {
    parsed = await req.json();
    return Response.json({ accepted: true });
  });
  assert.equal(
    (
      await h.post(
        formRequest({
          ...legitimate,
          brief: "A kitchen extension please",
          postcode: "E2",
          qualification: { service: "Extension" },
        }),
      )
    ).status,
    200,
  );
  assert.match(parsed.message, /A kitchen extension please/);
  assert.match(parsed.message, /Postcode: E2/);
  assert.equal(parsed.lastName, "Nguyễn");
});
test("same token retries cached success; a changed payload cannot replay it", async () => {
  const h = setup();
  const session = randomBytes(24).toString("hex"),
    token = issueToken("contact", session),
    options = { session, token };
  assert.equal(
    (await h.post(formRequest(legitimate, "contact", options))).status,
    200,
  );
  assert.equal(
    (await h.post(formRequest(legitimate, "contact", options))).status,
    200,
  );
  assert.equal(
    (
      await h.post(
        formRequest(
          { ...legitimate, message: "different" },
          "contact",
          options,
        ),
      )
    ).status,
    409,
  );
  assert.equal(h.counts().called, 1);
});
test("concurrent identical token submissions invoke handler only once", async () => {
  const h = setup();
  const session = randomBytes(24).toString("hex"),
    token = issueToken("contact", session);
  const responses = await Promise.all(
    Array.from({ length: 8 }, () =>
      h.post(formRequest(legitimate, "contact", { session, token })),
    ),
  );
  assert.equal(h.counts().called, 1);
  assert.equal(responses.filter((r) => r.status === 200).length >= 1, true);
});
test("contact internal failure retries safely using existing handler idempotency", async () => {
  let n = 0;
  const h = setup("contact", async () =>
    Response.json(n++ ? { accepted: true } : { error: "temporary" }, {
      status: n === 1 ? 500 : 200,
    }),
  );
  const session = randomBytes(24).toString("hex"),
    token = issueToken("contact", session);
  assert.equal(
    (await h.post(formRequest(legitimate, "contact", { session, token })))
      .status,
    500,
  );
  assert.equal(
    (await h.post(formRequest(legitimate, "contact", { session, token })))
      .status,
    200,
  );
});
test("distributed IPs cannot exceed recipient email budget; excess is held without side effects", async () => {
  const h = setup();
  for (let i = 0; i < 3; i++)
    assert.equal(
      (
        await h.post(
          formRequest({ ...legitimate, message: `Enquiry number ${i}` }),
        )
      ).status,
      200,
    );
  const fourth = await h.post(formRequest(legitimate));
  assert.equal(fourth.status, 422);
  assert.equal(h.counts().called, 3);
  assert.equal(h.store.reviews.rows.size, 1);
});
test("suspicious links are quarantined and credentials/passwords are never retained", async () => {
  const h = setup("auth");
  const body = {
    email: "person@example.test",
    name: "https://spam.example",
    password: "private-password",
    isSignUp: "true",
    signUpRole: "referrer",
  };
  assert.equal((await h.post(formRequest(body, "auth"))).status, 422);
  assert.equal(h.counts().called, 0);
  assert.equal(
    JSON.stringify([...h.store.reviews.rows.values()]).includes(
      "private-password",
    ),
    false,
  );
});
test("referrer signup and login are both protected; tokens are single-use for auth", async () => {
  const h = setup("auth");
  const body = {
    email: "referrer@example.test",
    name: "Real Person",
    password: "good-password",
    isSignUp: "true",
    signUpRole: "referrer",
  };
  assert.equal(
    (await h.post(formRequest(body, "auth", { token: "" }))).status,
    403,
  );
  const session = randomBytes(24).toString("hex"),
    token = issueToken("auth", session);
  assert.equal(
    (await h.post(formRequest(body, "auth", { session, token }))).status,
    200,
  );
  assert.equal(
    (await h.post(formRequest(body, "auth", { session, token }))).status,
    409,
  );
  assert.equal(h.counts().called, 1);
});
test("calculator, renovation, newsletter and catalogue routes preserve their different schemas", async () => {
  for (const purpose of [
    "lead",
    "leads",
    "kitchen-calculator-leads",
    "renovation-calculator-leads",
    "bathroom-renovation",
    "kitchen-renovation",
    "general-renovation",
    "catalogue/shares",
  ]) {
    const h = setup(purpose);
    const body =
      purpose === "catalogue/shares"
        ? { items: [{ productId: "a", name: "Basin" }] }
        : {
            email: "real@example.test",
            name: "A Person",
            formData: { area: 30 },
          };
    assert.equal(
      (await h.post(formRequest(body, purpose))).status,
      200,
      purpose,
    );
    assert.equal(
      (await h.post(formRequest(body, purpose, { token: "" }))).status,
      403,
      purpose,
    );
  }
});
test("atomic counter enforces limit and expiry independently of TTL deletion", async () => {
  const { counters } = memoryCollections();
  const results = await Promise.all(
    Array.from({ length: 20 }, () =>
      consumeCounter(counters, "test", 3, 1000, 100),
    ),
  );
  assert.equal(results.filter(Boolean).length, 3);
  assert.equal(await consumeCounter(counters, "test", 3, 1000, 1200), true);
});
test("database outage fails closed before business side effects", async () => {
  let called = false;
  const h = withPublicForm(
    async () => {
      called = true;
    },
    "contact",
    {
      collections: async () => {
        throw Error("unavailable");
      },
    },
  );
  assert.equal((await h(formRequest(legitimate))).status, 503);
  assert.equal(called, false);
});
test("arbitrary forwarding headers are not trusted off Vercel without explicit proxy configuration", () => {
  const before = process.env.VERCEL;
  delete process.env.VERCEL;
  delete process.env.TRUSTED_CLIENT_IP_HEADER;
  assert.equal(
    trustedIP({
      headers: new Headers({
        "x-real-ip": "1.2.3.4",
        "cf-connecting-ip": "1.2.3.4",
      }),
    }),
    null,
  );
  if (before !== undefined) process.env.VERCEL = before;
});

test("rejected attempts from one identity cannot consume the global admission budget", async () => {
  const { enforceQuotas } = await import("../../libs/formStore.js");
  const { counters } = memoryCollections();
  for (let i = 0; i < 220; i++)
    await enforceQuotas(counters, {
      purpose: "contact",
      session: "blocked",
      ip: "192.0.2.1",
      email: "same@example.test",
    }).catch(() => {});
  await enforceQuotas(counters, {
    purpose: "contact",
    session: "fresh",
    ip: "192.0.2.2",
    email: "new@example.test",
  });
});
test("fresh submission IDs cannot send duplicate content again", async () => {
  const h = setup();
  const a = { ...legitimate, submissionEventId: "one" };
  assert.equal((await h.post(formRequest(a))).status, 200);
  assert.equal(
    (await h.post(formRequest({ ...a, submissionEventId: "two" }))).status,
    409,
  );
  assert.equal(h.counts().called, 1);
});

test("database index/counter failures cannot create leads or notifications", async () => {
  const store = memoryCollections();
  store.counters.findOneAndUpdate = async () => {
    throw new Error("counter unavailable");
  };
  let sideEffects = 0;
  const h = withPublicForm(
    async () => {
      sideEffects++;
      return Response.json({ accepted: true });
    },
    "contact",
    { collections: async () => store },
  );
  assert.equal((await h(formRequest(legitimate))).status, 503);
  assert.equal(sideEffects, 0);
  assert.equal(store.receipts.rows.size, 0);
});
