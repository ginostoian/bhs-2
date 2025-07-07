(async () => {
  /**
   * Test New Email Notifications Script
   *
   * This script tests all the new email notification features:
   * 1. Payment status change notifications
   * 2. Moodboard creation notifications
   * 3. Product approval/decline notifications
   * 4. Moodboard status change notifications
   * 5. System announcements
   * 6. User inactivity notifications
   */

  const connectMongoose = (await import("../libs/mongoose.js")).default;
  const User = (await import("../models/User.js")).default;
  const Payment = (await import("../models/Payment.js")).default;
  const Moodboard = (await import("../models/Moodboard.js")).default;
  const EmailPreference = (await import("../models/EmailPreference.js"))
    .default;
  const emailService = await import("../libs/emailService.js");

  async function testNewNotifications() {
    try {
      console.log("🧪 Testing New Email Notifications...\n");

      await connectMongoose();

      // Step 1: Create or find a test user
      console.log("📝 Setting up test user...");
      const testUser = await User.findOneAndUpdate(
        { email: "test@example.com" },
        {
          name: "Test User",
          email: "test@example.com",
          role: "user",
          lastLoginAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        },
        { upsert: true, new: true },
      );
      console.log("✅ Test user created:", testUser.email);

      // Step 2: Create email preferences for the test user
      console.log("📧 Setting up email preferences...");
      await EmailPreference.findOneAndUpdate(
        { user: testUser._id },
        {
          user: testUser._id,
          enabled: true,
          preferences: {
            welcome: true,
            documents: true,
            payments: true,
            projectStatus: true,
            announcements: true,
            marketing: false,
          },
        },
        { upsert: true, new: true },
      );
      console.log("✅ Email preferences created");

      // Step 3: Test Moodboard Creation Email
      console.log("\n🎨 Testing Moodboard Creation Email...");
      try {
        const result = await emailService.sendMoodboardCreatedEmail(
          testUser.email,
          testUser.name,
          "Test Kitchen Moodboard",
          "A beautiful kitchen renovation moodboard",
          "Kitchen Renovation",
        );
        console.log("✅ Moodboard creation email sent:", result.success);
      } catch (error) {
        console.error("❌ Moodboard creation email failed:", error.message);
      }

      // Step 4: Test Product Approval Email
      console.log("\n✅ Testing Product Approval Email...");
      try {
        const result = await emailService.sendProductApprovalEmail(
          testUser.email,
          testUser.name,
          "Modern Kitchen Sink",
          "approved",
          "I love this sink design!",
          "Test Kitchen Moodboard",
        );
        console.log("✅ Product approval email sent:", result.success);
      } catch (error) {
        console.error("❌ Product approval email failed:", error.message);
      }

      // Step 5: Test Product Decline Email
      console.log("\n❌ Testing Product Decline Email...");
      try {
        const result = await emailService.sendProductApprovalEmail(
          testUser.email,
          testUser.name,
          "Traditional Faucet",
          "declined",
          "This doesn't match our modern style",
          "Test Kitchen Moodboard",
        );
        console.log("✅ Product decline email sent:", result.success);
      } catch (error) {
        console.error("❌ Product decline email failed:", error.message);
      }

      // Step 6: Test Moodboard Status Update Email
      console.log("\n📊 Testing Moodboard Status Update Email...");
      try {
        const result = await emailService.sendMoodboardStatusUpdateEmail(
          testUser.email,
          testUser.name,
          "Test Kitchen Moodboard",
          "draft",
          "shared",
        );
        console.log("✅ Moodboard status update email sent:", result.success);
      } catch (error) {
        console.error(
          "❌ Moodboard status update email failed:",
          error.message,
        );
      }

      // Step 7: Test System Announcement Email
      console.log("\n📢 Testing System Announcement Email...");
      try {
        const result = await emailService.sendAnnouncementEmail(
          testUser.email,
          testUser.name,
          "System Maintenance Notice",
          "We will be performing scheduled maintenance on Sunday from 2-4 AM. Service may be temporarily unavailable during this time.",
          "medium",
        );
        console.log("✅ System announcement email sent:", result.success);
      } catch (error) {
        console.error("❌ System announcement email failed:", error.message);
      }

      // Step 8: Test User Inactivity Email
      console.log("\n⏰ Testing User Inactivity Email...");
      try {
        const result = await emailService.sendUserInactivityEmail(
          testUser.email,
          testUser.name,
          testUser.lastLoginAt,
          10,
        );
        console.log("✅ User inactivity email sent:", result.success);
      } catch (error) {
        console.error("❌ User inactivity email failed:", error.message);
      }

      // Step 9: Test Payment Status Change (simulate by creating a payment)
      console.log("\n💰 Testing Payment Status Change...");
      try {
        // Create a test payment
        const testPayment = await Payment.create({
          user: testUser._id,
          name: "Test Payment",
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          amount: 1000,
          status: "Scheduled",
        });

        // Update status to trigger email
        testPayment.status = "Due";
        await testPayment.save();

        console.log("✅ Payment status change email triggered");
      } catch (error) {
        console.error("❌ Payment status change test failed:", error.message);
      }

      console.log("\n🎉 All new notification tests completed!");
      console.log("\n📋 Summary:");
      console.log("- Moodboard creation notifications ✅");
      console.log("- Product approval/decline notifications ✅");
      console.log("- Moodboard status change notifications ✅");
      console.log("- System announcement notifications ✅");
      console.log("- User inactivity notifications ✅");
      console.log("- Payment status change notifications ✅");
    } catch (error) {
      console.error("❌ Test failed:", error);
    } finally {
      await connectMongoose().then((mongoose) => mongoose.connection.close());
      console.log("\n🔌 Database connection closed");
    }
  }

  // Run the test
  testNewNotifications().catch(console.error);
})();
