import connectMongo from "./mongoose.js";

// Share Mongoose's native client instead of creating a second driver pool.
const client = process.env.MONGODB_URI
  ? {
      then(resolve, reject) {
        return connectMongo()
          .then((mongoose) => mongoose.connection.getClient())
          .then(resolve, reject);
      },
    }
  : undefined;

// The installed MongoDBAdapter starts its database promise in its constructor,
// not on its first operation. Defer construction too: JWT session checks and
// invalid credentials must not open a pool merely by importing authOptions.
export function lazyMongoAdapter(factory, sharedClient) {
  const methods = [
    "createUser",
    "getUser",
    "getUserByEmail",
    "getUserByAccount",
    "updateUser",
    "deleteUser",
    "linkAccount",
    "unlinkAccount",
    "getSessionAndUser",
    "createSession",
    "updateSession",
    "deleteSession",
    "createVerificationToken",
    "useVerificationToken",
  ];
  return Object.fromEntries(
    methods.map((method) => [
      method,
      async (...args) => {
        const connectedClient = await sharedClient;
        // A fresh lightweight adapter avoids retaining a failed connection promise;
        // its underlying sockets remain the one shared application pool.
        return factory(Promise.resolve(connectedClient))[method](...args);
      },
    ]),
  );
}
export default client;
