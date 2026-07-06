import { DEFAULT_RENOVATION_CONFIG } from "./config.js";

const DEFAULTS = {
  region: "london",
  londonZone: "zone3",
  coverageLevel: "partialHome",
  renovationLevel: "standard",
  finishLevel: "standard",
  occupancyStatus: "vacant",
  drawingsStatus: "roughScope",
  structuralLevel: "none",
  rewireLevel: "none",
  heatingLevel: "none",
  plumbingLevel: "none",
  plasteringLevel: "none",
  decorationLevel: "none",
  flooringLevel: "none",
  floorFinish: "laminate",
  doorPackage: "none",
  dampAllowance: false,
  includeFittings: false,
  vatTreatment: "standard",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Math.round(Number(value) || 0);
}

function sum(values) {
  return values.reduce((total, value) => total + (Number(value) || 0), 0);
}

export class RenovationCostEngine {
  constructor(config = DEFAULT_RENOVATION_CONFIG) {
    this.config = config || DEFAULT_RENOVATION_CONFIG;
  }

  normalizeProjectData(projectData = {}) {
    const data = { ...projectData };

    if (!data.region && data.location) {
      if (String(data.location).startsWith("zone")) {
        data.region = "london";
        data.londonZone = data.location;
      } else {
        data.region = data.location;
      }
    }

    data.region = data.region || DEFAULTS.region;
    data.location = data.location || data.londonZone || DEFAULTS.londonZone;
    data.londonZone =
      data.region === "london"
        ? data.londonZone || data.location || DEFAULTS.londonZone
        : null;

    data.propertyType = data.propertyType || "";
    data.houseStyle = data.houseStyle || "";
    data.floor = data.floor || "ground";
    data.postcode = String(data.postcode || "").trim();

    data.houseSize = clamp(Number(data.houseSize) || 0, 0, 1000);
    data.bedrooms = clamp(Number(data.bedrooms) || 0, 0, 12);
    data.bathrooms = clamp(Number(data.bathrooms) || 0, 0, 8);
    data.kitchens = clamp(Number(data.kitchens) || 0, 0, 3);
    data.receptionRooms = clamp(Number(data.receptionRooms) || 0, 0, 6);

    data.coverageLevel = data.coverageLevel || DEFAULTS.coverageLevel;
    data.renovationLevel = data.renovationLevel || DEFAULTS.renovationLevel;
    data.finishLevel = data.finishLevel || DEFAULTS.finishLevel;
    data.occupancyStatus = data.occupancyStatus || DEFAULTS.occupancyStatus;
    data.drawingsStatus = data.drawingsStatus || DEFAULTS.drawingsStatus;

    data.renovateKitchenCount = clamp(
      Number(data.renovateKitchenCount) || 0,
      0,
      data.kitchens || 3,
    );
    data.renovateBathroomCount = clamp(
      Number(data.renovateBathroomCount) || 0,
      0,
      data.bathrooms || 8,
    );
    data.renovateBedroomCount = clamp(
      Number(data.renovateBedroomCount) || 0,
      0,
      data.bedrooms || 12,
    );
    data.renovateReceptionCount = clamp(
      Number(data.renovateReceptionCount) || 0,
      0,
      data.receptionRooms || 6,
    );
    data.includeHallway = Boolean(data.includeHallway);

    data.structuralLevel = data.structuralLevel || DEFAULTS.structuralLevel;
    data.wallRemovalCount = clamp(Number(data.wallRemovalCount) || 0, 0, 8);
    data.dampAllowance = Boolean(data.dampAllowance);

    data.rewireLevel = data.rewireLevel || DEFAULTS.rewireLevel;
    data.heatingLevel = data.heatingLevel || DEFAULTS.heatingLevel;
    data.plumbingLevel = data.plumbingLevel || DEFAULTS.plumbingLevel;

    data.plasteringLevel = data.plasteringLevel || DEFAULTS.plasteringLevel;
    data.decorationLevel = data.decorationLevel || DEFAULTS.decorationLevel;
    data.flooringLevel = data.flooringLevel || DEFAULTS.flooringLevel;
    data.floorFinish = data.floorFinish || DEFAULTS.floorFinish;
    data.doorPackage = data.doorPackage || DEFAULTS.doorPackage;

    // Fittings default OFF: only add supplied-item costs when explicitly opted in.
    data.includeFittings = Boolean(data.includeFittings);
    data.vatTreatment =
      data.vatTreatment && this.config.vatTreatments?.[data.vatTreatment] !== undefined
        ? data.vatTreatment
        : DEFAULTS.vatTreatment;

    return data;
  }

