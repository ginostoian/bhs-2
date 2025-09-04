"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  User,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/libs/api";

export default function InvoiceEditForm({ invoice, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    notes: "",
    terms: "",
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    lineItems: [],
    status: "draft",
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Client search state
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize form data from invoice
  useEffect(() => {
    if (invoice) {
      setFormData({
        title: invoice.title || "",
        dueDate: invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split("T")[0]
          : "",
        notes: invoice.notes || "",
        terms: invoice.terms || "",
        client: {
          name: invoice.client?.name || "",
          email: invoice.client?.email || "",
          phone: invoice.client?.phone || "",
          address: invoice.client?.address || "",
        },
        lineItems:
          invoice.lineItems?.map((item, index) => ({
            ...item,
            id: item._id || `temp-${index}`,
          })) || [],
        status: invoice.status || "draft",
      });
    }
  }, [invoice]);

  // Search clients
  const searchClients = useCallback(async () => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await apiClient.get(
        `/admin/invoicing/clients/search?q=${encodeURIComponent(searchQuery)}&limit=10`,
      );
      setSearchResults(response.clients || []);
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
  }, [searchQuery]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleClientChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleClientSelect = (client) => {
    setFormData((prev) => ({
      ...prev,
      client: {
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
      },
    }));
    setShowClientSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    setIsDirty(true);
  };

  const addLineItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      serviceName: "",
      priceExclVat: 0,
      vatRate: 20,
      type: "Labour",
      quantity: 1,
      totalVatIncluded: 0,
    };

    setFormData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }));
    setIsDirty(true);
  };

  const updateLineItem = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.lineItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      // Recalculate total for this item
      if (
        field === "priceExclVat" ||
        field === "quantity" ||
        field === "vatRate"
      ) {
        const item = updatedItems[index];
        const subtotal = item.priceExclVat * item.quantity;
        const vat = subtotal * (item.vatRate / 100);
        updatedItems[index].totalVatIncluded = parseFloat(
          (subtotal + vat).toFixed(2),
        );
      }

      return {
        ...prev,
        lineItems: updatedItems,
      };
    });
    setIsDirty(true);
  };

  const removeLineItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalVat = 0;

    formData.lineItems.forEach((item) => {
      const itemSubtotal = item.priceExclVat * item.quantity;
      const itemVat = itemSubtotal * (item.vatRate / 100);
      subtotal += itemSubtotal;
      totalVat += itemVat;
    });

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalVat: parseFloat(totalVat.toFixed(2)),
      total: parseFloat((subtotal + totalVat).toFixed(2)),
    };
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Invoice title is required");
      return;
    }

    if (!formData.client.name.trim() || !formData.client.email.trim()) {
      toast.error("Client name and email are required");
      return;
    }

    if (formData.lineItems.length === 0) {
      toast.error("At least one line item is required");
      return;
    }

    try {
      setIsSaving(true);

      // Calculate totals
      const totals = calculateTotals();

      // Prepare line items (remove temporary IDs and ensure proper structure)
      const lineItems = formData.lineItems.map((item) => ({
        serviceName: item.serviceName,
        priceExclVat: parseFloat(item.priceExclVat),
        vatRate: parseFloat(item.vatRate),
        type: item.type,
        quantity: parseFloat(item.quantity),
        totalVatIncluded: parseFloat(item.totalVatIncluded),
      }));

      const updateData = {
        title: formData.title,
        client: formData.client,
        lineItems,
        dueDate: formData.dueDate || null,
        notes: formData.notes,
        terms: formData.terms,
        status: formData.status,
        ...totals,
      };

      const success = await onSave(updateData);
      if (success) {
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice");
    } finally {
      setIsSaving(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-8">
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Invoice Details */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Invoice Details
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter invoice title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Client Information
          </h3>
          <button
            onClick={() => setShowClientSearch(true)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Search className="mr-2 h-4 w-4" />
            Search Client
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Name *
            </label>
            <input
              type="text"
              value={formData.client.name}
              onChange={(e) => handleClientChange("name", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter client name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              value={formData.client.email}
              onChange={(e) => handleClientChange("email", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={formData.client.phone}
              onChange={(e) => handleClientChange("phone", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              value={formData.client.address}
              onChange={(e) => handleClientChange("address", e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter client address"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
          <button
            onClick={addLineItem}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </button>
        </div>

        {formData.lineItems.length > 0 ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price (excl. VAT)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    VAT Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total (inc. VAT)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {formData.lineItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={item.serviceName}
                        onChange={(e) =>
                          updateLineItem(index, "serviceName", e.target.value)
                        }
                        className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Service name"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.priceExclVat}
                        onChange={(e) =>
                          updateLineItem(
                            index,
                            "priceExclVat",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={item.vatRate}
                        onChange={(e) =>
                          updateLineItem(
                            index,
                            "vatRate",
                            parseFloat(e.target.value),
                          )
                        }
                        className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={20}>20%</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={item.type}
                        onChange={(e) =>
                          updateLineItem(index, "type", e.target.value)
                        }
                        className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Labour">Labour</option>
                        <option value="Material">Material</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        step="1"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 1,
                          )
                        }
                        className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      £{item.totalVatIncluded.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No line items added yet.</p>
            <button
              onClick={addLineItem}
              className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add your first line item
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      {formData.lineItems.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Invoice Totals
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal (excl. VAT):</span>
              <span className="font-medium">£{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total VAT:</span>
              <span className="font-medium">£{totals.totalVat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total:</span>
              <span>£{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes and Terms */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Additional Information
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Any additional notes for this invoice"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Terms and Conditions
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => handleInputChange("terms", e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Terms and conditions for this invoice"
            />
          </div>
        </div>
      </div>

      {/* Client Search Modal */}
      {showClientSearch && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Search Client
                </h3>
                <button
                  onClick={() => setShowClientSearch(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {isSearching && (
                <div className="py-4 text-center">
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">
                    Searching...
                  </span>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      className="w-full border-b border-gray-200 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <User className="mr-3 h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {client.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="text-sm text-gray-500">
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 &&
                !isSearching &&
                searchResults.length === 0 && (
                  <div className="py-4 text-center text-sm text-gray-500">
                    No clients found matching &quot;{searchQuery}&quot;
                  </div>
                )}

              {searchQuery.length < 2 && (
                <div className="py-4 text-center text-sm text-gray-500">
                  Type at least 2 characters to search for clients
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
