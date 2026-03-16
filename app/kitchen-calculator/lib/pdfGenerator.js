import { jsPDF } from "jspdf";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

const propertyNames = {
  terraced: "Terraced house",
  semiDetached: "Semi-detached house",
  detached: "Detached house",
  flat: "Flat / apartment",
  maisonette: "Maisonette",
};

const regionNames = {
  london: "London",
  southEast: "South East",
  eastEngland: "East of England",
  southWest: "South West",
  midlands: "Midlands",
  northEngland: "North of England",
  scotlandWales: "Scotland / Wales",
};

function drawSectionTitle(doc, y, title) {
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.setFont(undefined, "bold");
  doc.text(title.toUpperCase(), 14, y);
  return y + 6;
}

function createLayoutHelpers(doc) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  const ensureSpace = (y, needed = 12) => {
    if (y + needed > pageHeight - 18) {
      doc.addPage();
      return 18;
    }
    return y;
  };

  const addParagraph = (y, text, options = {}) => {
    y = ensureSpace(y, 12);
    const fontSize = options.fontSize || 10;
    const color = options.color || [50, 50, 50];
    const maxWidth = options.maxWidth || pageWidth - 28;
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont(undefined, options.bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, options.x || 14, y);
    return y + lines.length * (fontSize * 0.38 + 1.4);
  };

  const addKeyValue = (y, label, value) => {
    y = ensureSpace(y, 8);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, "bold");
    doc.text(label, 14, y);
    doc.setTextColor(20, 20, 20);
    doc.setFont(undefined, "normal");
    const valueLines = doc.splitTextToSize(String(value), 90);
    doc.text(valueLines, 80, y);
    return y + Math.max(6, valueLines.length * 4.5);
  };

  const addRow = (y, label, value, options = {}) => {
    y = ensureSpace(y, 8);
    doc.setFontSize(options.fontSize || 10);
    doc.setFont(undefined, options.bold ? "bold" : "normal");
    doc.setTextColor(...(options.color || [30, 30, 30]));
    doc.text(label, 14, y);
    doc.text(String(value), pageWidth - 14, y, { align: "right" });
    return y + 5.8;
  };

  const addDivider = (y) => {
    y = ensureSpace(y, 4);
    doc.setDrawColor(220, 220, 220);
    doc.line(14, y, pageWidth - 14, y);
    return y + 4;
  };

  return { addParagraph, addKeyValue, addRow, addDivider };
}

