"use client";
import { useState, useEffect } from "react";

export default function PhotoSlideshow({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Safety check for photos prop
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl">📸</div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No photos yet
        </h3>
        <p className="text-gray-600">
          Project photos will be added here by our team as work progresses.
        </p>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1,
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const currentPhoto = photos[currentIndex];

  return (
    <div className="space-y-6">
      {/* Main Slideshow */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-video w-full">
          <img
            src={currentPhoto.content}
            alt={`Project photo ${currentIndex + 1}`}
            className="h-full w-full object-contain"
            onError={(e) => {
              console.log("Image failed to load:", currentPhoto.content);
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            className="flex hidden h-full w-full items-center justify-center bg-gray-100 text-gray-500"
            style={{ display: "none" }}
          >
            <div className="text-center">
              <svg
                className="mx-auto mb-2 h-12 w-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <p>Image unavailable</p>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous photo"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next photo"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute right-4 top-4 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Toggle fullscreen"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>

        {/* Photo Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-opacity-75 bg-gradient-to-t from-black to-transparent p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Photo {currentIndex + 1} of {photos.length}
              </p>
              <p className="text-xs opacity-75">
                Added: {formatDate(currentPhoto.createdAt)}
              </p>
            </div>
            <a
              href={currentPhoto.content}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-white bg-opacity-20 px-3 py-1 text-xs font-medium text-white hover:bg-opacity-30"
            >
              Open Full Size
            </a>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">
          All Photos ({photos.length})
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => goToSlide(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:opacity-80 ${
                index === currentIndex
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={photo.content}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="flex hidden h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400"
                style={{ display: "none" }}
              >
                <span>Error</span>
              </div>
              {index === currentIndex && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative h-full w-full p-4">
            <img
              src={currentPhoto.content}
              alt={`Project photo ${currentIndex + 1}`}
              className="h-full w-full object-contain"
            />

            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute right-6 top-6 rounded-full bg-black bg-opacity-50 p-3 text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close fullscreen"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Fullscreen Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-3 text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous photo"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-3 text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next photo"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Fullscreen Photo Info */}
            <div className="absolute bottom-6 left-6 right-6 rounded-lg bg-black bg-opacity-50 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">
                    Photo {currentIndex + 1} of {photos.length}
                  </p>
                  <p className="text-sm opacity-75">
                    Added: {formatDate(currentPhoto.createdAt)}
                  </p>
                </div>
                <a
                  href={currentPhoto.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-white bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30"
                >
                  Open Full Size
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
