"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.projectType || !formData.description) {
      alert("Please fill in all required fields");
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

      alert("Quote request submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting quote request:", error);
      alert("Failed to submit quote request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Type */}
        <div>
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
        <div>
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Quote Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
