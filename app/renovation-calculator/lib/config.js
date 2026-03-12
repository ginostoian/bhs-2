export const RENOVATION_CONFIG = {
  version: "2026.03",

  baseScopeRates: {
    cosmetic: 140,
    standard: 300,
    fullRenovation: 520,
    backToBrick: 780,
  },

  coverageFactors: {
    singleArea: 0.2,
    partialHome: 0.45,
    mostRooms: 0.75,
    wholeHome: 1.0,
  },

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

  houseStyleMultipliers: {
    newBuild: 0.95,
    modern: 1.0,
    victorian: 1.08,
    edwardian: 1.06,
    period: 1.1,
  },

  floorMultipliers: {
    ground: 1.0,
    first: 1.02,
    second: 1.04,
    thirdPlus: 1.08,
  },

  finishLevelMultipliers: {
    budget: 0.92,
    standard: 1.0,
    premium: 1.15,
  },

  occupancyMultipliers: {
    vacant: 0.97,
    partiallyOccupied: 1.05,
    occupied: 1.12,
  },

  roomRates: {
    kitchen: {
      cosmetic: 9000,
      standard: 18000,
      fullRenovation: 28000,
      backToBrick: 36000,
    },
    bathroom: {
      cosmetic: 7500,
      standard: 12500,
      fullRenovation: 18500,
      backToBrick: 23000,
    },
    bedroom: {
      cosmetic: 1200,
      standard: 3500,
      fullRenovation: 6500,
      backToBrick: 9000,
    },
    reception: {
      cosmetic: 2000,
      standard: 5000,
      fullRenovation: 8500,
      backToBrick: 12000,
    },
    hallway: {
      cosmetic: 1500,
      standard: 3500,
      fullRenovation: 6500,
      backToBrick: 9000,
    },
  },

  structuralWork: {
    nonStructuralWallRemoval: 1800,
    loadBearingWallRemoval: 6500,
    dampRepairAllowance: 4500,
  },

  systems: {
    rewire: {
      none: { fixed: 0, perM2: 0 },
      partial: { fixed: 900, perM2: 35 },
      full: { fixed: 1250, perM2: 70 },
    },
    heating: {
      none: { fixed: 0, perM2: 0 },
      controlsOnly: { fixed: 600, perM2: 0 },
      boilerOnly: { fixed: 3800, perM2: 0 },
      fullSystem: { fixed: 3800, perM2: 85 },
    },
    plumbing: {
      none: { fixed: 0, perM2: 0 },
      localised: { fixed: 0, perM2: 25 },
      fullDistribution: { fixed: 0, perM2: 55 },
    },
  },

  finishing: {
    plastering: {
      none: { areaFactor: 0, rate: 0 },
      patchRepairs: { areaFactor: 0.35, rate: 12 },
      selectedRooms: { areaFactor: 0.5, rate: 25 },
      fullAffectedArea: { areaFactor: 1, rate: 35 },
    },
    decoration: {
      none: { areaFactor: 0, rate: 0 },
      refresh: { areaFactor: 0.6, rate: 10 },
      fullAffectedArea: { areaFactor: 1, rate: 18 },
    },
    flooringCoverage: {
      none: 0,
      selectedRooms: 0.5,
      fullAffectedArea: 1,
    },
    floorRates: {
      laminate: 35,
      carpet: 28,
      lvt: 55,
      engineeredWood: 85,
      tile: 70,
      polishedConcrete: 110,
    },
    doorPackages: {
      none: 0,
      someDoors: 1800,
      mostDoors: 4200,
      fullHouse: 6500,
    },
  },

  professionalFees: {
    measuredSurvey: 650,
    structuralEngineer: 1200,
    buildingControl: 900,
    partyWallAllowance: 1500,
  },

  contingencyRates: {
    cosmetic: 0.08,
    standard: 0.1,
    fullRenovation: 0.12,
    backToBrick: 0.15,
  },

  confidenceModifiers: {
    noPlansYet: 1.12,
    roughScope: 1.07,
    roomByRoomPlan: 1.03,
    detailedSchedule: 1.0,
  },

  vatRate: 0.2,
};

