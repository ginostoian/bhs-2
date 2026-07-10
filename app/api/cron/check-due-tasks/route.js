import { NextResponse } from "next/server";
import { authorizeCronOrAdmin } from "@/libs/cronAuth";
import connectMongo from "@/libs/mongoose";
import { sendEmailWithRetry } from "@/libs/emailService";
import LeadTask from "@/models/LeadTask";
import Notification from "@/models/Notification";

const sendTaskNotice = async (task, overdue = false) => {
  const recipient = task.assignedTo;
  if (!recipient?._id) return false;
  const leadName = task.leadId?.name || "a CRM lead";
  const title = overdue
    ? `Overdue task: ${task.title}`
    : `Task due: ${task.title}`;
  await Notification.createNotification({
    recipient: recipient._id,
    recipientType: "admin",
    type: overdue ? "crm_task_overdue" : "crm_task_due",
    title,
    message: `${leadName}${task.dueDate ? ` · ${new Date(task.dueDate).toLocaleString("en-GB")}` : ""}`,
    relatedId: task._id,
    relatedModel: "LeadTask",
    priority: overdue ? "urgent" : task.priority,
    metadata: { leadId: task.leadId?._id },
  });
  if (recipient.email) {
    await sendEmailWithRetry({
      to: recipient.email,
      subject: title,
      text: `${title}\n\nLead: ${leadName}\nDue: ${task.dueDate ? new Date(task.dueDate).toLocaleString("en-GB") : "Now"}\n\nOpen the CRM task list to take action.`,
      html: `<div style="font-family:Arial,sans-serif;color:#172033"><h2>${title}</h2><p><strong>Lead:</strong> ${leadName}</p><p><strong>Due:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleString("en-GB") : "Now"}</p><p>Open the CRM task list to take action.</p></div>`,
      metadata: {
        type: overdue ? "crm_task_overdue" : "crm_task_due",
        taskId: String(task._id),
      },
    });
  }
  return true;
};

const run = async (request) => {
  if (!(await authorizeCronOrAdmin(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const now = new Date();
  const overdueThreshold = new Date(now.getTime() - 12 * 60 * 60 * 1000);
  const [dueTasks, overdueTasks] = await Promise.all([
    LeadTask.find({
      status: { $ne: "completed" },
      reminderSentAt: null,
      $or: [
        { remindAt: { $lte: now } },
        { remindAt: null, dueDate: { $lte: now } },
      ],
    })
      .populate("assignedTo", "name email")
      .populate("leadId", "name email stage"),
    LeadTask.find({
      status: { $ne: "completed" },
      dueDate: { $lte: overdueThreshold },
      overdueEscalatedAt: null,
    })
      .populate("assignedTo", "name email")
      .populate("leadId", "name email stage"),
  ]);

  let sent = 0;
  const overdueTaskIds = new Set(overdueTasks.map((task) => String(task._id)));
  for (const task of dueTasks) {
    if (overdueTaskIds.has(String(task._id))) continue;
    if (await sendTaskNotice(task, false)) sent += 1;
    task.reminderSentAt = now;
    await task.save();
  }
  for (const task of overdueTasks) {
    if (await sendTaskNotice(task, true)) sent += 1;
    task.reminderSentAt ||= now;
    task.overdueEscalatedAt = now;
    await task.save();
  }
  return NextResponse.json({
    success: true,
    sent,
    due: dueTasks.length,
    overdue: overdueTasks.length,
  });
};

export const GET = run;
export const POST = run;
