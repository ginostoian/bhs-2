const dotenv = require("dotenv");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testMailgun() {
  console.log("🧪 Testing Mailgun Configuration...\n");

  // Check if API key is set
  if (!process.env.MAILGUN_API_KEY) {
    console.error("❌ MAILGUN_API_KEY not found in environment variables");
    console.log(
      "Please add MAILGUN_API_KEY=key-your-api-key to your .env.local file",
    );
    return;
  }

  console.log("✅ MAILGUN_API_KEY found");

  // Initialize Mailgun
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
  });

  // Test email sending
  try {
    console.log("📧 Sending test email...");

    const data = {
      from: "Better Homes Studio <contact@sandbox401be979b866459a8815c00e80c5e1de.mailgun.org>",
      to: ["contact@celli.co.uk"], // Replace with your email for testing
      subject: "Mailgun Test - Better Homes Studio",
      text: "Mailgun Test Successful! This is a test email from your Better Homes Studio email system.",
      html: `
        <h2>🎉 Mailgun Test Successful!</h2>
        <p>This is a test email from your Better Homes Studio email system.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this email, your Mailgun configuration is working correctly!</p>
      `,
    };

    const domain =
      process.env.MAILGUN_DOMAIN ||
      "sandbox401be979b866459a8815c00e80c5e1de.mailgun.org";

    console.log(`📧 Using domain: ${domain}`);
    console.log(`📧 From: ${data.from}`);
    console.log(`📧 To: ${data.to[0]}`);

    const result = await mg.messages.create(domain, data);

    console.log("✅ Email sent successfully!");
    console.log(`📊 Message ID: ${result.id}`);
    console.log(`📧 Recipient: ${data.to[0]}`);
    console.log(`📅 Sent at: ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error("❌ Error testing email:", error.message);
    console.error("📋 Full error details:", error);

    if (error.message.includes("Forbidden")) {
      console.log("\n🔍 Forbidden error usually means:");
      console.log("   1. Email not authorized as recipient (most likely)");
      console.log("   2. API key doesn't have sending permissions");
      console.log("\n💡 To fix:");
      console.log(
        "   1. Go to Mailgun dashboard → Sending → Authorized Recipients",
      );
      console.log("   2. Add 'contact@celli.co.uk' as authorized recipient");
      console.log("   3. Check your email and click verification link");
    }
    if (error.message.includes("Recipient not authorized")) {
      console.log(
        "\n💡 Tip: Add your email to authorized recipients in Mailgun dashboard",
      );
      console.log("   Go to: Sending → Authorized Recipients → Add Recipient");
      console.log("   Add this email: contact@celli.co.uk");
    }
    if (error.message.includes("Invalid API key")) {
      console.log("\n💡 Tip: Check your MAILGUN_API_KEY in .env.local file");
      console.log("   Make sure it starts with 'key-' and is correct");
    }
  }
}

// Run the test
testMailgun().catch(console.error);
