const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const APPLY = process.argv.includes("--apply");
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "test";
const DAY = 24 * 60 * 60 * 1000;

const stageMap = {
  Lead: "New Enquiry",
  "Never replied": "New Enquiry",
  Qualified: "Qualified — Awaiting Quote",
  Negotiations: "Negotiation — Awaiting Us",
};
const sequenceByStage = {
  "New Enquiry": ["new_enquiry", [0, 1, 3, 6, 10, 16, 24]],
  "In Conversation": ["in_conversation", [2, 5, 10]],
  "Qualified — Awaiting Quote": ["qualified_admin", [0, 2, 4]],
  "Proposal Sent": ["proposal_sent", [1, 3, 7, 12, 18, 28]],
  "Negotiation — Awaiting Us": ["negotiation_admin", [0, 2, 4]],
};

async function run() {
  if (!uri) throw new Error("MONGODB_URI is not set in .env.local");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const leads = db.collection("leads");
  const activities = db.collection("leadactivities");
  const notes = db.collection("leadnotes");
  const tasks = db.collection("leadtasks");
  const automations = db.collection("emailautomations");
  const stats = { leads: 0, activities: 0, notes: 0, tasks: 0, automations: 0 };

  const duplicates = await leads
    .aggregate([
      { $match: { isActive: true, isArchived: false } },
      {
        $group: {
          _id: { $toLower: "$email" },
          ids: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();
  if (duplicates.length) {
    console.warn(
      `Found ${duplicates.length} duplicate active email group(s). Merge these in the CRM before creating the unique index.`,
    );
    duplicates.forEach((group) =>
      console.warn(group._id, group.ids.map(String).join(", ")),
    );
  }

  for await (const lead of leads.find({})) {
    stats.leads += 1;
    const normalizedStage = stageMap[lead.stage] || lead.stage || "New Enquiry";
    const baseUpdate = {
      stage: normalizedStage,
      estimatedValue: lead.estimatedValue ?? lead.value ?? 0,
      probability: lead.probability ?? 0.1,
      lifecycleStatus:
        lead.stage === "Never replied"
          ? "Cold"
          : lead.lifecycleStatus || "Active",
      activityCount: lead.activityCount ?? lead.activities?.length ?? 0,
      marketingConsent: lead.marketingConsent ?? null,
      emailSuppressed: lead.emailSuppressed ?? false,
    };

    for (const item of lead.activities || []) {
      stats.activities += 1;
      if (APPLY)
        await activities.updateOne(
          { leadId: lead._id, legacyId: item._id },
          {
            $setOnInsert: {
              ...item,
              leadId: lead._id,
              legacyId: item._id,
              occurredAt: item.date || item.createdAt || new Date(),
              createdAt: item.createdAt || new Date(),
              updatedAt: new Date(),
            },
          },
          { upsert: true },
        );
    }
    for (const item of lead.notes || []) {
      stats.notes += 1;
      if (APPLY)
        await notes.updateOne(
          { leadId: lead._id, legacyId: item._id },
          {
            $setOnInsert: {
              leadId: lead._id,
              legacyId: item._id,
              title: item.title || "Note",
              body: item.content,
              contentText: item.content,
              tags: [],
              pinned: Boolean(item.isImportant),
              createdBy: item.createdBy,
              createdAt: item.createdAt || new Date(),
              updatedAt: item.createdAt || new Date(),
              attachments: [],
              editHistory: [],
            },
          },
          { upsert: true },
        );
    }
    for (const item of lead.tasks || []) {
      stats.tasks += 1;
      if (APPLY)
        await tasks.updateOne(
          { leadId: lead._id, legacyId: item._id },
          {
            $setOnInsert: {
              ...item,
              leadId: lead._id,
              legacyId: item._id,
              status: item.status === "overdue" ? "pending" : item.status,
              remindAt: null,
              reminderSentAt: null,
              createdAt: item.createdAt || new Date(),
              updatedAt: new Date(),
            },
          },
          { upsert: true },
        );
    }
    if (APPLY)
      await leads.updateOne(
        { _id: lead._id },
        { $set: baseUpdate, $unset: { activities: "", notes: "", tasks: "" } },
      );
  }

  for await (const automation of automations.find({})) {
    stats.automations += 1;
    const stage = stageMap[automation.currentStage] || automation.currentStage;
    const config = sequenceByStage[stage];
    if (!config || automation.sequenceKey) continue;
    const [sequenceKey, offsets] = config;
    const legacyStep =
      sequenceKey === "new_enquiry"
        ? automation.stageData?.lead?.emailsSent || 0
        : sequenceKey === "proposal_sent"
          ? automation.stageData?.proposalSent?.emailsSent || 0
          : sequenceKey === "qualified_admin"
            ? automation.stageData?.qualified?.adminNotificationsSent || 0
            : automation.stageData?.negotiations?.adminNotificationsSent || 0;
    const enteredAt =
      automation.updatedAt || automation.createdAt || new Date();
    const nextOffset = offsets[legacyStep];
    if (APPLY)
      await automations.updateOne(
        { _id: automation._id },
        {
          $set: {
            currentStage: stage,
            sequenceKey,
            sequenceStep: legacyStep,
            sequenceEnteredAt: enteredAt,
            nextActionDue:
              nextOffset === undefined
                ? null
                : new Date(new Date(enteredAt).getTime() + nextOffset * DAY),
            sequenceCompletedAt: nextOffset === undefined ? new Date() : null,
            adminRemindersSent: [
              "qualified_admin",
              "negotiation_admin",
            ].includes(sequenceKey)
              ? legacyStep
              : 0,
            maxAdminReminders: 3,
          },
        },
      );
  }

  if (APPLY && duplicates.length === 0) {
    await leads.createIndex(
      { email: 1 },
      {
        unique: true,
        partialFilterExpression: { isActive: true, isArchived: false },
        name: "unique_active_lead_email",
      },
    );
  }

  console.log(
    APPLY
      ? "CRM migration applied."
      : "CRM migration dry run. Re-run with --apply to write changes.",
  );
  console.table(stats);
  await client.close();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
