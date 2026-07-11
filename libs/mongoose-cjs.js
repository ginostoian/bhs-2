const mongoose = require("mongoose");

const connectMongo = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Add the MONGODB_URI environment variable inside .env.local to use mongoose",
    );
  }
  return mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    })
    .catch((e) => console.error("Mongoose Client Error: " + e.message));
};

module.exports = connectMongo;