export const generateKitchenEstimatePDF = (calculationResult, formData, userEmail) => {
  const doc = new jsPDF();
  const h = createLayoutHelpers(doc);
  const b = calculationResult.breakdown || {};
  let y = 18;

  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.setFont(undefined, "bold");
  doc.text("Better Homes Studio", 14, y);
  y += 8;

  doc.setFontSize(14);
  doc.text("Kitchen Budget Estimate", 14, y);
  y += 6;

  y = h.addParagraph(
    y,
    "This is a planning-stage installed-cost estimate based on your answers. It is designed to help you compare kitchen scope options and prepare for quote discussions.",
    { fontSize: 9.5, color: [90, 90, 90] },
  );

  y = h.addDivider(y + 1);
  y = drawSectionTitle(doc, y, "Project details");
  y = h.addKeyValue(y, "Property", propertyNames[formData.propertyType] || formData.propertyType || "Not set");
  y = h.addKeyValue(y, "Region", regionNames[formData.region] || formData.region || "Not set");
  y = h.addKeyValue(y, "Kitchen size", `${formData.kitchenSize || 0} m²`);
  y = h.addKeyValue(y, "Layout", String(formData.layoutType || "").replace(/([A-Z])/g, " "));
  y = h.addKeyValue(y, "Cabinetry level", String(formData.kitchenRange || "").replace(/([A-Z])/g, " "));
  y = h.addKeyValue(y, "Generated for", userEmail || "PDF download");
  y = h.addKeyValue(y, "Generated on", new Date().toLocaleDateString("en-GB"));

  y = h.addDivider(y + 1);
  y = drawSectionTitle(doc, y, "Budget range");
  y = h.addRow(y, "Low estimate", formatCurrency(calculationResult.ranges.low), {
    bold: true,
  });
  y = h.addRow(y, "Expected estimate", formatCurrency(calculationResult.ranges.expected), {
    bold: true,
    color: [15, 23, 42],
  });
  y = h.addRow(y, "High estimate", formatCurrency(calculationResult.ranges.high), {
    bold: true,
  });
  y = h.addRow(y, "Expected cost per m²", formatCurrency(calculationResult.rangePerSqm?.expected || calculationResult.costPerSqm));
  y = h.addRow(y, "Confidence score", `${calculationResult.confidenceScore || 0}/100`);

  y = h.addDivider(y + 1);
  y = drawSectionTitle(doc, y, "Cost breakdown (expected)");
  y = h.addRow(y, "Labour", formatCurrency(b.labourTotal), { bold: true });
  y = h.addRow(y, "Supply / items", formatCurrency(b.supplyTotal), { bold: true });
  y = h.addRow(y, "Kitchen fitting labour", formatCurrency(b.labour));
  y = h.addRow(y, "Included standard works", formatCurrency(b.includedWorks));
  y = h.addRow(y, "Kitchen cabinetry supply", formatCurrency(b.cabinetry));
  y = h.addRow(y, "Appliances", formatCurrency(b.appliances));
  y = h.addRow(y, "Worktops", formatCurrency(b.worktops));
  y = h.addRow(y, "Splashback upgrade", formatCurrency(b.splashback));
  y = h.addRow(y, "Flooring", formatCurrency(b.flooring));
  y = h.addRow(y, "Electrical upgrade", formatCurrency(b.electrical));
  y = h.addRow(y, "Plumbing upgrade", formatCurrency(b.plumbing));
  y = h.addRow(y, "Boiler work", formatCurrency(b.boiler));
  y = h.addRow(y, "Decoration upgrade", formatCurrency(b.decoration));
  y = h.addRow(y, "Structural work", formatCurrency(b.structural));
  y = h.addRow(y, "Professional fees", formatCurrency(b.professionalFees));
  y = h.addRow(y, "Statutory fees", formatCurrency(b.statutoryFees));
  y = h.addRow(y, "Subtotal before contingency", formatCurrency(b.subtotalBeforeContingency));
  y = h.addRow(y, `Contingency (${Math.round((b.contingencyRate || 0) * 100)}%)`, formatCurrency(b.contingency));
  y = h.addRow(y, "Subtotal ex VAT", formatCurrency(b.subtotalExVat), { bold: true });
  y = h.addRow(y, `VAT (${Math.round((b.vatRate || 0) * 100)}%)`, formatCurrency(b.vat));
  y = h.addDivider(y + 1);
  y = h.addRow(y, "Total expected budget", formatCurrency(b.total), {
    bold: true,
    color: [30, 41, 59],
  });

  if (Array.isArray(b.feeLineItems) && b.feeLineItems.length > 0) {
    y = h.addDivider(y + 1);
    y = drawSectionTitle(doc, y, "Fees included");
    b.feeLineItems.forEach((item) => {
      y = h.addRow(y, item.name, formatCurrency(item.cost));
    });
  }

  if (calculationResult.timeline) {
    y = h.addDivider(y + 1);
    y = drawSectionTitle(doc, y, "Indicative timeline");
    y = h.addRow(y, "Pre-construction", `${calculationResult.timeline.planning.min}-${calculationResult.timeline.planning.max} weeks`);
    y = h.addRow(y, "Installation", `${calculationResult.timeline.build.min}-${calculationResult.timeline.build.max} weeks`);
    y = h.addRow(y, "Typical total", `${calculationResult.timeline.total.min}-${calculationResult.timeline.total.max} weeks`, { bold: true });
  }

  y = h.addDivider(y + 2);
  y = drawSectionTitle(doc, y, "Useful next steps");
  [
    "Fix the appliance package and worktop material before comparing builder quotes.",
    "If you are knocking through, allow for engineering, approvals, and temporary support.",
    "Use the high range if services or structural details are not fully confirmed.",
    "Ask each builder to confirm what is excluded: appliances, decorating, boxing in, making good, and VAT.",
    "Minor electrics, standard tiled splashback, and making-good decoration are already included in this baseline estimate.",
  ].forEach((tip) => {
    y = h.addParagraph(y, `• ${tip}`, { fontSize: 9.5, color: [50, 50, 50] });
  });

  y = h.addDivider(y + 1);
  y = drawSectionTitle(doc, y, "Important assumptions");
  h.addParagraph(
    y,
    "This estimate does not replace a site-based quote. Final cost depends on measured run length, appliance choices, services, structural discoveries, and detailed design.",
    { fontSize: 9.3, color: [80, 80, 80] },
  );

  return doc;
};

export const downloadPDF = (calculationResult, formData, userEmail) => {
  const doc = generateKitchenEstimatePDF(calculationResult, formData, userEmail);
  const fileName = `kitchen-budget-estimate-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};
