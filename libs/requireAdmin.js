import { getServerSession } from "next-auth/next";
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
  // Get user session from NextAuth
  const session = await getServerSession(req, authOptions);

  // Check if user is authenticated
  if (!session) {
    throw new Error("Authentication required");
  }

  // Check if user has admin role
  if (session.user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return session;
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
  // Get user session from NextAuth
  const session = await getServerSession(req, authOptions);

  // Check if user is authenticated
  if (!session) {
    throw new Error("Authentication required");
  }

  return session;
}
