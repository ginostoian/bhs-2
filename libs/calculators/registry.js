// Every public calculator is described here: its questions, defaults and how answers map
// to its pricing engine. The same spec drives the browser UI, share links, the embed
// widget, server-side lead emails/PDFs and the admin price editor.
import { CERTAINTY, REGIONS, VAT_OPTIONS, clamp, niceRound, round } from "./common.js";
import { DEFAULT_LOFT_CONFIG, LOFT_FINISHES, LOFT_PROPERTY_TYPES, LOFT_TYPES, estimateLoft } from "./loft.js";
import {
  BATHROOM_TYPES,
  DEFAULT_BATHROOM_CONFIG,
  LAYOUT_OPTIONS,
  PRODUCT_TIERS,
  TILING_OPTIONS,
  estimateBathroom,
} from "./bathroom.js";
import { BTU_HEAT_SOURCES, BTU_INSULATION, BTU_ROOM_TYPES, estimateBtu } from "./btu.js";
import { DEFAULT_EXTENSION_CONFIG } from "../../app/extension-calculator/lib/config.js";
import { createCostEngine as createExtensionEngine } from "../../app/extension-calculator/lib/costEngine.js";
import { DEFAULT_RENOVATION_CONFIG } from "../../app/renovation-calculator/lib/config.js";
import { createCostEngine as createRenovationEngine } from "../../app/renovation-calculator/lib/costEngine.js";
import { KITCHEN_CONFIG } from "../../app/kitchen-calculator/lib/config.js";
import { createCostEngine as createKitchenEngine } from "../../app/kitchen-calculator/lib/costEngine.js";

const CERTAINTY_OPTIONS = Object.entries(CERTAINTY).map(([id, c]) => ({ id, label: c.label }));
const certaintyField = {
  id: "certainty",
  type: "chips",
  label: "How far along are you?",
  help: "Less defined projects get a wider range.",
  options: CERTAINTY_OPTIONS,
};
const vatField = { id: "vat", type: "chips", label: "VAT", options: VAT_OPTIONS };
const locationField = { id: "location", type: "location", label: "Where is the property?" };
const weeks = (a, b) => (a === b ? `${a} weeks` : `${a}–${b} weeks`);
const plus = (n) => `+£${Math.round(n).toLocaleString("en-GB")}`;

// Maps an engine's generic line items to our breakdown rows.
const rows = (items) => items.filter((r) => r && r.amount > 0).map((r) => ({ label: r.label, amount: round(r.amount) }));

const PROPERTY = [
  { id: "terraced", label: "Terraced" },
  { id: "semiDetached", label: "Semi-detached" },
  { id: "detached", label: "Detached" },
  { id: "flat", label: "Flat" },
];

/* ---------------------------------------------------------------- extension */

const EXT_TYPES = [
  { id: "rearExtension", label: "Rear extension", hint: "Out into the garden, usually a kitchen-living room.", icon: "rear" },
  { id: "sideReturn", label: "Side return", hint: "Fills the side passage of a Victorian terrace.", icon: "side" },
  { id: "wraparound", label: "Wraparound", hint: "Rear and side return together, in an L-shape.", icon: "wrap" },
  { id: "doubleStorey", label: "Double storey", hint: "Two floors: kitchen below, bedroom above.", icon: "double" },
  { id: "basement", label: "Basement", hint: "Dig down for a new lower floor.", icon: "basement" },
];
const EXT_FINISH = [
  { id: "shell", label: "Shell only", hint: "Weathertight and ready for your own trades." },
  { id: "standard", label: "Ready to live in", hint: "Floors, decoration, lighting and plastering done." },
  { id: "premium", label: "Premium", hint: "High-spec glazing, finishes and detailing." },
];
const EXT_GLAZING = [
  { id: "standard", label: "Standard windows and doors" },
  { id: "glazed", label: "Large glazed doors" },
  { id: "highGlazing", label: "Glass walls and roof" },
];
const EXT_EXTRAS = ["biFoldDoors", "roofLights", "underfloorHeating", "kitchenFitout", "bathroomFitout", "steelBeam", "foundationUpgrade", "bespokeJoinery", "landscapingMakingGood"];
const EXT_ACCESS = [
  { id: "easy", label: "Easy", hint: "Side access or driveway." },
  { id: "standard", label: "Through the house", hint: "Typical terrace." },
  { id: "difficult", label: "Difficult", hint: "No parking, stairs, tight access." },
];
const EXT_DRAWINGS = { justExploring: "noPlansYet", roughIdea: "roughIdeas", drawings: "measuredPlans", quoting: "architectPlans" };

