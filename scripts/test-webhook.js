const axios = require("axios");
require("dotenv").config();

/**
 * Test script for the Resend webhook endpoint
 * This simulates an inbound email from a lead
 */

const WEBHOOK_URL = "http://localhost:3000/api/webhook/resend/inbound";

// Sample webhook payload from Resend
const testWebhookPayload = {
  from: "test@example.com",
  to: "contact@bhstudio.co.uk",
  subject: "Re: Your Kitchen Renovation Quote",
  text: "Hi Gino, thanks for the quote. I have a few questions about the timeline and materials used. Can we discuss this further?",
  html: "<p>Hi Gino, thanks for the quote. I have a few questions about the timeline and materials used. Can we discuss this further?</p>",
  headers: {
    "message-id": "test-message-id-123",
    date: new Date().toISOString(),
  },
  created_at: new Date().toISOString(),
};

async function testWebhook() {
  try {
    console.log("🧪 Testing webhook endpoint...");
    console.log("📧 Sending test email payload:");
    console.log(JSON.stringify(testWebhookPayload, null, 2));

    const response = await axios.post(WEBHOOK_URL, testWebhookPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Webhook test successful!");
    console.log("📊 Response:", response.data);
  } catch (error) {
    console.error("❌ Webhook test failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Run the test
testWebhook();
