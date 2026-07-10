import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const attachmentSchema = new mongoose.Schema(
  { name: String, url: String, type: String, size: Number },
  { _id: false },
);

const editSchema = new mongoose.Schema(
  {
    body: String,
    editedAt: { type: Date, default: Date.now },
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const leadNoteSchema = mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    title: { type: String, trim: true, default: "Note" },
    body: { type: String, required: true },
    contentText: { type: String, required: true },
    tags: { type: [String], default: [] },
    pinned: { type: Boolean, default: false, index: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mentionedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    attachments: { type: [attachmentSchema], default: [] },
    editHistory: { type: [editSchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

leadNoteSchema.plugin(toJSON);
leadNoteSchema.index({ leadId: 1, pinned: -1, createdAt: -1 });
leadNoteSchema.index({ contentText: "text", tags: "text" });

export default mongoose.models.LeadNote ||
  mongoose.model("LeadNote", leadNoteSchema);
