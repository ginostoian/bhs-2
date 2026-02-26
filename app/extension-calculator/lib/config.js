// Structured configuration for a homeowner-friendly UK extension cost calculator.
// Rates are intended for ballpark budgeting and are calibrated to produce
// "low / expected / high" ranges rather than a false sense of precision.

export const EXTENSION_CONFIG = {
  version: "2026.02",

  // Expected build rates (ex VAT) for a standard specification before modifiers.
  // These are per m² of extension area as entered by the user.
  baseBuildRates: {
    singleStorey: 1900,
    doubleStorey: 2100,
    basement: 3600,
    loft: 2300,
  },

  sizeMultipliers: {
    small: { min: 1, max: 20, multiplier: 1.08 },
    medium: { min: 21, max: 40, multiplier: 1.0 },
    large: { min: 41, max: 80, multiplier: 0.95 },
    xlarge: { min: 81, max: 200, multiplier: 0.9 },
  },

  regionMultipliers: {
    london: 1.08,
    southEast: 1.02,
    eastEngland: 1.0,
    southWest: 0.98,
    midlands: 0.94,
    northEngland: 0.91,
    scotlandWales: 0.95,
  },

  // Additional uplift when London is selected.
  londonZoneMultipliers: {
    zone1: 1.12,
    zone2: 1.08,
    zone3: 1.05,
    zone4: 1.02,
    zone5: 1.0,
  },

  propertyMultipliers: {
    terraced: 1.02,
    semiDetached: 1.0,
    detached: 0.99,
    flat: 1.12,
    maisonette: 1.08,
  },

  complexityMultipliers: {
    simple: 0.95,
    moderate: 1.0,
    complex: 1.1,
    veryComplex: 1.22,
  },

  finishLevelMultipliers: {
    shellOnly: 0.86,
    standard: 1.0,
    premium: 1.12,
  },

  siteAccessMultipliers: {
    easy: 0.97,
    standard: 1.0,
    difficult: 1.08,
    veryDifficult: 1.15,
  },

  glazingLevelMultipliers: {
    standard: 1.0,
    glazed: 1.05,
    highGlazing: 1.1,
  },

  contingencyRates: {
    simple: 0.08,
    moderate: 0.1,
    complex: 0.12,
    veryComplex: 0.15,
  },

  // Used to widen/narrow the range based on information certainty.
  confidenceModifiers: {
    drawingsStatus: {
      noPlansYet: 1.12,
      roughIdeas: 1.07,
      measuredPlans: 1.03,
      architectPlans: 1.0,
    },
    planningStatus: {
      unknown: 1.07,
      likelyPermittedDevelopment: 1.02,
      planningRequired: 1.05,
      approved: 1.0,
    },
  },

  // Broad defaults for a conservative VAT-inclusive range estimate.
  // For simplicity/trust, VAT is applied to the full subtotal.
  vatRate: 0.2,

  // Professional/statuory costs used when selected by user.
  // "taxable" is used in case VAT treatment is separated later.
  planningServices: {
    measuredSurvey: { cost: 750, category: "professional", taxable: true },
    architectConcept: { cost: 1800, category: "professional", taxable: true },
    architectFullDesign: { cost: 4500, category: "professional", taxable: true },
    structuralEngineer: { cost: 1200, category: "professional", taxable: true },
    planningApplicationSupport: {
      cost: 900,
      category: "professional",
      taxable: true,
    },
    planningApplicationFee: { cost: 258, category: "statutory", taxable: false },
    buildingControl: { cost: 900, category: "statutory", taxable: false },
    partyWallSurveyor: { cost: 1800, category: "professional", taxable: true },
    ThamesWaterBuildOver: { cost: 600, category: "statutory", taxable: false },
  },

  // Typical recommended fees if user does not know what to select yet.
  recommendedFeeBundles: {
    base: ["measuredSurvey", "structuralEngineer", "buildingControl"],
    withPlanning: ["planningApplicationSupport", "planningApplicationFee"],
    withArchitect: ["architectConcept"],
    withFullDesign: ["architectFullDesign"],
  },

  // Unit-based extras to avoid misleading flat-fee assumptions.
  additionalFeatures: {
    steelBeam: {
      name: "Structural steel beam",
      unit: "per_item",
      unitLabel: "beam(s)",
      unitCost: 2500,
      defaultQuantity: 1,
      minQuantity: 1,
      maxQuantity: 6,
      description: "Typical supply/install allowance per major beam",
    },
    structuralOpening: {
      name: "Large structural opening",
      unit: "per_item",
      unitLabel: "opening(s)",
      unitCost: 3200,
      defaultQuantity: 1,
      minQuantity: 1,
      maxQuantity: 6,
      description: "Opening up the rear wall / major internal opening",
    },
    foundationUpgrade: {
      name: "Foundation upgrade allowance",
      unit: "fixed",
      unitLabel: "allowance",
      unitCost: 6000,
      defaultQuantity: 1,
      minQuantity: 1,
      maxQuantity: 1,
      description: "For poor ground / trees / deeper foundations (allowance)",
    },
    biFoldDoors: {
      name: "Bi-fold / large glazing doors",
      unit: "per_item",
      unitLabel: "set(s)",
      unitCost: 6500,
      defaultQuantity: 1,
      minQuantity: 1,
      maxQuantity: 3,
      description: "Supply and install typical aluminium set",
    },
    roofLights: {
      name: "Roof lights",
      unit: "per_item",
      unitLabel: "unit(s)",
      unitCost: 1200,
      defaultQuantity: 2,
      minQuantity: 1,
      maxQuantity: 8,
      description: "Allowance per rooflight including trims",
    },
    veluxWindows: {
      name: "Velux windows",
      unit: "per_item",
      unitLabel: "unit(s)",
      unitCost: 900,
      defaultQuantity: 2,
      minQuantity: 1,
      maxQuantity: 8,
      description: "Common for loft conversions",
    },
    underfloorHeating: {
      name: "Underfloor heating",
      unit: "per_m2",
      unitLabel: "m²",
      unitCost: 110,
      defaultQuantity: 15,
      minQuantity: 1,
      maxQuantity: 120,
      description: "Hydronic/electric blended ballpark install allowance",
    },
    electricalRewiring: {
      name: "Electrical upgrade / extra circuits",
      unit: "per_m2",
      unitLabel: "m²",
      unitCost: 55,
      defaultQuantity: 20,
      minQuantity: 1,
      maxQuantity: 200,
      description: "Allowance for extension electrical works and distribution",
    },
    kitchenFitout: {
      name: "Kitchen fit-out",
      unit: "fixed",
      unitLabel: "allowance",
      unitCost: 18000,
      defaultQuantity: 1,
      minQuantity: 1,
      maxQuantity: 1,
      description: "Kitchen units/appliances/worktops (mid-range allowance)",
    },
    bathroomFitout: {
      name: "Bathroom / ensuite fit-out",
      unit: "per_item",
      unitLabel: "room(s)",
      unitCost: 9000,
      defaultQuantity: 1,
      minQuantity: 1,
      maxQuantity: 3,
      description: "Typical complete bathroom/ensuite allowance",
    },
    bespokeJoinery: {
      name: "Bespoke joinery",
      unit: "per_m2",
      unitLabel: "m²",
      unitCost: 180,
      defaultQuantity: 10,
      minQuantity: 1,
      maxQuantity: 80,
      description: "Built-in storage/media joinery allowance",
    },
    premiumFlooringUpgrade: {
      name: "Premium flooring upgrade",
      unit: "per_m2",
      unitLabel: "m²",
      unitCost: 75,
      defaultQuantity: 20,
      minQuantity: 1,
      maxQuantity: 120,
      description: "Upgrade above standard flooring allowance",
    },
    landscapingMakingGood: {
      name: "Landscaping / making good",
      unit: "fixed",
      unitLabel: "allowance",
      unitCost: 3500,
      defaultQuantity: 1,
      minQuantity: 1,
      maxQuantity: 1,
      description: "Patio / garden reinstatement allowance",
    },
  },
};