  validateProjectData(projectData) {
    const data = this.normalizeProjectData(projectData);

    if (!data.propertyType) throw new Error("Please select a property type.");
    if (!data.region) throw new Error("Please select a region.");
    if (!data.houseStyle) throw new Error("Please select the house style.");
    if (!data.houseSize || data.houseSize < 20) {
      throw new Error("Please enter an approximate property size.");
    }
    if (!data.coverageLevel) {
      throw new Error("Please select how much of the home is affected.");
    }
    if (!data.renovationLevel) {
      throw new Error("Please select the renovation scope.");
    }

    return data;
  }

  getCoverageFactor(coverageLevel) {
    return this.config.coverageFactors[coverageLevel] || 0.45;
  }

  // Single, consistently-applied multiplier on construction cost (labour + materials).
  getContextMultiplier(data) {
    const region = this.config.regionMultipliers[data.region] || 1.0;
    const zone =
      data.region === "london"
        ? this.config.londonZoneMultipliers[data.londonZone || DEFAULTS.londonZone] || 1.0
        : 1.0;
    const property = this.config.propertyMultipliers[data.propertyType] || 1.0;
    const houseStyle = this.config.houseStyleMultipliers[data.houseStyle] || 1.0;
    const floor =
      data.propertyType === "flat" || data.propertyType === "maisonette"
        ? this.config.floorMultipliers[data.floor] || 1.0
        : 1.0;
    return region * zone * property * houseStyle * floor;
  }

  getFinishMultiplier(finishLevel) {
    return this.config.finishLevelMultipliers[finishLevel] || 1.0;
  }

  getImpactedArea(data) {
    return round(data.houseSize * this.getCoverageFactor(data.coverageLevel));
  }

  // Builds a normalized component object for a line item.
  makeComponents({ labour = 0, materials = 0, fittings = 0 }, context, finish, includeFittings) {
    const adjLabour = labour * context;
    const adjMaterials = materials * context;
    const adjFittings = fittings * finish;
    const construction = adjLabour + adjMaterials;
    return {
      labour: round(adjLabour),
      materials: round(adjMaterials),
      fittings: round(adjFittings),
      construction: round(construction),
      total: round(construction + (includeFittings ? adjFittings : 0)),
    };
  }

  calculateCoreScope(data, context) {
    const impactedArea = this.getImpactedArea(data);
    const rate =
      this.config.baseScopeRates[data.renovationLevel] ||
      this.config.baseScopeRates.standard;
    const c = this.makeComponents(
      { labour: rate.labour * impactedArea, materials: rate.materials * impactedArea },
      context,
      1,
      data.includeFittings,
    );
    return { impactedArea, ...c };
  }

  calculateRoomCosts(data, context, finish) {
    const roomSelections = [
      { id: "kitchen", name: "Kitchen renovation", quantity: data.renovateKitchenCount },
      { id: "bathroom", name: "Bathroom renovation", quantity: data.renovateBathroomCount },
      { id: "bedroom", name: "Bedroom refurbishment", quantity: data.renovateBedroomCount },
      { id: "reception", name: "Living / reception room", quantity: data.renovateReceptionCount },
      { id: "hallway", name: "Hallway / stairs / landing", quantity: data.includeHallway ? 1 : 0 },
    ];

    const lineItems = roomSelections
      .filter((item) => item.quantity > 0)
      .map((item) => {
        const rate = this.config.roomRates[item.id]?.[data.renovationLevel] || {};
        const unit = this.makeComponents(rate, context, finish, data.includeFittings);
        return {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          labour: round(unit.labour * item.quantity),
          materials: round(unit.materials * item.quantity),
          fittings: round(unit.fittings * item.quantity),
          construction: round(unit.construction * item.quantity),
          total: round(unit.total * item.quantity),
        };
      });

    return this.tally(lineItems);
  }

