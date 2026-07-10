import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const attachmentSchema = new mongoose.Schema(
  { name: String, url: String, type: String, size: Number },
  { _id: false },
);

const leadActivitySchema = mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "email",
        "call",
        "site_visit",
        "meeting",
        "note",
        "attachment",
        "task",
        "stage_change",
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["pending", "done"], default: "pending" },
    contactMade: { type: Boolean, default: false },
    occurredAt: { type: Date, default: Date.now, index: true },
    dueDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    attachments: { type: [attachmentSchema], default: [] },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

leadActivitySchema.plugin(toJSON);
leadActivitySchema.index({ leadId: 1, occurredAt: -1 });
leadActivitySchema.index({ dueDate: 1, status: 1 });

export default mongoose.models.LeadActivity ||
  mongoose.model("LeadActivity", leadActivitySchema);