function estimateExtension(a, config) {
  const engine = createExtensionEngine(config);
  const finish = a.finish === "shell" ? "shellOnly" : a.finish === "premium" ? "premium" : "standard";
  const features = Object.entries(a.extras || {})
    .filter(([, v]) => v)
    .map(([id, v]) => ({ id, quantity: typeof v === "number" ? v : undefined }));
  const r = engine.calculateTotalCost({
    extensionType: a.type,
    size: a.area,
    propertyType: a.property === "flat" ? "flat" : a.property,
    region: a.region,
    londonZone: a.londonZone,
    finishLevel: finish,
    includeFittings: finish !== "shellOnly",
    glazingLevel: a.glazing,
    siteAccess: a.access,
    complexity: a.type === "basement" ? "complex" : "moderate",
    drawingsStatus: EXT_DRAWINGS[a.certainty] || "roughIdeas",
    vatTreatment: a.vat === "zero" ? "zero" : "standard",
    additionalFeatures: features,
  });
  const b = r.breakdown;
  const featureName = (id) => config.additionalFeatures[id]?.name || id;
  const fees = b.planningLineItems.map((p) => ({
    label: { measuredSurvey: "Measured survey", architectConcept: "Architect design", architectFullDesign: "Architect full design", structuralEngineer: "Structural engineer", planningApplicationSupport: "Planning application support", planningApplicationFee: "Planning fee", buildingControl: "Building control", partyWallSurveyor: "Party wall surveyor", ThamesWaterBuildOver: "Build-over agreement" }[p.id] || p.id,
    amount: p.cost,
  }));
  return {
    low: niceRound(r.ranges.low),
    expected: niceRound(r.ranges.expected),
    high: niceRound(r.ranges.high),
    perM2: r.rangePerSqm.expected,
    area: a.area,
    timeline: `${weeks(r.timeline.build.min, r.timeline.build.max)} on site`,
    timelineNote: `Allow ${weeks(r.timeline.planning.min, r.timeline.planning.max)} before that for design and approvals.`,
    breakdown: rows([
      { label: "Construction (labour and materials)", amount: b.buildConstruction - b.extrasBuild },
      { label: "Floors, decoration and finishes", amount: b.fittingsApplied - (b.extrasFittings && finish !== "shellOnly" ? b.extrasFittings : 0) },
      ...b.extrasLineItems.filter((x) => x.includedInTotal !== false).map((x) => ({ label: `${featureName(x.id)}${x.quantity > 1 ? ` × ${x.quantity}` : ""}`, amount: x.total })),
      ...fees,
      { label: `Contingency (${Math.round(b.contingencyRate * 100)}%)`, amount: b.contingency },
      { label: "VAT", amount: b.vat },
    ]),
    included: [
      "Foundations, walls, roof and drainage",
      "Steel beams and opening up the back of the house",
      "Windows, doors and rooflights",
      "Plastering, electrics, heating and insulation",
      finish === "shellOnly" ? "Left ready for your own finishing trades" : "Flooring, decoration and lighting",
      "Survey, engineer, building control and planning fees",
    ],
    excluded: ["Furniture and loose appliances", "Landscaping beyond making good (unless selected)", "Unusual ground conditions such as tree roots or clay"],
    notes: [
      a.type === "basement"
        ? "Basements need specialist waterproofing and underpinning, so ranges are wider."
        : "Most single-storey rear extensions up to 3 m (6 m on detached houses) are permitted development.",
      "Prices are for a typical project in your area. Your quote will be fixed once drawings and a survey are done.",
    ],
  };
}

/* --------------------------------------------------------------- renovation */

