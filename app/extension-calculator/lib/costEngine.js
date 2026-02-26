import { EXTENSION_CONFIG } from "./config.js";

const DEFAULTS = {
  region: "london",
  londonZone: "zone3",
  complexity: "moderate",
  finishLevel: "standard",
  siteAccess: "standard",
  glazingLevel: "standard",
  drawingsStatus: "noPlansYet",
  planningStatus: "unknown",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(n) {
  return Math.round(Number(n) || 0);
}

export class ExtensionCostEngine {
  constructor() {
    this.config = EXTENSION_CONFIG;
  }

  normalizeProjectData(projectData = {}) {
    const normalized = { ...projectData };

    // Backward compatibility: old UI stores London zone in "location"
    if (!normalized.region && normalized.location) {
      if (String(normalized.location).startsWith("zone")) {
        normalized.region = "london";
        normalized.londonZone = normalized.location;
      } else {
        normalized.region = normalized.location;
      }
    }

    normalized.region = normalized.region || DEFAULTS.region;
    normalized.londonZone =
      normalized.region === "london"
        ? normalized.londonZone || DEFAULTS.londonZone
        : null;
    normalized.complexity = normalized.complexity || DEFAULTS.complexity;
    normalized.finishLevel = normalized.finishLevel || DEFAULTS.finishLevel;
    normalized.siteAccess = normalized.siteAccess || DEFAULTS.siteAccess;
    normalized.glazingLevel = normalized.glazingLevel || DEFAULTS.glazingLevel;
    normalized.drawingsStatus =
      normalized.drawingsStatus || DEFAULTS.drawingsStatus;
    normalized.planningStatus =
      normalized.planningStatus || DEFAULTS.planningStatus;
    normalized.propertyType = normalized.propertyType || "semiDetached";
    normalized.size = clamp(Number(normalized.size) || 0, 0, 200);
    normalized.additionalFeatures = this.normalizeFeatureSelections(
      normalized.additionalFeatures || [],
      normalized.size,
    );
    normalized.planningServices = this.normalizePlanningServices(
      normalized.planningServices || [],
    );

    return normalized;
  }

  validateProjectData(projectData) {
    const data = this.normalizeProjectData(projectData);
    if (!data.extensionType || !this.config.baseBuildRates[data.extensionType]) {
      throw new Error("Please select a valid extension type.");
    }
    if (!data.size || data.size < 1) {
      throw new Error("Please enter a valid extension size.");
    }
    return data;
  }

  calculateBaseBuildCost(extensionType, size) {
    const baseRate = this.config.baseBuildRates[extensionType];
    if (!baseRate) {
      throw new Error(`Invalid extension type: ${extensionType}`);
    }
    return baseRate * size;
  }

  getSizeMultiplier(size) {
    for (const band of Object.values(this.config.sizeMultipliers)) {
      if (size >= band.min && size <= band.max) {
        return band.multiplier;
      }
    }
    return 1.0;
  }

  getRegionMultiplier(region, londonZone = null) {
    const regionMultiplier = this.config.regionMultipliers[region] || 1.0;
    if (region !== "london") return regionMultiplier;
    const zoneMultiplier =
      this.config.londonZoneMultipliers[londonZone || DEFAULTS.londonZone] ||
      1.0;
    return regionMultiplier * zoneMultiplier;
  }

  getPropertyMultiplier(propertyType) {
    return this.config.propertyMultipliers[propertyType] || 1.0;
  }

  getComplexityMultiplier(complexity) {
    return this.config.complexityMultipliers[complexity] || 1.0;
  }

  getFinishLevelMultiplier(finishLevel) {
    return this.config.finishLevelMultipliers[finishLevel] || 1.0;
  }

  getSiteAccessMultiplier(siteAccess) {
    return this.config.siteAccessMultipliers[siteAccess] || 1.0;
  }

  getGlazingMultiplier(glazingLevel) {
    return this.config.glazingLevelMultipliers[glazingLevel] || 1.0;
  }

  normalizeFeatureSelections(selectedFeatures, projectSize = 0) {
    if (!Array.isArray(selectedFeatures)) return [];

    return selectedFeatures
      .map((raw) => {
        if (!raw) return null;

        // Backward compatibility: legacy array of strings
        if (typeof raw === "string") {
          const featureConfig = this.config.additionalFeatures[raw];
          if (!featureConfig) return null;
          return {
            id: raw,
            quantity:
              featureConfig.unit === "per_m2"
                ? clamp(projectSize || featureConfig.defaultQuantity, 1, featureConfig.maxQuantity || 200)
                : featureConfig.defaultQuantity || 1,
          };
        }

        const id = raw.id;
        const featureConfig = this.config.additionalFeatures[id];
        if (!id || !featureConfig) return null;

        const min = featureConfig.minQuantity || 1;
        const max = featureConfig.maxQuantity || 999;
        const quantity = clamp(Number(raw.quantity) || featureConfig.defaultQuantity || 1, min, max);
        return { id, quantity };
      })
      .filter(Boolean);
  }

  normalizePlanningServices(planningServices) {
    if (!Array.isArray(planningServices)) return [];
    const validIds = new Set(Object.keys(this.config.planningServices));
    return [...new Set(planningServices.filter((id) => validIds.has(id)))];
  }

  getRecommendedPlanningServices(data) {
    const services = new Set(this.config.recommendedFeeBundles.base);

    if (data.planningStatus === "planningRequired" || data.planningStatus === "unknown") {
      this.config.recommendedFeeBundles.withPlanning.forEach((id) =>
        services.add(id),
      );
    }

    if (data.drawingsStatus === "noPlansYet" || data.drawingsStatus === "roughIdeas") {
      this.config.recommendedFeeBundles.withArchitect.forEach((id) =>
        services.add(id),
      );
    }

    if (data.drawingsStatus === "architectPlans") {
      services.delete("architectConcept");
    }

    if (
      data.propertyType === "terraced" ||
      data.propertyType === "semiDetached" ||
      data.propertyType === "maisonette"
    ) {
      // Not always required, but useful as a budgeting allowance.
      services.add("partyWallSurveyor");
    }

    return [...services];
  }

  calculateAdditionalFeaturesCost(selectedFeatures) {
    const lineItems = [];
    let total = 0;

    for (const selected of selectedFeatures) {
      const feature = this.config.additionalFeatures[selected.id];
      if (!feature) continue;

      const quantity =
        feature.unit === "fixed" ? 1 : clamp(Number(selected.quantity) || 1, 1, 999);
      const lineTotal = feature.unitCost * quantity;
      total += lineTotal;

      lineItems.push({
        id: selected.id,
        name: feature.name,
        unit: feature.unit,
        unitLabel: feature.unitLabel,
        unitCost: round(feature.unitCost),
        quantity,
        total: round(lineTotal),
        description: feature.description,
      });
    }

    return { total: round(total), lineItems };
  }

  calculatePlanningCosts(selectedServices, data) {
    const explicitSelected = this.normalizePlanningServices(selectedServices);
    const effectiveServices =
      explicitSelected.length > 0
        ? explicitSelected
        : this.getRecommendedPlanningServices(data);

    const lineItems = [];
    let professionalFees = 0;
    let statutoryFees = 0;

    for (const id of effectiveServices) {
      const service = this.config.planningServices[id];
      if (!service) continue;
      if (service.category === "statutory") {
        statutoryFees += service.cost;
      } else {
        professionalFees += service.cost;
      }
      lineItems.push({
        id,
        cost: round(service.cost),
        category: service.category,
        taxable: !!service.taxable,
      });
    }

    return {
      selectedByUser: explicitSelected,
      recommendedOnly: explicitSelected.length === 0,
      effectiveServices,
      lineItems,
      professionalFees: round(professionalFees),
      statutoryFees: round(statutoryFees),
      total: round(professionalFees + statutoryFees),
    };
  }

  calculateContingency(baseAmount, complexity) {
    const rate =
      this.config.contingencyRates[complexity] !== undefined
        ? this.config.contingencyRates[complexity]
        : this.config.contingencyRates.moderate;
    return { rate, amount: round(baseAmount * rate) };
  }

  getRangeFactors(data) {
    const drawingsFactor =
      this.config.confidenceModifiers.drawingsStatus[data.drawingsStatus] || 1.08;
    const planningFactor =
      this.config.confidenceModifiers.planningStatus[data.planningStatus] || 1.05;
    const complexityFactor =
      data.complexity === "veryComplex"
        ? 1.05
        : data.complexity === "complex"
          ? 1.03
          : 1.0;

    const spreadWidening = drawingsFactor * planningFactor * complexityFactor;
    const lowFactor = clamp(0.93 - (spreadWidening - 1) * 0.12, 0.82, 0.93);
    const highFactor = clamp(1.09 + (spreadWidening - 1) * 0.45, 1.09, 1.28);

    const rawConfidence = 100 - Math.round((spreadWidening - 1) * 140);
    const confidenceScore = clamp(rawConfidence, 55, 95);

    return {
      lowFactor,
      highFactor,
      confidenceScore,
      spreadWidening,
    };
  }

  getEstimatedTimeline(extensionType, size, complexity) {
    const baseBuildWeeks = {
      singleStorey: 10,
      doubleStorey: 16,
      basement: 24,
      loft: 12,
    };

    const complexityMultiplier = {
      simple: 0.9,
      moderate: 1.0,
      complex: 1.15,
      veryComplex: 1.3,
    }[complexity || DEFAULTS.complexity] || 1.0;

    const sizeMultiplier = size > 80 ? 1.18 : size > 40 ? 1.08 : 1.0;
    const buildWeeks = Math.round(
      (baseBuildWeeks[extensionType] || 10) * complexityMultiplier * sizeMultiplier,
    );

    const planningWeeks =
      extensionType === "basement"
        ? { min: 10, max: 20 }
        : extensionType === "loft"
          ? { min: 6, max: 14 }
          : { min: 6, max: 16 };

    return {
      planning: planningWeeks,
      build: { min: Math.max(6, buildWeeks - 2), max: buildWeeks + 4 },
      total: {
        min: planningWeeks.min + Math.max(6, buildWeeks - 2),
        max: planningWeeks.max + buildWeeks + 4,
      },
    };
  }

  calculateTotalCost(projectData) {
    const data = this.validateProjectData(projectData);

    const baseBuild = this.calculateBaseBuildCost(data.extensionType, data.size);
    const multipliers = {
      size: this.getSizeMultiplier(data.size),
      region: this.getRegionMultiplier(data.region, data.londonZone),
      property: this.getPropertyMultiplier(data.propertyType),
      complexity: this.getComplexityMultiplier(data.complexity),
      finishLevel: this.getFinishLevelMultiplier(data.finishLevel),
      siteAccess: this.getSiteAccessMultiplier(data.siteAccess),
      glazing: this.getGlazingMultiplier(data.glazingLevel),
    };

    const adjustedBuild = round(
      baseBuild *
        multipliers.size *
        multipliers.region *
        multipliers.property *
        multipliers.complexity *
        multipliers.finishLevel *
        multipliers.siteAccess *
        multipliers.glazing,
    );

    const extras = this.calculateAdditionalFeaturesCost(data.additionalFeatures);
    const planning = this.calculatePlanningCosts(data.planningServices, data);

    const subtotalBeforeContingency = round(
      adjustedBuild + extras.total + planning.total,
    );

    const contingency = this.calculateContingency(
      adjustedBuild + extras.total,
      data.complexity,
    );

    const subtotalExVat = round(subtotalBeforeContingency + contingency.amount);
    const vat = round(subtotalExVat * this.config.vatRate);
    const total = round(subtotalExVat + vat);

    const { lowFactor, highFactor, confidenceScore } = this.getRangeFactors(data);
    const low = round(total * lowFactor);
    const high = round(total * highFactor);
    const expected = total;

    const timeline = this.getEstimatedTimeline(
      data.extensionType,
      data.size,
      data.complexity,
    );

    return {
      assumptions: {
        calculatorVersion: this.config.version,
        vatAppliedToFullSubtotal: true,
        recommendedPlanningFeesAutoIncluded: planning.recommendedOnly,
      },
      inputs: data,
      breakdown: {
        baseBuild: round(baseBuild),
        multipliers,
        adjustedBuild,
        extras: extras.total,
        extrasLineItems: extras.lineItems,
        professionalFees: planning.professionalFees,
        statutoryFees: planning.statutoryFees,
        planningFeesTotal: planning.total,
        planningLineItems: planning.lineItems,
        planningServicesUsed: planning.effectiveServices,
        planningServicesUserSelected: planning.selectedByUser,
        subtotalBeforeContingency,
        contingencyRate: contingency.rate,
        contingency: contingency.amount,
        subtotalExVat,
        vatRate: this.config.vatRate,
        vat,
        total,
      },
      ranges: {
        low,
        expected,
        high,
      },
      total,
      costPerSqm: round(total / data.size),
      rangePerSqm: {
        low: round(low / data.size),
        expected: round(expected / data.size),
        high: round(high / data.size),
      },
      confidenceScore,
      timeline,
      serviceArea: {
        isLondon: data.region === "london",
        isPrimaryServiceArea: data.region === "london",
      },
    };
  }

  getCostRange(extensionType, size) {
    const result = this.calculateTotalCost({
      extensionType,
      size,
      propertyType: "semiDetached",
      region: "london",
      londonZone: "zone3",
      complexity: "moderate",
      finishLevel: "standard",
      siteAccess: "standard",
      glazingLevel: "standard",
      drawingsStatus: "roughIdeas",
      planningStatus: "unknown",
      additionalFeatures: [],
      planningServices: [],
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
    }).format(amount);
  }
}

export const costEngine = new ExtensionCostEngine();