export const PROPERTY_TYPES = [
  {
    id: "terraced",
    name: "Terraced house",
    description: "Usually tighter access and neighbour interfaces",
  },
  {
    id: "semiDetached",
    name: "Semi-detached house",
    description: "Common London extension type",
  },
  {
    id: "detached",
    name: "Detached house",
    description: "More access flexibility in many cases",
  },
  {
    id: "flat",
    name: "Flat / apartment",
    description: "Often more permissions and structural constraints",
  },
  {
    id: "maisonette",
    name: "Maisonette",
    description: "Shared building considerations may apply",
  },
];

export const EXTENSION_TYPES = [
  {
    id: "singleStorey",
    name: "Single-storey extension",
    description: "Rear / side / wraparound at ground floor level",
  },
  {
    id: "doubleStorey",
    name: "Double-storey extension",
    description: "Ground + first floor extension",
  },
  {
    id: "basement",
    name: "Basement extension",
    description: "Excavation / underpinning and high structural complexity",
  },
  {
    id: "loft",
    name: "Loft conversion",
    description: "Dormer / mansard / hip-to-gable style conversions",
  },
];

export const REGIONS = [
  {
    id: "london",
    name: "London",
    description: "Most expensive on average; can refine by zone",
    isServiceArea: true,
  },
  {
    id: "southEast",
    name: "South East",
    description: "Outside London, generally high labour/material costs",
    isServiceArea: false,
  },
  {
    id: "eastEngland",
    name: "East of England",
    description: "East Anglia / Home Counties areas",
    isServiceArea: false,
  },
  {
    id: "southWest",
    name: "South West",
    description: "Regional pricing varies by local access and supply chain",
    isServiceArea: false,
  },
  {
    id: "midlands",
    name: "Midlands",
    description: "Typical UK pricing benchmark region",
    isServiceArea: false,
  },
  {
    id: "northEngland",
    name: "North of England",
    description: "Often lower labour costs than London/South East",
    isServiceArea: false,
  },
  {
    id: "scotlandWales",
    name: "Scotland / Wales",
    description: "Region-wide average for early budgeting only",
    isServiceArea: false,
  },
];

