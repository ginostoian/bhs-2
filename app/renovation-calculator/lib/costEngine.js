import { RENOVATION_CONFIG } from "./config.js";

export class RenovationCostEngine {
  constructor() {
    this.config = RENOVATION_CONFIG;
  }

  // Calculate base cost for renovation based on rooms being renovated
  calculateBaseCost(formData) {
    let baseCost = 0;

    // Calculate costs for each room type being renovated
    if (formData.renovateBathrooms) {
      baseCost += this.config.baseCosts.bathroom * formData.bathrooms;
    }

    if (formData.renovateKitchen) {
      baseCost += this.config.baseCosts.kitchen * formData.kitchens;
    }

    if (formData.renovateBedrooms) {
      baseCost += this.config.baseCosts.bedroom * formData.bedrooms;
    }

    // Add living room and hallway costs (assume 1 each)
    baseCost += this.config.baseCosts.livingRoom;
    baseCost += this.config.baseCosts.hallway;

    return baseCost;
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

  // Calculate house type multiplier
  getHouseTypeMultiplier(houseType) {
    return this.config.houseTypeMultipliers[houseType] || 1.0;
  }

  // Calculate floor multiplier (for flats)
  getFloorMultiplier(floor) {
    return this.config.floorMultipliers[floor] || 1.0;
  }

  // Calculate wallpaper removal cost
  calculateWallpaperRemovalCost(formData) {
    if (!formData.wallpapered) return 0;

    // Assume 70% of house size is wallpapered
    const wallpaperedArea = formData.houseSize * 0.7;
    return wallpaperedArea * this.config.wallpaperRemoval.perSqm;
  }

  // Calculate structural work costs
  calculateStructuralWorkCost(formData) {
    let cost = 0;

    if (formData.removeWalls) {
      // Assume 2 walls per room being renovated
      const roomsBeingRenovated = [
        formData.renovateBathrooms ? formData.bathrooms : 0,
        formData.renovateKitchen ? formData.kitchens : 0,
        formData.renovateBedrooms ? formData.bedrooms : 0,
      ].reduce((sum, count) => sum + count, 0);

      const totalWalls = roomsBeingRenovated * 2;
      cost += totalWalls * this.config.structuralWork.wallRemoval;

      if (formData.structuralWalls) {
        // Assume 30% of walls are structural
        const structuralWalls = Math.ceil(totalWalls * 0.3);
        cost +=
          structuralWalls * this.config.structuralWork.structuralWallRemoval;
        cost += structuralWalls * this.config.structuralWork.steelBeam;
      }
    }

    return cost;
  }

  // Calculate electrical work costs
  calculateElectricalWorkCost(formData) {
    if (!formData.rewire) return 0;

    let cost = formData.houseSize * this.config.electricalWork.rewire;
    cost += this.config.electricalWork.newConsumerUnit;

    // Add additional sockets and lighting
    const additionalSockets = Math.ceil(formData.houseSize / 10); // 1 socket per 10 sqm
    const lights = Math.ceil(formData.houseSize / 15); // 1 light per 15 sqm

    cost += additionalSockets * this.config.electricalWork.additionalSockets;
    cost += lights * this.config.electricalWork.lighting;

    return cost;
  }

  // Calculate heating work costs
  calculateHeatingWorkCost(formData) {
    if (!formData.replaceHeating) return 0;

    let cost = this.config.heatingWork.newBoiler;

    // Add radiators (assume 1 radiator per 20 sqm)
    const radiators = Math.ceil(formData.houseSize / 20);
    cost += radiators * this.config.heatingWork.radiators;

    return cost;
  }

  // Calculate wall and ceiling work costs
  calculateWallCeilingWorkCost(formData) {
    let cost = 0;

    if (formData.skimWalls) {
      // Assume 70% of house size is walls
      const wallArea = formData.houseSize * 0.7;
      cost += wallArea * this.config.wallCeilingWork.skimWalls;
    }

    if (formData.skimCeilings) {
      // Ceiling area equals house size
      cost += formData.houseSize * this.config.wallCeilingWork.skimCeilings;
    }

    return cost;
  }

  // Calculate door work costs
  calculateDoorWorkCost(formData) {
    if (!formData.replaceDoors) return 0;

    // Assume 1 door per room plus 2 external doors
    const totalDoors =
      formData.bedrooms + formData.bathrooms + formData.kitchens + 3; // +3 for living, hallway, and external
    const internalDoors = totalDoors - 2; // Subtract external doors

    let cost = internalDoors * this.config.doorWork.internalDoor;
    cost += internalDoors * this.config.doorWork.doorFrame;
    cost += 2 * this.config.doorWork.externalDoor; // 2 external doors

    return cost;
  }

  // Calculate flooring work costs
  calculateFlooringWorkCost(formData) {
    if (!formData.replaceFloors) return 0;

    const floorType = formData.floorType;
    const costPerSqm =
      this.config.flooringWork[floorType] || this.config.flooringWork.woodFloor;

    let cost = formData.houseSize * costPerSqm;
    cost += formData.houseSize * this.config.flooringWork.underlay;

    return cost;
  }

  // Calculate complexity multiplier based on work scope
  getComplexityMultiplier(formData) {
    let complexityScore = 1.0;

    // Add complexity for structural work
    if (formData.removeWalls) complexityScore += 0.1;
    if (formData.structuralWalls) complexityScore += 0.15;

    // Add complexity for major systems
    if (formData.rewire) complexityScore += 0.1;
    if (formData.replaceHeating) complexityScore += 0.1;

    // Add complexity for multiple room renovations
    const roomsBeingRenovated = [
      formData.renovateBathrooms,
      formData.renovateKitchen,
      formData.renovateBedrooms,
    ].filter(Boolean).length;

    if (roomsBeingRenovated >= 3) complexityScore += 0.2;
    else if (roomsBeingRenovated >= 2) complexityScore += 0.1;

    return complexityScore;
  }

  // Calculate contingency based on complexity
  calculateContingency(baseCost, complexity) {
    let contingencyRate = this.config.contingency.standard;

    if (complexity >= 1.3) {
      contingencyRate = this.config.contingency.veryComplex;
    } else if (complexity >= 1.15) {
      contingencyRate = this.config.contingency.complex;
    }

    return baseCost * contingencyRate;
  }

  // Main calculation method
  calculateTotalCost(projectData) {
    const {
      propertyType,
      location,
      houseType,
      floor,
      houseSize,
      bedrooms,
      bathrooms,
      kitchens,
      wallpapered,
      renovateBathrooms,
      renovateKitchen,
      renovateBedrooms,
      removeWalls,
      structuralWalls,
      rewire,
      replaceHeating,
      skimWalls,
      skimCeilings,
      replaceDoors,
      replaceFloors,
      floorType,
    } = projectData;

    // Calculate base cost
    let baseCost = this.calculateBaseCost(projectData);

    // Apply multipliers
    const sizeMultiplier = this.getSizeMultiplier(houseSize);
    const locationMultiplier = this.getLocationMultiplier(location);
    const propertyMultiplier = this.getPropertyMultiplier(propertyType);
    const houseTypeMultiplier = this.getHouseTypeMultiplier(houseType);
    const floorMultiplier =
      propertyType === "flat" ? this.getFloorMultiplier(floor) : 1.0;
    const complexityMultiplier = this.getComplexityMultiplier(projectData);

    // Apply all multipliers to base cost
    let adjustedCost =
      baseCost *
      sizeMultiplier *
      locationMultiplier *
      propertyMultiplier *
      houseTypeMultiplier *
      floorMultiplier *
      complexityMultiplier;

    // Add specific work costs
    const wallpaperCost = this.calculateWallpaperRemovalCost(projectData);
    const structuralCost = this.calculateStructuralWorkCost(projectData);
    const electricalCost = this.calculateElectricalWorkCost(projectData);
    const heatingCost = this.calculateHeatingWorkCost(projectData);
    const wallCeilingCost = this.calculateWallCeilingWorkCost(projectData);
    const doorCost = this.calculateDoorWorkCost(projectData);
    const flooringCost = this.calculateFlooringWorkCost(projectData);

    adjustedCost +=
      wallpaperCost +
      structuralCost +
      electricalCost +
      heatingCost +
      wallCeilingCost +
      doorCost +
      flooringCost;

    // Calculate contingency
    const contingency = this.calculateContingency(
      adjustedCost,
      complexityMultiplier,
    );

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
        houseTypeMultiplier: houseTypeMultiplier,
        floorMultiplier: floorMultiplier,
        complexityMultiplier: complexityMultiplier,
        adjustedCost: Math.round(adjustedCost),
        wallpaperCost: Math.round(wallpaperCost),
        structuralCost: Math.round(structuralCost),
        electricalCost: Math.round(electricalCost),
        heatingCost: Math.round(heatingCost),
        wallCeilingCost: Math.round(wallCeilingCost),
        doorCost: Math.round(doorCost),
        flooringCost: Math.round(flooringCost),
        contingency: Math.round(contingency),
        vat: Math.round(vat),
      },
      total: Math.round(totalCost),
      costPerSqm: Math.round(totalCost / houseSize),
    };
  }

  // Get cost range for a given renovation scope
  getCostRange(houseSize, bedrooms, bathrooms, kitchens) {
    // Calculate minimum cost (simple renovation, zone 5, terraced)
    const minCost = this.calculateTotalCost({
      propertyType: "terraced",
      location: "zone5",
      houseType: "modern",
      floor: "ground",
      houseSize,
      bedrooms,
      bathrooms,
      kitchens,
      wallpapered: false,
      renovateBathrooms: true,
      renovateKitchen: true,
      renovateBedrooms: false,
      removeWalls: false,
      structuralWalls: false,
      rewire: false,
      replaceHeating: false,
      skimWalls: false,
      skimCeilings: false,
      replaceDoors: false,
      replaceFloors: false,
      floorType: "",
    });

    // Calculate maximum cost (complex renovation, zone 1, flat with all features)
    const maxCost = this.calculateTotalCost({
      propertyType: "flat",
      location: "zone1",
      houseType: "victorian",
      floor: "third",
      houseSize,
      bedrooms,
      bathrooms,
      kitchens,
      wallpapered: true,
      renovateBathrooms: true,
      renovateKitchen: true,
      renovateBedrooms: true,
      removeWalls: true,
      structuralWalls: true,
      rewire: true,
      replaceHeating: true,
      skimWalls: true,
      skimCeilings: true,
      replaceDoors: true,
      replaceFloors: true,
      floorType: "wood",
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
  getEstimatedTimeline(houseSize, complexity) {
    const baseWeeks = Math.ceil(houseSize / 20); // 1 week per 20 sqm
    const complexityWeeks = Math.ceil(baseWeeks * complexity);

    return {
      min: Math.max(2, Math.ceil(complexityWeeks * 0.8)),
      max: Math.ceil(complexityWeeks * 1.2),
      average: complexityWeeks,
    };
  }
}

export const costEngine = new RenovationCostEngine();
