const dotenv = require("dotenv");
const { Resend } = require("resend");

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testResend() {
  console.log("🧪 Testing Resend Configuration...\n");

  // Check if API key is set
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY not found in environment variables");
    console.log(
      "Please add RESEND_API_KEY=re_your-actual-api-key to your .env.local file",
    );
    return;
  }

  console.log("✅ RESEND_API_KEY found");

  // Initialize Resend
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Test email sending
  try {
    console.log("📧 Sending test email...");

    const data = {
      from: "Better Homes <info@mail.bhstudio.co.uk>", // Try a different sender address
      to: ["contact@celli.co.uk"], // Replace with your email for testing
      subject: "Resend Test - Better Homes",
      text: "Resend Test Successful! This is a test email from your Better Homes email system.",
      html: `
        <h2>🎉 Resend Test Successful!</h2>
        <p>This is a test email from your Better Homes email system.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this email, your Resend configuration is working correctly!</p>
      `,
    };

    console.log(`📧 From: ${data.from}`);
    console.log(`📧 To: ${data.to[0]}`);

    const result = await resend.emails.send(data);

    console.log("✅ Email sent successfully!");
    console.log(`📊 Full result:`, JSON.stringify(result, null, 2));
    console.log(`📊 Message ID: ${result.id || "Not provided"}`);
    console.log(`📧 Recipient: ${data.to[0]}`);
    console.log(`📅 Sent at: ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error("❌ Error testing email:", error.message);
    console.error("📋 Full error details:", error);

    if (error.message.includes("Invalid API key")) {
      console.log("\n💡 Tip: Check your RESEND_API_KEY in .env.local file");
      console.log("   Make sure it starts with 're_' and is correct");
    }
  }
}

// Run the test
testResend().catch(console.error);
