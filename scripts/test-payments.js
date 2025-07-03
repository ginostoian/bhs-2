const mongoose = require("mongoose");
require("dotenv").config();

// Import the Payment model
const Payment = require("../models/Payment").default;

async function testPayments() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Test 1: Create a test payment
    console.log("\n=== Test 1: Creating test payment ===");
    const testPayment = await Payment.create({
      user: "507f1f77bcf86cd799439011", // Replace with actual user ID
      name: "Test Payment",
      dueDate: new Date("2024-12-31"),
      status: "Scheduled",
    });
    console.log("Created payment:", testPayment);

    // Test 2: Update status based on due date
    console.log("\n=== Test 2: Testing status update ===");
    const payment = await Payment.findById(testPayment._id);
    const oldStatus = payment.status;
    payment.updateStatus();
    console.log(`Status changed from ${oldStatus} to ${payment.status}`);

    // Test 3: Test auto-incrementing payment number
    console.log("\n=== Test 3: Testing payment number auto-increment ===");
    const payment2 = await Payment.create({
      user: "507f1f77bcf86cd799439011", // Same user
      name: "Test Payment 2",
      dueDate: new Date("2024-12-31"),
    });
    console.log(`Payment 1 number: ${testPayment.paymentNumber}`);
    console.log(`Payment 2 number: ${payment2.paymentNumber}`);

    // Test 4: Update all statuses
    console.log("\n=== Test 4: Testing bulk status update ===");
    await Payment.updateAllStatuses();
    console.log("Bulk status update completed");

    // Clean up
    await Payment.deleteMany({ name: { $regex: /^Test Payment/ } });
    console.log("\n=== Cleanup completed ===");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

testPayments();