export const LONDON_ZONES = [
  { id: "zone1", name: "Zone 1", description: "Central London (highest costs)" },
  { id: "zone2", name: "Zone 2", description: "Inner London" },
  { id: "zone3", name: "Zone 3", description: "Outer-inner London" },
  { id: "zone4", name: "Zone 4", description: "Outer London" },
  { id: "zone5", name: "Zone 5+", description: "Greater London outer ring" },
];

export const COMPLEXITY_FACTORS = [
  {
    id: "simple",
    name: "Simple",
    description: "Straightforward build, minimal structural changes",
  },
  {
    id: "moderate",
    name: "Moderate",
    description: "Typical extension with some structural and service changes",
  },
  {
    id: "complex",
    name: "Complex",
    description: "Challenging structure, access, or significant reconfiguration",
  },
  {
    id: "veryComplex",
    name: "Very complex",
    description: "Basement/major structural risk/tight access/high complexity",
  },
];

export const FINISH_LEVELS = [
  {
    id: "shellOnly",
    name: "Shell only",
    description: "Structure + envelope only (no full internal fit-out)",
  },
  {
    id: "standard",
    name: "Standard finish",
    description: "Typical good-quality finish for budgeting",
  },
  {
    id: "premium",
    name: "Premium finish",
    description: "Higher-spec finishes, detailing, and fixtures",
  },
];

export const SITE_ACCESS_OPTIONS = [
  {
    id: "easy",
    name: "Easy access",
    description: "Good side/rear access, easier logistics",
  },
  {
    id: "standard",
    name: "Standard access",
    description: "Typical terrace/semi access assumptions",
  },
  {
    id: "difficult",
    name: "Difficult access",
    description: "Restricted width, manual material handling likely",
  },
  {
    id: "veryDifficult",
    name: "Very difficult access",
    description: "Major restrictions / long carry / special logistics",
  },
];

export const GLAZING_LEVELS = [
  {
    id: "standard",
    name: "Standard glazing",
    description: "Typical doors/windows and daylight openings",
  },
  {
    id: "glazed",
    name: "More glazing",
    description: "Larger openings / more rooflights than average",
  },
  {
    id: "highGlazing",
    name: "High glazing design",
    description: "Large-format glazing / premium glazed design intent",
  },
];

export const DRAWINGS_STATUS_OPTIONS = [
  {
    id: "noPlansYet",
    name: "No plans yet",
    description: "Early budgeting only (widest estimate range)",
  },
  {
    id: "roughIdeas",
    name: "Rough sketch / idea",
    description: "Approximate sizes and layout in mind",
  },
  {
    id: "measuredPlans",
    name: "Measured plans",
    description: "Surveyed dimensions available",
  },
  {
    id: "architectPlans",
    name: "Architect plans",
    description: "Drawings prepared (best estimate confidence)",
  },
];

export const PLANNING_STATUS_OPTIONS = [
  {
    id: "unknown",
    name: "Not sure yet",
    description: "We will use a conservative planning allowance",
  },
  {
    id: "likelyPermittedDevelopment",
    name: "Likely permitted development",
    description: "Still allow for building control and structural design",
  },
  {
    id: "planningRequired",
    name: "Planning permission likely required",
    description: "Include planning support / fee allowances",
  },
  {
    id: "approved",
    name: "Planning already approved",
    description: "Reduces uncertainty and planning-stage costs",
  },
];

export const ADDITIONAL_FEATURE_OPTIONS = Object.entries(
  EXTENSION_CONFIG.additionalFeatures,
).map(([id, item]) => ({
  id,
  ...item,
}));

export const PLANNING_SERVICE_OPTIONS = Object.entries(
  EXTENSION_CONFIG.planningServices,
).map(([id, item]) => ({
  id,
  name:
    {
      measuredSurvey: "Measured survey",
      architectConcept: "Architect concept design",
      architectFullDesign: "Architect full design package",
      structuralEngineer: "Structural engineer",
      planningApplicationSupport: "Planning application support",
      planningApplicationFee: "Planning application fee",
      buildingControl: "Building control fees",
      partyWallSurveyor: "Party wall surveyor",
      ThamesWaterBuildOver: "Build-over agreement (if needed)",
    }[id] || id,
  description:
    {
      measuredSurvey: "Measured site/property survey",
      architectConcept: "Concept design and options",
      architectFullDesign: "Detailed design / drawings package",
      structuralEngineer: "Structural calculations and details",
      planningApplicationSupport: "Submission prep and coordination",
      planningApplicationFee: "Local authority fee allowance",
      buildingControl: "Plan check + inspections allowance",
      partyWallSurveyor: "If party wall notices/awards are required",
      ThamesWaterBuildOver: "If building near/over a sewer",
    }[id] || "",
  ...item,
}));
