import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Employee Schema
 * Handles employee accounts with restricted access compared to regular users
 * Employees can view assigned tasks but have limited access to payments/quotes
 */
const employeeSchema = mongoose.Schema(
  {
    // Employee's full name
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Employee's email address (required, unique, used for authentication)
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      private: true,
    },
    // Employee's profile image URL (from OAuth providers)
    image: {
      type: String,
    },
    // Employee role (always "employee" for this model)
    role: {
      type: String,
      enum: ["employee"],
      default: "employee",
    },
    // Employee's phone number
    phone: {
      type: String,
      trim: true,
    },
    // Employee's position/title
    position: {
      type: String,
      trim: true,
      required: true,
    },
    // Employee's skills/specializations
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    // Whether the employee is active
    isActive: {
      type: Boolean,
      default: true,
    },
    // Employee's hourly rate (optional, for future use)
    hourlyRate: {
      type: Number,
      min: 0,
    },
    // Employee's availability status
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    // Notes about the employee
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
employeeSchema.plugin(toJSON);

// Virtual for getting assigned tasks count
employeeSchema.virtual("assignedTasksCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "assignedTo",
  count: true,
});

// Static method to get active employees
employeeSchema.statics.getActiveEmployees = function () {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method to get employees by skills
employeeSchema.statics.getEmployeesBySkills = function (skills) {
  return this.find({
    isActive: true,
    skills: { $in: skills },
  }).sort({ name: 1 });
};

export default mongoose.models.Employee ||
  mongoose.model("Employee", employeeSchema);
