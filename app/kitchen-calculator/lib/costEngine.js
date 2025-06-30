// Kitchen cost calculation engine

export function calculateTotalCost(formData) {
  const size = Number(formData.kitchenSize) || 0;
  let baseCostPerSqm = 0;
  switch (formData.kitchenType) {
    case "prebuilt":
      baseCostPerSqm = 1200;
      break;
    case "flatpack":
      baseCostPerSqm = 1000;
      break;
    case "custom":
      baseCostPerSqm = 2000;
      break;
    default:
      baseCostPerSqm = 1200;
  }
  const baseCost = size * baseCostPerSqm;

  // Worktop
  let worktopCostPerSqm = 120;
  switch (formData.worktopType) {
    case "stone":
      worktopCostPerSqm = 250;
      break;
    case "marble":
      worktopCostPerSqm = 300;
      break;
    case "wood":
      worktopCostPerSqm = 150;
      break;
    case "mdf":
      worktopCostPerSqm = 100;
      break;
    case "other":
      worktopCostPerSqm = 120;
      break;
    default:
      worktopCostPerSqm = 120;
  }
  // Assume 3 sqm of worktop as a typical value
  const worktopArea = 3;
  const worktopCost = worktopArea * worktopCostPerSqm;

  // Splashback
  let splashbackCostPerSqm = 100;
  switch (formData.splashbackType) {
    case "tiles":
      splashbackCostPerSqm = 80;
      break;
    case "glass":
      splashbackCostPerSqm = 200;
      break;
    case "metal":
      splashbackCostPerSqm = 180;
      break;
    case "other":
      splashbackCostPerSqm = 100;
      break;
    default:
      splashbackCostPerSqm = 100;
  }
  // Assume 3 sqm of splashback as a typical value
  const splashbackArea = 3;
  const splashbackCost = splashbackArea * splashbackCostPerSqm;

  // Flooring
  let flooringCostPerSqm = 40;
  switch (formData.flooringType) {
    case "wood":
      flooringCostPerSqm = 80;
      break;
    case "tiles":
      flooringCostPerSqm = 60;
      break;
    case "lvt":
      flooringCostPerSqm = 50;
      break;
    case "other":
      flooringCostPerSqm = 40;
      break;
    default:
      flooringCostPerSqm = 40;
  }
  const flooringCost = size * flooringCostPerSqm;

  // Electrics & Plumbing
  const rewireCost = formData.rewire === true ? 2500 : 0;
  const boilerRelocationCost = formData.relocateBoiler === true ? 1400 : 0;

  // Subtotal (base construction cost)
  const adjustedCost =
    baseCost +
    worktopCost +
    splashbackCost +
    rewireCost +
    boilerRelocationCost +
    flooringCost;

  // Contingency (10% of base construction)
  const contingency = adjustedCost * 0.1;

  // Subtotal including contingency
  const subtotal = adjustedCost + contingency;

  // VAT
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  // Cost per square metre
  const costPerSqm = size > 0 ? Math.round(total / size) : 0;

  const breakdown = {
    adjustedCost: Math.round(adjustedCost),
    worktopCost: Math.round(worktopCost),
    splashbackCost: Math.round(splashbackCost),
    flooringCost: Math.round(flooringCost),
    rewireCost: Math.round(rewireCost),
    boilerRelocationCost: Math.round(boilerRelocationCost),
    contingency: Math.round(contingency),
    vat: Math.round(vat),
    subtotal: Math.round(subtotal),
    total: Math.round(total),
  };

  return {
    total: Math.round(total),
    costPerSqm,
    breakdown,
  };
}
