"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import EditSectionModal from "./EditSectionModal";
import EditProductModal from "./EditProductModal";
import AdminCommentModal from "./AdminCommentModal";

/**
 * Section Manager Component
 * Manages a section with its products
 */
export default function SectionManager({
  section,
  moodboardId,
  onSectionUpdate,
  onSectionDelete,
  onProductDelete,
  onProductUpdate,
  onAdminCommentUpdate,
  onAddProduct,
}) {
  const [editSectionModal, setEditSectionModal] = useState({
    isOpen: false,
  });
  const [editProductModal, setEditProductModal] = useState({
    isOpen: false,
    product: null,
  });
  const [adminCommentModal, setAdminCommentModal] = useState({
    isOpen: false,
    product: null,
  });

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);
  };

  // Calculate section statistics
  const totalProducts = section.products?.length || 0;
  const approvedProducts =
    section.products?.filter((p) => p.approvalStatus === "approved").length ||
    0;
  const declinedProducts =
    section.products?.filter((p) => p.approvalStatus === "declined").length ||
    0;
  const totalPrice =
    section.products?.reduce((total, product) => {
      if (product.approvalStatus === "approved") {
        const price = product.customPrice || product.product?.price || 0;
        return total + price * product.quantity;
      }
      return total;
    }, 0) || 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between p-4">
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
              <p className="text-sm text-gray-600">{section.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {totalProducts} products
          </span>
          <button
            onClick={() => setEditSectionModal({ isOpen: true })}
            className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Edit
          </button>
          <button
            onClick={onAddProduct}
            className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Section Statistics */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">{totalProducts}</span>
            <span className="text-gray-500"> Total</span>
          </div>
          <div>
            <span className="font-medium text-green-600">
              {approvedProducts}
            </span>
            <span className="text-gray-500"> Approved</span>
          </div>
          <div>
            <span className="font-medium text-red-600">{declinedProducts}</span>
            <span className="text-gray-500"> Declined</span>
          </div>
          <div>
            <span className="font-medium text-purple-600">
              {formatPrice(totalPrice)}
            </span>
            <span className="text-gray-500"> Total</span>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="p-4">
        {!section.products || section.products.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No products in this section</p>
            <button
              onClick={onAddProduct}
              className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {section.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => setEditProductModal({ isOpen: true, product })}
                onDelete={() => onProductDelete(product.id)}
                onAdminComment={() =>
                  setAdminCommentModal({ isOpen: true, product })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Section Modal */}
      <EditSectionModal
        isOpen={editSectionModal.isOpen}
        onClose={() => setEditSectionModal({ isOpen: false })}
        onSubmit={onSectionUpdate}
        section={section}
        isSubmitting={false}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={editProductModal.isOpen}
        onClose={() => setEditProductModal({ isOpen: false, product: null })}
        onSubmit={(productData) =>
          onProductUpdate(editProductModal.product.id, productData)
        }
        product={editProductModal.product}
        isSubmitting={false}
      />

      {/* Admin Comment Modal */}
      <AdminCommentModal
        isOpen={adminCommentModal.isOpen}
        onClose={() => setAdminCommentModal({ isOpen: false, product: null })}
        onSubmit={(adminComment) =>
          onAdminCommentUpdate(adminCommentModal.product.id, adminComment)
        }
        product={adminCommentModal.product}
        isSubmitting={false}
      />
    </div>
  );
}
