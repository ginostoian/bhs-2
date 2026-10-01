"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Copy,
  ExternalLink,
  FileText,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/libs/api";
import {
  Badge,
  EmptyState,
  cx,
  formatCurrency,
  formatShortDate,
  relativeDays,
} from "@/components/admin/ui";
import { DataTable, FilterBar, Tabs } from "@/components/admin/interactive";

const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-[#4A524D] hover:bg-[#F4F1EA] hover:text-[#202925] disabled:opacity-40";

export default function InvoicesTable({ invoices: initial = [] }) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initial);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(null);

  const groups = useMemo(
    () => ({
      all: invoices,
      outstanding: invoices.filter((i) => i.status === "sent"),
      overdue: invoices.filter((i) => i.overdue),
      draft: invoices.filter((i) => i.status === "draft"),
      paid: invoices.filter((i) => i.status === "paid"),
    }),
    [invoices],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = groups[tab] || invoices;
    if (!q) return list;
    return list.filter((i) =>
      [i.invoiceNumber, i.title, i.clientName, i.clientEmail, i.project?.name]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q)),
    );
  }, [groups, tab, search, invoices]);

  const setStatus = async (invoice, status) => {
    setBusy(invoice.id);
    try {
      await apiClient.put(`/admin/invoicing/${invoice.id}`, { status });
      setInvoices((list) =>
        list.map((i) =>
          i.id === invoice.id
            ? {
                ...i,
                status,
                overdue: status === "paid" ? false : i.overdue,
                paymentDate:
                  status === "paid"
                    ? i.paymentDate || new Date().toISOString()
                    : i.paymentDate,
              }
            : i,
        ),
      );
      toast.success(`${invoice.invoiceNumber} marked ${status}`);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Could not update the invoice");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (invoice) => {
    if (
      !window.confirm(
        `Delete ${invoice.invoiceNumber}? This permanently removes the invoice and its public link.`,
      )
    )
      return;
    setBusy(invoice.id);
    try {
      await apiClient.delete(`/admin/invoicing/${invoice.id}`);
      setInvoices((list) => list.filter((i) => i.id !== invoice.id));
      toast.success("Invoice deleted");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Could not delete the invoice");
    } finally {
      setBusy(null);
    }
  };

  const copyLink = async (invoice) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/invoices/${invoice.publicToken}`,
      );
      toast.success("Public link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const tabs = [
    ["all", "All"],
    ["outstanding", "Outstanding"],
    ["overdue", "Overdue"],
    ["draft", "Drafts"],
    ["paid", "Paid"],
  ].map(([value, label]) => ({ value, label, count: groups[value].length }));

  return (
    <section className="rounded-lg border border-[#D8D2C6] bg-white">
      <Tabs items={tabs} value={tab} onChange={setTab} className="px-3" />
      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search number, client, project"
        right={
          <span className="text-xs text-[#7A807B]">
            {rows.length} invoice{rows.length === 1 ? "" : "s"}
          </span>
        }
      />
      <DataTable
        rows={rows}
        getRowKey={(i) => i.id}
        rowHref={(i) => `/admin/invoicing/${i.id}/preview`}
        initialSort={{ key: "issueDate", dir: "desc" }}
        empty={
          <EmptyState
            icon={FileText}
            title={search ? "No matching invoices" : "No invoices here"}
            description={
              search ? "Try a different search." : "Nothing in this view yet."
            }
          />
        }
        columns={[
          {
            header: "Invoice",
            key: "invoiceNumber",
            primary: true,
            render: (i) => (
              <div className="min-w-0">
                <div className="font-medium tabular-nums">
                  {i.invoiceNumber}
                </div>
                <div className="truncate text-xs text-[#7A807B]">
                  {i.title}
                  {i.fromPaymentPlan && " · payment plan"}
                </div>
              </div>
            ),
          },
          {
            header: "Client",
            key: "clientName",
            render: (i) => (
              <div className="min-w-0">
                {i.userId ? (
                  <Link
                    href={`/admin/users/${i.userId}`}
                    className="font-medium hover:underline"
                  >
                    {i.clientName || i.clientEmail}
                  </Link>
                ) : (
                  <span>{i.clientName || i.clientEmail || "—"}</span>
                )}
                {i.project ? (
                  <Link
                    href={`/admin/projects/${i.project.id}`}
                    className="block truncate text-xs text-[#7A807B] hover:underline"
                  >
                    {i.project.name}
                  </Link>
                ) : i.leadId ? (
                  <Link
                    href={`/admin/crm?lead=${i.leadId}`}
                    className="block text-xs text-[#7A807B] hover:underline"
                  >
                    From CRM lead
                  </Link>
                ) : null}
              </div>
            ),
          },
          {
            header: "Status",
            key: "status",
            render: (i) => (
              <span className="inline-flex flex-wrap gap-1">
                <Badge status={i.status} className="capitalize">
                  {i.status}
                </Badge>
                {i.overdue && <Badge tone="bad">Overdue</Badge>}
              </span>
            ),
          },
          {
            header: "Issued",
            key: "issueDate",
            hideOnMobile: true,
            render: (i) => formatShortDate(i.issueDate),
          },
          {
            header: "Due / paid",
            sortValue: (i) => i.paymentDate || i.dueDate || "",
            render: (i) =>
              i.status === "paid" ? (
                <span className="text-[#2F6B3F]">
                  Paid {formatShortDate(i.paymentDate)}
                </span>
              ) : i.dueDate ? (
                <span
                  className={cx(
                    "whitespace-nowrap",
                    i.overdue && "font-semibold text-[#B42318]",
                  )}
                >
                  {formatShortDate(i.dueDate)}
                  <span className="block text-xs font-normal text-[#7A807B]">
                    {relativeDays(i.dueDate)}
                  </span>
                </span>
              ) : (
                <span className="text-[#A3A8A4]">No due date</span>
              ),
          },
          {
            header: "Total",
            key: "total",
            align: "right",
            render: (i) => (
              <span className="tabular-nums">{formatCurrency(i.total)}</span>
            ),
          },
          {
            header: "",
            sortable: false,
            hideOnMobile: true,
            render: (i) => (
              <div className="flex justify-end gap-0.5">
                {i.status === "draft" && (
                  <button
                    type="button"
                    className={iconButton}
                    title="Mark as sent"
                    aria-label="Mark as sent"
                    disabled={busy === i.id}
                    onClick={() => setStatus(i, "sent")}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
                {i.status === "sent" && (
                  <button
                    type="button"
                    className={iconButton}
                    title="Mark as paid"
                    aria-label="Mark as paid"
                    disabled={busy === i.id}
                    onClick={() => setStatus(i, "paid")}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                {i.publicToken && i.status !== "draft" && (
                  <>
                    <button
                      type="button"
                      className={iconButton}
                      title="Copy client link"
                      aria-label="Copy client link"
                      onClick={() => copyLink(i)}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={`/invoices/${i.publicToken}`}
                      target="_blank"
                      rel="noreferrer"
                      className={iconButton}
                      title="Open client view"
                      aria-label="Open client view"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </>
                )}
                <Link
                  href={`/admin/invoicing/${i.id}/edit`}
                  className={iconButton}
                  title="Edit"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                {i.status === "draft" && (
                  <button
                    type="button"
                    className={cx(iconButton, "hover:text-[#B42318]")}
                    title="Delete"
                    aria-label="Delete"
                    disabled={busy === i.id}
                    onClick={() => remove(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
