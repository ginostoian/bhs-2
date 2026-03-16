export const KITCHEN_CONFIG = {
  version: "2026.03",

  regionMultipliers: {
    london: 1.1,
    southEast: 1.03,
    eastEngland: 1.0,
    southWest: 0.98,
    midlands: 0.94,
    northEngland: 0.9,
    scotlandWales: 0.95,
  },

  londonZoneMultipliers: {
    zone1: 1.12,
    zone2: 1.08,
    zone3: 1.05,
    zone4: 1.02,
    zone5: 1.0,
  },

  propertyMultipliers: {
    terraced: 1.0,
    semiDetached: 1.02,
    detached: 1.05,
    flat: 1.08,
    maisonette: 1.06,
  },

  occupancyMultipliers: {
    vacant: 0.97,
    partiallyOccupied: 1.05,
    occupied: 1.12,
  },

  layoutRunFactors: {
    singleWall: 0.35,
    galley: 0.55,
    lShape: 0.5,
    uShape: 0.65,
  },

  kitchenRunMin: {
    singleWall: 3.2,
    galley: 4.8,
    lShape: 4.5,
    uShape: 5.8,
  },

  cabinetrySupplyRatesPerLm: {
    flatPack: 380,
    tradeFitted: 620,
    premium: 980,
    bespoke: 1650,
  },

  appliancePackages: {
    reuseExisting: 0,
    essentials: 1800,
    standard: 3500,
    premium: 6500,
    luxury: 11000,
  },

  labourPackages: {
    fixed: 1800,
    perM2: 120,
  },

  includedWorks: {
    minorElectrics: 450,
    plumbingReconnects: 350,
    makingGoodDecoration: 550,
    tiledSplashbackAllowancePerM2: 110,
  },

  worktopRatesPerM2: {
    laminate: 120,
    solidWood: 220,
    quartz: 320,
    granite: 380,
    porcelain: 450,
  },

  splashbackUpgradeRatesPerM2: {
    painted: 0,
    tiles: 0,
    glass: 180,
    quartzUpstand: 90,
    fullHeightStone: 320,
  },

  flooringRatesPerM2: {
    keepExisting: 0,
    lvt: 55,
    tile: 70,
    engineeredWood: 85,
  },

  electricalUpgradePackages: {
    lightRefresh: 0,
    partialUpgrade: 700,
    fullKitchenRewire: 2100,
  },

  plumbingUpgradePackages: {
    retainLayout: 0,
    moveSinkOrAppliances: 1100,
    majorRelocation: 2400,
  },

  boilerPackages: {
    none: 0,
    boxInOrAdjust: 450,
    relocate: 1800,
  },

  decorationUpgradePackages: {
    none: 0,
    makingGood: 0,
    fullRedecoration: 1000,
  },

  structuralPackages: {
    none: 0,
    nonStructural: 1800,
    loadBearing: 6500,
  },

  structuralFees: {
    structuralEngineer: 1200,
    buildingControl: 900,
    partyWallAllowance: 1500,
  },

  contingencyRates: {
    flatPack: 0.08,
    tradeFitted: 0.1,
    premium: 0.11,
    bespoke: 0.13,
  },

  confidenceModifiers: {
    noPlansYet: 1.12,
    roughPlan: 1.07,
    roomMeasured: 1.03,
    detailedSchedule: 1.0,
  },

  vatRate: 0.2,
};

export const PROPERTY_TYPES = [
  {
    id: "terraced",
    name: "Terraced house",
    description: "Shared walls and often tighter access.",
  },
  {
    id: "semiDetached",
    name: "Semi-detached house",
    description: "Moderate access and some party-wall considerations.",
  },
  {
    id: "detached",
    name: "Detached house",
    description: "Usually simpler logistics and fewer shared-wall issues.",
  },
  {
    id: "flat",
    name: "Flat / apartment",
    description: "Access, waste removal and services can be more constrained.",
  },
  {
    id: "maisonette",
    name: "Maisonette",
    description: "Split-level access and stair logistics often matter.",
  },
];

export const REGION_OPTIONS = [
  { id: "london", name: "London", description: "Primary service area and highest-cost benchmark." },
  { id: "southEast", name: "South East", description: "Typically close to London rates." },
  { id: "eastEngland", name: "East of England", description: "Often slightly below London / South East." },
  { id: "southWest", name: "South West", description: "Moderate regional rates." },
  { id: "midlands", name: "Midlands", description: "Often below South East pricing." },
  { id: "northEngland", name: "North of England", description: "Usually lower labour and fit-out rates." },
  { id: "scotlandWales", name: "Scotland / Wales", description: "Regional benchmark only." },
];

export const LONDON_ZONES = [
  { id: "zone1", name: "Zone 1", description: "Central London" },
  { id: "zone2", name: "Zone 2", description: "Inner London" },
  { id: "zone3", name: "Zone 3", description: "Outer London" },
  { id: "zone4", name: "Zone 4", description: "Greater London" },
  { id: "zone5", name: "Zone 5+", description: "Outer Greater London" },
];

