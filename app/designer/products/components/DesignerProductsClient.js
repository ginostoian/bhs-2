"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import ProductForm from "./ProductForm";

const PAGE_SIZE = 12;

/**
 * Designer Products Client Component
 * Manages the global product catalog with CRUD operations
 */
export default function DesignerProductsClient({
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

  // Pagination and filter/search state
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialProducts.length);
  const [loading, setLoading] = useState(false);

  // Fetch products from API with pagination, search, and filters
  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: PAGE_SIZE,
      });
      if (searchTerm) params.set("search", searchTerm);
      if (filterCategory) params.set("category", filterCategory);
      if (filterSupplier) params.set("supplier", filterSupplier);
      if (filterActive !== "all")
        params.set("active", filterActive === "active" ? "true" : "false");
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalCount(data.totalCount || 0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when page, search, or filters change
  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, filterCategory, filterSupplier, filterActive]);

  // Handle filter/search changes
  const handleCategoryChange = (cat) => {
    setFilterCategory(cat);
    setPage(1);
  };
  const handleSupplierChange = (sup) => {
    setFilterSupplier(sup);
    setPage(1);
  };
  const handleActiveChange = (val) => {
    setFilterActive(val);
    setPage(1);
  };
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setPage(1);
  };

  // Pagination controls
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const canPrev = page > 1;
  const canNext = page < totalPages;

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
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    return matchesCategory && matchesSupplier && matchesActive && matchesSearch;
  });

  // Handle product creation
  const handleCreateProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to create product");

      const { product } = await response.json();
      setProducts((prev) => [product, ...prev]);
      setProductModal({ isOpen: false, product: null, mode: "create" });

      // Update categories and suppliers if new
      if (!categories.includes(product.category)) {
        setCategories((prev) => [...prev, product.category].sort());
      }
      if (!suppliers.includes(product.supplier)) {
        setSuppliers((prev) => [...prev, product.supplier].sort());
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to create product. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle product update
  const handleUpdateProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productModal.product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to update product");

      const { product } = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p)),
      );
      setProductModal({ isOpen: false, product: null, mode: "create" });

      // Update categories and suppliers if changed
      if (!categories.includes(product.category)) {
        setCategories((prev) => [...prev, product.category].sort());
      }
      if (!suppliers.includes(product.supplier)) {
        setSuppliers((prev) => [...prev, product.supplier].sort());
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to update product. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
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

  return (
    <div>
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Product Database ({totalCount} products)
          </h3>
          <p className="text-sm text-gray-600">
            Manage the global product catalog for moodboards
          </p>
        </div>
        <button
          onClick={() =>
            setProductModal({ isOpen: true, product: null, mode: "create" })
          }
          className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={filterCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Supplier
          </label>
          <select
            value={filterSupplier}
            onChange={(e) => handleSupplierChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={filterActive}
            onChange={(e) => handleActiveChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          >
            <option value="all">All Products</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Product Image */}
              <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <span
                    className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                  {product.description}
                </p>

                <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
                  <span>{product.category}</span>
                  <span>{product.supplier}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    £{product.price}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setProductModal({
                          isOpen: true,
                          product: product,
                          mode: "edit",
                        })
                      }
                      className="text-sm font-medium text-purple-600 hover:text-purple-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setModalState({
                          isOpen: true,
                          title: "Delete Product",
                          message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
                          type: "confirm",
                          confirmText: "Delete",
                          onConfirm: () => handleDeleteProduct(product.id),
                        });
                      }}
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No products
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ||
            filterCategory ||
            filterSupplier ||
            filterActive !== "all"
              ? "No products match your current filters."
              : "Get started by adding a new product."}
          </p>
          {!searchTerm &&
            !filterCategory &&
            !filterSupplier &&
            filterActive === "all" && (
              <div className="mt-6">
                <button
                  onClick={() =>
                    setProductModal({
                      isOpen: true,
                      product: null,
                      mode: "create",
                    })
                  }
                  className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Product
                </button>
              </div>
            )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, totalCount)} to{" "}
            {Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!canPrev}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!canNext}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductForm
        isOpen={productModal.isOpen}
        onClose={() =>
          setProductModal({ isOpen: false, product: null, mode: "create" })
        }
        onSubmit={
          productModal.mode === "create"
            ? handleCreateProduct
            : handleUpdateProduct
        }
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
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        onConfirm={modalState.onConfirm}
      />
    </div>
  );
}
