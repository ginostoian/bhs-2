import mongoose from "mongoose";

const connectMongo = async () => {
  console.log("=== MONGOOSE CONNECTION ATTEMPT ===");
  console.log("Environment:", process.env.NODE_ENV);
  console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);
  console.log("Current connection state:", mongoose.connection.readyState);

  if (!process.env.MONGODB_URI) {
    const error = new Error(
      "Add the MONGODB_URI environment variable inside .env.local to use mongoose",
    );
    console.error("❌ MongoDB URI not found:", error.message);
    throw error;
  }

  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log("✅ Already connected to MongoDB");
    return mongoose;
  }

  // Check if connection is in progress
  if (mongoose.connection.readyState === 2) {
    console.log("⏳ Connection in progress, waiting...");
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("MongoDB connection timeout"));
      }, 10000); // 10 second timeout

      mongoose.connection.once("connected", () => {
        clearTimeout(timeout);
        console.log("✅ MongoDB connected after waiting");
        resolve(mongoose);
      });
      mongoose.connection.once("error", (err) => {
        clearTimeout(timeout);
        console.error("❌ MongoDB connection error:", err);
        reject(err);
      });
    });
  }

  console.log("🔄 Attempting to connect to MongoDB...");
  return mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    })
    .catch((e) => {
      console.error("❌ Mongoose Client Error:", e.message);
      console.error("Error details:", {
        name: e.name,
        code: e.code,
        stack: e.stack,
      });
      throw e;
    });
};

export default connectMongo;
