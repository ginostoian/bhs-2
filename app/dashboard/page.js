import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import Document from "@/models/Document";
import Quote from "@/models/Quote";
import Invoice from "@/models/Invoice";
import Payment from "@/models/Payment";
import ProjectChange from "@/models/ProjectChange";
import Ticket from "@/models/Ticket";
import ClientOverview, {
  formatClientDate,
} from "@/components/client-portal/ClientOverview";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const userId = session.user.id;
  const selectedProjectId = cookies().get("selectedProjectId")?.value;
  const projects = await Project.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();
  const selectedProject =
    projects.find((project) => project._id.toString() === selectedProjectId) ||
    projects[0] ||
    null;
  const projectFilter = selectedProject ? { project: selectedProject._id } : {};

  const [
    legacyDocuments,
    quotes,
    invoices,
    upcomingPayment,
    openChange,
    openTicket,
  ] = await Promise.all([
    Document.find({
      user: userId,
      type: { $in: ["quote", "invoice"] },
      ...projectFilter,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Quote.find({ linkedUser: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title quoteNumber status createdAt")
      .lean(),
    Invoice.find({ linkedUser: userId, ...projectFilter })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title invoiceNumber status createdAt")
      .lean(),
    Payment.findOne({
      user: userId,
      status: { $ne: "Paid" },
      ...projectFilter,
    })
      .sort({ dueDate: 1 })
      .lean(),
    ProjectChange.findOne({
      user: userId,
      status: "Review",
      ...projectFilter,
    })
      .sort({ requestedDate: -1 })
      .lean(),
    Ticket.findOne({
      user: userId,
      status: { $nin: ["Resolved", "Closed"] },
      ...projectFilter,
    })
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  const recentDocuments = [
    ...legacyDocuments.map((document) => ({
      id: document._id.toString(),
      title:
        document.type === "invoice" ? "Archived invoice" : "Archived quote",
      detail: `Added ${formatClientDate(document.createdAt)}`,
      href: "/dashboard/quote-archive",
      createdAt: document.createdAt,
    })),
    ...quotes.map((quote) => ({
      id: quote._id.toString(),
      title: quote.title || quote.quoteNumber || "Quote",
      detail: `${quote.quoteNumber || "Quote"} · ${quote.status || "Draft"}`,
      href: "/dashboard/quotes",
      createdAt: quote.createdAt,
    })),
    ...invoices.map((invoice) => ({
      id: invoice._id.toString(),
      title: invoice.title || invoice.invoiceNumber || "Invoice",
      detail: `${invoice.invoiceNumber || "Invoice"} · ${invoice.status || "Draft"}`,
      href: "/dashboard/invoices",
      createdAt: invoice.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const openRequest = openChange
    ? {
        type: "change",
        title: openChange.name,
        detail: `Project change · requested ${formatClientDate(openChange.requestedDate)}`,
        href: "/dashboard/changes",
      }
    : openTicket
      ? {
          type: "ticket",
          title: openTicket.title,
          detail: `${openTicket.ticketNumber} · ${openTicket.status}`,
          href: `/dashboard/tickets/${openTicket._id.toString()}`,
        }
      : null;

  return (
    <ClientOverview
      firstName={(session.user.name || "there").split(" ")[0]}
      project={selectedProject}
      recentDocuments={recentDocuments}
      upcomingPayment={upcomingPayment}
      openRequest={openRequest}
    />
  );
}
