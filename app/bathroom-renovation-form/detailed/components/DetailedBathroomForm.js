"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DetailedBathroomForm = () => {
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
    bathroomSize: "",
    designService: "",
    startDate: "",
    keepExisting: "",
    layout: "",
    layoutChanges: "",
    electrics: {
      newExtractorFan: false,
      replaceExtractorFan: false,
      newSpotlights: false,
      replaceSpotlights: false,
      newShaverSocket: false,
      replaceShaverSocket: false,
      moveSwitch: false,
      electricShowerPump: false,
      electricShower: false,
      electricMirror: false,
    },
    underfloorHeating: "",
    bathroomSuite: {
      floorStandingToilet: false,
      wallHungToilet: false,
      visibleCistern: false,
      concealedCistern: false,
      basin: false,
      vanityUnit: false,
      freestandingBath: false,
      cornerBath: false,
      separateShowerUnit: false,
      wetRoomKit: false,
      radiator: false,
    },
    tiling: {
      fullHeightShower: false,
      halfHeightWalls: false,
      allWallsFullHeight: false,
      tileFloor: false,
      vinylFlooring: false,
    },
    decorating: {
      plasterCeiling: false,
      plasterWalls: false,
      paintCeiling: false,
      paintWalls: false,
      paintWoodwork: false,
    },
    additionalInfo: "",
  });

  const bathroomSizes = ["Small", "Medium", "Large"];
  const designServices = [
    "Yes, I would like my bathroom designed",
    "No, I have design covered",
  ];
  const layouts = ["Same layout", "New Layout"];
  const underfloorHeatingOptions = [
    "Yes, electric UFH",
    "Yes, wet UFH",
    "No, I don't need UFH",
  ];

  useEffect(() => {
    // Load data from sessionStorage if available
    const savedData = sessionStorage.getItem("bathroomFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData((prev) => ({
        ...prev,
        ...parsedData,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (category, field) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field],
      },
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
    if (!formData.bathroomSize) {
      toast.error("Bathroom size is required");
      return;
    }
    if (!formData.designService) {
      toast.error("Design service preference is required");
      return;
    }
    if (!formData.startDate.trim()) {
      toast.error("Start date is required");
      return;
    }
    if (!formData.keepExisting.trim()) {
      toast.error("Please specify what to keep from old bathroom");
      return;
    }
    if (!formData.layout) {
      toast.error("Layout preference is required");
      return;
    }
    if (formData.layout === "New Layout" && !formData.layoutChanges.trim()) {
      toast.error("Please explain layout changes");
      return;
    }
    if (!formData.underfloorHeating) {
      toast.error("Underfloor heating preference is required");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your detailed enquiry...");

    try {
      const response = await fetch("/api/bathroom-renovation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          hasDetailedInfo: true,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Detailed enquiry submitted successfully!", {
          id: loadingToast,
        });
        // Clear sessionStorage
        sessionStorage.removeItem("bathroomFormData");
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

  const goBack = () => {
    router.push("/bathroom-renovation-form");
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Detailed Bathroom Questionnaire
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Provide detailed information about your bathroom renovation project
            for a more accurate quote.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information (Pre-filled) */}
              <div className="rounded-lg bg-gray-50 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Your Information
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formData.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formData.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formData.phone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formData.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bathroom Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Bathroom Details
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="bathroomSize"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Bathroom Size *
                    </label>
                    <select
                      id="bathroomSize"
                      name="bathroomSize"
                      value={formData.bathroomSize}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select bathroom size</option>
                      {bathroomSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="designService"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Design Service *
                    </label>
                    <select
                      id="designService"
                      name="designService"
                      value={formData.designService}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select design service</option>
                      {designServices.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="startDate"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Rough Start Date *
                  </label>
                  <input
                    type="text"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Next month, In 3 months, Flexible"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="keepExisting"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    What to keep from old bathroom? *
                  </label>
                  <textarea
                    id="keepExisting"
                    name="keepExisting"
                    value={formData.keepExisting}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Keep the layout, replace everything, keep the bath but replace toilet and basin"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="layout"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Bathroom Layout *
                  </label>
                  <select
                    id="layout"
                    name="layout"
                    value={formData.layout}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select layout preference</option>
                    {layouts.map((layout) => (
                      <option key={layout} value={layout}>
                        {layout}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.layout === "New Layout" && (
                  <div>
                    <label
                      htmlFor="layoutChanges"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Explain layout changes *
                    </label>
                    <textarea
                      id="layoutChanges"
                      name="layoutChanges"
                      value={formData.layoutChanges}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe what changes you want to make to the bathroom layout"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Electrics */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Bathroom Electrics
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries({
                    newExtractorFan: "New installation of extractor fan",
                    replaceExtractorFan: "Replace existing extractor fan",
                    newSpotlights: "New installation of spotlights",
                    replaceSpotlights: "Replace spotlights",
                    newShaverSocket: "New installation of shaver socket",
                    replaceShaverSocket: "Replace shaver socket",
                    moveSwitch: "Move position of existing switch",
                    electricShowerPump: "Electric shower pump installation",
                    electricShower: "Electric shower installation",
                    electricMirror: "Mains powered electric mirror",
                  }).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={formData.electrics[key]}
                        onChange={() => handleCheckboxChange("electrics", key)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Underfloor Heating */}
              <div>
                <label
                  htmlFor="underfloorHeating"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Underfloor Heating *
                </label>
                <select
                  id="underfloorHeating"
                  name="underfloorHeating"
                  value={formData.underfloorHeating}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select underfloor heating option</option>
                  {underfloorHeatingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bathroom Suite */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  New Bathroom Suite
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries({
                    floorStandingToilet: "Floor standing toilet",
                    wallHungToilet: "Wall hung toilet",
                    visibleCistern: "Visible cistern",
                    concealedCistern: "Concealed cistern",
                    basin: "Basin",
                    vanityUnit: "Vanity unit",
                    freestandingBath: "Free standing bath tub",
                    cornerBath: "Corner/regular bath",
                    separateShowerUnit: "Separate shower unit with shower tray",
                    wetRoomKit: "Separate shower unit with wet room kit",
                    radiator: "Radiator/heated towel rail",
                  }).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={formData.bathroomSuite[key]}
                        onChange={() =>
                          handleCheckboxChange("bathroomSuite", key)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tiling */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Bathroom Tiling
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries({
                    fullHeightShower:
                      "Tile full height in shower/bath enclosure and splash back",
                    halfHeightWalls:
                      "Tile full height in shower/bath enclosure and half way rest of the walls",
                    allWallsFullHeight: "Tile all walls full height",
                    tileFloor: "Tile floor",
                    vinylFlooring: "Vinyl flooring",
                  }).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={formData.tiling[key]}
                        onChange={() => handleCheckboxChange("tiling", key)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Decorating */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Decorating
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries({
                    plasterCeiling: "Plaster ceiling",
                    plasterWalls: "Plaster walls",
                    paintCeiling: "Prime and paint ceiling",
                    paintWalls: "Prime and paint walls",
                    paintWoodwork: "Prime and paint woodwork",
                  }).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={formData.decorating[key]}
                        onChange={() => handleCheckboxChange("decorating", key)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label
                  htmlFor="additionalInfo"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Is there something we missed?
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional information about your bathroom renovation project"
                />
              </div>

              {/* Supporting Documents Info */}
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="mb-2 text-lg font-semibold text-blue-900">
                  Supporting Documents
                </h3>
                <p className="text-sm text-blue-800">
                  If you have any supporting photos, documentation, or
                  additional information, please send them to{" "}
                  <strong>contact@celli.co.uk</strong> with the subject line
                  containing your postcode:{" "}
                  <strong>{formData.address.split(" ").pop()}</strong>
                </p>
              </div>

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
                    "Submit Detailed Enquiry"
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={goBack}
                    className="font-medium text-gray-600 underline hover:text-gray-800"
                  >
                    ← Back to simple form
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedBathroomForm;
