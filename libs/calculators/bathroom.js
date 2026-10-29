import { CERTAINTY, buildRange, clamp, locationMultiplier, round } from "./common.js";

// Bathroom price book. Installation is ex VAT at an outer-London (zone 3) baseline and
// covers labour, strip-out, waste, plumbing, electrics, waterproofing, boarding, tiling
// labour and making good. Products (sanitaryware, brassware, tiles, vanity) are a separate
// allowance by tier. Calibrated October 2026 against published London ranges
// (refresh £5.5k–£8k, typical £8k–£16k, premium and wet rooms £15k–£25k+).
// Editable from /admin/bathroom-calculator-rates.
export const DEFAULT_BATHROOM_CONFIG = {
  version: "2026.11",
  priceBookDate: "2026-11",

  roomTypes: {
    cloakroom: { fixed: 1900, perM2: 380, defaultArea: 2.5, products: 850, days: [5, 8] },
    ensuite: { fixed: 2800, perM2: 420, defaultArea: 4, products: 2200, days: [8, 12] },
    family: { fixed: 3000, perM2: 450, defaultArea: 5.5, products: 2400, days: [10, 15] },
    wetroom: { fixed: 4200, perM2: 550, defaultArea: 5, products: 2800, days: [12, 18] },
  },

  layoutChanges: { keep: 0, minor: 900, major: 2600 },
  // Wall tiling labour and adhesive per m² of floor area (wall area ≈ 2.6× floor area).
  tilingPerFloorM2: { splashback: 0, half: 85, full: 170 },
  productTiers: { own: 0, essential: 1, midRange: 2, premium: 4 },

  extras: {
    concealedFixtures: { label: "Concealed cistern and valves", cost: 650 },
    underfloorHeating: { label: "Electric underfloor heating", cost: 950 },
    towelRail: { label: "Heated towel rail", cost: 350 },
    niche: { label: "Tiled shower niche", cost: 450 },
    newWindowOrFan: { label: "New extractor fan or window work", cost: 400 },
    bespokeVanity: { label: "Bespoke vanity or joinery", cost: 1800 },
  },

  londonZoneMultipliers: { zone1: 1.15, zone2: 1.07, zone3: 1.0, zone4: 0.97, zone5: 0.95 },
  regionMultipliers: {
    southEast: 0.9,
    eastEngland: 0.84,
    southWest: 0.84,
    midlands: 0.78,
    northEngland: 0.74,
    scotlandWales: 0.78,
  },

  contingencyRate: 0.08,
  vatRate: 0.2,
};

export const BATHROOM_TYPES = [
  { id: "cloakroom", label: "Cloakroom / WC", hint: "Toilet and basin, around 2–3 m²." },
  { id: "ensuite", label: "En-suite", hint: "Shower room off a bedroom, around 3–5 m²." },
  { id: "family", label: "Family bathroom", hint: "Bath, shower, toilet and basin, around 4–7 m²." },
  { id: "wetroom", label: "Wet room", hint: "Level-access, fully waterproofed shower area." },
];

export const LAYOUT_OPTIONS = [
  { id: "keep", label: "Keep the layout", hint: "Everything stays where it is." },
  { id: "minor", label: "Move one item", hint: "e.g. swap a bath for a shower, move the basin." },
  { id: "major", label: "New layout", hint: "Move the toilet or soil pipe, change the room around." },
];

export const TILING_OPTIONS = [
  { id: "splashback", label: "Floor, shower and splashback", hint: "Paint elsewhere." },
  { id: "half", label: "Half-height walls", hint: "A tiled band around the room." },
  { id: "full", label: "Floor to ceiling", hint: "Fully tiled walls." },
];

export const PRODUCT_TIERS = [
  { id: "own", label: "I'll supply them", hint: "Installation only." },
  { id: "essential", label: "Essential", hint: "Good-value ranges from builders' merchants." },
  { id: "midRange", label: "Mid-range", hint: "Brands like Roper Rhodes, Crosswater, Villeroy." },
  { id: "premium", label: "Premium", hint: "Designer brassware, stone and statement pieces." },
];

export function estimateBathroom(inputs, config = DEFAULT_BATHROOM_CONFIG) {
  const type = config.roomTypes[inputs.roomType] ? inputs.roomType : "family";
  const t = config.roomTypes[type];
  const area = clamp(inputs.area || t.defaultArea, 1.5, 20);
  const loc = locationMultiplier(config, inputs.region || "london", inputs.londonZone);

  const install = round((t.fixed + t.perM2 * area) * loc);
  const layout = round((config.layoutChanges[inputs.layout] ?? 0) * loc);
  const tiling = round((config.tilingPerFloorM2[inputs.tiling] ?? 0) * area * loc);
  const tier = config.productTiers[inputs.products] ?? 2;
  // Products scale gently with room size around the type's typical area.
  const products = round(t.products * tier * Math.sqrt(area / t.defaultArea));

  const extrasLines = Object.entries(config.extras)
    .filter(([id]) => inputs.extras?.[id])
    .map(([, e]) => ({ label: e.label, amount: round(e.cost * loc) }));
  const extras = extrasLines.reduce((s, l) => s + l.amount, 0);

  const subtotal = install + layout + tiling + products + extras;
  const contingency = round(subtotal * config.contingencyRate);
  const vatRate = inputs.vat === "zero" ? 0 : config.vatRate;
  const vat = round((subtotal + contingency) * vatRate);
  const total = subtotal + contingency + vat;
  const certainty = CERTAINTY[inputs.certainty] || CERTAINTY.roughIdea;
  const [d1, d2] = t.days;

  return {
    ...buildRange(total, { lowFactor: certainty.low, highFactor: certainty.high }),
    perM2: round(total / area),
    area,
    days: [d1 + (inputs.layout === "major" ? 2 : 0), d2 + (inputs.layout === "major" ? 3 : 0)],
    breakdown: [
      { label: "Strip-out, plumbing, electrics and waterproofing", amount: install },
      layout ? { label: "Layout changes", amount: layout } : null,
      tiling ? { label: "Extra wall tiling", amount: tiling } : null,
      products ? { label: "Sanitaryware, brassware and tiles", amount: products } : null,
      ...extrasLines,
      { label: `Contingency (${Math.round(config.contingencyRate * 100)}%)`, amount: contingency },
      vat ? { label: "VAT (20%)", amount: vat } : null,
    ].filter(Boolean),
    included: [
      "Strip-out and waste removal",
      "First and second-fix plumbing and electrics",
      "Tanking (waterproofing) in wet areas",
      "Tiling labour, plastering and making good",
      tier ? "Sanitaryware, brassware and tiles at your chosen level" : "Fitting your own sanitaryware and tiles",
    ],
    excluded: ["New boiler or hot-water cylinder", "Structural alterations", "Hidden rot or leaks found under the floor"],
    notes: [
      "Moving the toilet is the single biggest cost jump, because the soil pipe has to move with it.",
      "Products vary more than labour: the same room can cost twice as much with premium brassware and stone.",
    ],
  };
}
