import connectMongoose from "../libs/mongoose.js";
import ProjectChange from "../models/ProjectChange.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

/**
 * Test script to verify project change notifications
 */
async function testProjectChangeNotifications() {
  try {
    await connectMongoose();
    console.log("✅ Connected to MongoDB");

    // Find a test user and project
    const user = await User.findOne().lean();
    const project = await Project.findOne().lean();

    if (!user || !project) {
      console.log("❌ No users or projects found for testing");
      return;
    }

    console.log(`📋 Testing with user: ${user.name} (${user.email})`);
    console.log(`🏗️ Testing with project: ${project.name}`);

    // Create a test project change
    const testChange = new ProjectChange({
      project: project._id,
      user: user._id,
      name: "Test Change Request",
      description: "This is a test change request",
      cost: 150.0,
      type: "Labour",
      includedInPaymentPlan: "Not Included",
      adminNotes: "Test admin notes",
    });

    console.log("📝 Creating test project change...");
    await testChange.save();
    console.log("✅ Test project change created successfully");

    // Check if notification was created
    const notifications = await Notification.find({
      recipient: user._id,
      type: "project_change_added",
    }).lean();

    console.log(
      `🔔 Found ${notifications.length} notifications for this change`,
    );

    if (notifications.length > 0) {
      console.log("📧 Notification details:");
      notifications.forEach((notif, index) => {
        console.log(`  ${index + 1}. ${notif.title}: ${notif.message}`);
        console.log(`     Type: ${notif.type}, Priority: ${notif.priority}`);
        console.log(`     Created: ${notif.createdAt}`);
      });
    }

    // Check user's project status
    console.log(`👤 User project status: ${user.projectStatus}`);
    console.log(
      `📊 Should receive notifications: ${["Lead", "On Going"].includes(user.projectStatus)}`,
    );

    // Clean up test data
    console.log("🧹 Cleaning up test data...");
    await ProjectChange.findByIdAndDelete(testChange._id);
    await Notification.deleteMany({
      recipient: user._id,
      type: "project_change_added",
      "metadata.changeId": testChange._id,
    });
    console.log("✅ Test data cleaned up");
  } catch (error) {
    console.error("❌ Error during testing:", error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testProjectChangeNotifications();
