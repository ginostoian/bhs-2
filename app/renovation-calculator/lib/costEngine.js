import { RENOVATION_CONFIG } from "./config.js";

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
  constructor() {
    this.config = RENOVATION_CONFIG;
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

    return data;
  }

  validateProjectData(projectData) {
    const data = this.normalizeProjectData(projectData);

    if (!data.propertyType) {
      throw new Error("Please select a property type.");
    }

    if (!data.region) {
      throw new Error("Please select a region.");
    }

    if (!data.houseStyle) {
      throw new Error("Please select the house style.");
    }

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

  getRegionMultiplier(region, londonZone = null) {
    const regionMultiplier = this.config.regionMultipliers[region] || 1.0;
    if (region !== "london") return regionMultiplier;
    const zoneMultiplier =
      this.config.londonZoneMultipliers[londonZone || DEFAULTS.londonZone] || 1.0;
    return regionMultiplier * zoneMultiplier;
  }

  getPropertyMultiplier(propertyType) {
    return this.config.propertyMultipliers[propertyType] || 1.0;
  }

  getHouseStyleMultiplier(houseStyle) {
    return this.config.houseStyleMultipliers[houseStyle] || 1.0;
  }

  getFloorMultiplier(propertyType, floor) {
    if (propertyType !== "flat" && propertyType !== "maisonette") {
      return 1.0;
    }
    return this.config.floorMultipliers[floor] || 1.0;
  }

  getFinishMultiplier(finishLevel) {
    return this.config.finishLevelMultipliers[finishLevel] || 1.0;
  }

  getOccupancyMultiplier(occupancyStatus) {
    return this.config.occupancyMultipliers[occupancyStatus] || 1.0;
  }

  getImpactedArea(data) {
    return round(data.houseSize * this.getCoverageFactor(data.coverageLevel));
  }

  calculateCoreScopeCost(data, multipliers) {
    const impactedArea = this.getImpactedArea(data);
    const baseRate =
      this.config.baseScopeRates[data.renovationLevel] ||
      this.config.baseScopeRates.standard;
    const subtotal = impactedArea * baseRate;
    const adjusted = round(
      subtotal *
        multipliers.region *
        multipliers.property *
        multipliers.houseStyle *
        multipliers.floor *
        multipliers.occupancy,
    );

    return {
      impactedArea,
      baseRate,
      subtotal: round(subtotal),
      adjusted,
    };
  }

  calculateRoomCosts(data, multipliers) {
    const roomSelections = [
      {
        id: "kitchen",
        name: "Kitchen renovation",
        quantity: data.renovateKitchenCount,
      },
      {
        id: "bathroom",
        name: "Bathroom renovation",
        quantity: data.renovateBathroomCount,
      },
      {
        id: "bedroom",
        name: "Bedroom refurbishment",
        quantity: data.renovateBedroomCount,
      },
      {
        id: "reception",
        name: "Living / reception room",
        quantity: data.renovateReceptionCount,
      },
      {
        id: "hallway",
        name: "Hallway / stairs / landing",
        quantity: data.includeHallway ? 1 : 0,
      },
    ];

    const lineItems = roomSelections
      .filter((item) => item.quantity > 0)
      .map((item) => {
        const baseUnitCost =
          this.config.roomRates[item.id]?.[data.renovationLevel] || 0;
        const adjustedUnitCost = round(
          baseUnitCost *
            multipliers.region *
            multipliers.property *
            multipliers.houseStyle *
            multipliers.floor *
            multipliers.finish,
        );

        return {
          ...item,
          baseUnitCost,
          adjustedUnitCost,
          total: round(adjustedUnitCost * item.quantity),
        };
      });

    return {
      total: round(sum(lineItems.map((item) => item.total))),
      lineItems,
    };
  }

  calculateStructuralCosts(data, multipliers) {
    const lineItems = [];
    let total = 0;

    if (data.structuralLevel === "nonStructural" && data.wallRemovalCount > 0) {
      const unitCost = round(
        this.config.structuralWork.nonStructuralWallRemoval *
          multipliers.region *
          multipliers.property *
          multipliers.houseStyle,
      );
      const amount = round(unitCost * data.wallRemovalCount);
      lineItems.push({
        id: "nonStructuralWallRemoval",
        name: "Non-structural wall removal",
        quantity: data.wallRemovalCount,
        unitCost,
        total: amount,
      });
      total += amount;
    }

    if (data.structuralLevel === "loadBearing" && data.wallRemovalCount > 0) {
      const unitCost = round(
        this.config.structuralWork.loadBearingWallRemoval *
          multipliers.region *
          multipliers.property *
          multipliers.houseStyle,
      );
      const amount = round(unitCost * data.wallRemovalCount);
      lineItems.push({
        id: "loadBearingWallRemoval",
        name: "Load-bearing wall / steelwork allowance",
        quantity: data.wallRemovalCount,
        unitCost,
        total: amount,
      });
      total += amount;
    }

    if (data.dampAllowance) {
      const amount = round(
        this.config.structuralWork.dampRepairAllowance *
          multipliers.region *
          multipliers.houseStyle,
      );
      lineItems.push({
        id: "dampRepairAllowance",
        name: "Damp / hidden repair allowance",
        quantity: 1,
        unitCost: amount,
        total: amount,
      });
      total += amount;
    }

    return { total: round(total), lineItems };
  }

  calculateSystemsCosts(data, impactedArea, multipliers) {
    const systems = [
      {
        id: "rewire",
        key: "rewireLevel",
        labelMap: {
          partial: "Partial rewire",
          full: "Full rewire",
        },
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

        const amount = round(
          (pricing.fixed + impactedArea * pricing.perM2) *
            multipliers.region *
            multipliers.property *
            multipliers.houseStyle *
            multipliers.occupancy,
        );

        return {
          id: `${system.id}-${selected}`,
          name: system.labelMap[selected] || selected,
          quantity: impactedArea,
          unitCost: pricing.perM2,
          fixed: pricing.fixed,
          total: amount,
        };
      })
      .filter(Boolean);

    return {
      total: round(sum(lineItems.map((item) => item.total))),
      lineItems,
    };
  }

  calculateFinishingCosts(data, impactedArea, multipliers) {
    const lineItems = [];

    const plasteringConfig =
      this.config.finishing.plastering[data.plasteringLevel] ||
      this.config.finishing.plastering.none;
    if (plasteringConfig.rate > 0) {
      const quantity = impactedArea * plasteringConfig.areaFactor;
      lineItems.push({
        id: "plastering",
        name: "Plastering / making good",
        quantity: round(quantity),
        unitCost: plasteringConfig.rate,
        total: round(
          quantity *
            plasteringConfig.rate *
            multipliers.region *
            multipliers.property *
            multipliers.houseStyle,
        ),
      });
    }

    const decorationConfig =
      this.config.finishing.decoration[data.decorationLevel] ||
      this.config.finishing.decoration.none;
    if (decorationConfig.rate > 0) {
      const quantity = impactedArea * decorationConfig.areaFactor;
      lineItems.push({
        id: "decoration",
        name: "Decoration / painting",
        quantity: round(quantity),
        unitCost: decorationConfig.rate,
        total: round(
          quantity *
            decorationConfig.rate *
            multipliers.region *
            multipliers.property *
            multipliers.occupancy,
        ),
      });
    }

    const flooringCoverage =
      this.config.finishing.flooringCoverage[data.flooringLevel] || 0;
    const floorRate =
      this.config.finishing.floorRates[data.floorFinish] ||
      this.config.finishing.floorRates.laminate;
    if (flooringCoverage > 0) {
      const quantity = impactedArea * flooringCoverage;
      lineItems.push({
        id: "flooring",
        name: "Flooring replacement",
        quantity: round(quantity),
        unitCost: floorRate,
        total: round(
          quantity *
            floorRate *
            multipliers.region *
            multipliers.property *
            multipliers.finish,
        ),
      });
    }

    const doorAllowance = this.config.finishing.doorPackages[data.doorPackage] || 0;
    if (doorAllowance > 0) {
      lineItems.push({
        id: "doors",
        name: "Door replacement allowance",
        quantity: 1,
        unitCost: round(doorAllowance * multipliers.finish),
        total: round(
          doorAllowance *
            multipliers.region *
            multipliers.property *
            multipliers.finish,
        ),
      });
    }

    return {
      total: round(sum(lineItems.map((item) => item.total))),
      lineItems,
    };
  }

  calculateProfessionalFees(data) {
    const lineItems = [];

    if (data.drawingsStatus === "noPlansYet" || data.drawingsStatus === "roughScope") {
      lineItems.push({
        id: "measuredSurvey",
        name: "Measured survey allowance",
        category: "professional",
        cost: this.config.professionalFees.measuredSurvey,
      });
    }

    if (data.structuralLevel === "loadBearing") {
      lineItems.push({
        id: "structuralEngineer",
        name: "Structural engineer",
        category: "professional",
        cost: this.config.professionalFees.structuralEngineer,
      });
      lineItems.push({
        id: "buildingControl",
        name: "Building control allowance",
        category: "statutory",
        cost: this.config.professionalFees.buildingControl,
      });

      if (data.propertyType === "terraced" || data.propertyType === "semiDetached") {
        lineItems.push({
          id: "partyWallAllowance",
          name: "Party wall allowance",
          category: "professional",
          cost: this.config.professionalFees.partyWallAllowance,
        });
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

    rate = clamp(rate, 0.08, 0.2);
    return {
      rate,
      amount: round(subtotalBeforeContingency * rate),
    };
  }

  getRangeFactors(data) {
    const confidenceMultiplier =
      this.config.confidenceModifiers[data.drawingsStatus] ||
      this.config.confidenceModifiers.roughScope;

    const baseLow = 0.92;
    const baseHigh = 1.1;
    const lowFactor = clamp(baseLow / confidenceMultiplier, 0.8, 0.95);
    const highFactor = clamp(baseHigh * confidenceMultiplier, 1.08, 1.28);

    let rawConfidence = 90 - Math.round((confidenceMultiplier - 1) * 100);
    if (data.renovationLevel === "backToBrick") rawConfidence -= 6;
    if (data.structuralLevel === "loadBearing") rawConfidence -= 6;
    if (data.houseStyle === "victorian" || data.houseStyle === "period") rawConfidence -= 4;
    if (data.occupancyStatus === "occupied") rawConfidence -= 3;

    return {
      lowFactor,
      highFactor,
      confidenceScore: clamp(rawConfidence, 52, 94),
    };
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

    if (data.renovationLevel === "fullRenovation") {
      buildMin += 2;
      buildMax += 4;
    }
    if (data.renovationLevel === "backToBrick") {
      buildMin += 4;
      buildMax += 8;
    }
    if (data.structuralLevel === "loadBearing") {
      buildMin += 2;
      buildMax += 4;
    }
    if (data.rewireLevel === "full" || data.heatingLevel === "fullSystem") {
      buildMin += 1;
      buildMax += 3;
    }
    if (data.occupancyStatus === "occupied") {
      buildMin += 1;
      buildMax += 2;
    }

    return {
      planning: planningWeeks,
      build: { min: buildMin, max: buildMax },
      total: {
        min: planningWeeks.min + buildMin,
        max: planningWeeks.max + buildMax,
      },
    };
  }

  calculateTotalCost(projectData) {
    const data = this.validateProjectData(projectData);

    const multipliers = {
      region: this.getRegionMultiplier(data.region, data.londonZone),
      property: this.getPropertyMultiplier(data.propertyType),
      houseStyle: this.getHouseStyleMultiplier(data.houseStyle),
      floor: this.getFloorMultiplier(data.propertyType, data.floor),
      finish: this.getFinishMultiplier(data.finishLevel),
      occupancy: this.getOccupancyMultiplier(data.occupancyStatus),
    };

    const coreScope = this.calculateCoreScopeCost(data, multipliers);
    const roomCosts = this.calculateRoomCosts(data, multipliers);
    const structuralCosts = this.calculateStructuralCosts(data, multipliers);
    const systemsCosts = this.calculateSystemsCosts(
      data,
      coreScope.impactedArea,
      multipliers,
    );
    const finishingCosts = this.calculateFinishingCosts(
      data,
      coreScope.impactedArea,
      multipliers,
    );
    const feeCosts = this.calculateProfessionalFees(data);

    const subtotalBeforeContingency = round(
      coreScope.adjusted +
        roomCosts.total +
        structuralCosts.total +
        systemsCosts.total +
        finishingCosts.total +
        feeCosts.total,
    );

    const contingency = this.calculateContingency(subtotalBeforeContingency, data);
    const subtotalExVat = round(subtotalBeforeContingency + contingency.amount);
    const vat = round(subtotalExVat * this.config.vatRate);
    const total = round(subtotalExVat + vat);

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
        vatAppliedToFullSubtotal: true,
        autoIncludedFees: feeCosts.autoIncluded,
      },
      inputs: data,
      breakdown: {
        impactedArea: coreScope.impactedArea,
        coreScopeBaseRate: coreScope.baseRate,
        coreScopeBase: coreScope.subtotal,
        multipliers,
        coreScopeAdjusted: coreScope.adjusted,
        roomFitout: roomCosts.total,
        roomLineItems: roomCosts.lineItems,
        structuralWorks: structuralCosts.total,
        structuralLineItems: structuralCosts.lineItems,
        systemsWorks: systemsCosts.total,
        systemsLineItems: systemsCosts.lineItems,
        finishingWorks: finishingCosts.total,
        finishingLineItems: finishingCosts.lineItems,
        professionalFees: feeCosts.professionalFees,
        statutoryFees: feeCosts.statutoryFees,
        feeLineItems: feeCosts.lineItems,
        subtotalBeforeContingency,
        contingencyRate: contingency.rate,
        contingency: contingency.amount,
        subtotalExVat,
        vatRate: this.config.vatRate,
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

export const costEngine = new RenovationCostEngine();