const REN_LEVELS = [
  { id: "cosmetic", label: "Cosmetic refresh", hint: "Decorate, new floors, light repairs." },
  { id: "standard", label: "Mid-range refurbishment", hint: "New kitchen and bathroom, partial rewire, decoration." },
  { id: "fullRenovation", label: "Full renovation", hint: "Rewire, replumb, new heating, plaster, everything new." },
  { id: "backToBrick", label: "Back to brick", hint: "Strip to the shell and rebuild inside." },
];
const REN_COVERAGE = [
  { id: "singleArea", label: "One area" },
  { id: "partialHome", label: "About half" },
  { id: "mostRooms", label: "Most rooms" },
  { id: "wholeHome", label: "Whole home" },
];
const REN_STYLE = [
  { id: "victorian", label: "Victorian" },
  { id: "edwardian", label: "Edwardian" },
  { id: "period", label: "1920s–30s / older" },
  { id: "modern", label: "Post-war or modern" },
  { id: "newBuild", label: "New build" },
];
const REN_FINISH = [
  { id: "budget", label: "Budget-conscious" },
  { id: "standard", label: "Standard" },
  { id: "premium", label: "Premium" },
];
const REN_WORKS = [
  { id: "rewire", label: "Rewiring" },
  { id: "heating", label: "Heating and boiler" },
  { id: "plumbing", label: "Plumbing" },
  { id: "plastering", label: "Plastering" },
  { id: "decoration", label: "Decoration" },
  { id: "flooring", label: "New flooring" },
  { id: "doors", label: "New internal doors" },
  { id: "damp", label: "Damp and repairs allowance" },
];
const REN_PRESETS = {
  cosmetic: { decoration: true, flooring: true },
  standard: { rewire: true, plastering: true, decoration: true, flooring: true, heating: true },
  fullRenovation: { rewire: true, heating: true, plumbing: true, plastering: true, decoration: true, flooring: true, doors: true },
  backToBrick: { rewire: true, heating: true, plumbing: true, plastering: true, decoration: true, flooring: true, doors: true, damp: true },
};
const REN_FLOORS = [
  { id: "laminate", label: "Laminate" },
  { id: "carpet", label: "Carpet" },
  { id: "lvt", label: "LVT" },
  { id: "engineeredWood", label: "Engineered wood" },
  { id: "tile", label: "Tiles" },
];
const REN_DRAWINGS = { justExploring: "noPlansYet", roughIdea: "roughScope", drawings: "roomByRoomPlan", quoting: "detailedSchedule" };

function estimateRenovation(a, config) {
  const engine = createRenovationEngine(config);
  const deep = a.level === "fullRenovation" || a.level === "backToBrick";
  const w = a.works || {};
  const r = engine.calculateTotalCost({
    region: a.region,
    londonZone: a.londonZone,
    propertyType: a.property,
    houseStyle: a.style,
    floor: "ground",
    houseSize: a.area,
    bedrooms: a.bedrooms,
    bathrooms: a.bathrooms,
    kitchens: 1,
    receptionRooms: a.receptions,
    coverageLevel: a.coverage,
    renovationLevel: a.level,
    finishLevel: a.finish,
    occupancyStatus: a.livingIn ? "occupied" : "vacant",
    drawingsStatus: REN_DRAWINGS[a.certainty] || "roughScope",
    renovateKitchenCount: a.kitchen ? 1 : 0,
    renovateBathroomCount: clamp(a.bathroomsToDo, 0, a.bathrooms),
    renovateBedroomCount: a.coverage === "wholeHome" ? a.bedrooms : Math.ceil(a.bedrooms / 2),
    renovateReceptionCount: a.coverage === "wholeHome" ? a.receptions : Math.ceil(a.receptions / 2),
    includeHallway: a.coverage === "wholeHome" || a.coverage === "mostRooms",
    structuralLevel: a.walls > 0 ? "loadBearing" : "none",
    wallRemovalCount: a.walls,
    dampAllowance: Boolean(w.damp),
    rewireLevel: w.rewire ? (deep ? "full" : "partial") : "none",
    heatingLevel: w.heating ? (deep ? "fullSystem" : a.level === "standard" ? "boilerOnly" : "controlsOnly") : "none",
    plumbingLevel: w.plumbing ? (deep ? "fullDistribution" : "localised") : "none",
    plasteringLevel: w.plastering ? (deep ? "fullAffectedArea" : a.level === "standard" ? "selectedRooms" : "patchRepairs") : "none",
    decorationLevel: w.decoration ? (a.level === "cosmetic" ? "refresh" : "fullAffectedArea") : "none",
    flooringLevel: w.flooring ? "fullAffectedArea" : "none",
    floorFinish: a.floorFinish,
    doorPackage: w.doors ? (a.coverage === "wholeHome" ? "fullHouse" : "mostDoors") : "none",
    includeFittings: true,
    vatTreatment: a.vat === "zero" ? "zero" : "standard",
  });
  const b = r.breakdown;
  const sum = (items) => (items || []).reduce((s, x) => s + (x.total ?? x.amount ?? 0), 0);
  return {
    low: niceRound(r.ranges.low),
    expected: niceRound(r.ranges.expected),
    high: niceRound(r.ranges.high),
    perM2: r.rangePerSqm.expected,
    area: a.area,
    timeline: `${weeks(r.timeline.build?.min ?? r.timeline.min, r.timeline.build?.max ?? r.timeline.max)} on site`,
    breakdown: rows([
      { label: "General building work", amount: b.coreScopeAdjusted },
      { label: "Kitchen, bathrooms and room fit-out", amount: b.roomFitout },
      { label: "Rewiring, heating and plumbing", amount: b.systemsWorks },
      { label: "Plastering, decoration, floors and doors", amount: b.finishingWorks },
      { label: "Structural work", amount: b.structuralWorks },
      { label: "Site set-up and management", amount: b.preliminaries },
      { label: "Surveys, engineer and building control", amount: (b.professionalFees || 0) + (b.statutoryFees || 0) || sum(b.feeLineItems) },
      { label: `Contingency (${Math.round(b.contingencyRate * 100)}%)`, amount: b.contingency },
      { label: "VAT", amount: b.vat },
    ]),
    included: [
      "Labour, materials and site management",
      "The works you selected, sized to your home",
      "Kitchen and bathroom fit-out at your finish level",
      "Building control and engineer where needed",
    ],
    excluded: ["Furniture, curtains and loose appliances", "Extensions or loft conversions (use those calculators)", "Hidden defects found once walls and floors are opened"],
    notes: [
      "Victorian and Edwardian homes often need more repair work once opened up. That is why period homes carry a higher range.",
      a.livingIn ? "Living in during the works adds time and protection costs." : "Moving out lets trades work faster and usually lowers the price.",
    ],
  };
}

