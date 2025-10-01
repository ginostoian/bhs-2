/**
 * Script to fix quotes that have "Draft" placeholder text in their terms,
 * warranty information, or lead time fields but are no longer in draft status.
 *
 * Run with: node scripts/fix-draft-quote-terms.js
 */

require("dotenv").config({ path: ".env.local" });
const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

// Define Quote schema inline for this script
const QuoteSchema = new mongoose.Schema(
  {
    quoteNumber: String,
    title: String,
    status: String,
    termsAndConditions: String,
    warrantyInformation: String,
    leadTime: String,
  },
  { strict: false },
);

const Quote = mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);

const PROPER_TERMS =
  "Standard BH Studio terms and conditions apply. All work is guaranteed and insured. Payment terms: deposit required, then weekly payments until completion.";
const PROPER_WARRANTY =
  "All our work comes with a comprehensive workmanship guarantee covering our work from 1 year to 10 years depending on the project type and materials used.";
const PROPER_LEAD_TIME =
  "We typically require 2 weeks notice to start a project.";

async function fixDraftQuoteTerms() {
  try {
    console.log("Connecting to MongoDB...");
    await connectMongo();
    console.log("✅ Connected to MongoDB");

    // Find all quotes that are NOT drafts but have draft placeholder text
    const quotesWithDraftText = await Quote.find({
      status: { $ne: "draft" },
      $or: [
        { termsAndConditions: /^Draft -/ },
        { warrantyInformation: /^Draft -/ },
        { leadTime: /^Draft -/ },
      ],
    });

    console.log(
      `\nFound ${quotesWithDraftText.length} quote(s) with draft placeholder text but non-draft status\n`,
    );

    if (quotesWithDraftText.length === 0) {
      console.log("✅ No quotes need fixing!");
      await mongoose.disconnect();
      return;
    }

    let fixedCount = 0;

    for (const quote of quotesWithDraftText) {
      console.log(`Fixing quote: ${quote.quoteNumber} (${quote.title})`);
      console.log(`  Status: ${quote.status}`);

      const updates = {};

      // Check and fix termsAndConditions
      if (quote.termsAndConditions?.startsWith("Draft -")) {
        console.log(`  ❌ Terms: "${quote.termsAndConditions}"`);
        updates.termsAndConditions = PROPER_TERMS;
        console.log(`  ✅ Updating terms to proper text`);
      }

      // Check and fix warrantyInformation
      if (quote.warrantyInformation?.startsWith("Draft -")) {
        console.log(`  ❌ Warranty: "${quote.warrantyInformation}"`);
        updates.warrantyInformation = PROPER_WARRANTY;
        console.log(`  ✅ Updating warranty to proper text`);
      }

      // Check and fix leadTime
      if (quote.leadTime?.startsWith("Draft -")) {
        console.log(`  ❌ Lead Time: "${quote.leadTime}"`);
        updates.leadTime = PROPER_LEAD_TIME;
        console.log(`  ✅ Updating lead time to proper text`);
      }

      // Update the quote
      if (Object.keys(updates).length > 0) {
        await Quote.findByIdAndUpdate(quote._id, { $set: updates });
        fixedCount++;
        console.log(`  ✅ Quote ${quote.quoteNumber} updated successfully\n`);
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} quote(s) successfully!`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the script
fixDraftQuoteTerms();
