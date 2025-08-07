"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";

export default function PartnerDetailsModal({
  isOpen,
  onClose,
  partnerId,
  onPartnerUpdate,
}) {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ customerName: "", projectValue: "" });
  const [confirm, setConfirm] = useState({ isOpen: false, onConfirm: null });

  useEffect(() => {
    const fetchPartner = async () => {
      if (!partnerId || !isOpen) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/partners/${partnerId}`);
        const data = await res.json();
        setPartner(data.partner || null);
      } catch (e) {
        setError("Failed to load partner");
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [partnerId, isOpen]);

  const totalValue = useMemo(() => {
    return (partner?.referrals || []).reduce(
      (sum, r) => sum + (r.projectValue || 0),
      0,
    );
  }, [partner]);

  const addReferral = async () => {
    if (!form.customerName || !form.projectValue) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/partners/${partnerId}/referrals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          projectValue: parseFloat(form.projectValue),
        }),
      });
      if (!res.ok) throw new Error("Failed to add referral");
      const data = await res.json();
      setPartner(data.partner);
      onPartnerUpdate?.(data.partner);
      setForm({ customerName: "", projectValue: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const deleteReferral = async (referralId) => {
    try {
      const res = await fetch(
        `/api/partners/${partnerId}/referrals/${referralId}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Failed to delete referral");
      const data = await res.json();
      setPartner(data.partner);
      onPartnerUpdate?.(data.partner);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="my-8 w-full max-w-3xl rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Partner Details
            </h3>
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

          {loading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : !partner ? (
            <p className="text-gray-600">Partner not found</p>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{partner.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p className="font-medium text-gray-900">
                    {partner.occupation || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {partner.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {partner.phone || "—"}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-md font-semibold text-gray-900">
                  Referrals
                </h4>
                <div className="text-sm text-gray-600">
                  Total value: £
                  {totalValue.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              <div className="mb-4 rounded-lg border border-gray-200">
                <div className="max-h-72 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">
                          Customer
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">
                          Project Value
                        </th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(partner.referrals || []).length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-6 text-center text-gray-500"
                          >
                            No referrals yet
                          </td>
                        </tr>
                      ) : (
                        partner.referrals.map((r) => (
                          <tr key={r._id}>
                            <td className="px-4 py-2">
                              {new Date(r.referredAt).toLocaleDateString(
                                "en-GB",
                              )}
                            </td>
                            <td className="px-4 py-2">{r.customerName}</td>
                            <td className="px-4 py-2">
                              £
                              {Number(r.projectValue || 0).toLocaleString(
                                "en-GB",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                onClick={() =>
                                  setConfirm({
                                    isOpen: true,
                                    onConfirm: () => deleteReferral(r._id),
                                  })
                                }
                                className="rounded-md bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, customerName: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Project Value (GBP)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.projectValue}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, projectValue: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end md:col-span-1">
                    <button
                      disabled={adding}
                      onClick={addReferral}
                      className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {adding ? "Adding..." : "Add Referral"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ isOpen: false, onConfirm: null })}
        onConfirm={() => {
          confirm.onConfirm?.();
          setConfirm({ isOpen: false, onConfirm: null });
        }}
        title="Delete referral"
        message="Are you sure you want to remove this referral?"
        confirmText="Remove"
        cancelText="Cancel"
        type="confirm"
      />
    </div>
  );
}
