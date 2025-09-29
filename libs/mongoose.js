import mongoose from "mongoose";

const connectMongo = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Add the MONGODB_URI environment variable inside .env.local to use mongoose",
    );
  }

  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Check if connection is in progress
  if (mongoose.connection.readyState === 2) {
    return new Promise((resolve, reject) => {
      mongoose.connection.once("connected", () => resolve(mongoose));
      mongoose.connection.once("error", reject);
    });
  }

  return mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((e) => {
      console.error("Mongoose Client Error: " + e.message);
      throw e;
    });
};

export default connectMongo;
