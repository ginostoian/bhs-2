"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

/**
 * Add Document Form Component
 * Allows admins to create documents for users
 */
export default function AddDocumentForm({ users }) {
  const [formData, setFormData] = useState({
    userId: "",
    type: "quote",
    content: "",
    status: "pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.content) {
      setModalState({
        isOpen: true,
        title: "Validation Error",
        message: "Please fill in all required fields",
        type: "alert",
        confirmText: "OK",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare content based on document type
      let content = formData.content;

      if (formData.type === "quote" || formData.type === "invoice") {
        // Try to parse as JSON for structured data
        try {
          content = JSON.parse(formData.content);
        } catch {
          // If not valid JSON, use as plain text
          content = formData.content;
        }
      }

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: formData.userId,
          type: formData.type,
          content: content,
          ...(formData.type === "invoice" && { status: formData.status }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create document");
      }

      // Reset form
      setFormData({
        userId: "",
        type: "quote",
        content: "",
        status: "pending",
      });

      // Show success modal
      setModalState({
        isOpen: true,
        title: "Success",
        message: "Document created successfully!",
        type: "alert",
        confirmText: "OK",
      });
    } catch (error) {
      console.error("Error creating document:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message:
          error.message || "Failed to create document. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Add New Document
        </h2>
        <p className="text-gray-600">Create a new document for a user</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Selection */}
        <div>
          <label
            htmlFor="userId"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select User *
          </label>
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Choose a user...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email} ({user.role || "user"})
              </option>
            ))}
          </select>
        </div>

        {/* Document Type */}
        <div>
          <label
            htmlFor="type"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Document Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="quote">Quote</option>
            <option value="invoice">Invoice</option>
            <option value="comment">Comment</option>
            <option value="photo">Photo</option>
          </select>
        </div>

        {/* Status (for invoices only) */}
        {formData.type === "invoice" && (
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        )}

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Content *
          </label>
          {formData.type === "photo" ? (
            <input
              type="url"
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          ) : formData.type === "quote" || formData.type === "invoice" ? (
            <textarea
              id="content"
              name="content"
              rows={6}
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder={`Enter ${formData.type} details as JSON or plain text. Example JSON: {"amount": 5000, "description": "Kitchen renovation"}`}
            />
          ) : (
            <textarea
              id="content"
              name="content"
              rows={4}
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter comment text..."
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !formData.userId || !formData.content}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Document"}
          </button>
        </div>
      </form>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          })
        }
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        type={modalState.type}
      />
    </div>
  );
}
