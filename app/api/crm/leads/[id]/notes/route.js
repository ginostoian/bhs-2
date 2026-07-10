import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadNote from "@/models/LeadNote";
import Notification from "@/models/Notification";

const getAdmin = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin" ? session : null;
};
const plainText = (body) =>
  String(body || "")
    .replace(/[#*_`>\[\]()~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function GET(_request, { params }) {
  const session = await getAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const notes = await LeadNote.find({ leadId: params.id })
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .sort({ pinned: -1, createdAt: -1 });
  return NextResponse.json({ notes });
}

export async function POST(request, { params }) {
  const session = await getAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const body = await request.json();
  const noteBody = body.body || body.content;
  if (!noteBody?.trim())
    return NextResponse.json(
      { error: "Note content is required" },
      { status: 400 },
    );
  const lead = await Lead.findById(params.id);
  if (!lead)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const note = await LeadNote.create({
    leadId: lead._id,
    title: body.title || "Note",
    body: noteBody.trim(),
    contentText: plainText(noteBody),
    tags: [
      ...new Set([
        ...(body.tags || []),
        ...(body.customTag ? [body.customTag] : []),
      ]),
    ],
    pinned: body.pinned ?? body.isImportant ?? false,
    attachments: body.attachments || [],
    mentionedUsers: body.mentionedUsers || [],
    createdBy: session.user.id,
  });

  if (body.mentionedUsers?.length) {
    await Notification.insertMany(
      body.mentionedUsers.map((recipient) => ({
        recipient,
        recipientType: "admin",
        type: "crm_note_mention",
        title: `Mentioned in a note for ${lead.name}`,
        message: plainText(noteBody).slice(0, 180),
        relatedId: note._id,
        relatedModel: "LeadNote",
        metadata: { leadId: lead._id },
      })),
    );
  }
  await note.populate("createdBy", "name email");
  return NextResponse.json({ success: true, note }, { status: 201 });
}
