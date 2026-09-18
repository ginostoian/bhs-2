import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import {
  checkOrigin,
  readFormJSON,
  issueToken,
  sessionCookie,
  FORM_COOKIE,
  trustedIP,
  failure,
} from "@/libs/formSecurity";
export const dynamic = "force-dynamic";
// Bounded, best-effort admission protects issuance without opening a database
// pool. Submission quotas are separately enforced in shared MongoDB storage.
const issuance = new Map();
export async function POST(request) {
  try {
    checkOrigin(request);
    const { purpose } = await readFormJSON(request, 1024);
    const session = sessionCookie(request) || randomBytes(24).toString("hex");
    const key = trustedIP(request) || session;
    const now = Date.now();
    const old = issuance.get(key);
    const record =
      old && old.until > now ? old : { count: 0, until: now + 60000 };
    if (++record.count > 30)
      throw failure("Please wait a minute before retrying.", 429);
    if (issuance.size >= 2000) {
      for (const [k, v] of issuance) if (v.until <= now) issuance.delete(k);
      if (issuance.size >= 2000) issuance.delete(issuance.keys().next().value);
    }
    issuance.set(key, record);
    const response = NextResponse.json(
      { token: issueToken(purpose, session) },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(FORM_COOKIE, session, {
      httpOnly: true,
      sameSite: "strict",
      secure: new URL(request.url).protocol === "https:",
      path: "/",
      maxAge: 86400,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error.status ? error.message : "Forms temporarily unavailable.",
      },
      { status: error.status || 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
