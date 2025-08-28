"use client";

export default function PricingForm({ formData, updateFormData }) {
  // Check if template is being used
  const isUsingTemplate = formData.template;

  // Calculate simple total
  const total = formData.services.reduce(
    (sum, category) => sum + (category.categoryTotal || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Pricing & Deposit Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure deposit requirements and VAT settings for this quote.
        </p>
        {isUsingTemplate && (
          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-600"></div>
              <span className="text-sm text-green-800">
                Template pricing loaded. You can adjust these values as needed
                for this specific quote.
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Settings */}
        <div className="space-y-6">
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
                    updateFormData({
                      pricing: {
                        ...formData.pricing,
                        depositRequired: e.target.checked,
                      },
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
                        updateFormData({
                          pricing: {
                            ...formData.pricing,
                            depositAmount: parseFloat(e.target.value) || 0,
                            depositPercentage: 0,
                          },
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
                        updateFormData({
                          pricing: {
                            ...formData.pricing,
                            depositPercentage: parseFloat(e.target.value) || 0,
                            depositAmount: 0,
                          },
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

        {/* Right Column - Simple Total */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Quote Summary
            </h3>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-blue-600">
                £{total.toFixed(2)}
              </div>
              <p className="mb-6 text-lg text-gray-700">Total Quote Amount</p>
              <div className="text-sm text-gray-600">
                <p>• Simple, transparent pricing</p>
                <p>• No hidden costs or margins</p>
                <p>• What you see is what you pay</p>
              </div>
            </div>

            {formData.pricing.depositRequired && (
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <div className="text-center">
                  <h4 className="mb-2 text-sm font-medium text-blue-900">
                    Deposit Required
                  </h4>
                  <div className="text-xl font-bold text-blue-900">
                    £
                    {formData.pricing.depositAmount > 0
                      ? formData.pricing.depositAmount.toFixed(2)
                      : (
                          (total * formData.pricing.depositPercentage) /
                          100
                        ).toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
