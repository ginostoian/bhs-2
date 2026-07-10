import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const leadTaskSchema = mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: { type: Date, index: true },
    remindAt: { type: Date, index: true },
    reminderSentAt: Date,
    overdueEscalatedAt: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    completedAt: Date,
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

leadTaskSchema.plugin(toJSON);
leadTaskSchema.index({ assignedTo: 1, dueDate: 1, status: 1 });
leadTaskSchema.index({ leadId: 1, status: 1, dueDate: 1 });

leadTaskSchema.virtual("isOverdue").get(function () {
  return (
    this.status !== "completed" && this.dueDate && this.dueDate < new Date()
  );
});

export default mongoose.models.LeadTask ||
  mongoose.model("LeadTask", leadTaskSchema);
