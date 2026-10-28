import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/next-auth";
import { validateAuthorizeRequest } from "@/libs/mcp/oauth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Connect an AI assistant | Better Homes Studio",
  robots: { index: false, follow: false },
};

const FORWARDED_PARAMS = [
  "response_type",
  "client_id",
  "redirect_uri",
  "state",
  "code_challenge",
  "code_challenge_method",
  "scope",
  "resource",
];

function Card({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        {children}
      </div>
    </main>
  );
}

/**
 * OAuth consent screen for AI connectors (Claude, ChatGPT, …) asking to use
 * the admin MCP server. Only admins can approve.
 */
export default async function AuthorizePage({ searchParams }) {
  const params = {};
  for (const key of FORWARDED_PARAMS) {
    if (typeof searchParams[key] === "string") params[key] = searchParams[key];
  }

  const result = await validateAuthorizeRequest(params);
  if (result.error && !result.redirectable) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-gray-900">
          Can&apos;t connect
        </h1>
        <p className="mt-2 text-sm text-gray-600">{result.error}</p>
      </Card>
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    const query = new URLSearchParams(params).toString();
    redirect(
      `/auth/signin?callbackUrl=${encodeURIComponent(`/oauth/authorize?${query}`)}`,
    );
  }

  if (session.user.role !== "admin") {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-gray-900">Admins only</h1>
        <p className="mt-2 text-sm text-gray-600">
          You&apos;re signed in as {session.user.email}. Only admin accounts can
          connect AI assistants to the dashboard.
        </p>
      </Card>
    );
  }

  const clientName = result.client?.clientName || "An AI assistant";
  const canWrite = result.params.scopes.includes("write");
  let redirectHost = "";
  try {
    redirectHost = new URL(result.params.redirectUri).host;
  } catch {}

  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Better Homes Studio admin
      </p>
      <h1 className="mt-2 text-xl font-semibold text-gray-900">
        Connect {clientName}?
      </h1>
      <p className="mt-3 text-sm text-gray-600">
        {clientName} will act as <strong>{session.user.email}</strong> and will
        be able to:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
        <li>Read all dashboard data: clients, projects, payments, quotes, CRM and more</li>
        {canWrite && (
          <li>
            Make changes as an admin, including creating and editing projects,
            tasks, payments and quotes, which can notify clients
          </li>
        )}
      </ul>
      <p className="mt-3 text-xs text-gray-500">
        You&apos;ll return to {redirectHost || "the assistant"}. You can
        disconnect at any time from Admin → AI agents.
      </p>
      <form method="POST" action="/api/oauth/authorize" className="mt-6 flex gap-3">
        {Object.entries(params).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <button
          type="submit"
          name="decision"
          value="deny"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          name="decision"
          value="approve"
          className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Allow access
        </button>
      </form>
    </Card>
  );
}
