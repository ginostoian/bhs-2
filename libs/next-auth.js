import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import config from "../config.js";
import connectMongo from "./mongo.js";
import connectMongoose from "./mongoose.js";
import User from "../models/User.js";

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
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "boolean" },
      },
      async authorize(credentials) {
        try {
          await connectMongoose();

          const { email, password, name, isSignUp } = credentials;

          if (!email || !password) {
            return null;
          }

          // Find user by email
          const user = await User.findOne({ email: email.toLowerCase() });

          if (isSignUp) {
            // Sign up flow
            if (user) {
              throw new Error("User with this email already exists");
            }

            // Create new user
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = await User.create({
              email: email.toLowerCase(),
              name,
              password: hashedPassword,
            });

            return {
              id: newUser._id.toString(),
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
            };
          } else {
            // Sign in flow
            if (!user || !user.password) {
              throw new Error("Invalid credentials");
            }

            const isValidPassword = await bcrypt.compare(
              password,
              user.password,
            );
            if (!isValidPassword) {
              throw new Error("Invalid credentials");
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image,
              projectStatus: user.projectStatus,
            };
          }
        } catch (error) {
          console.error("Credentials auth error:", error);
          throw error;
        }
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
      try {
        await connectMongoose();

        // If this is a Google OAuth sign in
        if (account?.provider === "google") {
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            // User exists - update with Google info if needed
            if (!existingUser.googleId) {
              await User.updateOne(
                { email: user.email },
                {
                  googleId: profile.sub,
                  image: profile.picture || existingUser.image,
                  name: user.name || existingUser.name,
                },
              );
            }
            return true;
          } else {
            // New user from Google - create with Google ID
            await User.create({
              email: user.email,
              name: user.name,
              image: user.picture,
              googleId: profile.sub,
            });
            return true;
          }
        }

        // For credentials provider, user is already created/validated
        return true;
      } catch (error) {
        console.error("Sign in callback error:", error);
        return false;
      }
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

        // Fetch user data from database to get the image and project status
        try {
          await connectMongoose();
          const user = await User.findOne({ email: session.user.email }).lean();
          if (user) {
            session.user.image = user.image;
            session.user.projectStatus = user.projectStatus;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
};
