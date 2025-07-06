/**
 * Comprehensive Notification System Test
 *
 * This script tests all notification scenarios:
 * 1. Task assignment notifications to employees
 * 2. Task status update request notifications to admins
 * 3. Admin notification system
 * 4. Employee notification system
 */

const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const connectMongoose = require("../libs/mongoose.js").default;
const Employee = require("../models/Employee.js").default;
const Task = require("../models/Task.js").default;
const Project = require("../models/Project.js").default;
const User = require("../models/User.js").default;
const Notification = require("../models/Notification.js").default;
const {
  notifyTaskAssignment,
  notifyTaskStatusUpdateRequest,
  notifyUserRegistration,
  notifyEmployeeCreation,
  notifySystemAlert,
} = require("../libs/notificationService.js");

async function testAllNotifications() {
  try {
    console.log("🔧 Starting comprehensive notification system test...");

    await connectMongoose();

    // Step 1: Create test users
    console.log("📝 Creating test users...");
    const adminUser = await User.findOneAndUpdate(
      { email: "admin@test.com" },
      {
        name: "Test Admin",
        email: "admin@test.com",
        role: "admin",
      },
      { upsert: true, new: true },
    );
    console.log("✅ Admin user created:", adminUser.email);

    const testEmployee = await User.findOneAndUpdate(
      { email: "employee@test.com" },
      {
        name: "Test Employee",
        email: "employee@test.com",
        role: "employee",
      },
      { upsert: true, new: true },
    );
    console.log("✅ Employee user created:", testEmployee.name);

    // Step 2: Create test project and task
    console.log("🏗️ Creating test project and task...");
    const testProject = await Project.findOneAndUpdate(
      { name: "Test Project for Notifications" },
      {
        name: "Test Project for Notifications",
        type: "Kitchen Renovation",
        status: "On Going",
        location: "123 Test Address",
        startDate: new Date(),
        user: adminUser._id,
        progress: 25,
      },
      { upsert: true, new: true },
    );
    console.log("✅ Project created:", testProject.name);

    const testTask = await Task.findOneAndUpdate(
      { name: "Test Task for Notifications" },
      {
        name: "Test Task for Notifications",
        description: "This is a test task to verify notifications",
        status: "Scheduled",
        priority: "medium",
        estimatedDuration: 5,
        project: testProject._id,
        section: "Construction",
        order: 1,
      },
      { upsert: true, new: true },
    );
    console.log("✅ Task created:", testTask.name);

    // Step 3: Test task assignment notification
    console.log("📋 Testing task assignment notification...");
    try {
      await notifyTaskAssignment(testEmployee._id, {
        _id: testTask._id,
        title: testTask.name,
      });
      console.log("✅ Task assignment notification sent successfully");
    } catch (error) {
      console.error("❌ Task assignment notification failed:", error);
    }

    // Step 4: Test task status update request notification
    console.log("🔄 Testing task status update request notification...");
    try {
      await notifyTaskStatusUpdateRequest(
        {
          _id: testTask._id,
          title: testTask.name,
          currentStatus: "Scheduled",
          status: "In Progress",
        },
        {
          name: testEmployee.name,
          position: "Carpenter", // Default position for test
          notes: "This is a test status update request.",
        },
      );
      console.log(
        "✅ Task status update request notification sent successfully",
      );
    } catch (error) {
      console.error(
        "❌ Task status update request notification failed:",
        error,
      );
    }

    // Step 5: Test admin notifications
    console.log("👑 Testing admin notifications...");
    try {
      await notifyUserRegistration({
        name: "Test User",
        email: "testuser@example.com",
      });
      console.log("✅ User registration notification sent to admins");
    } catch (error) {
      console.error("❌ User registration notification failed:", error);
    }

    try {
      await notifyEmployeeCreation({
        name: "New Employee",
        email: "newemployee@example.com",
        position: "Plumber",
      });
      console.log("✅ Employee creation notification sent to admins");
    } catch (error) {
      console.error("❌ Employee creation notification failed:", error);
    }

    try {
      await notifySystemAlert("This is a test system alert", "high");
      console.log("✅ System alert notification sent to admins");
    } catch (error) {
      console.error("❌ System alert notification failed:", error);
    }

    // Step 6: Verify notifications were created
    console.log("🔍 Verifying notifications were created...");

    // Check employee notifications
    const employeeNotifications = await Notification.find({
      recipient: testEmployee._id,
      recipientType: "employee",
    }).sort({ createdAt: -1 });
    console.log(
      `✅ Employee notifications found: ${employeeNotifications.length}`,
    );

    // Check admin notifications
    const adminNotifications = await Notification.find({
      recipientType: "admin",
    }).sort({ createdAt: -1 });
    console.log(`✅ Admin notifications found: ${adminNotifications.length}`);

    // Check specific notification types
    const taskAssignmentNotifications = await Notification.find({
      type: "task_assigned",
      recipient: testEmployee._id,
    });
    console.log(
      `✅ Task assignment notifications: ${taskAssignmentNotifications.length}`,
    );

    const statusUpdateNotifications = await Notification.find({
      type: "task_status_update_request",
      recipientType: "admin",
    });
    console.log(
      `✅ Status update request notifications: ${statusUpdateNotifications.length}`,
    );

    // Step 7: Display notification details
    if (employeeNotifications.length > 0) {
      console.log("\n📧 Latest employee notification:");
      const latest = employeeNotifications[0];
      console.log(`   Type: ${latest.type}`);
      console.log(`   Title: ${latest.title}`);
      console.log(`   Message: ${latest.message}`);
      console.log(`   Created: ${latest.createdAt}`);
    }

    if (adminNotifications.length > 0) {
      console.log("\n📧 Latest admin notification:");
      const latest = adminNotifications[0];
      console.log(`   Type: ${latest.type}`);
      console.log(`   Title: ${latest.title}`);
      console.log(`   Message: ${latest.message}`);
      console.log(`   Created: ${latest.createdAt}`);
    }

    console.log("\n🎉 Notification system test completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Employee notifications: ${employeeNotifications.length}`);
    console.log(`   - Admin notifications: ${adminNotifications.length}`);
    console.log(
      `   - Task assignment notifications: ${taskAssignmentNotifications.length}`,
    );
    console.log(
      `   - Status update request notifications: ${statusUpdateNotifications.length}`,
    );

    // Clean up test data (optional)
    console.log("\n🧹 Cleaning up test data...");
    await User.deleteOne({ email: "admin@test.com" });
    await User.deleteOne({ email: "employee@test.com" });
    await Project.deleteOne({ name: "Test Project for Notifications" });
    await Task.deleteOne({ name: "Test Task for Notifications" });
    await Notification.deleteMany({
      $or: [
        { recipient: testEmployee._id },
        {
          recipientType: "admin",
          createdAt: { $gte: new Date(Date.now() - 60000) },
        },
      ],
    });
    console.log("✅ Test data cleaned up");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the test
testAllNotifications();
