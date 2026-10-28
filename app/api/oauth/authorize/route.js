import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import McpAuthCode from "@/models/McpAuthCode";
import { getPublicOrigin, hashSecret, randomSecret } from "@/libs/mcp/auth";
import {
  AUTH_CODE_TTL_SECONDS,
  buildRedirect,
  validateAuthorizeRequest,
} from "@/libs/mcp/oauth";

export const dynamic = "force-dynamic";

/**
 * GET /api/oauth/authorize — forwards to the consent page.
 */
export async function GET(req) {
  const url = new URL(req.url);
  return NextResponse.redirect(
    `${getPublicOrigin(req)}/oauth/authorize${url.search}`,
  );
}

/**
 * POST /api/oauth/authorize
 * Submitted by the consent page when a signed-in admin approves or denies a
 * connection. Issues a single-use authorization code.
 */
export async function POST(req) {
  const origin = getPublicOrigin(req);
  // Only accept submissions from our own consent page
  const requestOrigin = req.headers.get("origin");
  if (requestOrigin && requestOrigin !== origin) {
    return new Response("Invalid origin", { status: 403 });
  }

  const form = Object.fromEntries(await req.formData());
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return new Response("Admin sign-in required", { status: 403 });
  }

  const result = await validateAuthorizeRequest(form);
  if (result.error && !result.redirectable) {
    return new Response(result.error, { status: 400 });
  }
  const { params } = result;
  if (result.error) {
    return NextResponse.redirect(
      buildRedirect(params.redirectUri, {
        error: result.error,
        error_description: result.description,
        state: params.state,
        iss: origin,
      }),
      303,
    );
  }

  if (form.decision !== "approve") {
    return NextResponse.redirect(
      buildRedirect(params.redirectUri, {
        error: "access_denied",
        state: params.state,
        iss: origin,
      }),
      303,
    );
  }

  await connectMongoose();
  const code = randomSecret(32);
  await McpAuthCode.create({
    codeHash: hashSecret(code),
    client: result.client._id,
    user: session.user.id,
    redirectUri: params.redirectUri,
    codeChallenge: params.codeChallenge,
    scopes: params.scopes,
    resource: params.resource,
    expiresAt: new Date(Date.now() + AUTH_CODE_TTL_SECONDS * 1000),
  });

  return NextResponse.redirect(
    buildRedirect(params.redirectUri, { code, state: params.state, iss: origin }),
    303,
  );
}
