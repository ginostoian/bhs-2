"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import CommentModal from "./CommentModal";

/**
 * Moodboard View Component
 * Displays moodboard with collapsible sections and interactive product cards
 */
export default function MoodboardView({
  moodboard,
  sections: initialSections,
}) {
  const [sections, setSections] = useState(initialSections);
  const [collapsedSections, setCollapsedSections] = useState(
    new Set(sections.filter((s) => s.isCollapsed).map((s) => s.id)),
  );
  const [commentModal, setCommentModal] = useState({
    isOpen: false,
    product: null,
    sectionId: null,
  });

  // Toggle section collapse
  const toggleSection = (sectionId) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    setCollapsedSections(newCollapsed);
  };

  // Handle product approval status change
  const handleApprovalChange = async (sectionId, productId, approvalStatus) => {
    try {
      const response = await fetch(
        `/api/moodboards/${moodboard.id}/sections/${sectionId}/products/${productId}/approval`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approvalStatus }),
        },
      );

      if (!response.ok) throw new Error("Failed to update approval status");

      // Update local state
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                products: section.products.map((product) =>
                  product.id === productId
                    ? { ...product, approvalStatus }
                    : product,
                ),
              }
            : section,
        ),
      );
    } catch (error) {
      console.error("Error updating approval status:", error);
      alert("Failed to update approval status. Please try again.");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (comment) => {
    try {
      const response = await fetch(
        `/api/moodboards/${moodboard.id}/sections/${commentModal.sectionId}/products/${commentModal.product.id}/approval`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userComment: comment }),
        },
      );

      if (!response.ok) throw new Error("Failed to save comment");

      // Update local state
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === commentModal.sectionId
            ? {
                ...section,
                products: section.products.map((product) =>
                  product.id === commentModal.product.id
                    ? { ...product, userComment: comment }
                    : product,
                ),
              }
            : section,
        ),
      );

      setCommentModal({ isOpen: false, product: null, sectionId: null });
    } catch (error) {
      console.error("Error saving comment:", error);
      alert("Failed to save comment. Please try again.");
    }
  };

  // Calculate total price for all approved products
  const totalPrice = sections.reduce((total, section) => {
    return (
      total +
      section.products.reduce((sectionTotal, product) => {
        if (product.approvalStatus === "approved") {
          const price = product.customPrice || product.product.price;
          return sectionTotal + price * product.quantity;
        }
        return sectionTotal;
      }, 0)
    );
  }, 0);

  // Count approved and declined products
  const approvedCount = sections.reduce((count, section) => {
    return (
      count +
      section.products.filter((p) => p.approvalStatus === "approved").length
    );
  }, 0);

  const declinedCount = sections.reduce((count, section) => {
    return (
      count +
      section.products.filter((p) => p.approvalStatus === "declined").length
    );
  }, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/moodboards"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to Moodboards
          </Link>
        </div>

        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{moodboard.name}</h1>
          {moodboard.description && (
            <p className="mt-2 text-lg text-gray-600">
              {moodboard.description}
            </p>
          )}
          {moodboard.projectType && (
            <p className="mt-1 text-sm text-gray-500">
              Project: {moodboard.projectType}
            </p>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Summary</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {sections.length}
            </div>
            <div className="text-sm text-blue-600">Sections</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {approvedCount}
            </div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <div className="text-2xl font-bold text-red-600">
              {declinedCount}
            </div>
            <div className="text-sm text-red-600">Declined</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              £{totalPrice.toFixed(2)}
            </div>
            <div className="text-sm text-purple-600">Total (Approved)</div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className="rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            {/* Section Header */}
            <div
              className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: section.color }}
                >
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.name}
                  </h3>
                  {section.description && (
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {section.products.length} products
                </span>
                <svg
                  className={`h-5 w-5 transform text-gray-400 transition-transform ${
                    collapsedSections.has(section.id) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Section Content */}
            {!collapsedSections.has(section.id) && (
              <div className="border-t border-gray-200 p-4">
                {section.products.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No products in this section
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {section.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        sectionId={section.id}
                        moodboardId={moodboard.id}
                        onApprovalChange={handleApprovalChange}
                        onCommentClick={() =>
                          setCommentModal({
                            isOpen: true,
                            product,
                            sectionId: section.id,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={commentModal.isOpen}
        onClose={() =>
          setCommentModal({ isOpen: false, product: null, sectionId: null })
        }
        onSubmit={handleCommentSubmit}
        product={commentModal.product}
      />
    </div>
  );
}
