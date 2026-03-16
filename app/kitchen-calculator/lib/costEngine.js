import { KITCHEN_CONFIG } from "./config.js";

const DEFAULTS = {
  region: "london",
  londonZone: "zone3",
  occupancyStatus: "vacant",
  drawingsStatus: "roughPlan",
  layoutType: "lShape",
  kitchenRange: "tradeFitted",
  appliancePackage: "standard",
  worktopType: "quartz",
  splashbackType: "tiles",
  flooringType: "keepExisting",
  electricalLevel: "lightRefresh",
  plumbingLevel: "retainLayout",
  boilerWork: "none",
  decorationLevel: "makingGood",
  structuralLevel: "none",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Math.round(Number(value) || 0);
}

export class KitchenCostEngine {
  constructor() {
    this.config = KITCHEN_CONFIG;
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

    data.postcode = String(data.postcode || "").trim();
    data.propertyType = data.propertyType || "";
    data.kitchenSize = clamp(Number(data.kitchenSize) || 0, 0, 80);
    data.layoutType = data.layoutType || DEFAULTS.layoutType;
    data.kitchenRange = data.kitchenRange || DEFAULTS.kitchenRange;
    data.appliancePackage = data.appliancePackage || DEFAULTS.appliancePackage;
    data.worktopType = data.worktopType || DEFAULTS.worktopType;
    data.splashbackType = data.splashbackType || DEFAULTS.splashbackType;
    data.flooringType = data.flooringType || DEFAULTS.flooringType;
    data.electricalLevel = data.electricalLevel || DEFAULTS.electricalLevel;
    data.plumbingLevel = data.plumbingLevel || DEFAULTS.plumbingLevel;
    data.boilerWork = data.boilerWork || DEFAULTS.boilerWork;
    data.decorationLevel = data.decorationLevel || DEFAULTS.decorationLevel;
    data.structuralLevel = data.structuralLevel || DEFAULTS.structuralLevel;
    data.openingCount = clamp(Number(data.openingCount) || 0, 0, 4);
    data.includeIsland = Boolean(data.includeIsland);
    data.occupancyStatus = data.occupancyStatus || DEFAULTS.occupancyStatus;
    data.drawingsStatus = data.drawingsStatus || DEFAULTS.drawingsStatus;

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
    if (!data.kitchenSize || data.kitchenSize < 4) {
      throw new Error("Please enter an approximate kitchen size.");
    }
    if (!data.layoutType) {
      throw new Error("Please select a kitchen layout.");
    }
    if (!data.kitchenRange) {
      throw new Error("Please select a kitchen specification level.");
    }

    return data;
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

  getOccupancyMultiplier(occupancyStatus) {
    return this.config.occupancyMultipliers[occupancyStatus] || 1.0;
  }

  getEstimatedRunLength(data) {
    const factor = this.config.layoutRunFactors[data.layoutType] || 0.5;
    const min = this.config.kitchenRunMin[data.layoutType] || 4.5;
    let runLength = Math.max(min, data.kitchenSize * factor);
    if (data.includeIsland) runLength += 2.4;
    return Number(runLength.toFixed(1));
  }

  getWorktopArea(runLength, includeIsland = false) {
    let area = runLength * 0.6;
    if (includeIsland) area += 1.5;
    return Number(area.toFixed(1));
  }

  getSplashbackArea(runLength) {
    return Number((runLength * 0.45).toFixed(1));
  }

  calculateLabourAndIncludedWorks(data, splashbackArea, multipliers) {
    const base =
      this.config.labourPackages.fixed +
      data.kitchenSize * this.config.labourPackages.perM2;

    const includedWorks =
      this.config.includedWorks.minorElectrics +
      this.config.includedWorks.plumbingReconnects +
      this.config.includedWorks.makingGoodDecoration +
      splashbackArea * this.config.includedWorks.tiledSplashbackAllowancePerM2;

    return {
      labour: round(base * multipliers.region * multipliers.property * multipliers.occupancy),
      includedWorks: round(
        includedWorks * multipliers.region * multipliers.property * multipliers.occupancy,
      ),
    };
  }

  calculateCabinetry(data, runLength, multipliers) {
    const rate = this.config.cabinetrySupplyRatesPerLm[data.kitchenRange] || 620;
    return {
      runLength,
      rate,
      total: round(runLength * rate * multipliers.region * multipliers.property),
    };
  }

  calculateAppliances(data, multipliers) {
    const allowance =
      this.config.appliancePackages[data.appliancePackage] || 0;
    return round(allowance * multipliers.region);
  }

  calculateWorktops(data, worktopArea, multipliers) {
    const rate = this.config.worktopRatesPerM2[data.worktopType] || 450;
    return {
      worktopArea,
      rate,
      total: round(worktopArea * rate * multipliers.region * multipliers.property),
    };
  }

  calculateSplashback(data, splashbackArea, multipliers) {
    const rate =
      this.config.splashbackUpgradeRatesPerM2[data.splashbackType] || 0;
    return {
      splashbackArea,
      rate,
      total: round(splashbackArea * rate * multipliers.region * multipliers.property),
    };
  }

  calculateFlooring(data, multipliers) {
    const rate = this.config.flooringRatesPerM2[data.flooringType] || 0;
    return {
      rate,
      total: round(data.kitchenSize * rate * multipliers.region * multipliers.finish),
    };
  }

  calculatePackages(data, multipliers) {
    const electrical =
      this.config.electricalUpgradePackages[data.electricalLevel] || 0;
    const plumbing = this.config.plumbingUpgradePackages[data.plumbingLevel] || 0;
    const boiler = this.config.boilerPackages[data.boilerWork] || 0;
    const decoration =
      this.config.decorationUpgradePackages[data.decorationLevel] || 0;
    const structuralRate =
      this.config.structuralPackages[data.structuralLevel] || 0;
    const structural =
      data.structuralLevel === "none" || data.openingCount < 1
        ? 0
        : structuralRate * data.openingCount;

    return {
      electrical: round(electrical * multipliers.region * multipliers.occupancy),
      plumbing: round(plumbing * multipliers.region * multipliers.property),
      boiler: round(boiler * multipliers.region),
      decoration: round(decoration * multipliers.region),
      structural: round(structural * multipliers.region * multipliers.property),
    };
  }

  calculateFees(data) {
    const lineItems = [];

    if (data.structuralLevel === "loadBearing" && data.openingCount > 0) {
      lineItems.push({
        id: "structuralEngineer",
        name: "Structural engineer",
        category: "professional",
        cost: this.config.structuralFees.structuralEngineer,
      });
      lineItems.push({
        id: "buildingControl",
        name: "Building control allowance",
        category: "statutory",
        cost: this.config.structuralFees.buildingControl,
      });

      if (data.propertyType === "terraced" || data.propertyType === "semiDetached") {
        lineItems.push({
          id: "partyWallAllowance",
          name: "Party wall allowance",
          category: "professional",
          cost: this.config.structuralFees.partyWallAllowance,
        });
      }
    }

    return {
      lineItems,
      total: lineItems.reduce((sum, item) => sum + item.cost, 0),
      professionalFees: lineItems
        .filter((item) => item.category === "professional")
        .reduce((sum, item) => sum + item.cost, 0),
      statutoryFees: lineItems
        .filter((item) => item.category === "statutory")
        .reduce((sum, item) => sum + item.cost, 0),
      autoIncluded: lineItems.length > 0,
    };
  }

  calculateContingency(subtotalBeforeContingency, data) {
    let rate =
      this.config.contingencyRates[data.kitchenRange] ||
      this.config.contingencyRates.tradeFitted;

    if (data.structuralLevel === "loadBearing") rate += 0.02;
    if (data.boilerWork === "relocate") rate += 0.01;
    if (data.drawingsStatus === "noPlansYet") rate += 0.01;

    rate = clamp(rate, 0.08, 0.16);
    return {
      rate,
      amount: round(subtotalBeforeContingency * rate),
    };
  }

  getRangeFactors(data) {
    const modifier =
      this.config.confidenceModifiers[data.drawingsStatus] ||
      this.config.confidenceModifiers.roughPlan;

    const lowFactor = clamp(0.93 / modifier, 0.82, 0.96);
    const highFactor = clamp(1.1 * modifier, 1.08, 1.28);

    let rawConfidence = 90 - Math.round((modifier - 1) * 100);
    if (data.structuralLevel === "loadBearing") rawConfidence -= 7;
    if (data.kitchenRange === "bespoke") rawConfidence -= 4;
    if (data.occupancyStatus === "occupied") rawConfidence -= 3;

    return {
      lowFactor,
      highFactor,
      confidenceScore: clamp(rawConfidence, 54, 94),
    };
  }

  getEstimatedTimeline(data) {
    let preMin = 1;
    let preMax = 2;
    let buildMin = 2;
    let buildMax = 4;

    if (data.kitchenRange === "premium") {
      buildMin += 1;
      buildMax += 1;
    }
    if (data.kitchenRange === "bespoke") {
      preMin += 2;
      preMax += 4;
      buildMin += 2;
      buildMax += 3;
    }
    if (data.structuralLevel !== "none") {
      preMin += 1;
      preMax += 2;
      buildMin += 1;
      buildMax += 2;
    }
    if (data.boilerWork === "relocate" || data.electricalLevel === "fullKitchenRewire") {
      buildMin += 1;
      buildMax += 1;
    }

    if (data.kitchenSize >= 20) {
      buildMin += 1;
      buildMax += 2;
    }

    return {
      planning: { min: preMin, max: preMax },
      build: { min: buildMin, max: buildMax },
      total: { min: preMin + buildMin, max: preMax + buildMax },
    };
  }

  calculateTotalCost(projectData) {
    const data = this.validateProjectData(projectData);

    const multipliers = {
      region: this.getRegionMultiplier(data.region, data.londonZone),
      property: this.getPropertyMultiplier(data.propertyType),
      occupancy: this.getOccupancyMultiplier(data.occupancyStatus),
      finish: data.kitchenRange === "flatPack" ? 0.95 : data.kitchenRange === "bespoke" ? 1.12 : 1,
    };

    const runLength = this.getEstimatedRunLength(data);
    const worktopArea = this.getWorktopArea(runLength, data.includeIsland);
    const splashbackArea = this.getSplashbackArea(runLength);

    const labourAndIncludedWorks = this.calculateLabourAndIncludedWorks(
      data,
      splashbackArea,
      multipliers,
    );
    const cabinetry = this.calculateCabinetry(data, runLength, multipliers);
    const appliances = this.calculateAppliances(data, multipliers);
    const worktops = this.calculateWorktops(data, worktopArea, multipliers);
    const splashback = this.calculateSplashback(data, splashbackArea, multipliers);
    const flooring = this.calculateFlooring(data, multipliers);
    const packages = this.calculatePackages(data, multipliers);
    const fees = this.calculateFees(data);

    const subtotalBeforeContingency = round(
      labourAndIncludedWorks.labour +
        labourAndIncludedWorks.includedWorks +
        cabinetry.total +
        appliances +
        worktops.total +
        splashback.total +
        flooring.total +
        packages.electrical +
        packages.plumbing +
        packages.boiler +
        packages.decoration +
        packages.structural +
        fees.total,
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

    const timeline = this.getEstimatedTimeline(data);

    return {
      assumptions: {
        calculatorVersion: this.config.version,
        vatAppliedToFullSubtotal: true,
        autoIncludedFees: fees.autoIncluded,
      },
      inputs: data,
      breakdown: {
        runLength,
        worktopArea,
        splashbackArea,
        multipliers,
        labour: labourAndIncludedWorks.labour,
        includedWorks: labourAndIncludedWorks.includedWorks,
        coreInstallation: round(
          labourAndIncludedWorks.labour + labourAndIncludedWorks.includedWorks,
        ),
        cabinetry: cabinetry.total,
        cabinetryRate: cabinetry.rate,
        appliances,
        worktops: worktops.total,
        worktopRate: worktops.rate,
        splashback: splashback.total,
        splashbackRate: splashback.rate,
        flooring: flooring.total,
        flooringRate: flooring.rate,
        electrical: packages.electrical,
        plumbing: packages.plumbing,
        boiler: packages.boiler,
        decoration: packages.decoration,
        structural: packages.structural,
        professionalFees: fees.professionalFees,
        statutoryFees: fees.statutoryFees,
        feeLineItems: fees.lineItems,
        subtotalBeforeContingency,
        contingencyRate: contingency.rate,
        contingency: contingency.amount,
        subtotalExVat,
        vatRate: this.config.vatRate,
        vat,
        total,
        supplyTotal: round(
          cabinetry.total +
            appliances +
            worktops.total +
            splashback.total +
            flooring.total,
        ),
        labourTotal: round(
          labourAndIncludedWorks.labour +
            labourAndIncludedWorks.includedWorks +
            packages.electrical +
            packages.plumbing +
            packages.boiler +
            packages.decoration +
            packages.structural,
        ),
      },
      ranges,
      total,
      costPerSqm: data.kitchenSize > 0 ? round(total / data.kitchenSize) : 0,
      rangePerSqm: {
        low: data.kitchenSize > 0 ? round(ranges.low / data.kitchenSize) : 0,
        expected: data.kitchenSize > 0 ? round(ranges.expected / data.kitchenSize) : 0,
        high: data.kitchenSize > 0 ? round(ranges.high / data.kitchenSize) : 0,
      },
      confidenceScore,
      timeline,
      serviceArea: {
        isLondon: data.region === "london",
        isPrimaryServiceArea: data.region === "london",
      },
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

export const costEngine = new KitchenCostEngine();

export function calculateTotalCost(formData) {
  return costEngine.calculateTotalCost(formData);
}
