import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import connectMongoose from "./mongoose";
import User from "@/models/User";

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  // Re-enable adapter for production stability
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    // Sign in callback - runs when user signs in
    signIn: async ({ user, account, profile }) => {
      // Always allow sign in, let the adapter handle user creation
      return true;
    },
    // JWT callback - runs when JWT is created/updated
    jwt: async ({ token, user, account }) => {
      // If user exists (first sign in), add role to token
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // Session callback - runs when session is checked
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.role = token.role;

        // Fetch user data from database to get the image
        try {
          await connectMongoose();
          const user = await User.findOne({ email: session.user.email }).lean();
          if (user) {
            session.user.image = user.image;
          }
        } catch (error) {
          console.error("Error fetching user image:", error);
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
};
