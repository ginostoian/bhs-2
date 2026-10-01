import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Lead from "@/models/Lead";
import Project from "@/models/Project";
import Quote from "@/models/Quote";
import Invoice from "@/models/Invoice";
import Employee from "@/models/Employee";
import { Ticket } from "@/models/index.js";

export const dynamic = "force-dynamic";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PER_TYPE = 5;

// GET /api/admin/search?q= — one search box across the main records
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim() || "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  await connectMongo();
  const rx = { $regex: escapeRegex(q.slice(0, 80)), $options: "i" };
  const id = (doc) => String(doc._id);

  const [users, leads, projects, quotes, invoices, tickets, employees] =
    await Promise.all([
      User.find({
        $or: [{ name: rx }, { email: rx }, { phone: rx }, { address: rx }],
      })
        .select("name email role")
        .limit(PER_TYPE)
        .lean(),
      Lead.find({
        $or: [
          { name: rx },
          { email: rx },
          { phone: rx },
          { postcode: rx },
          { address: rx },
        ],
      })
        .select("name email stage isArchived")
        .sort({ createdAt: -1 })
        .limit(PER_TYPE)
        .lean(),
      Project.find({ $or: [{ name: rx }, { location: rx }] })
        .select("name status location")
        .limit(PER_TYPE)
        .lean(),
      Quote.find({
        $or: [
          { quoteNumber: rx },
          { title: rx },
          { "client.name": rx },
          { "client.email": rx },
          { projectAddress: rx },
        ],
      })
        .select("quoteNumber title status client.name")
        .sort({ createdAt: -1 })
        .limit(PER_TYPE)
        .lean(),
      Invoice.find({
        $or: [
          { invoiceNumber: rx },
          { title: rx },
          { "client.name": rx },
          { "client.email": rx },
        ],
      })
        .select("invoiceNumber title status client.name")
        .sort({ createdAt: -1 })
        .limit(PER_TYPE)
        .lean(),
      Ticket.find({ $or: [{ ticketNumber: rx }, { title: rx }] })
        .select("ticketNumber title status")
        .sort({ createdAt: -1 })
        .limit(PER_TYPE)
        .lean(),
      Employee.find({ $or: [{ name: rx }, { email: rx }, { position: rx }] })
        .select("name position")
        .limit(PER_TYPE)
        .lean(),
    ]);

  const results = [
    ...users.map((u) => ({
      type: u.role === "user" || !u.role ? "Client" : "User",
      id: id(u),
      title: u.name || u.email,
      subtitle:
        u.role && u.role !== "user" ? `${u.email} · ${u.role}` : u.email,
      href: `/admin/users/${id(u)}`,
    })),
    ...leads.map((l) => ({
      type: "Lead",
      id: id(l),
      title: l.name,
      subtitle: [l.stage, l.isArchived ? "archived" : null, l.email]
        .filter(Boolean)
        .join(" · "),
      href: `/admin/crm?lead=${id(l)}`,
    })),
    ...projects.map((p) => ({
      type: "Project",
      id: id(p),
      title: p.name,
      subtitle: [p.status, p.location].filter(Boolean).join(" · "),
      href: `/admin/projects/${id(p)}`,
    })),
    ...quotes.map((x) => ({
      type: "Quote",
      id: id(x),
      title: x.title || `Quote #${x.quoteNumber}`,
      subtitle: `#${x.quoteNumber} · ${x.status} · ${x.client?.name || ""}`,
      href: `/admin/quoting/${id(x)}/edit`,
    })),
    ...invoices.map((x) => ({
      type: "Invoice",
      id: id(x),
      title: x.title || x.invoiceNumber,
      subtitle: `${x.invoiceNumber} · ${x.status} · ${x.client?.name || ""}`,
      href: `/admin/invoicing/${id(x)}/preview`,
    })),
    ...tickets.map((t) => ({
      type: "Ticket",
      id: id(t),
      title: t.title,
      subtitle: `${t.ticketNumber} · ${t.status}`,
      href: `/admin/tickets/${id(t)}`,
    })),
    ...employees.map((e) => ({
      type: "Team",
      id: id(e),
      title: e.name,
      subtitle: e.position,
      href: `/admin/employees/${id(e)}`,
    })),
  ];

  return NextResponse.json({ results });
}
