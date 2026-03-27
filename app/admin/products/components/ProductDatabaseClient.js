"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import ProductForm from "./ProductForm";
import { CATALOGUE_CATEGORIES, formatCurrency } from "@/libs/catalogue";

const PAGE_SIZE = 12;

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
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialProducts.length);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterCatalogueCategory, setFilterCatalogueCategory] = useState("");
  const [filterActive, setFilterActive] = useState("all");
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
    mode: "create",
  });

  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(PAGE_SIZE),
        sort: "updated",
      });

      if (searchTerm) params.set("search", searchTerm);
      if (filterCategory) params.set("category", filterCategory);
      if (filterSupplier) params.set("supplier", filterSupplier);
      if (filterCatalogueCategory) {
        params.set("catalogueCategory", filterCatalogueCategory);
      }
      if (filterActive !== "all") {
        params.set("active", filterActive === "active" ? "true" : "false");
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
      setTotalCount(data.totalCount || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    searchTerm,
    filterCategory,
    filterSupplier,
    filterCatalogueCategory,
    filterActive,
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

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

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const { product } = await response.json();

      if (productModal.mode === "create") {
        setProducts((current) => [product, ...current]);
      } else {
        setProducts((current) =>
          current.map((item) => (item.id === product.id ? product : item)),
        );
      }

      if (product.category && !categories.includes(product.category)) {
        setCategories((current) => [...current, product.category].sort());
      }
      if (product.supplier && !suppliers.includes(product.supplier)) {
        setSuppliers((current) => [...current, product.supplier].sort());
      }

      setProductModal({ isOpen: false, product: null, mode: "create" });
      fetchProducts(page);
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

  const handleProductDelete = async (productId) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((current) => current.filter((item) => item.id !== productId));
      setModalState({
        isOpen: false,
        title: "",
        message: "",
        type: "alert",
        confirmText: "OK",
      });
      fetchProducts(page);
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Products ({totalCount})
          </h3>
          <p className="text-sm text-gray-600">
            Internal product database powering moodboards and the public catalogue.
          </p>
        </div>
        <button
          onClick={() =>
            setProductModal({ isOpen: true, product: null, mode: "create" })
          }
          className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Product type
            </label>
            <select
              value={filterCategory}
              onChange={(event) => {
                setFilterCategory(event.target.value);
                setPage(1);
              }}
              className="mt-1 block w-36 rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Supplier
            </label>
            <select
              value={filterSupplier}
              onChange={(event) => {
                setFilterSupplier(event.target.value);
                setPage(1);
              }}
              className="mt-1 block w-40 rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {suppliers.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Catalogue
            </label>
            <select
              value={filterCatalogueCategory}
              onChange={(event) => {
                setFilterCatalogueCategory(event.target.value);
                setPage(1);
              }}
              className="mt-1 block w-40 rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {CATALOGUE_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Active
            </label>
            <select
              value={filterActive}
              onChange={(event) => {
                setFilterActive(event.target.value);
                setPage(1);
              }}
              className="mt-1 block w-28 rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="min-w-[260px] flex-1">
            <label className="block text-xs font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Search by product, brand, supplier, or description..."
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mb-4 text-6xl">📦</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="text-gray-600">
            Try adjusting the filters or add a new product.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.catalogueEnabled === true
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.catalogueEnabled === true
                          ? "Public catalogue"
                          : "Hidden from catalogue"}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    {product.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {product.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Price:</strong> {formatCurrency(product.price)}
                    </p>
                    <p>
                      <strong>Brand:</strong> {product.brand || product.supplier}
                    </p>
                    <p>
                      <strong>Supplier:</strong> {product.supplier}
                    </p>
                    <p>
                      <strong>Type:</strong> {product.category}
                    </p>
                    <p>
                      <strong>Catalogue:</strong>{" "}
                      {product.catalogueCategory || "Auto-detected"}
                    </p>
                    {product.variants?.length ? (
                      <p>
                        <strong>Variants:</strong> {product.variants.length}
                      </p>
                    ) : null}
                    {product.sku ? (
                      <p>
                        <strong>SKU:</strong> {product.sku}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setProductModal({ isOpen: true, product, mode: "edit" })
                      }
                      className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page === totalPages}
                className="rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      )}

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
