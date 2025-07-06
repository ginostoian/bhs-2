"use client";

import { useState } from "react";

/**
 * Employee Photos Client Component
 * Displays photos in a grid layout
 */
export default function EmployeePhotosClient({ photos: initialPhotos }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Photos Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-shadow hover:shadow-md"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={photo.content}
                alt="Project photo"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-500">
                {formatDate(photo.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📸</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Photos Found
          </h3>
          <p className="text-gray-600">
            No photos are available for your assigned projects.
          </p>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedPhoto.content}
              alt="Project photo"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <div className="mt-2 text-center text-white">
              <p className="text-sm">{formatDate(selectedPhoto.createdAt)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {photos.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Photo Summary
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {photos.length}
            </div>
            <div className="text-sm text-gray-500">Total Photos</div>
          </div>
        </div>
      )}
    </div>
  );
}
