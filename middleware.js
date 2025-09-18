import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware for route protection
 * Handles authentication and role-based access control
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Admin routes - require admin role
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        // Redirect non-admin users to sign in page
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Employee routes - require employee role
    if (pathname.startsWith("/employee")) {
      if (token?.role !== "employee") {
        // Redirect non-employee users to sign in page
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Designer routes - require designer role
    if (pathname.startsWith("/designer")) {
      if (token?.role !== "designer") {
        // Redirect non-designer users to sign in page
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Dashboard routes - require authentication (any role)
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        // Redirect unauthenticated users to sign in page
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware on specified paths
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Run middleware for admin, employee, designer, and dashboard routes
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/employee") ||
          pathname.startsWith("/designer") ||
          pathname.startsWith("/dashboard")
        ) {
          return !!token; // Return true if token exists
        }

        return true; // Allow access to other routes
      },
    },
  },
);

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
    "/designer/:path*",
    "/dashboard/:path*",
  ],
};
