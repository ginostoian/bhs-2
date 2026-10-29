import { CERTAINTY, buildRange, clamp, locationMultiplier, round } from "./common.js";

// Loft conversion price book. Build costs are ex VAT at an outer-London (zone 3)
// baseline: a fixed element (stairs, scaffold, steels, roof opening-up) plus a rate per m²
// of new floor area. Calibrated in October 2026 against published London ranges
// (Velux £25k–£45k, rear dormer £45k–£75k, hip-to-gable £55k–£80k, mansard £60k–£100k+,
// build inc VAT). Every number here can be overridden from /admin/loft-calculator-rates.
export const DEFAULT_LOFT_CONFIG = {
  version: "2026.11",
  priceBookDate: "2026-11",

  loftTypes: {
    velux: { fixed: 9000, perM2: 850, defaultArea: 22, weeks: [6, 8] },
    rearDormer: { fixed: 16000, perM2: 1350, defaultArea: 25, weeks: [8, 10] },
    lShapedDormer: { fixed: 19000, perM2: 1300, defaultArea: 32, weeks: [10, 12] },
    hipToGable: { fixed: 21000, perM2: 1250, defaultArea: 30, weeks: [9, 11] },
    mansard: { fixed: 26000, perM2: 1550, defaultArea: 32, weeks: [12, 16] },
  },

  londonZoneMultipliers: { zone1: 1.15, zone2: 1.07, zone3: 1.0, zone4: 0.97, zone5: 0.95 },
  regionMultipliers: {
    southEast: 0.9,
    eastEngland: 0.85,
    southWest: 0.84,
    midlands: 0.78,
    northEngland: 0.74,
    scotlandWales: 0.78,
  },
  propertyMultipliers: { terraced: 1.03, semiDetached: 1.0, detached: 1.02, bungalow: 1.06 },
  finishMultipliers: { essential: 0.92, standard: 1.0, premium: 1.16 },

  extras: {
    ensuite: { label: "En-suite shower room", cost: 9500 },
    extraRooflights: { label: "Extra rooflights", cost: 950, perItem: true },
    julietBalcony: { label: "Juliet balcony or French doors", cost: 3800 },
    premiumCladding: { label: "Zinc or tile-hung dormer cladding", cost: 4500 },
    eavesStorage: { label: "Built-in eaves storage", cost: 2800 },
    soundproofing: { label: "Upgraded soundproofing", cost: 1800 },
  },

  fees: {
    measuredSurvey: 650,
    architect: 3800,
    structuralEngineer: 1300,
    buildingControl: 1300,
    planningApplication: 548,
    lawfulDevelopmentCertificate: 300,
    partyWallPerNeighbour: 1500,
  },

  contingencyRate: 0.1,
  vatRate: 0.2,
};

export const LOFT_TYPES = [
  { id: "velux", label: "Velux (rooflight)", hint: "No change to the roof shape. Lowest cost if you have the head height." },
  { id: "rearDormer", label: "Rear dormer", hint: "A box dormer at the back. The most popular London loft." },
  { id: "lShapedDormer", label: "L-shaped dormer", hint: "Dormers over the main roof and the back addition. Typical for Victorian terraces." },
  { id: "hipToGable", label: "Hip-to-gable", hint: "Straightens a sloping side roof, usually with a rear dormer. Semis and end terraces." },
  { id: "mansard", label: "Mansard", hint: "Rebuilds the roof with near-vertical sides. Most space; usually needs planning." },
];

export const LOFT_PROPERTY_TYPES = [
  { id: "terraced", label: "Terraced house" },
  { id: "semiDetached", label: "Semi-detached" },
  { id: "detached", label: "Detached" },
  { id: "bungalow", label: "Bungalow" },
];

export const LOFT_FINISHES = [
  { id: "essential", label: "Essential", hint: "Good-quality standard materials, simple finishes." },
  { id: "standard", label: "Standard", hint: "What most London homeowners choose." },
  { id: "premium", label: "Premium", hint: "Bespoke joinery, high-end glazing and finishes." },
];

