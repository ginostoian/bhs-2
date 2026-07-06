// Renovation calculator price book.
//
// Every priced element is split into components:
//   labour    - trade labour
//   materials - construction materials (screed, plasterboard, timber, cement, cable, pipe...)
//   fittings  - supplied items / PC-sums (kitchen units, appliances, sanitaryware, tiles,
//               floor coverings, door leaves, ironmongery)
//
// "labour + materials" is the construction cost and is always included.
// "fittings" is only added when the client opts in (includeFittings). Default is OFF.
//
// Baseline rates below are quoted at contextMultiplier = 1.0, which corresponds to the
// national-average region (East of England). London and other regions are applied via
// regionMultipliers. All figures are ex-VAT.
//
// These defaults are market-anchored (public 2026 UK cost guides + judgement). They can be
// overridden per-field from the admin dashboard (/admin/renovation-calculator-rates) and are
// deep-merged over these values at runtime.

export const DEFAULT_RENOVATION_CONFIG = {
  version: "2026.07",
  priceBookDate: "2026-07",
  currency: "GBP",

  // ------------------------------------------------------------------ area
  coverageFactors: {
    singleArea: 0.2,
    partialHome: 0.45,
    mostRooms: 0.75,
    wholeHome: 1.0,
  },

  // General builder's work per m² of IMPACTED area: strip-out, waste, protection,
  // builder's work, general carpentry and making good NOT covered by rooms/finishing.
  baseScopeRates: {
    cosmetic: { labour: 30, materials: 18 },
    standard: { labour: 72, materials: 44 },
    fullRenovation: { labour: 115, materials: 72 },
    backToBrick: { labour: 165, materials: 108 },
  },

  // --------------------------------------------------------------- multipliers
  // Applied to construction cost (labour + materials) consistently across categories.
  regionMultipliers: {
    london: 1.18,
    southEast: 1.06,
    eastEngland: 1.0,
    southWest: 0.97,
    midlands: 0.9,
    northEngland: 0.84,
    scotlandWales: 0.9,
  },

  londonZoneMultipliers: {
    zone1: 1.14,
    zone2: 1.09,
    zone3: 1.05,
    zone4: 1.02,
    zone5: 1.0,
  },

  propertyMultipliers: {
    terraced: 1.0,
    semiDetached: 1.0,
    detached: 1.02,
    flat: 1.06,
    maisonette: 1.05,
  },

  houseStyleMultipliers: {
    newBuild: 0.96,
    modern: 1.0,
    victorian: 1.06,
    edwardian: 1.05,
    period: 1.09,
  },

  // Only applied to flats / maisonettes.
  floorMultipliers: {
    ground: 1.0,
    first: 1.02,
    second: 1.04,
    thirdPlus: 1.07,
  },

  // Applied to the FITTINGS layer only (product spec, not labour/location).
  finishLevelMultipliers: {
    budget: 0.82,
    standard: 1.0,
    premium: 1.38,
  },

  // ------------------------------------------------------------------ rooms
  // Per-room allowances by renovation level. labour + materials = construction cost.
  roomRates: {
    kitchen: {
      cosmetic: { labour: 1800, materials: 700, fittings: 4000 },
      standard: { labour: 3500, materials: 1600, fittings: 8500 },
      fullRenovation: { labour: 5200, materials: 2600, fittings: 13500 },
      backToBrick: { labour: 6800, materials: 3600, fittings: 18000 },
    },
    bathroom: {
      cosmetic: { labour: 1800, materials: 750, fittings: 2400 },
      standard: { labour: 3300, materials: 1500, fittings: 4600 },
      fullRenovation: { labour: 4600, materials: 2300, fittings: 7200 },
      backToBrick: { labour: 5600, materials: 2900, fittings: 9500 },
    },
    bedroom: {
      cosmetic: { labour: 550, materials: 300, fittings: 400 },
      standard: { labour: 1250, materials: 700, fittings: 1200 },
      fullRenovation: { labour: 2200, materials: 1300, fittings: 2500 },
      backToBrick: { labour: 3200, materials: 1800, fittings: 3600 },
    },
    reception: {
      cosmetic: { labour: 750, materials: 400, fittings: 600 },
      standard: { labour: 1650, materials: 900, fittings: 1800 },
      fullRenovation: { labour: 2900, materials: 1600, fittings: 3200 },
      backToBrick: { labour: 3900, materials: 2200, fittings: 4600 },
    },
    hallway: {
      cosmetic: { labour: 650, materials: 350, fittings: 300 },
      standard: { labour: 1450, materials: 750, fittings: 900 },
      fullRenovation: { labour: 2500, materials: 1300, fittings: 1800 },
      backToBrick: { labour: 3300, materials: 1800, fittings: 2500 },
    },
  },

  // -------------------------------------------------------------- structural
  // Construction cost only (steel, engineer's builder's work). No fittings.
  structuralWork: {
    nonStructuralWallRemoval: { labour: 900, materials: 550 },
    loadBearingWallRemoval: { labour: 3200, materials: 2600 },
    dampRepairAllowance: { labour: 2200, materials: 1700 },
  },

  // ------------------------------------------------------------------ systems
  // fixed + perM2 (of impacted area). Construction cost only.
  systems: {
    rewire: {
      none: { fixedLabour: 0, fixedMaterials: 0, perM2Labour: 0, perM2Materials: 0 },
      partial: { fixedLabour: 500, fixedMaterials: 300, perM2Labour: 26, perM2Materials: 16 },
      full: { fixedLabour: 750, fixedMaterials: 450, perM2Labour: 48, perM2Materials: 30 },
    },
    heating: {
      none: { fixedLabour: 0, fixedMaterials: 0, perM2Labour: 0, perM2Materials: 0 },
      controlsOnly: { fixedLabour: 350, fixedMaterials: 250, perM2Labour: 0, perM2Materials: 0 },
      boilerOnly: { fixedLabour: 1100, fixedMaterials: 1800, perM2Labour: 0, perM2Materials: 0 },
      fullSystem: { fixedLabour: 1300, fixedMaterials: 1950, perM2Labour: 45, perM2Materials: 48 },
    },
    plumbing: {
      none: { fixedLabour: 0, fixedMaterials: 0, perM2Labour: 0, perM2Materials: 0 },
      localised: { fixedLabour: 0, fixedMaterials: 0, perM2Labour: 17, perM2Materials: 12 },
      fullDistribution: { fixedLabour: 0, fixedMaterials: 0, perM2Labour: 32, perM2Materials: 24 },
    },
  },

  // ---------------------------------------------------------------- finishing
  finishing: {
    // rate = labour + materials per m² of (impacted area × areaFactor)
    plastering: {
      none: { areaFactor: 0, labour: 0, materials: 0 },
      patchRepairs: { areaFactor: 0.35, labour: 9, materials: 5 },
      selectedRooms: { areaFactor: 0.5, labour: 17, materials: 9 },
      fullAffectedArea: { areaFactor: 1, labour: 23, materials: 13 },
    },
    decoration: {
      none: { areaFactor: 0, labour: 0, materials: 0 },
      refresh: { areaFactor: 0.6, labour: 8, materials: 4 },
      fullAffectedArea: { areaFactor: 1, labour: 13, materials: 7 },
    },
    // coverage = fraction of impacted area that gets new flooring.
    flooringCoverage: {
      none: 0,
      selectedRooms: 0.5,
      fullAffectedArea: 1,
    },
    // per m²: labour + materials = prep + lay; covering = the finish material (a fitting).
    floorRates: {
      laminate: { labour: 16, materials: 4, covering: 15 },
      carpet: { labour: 9, materials: 3, covering: 18 },
      lvt: { labour: 24, materials: 5, covering: 30 },
      engineeredWood: { labour: 30, materials: 6, covering: 55 },
      tile: { labour: 45, materials: 12, covering: 30 },
      polishedConcrete: { labour: 70, materials: 18, covering: 45 },
    },
    // per package: labour = hang/adjust; fittings = door leaves + ironmongery.
    doorPackages: {
      none: { labour: 0, fittings: 0 },
      someDoors: { labour: 550, fittings: 1200 },
      mostDoors: { labour: 1300, fittings: 2800 },
      fullHouse: { labour: 2100, fittings: 4300 },
    },
  },

  // ------------------------------------------------------------ preliminaries
  // Site setup, management/supervision, scaffold, skips/waste, welfare, insurances,
  // temporary works. Charged as a % of the construction subtotal (excludes fittings & fees).
  preliminaries: {
    base: {
      cosmetic: 0.08,
      standard: 0.12,
      fullRenovation: 0.15,
      backToBrick: 0.17,
    },
    occupancyAdd: {
      vacant: 0,
      partiallyOccupied: 0.02,
      occupied: 0.04,
    },
  },

  // ---------------------------------------------------------- professional fees
  professionalFees: {
    measuredSurvey: 650,
    structuralEngineer: 1200,
    buildingControl: 950,
    partyWallAllowance: 1600,
    asbestosSurvey: 350,
  },

  // ---------------------------------------------------------------- contingency
  contingencyRates: {
    cosmetic: 0.07,
    standard: 0.1,
    fullRenovation: 0.125,
    backToBrick: 0.15,
  },

  // ----------------------------------------------------------- confidence/range
  confidenceModifiers: {
    noPlansYet: 1.12,
    roughScope: 1.07,
    roomByRoomPlan: 1.03,
    detailedSchedule: 1.0,
  },

  // ----------------------------------------------------------------------- VAT
  vatTreatments: {
    standard: 0.2,
    reduced: 0.05,
    zero: 0,
  },
  vatRate: 0.2,
};

