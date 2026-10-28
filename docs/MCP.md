# AI Agents (MCP Server)

The admin dashboard exposes a [Model Context Protocol](https://modelcontextprotocol.io) server at `/api/mcp`, so AI assistants (Claude, ChatGPT and other MCP clients) can read everything in the dashboard and take any admin action.

Admins manage connections, tokens and the activity log at **Admin → AI agents** (`/admin/ai-agents`).

## Connecting

**Claude (web, desktop, mobile):** Settings → Connectors → Add custom connector → paste `https://bhstudio.co.uk/api/mcp` → Connect, then sign in and click **Allow access**.

**ChatGPT:** Settings → Apps & Connectors → Advanced → enable Developer mode → create a connector with the same URL and OAuth authentication.

**Claude Code / scripts:** create a personal access token on the AI agents page, then:

```bash
claude mcp add --transport http bhs-admin https://bhstudio.co.uk/api/mcp \
  --header "Authorization: Bearer bhs_pat_…"
```

## How it works

- **Writes go through the existing API routes.** Every tool that changes data calls the app's own `/api/...` endpoints, using a short-lived admin session minted for the connected admin. Validation, emails, notifications, status recalculation and numbering behave exactly as when an admin clicks in the dashboard. No existing route was changed.
- **Reads come straight from MongoDB** (`query_records`, `count_records`, `aggregate_records`, plus overview tools), because many admin pages read the database directly rather than through an API. Credential fields (password hashes, tokens) are always stripped. `$where`, `$function`, `$out` and `$merge` are blocked, as are lookups into credential collections.
- **Anything else** the dashboard can do is available through `list_api_endpoints` + `call_api`, limited to the endpoints in `libs/mcp/apiCatalog.json`. Auth, cron, webhook, OAuth and token-management endpoints are excluded.

### Tools

| Area | Tools |
| --- | --- |
| Discovery & reading | `whoami`, `search`, `describe_model`, `query_records`, `count_records`, `aggregate_records`, `get_project_overview`, `list_payments`, `dashboard_summary`, `list_api_endpoints` |
| Clients & projects | `create_client`, `create_project`, `update_project`, `add_project_note` |
| Tasks | `create_task_section`, `create_task`, `update_task` |
| Payments | `create_payment`, `update_payment`, `mark_payment_paid`, `set_payment_plan` (supports `dryRun`, never changes paid payments) |
| Quotes | `create_quote`, `update_quote`, `duplicate_quote` |
| CRM | `create_lead`, `update_lead`, `add_lead_note` |
| Everything else | `call_api` |

## Security

- OAuth 2.1 authorization code flow with PKCE (S256), dynamic client registration, 1-hour access tokens and rotating 90-day refresh tokens. Discovery documents are served at `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server` (rewrites in `next.config.js`).
- Only `role: "admin"` users can approve a connection. The role is re-checked on every request, so demoting an admin cuts off their agents immediately.
- Personal tokens can be read-only. Read-only connections don't see any write tools.
- Only SHA-256 hashes of tokens and codes are stored.
- Every tool call is written to `McpAuditLog` and shown on the AI agents page.

## Configuration

No new environment variables are required. Optional:

- `MCP_PUBLIC_URL`: public origin used in OAuth metadata (defaults to the request host).
- `MCP_INTERNAL_BASE_URL`: origin the server uses to call its own API (defaults to the request origin). Set it if the public URL can't be reached from the server, for example on preview deployments behind Vercel Deployment Protection.

When API routes are added or changed, regenerate the endpoint catalog:

```bash
npm run mcp-catalog
```

## Files

- `app/api/mcp/route.js`: MCP endpoint (stateless Streamable HTTP, JSON responses)
- `app/api/oauth/*`, `app/oauth/authorize/page.js`: OAuth server and consent screen
- `app/admin/ai-agents/`, `app/api/admin/mcp/*`: admin UI and its API
- `libs/mcp/`: tools, auth, internal API bridge, read-only data access and guards
- `models/Mcp*.js`: tokens, OAuth clients, authorization codes, audit log
- `tests/mcp.test.mjs`: unit tests for OAuth helpers, query guards and endpoint allowlist