/* ------------------------------------------------------------------ kitchen */

const KIT_LAYOUT = [
  { id: "singleWall", label: "Single wall", icon: "kSingle" },
  { id: "galley", label: "Galley", icon: "kGalley" },
  { id: "lShape", label: "L-shape", icon: "kL" },
  { id: "uShape", label: "U-shape", icon: "kU" },
];
const KIT_RANGE = [
  { id: "flatPack", label: "Value", hint: "IKEA and flat-pack ranges." },
  { id: "tradeFitted", label: "Mid-range", hint: "Howdens, Wren, Magnet and similar." },
  { id: "premium", label: "Premium", hint: "German or high-end British ranges." },
  { id: "bespoke", label: "Bespoke", hint: "Made-to-measure joinery, often hand-painted." },
];
const KIT_APPLIANCES = [
  { id: "reuseExisting", label: "Keep mine" },
  { id: "essentials", label: "Essentials" },
  { id: "standard", label: "Standard integrated" },
  { id: "premium", label: "Premium brands" },
  { id: "luxury", label: "Luxury" },
];
const KIT_WORKTOP = [
  { id: "laminate", label: "Laminate" },
  { id: "solidWood", label: "Solid wood" },
  { id: "quartz", label: "Quartz" },
  { id: "granite", label: "Granite" },
  { id: "porcelain", label: "Porcelain / sintered" },
];
const KIT_SPLASH = [
  { id: "painted", label: "Painted" },
  { id: "tiles", label: "Tiles" },
  { id: "glass", label: "Glass" },
  { id: "quartzUpstand", label: "Quartz upstand" },
  { id: "fullHeightStone", label: "Full-height stone" },
];
const KIT_FLOOR = [
  { id: "keepExisting", label: "Keep existing" },
  { id: "lvt", label: "LVT / vinyl" },
  { id: "tile", label: "Tiles" },
  { id: "engineeredWood", label: "Engineered wood" },
];
const KIT_WORKS = [
  { id: "electrics", label: "New sockets and lighting" },
  { id: "rewire", label: "Full kitchen rewire" },
  { id: "movePlumbing", label: "Move the sink or appliances" },
  { id: "boiler", label: "Move or box in the boiler" },
  { id: "decorate", label: "Full redecoration" },
  { id: "knockThrough", label: "Knock through a wall" },
];
const KIT_DRAWINGS = { justExploring: "noPlansYet", roughIdea: "roughPlan", drawings: "roomMeasured", quoting: "detailedSchedule" };

