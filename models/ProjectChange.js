import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import Notification from "./Notification";
import { sendProjectChangeNotificationEmail } from "@/libs/emailService";

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
        await Notification.createNotification({
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

        // Send email notification
        try {
          // Populate user info if not already populated
          if (!this.populated("user")) {
            await this.populate("user", "name email");
          }

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
  return await this.find({ project: projectId })
    .sort({ order: 1 })
    .populate("user", "name email")
    .populate("decidedBy", "name")
    .lean();
};

// Static method to get changes for a user
projectChangeSchema.statics.getUserChanges = async function (userId) {
  return await this.find({ user: userId })
    .sort({ order: 1 })
    .populate("project", "name")
    .populate("decidedBy", "name")
    .lean();
};

const ProjectChange =
  mongoose.models.ProjectChange ||
  mongoose.model("ProjectChange", projectChangeSchema);

export default ProjectChange;