export const PROPERTY_TYPES = [
  {
    id: "terraced",
    name: "Terraced house",
    description: "Party-wall property with typical London access constraints.",
  },
  {
    id: "semiDetached",
    name: "Semi-detached house",
    description: "Attached on one side with moderate access and party-wall risk.",
  },
  {
    id: "detached",
    name: "Detached house",
    description: "Standalone property with fewer shared-wall constraints.",
  },
  {
    id: "flat",
    name: "Flat / apartment",
    description: "Internal refurbishment often has access and logistics constraints.",
  },
  {
    id: "maisonette",
    name: "Maisonette",
    description: "Split-level flat with stair and access considerations.",
  },
];

export const REGION_OPTIONS = [
  { id: "london", name: "London", description: "Primary service area and highest-cost benchmark." },
  { id: "southEast", name: "South East", description: "Typically close to London rates." },
  { id: "eastEngland", name: "East of England", description: "Often slightly below South East pricing." },
  { id: "southWest", name: "South West", description: "Moderate regional build costs." },
  { id: "midlands", name: "Midlands", description: "Usually below South East and London costs." },
  { id: "northEngland", name: "North of England", description: "Often lower labour and fit-out rates." },
  { id: "scotlandWales", name: "Scotland / Wales", description: "Regional ballpark only." },
];

export const LONDON_ZONES = [
  { id: "zone1", name: "Zone 1", description: "Central London" },
  { id: "zone2", name: "Zone 2", description: "Inner London" },
  { id: "zone3", name: "Zone 3", description: "Outer London" },
  { id: "zone4", name: "Zone 4", description: "Greater London" },
  { id: "zone5", name: "Zone 5+", description: "Outer Greater London" },
];

export const HOUSE_STYLE_OPTIONS = [
  { id: "newBuild", name: "New build", description: "Newer services and fewer hidden-condition risks." },
  { id: "modern", name: "Modern", description: "Typically post-war / standard construction." },
  { id: "victorian", name: "Victorian", description: "Often needs more allowance for levelling, services, and repairs." },
  { id: "edwardian", name: "Edwardian", description: "Period home with similar complexity to Victorian stock." },
  { id: "period", name: "Older / character property", description: "Use this when the property is older and likely to hide surprises." },
];

export const FLOOR_OPTIONS = [
  { id: "ground", name: "Ground floor" },
  { id: "first", name: "First floor" },
  { id: "second", name: "Second floor" },
  { id: "thirdPlus", name: "Third floor or above" },
];

export const COVERAGE_OPTIONS = [
  { id: "singleArea", name: "Single area", description: "One part of the home is being heavily upgraded." },
  { id: "partialHome", name: "Roughly half the home", description: "Several rooms and some linked finishes." },
  { id: "mostRooms", name: "Most rooms", description: "A substantial multi-room refurbishment." },
  { id: "wholeHome", name: "Whole home", description: "Nearly everything is being touched." },
];

export const RENOVATION_LEVEL_OPTIONS = [
  { id: "cosmetic", name: "Cosmetic refresh", description: "Decorating, floors, light upgrades, minimal service moves." },
  { id: "standard", name: "Mid-range refurbishment", description: "Typical London renovation with selected replacements and finishes." },
  { id: "fullRenovation", name: "Full renovation", description: "Major multi-room works with broad service and finish upgrades." },
  { id: "backToBrick", name: "Back-to-brick", description: "Strip-back refurbishment with high uncertainty and wider scope." },
];

export const FINISH_LEVEL_OPTIONS = [
  { id: "budget", name: "Budget-conscious", description: "Practical finishes and lower-cost product selections." },
  { id: "standard", name: "Standard", description: "Typical mid-market products and workmanship allowances." },
  { id: "premium", name: "Premium", description: "Higher-end joinery, finishes, ironmongery, and fittings." },
];

export const OCCUPANCY_OPTIONS = [
  { id: "vacant", name: "Property vacant", description: "Best-case access and sequencing." },
  { id: "partiallyOccupied", name: "Living in part of it", description: "Some working-around and phasing costs." },
  { id: "occupied", name: "Living in throughout", description: "More protection, phasing, and slower progress." },
];