// Kept as a named export for backwards compatibility with existing imports.
export const RENOVATION_CONFIG = DEFAULT_RENOVATION_CONFIG;

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
  { id: "eastEngland", name: "East of England", description: "National-average baseline pricing." },
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

export const FITTINGS_OPTIONS = [
  {
    id: "excluded",
    name: "Labour & construction materials only",
    description:
      "Prices the build (labour + construction materials). Excludes the cost of fixtures, fittings and finishes so you can add your own product budgets. This is the default.",
  },
  {
    id: "included",
    name: "Include a ballpark for fittings & finishes",
    description:
      "Adds a market-rate allowance for kitchen units, appliances, sanitaryware, tiles, floor coverings, doors and ironmongery, scaled by your chosen finish level.",
  },
];

export const VAT_TREATMENT_OPTIONS = [
  {
    id: "standard",
    name: "Standard rate (20%)",
    description: "The usual rate for most renovation work carried out by a VAT-registered builder.",
  },
  {
    id: "reduced",
    name: "Reduced rate (5%)",
    description:
      "May apply to homes empty for 2+ years or certain conversions. Check eligibility with your builder / HMRC.",
  },
  {
    id: "zero",
    name: "Zero-rated (0%)",
    description: "Rare for renovations (mainly new build / certain listed works). Use only if confirmed.",
  },
];

// Lightweight metadata used by the admin rate editor to render grouped numeric inputs.
export const RATE_EDITOR_GROUPS = [
  {
    id: "baseScopeRates",
    title: "General builder's work (£/m² of affected area)",
    kind: "levelComponents",
    components: ["labour", "materials"],
  },
  {
    id: "regionMultipliers",
    title: "Regional multipliers",
    kind: "flatMap",
  },
  {
    id: "londonZoneMultipliers",
    title: "London zone multipliers",
    kind: "flatMap",
  },
  {
    id: "finishLevelMultipliers",
    title: "Finish-level multipliers (fittings)",
    kind: "flatMap",
  },
  {
    id: "preliminaries.base",
    title: "Preliminaries base (% of construction)",
    kind: "flatMap",
  },
  {
    id: "contingencyRates",
    title: "Contingency by level",
    kind: "flatMap",
  },
  {
    id: "professionalFees",
    title: "Professional & statutory fees (£)",
    kind: "flatMap",
  },
  {
    id: "vatTreatments",
    title: "VAT treatments",
    kind: "flatMap",
  },
];
