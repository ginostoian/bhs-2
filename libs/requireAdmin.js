import { getToken } from "next-auth/jwt";
import { authOptions } from "./next-auth";

/**
 * Utility function to require admin role in API routes
 * Throws error if user is not admin, returns user session if admin
 *
 * @param {Object} req - Next.js request object
 * @returns {Object} User session object
 * @throws {Error} If user is not authenticated or not admin
 */
export async function requireAdmin(req) {
  // Get user token from NextAuth JWT
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if user is authenticated
  if (!token) {
    throw new Error("Authentication required");
  }

  // Check if user has admin role
  if (token.role !== "admin") {
    throw new Error("Admin access required");
  }

  return {
    user: {
      id: token.sub,
      email: token.email,
      name: token.name,
      role: token.role,
    },
  };
}

/**
 * Utility function to require authentication in API routes
 * Throws error if user is not authenticated, returns user session if authenticated
 *
 * @param {Object} req - Next.js request object
 * @returns {Object} User session object
 * @throws {Error} If user is not authenticated
 */
export async function requireAuth(req) {
  // Get user token from NextAuth JWT
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if user is authenticated
  if (!token) {
    throw new Error("Authentication required");
  }

  return {
    user: {
      id: token.sub,
      email: token.email,
      name: token.name,
      role: token.role,
    },
  };
}
