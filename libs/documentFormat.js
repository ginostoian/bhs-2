// Formatting shared by the quote/invoice web views and their PDFs (libs/pdf).
export const company = {
  name: "Better Homes",
  tagline: "Extensions · Loft Conversions · Renovations",
  location: "London, United Kingdom",
  website: "bhstudio.co.uk",
  phone: "07922 391591",
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount) || 0);

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatProjectType = (type) =>
  type ? type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "";

// Paid / Overdue / otherwise the capitalised status
export const invoiceStatusLabel = (invoice) => {
  if (invoice.status === "paid") return "Paid";
  if (invoice.isOverdue) return "Overdue";
  const label = String(invoice.status || "");
  return label.charAt(0).toUpperCase() + label.slice(1);
};
