import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools";

const INSTRUCTIONS = `You are connected to the Better Homes Studio admin dashboard (a London renovation company) as an admin.
- Start with \`search\` to find people, projects, quotes or leads by name, email, phone or postcode; IDs from results feed the other tools.
- Read anything with query_records / aggregate_records (call describe_model first to learn fields) or the overview tools.
- Prefer the purpose-built tools for projects, tasks, payments, quotes, clients and leads.
- For anything else, find the endpoint with list_api_endpoints and use call_api — it behaves exactly like the admin dashboard, including emails and notifications to clients.
- Money is in GBP. Dates are ISO 8601. Confirm with the user before deleting data or making changes that notify clients.`;

/** Build a fresh MCP server bound to one authenticated agent request. */
export function createMcpServer(ctx) {
  const server = new McpServer(
    { name: "bhs-admin", title: "Better Homes Studio Admin", version: "1.0.0" },
    { instructions: INSTRUCTIONS, capabilities: { tools: {} } },
  );
  registerTools(server, ctx);
  return server;
}
