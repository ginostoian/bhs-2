import mongoose from "mongoose";

mongoose.set("strictPopulate", false);
// Cache the in-flight connection as well as the connected driver. Concurrent
// requests must not create pools or accumulate connected/error listeners.
const cache =
  globalThis.__bhsMongoose || (globalThis.__bhsMongoose = { promise: null });
export default async function connectMongo() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        maxPoolSize: 5,
        minPoolSize: 0,
        maxConnecting: 1,
        maxIdleTimeMS: 30000,
        waitQueueTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        appName: "better-homes-web",
      })
      .then(() => mongoose)
      .catch((error) => {
        cache.promise = null;
        throw error;
      })
      .finally(() => {
        cache.promise = null;
      });
  }
  return cache.promise;
}
