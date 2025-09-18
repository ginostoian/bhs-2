"use client";

import { useState } from "react";
import Link from "next/link";
import SectionManager from "./SectionManager";
import AddSectionModal from "./AddSectionModal";
import AddProductModal from "./AddProductModal";
import Modal from "@/components/Modal";

/**
 * Designer Moodboard Manager Component
 * Manages a specific moodboard with sections and products
 */
export default function DesignerMoodboardManager({
  moodboard: initialMoodboard,
  sections: initialSections,
  allProducts,
  categories,
  suppliers,
}) {
  const [moodboard, setMoodboard] = useState(initialMoodboard);
  const [sections, setSections] = useState(initialSections);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });
  const [sectionModal, setSectionModal] = useState({
    isOpen: false,
    section: null,
    mode: "create",
  });
  const [productModal, setProductModal] = useState({
    isOpen: false,
    sectionId: null,
  });

  // Handle section creation/update
  const handleSectionSubmit = async (sectionData) => {
    setIsSubmitting(true);
    try {
      const url =
        sectionModal.mode === "create"
          ? `/api/moodboards/${moodboard.id}/sections`
          : `/api/moodboards/${moodboard.id}/sections/${sectionModal.section.id}`;

      const method = sectionModal.mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) throw new Error("Failed to save section");

      const { section } = await response.json();

      if (sectionModal.mode === "create") {
        setSections((prev) => [...prev, section]);
      } else {
        setSections((prev) =>
          prev.map((s) => (s.id === section.id ? section : s)),
        );
      }

      setSectionModal({ isOpen: false, section: null, mode: "create" });
    } catch (error) {
      console.error("Error saving section:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to save section. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle section deletion
  const handleSectionDelete = async (sectionId) => {
    try {
      const response = await fetch(
        `/api/moodboards/${moodboard.id}/sections/${sectionId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete section");

      setSections((prev) => prev.filter((s) => s.id !== sectionId));
    } catch (error) {
      console.error("Error deleting section:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete section. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  };

  // Handle product addition
  const handleProductSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/moodboards/${moodboard.id}/sections/${productModal.sectionId}/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        },
      );

      if (!response.ok) throw new Error("Failed to add product");

      const { product } = await response.json();

      setSections((prev) =>
        prev.map((section) =>
          section.id === productModal.sectionId
            ? {
                ...section,
                products: [...(section.products || []), product],
              }
            : section,
        ),
      );

      setProductModal({ isOpen: false, sectionId: null });
    } catch (error) {
      console.error("Error adding product:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to add product. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle product deletion
  const handleProductDelete = async (sectionId, productId) => {
    try {
      const response = await fetch(
        `/api/moodboards/${moodboard.id}/sections/${sectionId}/products/${productId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete product");

      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                products: section.products.filter((p) => p.id !== productId),
              }
            : section,
        ),
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete product. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  };

  // Handle product update
  const handleProductUpdate = async (sectionId, productId, productData) => {
    try {
      const response = await fetch(
        `/api/moodboards/${moodboard.id}/sections/${sectionId}/products/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        },
      );

      if (!response.ok) throw new Error("Failed to update product");

      const { product } = await response.json();

      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                products: (section.products || []).map((p) =>
                  p.id === productId ? product : p,
                ),
              }
            : section,
        ),
      );
    } catch (error) {
      console.error("Error updating product:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to update product. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  };

  // Handle moodboard status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(`/api/moodboards/${moodboard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update moodboard status");

      const { moodboard: updatedMoodboard } = await response.json();
      setMoodboard(updatedMoodboard);

      setModalState({
        isOpen: true,
        title: "Success",
        message: `Moodboard status updated to ${newStatus}`,
        type: "alert",
        confirmText: "OK",
      });
    } catch (error) {
      console.error("Error updating moodboard status:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to update moodboard status. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      shared: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate statistics
  const totalProducts = sections.reduce(
    (total, section) => total + (section.products?.length || 0),
    0,
  );
  const approvedProducts = sections.reduce(
    (total, section) =>
      total +
      (section.products?.filter((p) => p.approvalStatus === "approved")
        .length || 0),
    0,
  );
  const declinedProducts = sections.reduce(
    (total, section) =>
      total +
      (section.products?.filter((p) => p.approvalStatus === "declined")
        .length || 0),
    0,
  );
  const totalPrice = sections.reduce((total, section) => {
    return (
      total +
      (section.products?.reduce((sectionTotal, product) => {
        if (product.approvalStatus === "approved") {
          const price = product.customPrice || product.product?.price || 0;
          return sectionTotal + price * product.quantity;
        }
        return sectionTotal;
      }, 0) || 0)
    );
  }, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/designer/moodboards"
            className="text-purple-600 hover:text-purple-800 hover:underline"
          >
            ← Back to Moodboards
          </Link>
        </div>

        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{moodboard.name}</h1>
          <p className="mt-2 text-lg text-gray-600">
            For: {moodboard.user.name || moodboard.user.email}
          </p>
          {moodboard.description && (
            <p className="mt-1 text-gray-600">{moodboard.description}</p>
          )}
          {moodboard.projectType && (
            <p className="mt-1 text-sm text-gray-500">
              Project: {moodboard.projectType}
            </p>
          )}

          {/* Status Management */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {getStatusBadge(moodboard.status)}
            </div>
            <select
              value={moodboard.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="draft">Draft</option>
              <option value="shared">Shared</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Moodboard Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {sections.length}
            </div>
            <div className="text-sm text-purple-600">Sections</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-2xl font-bold text-gray-600">
              {totalProducts}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {approvedProducts}
            </div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <div className="text-2xl font-bold text-red-600">
              {declinedProducts}
            </div>
            <div className="text-sm text-red-600">Declined</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              £{totalPrice.toFixed(2)}
            </div>
            <div className="text-sm text-blue-600">Total (Approved)</div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <SectionManager
            key={section.id}
            section={section}
            moodboardId={moodboard.id}
            onSectionUpdate={(sectionData) => handleSectionSubmit(sectionData)}
            onSectionDelete={() => handleSectionDelete(section.id)}
            onProductDelete={(productId) =>
              handleProductDelete(section.id, productId)
            }
            onProductUpdate={(productId, productData) =>
              handleProductUpdate(section.id, productId, productData)
            }
            onAddProduct={() =>
              setProductModal({ isOpen: true, sectionId: section.id })
            }
          />
        ))}

        {/* Add Section Button */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <button
            onClick={() =>
              setSectionModal({ isOpen: true, section: null, mode: "create" })
            }
            className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Section
          </button>
        </div>
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No sections yet
          </h3>
          <p className="text-gray-600">
            Get started by creating your first section for this moodboard.
          </p>
        </div>
      )}

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={sectionModal.isOpen}
        onClose={() =>
          setSectionModal({ isOpen: false, section: null, mode: "create" })
        }
        onSubmit={handleSectionSubmit}
        section={sectionModal.section}
        mode={sectionModal.mode}
        isSubmitting={isSubmitting}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={productModal.isOpen}
        onClose={() => setProductModal({ isOpen: false, sectionId: null })}
        onSubmit={handleProductSubmit}
        sectionId={productModal.sectionId}
        allProducts={allProducts}
        categories={categories}
        suppliers={suppliers}
        isSubmitting={isSubmitting}
      />

      {/* Confirmation Modal */}
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
        onConfirm={() => {
          if (modalState.onConfirm) {
            modalState.onConfirm();
          }
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          });
        }}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </div>
  );
}
