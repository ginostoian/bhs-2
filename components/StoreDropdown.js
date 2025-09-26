"use client";

import { useState, useEffect, useRef } from "react";
// Using inline SVG icons instead of Heroicons
import toast from "react-hot-toast";

/**
 * StoreDropdown Component
 * Custom dropdown for selecting stores with ability to add new ones
 */
export default function StoreDropdown({
  value,
  onChange,
  stores = [],
  onStoreAdded,
  placeholder = "Select a store...",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreColor, setNewStoreColor] = useState("#6B7280");
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef(null);

  // Filter stores based on search term
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowAddForm(false);
        setSearchTerm("");
        setNewStoreName("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle store selection
  const handleStoreSelect = (store) => {
    onChange(store.name);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Handle adding new store
  const handleAddStore = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCreating) {
      return;
    }

    if (!newStoreName.trim()) {
      toast.error("Store name is required");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newStoreName.trim(),
          color: newStoreColor,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create store");
      }

      const { store } = await response.json();

      // Call the callback to refresh stores list
      if (onStoreAdded) {
        onStoreAdded(store);
      }

      // Select the new store
      onChange(store.name);
      setIsOpen(false);
      setShowAddForm(false);
      setNewStoreName("");
      setSearchTerm("");

      toast.success("Store added successfully");
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error(error.message || "Failed to create store");
      // Don't close the form on error so user can try again
    } finally {
      setIsCreating(false);
    }
  };

  // Get selected store details
  const selectedStore = stores.find((store) => store.name === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
      >
        <span className="flex items-center">
          {selectedStore ? (
            <>
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: selectedStore.color }}
              />
              <span className="block truncate">{selectedStore.name}</span>
            </>
          ) : (
            <span className="block truncate text-gray-500">{placeholder}</span>
          )}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {/* Search input */}
          <div className="px-3 py-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stores..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Store options */}
          {filteredStores.length > 0 && (
            <div className="max-h-40 overflow-auto">
              {filteredStores.map((store) => (
                <button
                  key={store._id}
                  type="button"
                  onClick={() => handleStoreSelect(store)}
                  className="relative w-full cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50 focus:bg-blue-50"
                >
                  <div className="flex items-center">
                    <div
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: store.color }}
                    />
                    <span className="block truncate font-normal">
                      {store.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Add new store section */}
          {!showAddForm ? (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="relative w-full cursor-default select-none py-2 pl-3 pr-9 hover:bg-gray-50 focus:bg-gray-50"
            >
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="block truncate font-normal text-gray-500">
                  Add new store
                </span>
              </div>
            </button>
          ) : (
            <div className="px-3 py-2">
              <div className="space-y-2">
                <input
                  type="text"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (!isCreating && newStoreName.trim()) {
                        handleAddStore(e);
                      }
                    }
                  }}
                  placeholder="Store name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={newStoreColor}
                    onChange={(e) => setNewStoreColor(e.target.value)}
                    className="h-8 w-12 rounded border border-gray-300"
                  />
                  <span className="text-xs text-gray-500">Color</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleAddStore}
                    disabled={isCreating || !newStoreName.trim()}
                    className="flex-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isCreating ? "Adding..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewStoreName("");
                    }}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
