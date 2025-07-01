/**
 * Bootstrap Script: Create First Admin User
 *
 * Usage:
 * 1. Set your email in the EMAIL variable below
 * 2. Run: node scripts/create-admin.js
 *
 * This script will:
 * - Connect to MongoDB
 * - Create a user with admin role
 * - Or update existing user to admin role
 */

import mongoose from "mongoose";
import User from "../models/User.js";

// CONFIGURATION - Change this to your email
const EMAIL = "admin@example.com";
const NAME = "Admin User";

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Create or update admin user
const createAdmin = async () => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: EMAIL });

    if (user) {
      // Update existing user to admin
      user.role = "admin";
      user.name = NAME;
      await user.save();
      console.log(`✅ Updated existing user ${EMAIL} to admin role`);
    } else {
      // Create new admin user
      user = await User.create({
        email: EMAIL,
        name: NAME,
        role: "admin",
      });
      console.log(`✅ Created new admin user: ${EMAIL}`);
    }

    console.log(`\n🎉 Admin user ready!`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log(`\n💡 You can now sign in at: /api/auth/signin`);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};

// Main execution
const main = async () => {
  console.log("🚀 Creating first admin user...\n");

  // Check environment
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable not set");
    console.log("💡 Please set MONGODB_URI in your .env.local file");
    process.exit(1);
  }

  await connectDB();
  await createAdmin();

  // Close connection
  await mongoose.connection.close();
  console.log("\n✅ Script completed");
};

// Run the script
main().catch(console.error);