const PLANNING_LIKELY = new Set(["mansard"]);

export function estimateLoft(inputs, config = DEFAULT_LOFT_CONFIG) {
  const type = config.loftTypes[inputs.loftType] ? inputs.loftType : "rearDormer";
  const t = config.loftTypes[type];
  const area = clamp(inputs.area || t.defaultArea, 8, 80);
  const loc = locationMultiplier(config, inputs.region || "london", inputs.londonZone);
  const prop = config.propertyMultipliers[inputs.propertyType] ?? 1;
  const finish = config.finishMultipliers[inputs.finish] ?? 1;
  const multiplier = loc * prop * finish;

  const buildFixed = round(t.fixed * multiplier);
  const buildArea = round(t.perM2 * area * multiplier);
  const build = buildFixed + buildArea;

  const extrasLines = Object.entries(config.extras)
    .filter(([id]) => inputs.extras?.[id])
    .map(([id, e]) => {
      const qty = e.perItem ? clamp(inputs.extras[id], 1, 8) : 1;
      return { label: e.perItem ? `${e.label} (${qty})` : e.label, amount: round(e.cost * qty * loc) };
    });
  const extras = extrasLines.reduce((s, l) => s + l.amount, 0);

  const f = config.fees;
  const needsPlanning = inputs.planning === "yes" || (inputs.planning !== "no" && PLANNING_LIKELY.has(type));
  const neighbours = clamp(inputs.partyWallNeighbours ?? 1, 0, 2);
  const feeLines = [
    inputs.haveDrawings ? null : { label: "Measured survey and architectural drawings", amount: f.measuredSurvey + f.architect },
    { label: "Structural engineer", amount: f.structuralEngineer },
    { label: "Building control", amount: f.buildingControl },
    needsPlanning
      ? { label: "Planning application fee", amount: f.planningApplication }
      : { label: "Lawful development certificate", amount: f.lawfulDevelopmentCertificate },
    neighbours ? { label: `Party wall surveyor (${neighbours} neighbour${neighbours > 1 ? "s" : ""})`, amount: f.partyWallPerNeighbour * neighbours } : null,
  ].filter(Boolean);
  const fees = feeLines.reduce((s, l) => s + l.amount, 0);

  const contingency = round((build + extras) * config.contingencyRate);
  const vatRate = inputs.vat === "zero" ? 0 : config.vatRate;
  const vat = round((build + extras + fees + contingency) * vatRate);
  const total = build + extras + fees + contingency + vat;
  const certainty = CERTAINTY[inputs.certainty] || CERTAINTY.roughIdea;

  return {
    ...buildRange(total, { lowFactor: certainty.low, highFactor: certainty.high }),
    perM2: round(total / area),
    area,
    weeks: t.weeks,
    breakdown: [
      { label: "Structure, roof and shell", amount: buildFixed + round(buildArea * 0.55) },
      { label: "Insulation, plastering, electrics and finishes", amount: round(buildArea * 0.45) },
      ...extrasLines,
      ...feeLines,
      { label: `Contingency (${Math.round(config.contingencyRate * 100)}%)`, amount: contingency },
      vat ? { label: "VAT (20%)", amount: vat } : null,
    ].filter(Boolean),
    included: [
      "New staircase to the loft",
      "Steel beams, new floor joists and roof structure",
      "Insulation to current building regulations",
      "Windows or rooflights, plastering and first-fix electrics",
      "Doors, skirting and decoration ready for furniture",
    ],
    excluded: [
      "Furniture and loose flooring beyond a standard allowance",
      "Moving a boiler or water tank where unusual",
      "Asbestos removal if found",
    ],
    notes: [
      needsPlanning
        ? "Mansards and some conservation-area lofts need full planning permission. Allow 8–13 weeks for a decision."
        : "Most dormer, hip-to-gable and Velux lofts on houses are permitted development. We include a lawful development certificate for peace of mind.",
      "Head height matters: you need roughly 2.2 m from the top of the ceiling joists to the ridge for a comfortable conversion.",
    ],
  };
}