export const DRAWINGS_STATUS_OPTIONS = [
  { id: "noPlansYet", name: "No plans yet", description: "Just exploring budget." },
  { id: "roughScope", name: "Rough room list", description: "You know what rooms are involved, not every detail." },
  { id: "roomByRoomPlan", name: "Room-by-room plan", description: "You have a clearer schedule of intended works." },
  { id: "detailedSchedule", name: "Detailed schedule / quotes", description: "You already have strong scope clarity." },
];

export const STRUCTURAL_OPTIONS = [
  { id: "none", name: "No wall removal", description: "Layout broadly stays as it is." },
  { id: "nonStructural", name: "Non-structural walls only", description: "Opening up lightweight or non-loadbearing walls." },
  { id: "loadBearing", name: "Load-bearing walls", description: "Requires engineering, steelwork, and approvals." },
];

export const REWIRE_OPTIONS = [
  { id: "none", name: "No major rewire", description: "Leave the electrical system broadly as-is." },
  { id: "partial", name: "Partial rewire", description: "Upgrade affected rooms/circuits only." },
  { id: "full", name: "Full rewire", description: "Whole-home electrical overhaul." },
];

export const HEATING_OPTIONS = [
  { id: "none", name: "No heating upgrade", description: "Retain the current heating system." },
  { id: "controlsOnly", name: "Controls / smart thermostat", description: "Minor controls upgrade only." },
  { id: "boilerOnly", name: "Boiler replacement", description: "Replace the boiler but not the full distribution." },
  { id: "fullSystem", name: "Full system upgrade", description: "Boiler plus broad pipework/radiator/heating changes." },
];

export const PLUMBING_OPTIONS = [
  { id: "none", name: "Minimal plumbing changes", description: "No broad plumbing redistribution." },
  { id: "localised", name: "Localised plumbing changes", description: "Bathroom/kitchen pipework changes in affected zones." },
  { id: "fullDistribution", name: "Wide plumbing upgrade", description: "Broader hot/cold/waste reworking across the home." },
];

export const PLASTERING_OPTIONS = [
  { id: "none", name: "Minimal plastering", description: "Only local making-good." },
  { id: "patchRepairs", name: "Patch repairs", description: "Skim patches and local repairs where needed." },
  { id: "selectedRooms", name: "Selected rooms", description: "Replaster / skim a meaningful number of rooms." },
  { id: "fullAffectedArea", name: "All affected areas", description: "Plastering across the full impacted scope." },
];

export const DECORATION_OPTIONS = [
  { id: "none", name: "Not included", description: "Decoration to be handled separately." },
  { id: "refresh", name: "Some decorating", description: "A lighter decoration allowance." },
  { id: "fullAffectedArea", name: "Full decorating", description: "Decorator-ready finishing across the affected scope." },
];

export const FLOORING_COVERAGE_OPTIONS = [
  { id: "none", name: "Keep existing floors", description: "No broad flooring replacement." },
  { id: "selectedRooms", name: "Selected rooms only", description: "Replace flooring in some rooms." },
  { id: "fullAffectedArea", name: "Throughout affected area", description: "Flooring across the impacted renovation area." },
];

export const FLOOR_FINISH_OPTIONS = [
  { id: "laminate", name: "Laminate", description: "Lower-cost installed finish." },
  { id: "carpet", name: "Carpet", description: "Soft-floor installed allowance." },
  { id: "lvt", name: "LVT / vinyl", description: "Mid-range resilient flooring." },
  { id: "engineeredWood", name: "Engineered wood", description: "Premium timber floor allowance." },
  { id: "tile", name: "Porcelain / ceramic tile", description: "Hard floor with more labour and prep." },
  { id: "polishedConcrete", name: "Polished concrete", description: "High-spec specialist finish." },
];

export const DOOR_PACKAGE_OPTIONS = [
  { id: "none", name: "Keep most doors", description: "No broad door replacement allowance." },
  { id: "someDoors", name: "Some doors", description: "Selected internal door replacements." },
  { id: "mostDoors", name: "Most doors", description: "Large proportion of internal doors." },
  { id: "fullHouse", name: "Whole-house doors", description: "Broad door and ironmongery replacement." },
];
