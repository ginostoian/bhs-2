"use client";

import React from "react";
import { EXTENSION_CONFIG } from "../../lib/config";

const StepExtras = ({ formData, setFormData, onNext, onBack }) => {
  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      additionalFeatures: prev.additionalFeatures?.includes(feature)
        ? prev.additionalFeatures.filter((f) => f !== feature)
        : [...(prev.additionalFeatures || []), feature],
    }));
  };

  const handlePlanningServiceToggle = (service) => {
    setFormData((prev) => ({
      ...prev,
      planningServices: prev.planningServices?.includes(service)
        ? prev.planningServices.filter((s) => s !== service)
        : [...(prev.planningServices || []), service],
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const additionalFeatures = [
    {
      id: "steelBeam",
      name: "Steel Beam",
      cost: EXTENSION_CONFIG.additionalFeatures.steelBeam,
      description: "Structural steel beam for open plan layouts",
    },
    {
      id: "loadBearingWall",
      name: "Load Bearing Wall Removal",
      cost: EXTENSION_CONFIG.additionalFeatures.loadBearingWall,
      description: "Removing internal load-bearing walls",
    },
    {
      id: "foundationWork",
      name: "Foundation Work",
      cost: EXTENSION_CONFIG.additionalFeatures.foundationWork,
      description: "Additional foundation work required",
    },
    {
      id: "biFoldDoors",
      name: "Bi-fold Doors",
      cost: EXTENSION_CONFIG.additionalFeatures.biFoldDoors,
      description: "High-quality bi-fold doors to garden",
    },
    {
      id: "slidingDoors",
      name: "Sliding Doors",
      cost: EXTENSION_CONFIG.additionalFeatures.slidingDoors,
      description: "Sliding patio doors",
    },
    {
      id: "roofLights",
      name: "Roof Lights",
      cost: EXTENSION_CONFIG.additionalFeatures.roofLights,
      description: "Fixed roof lights for natural light",
    },
    {
      id: "veluxWindows",
      name: "Velux Windows",
      cost: EXTENSION_CONFIG.additionalFeatures.veluxWindows,
      description: "Opening roof windows",
    },
    {
      id: "underfloorHeating",
      name: "Underfloor Heating",
      cost: EXTENSION_CONFIG.additionalFeatures.underfloorHeating,
      description: "Electric underfloor heating system",
    },
    {
      id: "newBoiler",
      name: "New Boiler",
      cost: EXTENSION_CONFIG.additionalFeatures.newBoiler,
      description: "Upgrade to new boiler system",
    },
    {
      id: "electricalRewiring",
      name: "Electrical Rewiring",
      cost: EXTENSION_CONFIG.additionalFeatures.electricalRewiring,
      description: "Complete electrical rewiring",
    },
    {
      id: "highEndKitchen",
      name: "High-end Kitchen",
      cost: EXTENSION_CONFIG.additionalFeatures.highEndKitchen,
      description: "Luxury kitchen with premium appliances",
    },
    {
      id: "luxuryBathroom",
      name: "Luxury Bathroom",
      cost: EXTENSION_CONFIG.additionalFeatures.luxuryBathroom,
      description: "High-spec bathroom with premium fixtures",
    },
    {
      id: "bespokeJoinery",
      name: "Bespoke Joinery",
      cost: EXTENSION_CONFIG.additionalFeatures.bespokeJoinery,
      description: "Custom built-in storage and furniture",
    },
    {
      id: "premiumFlooring",
      name: "Premium Flooring",
      cost: EXTENSION_CONFIG.additionalFeatures.premiumFlooring,
      description: "High-quality flooring materials",
    },
    {
      id: "landscaping",
      name: "Landscaping",
      cost: EXTENSION_CONFIG.additionalFeatures.landscaping,
      description: "Garden landscaping and design",
    },
    {
      id: "driveway",
      name: "Driveway",
      cost: EXTENSION_CONFIG.additionalFeatures.driveway,
      description: "New driveway or parking area",
    },
    {
      id: "gardenRoom",
      name: "Garden Room",
      cost: EXTENSION_CONFIG.additionalFeatures.gardenRoom,
      description: "Additional garden room or outbuilding",
    },
  ];

  const planningServices = [
    {
      id: "planningPermission",
      name: "Planning Permission",
      cost: EXTENSION_CONFIG.planningCosts.planningPermission,
      description: "Planning permission application and management",
    },
    {
      id: "buildingRegulations",
      name: "Building Regulations",
      cost: EXTENSION_CONFIG.planningCosts.buildingRegulations,
      description: "Building regulations compliance",
    },
    {
      id: "partyWallAgreement",
      name: "Party Wall Agreement",
      cost: EXTENSION_CONFIG.planningCosts.partyWallAgreement,
      description: "Party wall surveyor and agreements",
    },
    {
      id: "structuralEngineer",
      name: "Structural Engineer",
      cost: EXTENSION_CONFIG.planningCosts.structuralEngineer,
      description: "Structural engineering design and calculations",
    },
    {
      id: "architect",
      name: "Architect Services",
      cost: EXTENSION_CONFIG.planningCosts.architect,
      description: "Full architectural design and project management",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Any additional features?
        </h2>
        <p className="text-lg text-gray-600">
          Select any additional features or services you&apos;d like to include
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Additional Features */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Additional Features
          </h3>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                  formData.additionalFeatures?.includes(feature.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleFeatureToggle(feature.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div
                      className={`mr-3 mt-0.5 flex h-4 w-4 items-center justify-center rounded border-2 ${
                        formData.additionalFeatures?.includes(feature.id)
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.additionalFeatures?.includes(feature.id) && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {feature.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    {formatCurrency(feature.cost)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planning Services */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Planning & Legal Services
          </h3>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {planningServices.map((service) => (
              <div
                key={service.id}
                className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                  formData.planningServices?.includes(service.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handlePlanningServiceToggle(service.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div
                      className={`mr-3 mt-0.5 flex h-4 w-4 items-center justify-center rounded border-2 ${
                        formData.planningServices?.includes(service.id)
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.planningServices?.includes(service.id) && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    {formatCurrency(service.cost)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Calculate Cost
        </button>
      </div>
    </div>
  );
};

export default StepExtras;
