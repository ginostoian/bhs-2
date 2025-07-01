import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
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
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(connectMongo
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: config.mailgun.fromNoReply,
          }),
        ]
      : []),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  // Re-enable adapter for production stability
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
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
      }
      return session;
    },
    // Sign in callback - runs when user signs in
    signIn: async ({ user, account, profile }) => {
      try {
        // Connect to MongoDB using mongoose
        await connectMongoose();

        // Check if user exists in our User model
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Create new user if they don't exist
          dbUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            role: "user", // Default role for new users
          });
          console.log("✅ Created new user:", dbUser.email);
        } else {
          console.log("✅ Found existing user:", dbUser.email);
        }

        // Update user object with role from database
        user.role = dbUser.role;
        user.id = dbUser._id.toString();

        return true;
      } catch (error) {
        console.error("❌ Sign in callback error:", error);
        // Don't block sign in on error, just log it
        return true;
      }
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
