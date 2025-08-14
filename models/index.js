// Import all models to ensure they are registered with Mongoose
// This file should be imported first when working with models

import User from "./User.js";
import Employee from "./Employee.js";
import Project from "./Project.js";
import Task from "./Task.js";
import ProjectChange from "./ProjectChange.js";
import Ticket from "./Ticket.js";
import Notification from "./Notification.js";
import Document from "./Document.js";
import Payment from "./Payment.js";
import Milestone from "./Milestone.js";
import AdminTask from "./AdminTask.js";
import TaskSection from "./TaskSection.js";
import ProjectNote from "./ProjectNote.js";
import Expense from "./Expense.js";
import GanttShare from "./GanttShare.js";
import Contact from "./Contact.js";
import Attendance from "./Attendance.js";

// Export all models
export {
  User,
  Employee,
  Project,
  Task,
  ProjectChange,
  Ticket,
  Notification,
  Document,
  Payment,
  Milestone,
  AdminTask,
  TaskSection,
  ProjectNote,
  Expense,
  GanttShare,
  Contact,
  Attendance,
};
