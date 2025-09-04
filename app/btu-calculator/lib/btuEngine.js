// BTU Calculation Engine
// Industry-standard BTU calculation for radiators based on UK heating requirements

export const calculateBTU = (formData) => {
  const {
    roomLength,
    roomWidth,
    roomHeight,
    roomType,
    insulationLevel,
    windowCount,
    doorCount,
    heatingType,
    outsideWallCount,
  } = formData;

  // Basic room calculations
  const roomArea = roomLength * roomWidth; // in square metres
  const roomVolume = roomArea * roomHeight; // in cubic metres

  // Convert to square feet for BTU calculation (industry standard)
  const roomAreaSqFt = roomArea * 10.764; // 1 sq m = 10.764 sq ft
  const roomHeightFt = roomHeight * 3.281; // 1 m = 3.281 ft

  // Base BTU calculation using UK standard: 18 BTU per sq ft
  // This is conservative and accurate for UK heating calculations
  let baseBTU = roomAreaSqFt * 18;

  // Ceiling height adjustment (add 10% for each foot above 8 feet)
  const standardCeilingHeight = 8; // feet
  if (roomHeightFt > standardCeilingHeight) {
    const extraHeight = roomHeightFt - standardCeilingHeight;
    const heightMultiplier = 1 + extraHeight * 0.1; // 10% per extra foot
    baseBTU *= heightMultiplier;
  }

  // Room type adjustments (based on typical heat requirements)
  const roomTypeMultipliers = {
    "Living Room": 1.0,
    Bedroom: 0.9,
    Bathroom: 1.2, // Higher for quick warm-up
    Kitchen: 0.8, // Lower due to cooking heat
    "Dining Room": 1.0,
    "Study/Office": 1.0,
    Hallway: 0.7, // Lower as it's a passage area
    "Utility Room": 0.9,
  };

  // Insulation level adjustments (based on heat loss factors)
  const insulationMultipliers = {
    Excellent: 0.8, // Modern insulation, double/triple glazing
    Good: 1.0, // Some insulation, double glazing
    Average: 1.2, // Basic insulation, some double glazing
    Poor: 1.5, // Minimal insulation, single glazing
  };

  // Heating type adjustments (efficiency factors)
  const heatingTypeMultipliers = {
    "Gas Radiator": 1.0,
    "Electric Radiator": 1.0,
    "Underfloor Heating": 0.9, // More efficient heat distribution
  };

  // Apply room type and insulation multipliers
  const roomMultiplier = roomTypeMultipliers[roomType] || 1.0;
  const insulationMultiplier = insulationMultipliers[insulationLevel] || 1.0;
  const heatingMultiplier = heatingTypeMultipliers[heatingType] || 1.0;

  // Calculate adjusted BTU
  let adjustedBTU =
    baseBTU * roomMultiplier * insulationMultiplier * heatingMultiplier;

  // Add BTU for heat loss through openings (more conservative additions)
  const windowBTU = windowCount * 500; // 500 BTU per window (heat loss)
  const doorBTU = doorCount * 300; // 300 BTU per door (heat loss)
  const externalWallBTU = outsideWallCount * 200; // 200 BTU per external wall

  // Add occupancy factor (each person adds ~100 BTU)
  const occupancyBTU = 200; // Assume 2 people average

  // Add appliance factor (kitchens and rooms with electronics)
  const applianceBTU = roomType === "Kitchen" ? 500 : 100; // Kitchens need extra for cooking heat

  adjustedBTU +=
    windowBTU + doorBTU + externalWallBTU + occupancyBTU + applianceBTU;

  // Add safety margin (10-15% is standard)
  const safetyMargin = 1.15;
  const finalBTU = Math.round(adjustedBTU * safetyMargin);

  // Calculate radiator recommendations
  const radiatorRecommendations = calculateRadiatorRecommendations(
    finalBTU,
    roomArea,
  );

  // Calculate estimated costs
  const costEstimate = calculateCostEstimate(finalBTU, heatingType);

  return {
    totalBTU: finalBTU,
    roomVolume: Math.round(roomVolume * 100) / 100,
    roomArea: Math.round(roomArea * 100) / 100,
    baseBTU: Math.round(baseBTU),
    adjustments: {
      roomType: roomMultiplier,
      insulation: insulationMultiplier,
      heatingType: heatingMultiplier,
      windows: windowBTU,
      doors: doorBTU,
      externalWalls: externalWallBTU,
      occupancy: occupancyBTU,
      appliances: applianceBTU,
    },
    radiatorRecommendations,
    costEstimate,
    formData,
  };
};

