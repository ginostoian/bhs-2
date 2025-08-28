import html2pdf from "html2pdf.js";

// Dynamic import for react-pdf to avoid SSR issues
const loadReactPDF = async () => {
  if (typeof window === "undefined") return null;

  try {
    const { pdf, Document, Page, Text, View, StyleSheet, PDFDownloadLink } =
      await import("@react-pdf/renderer");
    return { pdf, Document, Page, Text, View, StyleSheet, PDFDownloadLink };
  } catch (error) {
    console.warn("@react-pdf/renderer not available:", error);
    return null;
  }
};

// PDF generation options for high-quality output that matches the site exactly
const pdfOptions = {
  margin: [0.2, 0.2, 0.2, 0.2], // Smaller margins to capture more content
  filename: "quote.pdf",
  image: {
    type: "jpeg",
    quality: 1.0, // Maximum quality
  },
  html2canvas: {
    scale: 4, // Maximum scale for ultra-crisp text
    useCORS: true,
    letterRendering: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    dpi: 300,
    foreignObjectRendering: true,
    logging: false, // Disable logging for cleaner output
    width: 1200, // Fixed width for consistent rendering
    height: null, // Auto height
    scrollX: 0,
    scrollY: 0,
  },
  jsPDF: {
    unit: "in",
    format: "a4",
    orientation: "portrait",
    compress: false,
    precision: 16, // Higher precision for better quality
  },
  pagebreak: {
    mode: ["avoid-all", "css", "legacy"],
    before: [".page-break-before"],
    after: [".page-break-after", ".space-y-6 > div"],
    avoid: [".no-break", ".avoid-break", ".rounded-xl"],
  },
};

// Function to generate PDF from the public quote page (simplified approach)
export const generateStyledQuotePDF = async (quoteData, filename) => {
  try {
    // Use the print-optimized template instead of iframe approach
    return await generatePrintOptimizedPDF(quoteData, filename);
  } catch (error) {
    console.error("Error generating styled PDF:", error);
    throw error;
  }
};

