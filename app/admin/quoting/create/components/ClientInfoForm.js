"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, User, Users, Link, Unlink, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ClientInfoForm({ formData, updateFormData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Search for existing users/leads
  const searchClients = useCallback(async () => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/admin/search/clients?q=${encodeURIComponent(searchQuery)}`,
      );
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching clients:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(searchClients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchClients]);

  const handleClientSelect = (client) => {
    updateFormData({
      client: {
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
        postcode: client.postcode || "",
      },
      linkedUser: client.type === "user" ? client.id : null,
      linkedLead: client.type === "lead" ? client.id : null,
    });

    setSearchQuery("");
    setShowSearchResults(false);
    toast.success(`Client information populated from ${client.source}`);
  };

  const handleInputChange = (field, value) => {
    updateFormData({
      client: {
        ...formData.client,
        [field]: value,
      },
    });

    // Clear linked entities when manually entering client info
    if (formData.linkedUser || formData.linkedLead) {
      updateFormData({
        linkedUser: null,
        linkedLead: null,
      });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleUnlinkClient = () => {
    updateFormData({
      linkedUser: null,
      linkedLead: null,
    });
    toast.success("Client unlinked successfully");
  };

  const isLinked = !!(formData.linkedUser || formData.linkedLead);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Client Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Please provide the client&apos;s contact details and address.
        </p>
      </div>

      {/* Client Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            Search Existing Clients
          </h3>
          {isLinked && (
            <button
              onClick={handleUnlinkClient}
              className="inline-flex items-center text-xs text-red-600 hover:text-red-800"
            >
              <Unlink className="mr-1 h-3 w-3" />
              Unlink
            </button>
          )}
        </div>

        <div className="relative mt-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchResults(true)}
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Search by name, email, or phone..."
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Search Results */}
        {showSearchResults && searchQuery.length >= 2 && (
          <div className="mt-2 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-sm">
            {isSearching ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-500">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-1">
                {searchResults.map((client) => (
                  <button
                    key={`${client.type}-${client.id}`}
                    onClick={() => handleClientSelect(client)}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      {client.type === "user" ? (
                        <User className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Users className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-gray-500">
                          {client.email} • {client.phone}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        client.type === "user"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {client.source}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-gray-500">
                No clients found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}

        {/* Linked Status */}
        {isLinked && (
          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Linked to {formData.linkedUser ? "registered user" : "CRM lead"}
              </span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="client-name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="client-name"
            value={formData.client?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label
            htmlFor="client-email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="client-email"
            value={formData.client?.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="client-phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="client-phone"
            value={formData.client?.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="07700 900000"
            required
          />
        </div>

        <div>
          <label
            htmlFor="client-postcode"
            className="block text-sm font-medium text-gray-700"
          >
            Postcode *
          </label>
          <input
            type="text"
            id="client-postcode"
            value={formData.client?.postcode || ""}
            onChange={(e) => handleInputChange("postcode", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="SW1A 1AA"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="client-address"
            className="block text-sm font-medium text-gray-700"
          >
            Full Address *
          </label>
          <textarea
            id="client-address"
            rows={3}
            value={formData.client?.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="123 Sample Street, London"
            required
          />
        </div>
      </div>
    </div>
  );
}
