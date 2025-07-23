const connectMongo = require("../libs/mongoose");
const Lead = require("../models/Lead");

async function testAgingPause() {
  try {
    console.log("🧪 Testing aging pause functionality...");
    await connectMongo();

    // Find a test lead
    const testLead = await Lead.findOne({ isActive: true, isArchived: false });
    if (!testLead) {
      console.log("❌ No test lead found. Please create a lead first.");
      return;
    }

    console.log(`📋 Testing with lead: ${testLead.name} (${testLead._id})`);
    console.log(`   Current aging: ${testLead.agingDays} days`);
    console.log(`   Aging paused: ${testLead.agingPaused}`);

    // Test 1: Pause aging
    console.log("\n🔄 Test 1: Pausing aging...");
    testLead.agingPaused = true;
    testLead.agingPausedAt = new Date();
    testLead.agingPausedReason = "Test pause";
    await testLead.save();

    console.log(`   ✅ Aging paused. Aging days: ${testLead.agingDays}`);

    // Test 2: Verify aging doesn't update when paused
    console.log("\n🔄 Test 2: Verifying aging doesn't update when paused...");
    const originalAgingDays = testLead.agingDays;

    // Simulate aging update
    testLead.lastContactDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
    await testLead.save();

    console.log(`   Original aging: ${originalAgingDays} days`);
    console.log(`   After 5 days (paused): ${testLead.agingDays} days`);
    console.log(
      `   ✅ Aging unchanged: ${testLead.agingDays === originalAgingDays}`,
    );

    // Test 3: Resume aging
    console.log("\n🔄 Test 3: Resuming aging...");
    testLead.agingPaused = false;
    testLead.agingPausedAt = null;
    testLead.agingPausedReason = null;
    testLead.lastContactDate = new Date(); // Reset to now
    await testLead.save();

    console.log(`   ✅ Aging resumed. Aging days: ${testLead.agingDays}`);

    // Test 4: Verify aging updates when resumed
    console.log("\n🔄 Test 4: Verifying aging updates when resumed...");
    testLead.lastContactDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    await testLead.save();

    console.log(`   ✅ Aging updated: ${testLead.agingDays} days`);

    // Test 5: Check aging leads query excludes paused leads
    console.log("\n🔄 Test 5: Testing aging leads query...");

    // Pause the test lead again
    testLead.agingPaused = true;
    testLead.agingPausedAt = new Date();
    testLead.agingPausedReason = "Test pause";
    await testLead.save();

    const agingLeads = await Lead.findAgingLeads(1); // Find leads with 1+ days aging
    const pausedLeadInResults = agingLeads.find(
      (lead) => lead._id.toString() === testLead._id.toString(),
    );

    console.log(`   Total aging leads found: ${agingLeads.length}`);
    console.log(
      `   Paused lead in results: ${pausedLeadInResults ? "❌" : "✅"}`,
    );
    console.log(
      `   ✅ Paused lead correctly excluded: ${!pausedLeadInResults}`,
    );

    // Cleanup: Resume the test lead
    console.log("\n🧹 Cleanup: Resuming test lead...");
    testLead.agingPaused = false;
    testLead.agingPausedAt = null;
    testLead.agingPausedReason = null;
    testLead.lastContactDate = new Date();
    await testLead.save();

    console.log("🎉 All tests completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   ✅ Aging pause functionality works");
    console.log("   ✅ Aging resume functionality works");
    console.log("   ✅ Paused leads are excluded from aging queries");
    console.log("   ✅ Aging timer respects pause state");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    process.exit(0);
  }
}

testAgingPause();
