"use client";

import { useState } from "react";

import Modal from "@/components/Modal";

const STATUS_STYLES = {
  contacted: "bg-slate-100 text-slate-700",
  negotiations: "bg-amber-100 text-amber-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-rose-100 text-rose-800",
};

const PROJECT_TYPE_OPTIONS = [
  "General",
  "Extension",
  "Loft",
  "Bathroom",
  "Kitchen",
  "Renovation",
];

function formatProjectTypes(projectTypes = []) {
  if (!Array.isArray(projectTypes) || projectTypes.length === 0) {
    return "General";
  }

  return projectTypes
    .map((type) => {
      switch (type) {
        case "Bathroom renovation":
          return "Bathroom";
        case "Kitchen renovation":
          return "Kitchen";
        case "Loft Conversion":
          return "Loft";
        case "Home renovation":
          return "Renovation";
        case "Extension":
          return "Extension";
        default:
          return type === "Custom" ? "General" : type;
      }
    })
    .join(", ");
}

export default function ReferrerDashboardClient({ initialPartner }) {
  const [partner, setPartner] = useState(initialPartner);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    postcode: "",
    phone: "",
    projectType: "General",
    details: "",
  });

  const referrals = partner.referrals || [];
  const wonCount = referrals.filter((item) => item.status === "won").length;
  const lostCount = referrals.filter((item) => item.status === "lost").length;
  const isApproved =
    (partner.accountStatus || "active") === "active" && partner.isActive !== false;

  const handleCopy = async () => {
    if (!isApproved) {
      return;
    }

    await navigator.clipboard.writeText(partner.referralLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/referrer/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.status === 409 && result.code === "LEAD_ALREADY_EXISTS") {
        setModalState({
          isOpen: true,
          title: "Already in Talks with BHS",
          message:
            "This lead is already in talks with BHS, so it cannot be added again from the referral dashboard.",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit referral");
      }

      setPartner(result.partner);
      setForm({
        name: "",
        email: "",
        postcode: "",
        phone: "",
        projectType: "General",
        details: "",
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {!isApproved && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            Pending Approval
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            Your referrer account is waiting for admin approval.
          </h2>
          <p className="mt-2 text-sm leading-6">
            You can sign in and view your dashboard, but your share link and
            referral form stay disabled until an admin activates your account.
          </p>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Your Referral Link
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            Share this link with clients you want us to contact.
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {isApproved
              ? "Anyone who gets in touch through this link is automatically attributed to your account and tracked here."
              : "Your link is ready, but attribution stays disabled until your account is approved."}
          </p>
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center">
            <code className="flex-1 break-all text-sm text-gray-800">
              {partner.referralLink}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!isApproved}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                isApproved
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Total referrals</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {referrals.length}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Won</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {wonCount}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Lost</p>
            <p className="mt-2 text-3xl font-bold text-rose-700">
              {lostCount}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Your referrals
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Follow where each introduction sits in the pipeline.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Referral
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Referred
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {referrals.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        No referrals yet. Submit one from the form or start
                        sharing your link.
                      </td>
                    </tr>
                  ) : (
                    referrals.map((referral) => (
                      <tr key={referral._id || referral.lead || referral.email}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {referral.customerName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {referral.email || "No email provided"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                              STATUS_STYLES[referral.status] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {referral.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatProjectTypes(referral.projectTypes)}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {referral.referredAt
                            ? new Date(referral.referredAt).toLocaleDateString(
                                "en-GB",
                              )
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Refer a person
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Submit a lead directly and it will be added to the CRM under your
            account.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                required
                disabled={!isApproved}
                value={form.name}
                onChange={(event) =>
                  handleInputChange("name", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                disabled={!isApproved}
                value={form.email}
                onChange={(event) =>
                  handleInputChange("email", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Postcode
                </label>
                <input
                  type="text"
                  required
                  disabled={!isApproved}
                  value={form.postcode}
                  onChange={(event) =>
                    handleInputChange("postcode", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm uppercase focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <input
                  type="tel"
                  required
                  disabled={!isApproved}
                  value={form.phone}
                  onChange={(event) =>
                    handleInputChange("phone", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Type of project
              </label>
              <select
                required
                disabled={!isApproved}
                value={form.projectType}
                onChange={(event) =>
                  handleInputChange("projectType", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
              >
                {PROJECT_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Details
              </label>
              <textarea
                rows={4}
                disabled={!isApproved}
                value={form.details}
                onChange={(event) =>
                  handleInputChange("details", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-100"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isApproved}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                isSubmitting || !isApproved
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit referral"}
            </button>
          </form>
        </div>
      </section>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, title: "", message: "" })}
        onConfirm={() =>
          setModalState({ isOpen: false, title: "", message: "" })
        }
        title={modalState.title}
        message={modalState.message}
        confirmText="Close"
        type="alert"
      />
    </div>
  );
}
