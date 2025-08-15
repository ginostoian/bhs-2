"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const GeneralRenovationForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    isNewPurchase: "",
    propertyType: "",
    flatFloor: "",
    numberOfRooms: "",
    boilerWork: "",
    rewiring: "",
    plastering: "",
    roomsNeedPlastering: "",
    painting: "",
    roomsNeedPainting: "",
    flooring: "",
    roomsNeedFlooring: "",
    flooringType: "",
    bathroomRenovation: "",
    kitchenRenovation: "",
    additionalRequests: "",
    source: "",
  });

  const sources = [
    "Google Search",
    "Google Ads",
    "Meta Ads",
    "Houzz",
    "Mybuilder",
    "Google MyBusiness",
    "Facebook",
    "Instagram",
    "Recommendation",
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

    // Validate required fields
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
    if (!formData.isNewPurchase) {
      toast.error("Please select whether this is a new purchase");
      return;
    }
    if (!formData.propertyType) {
      toast.error("Please select the property type");
      return;
    }
    if (formData.propertyType === "Flat" && !formData.flatFloor.trim()) {
      toast.error("Please specify the floor number for your flat");
      return;
    }
    if (!formData.numberOfRooms) {
      toast.error("Please specify the number of rooms");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your enquiry...");

    try {
      const response = await fetch("/api/general-renovation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          hasDetailedInfo: showDetailedQuestions,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Enquiry submitted successfully!", { id: loadingToast });
        router.push("/renovation-form-submitted");
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

  return (
    <section className="mx-auto my-10 max-w-[85%] rounded-3xl bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            General Renovation Quote
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Get a free quote for your general renovation project. Fill out the
            form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="rounded-lg bg-blue-50 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Information about you
                </h2>
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

                <div className="mt-6">
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

                <div className="mt-6">
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
              </div>

              {/* About the Project */}
              <div className="rounded-lg bg-green-50 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  About the project
                </h2>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="isNewPurchase"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Is the property a new purchase? *
                    </label>
                    <select
                      id="isNewPurchase"
                      name="isNewPurchase"
                      value={formData.isNewPurchase}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="propertyType"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Is the property a flat or house? *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="Flat">Flat</option>
                      <option value="House">House</option>
                    </select>
                  </div>
                </div>

                {formData.propertyType === "Flat" && (
                  <div className="mt-6">
                    <label
                      htmlFor="flatFloor"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      What floor is the flat on? *
                    </label>
                    <input
                      type="text"
                      id="flatFloor"
                      name="flatFloor"
                      value={formData.flatFloor}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Ground, 1st, 2nd, etc."
                      required
                    />
                  </div>
                )}

                <div className="mt-6">
                  <label
                    htmlFor="numberOfRooms"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    How many rooms does the property have? *
                  </label>
                  <input
                    type="number"
                    id="numberOfRooms"
                    name="numberOfRooms"
                    value={formData.numberOfRooms}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number of rooms"
                    required
                  />
                </div>
              </div>

              {/* Continue or Submit Section */}
              <div className="rounded-lg bg-yellow-50 p-6 text-center">
                <p className="mb-4 text-lg text-gray-700">
                  You can submit the form now or continue filling out to get a more accurate estimate.
                </p>
                
                {!showDetailedQuestions ? (
                  <button
                    type="button"
                    onClick={() => setShowDetailedQuestions(true)}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Continue for more accurate estimate →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDetailedQuestions(false)}
                    className="rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    ← Back to basic form
                  </button>
                )}
              </div>

              {/* Detailed Questions */}
              {showDetailedQuestions && (
                <div className="rounded-lg bg-purple-50 p-6">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Additional details for accurate estimate
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="boilerWork"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Will there be any work on the boiler?
                      </label>
                      <select
                        id="boilerWork"
                        name="boilerWork"
                        value={formData.boilerWork}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select an option</option>
                        <option value="Yes, I need to convert to a combi boiler">
                          Yes, I need to convert to a combi boiler
                        </option>
                        <option value="Yes, I need to replace my boiler">
                          Yes, I need to replace my boiler
                        </option>
                        <option value="Yes, I need to move my boiler">
                          Yes, I need to move my boiler
                        </option>
                        <option value="No work needed">No work needed</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="rewiring"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Does the property need rewiring?
                      </label>
                      <select
                        id="rewiring"
                        name="rewiring"
                        value={formData.rewiring}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select an option</option>
                        <option value="Yes, full rewire required">
                          Yes, full rewire required
                        </option>
                        <option value="Yes, partial rewire required">
                          Yes, partial rewire required
                        </option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="plastering"
                          className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                          Does the property need plastering?
                        </label>
                        <select
                          id="plastering"
                          name="plastering"
                          value={formData.plastering}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select an option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      {formData.plastering === "Yes" && (
                        <div>
                          <label
                            htmlFor="roomsNeedPlastering"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                          >
                            How many rooms need plastering?
                          </label>
                          <input
                            type="number"
                            id="roomsNeedPlastering"
                            name="roomsNeedPlastering"
                            value={formData.roomsNeedPlastering}
                            onChange={handleInputChange}
                            min="1"
                            max={formData.numberOfRooms || 20}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter number of rooms"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="painting"
                          className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                          Does the property need painting?
                        </label>
                        <select
                          id="painting"
                          name="painting"
                          value={formData.painting}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select an option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      {formData.painting === "Yes" && (
                        <div>
                          <label
                            htmlFor="roomsNeedPainting"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                          >
                            How many rooms need painting?
                          </label>
                          <input
                            type="number"
                            id="roomsNeedPainting"
                            name="roomsNeedPainting"
                            value={formData.roomsNeedPainting}
                            onChange={handleInputChange}
                            min="1"
                            max={formData.numberOfRooms || 20}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter number of rooms"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="flooring"
                          className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                          Does the property need flooring?
                        </label>
                        <select
                          id="flooring"
                          name="flooring"
                          value={formData.flooring}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select an option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      {formData.flooring === "Yes" && (
                        <div>
                          <label
                            htmlFor="roomsNeedFlooring"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                          >
                            How many rooms need flooring?
                          </label>
                          <input
                            type="number"
                            id="roomsNeedFlooring"
                            name="roomsNeedFlooring"
                            value={formData.roomsNeedFlooring}
                            onChange={handleInputChange}
                            min="1"
                            max={formData.numberOfRooms || 20}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter number of rooms"
                          />
                        </div>
                      )}
                    </div>

                    {formData.flooring === "Yes" && (
                      <div>
                        <label
                          htmlFor="flooringType"
                          className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                          What type of flooring? (e.g., carpet, tiles, wood flooring)
                        </label>
                        <input
                          type="text"
                          id="flooringType"
                          name="flooringType"
                          value={formData.flooringType}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., carpet, tiles, wood flooring"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="bathroomRenovation"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Does the project involve the renovation of one or more bathrooms?
                      </label>
                      <select
                        id="bathroomRenovation"
                        name="bathroomRenovation"
                        value={formData.bathroomRenovation}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select an option</option>
                        <option value="No">No</option>
                        <option value="Yes, one bathroom">Yes, one bathroom</option>
                        <option value="Yes, more than one bathroom">
                          Yes, more than one bathroom
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="kitchenRenovation"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Does the project involve the renovation and installation of the kitchen?
                      </label>
                      <select
                        id="kitchenRenovation"
                        name="kitchenRenovation"
                        value={formData.kitchenRenovation}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="additionalRequests"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Please let us know of any additional requests
                      </label>
                      <textarea
                        id="additionalRequests"
                        name="additionalRequests"
                        value={formData.additionalRequests}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about any other requirements or special requests..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-700">
                    It would be great if you could let us know where you heard about us
                  </p>
                  <select
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option</option>
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You should email us any documents that would help us estimate the project to{" "}
                    <a
                      href="mailto:contact@celli.co.uk"
                      className="font-semibold underline hover:text-blue-600"
                    >
                      contact@celli.co.uk
                    </a>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
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

export default GeneralRenovationForm;
