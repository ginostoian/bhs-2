import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Task Status Update Schema
 * Handles pending status update requests from employees that require admin approval
 */
const taskStatusUpdateSchema = mongoose.Schema(
  {
    // Reference to the task being updated
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    // Reference to the employee who requested the update
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    // Current status of the task
    currentStatus: {
      type: String,
      enum: ["Scheduled", "Blocked", "In Progress", "Done"],
      required: true,
    },
    // Requested new status
    requestedStatus: {
      type: String,
      enum: ["Scheduled", "Blocked", "In Progress", "Done"],
      required: true,
    },
    // Status of the request (pending, approved, rejected)
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Admin who reviewed the request
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Review date
    reviewedAt: {
      type: Date,
    },
    // Notes from employee
    employeeNotes: {
      type: String,
      trim: true,
    },
    // Notes from admin
    adminNotes: {
      type: String,
      trim: true,
    },
    // Request date
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
taskStatusUpdateSchema.plugin(toJSON);

// Static method to get pending requests for admin
taskStatusUpdateSchema.statics.getPendingRequests = function () {
  return this.find({ requestStatus: "pending" })
    .populate("task", "name description project")
    .populate("requestedBy", "name position")
    .populate("reviewedBy", "name")
    .sort({ requestedAt: -1 });
};

// Static method to get pending requests for an employee
taskStatusUpdateSchema.statics.getEmployeePendingRequests = function (
  employeeId,
) {
  return this.find({
    requestedBy: employeeId,
    requestStatus: "pending",
  })
    .populate("task", "name description project")
    .sort({ requestedAt: -1 });
};

// Static method to get request history for a task
taskStatusUpdateSchema.statics.getTaskHistory = function (taskId) {
  return this.find({ task: taskId })
    .populate("requestedBy", "name position")
    .populate("reviewedBy", "name")
    .sort({ requestedAt: -1 });
};

export default mongoose.models.TaskStatusUpdate ||
  mongoose.model("TaskStatusUpdate", taskStatusUpdateSchema);
