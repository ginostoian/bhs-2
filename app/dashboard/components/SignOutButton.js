"use client";

import { signOut } from "next-auth/react";

/**
 * Sign Out Button Component
 * Provides a button to sign out the current user
 */
export default function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Sign Out
    </button>
  );
}
