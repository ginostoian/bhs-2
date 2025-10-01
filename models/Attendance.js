import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Attendance Schema
 * Tracks which worker worked on which project on which date
 */
const attendanceSchema = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false, // Made optional to allow custom project names
      index: true,
    },
    projectName: {
      type: String,
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Present", "Sick", "Holiday", "Unavailable"],
      default: "Present",
      index: true,
    },
    shiftType: {
      type: String,
      enum: ["full", "half", "custom"],
      default: "full",
    },
    hours: {
      type: Number,
      min: 0,
      max: 24,
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

attendanceSchema.plugin(toJSON);

// Unique compound index to prevent duplicate assignment per day
attendanceSchema.index({ worker: 1, project: 1, date: 1 }, { unique: true });

// Index for common query patterns (date range queries)
attendanceSchema.index({ date: -1, worker: 1 });
attendanceSchema.index({ date: -1, project: 1 });

// Validate that either project or projectName is provided
attendanceSchema.pre("save", function (next) {
  if (!this.project && !this.projectName) {
    return next(
      new Error("Either project reference or projectName must be provided"),
    );
  }

  // Normalize date to midnight UTC on save
  if (this.isModified("date") && this.date) {
    const d = new Date(this.date);
    d.setUTCHours(0, 0, 0, 0);
    this.date = d;
  }
  next();
});

if (mongoose.models.Attendance) {
  delete mongoose.models.Attendance;
}

export default mongoose.model("Attendance", attendanceSchema);
