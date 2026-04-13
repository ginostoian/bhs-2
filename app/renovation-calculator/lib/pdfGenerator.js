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

const londonZoneNames = {
  zone1: "Zone 1",
  zone2: "Zone 2",
  zone3: "Zone 3",
  zone4: "Zone 4",
  zone5: "Zone 5+",
};

const levelNames = {
  cosmetic: "Cosmetic refresh",
  standard: "Mid-range refurbishment",
  fullRenovation: "Full renovation",
  backToBrick: "Back-to-brick renovation",
};

const coverageNames = {
  singleArea: "Single area",
  partialHome: "Roughly half the home",
  mostRooms: "Most rooms",
  wholeHome: "Whole home",
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

  const addKeyValue = (y, label, value, options = {}) => {
    y = ensureSpace(y, 8);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, "bold");
    doc.text(label, 14, y);

    doc.setTextColor(20, 20, 20);
    doc.setFont(undefined, options.bold ? "bold" : "normal");
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

  return { addDivider, addKeyValue, addParagraph, addRow };
}

export const generateRenovationEstimatePDF = (
  calculationResult,
  formData,
  userEmail,
) => {
  const doc = new jsPDF();
  const h = createLayoutHelpers(doc);
  const b = calculationResult.breakdown || {};
  let y = 18;

  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.setFont(undefined, "bold");
  doc.text("Better Homes", 14, y);
  y += 8;

  doc.setFontSize(14);
  doc.text("Renovation Budget Estimate", 14, y);
  y += 6;

  y = h.addParagraph(
    y,
    "This PDF is a planning-stage budget guide based on your answers. It is intended to help you compare scope options and prepare for builder conversations, not replace a detailed site-based quote.",
    { fontSize: 9.5, color: [90, 90, 90] },
  );

  y = h.addDivider(y + 1);
  y = drawSectionTitle(doc, y, "Project details");
  y = h.addKeyValue(
    y,
    "Property",
    propertyNames[formData.propertyType] || formData.propertyType || "Not set",
  );
  y = h.addKeyValue(y, "Approx. size", `${formData.houseSize || 0} m²`);
  y = h.addKeyValue(
    y,
    "Region",
    regionNames[formData.region] || formData.region || "Not set",
  );
  if (formData.region === "london" && formData.londonZone) {
    y = h.addKeyValue(
      y,
      "London zone",
      londonZoneNames[formData.londonZone] || formData.londonZone,
    );
  }
  y = h.addKeyValue(
    y,
    "Scope",
    levelNames[formData.renovationLevel] || formData.renovationLevel || "Not set",
  );
  y = h.addKeyValue(
    y,
    "Coverage",
    coverageNames[formData.coverageLevel] || formData.coverageLevel || "Not set",
  );
  y = h.addKeyValue(y, "Generated for", userEmail || "PDF download");
  y = h.addKeyValue(y, "Generated on", new Date().toLocaleDateString("en-GB"));

  y = h.addDivider(y + 1);
  y = drawSectionTitle(doc, y, "Budget range");
  y = h.addRow(y, "Low estimate", formatCurrency(calculationResult.ranges.low), {
    bold: true,
  });
  y = h.addRow(
    y,
    "Expected estimate",
    formatCurrency(calculationResult.ranges.expected),
    { bold: true, color: [15, 23, 42] },
  );
  y = h.addRow(y, "High estimate", formatCurrency(calculationResult.ranges.high), {
    bold: true,
  });
  y = h.addRow(
    y,
    "Expected cost per m²",
    formatCurrency(calculationResult.rangePerSqm?.expected || calculationResult.costPerSqm),
  );
  y = h.addRow(y, "Confidence score", `${calculationResult.confidenceScore || 0}/100`);

  y = h.addDivider(y + 1);
  y = drawSectionTitle(doc, y, "Cost breakdown (expected)");
  y = h.addRow(y, "Core scope allowance", formatCurrency(b.coreScopeAdjusted), {
    bold: true,
  });
  y = h.addRow(y, "Room fit-out", formatCurrency(b.roomFitout));
  y = h.addRow(y, "Structural works", formatCurrency(b.structuralWorks));
  y = h.addRow(y, "Systems", formatCurrency(b.systemsWorks));
  y = h.addRow(y, "Finishing", formatCurrency(b.finishingWorks));
  y = h.addRow(y, "Professional fees", formatCurrency(b.professionalFees));
  y = h.addRow(y, "Statutory fees", formatCurrency(b.statutoryFees));
  y = h.addRow(
    y,
    "Subtotal before contingency",
    formatCurrency(b.subtotalBeforeContingency),
  );
  y = h.addRow(
    y,
    `Contingency (${Math.round((b.contingencyRate || 0) * 100)}%)`,
    formatCurrency(b.contingency),
  );
  y = h.addRow(y, "Subtotal ex VAT", formatCurrency(b.subtotalExVat), {
    bold: true,
  });
  y = h.addRow(
    y,
    `VAT (${Math.round((b.vatRate || 0) * 100)}%)`,
    formatCurrency(b.vat),
  );
  y = h.addDivider(y + 1);
  y = h.addRow(y, "Total expected budget", formatCurrency(b.total), {
    bold: true,
    color: [30, 41, 59],
  });

  const detailGroups = [
    { title: "Room fit-out allowances", items: b.roomLineItems, valueKey: "total" },
    { title: "Structural allowances", items: b.structuralLineItems, valueKey: "total" },
    { title: "Systems allowances", items: b.systemsLineItems, valueKey: "total" },
    { title: "Finishing allowances", items: b.finishingLineItems, valueKey: "total" },
    { title: "Fees included", items: b.feeLineItems, valueKey: "cost" },
  ];

  detailGroups.forEach((group) => {
    if (!Array.isArray(group.items) || group.items.length === 0) return;
    y = h.addDivider(y + 1);
    y = drawSectionTitle(doc, y, group.title);
    group.items.forEach((item) => {
      const label =
        item.quantity && item.quantity > 1
          ? `${item.name} (${item.quantity})`
          : item.name;
      y = h.addRow(y, label, formatCurrency(item[group.valueKey] || 0));
    });
  });

  if (calculationResult.timeline) {
    y = h.addDivider(y + 1);
    y = drawSectionTitle(doc, y, "Indicative timeline");
    y = h.addRow(
      y,
      "Pre-construction",
      `${calculationResult.timeline.planning.min}-${calculationResult.timeline.planning.max} weeks`,
    );
    y = h.addRow(
      y,
      "Construction",
      `${calculationResult.timeline.build.min}-${calculationResult.timeline.build.max} weeks`,
    );
    y = h.addRow(
      y,
      "Typical total",
      `${calculationResult.timeline.total.min}-${calculationResult.timeline.total.max} weeks`,
      { bold: true },
    );
  }

  y = h.addDivider(y + 2);
  y = drawSectionTitle(doc, y, "Useful next steps");
  [
    "Use the high estimate when checking cash flow or finance so hidden-condition risk is covered.",
    "Prepare a room-by-room scope before asking builders to quote, otherwise prices are hard to compare.",
    "If walls are being opened up, budget for survey, engineer input, and approvals early.",
    "Ask every contractor to state what is excluded: appliances, fitted furniture, decorating, waste removal, snagging, and VAT.",
    "If you plan to live in during the works, allow for slower progress and extra protection / cleaning costs.",
  ].forEach((tip) => {
    y = h.addParagraph(y, `• ${tip}`, { fontSize: 9.5, color: [50, 50, 50] });
  });

  y = h.addDivider(y + 1);
  y = drawSectionTitle(doc, y, "Important assumptions");
  y = h.addParagraph(
    y,
    "This estimate is not a formal quotation. Older properties, hidden damp, out-of-date services, uneven floors, and late specification changes can materially affect cost. The range narrows once the scope, drawings, and room schedule are better defined.",
    { fontSize: 9.3, color: [80, 80, 80] },
  );
  h.addParagraph(y, "Better Homes | London | www.betterhomesstudio.com", {
    fontSize: 8.5,
    color: [120, 120, 120],
  });

  return doc;
};

export const downloadPDF = (calculationResult, formData, userEmail) => {
  const doc = generateRenovationEstimatePDF(calculationResult, formData, userEmail);
  const fileName = `renovation-budget-estimate-${new Date()
    .toISOString()
    .split("T")[0]}.pdf`;
  doc.save(fileName);
};