  calculateStructuralCosts(data, context) {
    const lineItems = [];

    if (data.structuralLevel === "nonStructural" && data.wallRemovalCount > 0) {
      const unit = this.makeComponents(
        this.config.structuralWork.nonStructuralWallRemoval,
        context,
        1,
        data.includeFittings,
      );
      lineItems.push(this.scaleLine("nonStructuralWallRemoval", "Non-structural wall removal", unit, data.wallRemovalCount));
    }

    if (data.structuralLevel === "loadBearing" && data.wallRemovalCount > 0) {
      const unit = this.makeComponents(
        this.config.structuralWork.loadBearingWallRemoval,
        context,
        1,
        data.includeFittings,
      );
      lineItems.push(this.scaleLine("loadBearingWallRemoval", "Load-bearing wall / steelwork allowance", unit, data.wallRemovalCount));
    }

    if (data.dampAllowance) {
      const unit = this.makeComponents(
        this.config.structuralWork.dampRepairAllowance,
        context,
        1,
        data.includeFittings,
      );
      lineItems.push(this.scaleLine("dampRepairAllowance", "Damp / hidden repair allowance", unit, 1));
    }

    return this.tally(lineItems);
  }

  calculateSystemsCosts(data, impactedArea, context) {
    const systems = [
      {
        id: "rewire",
        key: "rewireLevel",
        labelMap: { partial: "Partial rewire", full: "Full rewire" },
        config: this.config.systems.rewire,
      },
      {
        id: "heating",
        key: "heatingLevel",
        labelMap: {
          controlsOnly: "Heating controls upgrade",
          boilerOnly: "Boiler replacement",
          fullSystem: "Full heating system upgrade",
        },
        config: this.config.systems.heating,
      },
      {
        id: "plumbing",
        key: "plumbingLevel",
        labelMap: {
          localised: "Localised plumbing changes",
          fullDistribution: "Wide plumbing upgrade",
        },
        config: this.config.systems.plumbing,
      },
    ];

    const lineItems = systems
      .map((system) => {
        const selected = data[system.key];
        const pricing = system.config[selected];
        if (!pricing || selected === "none") return null;

        const labour = (pricing.fixedLabour || 0) + impactedArea * (pricing.perM2Labour || 0);
        const materials =
          (pricing.fixedMaterials || 0) + impactedArea * (pricing.perM2Materials || 0);
        const c = this.makeComponents({ labour, materials }, context, 1, data.includeFittings);

        return {
          id: `${system.id}-${selected}`,
          name: system.labelMap[selected] || selected,
          quantity: impactedArea,
          ...c,
        };
      })
      .filter(Boolean);

    return this.tally(lineItems);
  }

  calculateFinishingCosts(data, impactedArea, context, finish) {
    const lineItems = [];

    const plaster =
      this.config.finishing.plastering[data.plasteringLevel] ||
      this.config.finishing.plastering.none;
    if (plaster.areaFactor > 0) {
      const qty = impactedArea * plaster.areaFactor;
      const c = this.makeComponents(
        { labour: plaster.labour * qty, materials: plaster.materials * qty },
        context,
        1,
        data.includeFittings,
      );
      lineItems.push({ id: "plastering", name: "Plastering / making good", quantity: round(qty), ...c });
    }

    const decoration =
      this.config.finishing.decoration[data.decorationLevel] ||
      this.config.finishing.decoration.none;
    if (decoration.areaFactor > 0) {
      const qty = impactedArea * decoration.areaFactor;
      const c = this.makeComponents(
        { labour: decoration.labour * qty, materials: decoration.materials * qty },
        context,
        1,
        data.includeFittings,
      );
      lineItems.push({ id: "decoration", name: "Decoration / painting", quantity: round(qty), ...c });
    }

    const coverage = this.config.finishing.flooringCoverage[data.flooringLevel] || 0;
    if (coverage > 0) {
      const rate =
        this.config.finishing.floorRates[data.floorFinish] ||
        this.config.finishing.floorRates.laminate;
      const qty = impactedArea * coverage;
      const c = this.makeComponents(
        {
          labour: rate.labour * qty,
          materials: rate.materials * qty,
          fittings: rate.covering * qty,
        },
        context,
        finish,
        data.includeFittings,
      );
      lineItems.push({ id: "flooring", name: "Flooring replacement", quantity: round(qty), ...c });
    }

    const doors = this.config.finishing.doorPackages[data.doorPackage];
    if (doors && (doors.labour > 0 || doors.fittings > 0)) {
      const c = this.makeComponents(
        { labour: doors.labour, fittings: doors.fittings },
        context,
        finish,
        data.includeFittings,
      );
      lineItems.push({ id: "doors", name: "Door replacement allowance", quantity: 1, ...c });
    }

    return this.tally(lineItems);
  }

