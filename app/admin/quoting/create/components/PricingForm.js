"use client";

export default function PricingForm({ formData, updateFormData }) {
  // Calculate totals
  const subtotal = formData.services.reduce(
    (sum, category) => sum + (category.categoryTotal || 0),
    0,
  );

  const labourCost = subtotal * 0.6 * formData.pricing.labourMultiplier;
  const materialsCost = subtotal * 0.4 * formData.pricing.materialsMultiplier;
  const baseSubtotal = labourCost + materialsCost;
  const overheads = baseSubtotal * (formData.pricing.overheadPercentage / 100);
  const profit = baseSubtotal * (formData.pricing.profitPercentage / 100);
  const contingency =
    baseSubtotal * (formData.pricing.contingencyPercentage / 100);
  const vat =
    (baseSubtotal + overheads + profit + contingency) *
    (formData.pricing.vatRate / 100);
  const total = baseSubtotal + overheads + profit + contingency + vat;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Pricing & Calculations
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Adjust pricing multipliers, overheads, profit margins, and other
          calculation settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Settings */}
        <div className="space-y-6">
          {/* Multipliers */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Pricing Multipliers
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Labour Multiplier
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.pricing.labourMultiplier}
                    onChange={(e) =>
                      updateFormData("pricing", {
                        labourMultiplier: parseFloat(e.target.value) || 1.0,
                      })
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">×</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Multiplier applied to labour costs (default: 1.0)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Materials Multiplier
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.pricing.materialsMultiplier}
                    onChange={(e) =>
                      updateFormData("pricing", {
                        materialsMultiplier: parseFloat(e.target.value) || 1.0,
                      })
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">×</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Multiplier applied to materials costs (default: 1.0)
                </p>
              </div>
            </div>
          </div>

          {/* Percentages */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Percentage Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Overhead Percentage
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.pricing.overheadPercentage}
                    onChange={(e) =>
                      updateFormData("pricing", {
                        overheadPercentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Percentage of subtotal for overheads (default: 15%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profit Percentage
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.pricing.profitPercentage}
                    onChange={(e) =>
                      updateFormData("pricing", {
                        profitPercentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Percentage of subtotal for profit margin (default: 20%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contingency Percentage
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.pricing.contingencyPercentage}
                    onChange={(e) =>
                      updateFormData("pricing", {
                        contingencyPercentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Percentage of subtotal for contingency (default: 10%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  VAT Rate
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.pricing.vatRate}
                    onChange={(e) =>
                      updateFormData("pricing", {
                        vatRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  VAT rate applied to final total (default: 20%)
                </p>
              </div>
            </div>
          </div>

          {/* Deposit Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Deposit Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="deposit-required"
                  checked={formData.pricing.depositRequired}
                  onChange={(e) =>
                    updateFormData("pricing", {
                      depositRequired: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="deposit-required"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Deposit Required
                </label>
              </div>

              {formData.pricing.depositRequired && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deposit Amount (£)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.depositAmount}
                      onChange={(e) =>
                        updateFormData("pricing", {
                          depositAmount: parseFloat(e.target.value) || 0,
                          depositPercentage: 0,
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g., 1000"
                    />
                  </div>

                  <div className="text-center text-sm text-gray-500">OR</div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deposit Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.pricing.depositPercentage}
                      onChange={(e) =>
                        updateFormData("pricing", {
                          depositPercentage: parseFloat(e.target.value) || 0,
                          depositAmount: 0,
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Calculations */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Cost Breakdown
            </h3>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-sm text-gray-600">
                  Services Subtotal:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  £{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-sm text-gray-600">Labour Cost:</span>
                <span className="text-sm font-medium text-gray-900">
                  £{labourCost.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-sm text-gray-600">Materials Cost:</span>
                <span className="text-sm font-medium text-gray-900">
                  £{materialsCost.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-sm text-gray-600">Base Subtotal:</span>
                <span className="text-sm font-medium text-gray-900">
                  £{baseSubtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-sm text-gray-600">
                  Overheads ({formData.pricing.overheadPercentage}%):
                </span>
                <span className="text-sm font-medium text-gray-900">
                  £{overheads.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-sm text-gray-600">
                  Profit ({formData.pricing.profitPercentage}%):
                </span>
                <span className="text-sm font-medium text-gray-900">
                  £{profit.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-sm text-gray-600">
                  Contingency ({formData.pricing.contingencyPercentage}%):
                </span>
                <span className="text-sm font-medium text-gray-900">
                  £{contingency.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-sm text-gray-600">
                  VAT ({formData.pricing.vatRate}%):
                </span>
                <span className="text-sm font-medium text-gray-900">
                  £{vat.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-between border-t-2 border-gray-200 py-4">
              <span className="text-base font-bold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                £{total.toFixed(2)}
              </span>
            </div>

            {formData.pricing.depositRequired && (
              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    Deposit Required:
                  </span>
                  <span className="text-sm font-bold text-blue-900">
                    £
                    {formData.pricing.depositAmount > 0
                      ? formData.pricing.depositAmount.toFixed(2)
                      : (
                          (total * formData.pricing.depositPercentage) /
                          100
                        ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
