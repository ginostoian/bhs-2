import { renderDocument } from "@formepdf/core";
import { InvoiceDocument } from "./InvoiceDocument";
import { QuoteDocument } from "./QuoteDocument";

export const renderQuotePdf = (quote) =>
  renderDocument(<QuoteDocument quote={quote} />);

export const renderInvoicePdf = (invoice) =>
  renderDocument(<InvoiceDocument invoice={invoice} />);

// Inline-safe filename for Content-Disposition
export const pdfFilename = (prefix, reference) =>
  `${prefix}-${String(reference || "document").replace(/[^A-Za-z0-9._-]+/g, "-")}.pdf`;
