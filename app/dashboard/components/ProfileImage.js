"use client";

import { useState } from "react";

/**
 * Profile Image Component
 * Displays user's profile image with fallback to initials
 */
export default function ProfileImage({ user }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const initials = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="hidden items-center sm:flex">
      {user.image && !imageError ? (
        <img
          src={user.image}
          alt={`${user.name || user.email}'s profile`}
          className="h-9 w-9 rounded-full border border-slate-200 object-cover ring-2 ring-white"
          onError={handleImageError}
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white ring-2 ring-slate-100">
          {initials}
        </div>
      )}
    </div>
  );
}
