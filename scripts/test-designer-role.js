#!/usr/bin/env node

/**
 * Test Script for Designer Role
 * This script helps verify that the designer role is properly implemented
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("../models/User.js");
const Designer = require("../models/Designer.js");

async function testDesignerRole() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Check if designer role is in User model enum
    console.log("\n📋 Test 1: Checking User model role enum...");
    const userSchema = User.schema;
    const roleField = userSchema.paths.role;
    const enumValues = roleField.enumValues;

    if (enumValues.includes("designer")) {
      console.log("✅ Designer role is properly added to User model");
    } else {
      console.log("❌ Designer role is missing from User model");
    }

    // Test 2: Check if Designer model exists
    console.log("\n📋 Test 2: Checking Designer model...");
    try {
      const designerSchema = Designer.schema;
      const designerRoleField = designerSchema.paths.role;
      const designerEnumValues = designerRoleField.enumValues;

      if (designerEnumValues.includes("designer")) {
        console.log("✅ Designer model is properly configured");
      } else {
        console.log("❌ Designer model role enum is incorrect");
      }
    } catch (error) {
      console.log("❌ Designer model not found or has errors:", error.message);
    }

    // Test 3: Create a test designer user
    console.log("\n📋 Test 3: Creating test designer user...");
    try {
      // Check if test user already exists
      const existingUser = await User.findOne({
        email: "test-designer@example.com",
      });
      if (existingUser) {
        console.log("ℹ️  Test designer user already exists, updating role...");
        existingUser.role = "designer";
        await existingUser.save();
        console.log("✅ Test designer user role updated");
      } else {
        const testDesigner = new User({
          name: "Test Designer",
          email: "test-designer@example.com",
          role: "designer",
        });
        await testDesigner.save();
        console.log("✅ Test designer user created");
      }
    } catch (error) {
      console.log("❌ Error creating test designer user:", error.message);
    }

    // Test 4: Create a test designer record
    console.log("\n📋 Test 4: Creating test designer record...");
    try {
      // Check if test designer already exists
      const existingDesigner = await Designer.findOne({
        email: "test-designer@example.com",
      });
      if (existingDesigner) {
        console.log("ℹ️  Test designer record already exists");
      } else {
        const testDesigner = new Designer({
          name: "Test Designer",
          email: "test-designer@example.com",
          role: "designer",
          position: "Interior Designer",
          specializations: ["Kitchen Design", "Bathroom Design"],
          experienceLevel: "senior",
        });
        await testDesigner.save();
        console.log("✅ Test designer record created");
      }
    } catch (error) {
      console.log("❌ Error creating test designer record:", error.message);
    }

    // Test 5: Verify role-based access
    console.log("\n📋 Test 5: Testing role-based access...");
    const designerUser = await User.findOne({
      email: "test-designer@example.com",
    });
    if (designerUser && designerUser.role === "designer") {
      console.log("✅ Designer user has correct role");
      console.log(`   - Name: ${designerUser.name}`);
      console.log(`   - Email: ${designerUser.email}`);
      console.log(`   - Role: ${designerUser.role}`);
    } else {
      console.log("❌ Designer user not found or has incorrect role");
    }

    console.log("\n🎉 Designer role implementation test completed!");
    console.log("\n📝 Next steps:");
    console.log(
      "1. Test the designer routes: /designer, /designer/moodboards, /designer/products",
    );
    console.log(
      "2. Verify that designers can only access moodboards and products",
    );
    console.log("3. Confirm that designers cannot access admin-only features");
    console.log("4. Test creating and managing moodboards as a designer");
    console.log("5. Test product management as a designer");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("\n🔌 MongoDB connection closed");
  }
}

// Run the test
if (require.main === module) {
  testDesignerRole();
}

module.exports = testDesignerRole;