const calculateRadiatorRecommendations = (totalBTU, roomArea) => {
  const recommendations = [];

  // Single large radiator option
  recommendations.push({
    type: "Single Radiator",
    count: 1,
    btuPerRadiator: totalBTU,
    description: `One ${totalBTU} BTU radiator`,
    placement: "Best positioned on the largest external wall",
  });

  // Two radiator option (if BTU is high enough)
  if (totalBTU > 1500) {
    const btuPerRadiator = Math.round(totalBTU / 2);
    recommendations.push({
      type: "Two Radiators",
      count: 2,
      btuPerRadiator: btuPerRadiator,
      description: `Two ${btuPerRadiator} BTU radiators`,
      placement: "Position on opposite walls for even heat distribution",
    });
  }

  // Three radiator option (for very large rooms)
  if (totalBTU > 3000) {
    const btuPerRadiator = Math.round(totalBTU / 3);
    recommendations.push({
      type: "Three Radiators",
      count: 3,
      btuPerRadiator: btuPerRadiator,
      description: `Three ${btuPerRadiator} BTU radiators`,
      placement: "Distribute evenly around the room perimeter",
    });
  }

  return recommendations;
};

const calculateCostEstimate = (totalBTU, heatingType) => {
  // More realistic cost estimates based on current UK market prices
  const costPerBTU = {
    "Gas Radiator": 0.1, // £0.30 per BTU (more realistic for gas radiators)
    "Electric Radiator": 0.17, // £0.50 per BTU (electric radiators are more expensive)
    "Underfloor Heating": 0.7, // £1.20 per BTU (most expensive installation)
  };

  const baseCost = totalBTU * (costPerBTU[heatingType] || 0.4);

  // Add installation costs (per radiator or per room)
  const installationCost = {
    "Gas Radiator": 300, // £300 per radiator (includes plumbing work)
    "Electric Radiator": 150, // £150 per radiator (simpler installation)
    "Underfloor Heating": 80, // £80 per square metre (complex installation)
  };

  const totalCost = baseCost + (installationCost[heatingType] || 200);

  return {
    radiatorCost: Math.round(baseCost),
    installationCost: installationCost[heatingType] || 200,
    totalCost: Math.round(totalCost),
    costPerBTU: costPerBTU[heatingType] || 0.4,
  };
};

// Helper function to get BTU range for room size (updated with realistic ranges)
export const getBTURange = (roomArea) => {
  if (roomArea < 10) return { min: 2000, max: 4000, description: "Small room" };
  if (roomArea < 20)
    return { min: 4000, max: 8000, description: "Medium room" };
  if (roomArea < 30)
    return { min: 8000, max: 12000, description: "Large room" };
  return { min: 12000, max: 20000, description: "Very large room" };
};

// Helper function to validate form data
export const validateFormData = (formData) => {
  const errors = [];

  if (!formData.roomLength || formData.roomLength <= 0) {
    errors.push("Room length must be greater than 0");
  }

  if (!formData.roomWidth || formData.roomWidth <= 0) {
    errors.push("Room width must be greater than 0");
  }

  if (!formData.roomHeight || formData.roomHeight <= 0) {
    errors.push("Room height must be greater than 0");
  }

  if (!formData.roomType) {
    errors.push("Please select a room type");
  }

  if (!formData.insulationLevel) {
    errors.push("Please select an insulation level");
  }

  if (!formData.heatingType) {
    errors.push("Please select a heating type");
  }

  return errors;
};
