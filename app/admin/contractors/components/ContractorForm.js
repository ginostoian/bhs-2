"use client";

import { useEffect, useMemo, useState } from "react";

export default function ContractorForm({
  isOpen,
  onClose,
  onSubmit,
  contractor,
  mode,
  isSubmitting,
  trades,
  priceTiers,
  experiences,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    trades: [],
    customTrade: "",
    priceTier: "££",
    experience: "Good",
    isActive: true,
    notes: "",
  });

  useEffect(() => {
    if (isOpen && contractor) {
      setFormData({
        name: contractor.name || "",
        email: contractor.email || "",
        phone: contractor.phone || "",
        address: contractor.address || "",
        trades: contractor.trades || [],
        customTrade: "",
        priceTier: contractor.priceTier || "££",
        experience: contractor.experience || "Good",
        isActive: contractor.isActive !== false,
        notes: contractor.notes || "",
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        trades: [],
        customTrade: "",
        priceTier: "££",
        experience: "Good",
        isActive: true,
        notes: "",
      });
    }
  }, [isOpen, contractor]);

  const tradeOptions = useMemo(
    () =>
      Array.from(
        new Set([
          "plumber",
          "electrician",
          "multi trader",
          "tiler",
          "bathroom fitter",
          "kitchen fitter",
          "extension",
          "loft",
          "carpenter",
          "plasterer",
          "labour",
          ...(trades || []),
        ]),
      ),
    [trades],
  );

  const toggleTrade = (trade) => {
    setFormData((prev) => {
      const has = prev.trades.includes(trade);
      return {
        ...prev,
        trades: has
          ? prev.trades.filter((t) => t !== trade)
          : [...prev.trades, trade],
      };
    });
  };

  const addCustomTrade = () => {
    const t = formData.customTrade.trim();
    if (!t) return;
    if (!formData.trades.includes(t)) {
      setFormData((prev) => ({
        ...prev,
        trades: [...prev.trades, t],
        customTrade: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, customTrade: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please add a name");
      return;
    }
    const payload = { ...formData, trades: formData.trades };
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === "create" ? "Add Contractor" : "Edit Contractor"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, address: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trade(s)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {tradeOptions.map((t) => (
                    <label
                      key={t}
                      className="flex cursor-pointer items-center space-x-2 rounded border border-gray-200 p-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.trades.includes(t)}
                        onChange={() => toggleTrade(t)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{t}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.customTrade}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        customTrade: e.target.value,
                      }))
                    }
                    placeholder="Add custom trade"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomTrade}
                    className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <select
                  value={formData.priceTier}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, priceTier: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priceTiers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Past Experience
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, experience: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {experiences.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, isActive: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Contractor is active
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, notes: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Contractor"
                    : "Update Contractor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
