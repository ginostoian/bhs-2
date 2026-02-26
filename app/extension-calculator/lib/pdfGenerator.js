import { jsPDF } from "jspdf";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

const prettifyId = (id) =>
  String(id || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();

const extensionNames = {
  singleStorey: "Single-storey extension",
  doubleStorey: "Double-storey extension",
  basement: "Basement extension",
  loft: "Loft conversion",
};

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

  return { ensureSpace, addParagraph, addKeyValue, addRow, addDivider, pageWidth };
}

export const generateCostEstimatePDF = (
  calculationResult,
  formData,
  userEmail,
) => {
  const doc = new jsPDF();
  const h = createLayoutHelpers(doc);

  let y = 18;

  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.setFont(undefined, "bold");
  doc.text("Better Homes Studio", 14, y);
  y += 8;

  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("Extension Budget Estimate", 14, y);
  y += 6;

  y = h.addParagraph(
    y,
    "This is a ballpark budgeting estimate generated from your answers. It is designed to support early-stage planning and comparison, not replace a surveyed quote.",
    { fontSize: 9.5, color: [90, 90, 90] },
  );

  y = h.addDivider(y + 1);

  y = drawSectionTitle(doc, y, "Project details");
  y = h.addKeyValue(
    y,
    "Extension type",
    extensionNames[formData.extensionType] || formData.extensionType || "Not set",
  );
  y = h.addKeyValue(y, "Size", `${formData.size || 0} m²`);
  y = h.addKeyValue(
    y,
    "Property type",
    propertyNames[formData.propertyType] || formData.propertyType || "Not set",
  );
  y = h.addKeyValue(
    y,
    "Region",
    regionNames[formData.region] ||
      londonZoneNames[formData.location] ||
      formData.region ||
      formData.location ||
      "Not set",
  );
  if (formData.region === "london" && formData.londonZone) {
    y = h.addKeyValue(
      y,
      "London zone",
      londonZoneNames[formData.londonZone] || formData.londonZone,
    );
  }
  if (formData.postcode) {
    y = h.addKeyValue(y, "Postcode", formData.postcode);
  }
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
    y + 1,
    "Expected cost per m²",
    formatCurrency(
      (calculationResult.rangePerSqm &&
        calculationResult.rangePerSqm.expected) ||
        calculationResult.costPerSqm,
    ),
  );
  y = h.addRow(y, "Confidence score", `${calculationResult.confidenceScore || 0}/100`);

  y = h.addDivider(y + 1);

  const b = calculationResult.breakdown || {};
  y = drawSectionTitle(doc, y, "Cost breakdown (expected)");
  y = h.addRow(y, "Base build (before modifiers)", formatCurrency(b.baseBuild));
  y = h.addRow(y, "Adjusted build cost", formatCurrency(b.adjustedBuild), {
    bold: true,
  });
  y = h.addRow(y, "Optional extras", formatCurrency(b.extras));
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

  if (Array.isArray(b.extrasLineItems) && b.extrasLineItems.length > 0) {
    y = h.addDivider(y + 1);
    y = drawSectionTitle(doc, y, "Selected extras");
    b.extrasLineItems.forEach((item) => {
      y = h.addRow(
        y,
        `${item.name} ${
          item.unit === "fixed" ? "(allowance)" : `(${item.quantity} ${item.unitLabel})`
        }`,
        formatCurrency(item.total),
      );
    });
  }

  if (Array.isArray(b.planningLineItems) && b.planningLineItems.length > 0) {
    y = h.addDivider(y + 1);
    y = drawSectionTitle(doc, y, "Fees included");
    b.planningLineItems.forEach((item) => {
      y = h.addRow(
        y,
        `${prettifyId(item.id)} [${item.category}]`,
        formatCurrency(item.cost),
      );
    });
  }

  if (calculationResult.timeline) {
    y = h.addDivider(y + 1);
    y = drawSectionTitle(doc, y, "Indicative timeline");
    y = h.addRow(
      y,
      "Planning / pre-construction",
      `${calculationResult.timeline.planning.min}-${calculationResult.timeline.planning.max} weeks`,
    );
    y = h.addRow(
      y,
      "Construction",
      `${calculationResult.timeline.build.min}-${calculationResult.timeline.build.max} weeks`,
    );
    y = h.addRow(
      y,
      "Total typical programme",
      `${calculationResult.timeline.total.min}-${calculationResult.timeline.total.max} weeks`,
      { bold: true },
    );
  }

  y = h.addDivider(y + 2);
  y = drawSectionTitle(doc, y, "Best-practice next steps");
  [
    "Use the high estimate when checking affordability/finance so you do not under-budget.",
    "Get a measured survey and clear drawings before requesting final builder quotes.",
    "Ask each builder to price the same scope, inclusions, and provisional sums.",
    "Confirm what is excluded: kitchen/appliances, landscaping, party wall, utility upgrades, fees, VAT.",
    "Hold contingency until the project is complete; do not allocate it to optional upgrades too early.",
    "Request a staged payment schedule tied to progress, with a retention/snagging balance where appropriate.",
  ].forEach((tip) => {
    y = h.addParagraph(y, `• ${tip}`, { fontSize: 9.5, color: [50, 50, 50] });
  });

  y = h.addDivider(y + 1);
  y = drawSectionTitle(doc, y, "Important assumptions");
  y = h.addParagraph(
    y,
    "This estimate is generated from your answers and does not replace a site survey, measured drawings, engineering design, or formal quote. Hidden ground conditions, drainage changes, access constraints, and specification changes can materially affect costs.",
    { fontSize: 9.3, color: [80, 80, 80] },
  );
  y = h.addParagraph(
    y,
    "Better Homes Studio | London | www.betterhomesstudio.com",
    { fontSize: 8.5, color: [120, 120, 120] },
  );

  return doc;
};

export const downloadPDF = (calculationResult, formData, userEmail) => {
  const doc = generateCostEstimatePDF(calculationResult, formData, userEmail);
  const fileName = `extension-cost-estimate-${new Date()
    .toISOString()
    .split("T")[0]}.pdf`;
  doc.save(fileName);
};
