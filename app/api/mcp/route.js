import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { authenticateMcpRequest, getPublicOrigin } from "@/libs/mcp/auth";
import { createMcpServer } from "@/libs/mcp/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * /api/mcp — Model Context Protocol endpoint for the admin dashboard.
 * AI agents (Claude, ChatGPT, …) connect here with an OAuth access token or a
 * personal access token created at /admin/ai-agents.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Authorization, Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, WWW-Authenticate",
};

const withCors = (response) => {
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
};

const unauthorized = (req) => {
  const origin = getPublicOrigin(req);
  return withCors(
    new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized" },
        id: null,
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource/api/mcp"`,
        },
      },
    ),
  );
};

async function handle(req) {
  const agent = await authenticateMcpRequest(req);
  if (!agent) return unauthorized(req);

  const server = createMcpServer({ ...agent, origin: getPublicOrigin(req) });
  // Stateless: every request gets its own server/transport, which suits
  // serverless hosting. Responses are plain JSON rather than SSE streams.
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  try {
    return withCors(await transport.handleRequest(req));
  } finally {
    // JSON responses are fully buffered, so the server can close now
    server.close().catch(() => {});
  }
}

export async function POST(req) {
  return handle(req);
}

export async function GET(req) {
  const agent = await authenticateMcpRequest(req);
  if (!agent) return unauthorized(req);
  // No server-initiated stream in stateless mode
  return withCors(
    new Response(null, { status: 405, headers: { Allow: "POST" } }),
  );
}

export async function DELETE(req) {
  return withCors(new Response(null, { status: 405, headers: { Allow: "POST" } }));
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}
