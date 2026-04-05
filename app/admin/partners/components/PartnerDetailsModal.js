"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    projectValue: "",
    notes: "",
  });

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
    if (!form.customerName || !form.email) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/partners/${partnerId}/referrals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          projectValue: parseFloat(form.projectValue),
          notes: form.notes,
        }),
      });
      if (!res.ok) throw new Error("Failed to add referral");
      const data = await res.json();
      setPartner(data.partner);
      onPartnerUpdate?.(data.partner);
      setForm({
        customerName: "",
        email: "",
        phone: "",
        address: "",
        projectValue: "",
        notes: "",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const copyReferralLink = async () => {
    if (!partner?.referralLink) return;
    await navigator.clipboard.writeText(partner.referralLink);
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
                <div>
                  <p className="text-sm text-gray-500">Linked account</p>
                  <p className="font-medium text-gray-900">
                    {partner.user?.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account status</p>
                  <p className="font-medium text-gray-900">
                    {partner.accountStatus === "pending"
                      ? "Pending approval"
                      : "Active"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referral link</p>
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-gray-900">
                      {partner.referralLink || "—"}
                    </p>
                    {partner.referralLink && (
                      <button
                        type="button"
                        onClick={copyReferralLink}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        Copy
                      </button>
                    )}
                  </div>
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
                          Status
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">
                          Project Value
                        </th>
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
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                  r.status === "won"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : r.status === "lost"
                                      ? "bg-rose-100 text-rose-800"
                                      : r.status === "negotiations"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {r.status || "contacted"}
                              </span>
                            </td>
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
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Lead name
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
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, address: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
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
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, notes: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end md:col-span-2">
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
    </div>
  );
}
