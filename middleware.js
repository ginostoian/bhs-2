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
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
      }
    }

    // Dashboard routes - require authentication (any role)
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        // Redirect unauthenticated users to sign in page
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware on specified paths
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Run middleware for admin and dashboard routes
        if (
          pathname.startsWith("/admin") ||
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
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
