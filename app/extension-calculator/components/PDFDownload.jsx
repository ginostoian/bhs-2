"use client";

import React, { useState } from "react";
import { downloadPDF } from "../lib/pdfGenerator";
import Modal from "@/components/Modal";

const PDFDownload = ({ calculationResult, formData }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });

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

  const handleDownload = () => {
    // For now, just show a modal. In a real implementation, this would generate and download a PDF
    setModalState({
      isOpen: true,
      title: "PDF Download",
      message:
        "PDF download functionality would be implemented here. This would generate a detailed quote document.",
      type: "alert",
      confirmText: "OK",
    });
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
    <>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Download Your Quote</h4>
            <p className="text-sm text-gray-600">
              Get a detailed PDF quote for your records
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          })
        }
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        type={modalState.type}
      />
    </>
  );
};

export default PDFDownload;
