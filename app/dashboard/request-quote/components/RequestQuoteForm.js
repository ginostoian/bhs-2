"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

/**
 * Request Quote Form Component
 * Allows users to submit quote requests
 */
export default function RequestQuoteForm() {
  const [formData, setFormData] = useState({
    projectType: "",
    description: "",
    timeline: "",
    budget: "",
    address: "",
    contactPhone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
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

    // Validate required fields
    if (!formData.projectType || !formData.description || !formData.budget) {
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
      const response = await fetch("/api/documents/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "quote",
          content: {
            projectType: formData.projectType,
            description: formData.description,
            timeline: formData.timeline,
            budget: formData.budget,
            address: formData.address,
            contactPhone: formData.contactPhone,
            status: "pending",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote request");
      }

      // Reset form and redirect to quotes page
      setFormData({
        projectType: "",
        description: "",
        timeline: "",
        budget: "",
        address: "",
        contactPhone: "",
      });

      // Show success modal
      setModalState({
        isOpen: true,
        title: "Success",
        message:
          "Quote request submitted successfully! We'll get back to you soon.",
        type: "alert",
        confirmText: "OK",
      });
    } catch (error) {
      console.error("Error submitting quote request:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to submit quote request. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl border border-[#dedbd2] bg-[#fbfaf7] p-5 sm:p-7">
      <h3 className="mb-5 text-base font-semibold text-[#17231f]">
        Project details
      </h3>

      <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
        {/* Project Type */}
        <div className="sm:col-span-2">
          <label
            htmlFor="projectType"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Project Type *
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            required
            className="min-h-11 w-full rounded-md border border-[#d8d4ca] bg-white px-3 text-sm text-[#17231f] focus:border-[#1559d6] focus:outline-none focus:ring-2 focus:ring-[#1559d6]/15"
          >
            <option value="">Select project type</option>
            <option value="kitchen-renovation">Kitchen Renovation</option>
            <option value="bathroom-renovation">Bathroom Renovation</option>
            <option value="house-extension">House Extension</option>
            <option value="loft-conversion">Loft Conversion</option>
            <option value="general-renovation">General Renovation</option>
            <option value="interior-design">Interior Design</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Project Description */}
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Project Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-[#d8d4ca] bg-white px-3 py-2 text-sm text-[#17231f] focus:border-[#1559d6] focus:outline-none focus:ring-2 focus:ring-[#1559d6]/15"
            placeholder="Describe your renovation project in detail..."
          />
        </div>

        {/* Timeline */}
        <div>
          <label
            htmlFor="timeline"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Preferred Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="min-h-11 w-full rounded-md border border-[#d8d4ca] bg-white px-3 text-sm text-[#17231f] focus:border-[#1559d6] focus:outline-none focus:ring-2 focus:ring-[#1559d6]/15"
          >
            <option value="">Select timeline</option>
            <option value="asap">As soon as possible</option>
            <option value="1-3-months">1-3 months</option>
            <option value="3-6-months">3-6 months</option>
            <option value="6-12-months">6-12 months</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label
            htmlFor="budget"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="min-h-11 w-full rounded-md border border-[#d8d4ca] bg-white px-3 text-sm text-[#17231f] focus:border-[#1559d6] focus:outline-none focus:ring-2 focus:ring-[#1559d6]/15"
          >
            <option value="">Select budget range</option>
            <option value="under-10k">Under £10,000</option>
            <option value="10k-25k">£10,000 - £25,000</option>
            <option value="25k-50k">£25,000 - £50,000</option>
            <option value="50k-100k">£50,000 - £100,000</option>
            <option value="over-100k">Over £100,000</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Project Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="min-h-11 w-full rounded-md border border-[#d8d4ca] bg-white px-3 text-sm text-[#17231f] focus:border-[#1559d6] focus:outline-none focus:ring-2 focus:ring-[#1559d6]/15"
            placeholder="Enter the address where the work will be done"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label
            htmlFor="contactPhone"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Contact Phone Number
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="min-h-11 w-full rounded-md border border-[#d8d4ca] bg-white px-3 text-sm text-[#17231f] focus:border-[#1559d6] focus:outline-none focus:ring-2 focus:ring-[#1559d6]/15"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center rounded-md bg-[#1559d6] px-5 text-xs font-semibold text-white hover:bg-[#104dbd] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Quote Request"}
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
