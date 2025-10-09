import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import {
  sendProjectChangeNotificationEmail,
  sendProjectChangeUserResponseEmail,
  sendProjectChangeStatusEmail,
} from "@/libs/emailService";

/**
 * ProjectChange Schema
 * Handles project changes/extra costs with approval workflow
 */
const projectChangeSchema = mongoose.Schema(
  {
    // Reference to the project
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    // Reference to the user who owns the project
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Change number (auto-incremented per project)
    changeNumber: {
      type: Number,
      required: false,
      sparse: true,
    },
    // Name of the change
    name: {
      type: String,
      required: true,
    },
    // Description of the change (optional)
    description: {
      type: String,
      required: false,
    },
    // Cost of the change in pounds
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    // Status of the change (Review, Accepted, Declined)
    status: {
      type: String,
      enum: ["Review", "Accepted", "Declined"],
      default: "Review",
    },
    // Whether the change is included in the payment plan
    includedInPaymentPlan: {
      type: String,
      enum: ["Included", "Not Included"],
      default: "Not Included",
    },
    // Type of cost (Labour or Material)
    type: {
      type: String,
      enum: ["Labour", "Material"],
      required: true,
    },
    // Order for display
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // Admin notes (internal use)
    adminNotes: {
      type: String,
      required: false,
    },
    // Date when the change was requested
    requestedDate: {
      type: Date,
      default: Date.now,
    },
    // Date when the change was approved/declined
    decisionDate: {
      type: Date,
      required: false,
    },
    // Who made the decision (admin user ID)
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
projectChangeSchema.plugin(toJSON);

// Compound index for project and order to ensure proper ordering
projectChangeSchema.index({ project: 1, order: 1 });

// Index for user and changeNumber
projectChangeSchema.index({ project: 1, changeNumber: 1 }, { unique: false });

// Pre-validate middleware to auto-assign change number if not provided
projectChangeSchema.pre("validate", async function (next) {
  try {
    // Only run this middleware for new documents, not updates
    if (this.isNew) {
      if (!this.changeNumber) {
        // Get the highest change number for this project
        const lastChange = await this.constructor
          .findOne({ project: this.project })
          .sort({ order: -1 });

        this.changeNumber = lastChange ? lastChange.order + 1 : 1;
      }

      // Auto-assign order if not provided
      if (this.order === 0) {
        const lastChange = await this.constructor
          .findOne({ project: this.project })
          .sort({ order: -1 });

        this.order = lastChange ? lastChange.order + 1 : 1;
      }

      // Ensure change number matches order for new documents
      if (this.changeNumber !== this.order) {
        this.changeNumber = this.order;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to handle notifications
projectChangeSchema.pre("save", async function (next) {
  try {
    // Check if this is a new change
    if (this.isNew) {
      // Create notification for the user
      try {
        const { Notification } = await import("./index.js");
        const notification = await Notification.createNotification({
          recipient: this.user,
          recipientType: "user",
          type: "project_change_added",
          title: "New Project Change Request",
          message: `A new change request "${this.name}" has been added to your project. Please review and respond.`,
          relatedId: this._id,
          relatedModel: "ProjectChange",
          priority: "medium",
          metadata: {
            changeId: this._id,
            projectId: this.project,
            changeName: this.name,
            cost: this.cost,
          },
        });

        console.log(
          `✅ Notification created for project change: ${notification._id}`,
        );

        // Send email notification
        try {
          // Populate user info if not already populated
          if (!this.populated("user")) {
            await this.populate("user", "name email");
          }

          console.log(
            `📧 Attempting to send email to ${this.user.email} for change: ${this.name}`,
          );

          await sendProjectChangeNotificationEmail(
            this.user.email,
            this.user.name,
            this.name,
            this.cost,
            this.type,
            this.description,
          );

          console.log(
            `✅ Project change notification email sent to ${this.user.email} for change: ${this.name}`,
          );
        } catch (emailError) {
          console.error(
            `Failed to send project change notification email to user ${this.user}:`,
            emailError,
          );
          // Don't fail the save operation if email fails
        }
      } catch (notificationError) {
        console.error(
          `Failed to create notification for project change ${this._id}:`,
          notificationError,
        );
        // Don't fail the save operation if notification fails
      }
    }

    // Check if status is changing
    if (this.isModified("status") && this.status !== "Review") {
      const previousStatus = this._original?.status || "Review";

      if (previousStatus === "Review") {
        // Create notification for status change
        try {
          const { Notification } = await import("./index.js");
          const statusText =
            this.status === "Accepted" ? "approved" : "declined";

          await Notification.createNotification({
            recipient: this.user,
            recipientType: "user",
            type: "project_change_status_changed",
            title: `Project Change ${this.status}`,
            message: `Your change request "${this.name}" has been ${statusText}.`,
            relatedId: this._id,
            relatedModel: "ProjectChange",
            priority: "medium",
            metadata: {
              changeId: this._id,
              projectId: this.project,
              changeName: this.name,
              status: this.status,
              cost: this.cost,
            },
          });

          // Send email notification for status change
          try {
            // Populate user info if not already populated
            if (!this.populated("user")) {
              await this.populate("user", "name email");
            }

            await sendProjectChangeStatusEmail(
              this.user.email,
              this.user.name,
              this.name,
              this.status,
              this.cost,
              this.adminNotes,
            );

            console.log(
              `✅ Project change status email sent to ${this.user.email} for change: ${this.name}`,
            );
          } catch (emailError) {
            console.error(
              `Failed to send project change status email to user ${this.user}:`,
              emailError,
            );
          }

          // Send email to project manager if status was changed by user (not admin)
          try {
            // Check if the change was made by a user (not admin)
            // If decidedBy is the same as user, it means the user made the decision
            if (
              this.decidedBy &&
              this.decidedBy.toString() === this.user.toString()
            ) {
              // Get project details with project manager
              const { Project } = await import("./index.js");
              const project = await Project.findById(this.project)
                .populate("projectManager", "name email")
                .lean();

              if (project && project.projectManager) {
                console.log(
                  `📧 Sending admin notification to project manager ${project.projectManager.email} for change: ${this.name}`,
                );

                // Create notification for project manager
                const { Notification } = await import("./index.js");
                await Notification.createNotification({
                  recipient: project.projectManager._id,
                  recipientType: "employee",
                  type: "project_change_user_response",
                  title: `Project Change ${this.status} by User`,
                  message: `User ${this.user.name || this.user.email} has ${this.status === "Accepted" ? "accepted" : "declined"} the change request "${this.name}" for project "${project.name}".`,
                  relatedId: this._id,
                  relatedModel: "ProjectChange",
                  priority: "medium",
                  metadata: {
                    changeId: this._id,
                    projectId: this.project,
                    changeName: this.name,
                    status: this.status,
                    cost: this.cost,
                    userName: this.user.name || this.user.email,
                    projectName: project.name,
                  },
                });

                await sendProjectChangeUserResponseEmail(
                  project.projectManager.email,
                  project.projectManager.name,
                  this.user.name || this.user.email,
                  this.name,
                  this.status,
                  this.cost,
                  project.name,
                );

                console.log(
                  `✅ Project change user response email sent to project manager ${project.projectManager.email} for change: ${this.name}`,
                );
              } else {
                console.log("⚠️ No project manager found for this project");
              }
            }
          } catch (adminEmailError) {
            console.error(
              `Failed to send project change user response email to project manager:`,
              adminEmailError,
            );
          }
        } catch (notificationError) {
          console.error(
            `Failed to create status change notification for project change ${this._id}:`,
            notificationError,
          );
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static method to get changes for a project
projectChangeSchema.statics.getProjectChanges = async function (projectId) {
  const changes = await this.find({ project: projectId })
    .sort({ order: 1 })
    .populate("user", "name email")
    .populate("decidedBy", "name");

  // Convert to JSON to apply toJSON transformation (converts _id to id)
  return changes.map((change) => change.toJSON());
};

// Static method to get changes for a user
projectChangeSchema.statics.getUserChanges = async function (userId) {
  const changes = await this.find({ user: userId })
    .sort({ order: 1 })
    .populate("project", "name")
    .populate("decidedBy", "name");

  // Convert to JSON to apply toJSON transformation (converts _id to id)
  return changes.map((change) => change.toJSON());
};

const ProjectChange =
  mongoose.models.ProjectChange ||
  mongoose.model("ProjectChange", projectChangeSchema);

export default ProjectChange;
