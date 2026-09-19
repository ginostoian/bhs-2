import test from "node:test";
import assert from "node:assert/strict";
import { calculateProjectFinancials } from "../libs/projectFinancials.mjs";

test("keeps purchases, expenses, invoices and payment plans separate", () => {
  const result = calculateProjectFinancials({
    expenses: [{ type: "Expense", amount: 100 }, { type: "Charge", amount: 20 }],
    itemPurchases: [{ paidPrice: 100 }],
    changes: [{ status: "Accepted", cost: 50 }, { status: "Review", cost: 200 }],
    payments: [{ project: null, status: "Due" }, { project: "p1", status: "Due" }],
    invoices: [{ total: 300, status: "sent" }, { total: 200, status: "paid" }],
    sourceQuote: { total: 1000, status: "won" },
    remainingCostEstimate: 400,
  });
  assert.equal(result.recordedExpenses, 100);
  assert.equal(result.recordedPurchases, 100);
  assert.equal(result.approvedChanges, 50);
  assert.equal(result.unpaidPayments.length, 1);
  assert.equal(result.invoiceTotal, 500);
  assert.equal(result.paidInvoices, 200);
  assert.equal(result.estimatedBalance, 550);
});

test("does not forecast from an unaccepted quote or missing remaining cost", () => {
  assert.equal(calculateProjectFinancials({ sourceQuote: { total: 1000, status: "draft" }, remainingCostEstimate: 300 }).estimatedBalance, null);
  assert.equal(calculateProjectFinancials({ sourceQuote: { total: 1000, clientResponse: "accepted" } }).estimatedBalance, null);
});
