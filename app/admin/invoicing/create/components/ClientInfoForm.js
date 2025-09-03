"use client";

import { useState, useEffect } from "react";
import { Search, User, Building } from "lucide-react";
import apiClient from "@/libs/api";
import toast from "react-hot-toast";

export default function ClientInfoForm({
  formData,
  updateFormData,
  markSectionComplete,
  markSectionIncomplete,
  goToNextSection,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const isValid = !!(
      formData.client.name &&
      formData.client.email &&
      formData.client.phone &&
      formData.client.address
    );

    if (isValid) {
      markSectionComplete("client");
    } else {
      markSectionIncomplete("client");
    }
  }, [formData.client]);

  useEffect(() => {
    const searchClients = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await apiClient.get(
          `/admin/invoicing/clients/search?q=${encodeURIComponent(searchQuery)}&limit=10`,
        );
        setSearchResults(response.clients || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Error searching clients:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchClients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleClientSelect = (client) => {
    updateFormData("client", {
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
    });

    // Set linked entity
    if (client.type === "user") {
      updateFormData("linkedUser", client.id);
      updateFormData("linkedLead", null);
    } else if (client.type === "lead") {
      updateFormData("linkedLead", client.id);
      updateFormData("linkedUser", null);
    }

    setSearchQuery("");
    setShowSearchResults(false);
    toast.success(`Client information populated from ${client.source}`);
  };

  const handleInputChange = (field, value) => {
    updateFormData("client", { [field]: value });

    // Clear linked entities when manually entering client info
    if (formData.linkedUser || formData.linkedLead) {
      updateFormData("linkedUser", null);
      updateFormData("linkedLead", null);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const isFormValid = !!(
    formData.client.name &&
    formData.client.email &&
    formData.client.phone &&
    formData.client.address
  );

  return (
    <div className="space-y-6">
      {/* Client Search */}
      <div className="relative">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Search Existing Clients
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {isSearching ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((client) => (
                  <button
                    key={`${client.type}-${client.id}`}
                    onClick={() => handleClientSelect(client)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {client.type === "user" ? (
                          <User className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Building className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {client.name}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              client.type === "user"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {client.source}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{client.email}</p>
                        {client.phone && (
                          <p className="text-xs text-gray-400">
                            {client.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No clients found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual Input Fields */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Client Information
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          You can search for existing clients above or manually enter the
          information below.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Client Name *
            </label>
            <input
              type="text"
              required
              value={formData.client.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter client name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.client.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.client.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address *
            </label>
            <textarea
              required
              rows={3}
              value={formData.client.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter client address"
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end border-t border-gray-200 pt-6">
        <button
          onClick={goToNextSection}
          disabled={!isFormValid}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to Invoice Details
        </button>
      </div>
    </div>
  );
}
