import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Project from "@/models/Project";
import Lead from "@/models/Lead";
import Quote from "@/models/Quote";
import User from "@/models/User";

export const dynamic = "force-dynamic";

const idOrNull = (value) => value ? String(value) : null;

export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    if (!mongoose.isValidObjectId(params.projectId)) return NextResponse.json({ error: "Invalid project" }, { status: 400 });
    const project = await Project.findById(params.projectId).populate("user", "name email").lean();
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    const email = project.user?.email?.toLowerCase();
    const emailPattern = email ? new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") : null;
    const [leads, quotes, sourceLead, sourceQuote] = await Promise.all([
      Lead.find({ $or: [{ linkedUser: project.user._id }, { email: emailPattern }] })
        .select("name email stage linkedUser").sort({ createdAt: -1 }).limit(30).lean(),
      Quote.find({ $or: [{ linkedUser: project.user._id }, { "client.email": emailPattern }, { project: project._id }] })
        .select("quoteNumber title total status clientResponse linkedUser linkedLead project")
        .sort({ createdAt: -1 }).limit(30).lean(),
      project.sourceLead ? Lead.findById(project.sourceLead).select("name email stage linkedUser").lean() : null,
      project.sourceQuote ? Quote.findById(project.sourceQuote).select("quoteNumber title total status clientResponse linkedUser linkedLead project").lean() : null,
    ]);
    const quoteLeads = await Lead.find({ _id: { $in: quotes.map((quote) => quote.linkedLead).filter(Boolean) } })
      .select("name email stage linkedUser").lean();
    return NextResponse.json({ project: {
      sourceLead: project.sourceLead,
      sourceQuote: project.sourceQuote,
      handoverNotes: project.handoverNotes || "",
      remainingCostEstimate: project.remainingCostEstimate ?? null,
    }, leads: [...new Map([...leads, ...quoteLeads, ...(sourceLead ? [sourceLead] : [])]
      .filter((item) => !item.linkedUser || String(item.linkedUser) === String(project.user._id))
      .map((item) => [String(item._id), item])).values()],
    quotes: [...new Map([...quotes, ...(sourceQuote ? [sourceQuote] : [])]
      .filter((item) => (!item.project || String(item.project) === String(project._id)) &&
        (!item.linkedUser || String(item.linkedUser) === String(project.user._id)))
      .map((item) => [String(item._id), item])).values()] });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not load handover" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    await connectMongoose();
    const body = await req.json();
    const leadId = idOrNull(body.sourceLead);
    const quoteId = idOrNull(body.sourceQuote);
    if (!mongoose.isValidObjectId(params.projectId) ||
      (leadId && !mongoose.isValidObjectId(leadId)) ||
      (quoteId && !mongoose.isValidObjectId(quoteId))) {
      return NextResponse.json({ error: "Invalid record link" }, { status: 400 });
    }
    const remaining = body.remainingCostEstimate === "" || body.remainingCostEstimate == null
      ? null : Number(body.remainingCostEstimate);
    if (remaining !== null && (!Number.isFinite(remaining) || remaining < 0)) {
      return NextResponse.json({ error: "Remaining cost estimate must be zero or greater" }, { status: 400 });
    }
    if (String(body.handoverNotes || "").length > 4000) {
      return NextResponse.json({ error: "Handover notes are too long" }, { status: 400 });
    }
    const session = await mongoose.startSession();
    let saved;
    try {
      await session.withTransaction(async () => {
        const project = await Project.findById(params.projectId).session(session);
        if (!project) throw new Error("Project not found");
        const lead = leadId ? await Lead.findById(leadId).session(session) : null;
        const quote = quoteId ? await Quote.findById(quoteId).session(session) : null;
        if (leadId && !lead) throw new Error("Lead not found");
        if (quoteId && !quote) throw new Error("Quote not found");
        if (lead?.linkedUser && String(lead.linkedUser) !== String(project.user)) throw new Error("Lead belongs to another client");
        if (quote?.linkedUser && String(quote.linkedUser) !== String(project.user)) throw new Error("Quote belongs to another client");
        if (quote?.project && String(quote.project) !== String(project._id)) throw new Error("Quote belongs to another project");
        if (quote?.linkedLead && leadId && String(quote.linkedLead) !== leadId) throw new Error("Quote is linked to a different lead");
        if (quote?.linkedLead && !leadId) throw new Error("Select the quote's linked lead as well");

        project.sourceLead = leadId;
        project.sourceQuote = quoteId;
        project.handoverNotes = String(body.handoverNotes || "").trim();
        project.remainingCostEstimate = remaining;
        await project.save({ session });
        if (lead && !lead.linkedUser) {
          await Lead.updateOne({ _id: lead._id, linkedUser: null }, { $set: { linkedUser: project.user } }, { session });
        }
        if (quote) {
          await Quote.updateOne({ _id: quote._id }, { $set: {
            project: project._id,
            linkedUser: project.user,
            ...(lead ? { linkedLead: lead._id } : {}),
          } }, { session });
        }
        saved = project;
      });
    } finally {
      await session.endSession();
    }
    return NextResponse.json({ project: saved.toJSON(), updatedBy: admin.user.id });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not save handover" }, { status: 400 });
  }
}