function estimateKitchen(a, config) {
  const engine = createKitchenEngine(config);
  const w = a.works || {};
  const r = engine.calculateTotalCost({
    region: a.region,
    londonZone: a.londonZone,
    propertyType: a.property,
    kitchenSize: a.area,
    layoutType: a.layout,
    includeIsland: Boolean(a.island),
    kitchenRange: a.range,
    appliancePackage: a.appliances,
    worktopType: a.worktop,
    splashbackType: a.splashback,
    flooringType: a.floor,
    electricalLevel: w.rewire ? "fullKitchenRewire" : w.electrics ? "partialUpgrade" : "lightRefresh",
    plumbingLevel: w.movePlumbing ? "moveSinkOrAppliances" : "retainLayout",
    boilerWork: w.boiler ? "relocate" : "none",
    decorationLevel: w.decorate ? "fullRedecoration" : "makingGood",
    structuralLevel: w.knockThrough ? "loadBearing" : "none",
    openingCount: w.knockThrough ? 1 : 0,
    occupancyStatus: "occupied",
    drawingsStatus: KIT_DRAWINGS[a.certainty] || "roughPlan",
  });
  const b = r.breakdown;
  const vat = a.vat === "zero" ? 0 : b.vat;
  const factor = (b.total - b.vat + vat) / b.total;
  return {
    low: niceRound(r.ranges.low * factor),
    expected: niceRound(r.ranges.expected * factor),
    high: niceRound(r.ranges.high * factor),
    perM2: round((r.ranges.expected * factor) / a.area),
    area: a.area,
    timeline: `${weeks(r.timeline.build.min, r.timeline.build.max)} on site`,
    breakdown: rows([
      { label: "Units and cabinetry", amount: b.cabinetry },
      { label: "Appliances", amount: b.appliances },
      { label: "Worktops", amount: b.worktops },
      { label: "Splashback", amount: b.splashback },
      { label: "Flooring", amount: b.flooring },
      { label: "Fitting, strip-out and making good", amount: b.coreInstallation },
      { label: "Electrics", amount: b.electrical },
      { label: "Plumbing", amount: b.plumbing },
      { label: "Boiler work", amount: b.boiler },
      { label: "Decoration", amount: b.decoration },
      { label: "Structural opening and engineer", amount: b.structural + (b.professionalFees || 0) + (b.statutoryFees || 0) },
      { label: `Contingency (${Math.round(b.contingencyRate * 100)}%)`, amount: b.contingency },
      { label: "VAT", amount: vat },
    ]),
    included: ["Strip-out and disposal of the old kitchen", "Supply and fitting of units, worktops and appliances", "Electrical and plumbing connections", "Making good walls and ceilings"],
    excluded: ["Extending the room (use the extension calculator)", "Moving gas meters or soil stacks", "Decorative lighting fixtures beyond a standard allowance"],
    notes: [
      "Worktops and appliances swing the price as much as the units do. Quartz versus laminate alone can be £2,000–£4,000.",
      "The run length is estimated from your room size and layout. A measured plan will tighten the range.",
    ],
  };
}

/* ------------------------------------------------------------------ the list */

