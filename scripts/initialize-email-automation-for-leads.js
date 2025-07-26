const axios = require("axios");
require("dotenv").config();

/**
 * Script to initialize email automation for existing leads
 * Uses the API endpoint to create automations
 */

const API_BASE_URL = "http://localhost:3000/api";

async function initializeEmailAutomationForLeads() {
  try {
    console.log("🔄 Starting email automation initialization...");

    // First, get all leads
    const leadsResponse = await axios.get(`${API_BASE_URL}/crm/leads`);
    const leads = leadsResponse.data.leads || [];

    console.log(`📊 Found ${leads.length} leads`);

    let initialized = 0;
    let skipped = 0;
    let errors = 0;

    for (const lead of leads) {
      try {
        // Check if lead already has email automation by trying to get automation details
        try {
          const automationResponse = await axios.get(
            `${API_BASE_URL}/crm/email-automation/lead/${lead.id}`,
          );
          console.log(
            `⏭️  Skipping ${lead.name} (${lead.email}) - automation already exists`,
          );
          skipped++;
          continue;
        } catch (error) {
          // If 404, automation doesn't exist, so we'll create it
          if (error.response?.status !== 404) {
            throw error;
          }
        }

        // Initialize email automation by updating the lead stage (this triggers automation creation)
        console.log(
          `🔄 Initializing automation for ${lead.name} (${lead.email}) - Stage: ${lead.stage}`,
        );

        await axios.patch(`${API_BASE_URL}/crm/leads/${lead.id}`, {
          stage: lead.stage, // This will trigger automation initialization
        });

        console.log(`✅ Initialized automation for ${lead.name}`);
        initialized++;

        // Small delay to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `❌ Error initializing automation for ${lead.name}:`,
          error.response?.data?.error || error.message,
        );
        errors++;
      }
    }

    console.log("\n📈 Summary:");
    console.log(`✅ Initialized: ${initialized}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total processed: ${leads.length}`);
  } catch (error) {
    console.error("❌ Script error:", error.response?.data || error.message);
  }
}

// Run the script
initializeEmailAutomationForLeads();
