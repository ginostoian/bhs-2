import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import LeadNote from "@/models/LeadNote";

const getAdmin = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin" ? session : null;
};
const plainText = (body) =>
  String(body || "")
    .replace(/[#*_`>\[\]()~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function PUT(request, { params }) {
  const session = await getAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const note = await LeadNote.findOne({
    _id: params.noteId,
    leadId: params.id,
  });
  if (!note)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  const body = await request.json();
  if (body.body !== undefined && body.body.trim() !== note.body) {
    note.editHistory.push({
      body: note.body,
      editedAt: new Date(),
      editedBy: session.user.id,
    });
    note.body = body.body.trim();
    note.contentText = plainText(body.body);
  }
  for (const field of [
    "title",
    "tags",
    "pinned",
    "attachments",
    "mentionedUsers",
  ]) {
    if (body[field] !== undefined) note[field] = body[field];
  }
  note.updatedBy = session.user.id;
  await note.save();
  await note.populate("createdBy", "name email");
  await note.populate("updatedBy", "name email");
  return NextResponse.json({ success: true, note });
}

export async function DELETE(_request, { params }) {
  const session = await getAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const note = await LeadNote.findOneAndDelete({
    _id: params.noteId,
    leadId: params.id,
  });
  if (!note)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
