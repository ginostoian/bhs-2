const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "test"; // fallback to 'test' if not set

async function migrate() {
  if (!uri) {
    console.error("❌ MONGODB_URI not set in .env.local");
    process.exit(1);
  }
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const db = client.db(dbName);
    const leads = db.collection("leads");

    // Find all leads
    const cursor = leads.find({});
    let totalLeads = 0;
    let totalActivities = 0;
    let updatedLeads = 0;
    let updatedActivities = 0;

    while (await cursor.hasNext()) {
      const lead = await cursor.next();
      totalLeads++;
      let modified = false;
      if (Array.isArray(lead.activities)) {
        for (let i = 0; i < lead.activities.length; i++) {
          totalActivities++;
          if (
            !Object.prototype.hasOwnProperty.call(lead.activities[i], "dueDate")
          ) {
            lead.activities[i].dueDate = undefined;
            modified = true;
            updatedActivities++;
            console.log(
              `Lead ${lead._id}: Activity ${i + 1} (${lead.activities[i].title}) - Added dueDate field`,
            );
          }
        }
        if (modified) {
          await leads.updateOne(
            { _id: lead._id },
            { $set: { activities: lead.activities } },
          );
          updatedLeads++;
          console.log(`Lead ${lead._id} updated.`);
        }
      }
    }
    console.log("---");
    console.log(`🎉 Migration complete!`);
    console.log(`Total leads processed: ${totalLeads}`);
    console.log(`Total activities processed: ${totalActivities}`);
    console.log(`Leads updated: ${updatedLeads}`);
    console.log(`Activities updated: ${updatedActivities}`);
  } catch (err) {
    console.error("❌ Migration error:", err);
  } finally {
    await client.close();
    console.log("✅ MongoDB connection closed");
  }
}

migrate();