export const CALCULATORS = {
  extension: {
    id: "extension",
    name: "House extension cost calculator",
    short: "Extension",
    path: "/extension-calculator",
    source: "Extension Calculator",
    rateType: "extension",
    defaultConfig: DEFAULT_EXTENSION_CONFIG,
    estimate: estimateExtension,
    defaults: { type: "rearExtension", area: 25, property: "terraced", region: "london", londonZone: "zone3", finish: "standard", glazing: "glazed", access: "standard", extras: { roofLights: 2 }, certainty: "roughIdea", vat: "standard" },
    steps: [
      { id: "type", title: "What are you building?", fields: [{ id: "type", type: "cards", options: EXT_TYPES, columns: 3 }] },
      { id: "size", title: "How big?", fields: [{ id: "area", type: "area", label: "New floor area", min: 6, max: 120, presets: [10, 15, 20, 25, 35, 50] }] },
      { id: "home", title: "Your home", fields: [locationField, { id: "property", type: "chips", label: "Property type", options: PROPERTY }, { id: "access", type: "chips", label: "Access for builders", options: EXT_ACCESS }] },
      {
        id: "spec",
        title: "Finish and glazing",
        fields: [
          { id: "finish", type: "cards", label: "How finished?", options: EXT_FINISH, columns: 3 },
          { id: "glazing", type: "chips", label: "Glazing", options: EXT_GLAZING },
        ],
      },
      {
        id: "extras",
        title: "Anything else?",
        fields: [
          {
            id: "extras",
            type: "extras",
            label: "Add what applies",
            options: (config) =>
              EXT_EXTRAS.filter((id) => config.additionalFeatures[id]).map((id) => {
                const f = config.additionalFeatures[id];
                return {
                  id,
                  label: f.name,
                  hint: f.unit === "per_m2" ? `${plus(f.unitCost)} per m²` : plus(f.unitCost) + (f.unit === "per_item" ? " each" : ""),
                  qty: f.unit === "per_item" ? { min: f.minQuantity || 1, max: f.maxQuantity || 6, unit: f.unitLabel } : null,
                };
              }),
          },
        ],
      },
      { id: "stage", title: "Last thing", fields: [certaintyField, vatField] },
    ],
  },

  loft: {
    id: "loft",
    name: "Loft conversion cost calculator",
    short: "Loft",
    path: "/loft-conversion-cost-calculator",
    source: "Loft Calculator",
    rateType: "loft",
    defaultConfig: DEFAULT_LOFT_CONFIG,
    estimate: estimateLoft,
    defaults: { loftType: "rearDormer", area: 25, propertyType: "terraced", region: "london", londonZone: "zone3", finish: "standard", extras: {}, partyWallNeighbours: 2, planning: "auto", haveDrawings: false, certainty: "roughIdea", vat: "standard" },
    onChange: (patch, a, config) => {
      if (patch.loftType) return { area: config.loftTypes[patch.loftType]?.defaultArea ?? a.area };
      if (patch.propertyType) return { partyWallNeighbours: { terraced: 2, semiDetached: 1, detached: 0, bungalow: 1 }[patch.propertyType] ?? 1 };
      return null;
    },
    steps: [
      { id: "type", title: "Which type of loft?", fields: [{ id: "loftType", type: "cards", options: LOFT_TYPES.map((t) => ({ ...t, icon: t.id })), columns: 3 }] },
      { id: "size", title: "How much new floor space?", fields: [{ id: "area", type: "area", label: "New floor area", min: 10, max: 60, presets: [18, 22, 25, 30, 35, 40], help: "A typical London dormer adds 20–30 m²." }] },
      {
        id: "home",
        title: "Your home",
        fields: [
          locationField,
          { id: "propertyType", type: "chips", label: "Property type", options: LOFT_PROPERTY_TYPES },
          { id: "partyWallNeighbours", type: "chips", label: "Neighbours sharing a wall", options: [{ id: 0, label: "None" }, { id: 1, label: "One" }, { id: 2, label: "Two" }] },
        ],
      },
      {
        id: "spec",
        title: "Finish and extras",
        fields: [
          { id: "finish", type: "cards", label: "Finish level", options: LOFT_FINISHES, columns: 3 },
          {
            id: "extras",
            type: "extras",
            label: "Extras",
            options: (config) =>
              Object.entries(config.extras).map(([id, e]) => ({ id, label: e.label, hint: plus(e.cost) + (e.perItem ? " each" : ""), qty: e.perItem ? { min: 1, max: 6, unit: "rooflights" } : null })),
          },
        ],
      },
      {
        id: "stage",
        title: "Planning and drawings",
        fields: [
          { id: "planning", type: "chips", label: "Planning permission", options: [{ id: "auto", label: "Not sure" }, { id: "no", label: "Permitted development" }, { id: "yes", label: "Needs planning" }] },
          { id: "haveDrawings", type: "toggle", label: "I already have drawings", hint: "Removes the architect and survey allowance." },
          certaintyField,
          vatField,
        ],
      },
    ],
  },

  renovation: {
    id: "renovation",
    name: "Renovation and refurbishment cost calculator",
    short: "Renovation",
    path: "/renovation-calculator",
    source: "Renovation Calculator",
    rateType: "renovation",
    defaultConfig: DEFAULT_RENOVATION_CONFIG,
    estimate: estimateRenovation,
    defaults: { level: "fullRenovation", coverage: "wholeHome", area: 100, bedrooms: 3, bathrooms: 1, receptions: 2, property: "terraced", style: "victorian", region: "london", londonZone: "zone3", kitchen: true, bathroomsToDo: 1, walls: 0, works: REN_PRESETS.fullRenovation, floorFinish: "engineeredWood", finish: "standard", livingIn: false, certainty: "roughIdea", vat: "standard" },
    onChange: (patch) => (patch.level ? { works: REN_PRESETS[patch.level] } : null),
    steps: [
      { id: "level", title: "How deep is the renovation?", fields: [{ id: "level", type: "cards", options: REN_LEVELS, columns: 2 }, { id: "coverage", type: "chips", label: "How much of the home?", options: REN_COVERAGE }] },
      {
        id: "home",
        title: "About your home",
        fields: [
          { id: "area", type: "area", label: "Internal floor area", min: 30, max: 400, presets: [60, 80, 100, 120, 150, 200], help: "Check your EPC or estate agent floorplan. A 3-bed terrace is often 90–110 m²." },
          { id: "bedrooms", type: "counter", label: "Bedrooms", min: 0, max: 8 },
          { id: "bathrooms", type: "counter", label: "Bathrooms", min: 0, max: 5 },
          { id: "receptions", type: "counter", label: "Reception rooms", min: 0, max: 5 },
        ],
      },
      { id: "property", title: "Property and location", fields: [locationField, { id: "property", type: "chips", label: "Property type", options: PROPERTY }, { id: "style", type: "chips", label: "Age and style", options: REN_STYLE }] },
      {
        id: "works",
        title: "What's included?",
        subtitle: "We've ticked what's usual for your level. Change anything.",
        fields: [
          { id: "kitchen", type: "toggle", label: "New kitchen" },
          { id: "bathroomsToDo", type: "counter", label: "Bathrooms to renovate", min: 0, max: 5 },
          { id: "works", type: "extras", label: "Works", options: () => REN_WORKS },
          { id: "walls", type: "counter", label: "Walls to knock through", min: 0, max: 4, help: "Load-bearing walls need steel beams and an engineer." },
          { id: "floorFinish", type: "chips", label: "Main floor finish", options: REN_FLOORS, showIf: (a) => a.works?.flooring },
        ],
      },
      { id: "stage", title: "Finish and timing", fields: [{ id: "finish", type: "chips", label: "Finish level", options: REN_FINISH }, { id: "livingIn", type: "toggle", label: "We'll live in the house during the works" }, certaintyField, vatField] },
    ],
  },

  kitchen: {
    id: "kitchen",
    name: "Kitchen renovation cost calculator",
    short: "Kitchen",
    path: "/kitchen-calculator",
    source: "Kitchen Calculator",
    rateType: "kitchen",
    defaultConfig: KITCHEN_CONFIG,
    estimate: estimateKitchen,
    defaults: { area: 12, layout: "lShape", island: false, range: "tradeFitted", appliances: "standard", worktop: "quartz", splashback: "tiles", floor: "lvt", works: { electrics: true }, property: "terraced", region: "london", londonZone: "zone3", certainty: "roughIdea", vat: "standard" },
    steps: [
      { id: "room", title: "Your kitchen", fields: [{ id: "layout", type: "cards", label: "Layout", options: KIT_LAYOUT, columns: 4 }, { id: "area", type: "area", label: "Kitchen floor area", min: 4, max: 60, presets: [6, 9, 12, 16, 20, 30] }, { id: "island", type: "toggle", label: "Add an island" }] },
      { id: "range", title: "Which kind of kitchen?", fields: [{ id: "range", type: "cards", options: KIT_RANGE, columns: 2 }, { id: "appliances", type: "chips", label: "Appliances", options: KIT_APPLIANCES }] },
      { id: "surfaces", title: "Worktops and floor", fields: [{ id: "worktop", type: "chips", label: "Worktop", options: KIT_WORKTOP }, { id: "splashback", type: "chips", label: "Splashback", options: KIT_SPLASH }, { id: "floor", type: "chips", label: "Flooring", options: KIT_FLOOR }] },
      { id: "works", title: "Building work", fields: [{ id: "works", type: "extras", label: "Tick what you need", options: () => KIT_WORKS }] },
      { id: "home", title: "Where and when", fields: [locationField, { id: "property", type: "chips", label: "Property type", options: PROPERTY }, certaintyField, vatField] },
    ],
  },

  bathroom: {
    id: "bathroom",
    name: "Bathroom renovation cost calculator",
    short: "Bathroom",
    path: "/tools/bathroom-cost-calculator",
    source: "Bathroom Calculator",
    rateType: "bathroom",
    defaultConfig: DEFAULT_BATHROOM_CONFIG,
    estimate: estimateBathroom,
    defaults: { roomType: "family", area: 5.5, layout: "keep", tiling: "half", products: "midRange", extras: { towelRail: true }, region: "london", londonZone: "zone3", certainty: "roughIdea", vat: "standard" },
    onChange: (patch, a, config) => (patch.roomType ? { area: config.roomTypes[patch.roomType]?.defaultArea ?? a.area } : null),
    steps: [
      { id: "type", title: "Which room?", fields: [{ id: "roomType", type: "cards", options: BATHROOM_TYPES.map((t) => ({ ...t, icon: t.id })), columns: 4 }, { id: "area", type: "area", label: "Floor area", min: 1.5, max: 16, step: 0.5, presets: [2.5, 4, 5.5, 7, 9] }] },
      { id: "layout", title: "Layout and tiling", fields: [{ id: "layout", type: "cards", label: "Layout", options: LAYOUT_OPTIONS, columns: 3 }, { id: "tiling", type: "chips", label: "Wall tiling", options: TILING_OPTIONS }] },
      { id: "products", title: "Fixtures and finishes", fields: [{ id: "products", type: "cards", label: "Sanitaryware, brassware and tiles", options: PRODUCT_TIERS, columns: 2 }, { id: "extras", type: "extras", label: "Extras", options: (config) => Object.entries(config.extras).map(([id, e]) => ({ id, label: e.label, hint: plus(e.cost) })) }] },
      { id: "home", title: "Where and when", fields: [locationField, certaintyField, vatField] },
    ],
  },

  btu: {
    id: "btu",
    name: "BTU and radiator size calculator",
    short: "BTU",
    path: "/btu-calculator",
    source: "BTU Calculator",
    rateType: null,
    kind: "btu",
    estimate: (a) => estimateBtu(a),
    defaults: { roomType: "living", length: 4.5, width: 3.6, height: 2.4, insulation: "average", heatSource: "boiler", externalWalls: 1, windows: 1, northFacing: false, singleGlazed: false, coldFloor: false },
    steps: [
      { id: "room", title: "Which room?", fields: [{ id: "roomType", type: "chips", options: BTU_ROOM_TYPES }] },
      { id: "size", title: "Room size", fields: [{ id: "length", type: "number", label: "Length", unit: "m", min: 1, max: 20, step: 0.1 }, { id: "width", type: "number", label: "Width", unit: "m", min: 1, max: 20, step: 0.1 }, { id: "height", type: "number", label: "Ceiling height", unit: "m", min: 2, max: 5, step: 0.05, help: "Victorian ground floors are often 2.8–3.2 m." }] },
      {
        id: "fabric",
        title: "How warm is the room?",
        fields: [
          { id: "insulation", type: "cards", options: BTU_INSULATION, columns: 2 },
          { id: "externalWalls", type: "counter", label: "Outside walls", min: 0, max: 4 },
          { id: "windows", type: "counter", label: "Windows and glazed doors", min: 0, max: 8 },
          { id: "northFacing", type: "toggle", label: "North-facing" },
          { id: "singleGlazed", type: "toggle", label: "Single glazing" },
          { id: "coldFloor", type: "toggle", label: "Above a garage, cellar or suspended timber floor" },
        ],
      },
      { id: "heat", title: "What heats the room?", fields: [{ id: "heatSource", type: "cards", options: BTU_HEAT_SOURCES, columns: 3 }] },
    ],
  },
};

