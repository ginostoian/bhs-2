"use client";

import React, { useState } from "react";
import { downloadPDF } from "../lib/pdfGenerator";

const PDFDownload = ({ calculationResult, formData }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Try to send email to backend for lead capture
      let leadCaptured = false;
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, formData, calculationResult }),
        });

        if (response.ok) {
          leadCaptured = true;
        } else {
          console.warn(
            "Lead capture failed, but continuing with PDF generation",
          );
        }
      } catch (apiError) {
        console.warn(
          "API call failed, but continuing with PDF generation:",
          apiError,
        );
      }

      // Generate and download PDF (this should always work)
      downloadPDF(calculationResult, formData, email);

      setIsSubmitted(true);

      // Show appropriate message based on lead capture success
      if (!leadCaptured) {
        console.log("PDF downloaded successfully, but lead capture failed");
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      setError("There was an error generating your PDF. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">
              PDF Downloaded Successfully!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Your cost estimate has been downloaded. We&apos;ll also send you a
              copy via email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-blue-900">
            Download Your Cost Estimate
          </h3>
          <p className="mb-4 mt-1 text-sm text-blue-700">
            Get a detailed PDF report of your extension cost estimate. Enter
            your email to download.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-blue-900"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-blue-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-lg px-4 py-2 font-medium transition-colors ${
                isSubmitting
                  ? "cursor-not-allowed bg-blue-300 text-blue-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating PDF...
                </div>
              ) : (
                "Download PDF Report"
              )}
            </button>
          </form>

          <p className="mt-3 text-xs text-blue-600">
            By downloading, you agree to receive occasional updates about your
            project. We respect your privacy and won&apos;t spam you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFDownload;
