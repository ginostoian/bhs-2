import { getToken } from "next-auth/jwt";
import { authOptions } from "./next-auth";

/**
 * Utility function to require designer role in API routes
 * Throws error if user is not designer, returns user session if designer
 *
 * @param {Object} req - Next.js request object
 * @returns {Object} User session object
 * @throws {Error} If user is not authenticated or not designer
 */
export async function requireDesigner(req) {
  // Get user token from NextAuth JWT
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if user is authenticated
  if (!token) {
    throw new Error("Authentication required");
  }

  // Check if user has designer role
  if (token.role !== "designer") {
    throw new Error("Designer access required");
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
 * Utility function to require designer or admin role in API routes
 * Throws error if user is not designer or admin, returns user session if authorized
 *
 * @param {Object} req - Next.js request object
 * @returns {Object} User session object
 * @throws {Error} If user is not authenticated or not designer/admin
 */
export async function requireDesignerOrAdmin(req) {
  // Get user token from NextAuth JWT
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if user is authenticated
  if (!token) {
    throw new Error("Authentication required");
  }

  // Check if user has designer or admin role
  if (token.role !== "designer" && token.role !== "admin") {
    throw new Error("Designer or admin access required");
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
