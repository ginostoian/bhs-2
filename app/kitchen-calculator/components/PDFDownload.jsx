"use client";

import React, { useEffect, useState } from "react";
import { downloadPDF } from "../lib/pdfGenerator";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PDFDownload({ calculationResult, formData }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [startedAt, setStartedAt] = useState(Date.now());

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setServerMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!consent) {
      setError("Please confirm you agree to receive the estimate by email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/kitchen-calculator-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          consent,
          honeypot,
          startedAt,
          formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to save your estimate.");
      }

      setServerMessage(
        data?.emailSent
          ? "Your estimate has been emailed and downloaded."
          : "Your estimate was saved and downloaded, but email delivery could not be confirmed.",
      );

      downloadPDF(data?.estimate || calculationResult, formData, email.trim());
      setIsSubmitted(true);
    } catch (submitError) {
      setError(submitError.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
            ✓
          </div>
          <div>
            <h4 className="text-base font-semibold text-emerald-900">
              Estimate PDF sent
            </h4>
            <p className="mt-1 text-sm text-emerald-900">
              {serverMessage ||
                "We’ve sent the estimate to your email and downloaded a copy in your browser."}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setStartedAt(Date.now());
              }}
              className="mt-3 text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4"
            >
              Send to another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            Get the PDF Breakdown
          </p>
          <h4 className="mt-2 text-xl font-semibold tracking-tight text-stone-900">
            Email the estimate to yourself
          </h4>
          <p className="mt-2 text-sm text-stone-600">
            We&apos;ll save your kitchen estimate and email a PDF with the cost
            breakdown, assumptions, and practical next-step budgeting advice.
          </p>

          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              Included in the PDF
            </p>
            <ul className="mt-2 space-y-1 text-sm text-stone-700">
              <li>Low / expected / high budget range</li>
              <li>Installed-cost line-item breakdown</li>
              <li>Timeline and assumption checklist</li>
              <li>Useful next steps before asking for quotes</li>
            </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
        >
          <div className="space-y-3">
            <div>
              <label
                htmlFor="estimate-name"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Name (optional)
              </label>
              <input
                id="estimate-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>

            <div>
              <label
                htmlFor="estimate-email"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Email address
              </label>
              <input
                id="estimate-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="hidden" aria-hidden="true">
              <label htmlFor="company-website">Company website</label>
              <input
                id="company-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <label className="flex items-start gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-xs leading-relaxed text-stone-700">
                I agree to receive this estimate by email and understand it is a
                budgeting tool, not a fixed quotation.
              </span>
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </div>
            )}

            {serverMessage && !error && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {serverMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition ${
                isSubmitting
                  ? "cursor-wait bg-stone-300 text-stone-600"
                  : "bg-slate-900 text-white hover:bg-black"
              }`}
            >
              {isSubmitting ? "Saving & sending..." : "Email My PDF + Download"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
