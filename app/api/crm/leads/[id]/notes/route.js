import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// GET - Fetch notes for a lead
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const lead = await Lead.findById(params.id)
      .populate("notes.createdBy", "name email")
      .select("notes");

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ notes: lead.notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

// POST - Add a new note to a lead
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined" || params.id === "null") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, tags, customTag, isImportant, attachments } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Note title and content are required" },
        { status: 400 },
      );
    }

    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const note = {
      title,
      content,
      createdBy: session.user.id,
      isImportant: isImportant || false,
    };

    await lead.addNote(note);

    // Populate the new note
    await lead.populate("notes.createdBy", "name email");

    const newNote = lead.notes[lead.notes.length - 1];

    return NextResponse.json({ success: true, note: newNote }, { status: 201 });
  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
