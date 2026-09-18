import {
  checkOrigin,
  header,
  sessionCookie,
  trustedIP,
  verifyToken,
  readFormJSON,
  validateForm,
  reviewReason,
  hash,
  privateFingerprint,
  failure,
} from "./formSecurity.js";
import {
  formCollections,
  enforceQuotas,
  consumeCounter,
  quarantine,
} from "./formStore.js";

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}
export function withPublicForm(handler, purpose, dependencies = {}) {
  const store = dependencies.collections || formCollections;
  return async (request) => {
    let receipt,
      collections,
      owned = false,
      retrying = false,
      handlerStarted = false;
    try {
      checkOrigin(request);
      const session = sessionCookie(request);
      const token = verifyToken(
        header(request, "x-form-token"),
        purpose,
        session,
      );
      const body = await readFormJSON(
        request,
        purpose === "catalogue/shares" ? 131072 : 65536,
      );
      validateForm(body, purpose);
      // Credentials never enter persisted payloads. Only a digest is stored.
      const fingerprint = privateFingerprint(JSON.stringify(body));
      collections = await store();
      receipt = {
        _id: token.id,
        fingerprint,
        state: "running",
        expiresAt: new Date(Date.now() + 86400000),
      };
      try {
        await collections.receipts.insertOne(receipt);
        owned = true;
      } catch (error) {
        if (error.code !== 11000) throw error;
        const previous = await collections.receipts.findOne({ _id: token.id });
        if (previous?.fingerprint !== fingerprint)
          throw failure(
            "This form was already submitted. Please try again.",
            409,
            "FORM_TOKEN",
          );
        if (purpose === "auth")
          throw failure(
            "Please submit the sign-in form again.",
            409,
            "FORM_TOKEN",
          );
        if (previous.state === "complete")
          return json(previous.body, previous.status);
        if (previous.state === "retryable" && purpose === "contact") {
          const claim = await collections.receipts.updateOne(
            { _id: token.id, state: "retryable" },
            { $set: { state: "running" } },
          );
          owned = claim.modifiedCount === 1;
          retrying = owned;
        }
        if (!owned)
          throw failure(
            "Your submission is still processing. Please wait before retrying.",
            409,
            "FORM_PROCESSING",
          );
      }
      const signup = body.isSignUp === true || body.isSignUp === "true";
      await enforceQuotas(collections.counters, {
        purpose,
        ip: trustedIP(request),
        session: hash(session),
        email: body.email,
        signup,
      });
      if (
        signup &&
        !(await consumeCounter(
          collections.counters,
          "signup-notification-events",
          30,
          86400000,
        ))
      ) {
        await quarantine(collections, body, purpose, "signup-budget");
        throw failure(
          "Your registration has been held for review. Please contact us for help.",
          422,
          "FORM_REVIEW",
        );
      }
      if (purpose !== "auth" && purpose !== "catalogue/shares") {
        const { submissionEventId, attribution, ...content } = body;
        const contentId = hash(
          `content:${purpose}:${JSON.stringify(content)}:${Math.floor(Date.now() / 600000)}`,
        );
        try {
          await collections.receipts.insertOne({
            _id: contentId,
            kind: "content",
            tokenId: token.id,
            eventId: submissionEventId || null,
            expiresAt: new Date(Date.now() + 1200000),
          });
        } catch (error) {
          if (error.code !== 11000) throw error;
          const earlier = await collections.receipts.findOne({
            _id: contentId,
          });
          if (
            earlier.tokenId !== token.id &&
            (!submissionEventId || earlier.eventId !== submissionEventId)
          ) {
            throw failure(
              "These details were already submitted recently. Please wait or contact us if you need to update your enquiry.",
              409,
              "FORM_DUPLICATE",
            );
          }
        }
      }
      const reason = reviewReason(body);
      if (reason) {
        await quarantine(collections, body, purpose, reason);
        throw failure(
          "Your details have been held for review. Please contact us if you need an immediate response.",
          422,
          "FORM_REVIEW",
        );
      }
      // Reserve the email budget before any business side effects. Each form
      // sends at most a customer acknowledgement and admin notification. Auth
      // signup can notify multiple admins, so reserve separately in that sender.
      if (!retrying && body.email && purpose !== "auth" && purpose !== "lead") {
        if (
          !(await consumeCounter(
            collections.counters,
            `email-recipient:${body.email}`,
            3,
            86400000,
          )) ||
          !(await consumeCounter(
            collections.counters,
            "email-form-pairs",
            100,
            86400000,
          ))
        ) {
          await quarantine(collections, body, purpose, "email-budget");
          throw failure(
            "Your enquiry has been held for review. Please contact us if urgent.",
            422,
            "FORM_REVIEW",
          );
        }
      }
      const protectedRequest = new Proxy(request, {
        get(target, key) {
          if (key === "json") return async () => body;
          if (key === "cookies" && !target.cookies)
            return { get: () => undefined };
          const value = Reflect.get(target, key, target);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
      handlerStarted = true;
      let response = await handler(protectedRequest);
      if (response.status >= 500 && purpose !== "contact") {
        response = json(
          {
            error:
              "We could not confirm your submission. Please contact us by phone before resubmitting.",
            code: "FORM_UNCERTAIN",
          },
          503,
        );
      }
      const responseBody = await response.clone().json();
      await collections.receipts.updateOne(
        { _id: token.id },
        {
          $set: {
            state:
              response.status >= 500 && purpose === "contact"
                ? "retryable"
                : "complete",
            status: response.status,
            body: responseBody,
          },
        },
      );
      return response;
    } catch (error) {
      const status = error.status || 503;
      const body = {
        error: error.status
          ? error.message
          : "We could not process your submission. Please try again shortly.",
        code: error.code || "FORM_UNAVAILABLE",
      };
      if (
        owned &&
        collections &&
        !handlerStarted &&
        (status === 429 || status === 503)
      ) {
        await collections.receipts
          .deleteOne({ _id: receipt._id })
          .catch(() => {});
        owned = false;
      }
      if (owned && collections) {
        // Errors before business handlers have no side effects; completed
        // receipts prevent accidental replay of uncertain non-contact writes.
        await collections.receipts
          .updateOne(
            { _id: receipt._id },
            { $set: { state: "complete", status, body } },
          )
          .catch(() => {});
      }
      if (error.status)
        console.info("Public form rejected", {
          purpose,
          status,
          code: body.code,
        });
      if (!error.status)
        console.error("Public form unavailable", { purpose, name: error.name });
      return json(
        body,
        status,
        status === 429 ? { "Retry-After": "3600" } : {},
      );
    }
  };
}

const credentialsGate = withPublicForm(async () => json({ ok: true }), "auth");
export async function checkCredentialsSubmission(credentials, req) {
  const headers = new Headers(req.headers);
  headers.set("content-type", "application/json");
  headers.set("x-form-token", credentials.formToken || "");
  const {
    formToken,
    csrfToken,
    callbackUrl,
    json: ignored,
    ...body
  } = credentials;
  const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const response = await credentialsGate(
    new Request(`${origin}/api/auth/callback/credentials`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
  );
  if (!response.ok) throw new Error((await response.json()).error);
}
