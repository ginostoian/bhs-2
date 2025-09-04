"use client";

import { useState } from "react";

const RevenueCalculator = () => {
  const [referrals, setReferrals] = useState(1);
  const [projectSize, setProjectSize] = useState("medium");

  const getReferralAmount = (size) => {
    switch (size) {
      case "small":
        return 500;
      case "medium":
        return 1500;
      case "large":
        return 3000;
      default:
        return 1500;
    }
  };

  const getProjectSizeLabel = (size) => {
    switch (size) {
      case "small":
        return "Small projects (under £50k)";
      case "medium":
        return "Medium projects (£50k - £200k)";
      case "large":
        return "Large projects (over £200k)";
      default:
        return "Medium projects (£50k - £200k)";
    }
  };

  const totalRevenue = referrals * getReferralAmount(projectSize);

  return (
    <div className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="rounded-xl bg-white p-8 shadow-lg lg:p-12">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 lg:text-4xl">
            Calculate Your Earning Potential
          </h2>
          <p className="text-lg text-gray-600">
            See how much you could earn by referring clients to Better Homes
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
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Typical project size
              </label>
              <div className="space-y-3">
                {[
                  {
                    value: "small",
                    label: "Small projects (under £50k)",
                    amount: "£500",
                  },
                  {
                    value: "medium",
                    label: "Medium projects (£50k - £200k)",
                    amount: "£1,500",
                  },
                  {
                    value: "large",
                    label: "Large projects (over £200k)",
                    amount: "£3,000",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center space-x-3"
                  >
                    <input
                      type="radio"
                      name="projectSize"
                      value={option.value}
                      checked={projectSize === option.value}
                      onChange={(e) => setProjectSize(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-gray-700">{option.label}</span>
                      <span className="ml-2 text-sm font-semibold text-blue-600">
                        {option.amount} per successful referral
                      </span>
                    </div>
                  </label>
                ))}
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
                  £{totalRevenue.toLocaleString()}
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
                  <span className="font-semibold">
                    £{getReferralAmount(projectSize).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Project type:</span>
                  <span className="max-w-[200px] text-right font-semibold">
                    {getProjectSizeLabel(projectSize)}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-blue-200 pt-6">
                <div className="mb-2 text-lg font-semibold text-gray-700">
                  Annual Potential
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  £{(totalRevenue * 12).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-4 text-gray-600">
            Ready to start earning? Join our partner program today!
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
