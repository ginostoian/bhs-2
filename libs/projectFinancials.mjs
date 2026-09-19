export function calculateProjectFinancials({ expenses = [], itemPurchases = [], changes = [], payments = [], invoices = [], sourceQuote = null, remainingCostEstimate = null }) {
  const amount = (item, field) => Number(item?.[field]) || 0;
  const recordedExpenses = expenses
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + amount(item, "amount"), 0);
  const recordedPurchases = itemPurchases.reduce((sum, item) => sum + amount(item, "paidPrice"), 0);
  const approvedChanges = changes
    .filter((item) => item.status === "Accepted")
    .reduce((sum, item) => sum + amount(item, "cost"), 0);
  const unpaidPayments = payments.filter((item) => item.project && item.status !== "Paid");
  const invoiceTotal = invoices.reduce((sum, item) => sum + amount(item, "total"), 0);
  const paidInvoices = invoices.filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + amount(item, "total"), 0);
  const agreedQuote = sourceQuote && (sourceQuote.status === "won" || sourceQuote.clientResponse === "accepted") ? sourceQuote : null;
  const estimatedBalance = agreedQuote && remainingCostEstimate != null
    ? amount(agreedQuote, "total") + approvedChanges - recordedExpenses - Number(remainingCostEstimate)
    : null;
  return { recordedExpenses, recordedPurchases, approvedChanges, unpaidPayments, invoiceTotal, paidInvoices, agreedQuote, estimatedBalance };
}
