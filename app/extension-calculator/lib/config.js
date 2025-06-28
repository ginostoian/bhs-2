// Master configuration for extension cost calculator
export const EXTENSION_CONFIG = {
  // Base costs per square meter for different extension types
  baseCosts: {
    singleStorey: 2500, // £2,500 per sqm
    doubleStorey: 3200, // £3,200 per sqm
    basement: 4500, // £4,500 per sqm
    loft: 2800, // £2,800 per sqm
  },

  // Size multipliers
  sizeMultipliers: {
    small: { min: 0, max: 20, multiplier: 1.1 }, // 0-20 sqm
    medium: { min: 21, max: 40, multiplier: 1.0 }, // 21-40 sqm
    large: { min: 41, max: 100, multiplier: 0.9 }, // 41-100 sqm
    xlarge: { min: 101, max: 200, multiplier: 0.85 }, // 101-200 sqm
  },

  // Location multipliers (London zones)
  locationMultipliers: {
    zone1: 1.4, // Central London
    zone2: 1.3, // Inner London
    zone3: 1.2, // Outer London
    zone4: 1.1, // Greater London
    zone5: 1.0, // Beyond Greater London
  },

  // Property type multipliers
  propertyMultipliers: {
    terraced: 1.0,
    semiDetached: 1.05,
    detached: 1.1,
    flat: 1.2,
    maisonette: 1.15,
  },

  // Additional features and their costs
  additionalFeatures: {
    // Structural features
    steelBeam: 2500,
    loadBearingWall: 1500,
    foundationWork: 8000,

    // Windows and doors
    biFoldDoors: 3500,
    slidingDoors: 2800,
    roofLights: 1200,
    veluxWindows: 800,

    // Heating and electrical
    underfloorHeating: 120,
    newBoiler: 3500,
    electricalRewiring: 45,

    // Finishing touches
    highEndKitchen: 25000,
    luxuryBathroom: 15000,
    bespokeJoinery: 200,
    premiumFlooring: 80,

    // External works
    landscaping: 50,
    driveway: 80,
    gardenRoom: 1500,
  },

  // Complexity multipliers
  complexityMultipliers: {
    simple: 1.0, // Standard extension
    moderate: 1.15, // Some complexity
    complex: 1.35, // High complexity
    veryComplex: 1.6, // Very complex
  },

  // Planning and legal costs
  planningCosts: {
    planningPermission: 2500,
    buildingRegulations: 1500,
    partyWallAgreement: 3000,
    structuralEngineer: 2000,
    architect: 8000,
  },

  // Contingency percentages
  contingency: {
    standard: 0.1, // 10%
    complex: 0.15, // 15%
    veryComplex: 0.2, // 20%
  },
};

// Property types for selection
export const PROPERTY_TYPES = [
  {
    id: "terraced",
    name: "Terraced House",
    description: "Connected to neighbouring properties",
  },
  {
    id: "semiDetached",
    name: "Semi-Detached House",
    description: "Connected to one neighbouring property",
  },
  {
    id: "detached",
    name: "Detached House",
    description: "Standalone property",
  },
  {
    id: "flat",
    name: "Flat/Apartment",
    description: "Part of a larger building",
  },
  { id: "maisonette", name: "Maisonette", description: "Two-storey flat" },
];

// Extension types
export const EXTENSION_TYPES = [
  {
    id: "singleStorey",
    name: "Single Storey Extension",
    description: "Ground floor extension",
  },
  {
    id: "doubleStorey",
    name: "Double Storey Extension",
    description: "Two-storey extension",
  },
  {
    id: "basement",
    name: "Basement Extension",
    description: "Below ground extension",
  },
  {
    id: "loft",
    name: "Loft Conversion",
    description: "Converting attic space",
  },
];

// London zones
export const LONDON_ZONES = [
  { id: "zone1", name: "Zone 1", description: "Central London" },
  { id: "zone2", name: "Zone 2", description: "Inner London" },
  { id: "zone3", name: "Zone 3", description: "Outer London" },
  { id: "zone4", name: "Zone 4", description: "Greater London" },
  { id: "zone5", name: "Zone 5+", description: "Beyond Greater London" },
];

// Complexity factors
export const COMPLEXITY_FACTORS = [
  {
    id: "simple",
    name: "Simple",
    description: "Standard extension with minimal complications",
  },
  {
    id: "moderate",
    name: "Moderate",
    description: "Some complexity with structural changes",
  },
  {
    id: "complex",
    name: "Complex",
    description: "High complexity with major structural work",
  },
  {
    id: "veryComplex",
    name: "Very Complex",
    description: "Very complex with significant challenges",
  },
];