export const OCCUPANCY_OPTIONS = [
  { id: "vacant", name: "Property vacant", description: "Best-case access and sequencing." },
  { id: "partiallyOccupied", name: "Living in part of the home", description: "Some phasing and protection needed." },
  { id: "occupied", name: "Living in throughout", description: "More protection, slower sequencing and disruption." },
];

export const DRAWINGS_STATUS_OPTIONS = [
  { id: "noPlansYet", name: "No plans yet", description: "Still working out the basic budget." },
  { id: "roughPlan", name: "Rough plan", description: "You know the layout and broad wish list." },
  { id: "roomMeasured", name: "Room measured", description: "You have clearer dimensions and product ideas." },
  { id: "detailedSchedule", name: "Detailed schedule", description: "The scope is already well defined." },
];

export const LAYOUT_OPTIONS = [
  { id: "singleWall", name: "Single wall", description: "All units on one run." },
  { id: "galley", name: "Galley", description: "Two parallel runs." },
  { id: "lShape", name: "L-shape", description: "Corner kitchen with two connected runs." },
  { id: "uShape", name: "U-shape", description: "Three-sided kitchen layout." },
];

export const KITCHEN_RANGE_OPTIONS = [
  { id: "flatPack", name: "Flat-pack / value", description: "Lower-cost units and straightforward installed finish." },
  { id: "tradeFitted", name: "Trade-fitted mid-range", description: "Typical installed kitchen budget in London." },
  { id: "premium", name: "Premium", description: "Higher-end doors, internals and finish quality." },
  { id: "bespoke", name: "Bespoke", description: "Custom joinery and higher-complexity detailing." },
];

export const APPLIANCE_OPTIONS = [
  { id: "reuseExisting", name: "Reuse existing appliances", description: "No new appliance allowance." },
  { id: "essentials", name: "Essentials package", description: "Basic oven, hob, extractor and fridge/freezer allowance." },
  { id: "standard", name: "Standard package", description: "Typical integrated appliance package." },
  { id: "premium", name: "Premium package", description: "Higher-end branded integrated appliances." },
  { id: "luxury", name: "Luxury package", description: "Statement appliance spend and specialist items." },
];

export const WORKTOP_OPTIONS = [
  { id: "laminate", name: "Laminate", description: "Budget-friendly installed worktop." },
  { id: "solidWood", name: "Solid wood", description: "Natural timber requiring more maintenance." },
  { id: "quartz", name: "Quartz", description: "Common premium choice in London kitchens." },
  { id: "granite", name: "Granite", description: "Natural stone with heavier install cost." },
  { id: "porcelain", name: "Porcelain / sintered stone", description: "High-spec worktop material." },
];

export const SPLASHBACK_OPTIONS = [
  { id: "painted", name: "Painted only", description: "Paint finish with minimal splashback allowance." },
  { id: "tiles", name: "Tiled splashback", description: "Standard tiled installation." },
  { id: "glass", name: "Glass splashback", description: "Made-to-measure glass panels." },
  { id: "quartzUpstand", name: "Quartz upstand", description: "Short upstand matching the worktop." },
  { id: "fullHeightStone", name: "Full-height stone", description: "Premium slab splashback allowance." },
];

export const FLOORING_OPTIONS = [
  { id: "keepExisting", name: "Keep existing floor", description: "No new flooring package." },
  { id: "lvt", name: "LVT / vinyl", description: "Popular mid-range kitchen flooring." },
  { id: "tile", name: "Porcelain / ceramic tile", description: "Higher labour and prep allowance." },
  { id: "engineeredWood", name: "Engineered wood", description: "Premium timber floor allowance." },
];

export const ELECTRICAL_OPTIONS = [
  { id: "lightRefresh", name: "Light electrical refresh", description: "Minor socket / lighting changes only." },
  { id: "partialUpgrade", name: "Partial upgrade", description: "More substantial kitchen circuit and lighting work." },
  { id: "fullKitchenRewire", name: "Full kitchen rewire", description: "Major electrical overhaul within the kitchen zone." },
];

export const PLUMBING_OPTIONS = [
  { id: "retainLayout", name: "Keep main layout", description: "Only straightforward reconnects." },
  { id: "moveSinkOrAppliances", name: "Move sink / appliances", description: "Moderate plumbing changes." },
  { id: "majorRelocation", name: "Major relocation", description: "Broader waste / water alterations." },
];

export const BOILER_OPTIONS = [
  { id: "none", name: "No boiler work", description: "Boiler remains untouched." },
  { id: "boxInOrAdjust", name: "Box in / adjust", description: "Minor boxing and adjustment allowance." },
  { id: "relocate", name: "Relocate boiler", description: "Move the boiler to another position." },
];

export const DECORATION_OPTIONS = [
  { id: "none", name: "Not included", description: "Only the kitchen installation scope is included." },
  { id: "makingGood", name: "Making good only", description: "Local repair and patching allowance." },
  { id: "fullRedecoration", name: "Full redecoration", description: "Paint and finish the whole kitchen area." },
];

export const STRUCTURAL_OPTIONS = [
  { id: "none", name: "No wall opening", description: "Existing room envelope remains." },
  { id: "nonStructural", name: "Non-structural opening", description: "Minor internal opening / removal works." },
  { id: "loadBearing", name: "Load-bearing opening", description: "Steel / engineering / approvals likely required." },
];
