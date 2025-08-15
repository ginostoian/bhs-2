"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const KitchenRenovationForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isNewPurchase: "",
    propertyType: "",
    flatFloor: "",
    kitchenSize: "",
    kitchenSizeSqm: "",
    knockDownWall: "",
    rewiring: "",
    kitchenType: "",
    additionalRequests: "",
    source: "",
    customSource: "",
  });

  const propertyTypes = ["Flat", "House"];
  const kitchenSizes = ["Small", "Medium", "Large"];
  const rewiringOptions = ["Yes", "No", "Not sure"];
  const kitchenTypes = [
    "Retailer, flat packed",
    "Retailer, pre assembled",
    "Custom built by us",
    "Not sure",
  ];
  const sources = [
    "Google Search",
    "Google Ads",
    "Meta Ads",
    "Houzz",
    "MyBuilder",
    "Google MyBusiness",
    "Facebook",
    "Instagram",
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

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email address is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
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
      toast.error("Please select property type");
      return;
    }
    if (formData.propertyType === "Flat" && !formData.flatFloor.trim()) {
      toast.error("Please specify the floor number for your flat");
      return;
    }
    if (!formData.kitchenSize && !formData.kitchenSizeSqm.trim()) {
      toast.error("Please specify your kitchen size");
      return;
    }
    if (formData.source === "Other" && !formData.customSource.trim()) {
      toast.error("Please specify how you found us");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your enquiry...");

    try {
      const response = await fetch("/api/kitchen-renovation", {
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
        router.push("/kitchen-form-submitted");
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Kitchen Renovation Quote
            </h1>
            <p className="text-lg text-gray-600">
              Get a free quote for your kitchen renovation project. Fill out our
              form and we&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Information about you */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Information about you
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* About the project */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                About the project
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Is the property a new purchase? *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isNewPurchase"
                        value="Yes"
                        checked={formData.isNewPurchase === "Yes"}
                        onChange={handleInputChange}
                        className="mr-2"
                        required
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isNewPurchase"
                        value="No"
                        checked={formData.isNewPurchase === "No"}
                        onChange={handleInputChange}
                        className="mr-2"
                        required
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="propertyType"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Is the property a flat or house? *
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.propertyType === "Flat" && (
                  <div>
                    <label
                      htmlFor="flatFloor"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      What floor is the flat on? *
                    </label>
                    <input
                      type="text"
                      id="flatFloor"
                      name="flatFloor"
                      value={formData.flatFloor}
                      onChange={handleInputChange}
                      placeholder="e.g., Ground floor, 1st floor, 2nd floor"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    How big is your current kitchen? *
                  </label>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      {kitchenSizes.map((size) => (
                        <label key={size} className="flex items-center">
                          <input
                            type="radio"
                            name="kitchenSize"
                            value={size}
                            checked={formData.kitchenSize === size}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                    <div>
                      <label
                        htmlFor="kitchenSizeSqm"
                        className="mb-2 block text-sm text-gray-600"
                      >
                        Or specify in square meters:
                      </label>
                      <input
                        type="text"
                        id="kitchenSizeSqm"
                        name="kitchenSizeSqm"
                        value={formData.kitchenSizeSqm}
                        onChange={handleInputChange}
                        placeholder="e.g., 15 sqm"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue for more accurate estimate */}
            <div className="rounded-lg bg-blue-50 p-6">
              <p className="mb-4 text-blue-900">
                You can submit the form now or continue filling out to get a
                more accurate estimate.
              </p>
              <button
                type="button"
                onClick={() => setShowDetailedQuestions(!showDetailedQuestions)}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                {showDetailedQuestions
                  ? "Hide detailed questions"
                  : "Continue for more accurate estimate"}
              </button>
            </div>

            {showDetailedQuestions && (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Do you plan to enlarge your kitchen by knocking down a wall?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="knockDownWall"
                        value="Yes"
                        checked={formData.knockDownWall === "Yes"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="knockDownWall"
                        value="No"
                        checked={formData.knockDownWall === "No"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Does the kitchen need full rewiring?
                  </label>
                  <div className="flex space-x-4">
                    {rewiringOptions.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="rewiring"
                          value={option}
                          checked={formData.rewiring === option}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="kitchenType"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    What type of kitchen would you like installed?
                  </label>
                  <select
                    id="kitchenType"
                    name="kitchenType"
                    value={formData.kitchenType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select kitchen type</option>
                    {kitchenTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="additionalRequests"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Please let us know of any additional requests
                  </label>
                  <textarea
                    id="additionalRequests"
                    name="additionalRequests"
                    value={formData.additionalRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any specific requirements or preferences..."
                  />
                </div>

                <div className="rounded-lg bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> It would be great if you could email
                    us any documents that would help us estimate the project to{" "}
                    <a
                      href="mailto:contact@celli.co.uk"
                      className="text-blue-600 hover:underline"
                    >
                      contact@celli.co.uk
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* How did you hear about us */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                It would be great if you could let us know where you heard about
                us
              </label>
              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {sources.map((source) => (
                  <label key={source} className="flex items-center">
                    <input
                      type="radio"
                      name="source"
                      value={source}
                      checked={formData.source === source}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    {source}
                  </label>
                ))}
              </div>
              {formData.source === "Other" && (
                <div>
                  <label
                    htmlFor="customSource"
                    className="mb-2 block text-sm text-gray-600"
                  >
                    Please specify:
                  </label>
                  <input
                    type="text"
                    id="customSource"
                    name="customSource"
                    value={formData.customSource}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How did you find us?"
                  />
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KitchenRenovationForm;
