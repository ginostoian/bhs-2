// Master configuration for renovation cost calculator
export const RENOVATION_CONFIG = {
  // Base costs per square meter for different renovation types
  baseCosts: {
    bathroom: 8000, // £8,000 per bathroom
    kitchen: 15000, // £15,000 per kitchen
    bedroom: 3000, // £3,000 per bedroom
    livingRoom: 5000, // £5,000 per living room
    hallway: 2000, // £2,000 per hallway
  },

  // Size multipliers
  sizeMultipliers: {
    small: { min: 0, max: 50, multiplier: 1.2 }, // 0-50 sqm
    medium: { min: 51, max: 100, multiplier: 1.0 }, // 51-100 sqm
    large: { min: 101, max: 200, multiplier: 0.9 }, // 101-200 sqm
    xlarge: { min: 201, max: 500, multiplier: 0.85 }, // 201-500 sqm
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

  // House type multipliers
  houseTypeMultipliers: {
    victorian: 1.2,
    edwardian: 1.15,
    modern: 1.0,
    newBuild: 0.9,
    period: 1.25,
  },

  // Floor multipliers (for flats)
  floorMultipliers: {
    ground: 1.0,
    first: 1.05,
    second: 1.1,
    third: 1.15,
    fourth: 1.2,
    fifth: 1.25,
  },

  // Wallpaper removal costs
  wallpaperRemoval: {
    perSqm: 15, // £15 per sqm
  },

  // Structural work costs
  structuralWork: {
    wallRemoval: 800, // £800 per wall
    structuralWallRemoval: 2500, // £2,500 per structural wall
    steelBeam: 3000, // £3,000 per beam
    loadBearingSupport: 1500, // £1,500 per support
  },

  // Electrical work costs
  electricalWork: {
    rewire: 45, // £45 per sqm
    newConsumerUnit: 800,
    additionalSockets: 80, // per socket
    lighting: 120, // per light
  },

  // Heating system costs
  heatingWork: {
    newBoiler: 3500,
    radiators: 400, // per radiator
    underfloorHeating: 120, // per sqm
    smartThermostat: 300,
  },

  // Wall and ceiling work
  wallCeilingWork: {
    skimWalls: 25, // £25 per sqm
    skimCeilings: 30, // £30 per sqm
    plastering: 35, // £35 per sqm
    painting: 15, // £15 per sqm
  },

  // Door and frame costs
  doorWork: {
    internalDoor: 300, // per door
    doorFrame: 150, // per frame
    externalDoor: 1200, // per door
    slidingDoor: 800, // per door
  },

  // Flooring costs
  flooringWork: {
    woodFloor: 80, // £80 per sqm
    laminateFloor: 35, // £35 per sqm
    carpet: 25, // £25 per sqm
    tiles: 60, // £60 per sqm
    underlay: 8, // £8 per sqm
  },

  // Additional features and their costs
  additionalFeatures: {
    // Bathroom features
    luxuryBathroom: 5000, // additional cost
    walkInShower: 2000,
    freestandingBath: 1500,
    heatedTowelRail: 300,

    // Kitchen features
    highEndKitchen: 10000, // additional cost
    island: 3000,
    integratedAppliances: 2000,
    quartzWorktop: 150, // per sqm

    // Bedroom features
    fittedWardrobes: 2000,
    enSuite: 8000,
    walkInWardrobe: 5000,

    // General features
    smartHome: 2000,
    soundSystem: 1500,
    homeOffice: 3000,
    storageSolutions: 100, // per sqm
  },

  // Planning and legal costs
  planningCosts: {
    buildingRegulations: 1500,
    structuralEngineer: 2000,
    architect: 5000,
    partyWallAgreement: 3000,
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
  {
    id: "maisonette",
    name: "Maisonette",
    description: "Two-storey flat",
  },
];

// House types
export const HOUSE_TYPES = [
  {
    id: "victorian",
    name: "Victorian",
    description: "Built between 1837-1901",
  },
  {
    id: "edwardian",
    name: "Edwardian",
    description: "Built between 1901-1910",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Built after 1950",
  },
  {
    id: "newBuild",
    name: "New Build",
    description: "Built in the last 10 years",
  },
  {
    id: "period",
    name: "Period Property",
    description: "Pre-1900s with period features",
  },
];

// Floor options for flats
export const FLOOR_OPTIONS = [
  { id: "ground", name: "Ground Floor" },
  { id: "first", name: "First Floor" },
  { id: "second", name: "Second Floor" },
  { id: "third", name: "Third Floor" },
  { id: "fourth", name: "Fourth Floor" },
  { id: "fifth", name: "Fifth Floor" },
];

// London zones
export const LONDON_ZONES = [
  { id: "zone1", name: "Zone 1", description: "Central London" },
  { id: "zone2", name: "Zone 2", description: "Inner London" },
  { id: "zone3", name: "Zone 3", description: "Outer London" },
  { id: "zone4", name: "Zone 4", description: "Greater London" },
  { id: "zone5", name: "Zone 5+", description: "Beyond Greater London" },
];

// Floor types
export const FLOOR_TYPES = [
  {
    id: "wood",
    name: "Wood Flooring",
    description: "Solid or engineered wood",
  },
  {
    id: "laminate",
    name: "Laminate Flooring",
    description: "Budget-friendly laminate",
  },
  {
    id: "carpet",
    name: "Carpet",
    description: "Soft carpet flooring",
  },
  {
    id: "tiles",
    name: "Tiles",
    description: "Ceramic or porcelain tiles",
  },
];