  calculatePreliminaries(constructionSubtotal, data) {
    const base =
      this.config.preliminaries.base[data.renovationLevel] ??
      this.config.preliminaries.base.standard;
    const occAdd = this.config.preliminaries.occupancyAdd[data.occupancyStatus] || 0;
    const rate = clamp(base + occAdd, 0, 0.35);
    return { rate, amount: round(constructionSubtotal * rate) };
  }

  calculateProfessionalFees(data) {
    const lineItems = [];
    const fees = this.config.professionalFees;

    if (data.drawingsStatus === "noPlansYet" || data.drawingsStatus === "roughScope") {
      lineItems.push({ id: "measuredSurvey", name: "Measured survey allowance", category: "professional", cost: fees.measuredSurvey });
    }

    const periodStock = ["victorian", "edwardian", "period"].includes(data.houseStyle);
    const intrusive =
      data.renovationLevel === "fullRenovation" ||
      data.renovationLevel === "backToBrick" ||
      data.structuralLevel === "loadBearing";
    if (periodStock && intrusive && fees.asbestosSurvey) {
      lineItems.push({ id: "asbestosSurvey", name: "Asbestos survey allowance", category: "professional", cost: fees.asbestosSurvey });
    }

    if (data.structuralLevel === "loadBearing") {
      lineItems.push({ id: "structuralEngineer", name: "Structural engineer", category: "professional", cost: fees.structuralEngineer });
      lineItems.push({ id: "buildingControl", name: "Building control allowance", category: "statutory", cost: fees.buildingControl });

      if (data.propertyType === "terraced" || data.propertyType === "semiDetached") {
        lineItems.push({ id: "partyWallAllowance", name: "Party wall allowance", category: "professional", cost: fees.partyWallAllowance });
      }
    }

    return {
      total: round(sum(lineItems.map((item) => item.cost))),
      professionalFees: round(
        sum(lineItems.filter((item) => item.category === "professional").map((item) => item.cost)),
      ),
      statutoryFees: round(
        sum(lineItems.filter((item) => item.category === "statutory").map((item) => item.cost)),
      ),
      lineItems,
      autoIncluded: lineItems.length > 0,
    };
  }

  calculateContingency(subtotalBeforeContingency, data) {
    let rate =
      this.config.contingencyRates[data.renovationLevel] ||
      this.config.contingencyRates.standard;

    if (data.structuralLevel === "loadBearing") rate += 0.02;
    if (data.houseStyle === "victorian" || data.houseStyle === "period") rate += 0.01;
    if (data.dampAllowance) rate += 0.01;

    rate = clamp(rate, 0.07, 0.2);
    return { rate, amount: round(subtotalBeforeContingency * rate) };
  }

  getRangeFactors(data) {
    const confidenceMultiplier =
      this.config.confidenceModifiers[data.drawingsStatus] ||
      this.config.confidenceModifiers.roughScope;

    const baseLow = 0.9;
    const baseHigh = 1.12;
    const lowFactor = clamp(baseLow / confidenceMultiplier, 0.78, 0.95);
    const highFactor = clamp(baseHigh * confidenceMultiplier, 1.1, 1.32);

    let rawConfidence = 90 - Math.round((confidenceMultiplier - 1) * 100);
    if (data.renovationLevel === "backToBrick") rawConfidence -= 6;
    if (data.structuralLevel === "loadBearing") rawConfidence -= 6;
    if (data.houseStyle === "victorian" || data.houseStyle === "period") rawConfidence -= 4;
    if (data.occupancyStatus === "occupied") rawConfidence -= 3;
    if (!data.includeFittings) rawConfidence += 3; // narrower scope, more predictable

    return { lowFactor, highFactor, confidenceScore: clamp(rawConfidence, 52, 94) };
  }

