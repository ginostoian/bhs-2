"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";

const PDFDownload = ({ calculationResult, formData }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });

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
