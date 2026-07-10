"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

/**
 * Sign Out Button Component
 * Provides a button to sign out the current user
 */
export default function SignOutButton({ compact = false }) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        compact ? "w-9 px-0" : "px-3"
      }`}
      aria-label={compact ? "Sign out" : undefined}
      title={compact ? "Sign out" : undefined}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {!compact && "Sign out"}
    </button>
  );
}
