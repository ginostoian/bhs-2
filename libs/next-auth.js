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
        isSetPassword: { label: "Is Set Password", type: "boolean" },
      },
      async authorize(credentials) {
        try {
          await connectMongoose();

          const { email, password, name, isSignUp, isSetPassword } =
            credentials;

          // Convert boolean flags if they're strings
          const isSignUpBool = isSignUp === true || isSignUp === "true";
          const isSetPasswordBool =
            isSetPassword === true || isSetPassword === "true";

          if (!email || !password) {
            return null;
          }

          // Find user by email - explicitly select password field
          const user = await User.findOne({
            email: email.toLowerCase(),
          }).select("+password");

          if (isSignUpBool) {
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
          } else if (isSetPasswordBool) {
            // Set password flow
            if (!user) {
              throw new Error("User not found");
            }

            if (user.password) {
              throw new Error("User already has a password set");
            }

            // Set password for existing user
            const hashedPassword = await bcrypt.hash(password, 12);
            await User.updateOne(
              { email: email.toLowerCase() },
              { password: hashedPassword },
            );

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image,
              projectStatus: user.projectStatus,
            };
          } else {
            // Sign in flow
            if (!user) {
              throw new Error("Invalid credentials");
            }

            if (!user.password) {
              // If user has Google ID, they should use Google sign-in
              if (user.googleId) {
                throw new Error(
                  "This email is registered with Google. Please sign in with Google instead.",
                );
              }

              // If user has no password and no Google ID, they need to set a password
              throw new Error(
                "Account exists but no password is set. You can set a password using the 'Set Password' option below.",
              );
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
        // Update lastLoginAt for the user
        if (user?.email) {
          await connectMongoose();
          // Find user by email since the ID might not be the MongoDB ObjectId
          const userToUpdate = await User.findOne({ email: user.email });
          if (userToUpdate) {
            await User.findByIdAndUpdate(userToUpdate._id, {
              lastLoginAt: new Date(),
            });
            console.log(`✅ Updated lastLoginAt for user: ${user.email}`);
          } else {
            console.log(`⚠️ User not found for email: ${user.email}`);
          }
        }
      } catch (error) {
        console.error("Error updating lastLoginAt:", error);
        // Don't fail the sign in if this fails
      }

      // Always allow sign in - let the adapter handle user creation and linking
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