export const CALCULATOR_IDS = Object.keys(CALCULATORS);
export const RATE_CALCULATORS = CALCULATOR_IDS.filter((id) => CALCULATORS[id].rateType);

export const getCalculator = (id) => CALCULATORS[id] || null;

// Fills missing answers from defaults and keeps values inside each field's limits,
// so share links and tampered requests can't break the engines.
export function sanitizeAnswers(calc, answers = {}) {
  const a = { ...calc.defaults };
  for (const step of calc.steps) {
    for (const field of step.fields) {
      if (field.type === "location") {
        if (REGIONS.some((r) => r.id === answers.region)) a.region = answers.region;
        if (/^zone[1-5]$/.test(answers.londonZone || "")) a.londonZone = answers.londonZone;
        continue;
      }
      const v = answers[field.id];
      if (v === undefined) continue;
      if (field.type === "cards" || field.type === "chips") {
        if (field.options.some((o) => o.id === v)) a[field.id] = v;
      } else if (field.type === "area" || field.type === "number" || field.type === "counter") {
        a[field.id] = clamp(v, field.min ?? 0, field.max ?? 1000);
      } else if (field.type === "toggle") {
        a[field.id] = Boolean(v);
      } else if (field.type === "extras" && v && typeof v === "object") {
        a[field.id] = Object.fromEntries(
          Object.entries(v)
            .filter(([, x]) => x)
            .slice(0, 20)
            .map(([k, x]) => [String(k).slice(0, 40), typeof x === "number" ? clamp(x, 1, 20) : true]),
        );
      }
    }
  }
  return a;
}