  getEstimatedTimeline(data, impactedArea) {
    const planningWeeks =
      {
        cosmetic: { min: 1, max: 2 },
        standard: { min: 2, max: 4 },
        fullRenovation: { min: 3, max: 6 },
        backToBrick: { min: 4, max: 8 },
      }[data.renovationLevel] || { min: 2, max: 4 };

    let buildMin = Math.max(3, Math.ceil(impactedArea / 20));
    let buildMax = Math.max(buildMin + 2, Math.ceil(impactedArea / 12));

    if (data.renovationLevel === "fullRenovation") { buildMin += 2; buildMax += 4; }
    if (data.renovationLevel === "backToBrick") { buildMin += 4; buildMax += 8; }
    if (data.structuralLevel === "loadBearing") { buildMin += 2; buildMax += 4; }
    if (data.rewireLevel === "full" || data.heatingLevel === "fullSystem") { buildMin += 1; buildMax += 3; }
    if (data.occupancyStatus === "occupied") { buildMin += 1; buildMax += 2; }

    return {
      planning: planningWeeks,
      build: { min: buildMin, max: buildMax },
      total: { min: planningWeeks.min + buildMin, max: planningWeeks.max + buildMax },
    };
  }

  // -- helpers -------------------------------------------------------------
  scaleLine(id, name, unit, quantity) {
    return {
      id,
      name,
      quantity,
      labour: round(unit.labour * quantity),
      materials: round(unit.materials * quantity),
      fittings: round(unit.fittings * quantity),
      construction: round(unit.construction * quantity),
      total: round(unit.total * quantity),
    };
  }

  tally(lineItems) {
    return {
      labour: round(sum(lineItems.map((i) => i.labour))),
      materials: round(sum(lineItems.map((i) => i.materials))),
      fittings: round(sum(lineItems.map((i) => i.fittings))),
      construction: round(sum(lineItems.map((i) => i.construction))),
      total: round(sum(lineItems.map((i) => i.total))),
      lineItems,
    };
  }

