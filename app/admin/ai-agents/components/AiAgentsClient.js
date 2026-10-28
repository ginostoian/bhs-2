"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

function Section({ title, description, children, action }) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function CopyField({ value }) {
  return (
    <div className="flex items-center gap-2">
      <code className="min-w-0 flex-1 truncate rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800">
        {value}
      </code>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value);
          toast.success("Copied");
        }}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Copy
      </button>
    </div>
  );
}

export default function AiAgentsClient() {
  const [origin, setOrigin] = useState("");
  const [data, setData] = useState({ tokens: [], connections: [] });
  const [activity, setActivity] = useState({ entries: [], pagination: {} });
  const [writesOnly, setWritesOnly] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [newToken, setNewToken] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    const [connRes, auditRes] = await Promise.all([
      fetch("/api/admin/mcp"),
      fetch(`/api/admin/mcp/audit?limit=50&writesOnly=${writesOnly}`),
    ]);
    if (connRes.ok) setData(await connRes.json());
    if (auditRes.ok) setActivity(await auditRes.json());
  }, [writesOnly]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mcpUrl = `${origin}/api/mcp`;

  const createToken = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/mcp/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tokenName,
        scopes: readOnly ? ["read"] : ["read", "write"],
      }),
    });
    const body = await res.json();
    if (!res.ok) {
      toast.error(body.error || "Could not create token");
      return;
    }
    setNewToken(body.token);
    setTokenName("");
    load();
  };

  const revoke = async (id, label) => {
    if (!confirm(`Revoke access for "${label}"? It will stop working immediately.`)) {
      return;
    }
    const res = await fetch(`/api/admin/mcp/tokens/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Access revoked");
      load();
    } else {
      toast.error("Could not revoke");
    }
  };

  const desktopConfig = JSON.stringify(
    {
      mcpServers: {
        "bhs-admin": {
          command: "npx",
          args: [
            "-y",
            "mcp-remote",
            mcpUrl,
            "--header",
            "Authorization:Bearer ${BHS_TOKEN}",
          ],
          env: { BHS_TOKEN: newToken || "<your token>" },
        },
      },
    },
    null,
    2,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">AI agents</h1>
        <p className="text-gray-600">
          Connect Claude, ChatGPT or other AI assistants so they can read
          dashboard data and take actions for you: create projects and tasks,
          manage payment plans, build quotes, update the CRM and more.
        </p>
      </div>

      <Section
        title="Connect an assistant"
        description="Add this URL as a custom connector. You'll be asked to sign in and approve access."
      >
        <CopyField value={mcpUrl} />
        <div className="mt-4 grid gap-4 text-sm text-gray-700 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-medium text-gray-900">Claude (web, desktop, mobile)</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Settings → Connectors → Add custom connector</li>
              <li>Name it &quot;Better Homes admin&quot; and paste the URL</li>
              <li>Click Connect, sign in here and choose Allow access</li>
            </ol>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-medium text-gray-900">ChatGPT</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Settings → Apps &amp; Connectors → Advanced → turn on Developer mode</li>
              <li>Create a connector, paste the URL, authentication: OAuth</li>
              <li>Sign in here and choose Allow access</li>
            </ol>
          </div>
        </div>
      </Section>

      <Section
        title="Connected assistants"
        description="Assistants connected through sign-in. Disconnecting stops them immediately."
      >
        {data.connections.length === 0 ? (
          <p className="text-sm text-gray-500">No assistants connected yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {data.connections.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{c.clientName}</p>
                  <p className="text-gray-500">
                    As {c.user?.email} · {c.scopes.includes("write") ? "Read & write" : "Read only"} · Last used {formatDate(c.lastUsedAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => revoke(c.id, c.clientName)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Disconnect
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Personal access tokens"
        description="For Claude Code, Claude Desktop config files, scripts and other tools that take a bearer token."
      >
        <form onSubmit={createToken} className="flex flex-wrap items-center gap-3">
          <input
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="Token name, e.g. Claude Desktop laptop"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={readOnly}
              onChange={(e) => setReadOnly(e.target.checked)}
            />
            Read only
          </label>
          <button
            type="submit"
            disabled={!tokenName.trim()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Create token
          </button>
        </form>

        {newToken && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
            <p className="font-medium text-amber-900">
              Copy this token now. It won&apos;t be shown again.
            </p>
            <div className="mt-2">
              <CopyField value={newToken} />
            </div>
            <p className="mt-4 font-medium text-gray-900">Claude Code</p>
            <div className="mt-1">
              <CopyField
                value={`claude mcp add --transport http bhs-admin ${mcpUrl} --header "Authorization: Bearer ${newToken}"`}
              />
            </div>
            <p className="mt-4 font-medium text-gray-900">
              Claude Desktop (claude_desktop_config.json)
            </p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">
              {desktopConfig}
            </pre>
          </div>
        )}

        {data.tokens.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-100">
            {data.tokens.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {t.name} <span className="font-mono text-xs text-gray-400">{t.prefix}…</span>
                  </p>
                  <p className="text-gray-500">
                    {t.user?.email} · {t.scopes.includes("write") ? "Read & write" : "Read only"} · Last used {formatDate(t.lastUsedAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => revoke(t.id, t.name)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Activity"
        description="Every action an assistant has taken, most recent first."
        action={
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={writesOnly}
              onChange={(e) => setWritesOnly(e.target.checked)}
            />
            Changes only
          </label>
        }
      >
        {activity.entries.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">When</th>
                  <th className="py-2 pr-4 font-medium">Assistant</th>
                  <th className="py-2 pr-4 font-medium">Action</th>
                  <th className="py-2 pr-4 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activity.entries.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                    className="cursor-pointer align-top hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap py-2 pr-4 text-gray-500">
                      {formatDate(e.createdAt)}
                    </td>
                    <td className="py-2 pr-4 text-gray-700">
                      {e.clientName}
                      <div className="text-xs text-gray-400">{e.user?.email}</div>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={e.readOnly ? "text-gray-700" : "font-medium text-gray-900"}>
                        {e.tool}
                      </span>
                      {e.path && (
                        <div className="text-xs text-gray-400">
                          {e.method} {e.path}
                        </div>
                      )}
                      {expanded === e.id && (
                        <pre className="mt-2 max-w-xl whitespace-pre-wrap break-all rounded bg-gray-100 p-2 text-xs text-gray-700">
                          {e.input}
                          {e.error ? `\n\nError: ${e.error}` : ""}
                        </pre>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          e.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {e.ok ? "OK" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}
