import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const projectWeeklyUpdateSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    weekStart: { type: Date, required: true },
    completed: { type: String, trim: true, required: true },
    nextWeek: { type: String, trim: true, required: true },
    blockers: { type: String, trim: true },
    decisionsNeeded: { type: String, trim: true },
    scheduleImpact: { type: String, enum: ["none", "at-risk", "delayed"], default: "none" },
    costImpact: { type: String, enum: ["none", "possible", "confirmed"], default: "none" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

projectWeeklyUpdateSchema.index({ project: 1, weekStart: 1 }, { unique: true });
projectWeeklyUpdateSchema.plugin(toJSON);

export default mongoose.models.ProjectWeeklyUpdate ||
  mongoose.model("ProjectWeeklyUpdate", projectWeeklyUpdateSchema);
