#!/usr/bin/env node

/**
 * Migration script to update existing quote templates
 * to use the new project type values that match the quote creation form
 */

require("dotenv").config({ path: ".env.local" });

const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

// Define the QuoteTemplate schema for the migration
const quoteTemplateSchema = new mongoose.Schema({
  name: String,
  description: String,
  projectType: String,
  version: String,
  baseServices: Array,
  defaultPricing: Object,
  isActive: Boolean,
  createdBy: mongoose.Schema.Types.ObjectId,
  lastModifiedBy: mongoose.Schema.Types.ObjectId,
  previousVersions: Array,
  createdAt: Date,
  updatedAt: Date,
});

const QuoteTemplate =
  mongoose.models.QuoteTemplate ||
  mongoose.model("QuoteTemplate", quoteTemplateSchema);

// Mapping from old project type values to new ones
const projectTypeMapping = {
  "Bathroom Renovation": "bathroom-renovation",
  "Kitchen Renovation": "kitchen-renovation",
  "Electrical Rewiring": "electrical-rewiring",
  "Boiler Installation": "boiler-installation",
  "Full Home Renovation": "full-home-renovation",
  "Home Extension": "home-extension",
  "Loft Conversion": "loft-conversion",
  "Garden Work": "garden-work",
  custom: "custom", // This one stays the same
};

async function migrateQuoteTemplates() {
  try {
    console.log("🔗 Starting quote template migration...");

    // Connect to MongoDB
    await connectMongo();
    console.log("✅ Connected to MongoDB");

    // Find all templates that need migration
    const oldProjectTypes = Object.keys(projectTypeMapping);
    const templatesToMigrate = await QuoteTemplate.find({
      projectType: { $in: oldProjectTypes },
    });

    console.log(`📊 Found ${templatesToMigrate.length} templates to migrate`);

    if (templatesToMigrate.length === 0) {
      console.log(
        "✅ No templates need migration - all are already using the new format",
      );
      return;
    }

    let migratedCount = 0;
    let skippedCount = 0;

    for (const template of templatesToMigrate) {
      try {
        const oldProjectType = template.projectType;
        const newProjectType = projectTypeMapping[oldProjectType];

        if (!newProjectType) {
          console.log(
            `⚠️  Skipping template "${template.name}" - unknown project type: ${oldProjectType}`,
          );
          skippedCount++;
          continue;
        }

        // Update the template
        await QuoteTemplate.updateOne(
          { _id: template._id },
          {
            $set: {
              projectType: newProjectType,
              updatedAt: new Date(),
            },
          },
        );

        console.log(
          `✅ Migrated template "${template.name}": ${oldProjectType} → ${newProjectType}`,
        );
        migratedCount++;
      } catch (error) {
        console.error(
          `❌ Error migrating template "${template.name}":`,
          error.message,
        );
        skippedCount++;
      }
    }

    console.log("\n🎉 Migration completed!");
    console.log(`📈 Successfully migrated: ${migratedCount} templates`);
    console.log(`⏭️  Skipped: ${skippedCount} templates`);
    console.log(`📊 Total processed: ${templatesToMigrate.length} templates`);

    // Verify migration
    const remainingOldTemplates = await QuoteTemplate.find({
      projectType: { $in: oldProjectTypes },
    });

    if (remainingOldTemplates.length === 0) {
      console.log(
        "✅ Verification successful - all templates have been migrated",
      );
    } else {
      console.log(
        `⚠️  Warning: ${remainingOldTemplates.length} templates still have old project types`,
      );
      remainingOldTemplates.forEach((template) => {
        console.log(`   - "${template.name}": ${template.projectType}`);
      });
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  }
}

// Run migration
migrateQuoteTemplates();
