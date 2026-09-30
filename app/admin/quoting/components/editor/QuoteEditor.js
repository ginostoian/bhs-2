"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Keyboard,
  Loader2,
  Mail,
  PencilLine,
  Redo2,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import QuoteView from "@/components/documents/QuoteView";
import { downloadPdf } from "@/libs/downloadPdf";
import { formatCurrency } from "@/libs/documentFormat";
import { calculateQuoteTotals } from "@/libs/quoteTerms";
import { validateForSending } from "@/libs/quoteService";
import CatalogueDrawer, { templateToSections } from "./CatalogueDrawer";
import DetailsPanel from "./DetailsPanel";
import NotesPanel from "./NotesPanel";
import QuoteSheet from "./QuoteSheet";
import RowDrawer from "./RowDrawer";
import SummaryPanel from "./SummaryPanel";
import {
  STATUS_META,
  blankItem,
  lineTotal,
  toPayload,
  toPreview,
} from "./quoteModel";
import useQuoteEditor from "./useQuoteEditor";
import { Button, Card, Menu, Modal, cx } from "./ui";

const isMac = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform);

const SHORTCUTS = [
  ["Arrows / Tab", "Move between cells"],
  ["Type, Enter or F2", "Edit the selected cell"],
  ["Enter", "Save and move down (adds a row after the last one)"],
  ["Shift+Enter", "New line inside a description"],
  ["Esc", "Cancel editing"],
  ["Delete", "Clear the cell"],
  ["=12*3.5", "Formulas work in Qty, Rate and Cost"],
  ["⌘/Ctrl + Enter", "Insert a row below"],
  ["⌘/Ctrl + D", "Duplicate the row"],
  ["⌘/Ctrl + ⌫", "Delete the row"],
  ["Alt + ↑ / ↓", "Move the row (also across sections)"],
  ["⌘/Ctrl + Z / ⇧Z", "Undo / redo"],
  ["⌘/Ctrl + S", "Save now"],
  ["⌘/Ctrl + V", "Paste rows from Excel or Google Sheets"],
];