  calculateTotalCost(projectData) {
    const data = this.validateProjectData(projectData);
    const context = this.getContextMultiplier(data);
    const finish = this.getFinishMultiplier(data.finishLevel);

    const coreScope = this.calculateCoreScope(data, context);
    const rooms = this.calculateRoomCosts(data, context, finish);
    const structural = this.calculateStructuralCosts(data, context);
    const systems = this.calculateSystemsCosts(data, coreScope.impactedArea, context);
    const finishing = this.calculateFinishingCosts(data, coreScope.impactedArea, context, finish);
    const fees = this.calculateProfessionalFees(data);

    // Construction subtotal = labour + materials across build categories (excludes fittings & fees).
    const constructionSubtotal = round(
      coreScope.construction +
        rooms.construction +
        structural.construction +
        systems.construction +
        finishing.construction,
    );

    const fittingsSubtotal = round(
      coreScope.fittings +
        rooms.fittings +
        structural.fittings +
        systems.fittings +
        finishing.fittings,
    );

    const prelims = this.calculatePreliminaries(constructionSubtotal, data);

    const includedFittings = data.includeFittings ? fittingsSubtotal : 0;

    const subtotalBeforeContingency = round(
      constructionSubtotal + includedFittings + prelims.amount + fees.total,
    );

    const contingency = this.calculateContingency(subtotalBeforeContingency, data);
    const subtotalExVat = round(subtotalBeforeContingency + contingency.amount);
    const vatRate = this.config.vatTreatments?.[data.vatTreatment] ?? this.config.vatRate;
    const vat = round(subtotalExVat * vatRate);
    const total = round(subtotalExVat + vat);

    // Component roll-up (VAT-inclusive-agnostic; these are ex-VAT works figures).
    const labourTotal = round(
      coreScope.labour + rooms.labour + structural.labour + systems.labour + finishing.labour,
    );
    const materialsTotal = round(
      coreScope.materials + rooms.materials + structural.materials + systems.materials + finishing.materials,
    );

    const { lowFactor, highFactor, confidenceScore } = this.getRangeFactors(data);
    const ranges = {
      low: round(total * lowFactor),
      expected: total,
      high: round(total * highFactor),
    };

    const timeline = this.getEstimatedTimeline(data, coreScope.impactedArea);

    return {
      assumptions: {
        calculatorVersion: this.config.version,
        priceBookDate: this.config.priceBookDate,
        includeFittings: data.includeFittings,
        vatTreatment: data.vatTreatment,
        vatAppliedToFullSubtotal: true,
        autoIncludedFees: fees.autoIncluded,
      },
      inputs: data,
      breakdown: {
        impactedArea: coreScope.impactedArea,
        // Backwards-compatible category totals (respect the fittings toggle):
        coreScopeAdjusted: coreScope.total,
        roomFitout: rooms.total,
        roomLineItems: rooms.lineItems,
        structuralWorks: structural.total,
        structuralLineItems: structural.lineItems,
        systemsWorks: systems.total,
        systemsLineItems: systems.lineItems,
        finishingWorks: finishing.total,
        finishingLineItems: finishing.lineItems,
        professionalFees: fees.professionalFees,
        statutoryFees: fees.statutoryFees,
        feeLineItems: fees.lineItems,
        // New: labour / materials / fittings roll-up + preliminaries
        labourTotal,
        materialsTotal,
        constructionSubtotal,
        fittingsSubtotal,
        fittingsIncluded: data.includeFittings,
        fittingsApplied: includedFittings,
        preliminariesRate: prelims.rate,
        preliminaries: prelims.amount,
        subtotalBeforeContingency,
        contingencyRate: contingency.rate,
        contingency: contingency.amount,
        subtotalExVat,
        vatTreatment: data.vatTreatment,
        vatRate,
        vat,
        total,
      },
      ranges,
      total,
      costPerSqm: data.houseSize > 0 ? round(total / data.houseSize) : 0,
      rangePerSqm: {
        low: data.houseSize > 0 ? round(ranges.low / data.houseSize) : 0,
        expected: data.houseSize > 0 ? round(ranges.expected / data.houseSize) : 0,
        high: data.houseSize > 0 ? round(ranges.high / data.houseSize) : 0,
      },
      confidenceScore,
      timeline,
      serviceArea: {
        isLondon: data.region === "london",
        isPrimaryServiceArea: data.region === "london",
      },
    };
  }

  getCostRange(houseSize = 100) {
    const result = this.calculateTotalCost({
      propertyType: "semiDetached",
      region: "london",
      londonZone: "zone3",
      houseStyle: "modern",
      houseSize,
      bedrooms: 3,
      bathrooms: 2,
      kitchens: 1,
      receptionRooms: 1,
      coverageLevel: "mostRooms",
      renovationLevel: "standard",
      finishLevel: "standard",
      occupancyStatus: "vacant",
      drawingsStatus: "roughScope",
      renovateKitchenCount: 1,
      renovateBathroomCount: 1,
      renovateBedroomCount: 2,
      renovateReceptionCount: 1,
      includeHallway: true,
      structuralLevel: "none",
      wallRemovalCount: 0,
      rewireLevel: "partial",
      heatingLevel: "boilerOnly",
      plumbingLevel: "localised",
      plasteringLevel: "selectedRooms",
      decorationLevel: "fullAffectedArea",
      flooringLevel: "selectedRooms",
      floorFinish: "lvt",
      doorPackage: "someDoors",
      dampAllowance: false,
      includeFittings: true,
    });

    return {
      min: result.ranges.low,
      max: result.ranges.high,
      average: result.ranges.expected,
    };
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }
}

export function createCostEngine(config) {
  return new RenovationCostEngine(config);
}

export const costEngine = new RenovationCostEngine();
