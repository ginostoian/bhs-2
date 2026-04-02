"use client";

import { useState } from "react";

const MIN_COMMISSION = 350;
const MAX_COMMISSION = 5000;
const COMMISSION_RATE = 0.025;

const RevenueCalculator = () => {
  const [referrals, setReferrals] = useState(1);
  const [projectValue, setProjectValue] = useState(50000);

  const getReferralAmount = (value) =>
    Math.min(
      MAX_COMMISSION,
      Math.max(MIN_COMMISSION, Math.round(value * COMMISSION_RATE))
    );

  const formatCurrency = (value) => `£${value.toLocaleString()}`;

  const commissionPerReferral = getReferralAmount(projectValue);
  const totalRevenue = referrals * commissionPerReferral;

  return (
    <div className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="rounded-xl bg-white p-8 shadow-lg lg:p-12">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 lg:text-4xl">
            Calculate Your Earning Potential
          </h2>
          <p className="text-lg text-gray-600">
            Estimate your referral earnings based on project value
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Number of successful referrals per month
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setReferrals(Math.max(1, referrals - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600 transition-colors hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  value={referrals}
                  onChange={(e) =>
                    setReferrals(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 rounded-lg border-2 border-gray-200 py-2 text-center text-2xl font-bold text-gray-800"
                  min="1"
                />
                <button
                  onClick={() => setReferrals(referrals + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600 transition-colors hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Typical project value
              </label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold text-gray-500">£</span>
                  <input
                    type="number"
                    value={projectValue}
                    onChange={(e) =>
                      setProjectValue(Math.max(0, parseInt(e.target.value, 10) || 0))
                    }
                    className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-2xl font-bold text-gray-800"
                    min="0"
                    step="1000"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Commission is 2.5% of project value, with a minimum of £350 and
                  a cap of £5,000 per successful referral.
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 lg:p-8">
            <div className="text-center">
              <h3 className="mb-4 text-xl font-semibold text-gray-700">
                Your Monthly Earning Potential
              </h3>

              <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-2 text-4xl font-bold text-blue-600 lg:text-5xl">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="text-gray-600">per month</div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Referrals per month:</span>
                  <span className="font-semibold">{referrals}</span>
                </div>
                <div className="flex justify-between">
                  <span>Per referral:</span>
                  <span className="font-semibold">{formatCurrency(commissionPerReferral)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Project value:</span>
                  <span className="max-w-[200px] text-right font-semibold">
                    {formatCurrency(projectValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Commission formula:</span>
                  <span className="max-w-[200px] text-right font-semibold">
                    2.5% (min £350, max £5,000)
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-blue-200 pt-6">
                <div className="mb-2 text-lg font-semibold text-gray-700">
                  Annual Potential
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalRevenue * 12)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-4 text-gray-600">
            Ready to start earning? Join our referral program today!
          </p>
          <a
            href="https://tally.so/r/nPvjxV"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
          >
            Start Your Application
          </a>
        </div>
      </div>
    </div>
  );
};

export default RevenueCalculator;
