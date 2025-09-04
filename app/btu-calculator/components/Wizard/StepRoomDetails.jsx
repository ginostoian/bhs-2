"use client";

import React from "react";

const ROOM_TYPES = [
  {
    id: "Living Room",
    name: "Living Room",
    description: "Main living space, moderate heating needs",
  },
  {
    id: "Bedroom",
    name: "Bedroom",
    description: "Sleeping area, comfortable heating",
  },
  {
    id: "Bathroom",
    name: "Bathroom",
    description: "Quick warm-up needed, higher BTU requirements",
  },
  {
    id: "Kitchen",
    name: "Kitchen",
    description: "Cooking generates heat, lower BTU needs",
  },
  {
    id: "Dining Room",
    name: "Dining Room",
    description: "Entertainment space, moderate heating",
  },
  {
    id: "Study/Office",
    name: "Study/Office",
    description: "Work space, consistent heating",
  },
  {
    id: "Hallway",
    name: "Hallway",
    description: "Passage area, minimal heating",
  },
  {
    id: "Utility Room",
    name: "Utility Room",
    description: "Utility space, basic heating",
  },
];

const StepRoomDetails = ({ formData, setFormData, onNext }) => {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoomTypeChange = (roomType) => {
    setFormData((prev) => ({ ...prev, roomType }));
  };

  const canProceed =
    formData.roomLength > 0 &&
    formData.roomWidth > 0 &&
    formData.roomHeight > 0 &&
    formData.roomType;

  const roomArea = formData.roomLength * formData.roomWidth;
  const roomVolume = roomArea * formData.roomHeight;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Room Details</h2>
        <p className="text-lg text-gray-600">
          Enter your room dimensions and type for accurate BTU calculation
        </p>
      </div>

      <div className="space-y-8">
        {/* Room Dimensions */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Room Dimensions (in metres)
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Length
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.roomLength || ""}
                onChange={(e) =>
                  handleInputChange(
                    "roomLength",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 4.5"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Width
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.roomWidth || ""}
                onChange={(e) =>
                  handleInputChange(
                    "roomWidth",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 3.2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Height
              </label>
              <input
                type="number"
                min="1.5"
                step="0.1"
                value={formData.roomHeight || ""}
                onChange={(e) =>
                  handleInputChange(
                    "roomHeight",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 2.4"
              />
            </div>
          </div>

          {/* Room Size Display */}
          {roomArea > 0 && (
            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800">Room Area:</span>
                <span className="font-medium text-blue-900">
                  {roomArea.toFixed(1)} m²
                </span>
              </div>
              {roomVolume > 0 && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-blue-800">Room Volume:</span>
                  <span className="font-medium text-blue-900">
                    {roomVolume.toFixed(1)} m³
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Room Type Selection */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            What type of room is this?
          </h3>
          <div className="grid gap-3">
            {ROOM_TYPES.map((room) => (
              <div
                key={room.id}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.roomType === room.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleRoomTypeChange(room.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.roomType === room.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.roomType === room.id && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{room.name}</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {room.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="rounded-lg bg-yellow-50 p-4">
          <h4 className="mb-2 font-semibold text-yellow-900">
            📏 Measurement Tips
          </h4>
          <ul className="space-y-1 text-sm text-yellow-800">
            <li>• Measure from wall to wall, not including skirting boards</li>
            <li>• For irregular rooms, use the largest dimensions</li>
            <li>• Standard UK ceiling height is 2.4m (8 feet)</li>
            <li>• Measure to the nearest 0.1m for accuracy</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`rounded-lg px-6 py-3 font-medium transition-colors ${
            canProceed
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepRoomDetails;
