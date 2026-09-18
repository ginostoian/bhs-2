import {
  createHmac,
  randomBytes,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { isIP } from "node:net";

export const FORM_PURPOSES = new Set([
  "contact",
  "lead",
  "leads",
  "kitchen-calculator-leads",
  "renovation-calculator-leads",
  "bathroom-renovation",
  "kitchen-renovation",
  "general-renovation",
  "catalogue/shares",
  "auth",
]);
export const FORM_COOKIE = "bhs_form_session";
export const TOKEN_AGE = 30 * 60 * 1000;
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const privateFingerprint = (value) =>
  createHmac("sha256", secret()).update(value).digest("hex");
export function failure(message, status = 400, code = "INVALID_SUBMISSION") {
  return Object.assign(new Error(message), { status, code });
}
function secret() {
  const key = process.env.FORM_SECURITY_SECRET || process.env.NEXTAUTH_SECRET;
  if (!key)
    throw failure(
      "Forms are temporarily unavailable. Please try again shortly.",
      503,
      "FORM_UNAVAILABLE",
    );
  return key;
}
export function header(request, name) {
  return request.headers?.get
    ? request.headers.get(name)
    : request.headers?.[name];
}
export function sessionCookie(request) {
  const cookies = header(request, "cookie") || "";
  const value = cookies
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith(`${FORM_COOKIE}=`))
    ?.slice(FORM_COOKIE.length + 1);
  return /^[a-f0-9]{48}$/.test(value || "") ? value : null;
}
export function trustedIP(request) {
  // Vercel overwrites x-forwarded-for. On other hosts explicitly configure a
  // header that your reverse proxy OVERWRITES, never one supplied by the user.
  const name =
    process.env.VERCEL === "1"
      ? "x-forwarded-for"
      : process.env.TRUSTED_CLIENT_IP_HEADER;
  const ip = name ? header(request, name)?.split(",")[0].trim() || "" : "";
  return isIP(ip) ? ip : null;
}
export function checkOrigin(request) {
  const origin = header(request, "origin");
  const expected = new URL(request.url).origin;
  const allowed = new Set([
    expected,
    "https://bhstudio.co.uk",
    "https://www.bhstudio.co.uk",
  ]);
  if (
    !origin ||
    !allowed.has(origin) ||
    header(request, "sec-fetch-site") === "cross-site"
  ) {
    throw failure(
      "Please reload the form on our website and try again.",
      403,
      "FORM_ORIGIN",
    );
  }
}
export function issueToken(purpose, session, now = Date.now()) {
  if (!FORM_PURPOSES.has(purpose)) throw failure("Unknown form");
  const payload = Buffer.from(
    JSON.stringify({
      purpose,
      session: hash(session),
      id: randomBytes(24).toString("hex"),
      issued: now,
    }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
export function verifyToken(token, purpose, session, now = Date.now()) {
  if (typeof token !== "string" || token.length > 1024 || !session)
    throw failure("Please reload the form and try again.", 403, "FORM_TOKEN");
  const [payload, signature, extra] = token.split(".");
  const expected = createHmac("sha256", secret())
    .update(payload || "")
    .digest("base64url");
  if (
    extra ||
    !signature ||
    Buffer.byteLength(signature) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
    throw failure("Please reload the form and try again.", 403, "FORM_TOKEN");
  let data;
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    throw failure("Invalid form token", 403, "FORM_TOKEN");
  }
  if (
    data.purpose !== purpose ||
    data.session !== hash(session) ||
    !/^[a-f0-9]{48}$/.test(data.id || "") ||
    !Number.isFinite(data.issued) ||
    data.issued > now ||
    now - data.issued > TOKEN_AGE
  )
    throw failure(
      "Your form session expired. Please submit again.",
      403,
      "FORM_TOKEN",
    );
  return data;
}
export async function readFormJSON(request, maxBytes = 65536) {
  if (!(header(request, "content-type") || "").startsWith("application/json"))
    throw failure("Expected JSON", 415);
  if (Number(header(request, "content-length")) > maxBytes)
    throw failure("Submission is too large", 413);
  const reader = request.body?.getReader();
  if (!reader) throw failure("Empty submission");
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw failure("Submission is too large", 413);
      }
      chunks.push(Buffer.from(value));
    }
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw failure("Invalid submission");
    return body;
  } catch (error) {
    if (error.status) throw error;
    throw failure("Invalid JSON");
  }
}
const textFields = [
  "firstName",
  "lastName",
  "name",
  "email",
  "phone",
  "topic",
  "customTopic",
  "message",
  "brief",
  "postcode",
  "address",
  "website",
  "company",
  "honeypot",
  "additionalRequests",
  "referralCode",
];
export function validateForm(body, purpose) {
  for (const field of textFields) {
    if (
      body[field] != null &&
      (typeof body[field] !== "string" ||
        body[field].length >
          (field === "message" ||
          field === "brief" ||
          field === "additionalRequests"
            ? 4000
            : 500))
    )
      throw failure(`Invalid ${field}`);
  }
  for (const field of ["name", "firstName", "lastName"]) {
    if (body[field]?.length > 100)
      throw failure("Please shorten your name to 100 characters.");
  }
  if (
    purpose === "contact" &&
    (body.message?.length > 2000 || body.brief?.length > 1500)
  )
    throw failure("Please shorten your enquiry.");
  for (const field of ["website", "company", "honeypot"])
    if (body[field]?.trim()) throw failure("Invalid submission");
  if (
    purpose !== "catalogue/shares" &&
    (typeof body.email !== "string" ||
      body.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()))
  )
    throw failure("Please enter a valid email address.");
  if (body.email) body.email = body.email.trim().toLowerCase();
  if (purpose === "contact") {
    if (
      ![
        "General",
        "New Project",
        "Work with / For us",
        "Warranty",
        "Other",
      ].includes(body.topic)
    )
      throw failure("Please select a topic.");
    if (body.brief !== undefined) {
      if (!body.brief.trim() || !/\p{L}/u.test(body.brief))
        throw failure("Please describe your project in a few words.");
      const q = body.qualification || {};
      body.message = `Postcode: ${body.postcode || ""}\nProject: ${typeof q.service === "string" ? q.service : ""}\nStage: ${typeof q.stage === "string" ? q.stage : ""}\nInvestment: ${typeof q.budget === "string" ? q.budget : ""}\n\n${body.brief.trim()}`;
    } else if (typeof body.message !== "string" || !/\p{L}/u.test(body.message))
      throw failure("Please describe your enquiry in a few words.");
  }
  if (purpose === "auth") {
    if (
      typeof body.password !== "string" ||
      body.password.length > 1024 ||
      !body.password
    )
      throw failure("Please enter your password.");
    if (body.isSignUp === "true" || body.isSignUp === true) {
      if (
        !body.name?.trim() ||
        body.name.length > 100 ||
        !/\p{L}/u.test(body.name)
      )
        throw failure("Please enter your name.");
      if (body.password.length < 8 || Buffer.byteLength(body.password) > 72)
        throw failure(
          "Use a password of at least 8 characters and at most 72 bytes.",
        );
    }
  }
}
export function reviewReason(body) {
  // Suspicious content is reviewable; unfamiliar or international names alone
  // are never a reason to reject or quarantine a visitor.
  if (
    /(https?:\/\/|www\.)/i.test(
      [body.name, body.firstName, body.lastName].filter(Boolean).join(" "),
    )
  )
    return "link-in-name";
  const text = body.brief ?? body.message ?? body.additionalRequests ?? "";
  if ((text.match(/https?:\/\//gi) || []).length >= 3) return "multiple-links";
  return null;
}

// NextAuth's credentials callback supplies headers, but no req.cookies.
// Keep chunked session cookie names intact for NextAuth's own JWT verifier.
export function authRequestWithCookies(request) {
  const cookies = {};
  for (const part of (header(request, "cookie") || "").split(";")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    const name = part.slice(0, separator).trim();
    try {
      cookies[name] = decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      /* Ignore malformed cookies. */
    }
  }
  return { ...request, cookies };
}
