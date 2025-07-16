"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import UserSearchSelector from "./UserSearchSelector";
import FileUpload from "@/components/FileUpload";

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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedFileIds, setUploadedFileIds] = useState([]); // Store file IDs for document association
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

  const handleUserSelect = (userId) => {
    setFormData((prev) => ({
      ...prev,
      userId: userId,
    }));
  };

  const handleUploadComplete = (files, result) => {
    setUploadedFiles((prev) => [...prev, ...files]);

    // Store file IDs for document association
    const fileIds = files.map((file) => file.id);
    setUploadedFileIds((prev) => [...prev, ...fileIds]);

    // Auto-populate content field based on document type and uploaded files
    if (files.length > 0) {
      const firstFile = files[0];

      if (
        formData.type === "photo" &&
        firstFile.contentType.startsWith("image/")
      ) {
        // For photo documents, use the first image
        setFormData((prev) => ({
          ...prev,
          content: firstFile.url,
        }));
      } else if (
        (formData.type === "quote" || formData.type === "invoice") &&
        firstFile.contentType === "application/pdf"
      ) {
        // For quote/invoice documents, use the first PDF
        setFormData((prev) => ({
          ...prev,
          content: firstFile.url,
        }));
      }
    }
  };

  // Check if user is selected
  const isUserSelected = formData.userId && formData.userId.trim() !== "";

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

      if (formData.type === "quote") {
        // For quotes, check if it's a PDF URL or JSON
        if (
          formData.content.startsWith("http") &&
          formData.content.toLowerCase().includes(".pdf")
        ) {
          // It's a PDF URL, store as string
          content = formData.content;
        } else {
          // Try to parse as JSON for structured data
          try {
            content = JSON.parse(formData.content);
          } catch {
            // If not valid JSON, use as plain text
            content = formData.content;
          }
        }
      } else if (formData.type === "invoice") {
        // For invoices, check if it's a PDF URL or JSON
        if (
          formData.content.startsWith("http") &&
          formData.content.toLowerCase().includes(".pdf")
        ) {
          // It's a PDF URL, store as string
          content = formData.content;
        } else {
          // Try to parse as JSON for structured data
          try {
            content = JSON.parse(formData.content);
          } catch {
            // If not valid JSON, use as plain text
            content = formData.content;
          }
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
          fileIds: uploadedFileIds, // Pass uploaded file IDs for association
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
      setUploadedFiles([]);
      setUploadedFileIds([]);

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

  // Check if content is a PDF URL
  const isPdfUrl = (url) => {
    return url.startsWith("http") && url.toLowerCase().includes(".pdf");
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
          <UserSearchSelector
            users={users}
            selectedUserId={formData.userId}
            onUserSelect={handleUserSelect}
            placeholder="Choose a user..."
          />
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
          ) : formData.type === "invoice" ? (
            <div className="space-y-2">
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder='Enter invoice details as JSON or paste a PDF URL.&#10;&#10;JSON Example: {"amount": 5000, "description": "Kitchen renovation"}&#10;PDF URL Example: https://example.com/invoice.pdf'
              />
              {formData.content && isPdfUrl(formData.content) && (
                <div className="rounded-md bg-blue-50 p-3">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 text-sm text-blue-700">
                      PDF detected! This invoice will display as an embedded PDF
                      for the customer.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : formData.type === "quote" ? (
            <div className="space-y-2">
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder='Enter quote details as JSON or paste a PDF URL.&#10;&#10;JSON Example: {"amount": 5000, "description": "Kitchen renovation"}&#10;PDF URL Example: https://example.com/quote.pdf'
              />
              {formData.content && isPdfUrl(formData.content) && (
                <div className="rounded-md bg-blue-50 p-3">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 text-sm text-blue-700">
                      PDF detected! This quote will display as an embedded PDF
                      for the customer.
                    </span>
                  </div>
                </div>
              )}
            </div>
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

        {/* File Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Attachments
          </label>
          {!isUserSelected ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <div className="mb-4 text-4xl text-gray-400">📁</div>
              <p className="mb-2 text-gray-600">Please select a user first</p>
              <p className="text-sm text-gray-500">
                Choose a user above to enable file uploads for this document.
              </p>
            </div>
          ) : (
            <FileUpload
              onUploadComplete={handleUploadComplete}
              multiple={formData.type === "photo"}
              maxSize={50 * 1024 * 1024} // 50MB
              allowedTypes={
                formData.type === "photo"
                  ? [".jpg", ".jpeg", ".png", ".gif", ".webp"]
                  : [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
              }
              folder="documents"
              entityType="document"
              entityId={null} // Will be set after document creation
              targetUserId={formData.userId} // Pass the selected user ID
              disabled={isSubmitting}
              showPreview={true}
              maxFiles={formData.type === "photo" ? 10 : 5}
            />
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.type === "photo"
              ? "Upload images for this photo document. The first image will be used as the main content."
              : "Upload supporting files for this document."}
          </p>
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
