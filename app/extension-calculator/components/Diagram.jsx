"use client";

import React from "react";

const Diagram = ({ extensionType, size }) => {
  const getDiagramContent = () => {
    switch (extensionType) {
      case "singleStorey":
        return (
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
            {/* Existing house */}
            <div className="absolute left-0 top-0 h-32 w-24 border-2 border-gray-400 bg-gray-300">
              <div className="p-2 text-xs">
                <div className="mb-1 h-4 w-4 rounded bg-gray-400"></div>
                <div className="mb-1 h-4 w-4 rounded bg-gray-400"></div>
                <div className="h-4 w-4 rounded bg-gray-400"></div>
              </div>
            </div>

            {/* Extension */}
            <div className="absolute left-24 top-8 h-24 w-20 border-2 border-blue-400 bg-blue-200">
              <div className="p-2 text-xs text-blue-800">
                <div className="mb-1 h-3 w-3 rounded bg-blue-400"></div>
                <div className="h-3 w-3 rounded bg-blue-400"></div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-2 left-2 text-xs text-gray-600">
              <div>Existing House</div>
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-blue-600">
              <div>Extension</div>
            </div>
          </div>
        );

      case "doubleStorey":
        return (
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
            {/* Existing house */}
            <div className="absolute bottom-0 left-0 h-32 w-24 border-2 border-gray-400 bg-gray-300">
              <div className="p-2 text-xs">
                <div className="mb-1 h-4 w-4 rounded bg-gray-400"></div>
                <div className="mb-1 h-4 w-4 rounded bg-gray-400"></div>
                <div className="h-4 w-4 rounded bg-gray-400"></div>
              </div>
            </div>

            {/* Ground floor extension */}
            <div className="absolute bottom-0 left-24 h-16 w-20 border-2 border-blue-400 bg-blue-200">
              <div className="p-2 text-xs text-blue-800">
                <div className="h-3 w-3 rounded bg-blue-400"></div>
              </div>
            </div>

            {/* First floor extension */}
            <div className="absolute left-24 top-0 h-16 w-20 border-2 border-blue-500 bg-blue-300">
              <div className="p-2 text-xs text-blue-800">
                <div className="h-3 w-3 rounded bg-blue-500"></div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-2 left-2 text-xs text-gray-600">
              <div>Existing House</div>
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-blue-600">
              <div>2-Storey Extension</div>
            </div>
          </div>
        );

      case "basement":
        return (
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
            {/* Ground level */}
            <div className="absolute left-0 top-0 h-24 w-full border-2 border-green-400 bg-green-200">
              <div className="absolute left-4 top-4 h-12 w-16 border border-gray-400 bg-gray-300">
                <div className="p-1 text-xs">
                  <div className="mb-1 h-3 w-3 rounded bg-gray-400"></div>
                  <div className="h-3 w-3 rounded bg-gray-400"></div>
                </div>
              </div>
            </div>

            {/* Basement extension */}
            <div className="absolute left-20 top-24 h-20 w-20 border-2 border-purple-400 bg-purple-200">
              <div className="p-2 text-xs text-purple-800">
                <div className="mb-1 h-3 w-3 rounded bg-purple-400"></div>
                <div className="h-3 w-3 rounded bg-purple-400"></div>
              </div>
            </div>

            {/* Stairs */}
            <div className="absolute left-16 top-20 h-8 w-2 bg-gray-500"></div>

            {/* Labels */}
            <div className="absolute left-2 top-2 text-xs text-green-600">
              <div>Ground Level</div>
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-purple-600">
              <div>Basement</div>
            </div>
          </div>
        );

      case "loft":
        return (
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
            {/* Ground floor */}
            <div className="absolute bottom-0 left-0 h-16 w-full border-2 border-gray-400 bg-gray-300">
              <div className="p-2 text-xs">
                <div className="mb-1 h-4 w-4 rounded bg-gray-400"></div>
                <div className="h-4 w-4 rounded bg-gray-400"></div>
              </div>
            </div>

            {/* First floor */}
            <div className="absolute bottom-16 left-0 h-16 w-full border-2 border-gray-400 bg-gray-200">
              <div className="p-2 text-xs">
                <div className="mb-1 h-4 w-4 rounded bg-gray-400"></div>
                <div className="h-4 w-4 rounded bg-gray-400"></div>
              </div>
            </div>

            {/* Loft conversion */}
            <div className="absolute left-8 top-0 h-16 w-16 -skew-x-12 transform border-2 border-orange-400 bg-orange-200">
              <div className="skew-x-12 transform p-2 text-xs text-orange-800">
                <div className="h-3 w-3 rounded bg-orange-400"></div>
              </div>
            </div>

            {/* Roof windows */}
            <div className="absolute left-12 top-4 h-4 w-4 -skew-x-12 transform border border-blue-400 bg-blue-300"></div>

            {/* Labels */}
            <div className="absolute bottom-2 left-2 text-xs text-gray-600">
              <div>Existing Floors</div>
            </div>
            <div className="absolute right-2 top-2 text-xs text-orange-600">
              <div>Loft Conversion</div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100">
            <p className="text-gray-500">
              Select extension type to see diagram
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">
        Extension Diagram
      </h3>
      {getDiagramContent()}
      <div className="mt-2 text-center text-xs text-gray-500">
        {size && `${size} m² extension`}
      </div>
    </div>
  );
};

export default Diagram;
