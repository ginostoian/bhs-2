"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Loader2, Search } from "lucide-react";

// ⌘K / Ctrl+K search across clients, leads, projects, quotes, invoices,
// tickets and team, plus quick actions.

const QUICK_ACTIONS = [
  {
    type: "Action",
    id: "new-quote",
    title: "New quote",
    subtitle: "Open the quote builder",
    href: "/admin/quoting/create",
  },
  {
    type: "Action",
    id: "new-invoice",
    title: "New invoice",
    href: "/admin/invoicing/create",
  },
  { type: "Action", id: "crm", title: "CRM pipeline", href: "/admin/crm" },
  {
    type: "Action",
    id: "reports",
    title: "Business reports",
    href: "/admin/reports",
  },
  {
    type: "Action",
    id: "projects",
    title: "Projects on site",
    href: "/admin/projects",
  },
  {
    type: "Action",
    id: "payments",
    title: "Payment schedules",
    href: "/admin/payments",
  },
  {
    type: "Action",
    id: "tickets",
    title: "Support tickets",
    href: "/admin/tickets",
  },
];

const TYPE_ORDER = [
  "Action",
  "Client",
  "Lead",
  "Project",
  "Quote",
  "Invoice",
  "Ticket",
  "Team",
  "User",
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Global shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/admin/search?q=${encodeURIComponent(q)}`,
          { signal: controller.signal },
        );
        const data = response.ok ? await response.json() : { results: [] };
        setResults(data.results || []);
        setActive(0);
      } catch (error) {
        if (error.name !== "AbortError") setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const actions =
      q.length < 2
        ? QUICK_ACTIONS
        : QUICK_ACTIONS.filter((a) => a.title.toLowerCase().includes(q));
    return [...actions, ...results].sort(
      (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type),
    );
  }, [results, query]);

  const go = useCallback(
    (item, newTab) => {
      if (!item) return;
      setOpen(false);
      if (newTab) window.open(item.href, "_blank");
      else router.push(item.href);
    },
    [router],
  );

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(items[active], e.metaKey || e.ctrlKey);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-[#D8D2C6] bg-white px-2.5 text-sm text-[#7A807B] hover:border-[#4D5B4B] hover:text-[#202925] sm:w-56"
        aria-label="Search (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
        <span className="hidden flex-1 text-left sm:inline">Search…</span>
        <kbd className="hidden rounded border border-[#D8D2C6] bg-[#F4F1EA] px-1.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-[#202925]/40 px-3 pt-[10vh]"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-[0_16px_48px_rgba(32,41,37,0.25)]"
          >
            <div className="flex items-center gap-2 border-b border-[#EDE9E0] px-4">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#7A807B]" />
              ) : (
                <Search className="h-4 w-4 text-[#7A807B]" />
              )}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search clients, leads, projects, quotes, invoices…"
                aria-label="Search"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-results"
                aria-activedescendant={
                  items[active] ? `cmd-${active}` : undefined
                }
                className="h-12 w-full !rounded-none !border-0 bg-transparent text-[15px] !shadow-none outline-none placeholder:text-[#A3A8A4] focus:!ring-0"
              />
              <kbd className="rounded border border-[#D8D2C6] px-1.5 text-[10px] text-[#7A807B]">
                Esc
              </kbd>
            </div>
            <ul
              id="command-results"
              role="listbox"
              ref={listRef}
              className="max-h-[60vh] overflow-y-auto py-2"
            >
              {items.length === 0 && query.trim().length >= 2 && !loading && (
                <li className="px-4 py-6 text-center text-sm text-[#7A807B]">
                  No matches for “{query}”.
                </li>
              )}
              {items.map((item, index) => {
                const showHeading =
                  index === 0 || items[index - 1].type !== item.type;
                return (
                  <li key={`${item.type}-${item.id}`} role="presentation">
                    {showHeading && (
                      <p className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A65B43]">
                        {item.type === "Action" ? "Go to" : `${item.type}s`}
                      </p>
                    )}
                    <button
                      type="button"
                      id={`cmd-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={index === active}
                      onMouseEnter={() => setActive(index)}
                      onClick={(e) => go(item, e.metaKey || e.ctrlKey)}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left ${index === active ? "bg-[#F4F1EA]" : ""}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-[#202925]">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="block truncate text-xs text-[#7A807B]">
                            {item.subtitle}
                          </span>
                        )}
                      </span>
                      {index === active && (
                        <CornerDownLeft className="h-4 w-4 shrink-0 text-[#A3A8A4]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="flex gap-4 border-t border-[#EDE9E0] px-4 py-2 text-[11px] text-[#A3A8A4]">
              <span>↑↓ to move</span>
              <span>↵ to open</span>
              <span>⌘↵ new tab</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