// Human-readable answers for emails, PDFs and the admin lead record.
export function summarizeAnswers(calc, answers, config) {
  const out = [];
  for (const step of calc.steps) {
    for (const field of step.fields) {
      if (field.showIf && !field.showIf(answers)) continue;
      if (field.type === "location") {
        const region = REGIONS.find((r) => r.id === answers.region)?.label || answers.region;
        out.push({ question: "Location", answer: answers.region === "london" ? `${region} (${answers.londonZone?.replace("zone", "zone ")})` : region });
        continue;
      }
      const v = answers[field.id];
      const label = field.label || step.title;
      if (field.type === "cards" || field.type === "chips") {
        out.push({ question: label, answer: field.options.find((o) => o.id === v)?.label ?? String(v) });
      } else if (field.type === "area") {
        out.push({ question: label, answer: `${v} m²` });
      } else if (field.type === "number") {
        out.push({ question: label, answer: `${v} ${field.unit || ""}`.trim() });
      } else if (field.type === "counter") {
        out.push({ question: label, answer: String(v) });
      } else if (field.type === "toggle") {
        out.push({ question: label, answer: v ? "Yes" : "No" });
      } else if (field.type === "extras") {
        const opts = typeof field.options === "function" ? field.options(config || calc.defaultConfig || {}) : field.options;
        const picked = Object.entries(v || {})
          .filter(([, x]) => x)
          .map(([id, x]) => {
            const o = opts.find((p) => p.id === id);
            return o ? `${o.label}${typeof x === "number" && o.qty ? ` × ${x}` : ""}` : null;
          })
          .filter(Boolean);
        out.push({ question: label, answer: picked.length ? picked.join(", ") : "None" });
      }
    }
  }
  return out;
}

export function runEstimate(calc, answers, config) {
  return calc.estimate(sanitizeAnswers(calc, answers), config || calc.defaultConfig);
}