function SaveIndicator({ saveState, onRetry }) {
  const { status, at, error } = saveState;
  if (status === "saving")
    return (
      <span className="flex items-center gap-1.5 text-xs text-[#7A807B]">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
      </span>
    );
  if (status === "error")
    return (
      <button
        type="button"
        onClick={onRetry}
        title={error}
        className="flex items-center gap-1.5 text-xs font-medium text-[#B42318]"
      >
        <AlertCircle className="h-3.5 w-3.5" /> Not saved — retry
      </button>
    );
  if (status === "dirty")
    return <span className="text-xs text-[#7A807B]">Unsaved changes…</span>;
  if (status === "new")
    return <span className="text-xs text-[#7A807B]">Not saved yet</span>;
  return (
    <span className="flex items-center gap-1.5 text-xs text-[#7A807B]">
      <Check className="h-3.5 w-3.5 text-[#2F6B3F]" />
      {at
        ? `Saved ${at.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
        : "All changes saved"}
    </span>
  );
}

export default function QuoteEditor({ initialQuote }) {
  const router = useRouter();
  const editor = useQuoteEditor(initialQuote, {
    // First save of a new quote: move the URL to its edit page without remounting
    onCreated: (saved) =>
      window.history.replaceState(null, "", `/admin/quoting/${saved._id}/edit`),
  });
  const { quote, edit, set, undo, redo, saveNow, saveState } = editor;

  const [mode, setMode] = useState("edit");
  const [showCosts, setShowCosts] = useState(() =>
    quote.services.some((s) => s.items?.some((i) => i.costPrice != null)),
  );
  const [catalogue, setCatalogue] = useState(null); // { s, tab }
  const [openRow, setOpenRow] = useState(null); // { s, i }
  const [dialog, setDialog] = useState(null); // "send" | "sent" | "delete" | "shortcuts"
  const [sendErrors, setSendErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  const status = STATUS_META[quote.status] || STATUS_META.draft;
  const publicUrl =
    quote.publicToken && typeof window !== "undefined"
      ? `${window.location.origin}/quotes/${quote.publicToken}`
      : null;
  const totals = useMemo(
    () =>
      calculateQuoteTotals({
        ...quote,
        services: quote.services.map((s) => ({
          ...s,
          items: (s.items || []).map((i) => ({ ...i, total: lineTotal(i) })),
        })),
      }),
    [quote],
  );

  // Global shortcuts: undo/redo/save (native undo still works inside inputs)
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if (key === "s") {
        e.preventDefault();
        saveNow().catch(() => {});
      } else if (!inField && key === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      } else if (!inField && key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, saveNow]);

  // ── Catalogue insertion ──────────────────────────────────────────────────
  const insertItems = useCallback(
    (items, category) => {
      const target = catalogue?.s;
      if (target !== null && target !== undefined && quote.services[target]) {
        const section = quote.services[target];
        // Replace a single untouched blank row instead of leaving it behind
        const onlyBlank =
          section.items.length === 1 &&
          !section.items[0].name &&
          !Number(section.items[0].unitPrice);
        if (onlyBlank) {
          edit({
            type: "setItems",
            s: target,
            items: items.map((i) => blankItem(i)),
          });
        } else {
          edit({
            type: "insertItems",
            s: target,
            at: section.items.length,
            items,
          });
        }
        return;
      }
      const name = category || "General";
      const existing = quote.services.findIndex(
        (s) => s.type !== "heading" && s.categoryName === name,
      );
      if (existing >= 0) {
        edit({
          type: "insertItems",
          s: existing,
          at: quote.services[existing].items.length,
          items,
        });
      } else {
        edit({ type: "addSection", kind: "category", name, items });
      }
    },
    [catalogue, quote.services, edit],
  );

  const insertTemplate = (template) => {
    const sections = templateToSections(template);
    // A fresh quote with just the empty starter section gets replaced
    const pristine =
      quote.services.length === 1 &&
      quote.services[0].items.every((i) => !i.name && !Number(i.unitPrice));
    if (pristine) edit({ type: "deleteSection", s: 0 });
    edit({ type: "addSections", sections });
    if (!quote.projectType || quote.projectType === "custom") {
      set(["projectType"], template.projectType || "custom");
    }
    toast.success(`Inserted “${template.name}”`);
  };

  const saveRowToCatalogue = async ({ s, i }) => {
    const section = quote.services[s];
    const item = section.items[i];
    try {
      const response = await fetch("/api/admin/quoting/template-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          category: section.categoryName || "General",
          unit: item.unit || "item",
          pricingType: "fixed",
          fixedPrice: Number(item.unitPrice) || 0,
          notes: item.notes,
          isActive: true,
        }),
      });
      if (!response.ok) throw new Error();
      toast.success(`“${item.name}” saved to the catalogue`);
    } catch {
      toast.error("Couldn't save to the catalogue");
    }
  };

  // ── Lifecycle actions ────────────────────────────────────────────────────
  const ensureSaved = async () => {
    if (!quote._id || editor.hasUnsaved()) return saveNow();
    return quote;
  };

  const changeStatus = async (next) => {
    setBusy(true);
    try {
      await ensureSaved();
      await saveNow({ status: next });
      toast.success(`Marked as ${STATUS_META[next].label.toLowerCase()}`);
      return true;
    } catch (error) {
      if (error.errors?.length) {
        setSendErrors(error.errors);
        setDialog("send");
      } else {
        toast.error(error.message);
      }
      return false;
    } finally {
      setBusy(false);
    }
  };

  const openSend = () => {
    setSendErrors(validateForSending(toPayload(quote)));
    setDialog("send");
  };

  const confirmSend = async () => {
    if (await changeStatus("sent")) setDialog("sent");
  };

  const copyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Client link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const downloadDraftPdf = async () => {
    setBusy(true);
    try {
      await downloadPdf(
        "/api/admin/quoting/pdf",
        `quote-${quote.quoteNumber || "draft"}.pdf`,
        { quote: toPreview(quote) },
      );
    } catch {
      toast.error("Couldn't generate the PDF");
    } finally {
      setBusy(false);
    }
  };

  const duplicate = async () => {
    setBusy(true);
    try {
      await ensureSaved();
      const response = await fetch(
        `/api/admin/quoting/${quote._id}/duplicate`,
        {
          method: "POST",
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      toast.success("Duplicated — you're now editing the copy");
      router.push(`/admin/quoting/${result.quote._id}/edit`);
    } catch (error) {
      toast.error(error.message || "Couldn't duplicate the quote");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!quote._id) {
      router.push("/admin/quoting/history");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/quoting/${quote._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      editor.load({ ...quote }); // clear the unsaved-changes guard
      toast.success("Quote deleted");
      router.push("/admin/quoting/history");
    } catch {
      toast.error("Couldn't delete the quote");
      setBusy(false);
    }
  };

  const mailtoHref = publicUrl
    ? `mailto:${encodeURIComponent(quote.client.email || "")}?subject=${encodeURIComponent(
        `Your quote from Better Homes – ${quote.title}`,
      )}&body=${encodeURIComponent(
        `Hi ${quote.client.name?.split(" ")[0] || ""},\n\nThank you for the opportunity to quote for your project. You can view the full quote here:\n${publicUrl}\n\nIt can also be downloaded as a PDF from that page. Any questions, just reply to this email.\n\nKind regards,\nBetter Homes`,
      )}`
    : null;

  const statusItems = Object.entries(STATUS_META)
    .filter(([key]) => key !== quote.status && key !== "pending")
    .map(([key, meta]) => ({
      label: `Mark as ${meta.label.toLowerCase()}`,
      onClick: () => (key === "sent" ? openSend() : changeStatus(key)),
    }));

  const rowSection = openRow && quote.services[openRow.s];
  const rowItem = rowSection?.items?.[openRow.i];

  return (
    <div className="-mx-4 -mt-6 sm:-mx-6 sm:-mt-8 lg:-mx-8">
      {/* ── Top bar ── */}
      <div className="z-[15] border-b border-[#D8D2C6] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:sticky lg:top-[72px] lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Link
            href="/admin/quoting/history"
            className="inline-flex h-9 w-9 items-center justify-center text-[#4A524D] hover:bg-[#F4F1EA]"
            aria-label="Back to quotes"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-[220px] flex-1">
            <div className="flex items-center gap-2 text-xs text-[#7A807B]">
              <span className="font-medium">
                {quote.quoteNumber
                  ? `Quote #${quote.quoteNumber}`
                  : "New quote"}
              </span>
              <span
                className={cx(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  status.className,
                )}
              >
                {status.label}
              </span>
              <SaveIndicator
                saveState={saveState}
                onRetry={() => saveNow().catch(() => {})}
              />
            </div>
            <input
              value={quote.title}
              onChange={(e) => set(["title"], e.target.value)}
              placeholder="Quote title, e.g. Rear extension & kitchen"
              aria-label="Quote title"
              className="mt-0.5 w-full !rounded-none border-0 bg-transparent p-0 text-xl font-semibold tracking-tight text-[#202925] outline-none placeholder:text-[#A3A8A4] focus:ring-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden text-right lg:block">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-[#7A807B]">
                Total inc. VAT
              </span>
              <span className="text-lg font-semibold tabular-nums">
                {formatCurrency(totals.total)}
              </span>
            </span>
            <div className="flex">
              <Button
                variant="ghost"
                onClick={undo}
                disabled={!editor.canUndo}
                title={`Undo (${isMac() ? "⌘" : "Ctrl+"}Z)`}
                aria-label="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={redo}
                disabled={!editor.canRedo}
                title="Redo"
                aria-label="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex border border-[#D8D2C6]" role="tablist">
              {[
                ["edit", "Edit", PencilLine],
                ["preview", "Client view", Eye],
              ].map(([key, label, Icon]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={mode === key}
                  onClick={() => setMode(key)}
                  className={cx(
                    "inline-flex h-9 items-center gap-1.5 px-3 text-sm font-medium",
                    mode === key
                      ? "bg-[#202925] text-white"
                      : "bg-white hover:bg-[#F4F1EA]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
            <Button
              onClick={downloadDraftPdf}
              disabled={busy}
              title="Download PDF"
            >
              <Download className="h-4 w-4" /> PDF
            </Button>
            {quote.status === "draft" ? (
              <Button variant="primary" onClick={openSend} disabled={busy}>
                <Send className="h-4 w-4" /> Send to client
              </Button>
            ) : (
              <Menu
                items={statusItems}
                trigger={({ toggle }) => (
                  <Button variant="primary" onClick={toggle} disabled={busy}>
                    {status.label} <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
              />
            )}
            <Menu
              label="More actions"
              items={[
                {
                  label: "Copy client link",
                  icon: Copy,
                  onClick: copyLink,
                  hidden: !publicUrl,
                },
                {
                  label: "Open client page",
                  icon: ExternalLink,
                  onClick: () => window.open(publicUrl, "_blank", "noopener"),
                  hidden: !publicUrl,
                },
                {
                  label: "Email the client",
                  icon: Mail,
                  onClick: () => (window.location.href = mailtoHref),
                  hidden: !mailtoHref,
                },
                {
                  label: "View analytics",
                  icon: BarChart3,
                  onClick: () =>
                    router.push(`/admin/quoting/${quote._id}/analytics`),
                  hidden: !quote._id || quote.status === "draft",
                },
                {
                  label: "Duplicate quote",
                  icon: Copy,
                  onClick: duplicate,
                  disabled: busy,
                },
                {
                  label: "Keyboard shortcuts",
                  icon: Keyboard,
                  onClick: () => setDialog("shortcuts"),
                },
                "divider",
                {
                  label: "Delete quote",
                  icon: Trash2,
                  danger: true,
                  onClick: () => setDialog("delete"),
                },
              ]}
              trigger={({ toggle }) => (
                <Button onClick={toggle} aria-label="More actions">
                  •••
                </Button>
              )}
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      {mode === "preview" ? (
        <div className="bg-[#EDE9E0]">
          <p className="px-4 pt-4 text-center text-xs text-[#7A807B]">
            This is exactly what the client sees (internal notes, costs and
            margins are hidden).
          </p>
          <QuoteView quote={toPreview(quote)} hideToolbar />
        </div>
      ) : (
        <div className="grid gap-4 px-4 py-5 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-4">
            <DetailsPanel quote={quote} set={set} />
            <section className="overflow-hidden rounded-lg border border-[#D8D2C6] bg-white">
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDE9E0] px-4 py-3">
                <p className="text-sm font-semibold">Line items</p>
                <button
                  type="button"
                  onClick={() => setDialog("shortcuts")}
                  className="inline-flex items-center gap-1.5 text-xs text-[#7A807B] hover:text-[#202925]"
                >
                  <Keyboard className="h-3.5 w-3.5" /> Shortcuts
                </button>
              </header>
              <QuoteSheet
                quote={quote}
                edit={edit}
                showCosts={showCosts}
                onOpenRow={setOpenRow}
                onOpenCatalogue={(s, tab = "services") =>
                  setCatalogue({ s, tab })
                }
                onSaveToCatalogue={saveRowToCatalogue}
              />
            </section>
            <NotesPanel quote={quote} set={set} />
          </div>

          <aside className="space-y-4 xl:sticky xl:top-[170px] xl:self-start">
            <SummaryPanel
              quote={quote}
              set={set}
              showCosts={showCosts}
              onToggleCosts={() => setShowCosts((v) => !v)}
            />
            {quote._id && quote.status !== "draft" && (
              <Card title="Client activity">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#7A807B]">Sent</dt>
                    <dd>
                      {quote.sentAt
                        ? new Date(quote.sentAt).toLocaleDateString("en-GB")
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#7A807B]">Views</dt>
                    <dd>{quote.viewCount || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#7A807B]">Last viewed</dt>
                    <dd>
                      {quote.lastViewed
                        ? new Date(quote.lastViewed).toLocaleDateString("en-GB")
                        : "—"}
                    </dd>
                  </div>
                </dl>
                {publicUrl && (
                  <Button className="mt-3 w-full" onClick={copyLink}>
                    <Copy className="h-4 w-4" /> Copy client link
                  </Button>
                )}
              </Card>
            )}
          </aside>
        </div>
      )}

      {/* ── Overlays ── */}
      {catalogue && (
        <CatalogueDrawer
          initialTab={catalogue.tab}
          targetName={
            catalogue.s !== null
              ? quote.services[catalogue.s]?.categoryName
              : null
          }
          onInsertItems={insertItems}
          onInsertTemplate={insertTemplate}
          onClose={() => setCatalogue(null)}
        />
      )}

      {rowItem && (
        <RowDrawer
          key={rowItem._key}
          item={rowItem}
          sectionName={rowSection.categoryName}
          onChange={(patch) =>
            edit({ type: "updateItem", s: openRow.s, i: openRow.i, patch })
          }
          onDelete={() => {
            edit({ type: "deleteItem", s: openRow.s, i: openRow.i });
            setOpenRow(null);
          }}
          onSaveToCatalogue={() => saveRowToCatalogue(openRow)}
          onClose={() => setOpenRow(null)}
        />
      )}

      {dialog === "send" && (
        <Modal
          title="Send to client"
          onClose={() => setDialog(null)}
          footer={
            <>
              <Button onClick={() => setDialog(null)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={confirmSend}
                disabled={busy || sendErrors.length > 0}
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Mark as sent & get link
              </Button>
            </>
          }
        >
          {sendErrors.length > 0 ? (
            <>
              <p className="mb-2 text-sm">A few things to fix first:</p>
              <ul className="space-y-1.5">
                {sendErrors.map((error) => (
                  <li
                    key={error}
                    className="flex items-start gap-2 text-sm text-[#B42318]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="space-y-3 text-sm">
              <p>
                This creates the client link for{" "}
                <strong>{quote.client.name}</strong> and records the quote as
                sent. You can keep editing afterwards — the link always shows
                the latest version.
              </p>
              <div className="flex justify-between rounded bg-[#F4F1EA] px-3 py-2">
                <span className="text-[#4A524D]">Total inc. VAT</span>
                <span className="font-semibold tabular-nums">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>
          )}
        </Modal>
      )}

      {dialog === "sent" && (
        <Modal
          title="Quote ready to share"
          onClose={() => setDialog(null)}
          footer={
            <Button variant="primary" onClick={() => setDialog(null)}>
              Done
            </Button>
          }
        >
          <p className="mb-3 text-sm">
            Share this link with {quote.client.name}:
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={publicUrl || ""}
              className="min-w-0 flex-1 border border-[#D8D2C6] bg-[#F4F1EA] px-2.5 py-2 text-sm"
              onFocus={(e) => e.target.select()}
            />
            <Button onClick={copyLink}>
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {mailtoHref && (
              <a
                href={mailtoHref}
                className="inline-flex h-9 items-center gap-1.5 border border-[#D8D2C6] px-3 text-sm font-medium hover:bg-[#F4F1EA]"
              >
                <Mail className="h-4 w-4" /> Email the client
              </a>
            )}
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 border border-[#D8D2C6] px-3 text-sm font-medium hover:bg-[#F4F1EA]"
              >
                <ExternalLink className="h-4 w-4" /> Open client page
              </a>
            )}
          </div>
        </Modal>
      )}

      {dialog === "delete" && (
        <Modal
          title="Delete this quote?"
          onClose={() => setDialog(null)}
          footer={
            <>
              <Button onClick={() => setDialog(null)}>Cancel</Button>
              <Button variant="danger" onClick={remove} disabled={busy}>
                <Trash2 className="h-4 w-4" /> Delete permanently
              </Button>
            </>
          }
        >
          <p className="text-sm">
            {quote.status === "draft"
              ? "The draft will be removed. This can't be undone."
              : "The client link will stop working and the quote's view history is lost. This can't be undone."}
          </p>
        </Modal>
      )}

      {dialog === "shortcuts" && (
        <Modal title="Keyboard shortcuts" wide onClose={() => setDialog(null)}>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
            {SHORTCUTS.map(([keys, what]) => (
              <div key={keys} className="contents">
                <dt>
                  <kbd className="rounded border border-[#D8D2C6] bg-[#F4F1EA] px-1.5 py-0.5 font-mono text-xs">
                    {keys}
                  </kbd>
                </dt>
                <dd className="text-[#4A524D]">{what}</dd>
              </div>
            ))}
          </dl>
        </Modal>
      )}
    </div>
  );
}
