const mongoose = require("mongoose");
require("dotenv").config();

// Import the Store model
const Store = require("../models/Store").default;

const defaultStores = [
  { name: "Topps Tiles", color: "#8B4513" },
  { name: "Drench", color: "#6B7280" },
  { name: "Victorian Plumbing", color: "#6B7280" },
  { name: "Skirting World", color: "#8B5CF6" },
  { name: "Wickes", color: "#059669" },
  { name: "B&Q", color: "#DC2626" },
  { name: "Screwfix", color: "#EA580C" },
  { name: "Toolstation", color: "#2563EB" },
  { name: "Selco", color: "#7C3AED" },
  { name: "Travis Perkins", color: "#0891B2" },
];

async function seedStores() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing stores
    await Store.deleteMany({});
    console.log("Cleared existing stores");

    // Insert default stores
    const stores = await Store.insertMany(defaultStores);
    console.log(`Seeded ${stores.length} stores`);

    // List the created stores
    stores.forEach((store) => {
      console.log(`- ${store.name} (${store.color})`);
    });

    console.log("Store seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding stores:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seeding function
seedStores();
