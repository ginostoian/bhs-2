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
import BathroomRenovation from "./BathroomRenovation.js";
import KitchenRenovation from "./KitchenRenovation.js";
import GeneralRenovation from "./GeneralRenovation.js";
import QuoteTemplate from "./QuoteTemplate.js";
import RateCard from "./RateCard.js";
import TemplateService from "./TemplateService.js";
import Quote from "./Quote.js";
import QuoteView from "./QuoteView.js";
import Invoice from "./Invoice.js";
import InvoiceTemplate from "./InvoiceTemplate.js";
import Lead from "./Lead.js";
import EmailAutomation from "./EmailAutomation.js";
import EmailPreference from "./EmailPreference.js";
import EmailStats from "./EmailStats.js";
import TaskStatusUpdate from "./TaskStatusUpdate.js";
import TemplateMessage from "./TemplateMessage.js";

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
  BathroomRenovation,
  KitchenRenovation,
  GeneralRenovation,
  QuoteTemplate,
  RateCard,
  TemplateService,
  Quote,
  QuoteView,
  Invoice,
  InvoiceTemplate,
  Lead,
  EmailAutomation,
  EmailPreference,
  EmailStats,
  TaskStatusUpdate,
  TemplateMessage,
};
