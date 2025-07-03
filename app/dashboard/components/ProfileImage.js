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
    <div className="flex items-center space-x-3">
      {user.image && !imageError ? (
        <img
          src={user.image}
          alt={`${user.name || user.email}'s profile`}
          className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-blue-500 text-lg font-medium text-white">
          {initials}
        </div>
      )}
    </div>
  );
}
