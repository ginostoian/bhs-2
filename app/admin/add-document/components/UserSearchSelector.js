"use client";

import { useState, useEffect, useRef } from "react";

/**
 * User Search Selector Component
 * Searchable dropdown for selecting users with filtering
 */
export default function UserSearchSelector({
  users,
  selectedUserId,
  onUserSelect,
  placeholder = "Choose a user...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const dropdownRef = useRef(null);

  // Get selected user details
  const selectedUser = users.find((u) => u.id === selectedUserId);

  // Filter users based on search term
  useEffect(() => {
    let filtered = users;

    // Filter by search term (name, email, role, projectStatus)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term)) ||
          (user.role && user.role.toLowerCase().includes(term)) ||
          (user.projectStatus &&
            user.projectStatus.toLowerCase().includes(term)),
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle user selection
  const handleUserClick = (userId) => {
    onUserSelect(userId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected User Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedUser ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                {selectedUser.name || selectedUser.email}
              </div>
              <div className="text-sm text-gray-500">
                {selectedUser.email}
                {selectedUser.role && ` • ${selectedUser.role}`}
                {selectedUser.projectStatus &&
                  ` • ${selectedUser.projectStatus}`}
              </div>
            </div>
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
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
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Search Input */}
          <div className="border-b border-gray-200 p-3">
            <input
              type="text"
              placeholder="Search users by name, email, role, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            {/* Results Count */}
            <div className="mt-2 text-xs text-gray-500">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
              found
            </div>
          </div>

          {/* User List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No users found matching your criteria
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserClick(user.id)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    selectedUserId === user.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name || user.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                        {user.role && ` • ${user.role}`}
                        {user.projectStatus && ` • ${user.projectStatus}`}
                      </div>
                    </div>
                    {selectedUserId === user.id && (
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
