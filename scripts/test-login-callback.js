const { MongoClient } = require("mongodb");

async function testLoginCallback() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db();
    const usersCollection = db.collection("users");

    // Get all users and their lastLoginAt
    const users = await usersCollection.find({}).toArray();

    console.log("Current users and their lastLoginAt:");
    users.forEach((user) => {
      console.log(
        `${user.name || "Unknown"} (${user.email}): ${user.lastLoginAt || "Never"}`,
      );
    });

    // Test updating lastLoginAt for a user
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\nTesting update for user: ${testUser.email}`);

      const result = await usersCollection.updateOne(
        { _id: testUser._id },
        { $set: { lastLoginAt: new Date() } },
      );

      console.log(
        `Update result: ${result.modifiedCount} document(s) modified`,
      );

      // Check the updated user
      const updatedUser = await usersCollection.findOne({ _id: testUser._id });
      console.log(`Updated lastLoginAt: ${updatedUser.lastLoginAt}`);
    }

    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

testLoginCallback();
