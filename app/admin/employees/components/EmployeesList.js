"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Employees List Component
 * Displays all employees with filtering and management options
 */
export default function EmployeesList({ employees: initialEmployees }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter and search logic
  const filteredEmployees = employees.filter((employee) => {
    // Filter by availability
    if (
      filterAvailability !== "all" &&
      employee.availability !== filterAvailability
    ) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = employee.name.toLowerCase().includes(searchLower);
      const emailMatch = employee.email.toLowerCase().includes(searchLower);
      const positionMatch = employee.position
        .toLowerCase()
        .includes(searchLower);
      if (!nameMatch && !emailMatch && !positionMatch) return false;
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Helper function to get availability badge
  const getAvailabilityBadge = (availability) => {
    const badges = {
      available: "bg-green-100 text-green-800",
      busy: "bg-yellow-100 text-yellow-800",
      unavailable: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          badges[availability] || badges.available
        }`}
      >
        {availability.charAt(0).toUpperCase() + availability.slice(1)}
      </span>
    );
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Handle availability change
  const handleAvailabilityChange = async (employeeId, newAvailability) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: newAvailability }),
      });

      if (response.ok) {
        // Update local state
        setEmployees((prev) =>
          prev.map((employee) =>
            employee.id === employeeId
              ? { ...employee, availability: newAvailability }
              : employee,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating employee availability:", error);
    }
  };

  // Handle employee deactivation
  const handleDeactivateEmployee = async (employeeId) => {
    if (!confirm("Are you sure you want to deactivate this employee?")) {
      return;
    }

    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });

      if (response.ok) {
        // Remove from local state
        setEmployees((prev) =>
          prev.filter((employee) => employee.id !== employeeId),
        );
      }
    } catch (error) {
      console.error("Error deactivating employee:", error);
    }
  };

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Availability
              </label>
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-48"
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or position..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        {paginatedEmployees.map((employee) => (
          <div
            key={employee.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
                      {employee.name?.charAt(0) ||
                        employee.email?.charAt(0) ||
                        "E"}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {employee.name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {employee.email}
                    </div>
                  </div>
                </div>

                <div className="mb-3 space-y-2 text-sm text-gray-600">
                  <div>
                    Position:{" "}
                    <span className="font-medium">{employee.position}</span>
                  </div>
                  <div>Joined: {formatDate(employee.createdAt)}</div>
                  <div className="flex items-center space-x-2">
                    <span>Availability:</span>
                    <select
                      value={employee.availability}
                      onChange={(e) =>
                        handleAvailabilityChange(employee.id, e.target.value)
                      }
                      className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                  {employee.skills && employee.skills.length > 0 && (
                    <div>
                      Skills:{" "}
                      <span className="font-medium">
                        {employee.skills.join(", ")}
                      </span>
                    </div>
                  )}
                  {employee.dayRate && (
                    <div>
                      Rate:{" "}
                      <span className="font-medium">
                        £{employee.dayRate}/day
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/admin/employees/${employee.id}`}
                    className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/admin/employees/${employee.id}?edit=true`}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeactivateEmployee(employee.id)}
                    className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {paginatedEmployees.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">👷</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Employees Found
          </h3>
          <p className="mb-6 text-gray-600">
            {filteredEmployees.length === 0 && employees.length > 0
              ? "No employees match your current filters."
              : "There are currently no employees. Create your first employee above."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredEmployees.length)} of{" "}
            {filteredEmployees.length} employees
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Statistics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {employees.filter((e) => e.isActive).length}
            </div>
            <div className="text-sm text-green-600">Active Employees</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {employees.filter((e) => e.availability === "available").length}
            </div>
            <div className="text-sm text-blue-600">Available</div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {employees.filter((e) => e.availability === "busy").length}
            </div>
            <div className="text-sm text-yellow-600">Busy</div>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <div className="text-2xl font-bold text-red-600">
              {employees.filter((e) => e.availability === "unavailable").length}
            </div>
            <div className="text-sm text-red-600">Unavailable</div>
          </div>
        </div>
      </div>
    </div>
  );
}
