"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = [
  { value: "contacted", label: "Contacted", stage: "Lead" },
  { value: "negotiations", label: "Negotiations", stage: "Negotiations" },
  { value: "won", label: "Won", stage: "Won" },
  { value: "lost", label: "Lost", stage: "Lost" },
];

function getStatusClasses(status) {
  if (status === "won") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "lost") {
    return "bg-rose-100 text-rose-800";
  }

  if (status === "negotiations") {
    return "bg-amber-100 text-amber-800";
  }

  return "bg-slate-100 text-slate-700";
}

function getStageForStatus(status) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.stage || "Lead";
}

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
  const [editingReferralId, setEditingReferralId] = useState(null);
  const [savingReferralId, setSavingReferralId] = useState(null);
  const [referralForm, setReferralForm] = useState({
    status: "contacted",
    projectValue: "",
  });
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    projectValue: "",
    notes: "",
  });

  const loadPartner = useCallback(async () => {
    if (!partnerId || !isOpen) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/partners/${partnerId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load partner");
      }

      setPartner(data.partner || null);
      return data.partner || null;
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load partner");
      return null;
    } finally {
      setLoading(false);
    }
  }, [isOpen, partnerId]);

  useEffect(() => {
    loadPartner();
  }, [loadPartner]);

  const totalValue = useMemo(() => {
    return (partner?.referrals || []).reduce(
      (sum, referral) => sum + (referral.projectValue || 0),
      0,
    );
  }, [partner]);

  const addReferral = async () => {
    if (!form.customerName || !form.email) {
      return;
    }

    setAdding(true);
    setError("");

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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add referral");
      }

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
    } catch (addError) {
      setError(addError.message || "Failed to add referral");
    } finally {
      setAdding(false);
    }
  };

  const copyReferralLink = async () => {
    if (!partner?.referralLink) {
      return;
    }

    await navigator.clipboard.writeText(partner.referralLink);
  };

  const startEditingReferral = (referral) => {
    setEditingReferralId(referral._id);
    setReferralForm({
      status: referral.status || "contacted",
      projectValue: String(referral.projectValue || ""),
    });
  };

  const cancelEditingReferral = () => {
    setEditingReferralId(null);
    setSavingReferralId(null);
    setReferralForm({
      status: "contacted",
      projectValue: "",
    });
  };

  const saveReferral = async (referral) => {
    if (!referral.lead) {
      setError("This referral is not linked to a CRM lead, so it cannot be edited here.");
      return;
    }

    setSavingReferralId(referral._id);
    setError("");

    try {
      const res = await fetch(`/api/crm/leads/${referral.lead}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: getStageForStatus(referralForm.status),
          value: Number(referralForm.projectValue || 0),
          changeComment: "Updated from partner referral record",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update referral");
      }

      const refreshedPartner = await loadPartner();
      if (refreshedPartner) {
        onPartnerUpdate?.(refreshedPartner);
      }
      cancelEditingReferral();
    } catch (saveError) {
      setError(saveError.message || "Failed to update referral");
      setSavingReferralId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="my-8 w-full max-w-4xl rounded-lg bg-white shadow-xl">
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
          ) : !partner ? (
            <p className="text-gray-600">Partner not found</p>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

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
                <div className="md:col-span-2">
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
                <div>
                  <h4 className="text-md font-semibold text-gray-900">
                    Referrals
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Status and value are saved back to the CRM lead.
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  Total value: £
                  {totalValue.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              <div className="mb-6 rounded-lg border border-gray-200">
                <div className="max-h-80 overflow-y-auto">
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
                        <th className="px-4 py-2 text-left font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(partner.referrals || []).length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-6 text-center text-gray-500"
                          >
                            No referrals yet
                          </td>
                        </tr>
                      ) : (
                        partner.referrals.map((referral) => {
                          const isEditing = editingReferralId === referral._id;
                          const isSaving = savingReferralId === referral._id;

                          return (
                            <tr key={referral._id}>
                              <td className="px-4 py-3 align-top">
                                {referral.referredAt
                                  ? new Date(referral.referredAt).toLocaleDateString(
                                      "en-GB",
                                    )
                                  : "—"}
                              </td>
                              <td className="px-4 py-3 align-top">
                                <div className="font-medium text-gray-900">
                                  {referral.customerName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {referral.email || "No email"}
                                </div>
                              </td>
                              <td className="px-4 py-3 align-top">
                                {isEditing ? (
                                  <select
                                    value={referralForm.status}
                                    onChange={(event) =>
                                      setReferralForm((prev) => ({
                                        ...prev,
                                        status: event.target.value,
                                      }))
                                    }
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                  >
                                    {STATUS_OPTIONS.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                      referral.status,
                                    )}`}
                                  >
                                    {referral.status || "contacted"}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 align-top">
                                {isEditing ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">£</span>
                                    <input
                                      type="number"
                                      min="0"
                                      step="1000"
                                      value={referralForm.projectValue}
                                      onChange={(event) =>
                                        setReferralForm((prev) => ({
                                          ...prev,
                                          projectValue: event.target.value,
                                        }))
                                      }
                                      className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    £
                                    {Number(referral.projectValue || 0).toLocaleString(
                                      "en-GB",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      },
                                    )}
                                  </>
                                )}
                              </td>
                              <td className="px-4 py-3 align-top">
                                <div className="flex flex-wrap gap-2">
                                  {isEditing ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => saveReferral(referral)}
                                        disabled={isSaving}
                                        className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {isSaving ? "Saving..." : "Save"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={cancelEditingReferral}
                                        disabled={isSaving}
                                        className="rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => startEditingReferral(referral)}
                                      disabled={!referral.lead}
                                      className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      Edit
                                    </button>
                                  )}
                                </div>
                                {!referral.lead && (
                                  <p className="mt-2 text-xs text-amber-600">
                                    This entry is not linked to a CRM lead.
                                  </p>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-4 text-md font-semibold text-gray-900">
                  Add Referral Manually
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Customer name"
                    value={form.customerName}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        customerName: event.target.value,
                      }))
                    }
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={form.address}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, address: event.target.value }))
                    }
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Project value"
                    value={form.projectValue}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        projectValue: event.target.value,
                      }))
                    }
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={form.notes}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, notes: event.target.value }))
                    }
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={addReferral}
                    disabled={adding}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {adding ? "Adding..." : "Add referral"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
