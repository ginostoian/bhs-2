"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const TicketForm = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    scheduledDate: "",
    scheduledTime: "",
    tags: "",
    customerPhone: "",
    customerEmail: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const categories = [
    { value: "Warranty", label: "Warranty Claim" },
    { value: "Support", label: "Technical Support" },
    { value: "General", label: "General Inquiry" },
    { value: "Emergency", label: "Emergency Issue" },
  ];

  const priorities = [
    { value: "Low", label: "Low", color: "text-purple-600" },
    { value: "Medium", label: "Medium", color: "text-blue-600" },
    { value: "High", label: "High", color: "text-orange-600" },
    { value: "Critical", label: "Critical", color: "text-red-600" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate form
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating your ticket...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("priority", formData.priority);

      if (formData.scheduledDate) {
        formDataToSend.append("scheduledDate", formData.scheduledDate);
      }
      if (formData.scheduledTime) {
        formDataToSend.append("scheduledTime", formData.scheduledTime);
      }
      if (formData.tags.trim()) {
        formDataToSend.append("tags", formData.tags.trim());
      }
      if (formData.customerPhone.trim()) {
        formDataToSend.append("customerPhone", formData.customerPhone.trim());
      }
      if (formData.customerEmail.trim()) {
        formDataToSend.append("customerEmail", formData.customerEmail.trim());
      }

      // Add files
      selectedFiles.forEach((file) => {
        formDataToSend.append("files", file);
      });

      const response = await fetch("/api/tickets", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          `Ticket created successfully! Ticket number: ${result.ticket.ticketNumber}`,
          {
            id: loadingToast,
          },
        );
        router.push(`/dashboard/tickets/${result.ticket.id}`);
      } else {
        toast.error(result.error || "Failed to create ticket", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-[85%] rounded-3xl bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Submit a Support Ticket
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Need help with your project or have a warranty claim? Submit a
            ticket and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Ticket Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="customerPhone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="customerEmail"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="priority"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="scheduledDate"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Preferred Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="scheduledTime"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Preferred Time (Optional)
                  </label>
                  <input
                    type="time"
                    id="scheduledTime"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide detailed information about your issue, including any relevant context, steps to reproduce, and what you've already tried..."
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  The more detail you provide, the faster we can help you
                  resolve your issue.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., bathroom, plumbing, electrical (comma separated)"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Add relevant tags to help us categorize your ticket better.
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Attachments (Optional)
                </label>
                <div className="space-y-4">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 text-gray-600 transition-all duration-200 hover:border-blue-500 hover:text-blue-500"
                    >
                      <svg
                        className="mr-2 h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Click to upload files
                    </button>
                  </div>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Selected files:
                      </p>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2"
                        >
                          <div className="flex items-center space-x-3">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  You can upload images, PDFs, and documents. Maximum file size:
                  50MB per file.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Ticket...
                    </div>
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className="pt-4 text-center">
                <p className="text-sm text-gray-500">
                  We typically respond to tickets within 24 hours during
                  business days.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  For urgent issues, please call us directly.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TicketForm;
