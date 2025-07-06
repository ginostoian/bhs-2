"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import ProductForm from "./ProductForm";

/**
 * Product Database Client Component
 * Manages the global product catalog with CRUD operations
 */
export default function ProductDatabaseClient({
  products: initialProducts,
  categories: initialCategories,
  suppliers: initialSuppliers,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });
  const [productModal, setProductModal] = useState({
    isOpen: false,
    product: null,
    mode: "create", // "create" or "edit"
  });

  // Filter states
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !filterCategory || product.category === filterCategory;
    const matchesSupplier =
      !filterSupplier || product.supplier === filterSupplier;
    const matchesActive =
      filterActive === "all" ||
      (filterActive === "active" && product.isActive) ||
      (filterActive === "inactive" && !product.isActive);
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSupplier && matchesActive && matchesSearch;
  });

  // Handle product creation/update
  const handleProductSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      const url =
        productModal.mode === "create"
          ? "/api/products"
          : `/api/products/${productModal.product.id}`;

      const method = productModal.mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to save product");

      const { product } = await response.json();

      if (productModal.mode === "create") {
        setProducts((prev) => [...prev, product]);
        // Update categories and suppliers if new
        if (!categories.includes(product.category)) {
          setCategories((prev) => [...prev, product.category].sort());
        }
        if (!suppliers.includes(product.supplier)) {
          setSuppliers((prev) => [...prev, product.supplier].sort());
        }
      } else {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? product : p)),
        );
      }

      setProductModal({ isOpen: false, product: null, mode: "create" });
    } catch (error) {
      console.error("Error saving product:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to save product. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle product deletion
  const handleProductDelete = async (productId) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setModalState({
        isOpen: false,
        title: "",
        message: "",
        type: "alert",
        confirmText: "OK",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete product. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (product) => {
    setModalState({
      isOpen: true,
      title: "Delete Product",
      message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      type: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => handleProductDelete(product.id),
    });
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);
  };

  return (
    <div>
      {/* Header with Add Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Products ({filteredProducts.length})
          </h3>
          <p className="text-sm text-gray-600">
            Total products in database: {products.length}
          </p>
        </div>
        <button
          onClick={() =>
            setProductModal({ isOpen: true, product: null, mode: "create" })
          }
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
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
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <select
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Suppliers</option>
              {suppliers.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterCategory("");
                setFilterSupplier("");
                setFilterActive("all");
                setSearchTerm("");
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Product Image */}
            <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' /%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* Product Details */}
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline"
                >
                  {product.name}
                </a>
              </h3>

              {product.description && (
                <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                  {product.description}
                </p>
              )}

              <div className="mb-2 space-y-1 text-sm text-gray-500">
                <p>
                  <strong>Price:</strong> {formatPrice(product.price)}
                </p>
                <p>
                  <strong>Supplier:</strong> {product.supplier}
                </p>
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                {product.sku && (
                  <p>
                    <strong>SKU:</strong> {product.sku}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setProductModal({ isOpen: true, product, mode: "edit" })
                }
                className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(product)}
                className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📦</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="text-gray-600">
            {products.length === 0
              ? "Get started by adding your first product to the database."
              : "Try adjusting your filters to see more products."}
          </p>
        </div>
      )}

      {/* Product Modal */}
      <ProductForm
        isOpen={productModal.isOpen}
        onClose={() =>
          setProductModal({ isOpen: false, product: null, mode: "create" })
        }
        onSubmit={handleProductSubmit}
        product={productModal.product}
        mode={productModal.mode}
        isSubmitting={isSubmitting}
        categories={categories}
        suppliers={suppliers}
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