// Alternative function to generate PDF from current page content
export const generatePDFFromCurrentPage = async (
  elementId = "quote-content",
  filename,
) => {
  let printStyles;
  try {
    // Check if html2pdf is available
    if (typeof html2pdf === "undefined") {
      throw new Error("html2pdf library is not loaded");
    }

    // Wait for any pending renders
    await new Promise((resolve) => setTimeout(resolve, 500));

    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    if (!element.innerHTML || element.innerHTML.trim().length === 0) {
      throw new Error("Element is empty");
    }

    // Add minimal CSS for color preservation
    printStyles = document.createElement("style");
    printStyles.textContent = `
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    `;
    document.head.appendChild(printStyles);

    // Simple, minimal configuration to capture exactly what's on screen
    const customOptions = {
      margin: 0.5,
      filename: filename || "quote.pdf",
      image: {
        type: "jpeg",
        quality: 0.95,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    // Generate PDF from the element
    await html2pdf().set(customOptions).from(element).save();

    // Clean up the added styles
    if (printStyles && printStyles.parentNode) {
      printStyles.parentNode.removeChild(printStyles);
    }

    return true;
  } catch (error) {
    console.error("Error in generatePDFFromCurrentPage:", error);

    // Clean up the added styles even if there's an error
    if (printStyles && printStyles.parentNode) {
      printStyles.parentNode.removeChild(printStyles);
    }

    throw error;
  }
};

// Function to generate PDF from a React component rendered to HTML
export const generatePDFFromComponent = async (component, filename) => {
  let tempContainer;
  try {
    console.log("Starting generatePDFFromComponent...");
    console.log("Component length:", component ? component.length : 0);
    console.log("Filename:", filename);

    // Check if html2pdf is available
    if (typeof html2pdf === "undefined") {
      throw new Error("html2pdf library is not loaded");
    }

    // Create a temporary container
    tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.width = "800px";
    tempContainer.style.backgroundColor = "#ffffff";

    console.log("Created temp container");

    // Add the component HTML to the container
    tempContainer.innerHTML = component;
    document.body.appendChild(tempContainer);

    console.log("Added content to container");
    console.log("Container content length:", tempContainer.innerHTML.length);

    // Configure PDF options
    const customOptions = {
      ...pdfOptions,
      filename: filename || "quote.pdf",
    };

    console.log("PDF options:", customOptions);
    console.log("About to generate PDF...");

    // Generate PDF
    await html2pdf().set(customOptions).from(tempContainer).save();

    console.log("PDF generated successfully");

    // Clean up
    document.body.removeChild(tempContainer);
    return true;
  } catch (error) {
    console.error("Error in generatePDFFromComponent:", error);

    // Clean up
    if (tempContainer && document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
    throw error;
  }
};

// Function to create a print-optimized version of the quote
// Simple test function to verify html2pdf is working
export const generateTestPDF = async (filename) => {
  try {
    console.log("Testing html2pdf with simple content...");

    // Check if html2pdf is available
    if (typeof html2pdf === "undefined") {
      throw new Error("html2pdf library is not loaded");
    }

    // Create simple test content
    const testElement = document.createElement("div");
    testElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial;">
        <h1>Test PDF</h1>
        <p>This is a test to see if html2pdf.js is working.</p>
        <p>Current time: ${new Date().toISOString()}</p>
      </div>
    `;
    testElement.style.position = "absolute";
    testElement.style.left = "-9999px";
    testElement.style.backgroundColor = "#ffffff";
    testElement.style.width = "800px";

    document.body.appendChild(testElement);

    const options = {
      margin: 1,
      filename: filename || "test.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    await html2pdf().set(options).from(testElement).save();
    document.body.removeChild(testElement);

    console.log("Test PDF generated successfully");
    return true;
  } catch (error) {
    console.error("Test PDF generation failed:", error);
    throw error;
  }
};

// Fallback using browser print dialog
export const generatePrintFallback = async (quoteData, filename) => {
  try {
    console.log("Using browser print fallback...");

    // Create a new window with the quote content
    const printWindow = window.open("", "_blank");
    const printTemplate = createPrintTemplate(quoteData);

    printWindow.document.write(printTemplate);
    printWindow.document.close();

    // Wait for content to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Trigger print dialog
    printWindow.print();

    // Close the window after a delay (user might still be printing)
    setTimeout(() => {
      printWindow.close();
    }, 5000);

    return true;
  } catch (error) {
    console.error("Print fallback failed:", error);
    throw error;
  }
};

export const generatePrintOptimizedPDF = async (quoteData, filename) => {
  try {
    console.log("Starting generatePrintOptimizedPDF...");
    console.log("Quote data:", quoteData);
    console.log("Filename:", filename);

    // First try a simple test
    try {
      await generateTestPDF("test-" + (filename || "quote.pdf"));
      console.log("Test PDF worked, now generating actual quote...");
    } catch (testError) {
      console.error("Test PDF failed, using print fallback:", testError);
      // Use browser print as fallback
      return await generatePrintFallback(quoteData, filename);
    }

    // Create a print-optimized HTML template
    const printTemplate = createPrintTemplate(quoteData);

    console.log("Generated template length:", printTemplate.length);
    console.log("Template preview:", printTemplate.substring(0, 500));

    return await generatePDFFromComponent(printTemplate, filename);
  } catch (error) {
    console.error(
      "Error generating print-optimized PDF, trying print fallback:",
      error,
    );
    // Final fallback to browser print
    try {
      return await generatePrintFallback(quoteData, filename);
    } catch (fallbackError) {
      console.error("All PDF generation methods failed:", fallbackError);
      throw new Error(
        "PDF generation failed. Please try using your browser's print function (Ctrl+P / Cmd+P) and save as PDF.",
      );
    }
  }
};

// High-quality vector PDF generation using React PDF
export const generateVectorPDF = async (quoteData, filename) => {
  try {
    const reactPDF = await loadReactPDF();
    if (!reactPDF) {
      // Fallback to HTML-based PDF
      return await generatePrintOptimizedPDF(quoteData, filename);
    }

    const { pdf, Document, Page, Text, View, StyleSheet } = reactPDF;

    // Create styles for the PDF
    const styles = StyleSheet.create({
      page: {
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 30,
        fontFamily: "Helvetica",
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: "3px solid #3b82f6",
      },
      logoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#3b82f6",
      },
      quoteInfo: {
        alignItems: "flex-end",
      },
      quoteTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
      },
      quoteDetails: {
        fontSize: 10,
        color: "#6b7280",
        marginBottom: 2,
      },
      section: {
        marginBottom: 20,
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        paddingBottom: 5,
        borderBottom: "1px solid #e5e7eb",
      },
      infoGrid: {
        flexDirection: "row",
        marginBottom: 20,
      },
      infoColumn: {
        flex: 1,
        marginRight: 20,
      },
      infoItem: {
        marginBottom: 8,
      },
      infoLabel: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 2,
      },
      infoValue: {
        fontSize: 10,
        color: "#6b7280",
      },
      table: {
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#e5e7eb",
      },
      tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        borderBottomStyle: "solid",
        minHeight: 30,
        alignItems: "center",
      },
      tableHeader: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        fontWeight: "bold",
      },
      categoryHeader: {
        backgroundColor: "#f3f4f6",
        fontWeight: "bold",
      },
      categoryTotal: {
        backgroundColor: "#fef3c7",
        fontWeight: "bold",
      },
      tableCell: {
        padding: 8,
        fontSize: 9,
      },
      tableCellService: {
        width: "25%",
      },
      tableCellDesc: {
        width: "30%",
      },
      tableCellQty: {
        width: "15%",
        textAlign: "center",
      },
      tableCellPrice: {
        width: "15%",
        textAlign: "right",
      },
      tableCellTotal: {
        width: "15%",
        textAlign: "right",
      },
      totalSection: {
        backgroundColor: "#f9fafb",
        padding: 15,
        marginTop: 20,
        alignItems: "flex-end",
      },
      totalAmount: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#3b82f6",
      },
      footer: {
        marginTop: 40,
        paddingTop: 20,
        borderTop: "1px solid #e5e7eb",
        alignItems: "center",
      },
      footerText: {
        fontSize: 10,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 3,
      },
    });

    // Helper functions
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount || 0);
    };

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

    const totalAmount =
      quoteData.services?.reduce(
        (total, cat) => total + (cat.categoryTotal || 0),
        0,
      ) || 0;

    // Create the PDF document
    const QuoteDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logoText}>Better Homes Studio</Text>
            <View style={styles.quoteInfo}>
              <Text style={styles.quoteTitle}>QUOTE</Text>
              <Text style={styles.quoteDetails}>
                Quote #: {quoteData.quoteNumber || quoteData.id}
              </Text>
              <Text style={styles.quoteDetails}>
                Date: {new Date().toLocaleDateString("en-GB")}
              </Text>
              {quoteData.validUntil && (
                <Text style={styles.quoteDetails}>
                  Valid Until:{" "}
                  {new Date(quoteData.validUntil).toLocaleDateString("en-GB")}
                </Text>
              )}
            </View>
          </View>

          {/* Client and Project Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <Text style={styles.sectionTitle}>Client Information</Text>
              {quoteData.client?.name && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{quoteData.client.name}</Text>
                </View>
              )}
              {quoteData.client?.email && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{quoteData.client.email}</Text>
                </View>
              )}
              {quoteData.client?.phone && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{quoteData.client.phone}</Text>
                </View>
              )}
              {quoteData.client?.address && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>
                    {quoteData.client.address}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.infoColumn}>
              <Text style={styles.sectionTitle}>Project Information</Text>
              {quoteData.title && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Project</Text>
                  <Text style={styles.infoValue}>{quoteData.title}</Text>
                </View>
              )}
              {quoteData.projectType && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Type</Text>
                  <Text style={styles.infoValue}>
                    {formatProjectType(quoteData.projectType)}
                  </Text>
                </View>
              )}
              {quoteData.projectAddress && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>
                    {quoteData.projectAddress}
                  </Text>
                </View>
              )}
              {quoteData.startDate && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Start Date</Text>
                  <Text style={styles.infoValue}>
                    {new Date(quoteData.startDate).toLocaleDateString("en-GB")}
                  </Text>
                </View>
              )}
              {quoteData.estimatedDuration && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>
                    {quoteData.estimatedDuration}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Project Description */}
          {quoteData.projectDescription && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Project Description</Text>
              <Text
                style={[styles.infoValue, { fontSize: 10, lineHeight: 1.4 }]}
              >
                {quoteData.projectDescription}
              </Text>
            </View>
          )}

          {/* Services Table */}
          {quoteData.services && quoteData.services.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Services Breakdown</Text>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.tableCellService]}>
                    Service
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellDesc]}>
                    Description
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellQty]}>
                    Quantity
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellPrice]}>
                    Unit Price
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellTotal]}>
                    Total
                  </Text>
                </View>

                {/* Table Body */}
                {quoteData.services.map((category, catIndex) => (
                  <View key={catIndex}>
                    {/* Category Header */}
                    <View style={[styles.tableRow, styles.categoryHeader]}>
                      <Text
                        style={[
                          styles.tableCell,
                          { width: "100%", fontWeight: "bold" },
                        ]}
                      >
                        {category.categoryName}
                      </Text>
                    </View>

                    {/* Category Items */}
                    {category.items &&
                      category.items.map((item, itemIndex) => (
                        <View key={itemIndex} style={styles.tableRow}>
                          <Text
                            style={[styles.tableCell, styles.tableCellService]}
                          >
                            {item.name || ""}
                          </Text>
                          <Text
                            style={[styles.tableCell, styles.tableCellDesc]}
                          >
                            {item.description || ""}
                          </Text>
                          <Text style={[styles.tableCell, styles.tableCellQty]}>
                            {item.quantity || 0} {item.unit || ""}
                          </Text>
                          <Text
                            style={[styles.tableCell, styles.tableCellPrice]}
                          >
                            {formatCurrency(item.unitPrice || 0)}
                          </Text>
                          <Text
                            style={[styles.tableCell, styles.tableCellTotal]}
                          >
                            {formatCurrency(item.total || 0)}
                          </Text>
                        </View>
                      ))}

                    {/* Category Total */}
                    <View style={[styles.tableRow, styles.categoryTotal]}>
                      <Text
                        style={[styles.tableCell, styles.tableCellService]}
                      ></Text>
                      <Text
                        style={[styles.tableCell, styles.tableCellDesc]}
                      ></Text>
                      <Text
                        style={[styles.tableCell, styles.tableCellQty]}
                      ></Text>
                      <Text
                        style={[
                          styles.tableCell,
                          styles.tableCellPrice,
                          { fontWeight: "bold" },
                        ]}
                      >
                        Category Total:
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          styles.tableCellTotal,
                          { fontWeight: "bold" },
                        ]}
                      >
                        {formatCurrency(category.categoryTotal || 0)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Grand Total */}
              <View style={styles.totalSection}>
                <Text style={styles.totalAmount}>
                  TOTAL: {formatCurrency(quoteData.total || totalAmount)}
                </Text>
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { fontWeight: "bold" }]}>
              Better Homes Studio
            </Text>
            <Text style={styles.footerText}>
              Building Excellence, Delivering Dreams
            </Text>
            <Text style={styles.footerText}>www.betterhomesstudio.co.uk</Text>
          </View>
        </Page>
      </Document>
    );

    // Generate and download the PDF
    const blob = await pdf(<QuoteDocument />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      filename || `quote-${quoteData.quoteNumber || quoteData.id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error generating vector PDF:", error);
    // Fallback to HTML-based PDF
    return await generatePrintOptimizedPDF(quoteData, filename);
  }
};

// Helper function to create a print-optimized HTML template
const createPrintTemplate = (quoteData) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

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

  const totalAmount =
    quoteData.services?.reduce(
      (total, cat) => total + (cat.categoryTotal || 0),
      0,
    ) || 0;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Quote ${quoteData.quoteNumber || quoteData.id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #374151;
          background: #ffffff;
          padding: 40px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #3b82f6;
        }
        
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #3b82f6;
        }
        
        .quote-info {
          text-align: right;
        }
        
        .quote-info h1 {
          font-size: 24px;
          margin-bottom: 5px;
          color: #1f2937;
        }
        
        .quote-info p {
          color: #6b7280;
          margin: 2px 0;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .info-item {
          margin-bottom: 10px;
        }
        
        .info-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 2px;
        }
        
        .info-value {
          color: #6b7280;
        }
        
        .description {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .services-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .services-table th {
          background: #3b82f6;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        
        .services-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .category-header {
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
        }
        
        .category-total {
          background: #fef3c7;
          font-weight: 600;
        }
        
        .total-section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          text-align: right;
          margin-top: 20px;
        }
        
        .total-amount {
          font-size: 24px;
          font-weight: bold;
          color: #3b82f6;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        
        @media print {
          body { padding: 20px; }
          .container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Better Homes Studio</div>
          <div class="quote-info">
            <h1>QUOTE</h1>
            <p><strong>Quote #:</strong> ${quoteData.quoteNumber || quoteData.id}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
            ${quoteData.validUntil ? `<p><strong>Valid Until:</strong> ${new Date(quoteData.validUntil).toLocaleDateString("en-GB")}</p>` : ""}
          </div>
        </div>
        
        <div class="info-grid">
          <div>
            <div class="section-title">Client Information</div>
            ${quoteData.client?.name ? `<div class="info-item"><div class="info-label">Name</div><div class="info-value">${quoteData.client.name}</div></div>` : ""}
            ${quoteData.client?.email ? `<div class="info-item"><div class="info-label">Email</div><div class="info-value">${quoteData.client.email}</div></div>` : ""}
            ${quoteData.client?.phone ? `<div class="info-item"><div class="info-label">Phone</div><div class="info-value">${quoteData.client.phone}</div></div>` : ""}
            ${quoteData.client?.address ? `<div class="info-item"><div class="info-label">Address</div><div class="info-value">${quoteData.client.address}</div></div>` : ""}
          </div>
          
          <div>
            <div class="section-title">Project Information</div>
            ${quoteData.title ? `<div class="info-item"><div class="info-label">Project</div><div class="info-value">${quoteData.title}</div></div>` : ""}
            ${quoteData.projectType ? `<div class="info-item"><div class="info-label">Type</div><div class="info-value">${formatProjectType(quoteData.projectType)}</div></div>` : ""}
            ${quoteData.projectAddress ? `<div class="info-item"><div class="info-label">Location</div><div class="info-value">${quoteData.projectAddress}</div></div>` : ""}
            ${quoteData.startDate ? `<div class="info-item"><div class="info-label">Start Date</div><div class="info-value">${new Date(quoteData.startDate).toLocaleDateString("en-GB")}</div></div>` : ""}
            ${quoteData.estimatedDuration ? `<div class="info-item"><div class="info-label">Duration</div><div class="info-value">${quoteData.estimatedDuration}</div></div>` : ""}
          </div>
        </div>
        
        ${
          quoteData.projectDescription
            ? `
        <div class="section">
          <div class="section-title">Project Description</div>
          <div class="description">${quoteData.projectDescription}</div>
        </div>
        `
            : ""
        }
        
        ${
          quoteData.services && quoteData.services.length > 0
            ? `
        <div class="section">
          <div class="section-title">Services Breakdown</div>
          <table class="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${quoteData.services
                .map(
                  (category) => `
                <tr class="category-header">
                  <td colspan="5"><strong>${category.categoryName}</strong></td>
                </tr>
                ${
                  category.items
                    ? category.items
                        .map(
                          (item) => `
                  <tr>
                    <td>${item.name || ""}</td>
                    <td>${item.description || ""}</td>
                    <td>${item.quantity || 0} ${item.unit || ""}</td>
                    <td>${formatCurrency(item.unitPrice || 0)}</td>
                    <td>${formatCurrency(item.total || 0)}</td>
                  </tr>
                `,
                        )
                        .join("")
                    : ""
                }
                <tr class="category-total">
                  <td colspan="4"><strong>Category Total</strong></td>
                  <td><strong>${formatCurrency(category.categoryTotal || 0)}</strong></td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-amount">
              TOTAL: ${formatCurrency(quoteData.total || totalAmount)}
            </div>
          </div>
        </div>
        `
            : ""
        }
        
        <div class="footer">
          <p><strong>Better Homes Studio</strong></p>
          <p>Building Excellence, Delivering Dreams</p>
          <p>www.betterhomesstudio.co.uk</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
