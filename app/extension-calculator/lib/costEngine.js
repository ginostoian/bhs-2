import { EXTENSION_CONFIG } from "./config.js";

export class ExtensionCostEngine {
  constructor() {
    this.config = EXTENSION_CONFIG;
  }

  // Calculate base cost for extension
  calculateBaseCost(extensionType, size) {
    const baseCostPerSqm = this.config.baseCosts[extensionType];
    if (!baseCostPerSqm) {
      throw new Error(`Invalid extension type: ${extensionType}`);
    }
    return baseCostPerSqm * size;
  }

  // Apply size multiplier
  getSizeMultiplier(size) {
    for (const [sizeCategory, config] of Object.entries(
      this.config.sizeMultipliers,
    )) {
      if (size >= config.min && size <= config.max) {
        return config.multiplier;
      }
    }
    // Default to medium size multiplier if size is out of range
    return this.config.sizeMultipliers.medium.multiplier;
  }

  // Calculate location multiplier
  getLocationMultiplier(location) {
    return this.config.locationMultipliers[location] || 1.0;
  }

  // Calculate property type multiplier
  getPropertyMultiplier(propertyType) {
    return this.config.propertyMultipliers[propertyType] || 1.0;
  }

  // Calculate complexity multiplier
  getComplexityMultiplier(complexity) {
    return this.config.complexityMultipliers[complexity] || 1.0;
  }

  // Calculate additional features cost
  calculateAdditionalFeaturesCost(selectedFeatures) {
    let total = 0;
    for (const feature of selectedFeatures) {
      const cost = this.config.additionalFeatures[feature];
      if (cost) {
        total += cost;
      }
    }
    return total;
  }

  // Calculate planning and legal costs
  calculatePlanningCosts(requiredServices) {
    let total = 0;
    for (const service of requiredServices) {
      const cost = this.config.planningCosts[service];
      if (cost) {
        total += cost;
      }
    }
    return total;
  }

  // Calculate contingency based on complexity
  calculateContingency(baseCost, complexity) {
    const contingencyRate =
      this.config.contingency[complexity] || this.config.contingency.standard;
    return baseCost * contingencyRate;
  }

  // Main calculation method
  calculateTotalCost(projectData) {
    const {
      extensionType,
      size,
      propertyType,
      location,
      complexity,
      additionalFeatures = [],
      planningServices = [],
    } = projectData;

    // Calculate base cost
    let baseCost = this.calculateBaseCost(extensionType, size);

    // Apply multipliers
    const sizeMultiplier = this.getSizeMultiplier(size);
    const locationMultiplier = this.getLocationMultiplier(location);
    const propertyMultiplier = this.getPropertyMultiplier(propertyType);
    const complexityMultiplier = this.getComplexityMultiplier(complexity);

    // Apply all multipliers to base cost
    let adjustedCost =
      baseCost *
      sizeMultiplier *
      locationMultiplier *
      propertyMultiplier *
      complexityMultiplier;

    // Add additional features
    const featuresCost =
      this.calculateAdditionalFeaturesCost(additionalFeatures);
    adjustedCost += featuresCost;

    // Add planning and legal costs
    const planningCost = this.calculatePlanningCosts(planningServices);
    adjustedCost += planningCost;

    // Calculate contingency
    const contingency = this.calculateContingency(adjustedCost, complexity);

    // Calculate VAT (20%)
    const vat = adjustedCost * 0.2;

    // Total cost
    const totalCost = adjustedCost + contingency + vat;

    return {
      breakdown: {
        baseCost: Math.round(baseCost),
        sizeMultiplier: sizeMultiplier,
        locationMultiplier: locationMultiplier,
        propertyMultiplier: propertyMultiplier,
        complexityMultiplier: complexityMultiplier,
        adjustedCost: Math.round(adjustedCost),
        featuresCost: Math.round(featuresCost),
        planningCost: Math.round(planningCost),
        contingency: Math.round(contingency),
        vat: Math.round(vat),
      },
      total: Math.round(totalCost),
      costPerSqm: Math.round(totalCost / size),
    };
  }

  // Get cost range for a given extension type and size
  getCostRange(extensionType, size) {
    const baseCost = this.calculateBaseCost(extensionType, size);

    // Calculate minimum cost (simple, zone 5, terraced)
    const minCost = this.calculateTotalCost({
      extensionType,
      size,
      propertyType: "terraced",
      location: "zone5",
      complexity: "simple",
      additionalFeatures: [],
      planningServices: [],
    });

    // Calculate maximum cost (very complex, zone 1, flat with features)
    const maxCost = this.calculateTotalCost({
      extensionType,
      size,
      propertyType: "flat",
      location: "zone1",
      complexity: "veryComplex",
      additionalFeatures: [
        "steelBeam",
        "biFoldDoors",
        "underfloorHeating",
        "highEndKitchen",
      ],
      planningServices: [
        "planningPermission",
        "buildingRegulations",
        "partyWallAgreement",
        "architect",
      ],
    });

    return {
      min: Math.round(minCost.total),
      max: Math.round(maxCost.total),
      average: Math.round((minCost.total + maxCost.total) / 2),
    };
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Get estimated timeline
  getEstimatedTimeline(extensionType, size, complexity) {
    const baseWeeks = {
      singleStorey: 8,
      doubleStorey: 12,
      basement: 16,
      loft: 10,
    };

    const complexityMultipliers = {
      simple: 1.0,
      moderate: 1.2,
      complex: 1.5,
      veryComplex: 2.0,
    };

    const baseTimeline = baseWeeks[extensionType] || 8;
    const complexityMultiplier = complexityMultipliers[complexity] || 1.0;
    const sizeMultiplier = size > 50 ? 1.3 : size > 30 ? 1.1 : 1.0;

    return Math.round(baseTimeline * complexityMultiplier * sizeMultiplier);
  }
}

// Export a default instance
export const costEngine = new ExtensionCostEngine();
