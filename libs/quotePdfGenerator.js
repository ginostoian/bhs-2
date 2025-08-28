import { jsPDF } from "jspdf";

// Initialize autoTable plugin
let autoTableLoaded = false;

const loadAutoTable = async () => {
  if (autoTableLoaded) return true;

  try {
    // For now, let's disable autoTable to avoid the error
    // and use the fallback text-based table
    console.log("Using fallback table rendering for better compatibility");
    autoTableLoaded = true;
    return false; // Always return false to use fallback
  } catch (error) {
    console.warn(
      "jspdf-autotable not available, using fallback PDF generation:",
      error,
    );
    return false;
  }
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

// Helper function to format project type
const formatProjectType = (type) => {
  const types = {
    "bathroom-renovation": "Bathroom Renovation",
    "kitchen-renovation": "Kitchen Renovation",
    "electrical-rewiring": "Electrical Rewiring",
    "boiler-installation": "Boiler Installation",
    "full-home-renovation": "Full Home Renovation",
    "home-extension": "Home Extension",
    "loft-conversion": "Loft Conversion",
    "garden-work": "Garden Work",
    custom: "Custom Project",
  };
  return types[type] || type;
};

// Helper function to add page footer
const addPageFooter = (doc, pageNumber) => {
  const pageCount = doc.internal.getNumberOfPages();

  // Company info footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);

  // Left side - company info
  doc.text("Better Homes Studio", 20, doc.internal.pageSize.height - 20);
  doc.text(
    "Building Excellence, Delivering Dreams",
    20,
    doc.internal.pageSize.height - 15,
  );
  doc.text(
    "www.betterhomesstudio.co.uk",
    20,
    doc.internal.pageSize.height - 10,
  );

  // Right side - page number
  doc.text(
    `Page ${pageNumber} of ${pageCount}`,
    doc.internal.pageSize.width - 40,
    doc.internal.pageSize.height - 10,
  );
};

export const generateQuotePDF = async (quote) => {
  const autoTableAvailable = await loadAutoTable();

  const doc = new jsPDF();

  // Verify autoTable is available
  if (autoTableAvailable && !doc.autoTable) {
    console.warn("autoTable plugin loaded but not available on doc instance");
    // Try to access it from the API
    if (jsPDF.API.autoTable) {
      doc.autoTable = jsPDF.API.autoTable.bind(doc);
    }
  }

  // Header
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text("Better Homes Studio", 20, 30);

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("QUOTE", 20, 45);

  // Quote details in header area
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Quote #: ${quote.quoteNumber || quote.id}`, 140, 30);
  doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 140, 37);
  if (quote.validUntil) {
    doc.text(
      `Valid Until: ${new Date(quote.validUntil).toLocaleDateString("en-GB")}`,
      140,
      44,
    );
  }

  let yPosition = 60;

  // Project Information
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Project Information", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  if (quote.title) {
    doc.text(`Project: ${quote.title}`, 20, yPosition);
    yPosition += 7;
  }

  if (quote.projectType) {
    doc.text(`Type: ${formatProjectType(quote.projectType)}`, 20, yPosition);
    yPosition += 7;
  }

  if (quote.projectAddress) {
    doc.text(`Location: ${quote.projectAddress}`, 20, yPosition);
    yPosition += 7;
  }

  if (quote.startDate) {
    doc.text(
      `Proposed Start: ${new Date(quote.startDate).toLocaleDateString("en-GB")}`,
      20,
      yPosition,
    );
    yPosition += 7;
  }

  if (quote.estimatedDuration) {
    doc.text(`Duration: ${quote.estimatedDuration}`, 20, yPosition);
    yPosition += 7;
  }

  yPosition += 10;

  // Client Information
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Client Information", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  if (quote.client?.name) {
    doc.text(`Name: ${quote.client.name}`, 20, yPosition);
    yPosition += 7;
  }

  if (quote.client?.email) {
    doc.text(`Email: ${quote.client.email}`, 20, yPosition);
    yPosition += 7;
  }

  if (quote.client?.phone) {
    doc.text(`Phone: ${quote.client.phone}`, 20, yPosition);
    yPosition += 7;
  }

  if (quote.client?.address) {
    doc.text(`Address: ${quote.client.address}`, 20, yPosition);
    yPosition += 7;
  }

  yPosition += 15;

  // Project Description
  if (quote.projectDescription) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Project Description", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    // Handle long descriptions with text wrapping
    const descriptionLines = doc.splitTextToSize(quote.projectDescription, 170);
    descriptionLines.forEach((line) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
  }

  // Services Table
  if (quote.services && quote.services.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Services Breakdown", 20, yPosition);
    yPosition += 15;

    // Create table data
    const tableData = [];
    let totalQuoteAmount = 0;

    quote.services.forEach((category) => {
      // Category header
      tableData.push([
        {
          content: category.categoryName,
          colSpan: 5,
          styles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            fontSize: 11,
          },
        },
      ]);

      // Category items
      if (category.items && category.items.length > 0) {
        category.items.forEach((item) => {
          const itemTotal = item.total || item.quantity * item.unitPrice;
          tableData.push([
            item.name || "",
            item.description || "",
            `${item.quantity || 0} ${item.unit || ""}`,
            formatCurrency(item.unitPrice || 0),
            formatCurrency(itemTotal),
          ]);
        });
      }

      // Category total
      const categoryTotal = category.categoryTotal || 0;
      totalQuoteAmount += categoryTotal;

      tableData.push([
        "",
        "",
        "",
        {
          content: "Category Total:",
          styles: { fontStyle: "bold", halign: "right" },
        },
        {
          content: formatCurrency(categoryTotal),
          styles: { fontStyle: "bold" },
        },
      ]);

      // Add spacing
      tableData.push(["", "", "", "", ""]);
    });

    // Generate the table using simple text layout
    {
      // Fallback: Simple text-based table
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      // Table header
      doc.text("Service", 20, yPosition);
      doc.text("Description", 60, yPosition);
      doc.text("Qty", 120, yPosition);
      doc.text("Price", 140, yPosition);
      doc.text("Total", 165, yPosition);
      yPosition += 7;

      // Draw a line under header
      doc.line(20, yPosition, 185, yPosition);
      yPosition += 5;

      // Table rows
      tableData.forEach((row) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }

        if (row.length === 5 && row[0] !== "") {
          doc.text(String(row[0] || ""), 20, yPosition);
          doc.text(String(row[1] || ""), 60, yPosition);
          doc.text(String(row[2] || ""), 120, yPosition);
          doc.text(String(row[3] || ""), 140, yPosition);
          doc.text(String(row[4] || ""), 165, yPosition);
          yPosition += 5;
        } else if (row[0] && typeof row[0] === "object" && row[0].content) {
          // Category header
          doc.setFontSize(11);
          doc.setFont(undefined, "bold");
          doc.text(row[0].content, 20, yPosition);
          doc.setFont(undefined, "normal");
          doc.setFontSize(10);
          yPosition += 7;
        }
      });
    }

    // Grand total
    const finalY = yPosition + 10;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("TOTAL QUOTE AMOUNT:", 120, finalY);
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text(formatCurrency(quote.total || totalQuoteAmount), 120, finalY + 10);

    yPosition = finalY + 25;
  }

  // Add new page for terms if needed
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 30;
  }

  // Terms and Conditions
  if (quote.termsAndConditions) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Terms & Conditions", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const termsLines = doc.splitTextToSize(quote.termsAndConditions, 170);
    termsLines.forEach((line) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      doc.text(line, 20, yPosition);
      yPosition += 5;
    });

    yPosition += 10;
  }

  // Warranty Information
  if (quote.warrantyInformation) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Warranty Information", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const warrantyLines = doc.splitTextToSize(quote.warrantyInformation, 170);
    warrantyLines.forEach((line) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      doc.text(line, 20, yPosition);
      yPosition += 5;
    });
  }

  // Add footer to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addPageFooter(doc, i);
  }

  return doc;
};

// Function to download the PDF
export const downloadQuotePDF = async (quote, filename) => {
  try {
    const doc = await generateQuotePDF(quote);
    const pdfFilename =
      filename || `quote-${quote.quoteNumber || quote.id}.pdf`;
    doc.save(pdfFilename);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
