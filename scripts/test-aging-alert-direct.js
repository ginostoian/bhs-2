require("dotenv").config({ path: ".env.local" });

async function testAgingAlertDirect() {
  try {
    console.log("🧪 Testing aging alert API directly...");

    // Test the API endpoint directly
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/crm/notifications/aging-leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("📧 Response status:", response.status);
    console.log(
      "📧 Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Aging alert API test successful:");
      console.log("   Message:", data.message);
      if (data.details) {
        console.log("   Details:", JSON.stringify(data.details, null, 2));
      }
    } else {
      const errorData = await response.text();
      console.log("❌ Aging alert API test failed:");
      console.log("   Status:", response.status);
      console.log("   Error response:", errorData);
    }
  } catch (error) {
    console.error("❌ Error testing aging alert:", error);
  } finally {
    process.exit(0);
  }
}

testAgingAlertDirect();
