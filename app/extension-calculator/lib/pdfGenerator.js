import { jsPDF } from "jspdf";

// Initialize autoTable plugin
let autoTableLoaded = false;

const loadAutoTable = async () => {
  if (autoTableLoaded) return true;

  try {
    const autoTable = await import("jspdf-autotable");
    jsPDF.API.autoTable = autoTable.default;
    autoTableLoaded = true;
    return true;
  } catch (error) {
    console.warn(
      "jspdf-autotable not available, using fallback PDF generation",
    );
    return false;
  }
};

export const generateCostEstimatePDF = (
  calculationResult,
  formData,
  userEmail,
) => {
  const doc = new jsPDF();

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to get readable names
  const getPropertyTypeName = (id) => {
    const types = {
      terraced: "Terraced House",
      semiDetached: "Semi-Detached House",
      detached: "Detached House",
      flat: "Flat/Apartment",
      maisonette: "Maisonette",
    };
    return types[id] || id;
  };

  const getExtensionTypeName = (id) => {
    const types = {
      singleStorey: "Single Storey Extension",
      doubleStorey: "Double Storey Extension",
      basement: "Basement Extension",
      loft: "Loft Conversion",
    };
    return types[id] || id;
  };

  const getLocationName = (id) => {
    const zones = {
      zone1: "Zone 1 (Central London)",
      zone2: "Zone 2 (Inner London)",
      zone3: "Zone 3 (Outer London)",
      zone4: "Zone 4 (Greater London)",
      zone5: "Zone 5+ (Beyond Greater London)",
    };
    return zones[id] || id;
  };

  const getComplexityName = (id) => {
    const complexities = {
      simple: "Simple",
      moderate: "Moderate",
      complex: "Complex",
      veryComplex: "Very Complex",
    };
    return complexities[id] || id;
  };

  // Header
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text("Better Homes Studio", 20, 30);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Extension Cost Estimate", 20, 45);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-GB")}`, 20, 55);
  doc.text(`Email: ${userEmail}`, 20, 62);

  // Project Details
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Project Details", 20, 80);

  const projectDetails = [
    ["Property Type:", getPropertyTypeName(formData.propertyType)],
    ["Location:", getLocationName(formData.location)],
    ["Extension Type:", getExtensionTypeName(formData.extensionType)],
    ["Size:", `${formData.size} m²`],
    ["Complexity:", getComplexityName(formData.complexity)],
  ];

  // Simple text layout for project details
  let yPos = 85;
  projectDetails.forEach(([label, value]) => {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, "bold");
    doc.text(label, 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text(value, 80, yPos);
    yPos += 8;
  });

  // Cost Summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Cost Summary", 20, 140);

  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246);
  doc.text(formatCurrency(calculationResult.total), 20, 155);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Total estimated cost including VAT", 20, 165);
  doc.text(
    `${formatCurrency(calculationResult.costPerSqm)} per square metre`,
    20,
    172,
  );

  // Cost Breakdown
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Cost Breakdown", 20, 190);

  const breakdownData = [
    [
      "Base Construction",
      formatCurrency(calculationResult.breakdown.adjustedCost),
    ],
  ];

  if (calculationResult.breakdown.featuresCost > 0) {
    breakdownData.push([
      "Additional Features",
      formatCurrency(calculationResult.breakdown.featuresCost),
    ]);
  }

  if (calculationResult.breakdown.planningCost > 0) {
    breakdownData.push([
      "Planning & Legal",
      formatCurrency(calculationResult.breakdown.planningCost),
    ]);
  }

  breakdownData.push(
    ["Contingency", formatCurrency(calculationResult.breakdown.contingency)],
    ["VAT (20%)", formatCurrency(calculationResult.breakdown.vat)],
    ["", ""],
    ["TOTAL", formatCurrency(calculationResult.total)],
  );

  // Simple text layout for cost breakdown
  yPos = 195;
  breakdownData.forEach(([label, value], index) => {
    if (label && value) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(label, 20, yPos);
      doc.text(value, 120, yPos);
      yPos += 6;
    } else if (index === breakdownData.length - 2) {
      // Empty row before total
      yPos += 4;
    } else if (index === breakdownData.length - 1) {
      // Total row
      doc.setFontSize(10);
      doc.setTextColor(59, 130, 246);
      doc.setFont(undefined, "bold");
      doc.text(label, 20, yPos);
      doc.text(value, 120, yPos);
    }
  });

  // Additional Features (if any)
  if (formData.additionalFeatures && formData.additionalFeatures.length > 0) {
    const featuresY = 240;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Selected Additional Features:", 20, featuresY);

    const featuresList = formData.additionalFeatures.map((feature) =>
      feature.replace(/([A-Z])/g, " $1").trim(),
    );

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    featuresList.forEach((feature, index) => {
      doc.text(`• ${feature}`, 25, featuresY + 10 + index * 5);
    });
  }

  // Planning Services (if any)
  if (formData.planningServices && formData.planningServices.length > 0) {
    const servicesY = 260;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Planning & Legal Services:", 20, servicesY);

    const servicesList = formData.planningServices.map((service) =>
      service.replace(/([A-Z])/g, " $1").trim(),
    );

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    servicesList.forEach((service, index) => {
      doc.text(`• ${service}`, 25, servicesY + 10 + index * 5);
    });
  }

  // Timeline
  const timelineY = 280;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Estimated Timeline:", 20, timelineY);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("• Planning Phase: 2-4 weeks", 25, timelineY + 8);
  doc.text("• Construction: 6-12 weeks", 25, timelineY + 15);
  doc.text("• Total Duration: 8-16 weeks", 25, timelineY + 22);

  // Footer
  const footerY = 270;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "This is an estimate based on the information provided. Final costs may vary based on site survey and detailed design.",
    20,
    footerY,
  );
  doc.text(
    "Better Homes Studio | London | www.betterhomesstudio.com",
    20,
    footerY + 8,
  );

  return doc;
};

export const downloadPDF = (calculationResult, formData, userEmail) => {
  const doc = generateCostEstimatePDF(calculationResult, formData, userEmail);
  const fileName = `extension-cost-estimate-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};
