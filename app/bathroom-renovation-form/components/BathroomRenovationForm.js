"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const BathroomRenovationForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    budget: "",
    source: "",
    customSource: "",
  });

  const budgets = [
    { value: "££", label: "££ - Low to mid price & quality" },
    { value: "£££", label: "£££ - Mid to high quality" },
    { value: "££££", label: "££££ - Luxury" },
  ];

  const sources = [
    "Google Ads",
    "Google Search",
    "Facebook",
    "Instagram",
    "Houzz",
    "MyBuilder",
    "Recommendation",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate form
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email address is required");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (formData.source === "Other" && !formData.customSource.trim()) {
      toast.error("Please specify how you found us");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your enquiry...");

    try {
      const response = await fetch("/api/bathroom-renovation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          hasDetailedInfo: false,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Enquiry submitted successfully!", { id: loadingToast });
        router.push("/bathroom-form-submitted");
      } else {
        toast.error(result.error || "Failed to submit enquiry", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit enquiry. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToDetailedForm = () => {
    // Store form data in sessionStorage for the detailed form
    sessionStorage.setItem("bathroomFormData", JSON.stringify(formData));
    router.push("/bathroom-renovation-form/detailed");
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Bathroom Renovation Quote
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Get a free quote for your bathroom renovation project. Fill out the
            form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Your Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your Address + Postcode *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full address including postcode"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Budget (Optional)
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your budget</option>
                  {budgets.map((budget) => (
                    <option key={budget.value} value={budget.value}>
                      {budget.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="source"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  How did you find us? (Optional)
                </label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an option</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              {formData.source === "Other" && (
                <div>
                  <label
                    htmlFor="customSource"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Please specify how you found us
                  </label>
                  <input
                    type="text"
                    id="customSource"
                    name="customSource"
                    value={formData.customSource}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us how you found us"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4 pt-6">
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
                      Submitting...
                    </div>
                  ) : (
                    "Submit Enquiry"
                  )}
                </button>

                <div className="text-center">
                  <p className="mb-4 text-sm text-gray-600">
                    Want to provide more details for a more accurate quote?
                  </p>
                  <button
                    type="button"
                    onClick={goToDetailedForm}
                    className="font-medium text-blue-600 underline hover:text-blue-800"
                  >
                    Fill out detailed questionnaire →
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-4 text-center">
                <p className="text-sm text-gray-500">
                  We typically respond within 24 hours during business days.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  For urgent enquiries, please call us directly.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BathroomRenovationForm;
