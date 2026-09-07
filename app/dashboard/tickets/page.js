"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  LoaderCircle,
  Paperclip,
  Plus,
  Search,
  TicketCheck,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { useProject } from "../components/ProjectContext";
import {
  ClientEmptyState,
  ClientPageHeader,
  ClientPrimaryLink,
} from "@/components/client-portal/ClientPage";

const STATUS_OPTIONS = [
  "New",
  "In Progress",
  "Waiting for Customer",
  "Scheduled",
  "Resolved",
  "Closed",
];

function statusStyles(status) {
  if (status === "Resolved" || status === "Closed") {
    return "border-[#b8d9c5] bg-[#edf8f1] text-[#267448]";
  }
  if (status === "Waiting for Customer") {
    return "border-[#edd5aa] bg-[#fff8e9] text-[#8a6118]";
  }
  return "border-[#c9d6f7] bg-[#f0f4ff] text-[#2455b8]";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function TicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { selectedProject } = useProject();
  const selectedProjectId = selectedProject?.id;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    ticketId: null,
    ticketTitle: "",
  });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedProjectId
        ? `/api/tickets?project=${selectedProjectId}`
        : "/api/tickets";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchTickets();
  }, [fetchTickets, router, session, status]);

  const deleteTicket = async (ticketId) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete ticket");
      }
      toast.success("Ticket deleted");
      await fetchTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error(error.message || "Failed to delete ticket");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const query = searchTerm.toLowerCase();
    const matchesFilter = filter === "all" || ticket.status === filter;
    const matchesSearch =
      ticket.title.toLowerCase().includes(query) ||
      ticket.ticketNumber.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  if (status === "loading") {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <LoaderCircle className="h-7 w-7 animate-spin text-[#4D5B4B]" />
      </div>
    );
  }

  return (
    <>
      <ClientPageHeader
        title="Support"
        description="Ask a question, report an issue or follow a warranty request from one place."
        meta={{ label: "Total tickets", value: tickets.length }}
        action={
          <ClientPrimaryLink href="/dashboard/tickets/new">
            <Plus aria-hidden="true" className="h-4 w-4" />
            New ticket
          </ClientPrimaryLink>
        }
      />

      <div className="mb-6 flex flex-col gap-3 border border-[#D8D2C6] bg-[#F4F1EA] p-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search tickets</span>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7c8682]"
          />
          <input
            type="search"
            placeholder="Search tickets"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-11 w-full rounded-md border border-[#d8d4ca] bg-white pl-10 pr-3 text-sm text-[#202925] outline-none placeholder:text-[#9aa19e] focus:border-[#4D5B4B] focus:ring-2 focus:ring-[#4D5B4B]/15"
          />
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-11 w-full rounded-md border border-[#d8d4ca] bg-white px-3 text-sm text-[#43504b] outline-none focus:border-[#4D5B4B] focus:ring-2 focus:ring-[#4D5B4B]/15 sm:w-[220px]"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="flex min-h-[260px] items-center justify-center border border-[#D8D2C6] bg-[#F4F1EA]">
          <LoaderCircle className="h-6 w-6 animate-spin text-[#4D5B4B]" />
        </div>
      ) : filteredTickets.length ? (
        <ul className="divide-y divide-[#D8D2C6] border-y border-[#D8D2C6] bg-[#F4F1EA]">
          {filteredTickets.map((ticket) => (
            <li key={ticket._id} className="flex items-stretch">
              <Link
                href={`/dashboard/tickets/${ticket._id}`}
                className="group flex min-w-0 flex-1 flex-col gap-4 px-4 py-5 text-[#202925] hover:bg-[#f5f3ed] hover:text-[#202925] sm:flex-row sm:items-center sm:px-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#EDE9E0] text-[#43504b]">
                  <TicketCheck
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={1.6}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#202925]">
                    {ticket.title}
                  </span>
                  <span className="mt-1 block text-xs text-[#4D5B4B]">
                    {ticket.ticketNumber} · {ticket.category} · Created{" "}
                    {formatDate(ticket.createdAt)}
                  </span>
                  {ticket.description ? (
                    <span className="mt-2 line-clamp-1 block text-xs text-[#7c8682]">
                      {ticket.description}
                    </span>
                  ) : null}
                </span>
                {ticket.attachments?.length ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-[#4D5B4B]">
                    <Paperclip aria-hidden="true" className="h-3.5 w-3.5" />
                    {ticket.attachments.length}
                  </span>
                ) : null}
                <span
                  className={`inline-flex min-h-7 w-fit shrink-0 items-center rounded-full border px-2.5 text-[11px] font-semibold ${statusStyles(ticket.status)}`}
                >
                  {ticket.status}
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="hidden h-4 w-4 shrink-0 text-[#9aa19e] transition-transform group-hover:translate-x-0.5 sm:block"
                />
              </Link>
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({
                    isOpen: true,
                    ticketId: ticket._id,
                    ticketTitle: ticket.title || ticket.ticketNumber,
                  })
                }
                className="flex w-12 shrink-0 items-center justify-center text-[#9a554d] transition-colors hover:bg-[#fff3f1] hover:text-[#b3342a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b3342a]"
                aria-label={`Delete ${ticket.title}`}
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ClientEmptyState
          icon={TicketCheck}
          title="No tickets found"
          description={
            searchTerm || filter !== "all"
              ? "Try adjusting your search or status filter."
              : "Create a ticket when you need help from the Better Homes team."
          }
          action={
            !searchTerm && filter === "all" ? (
              <ClientPrimaryLink href="/dashboard/tickets/new">
                Create your first ticket
              </ClientPrimaryLink>
            ) : null
          }
        />
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, ticketId: null, ticketTitle: "" })
        }
        onConfirm={async () => {
          if (deleteModal.ticketId) await deleteTicket(deleteModal.ticketId);
          setDeleteModal({ isOpen: false, ticketId: null, ticketTitle: "" });
        }}
        title="Delete ticket"
        message={`Are you sure you want to delete "${deleteModal.ticketTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="confirm"
      />
    </>
  );
}
