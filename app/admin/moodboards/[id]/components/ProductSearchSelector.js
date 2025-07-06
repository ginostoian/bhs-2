"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Product Search Selector Component
 * Searchable dropdown for selecting products with filtering
 */
export default function ProductSearchSelector({
  products,
  categories,
  suppliers,
  selectedProductId,
  onProductSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const dropdownRef = useRef(null);

  // Get selected product details
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Filter products based on search term and filters
  useEffect(() => {
    let filtered = products;

    // Filter by search term (name, description, tags)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          (product.description &&
            product.description.toLowerCase().includes(term)) ||
          (product.tags &&
            product.tags.some((tag) => tag.toLowerCase().includes(term))),
      );
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(
        (product) => product.category === filterCategory,
      );
    }

    // Filter by supplier
    if (filterSupplier) {
      filtered = filtered.filter(
        (product) => product.supplier === filterSupplier,
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterCategory, filterSupplier]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle product selection
  const handleProductClick = (productId) => {
    onProductSelect(productId);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Product Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedProduct ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedProduct.imageUrl && (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="h-8 w-8 rounded object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div>
                <div className="font-medium text-gray-900">
                  {selectedProduct.name}
                </div>
                <div className="text-sm text-gray-500">
                  {formatPrice(selectedProduct.price)} •{" "}
                  {selectedProduct.category} • {selectedProduct.supplier}
                </div>
              </div>
            </div>
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
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
        ) : (
          <span className="text-gray-500">Choose a product...</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Search and Filters */}
          <div className="border-b border-gray-200 p-3">
            {/* Search Input */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="mt-2 text-xs text-gray-500">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Product List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No products found matching your criteria
              </div>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductClick(product.id)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    selectedProductId === product.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="truncate text-sm text-gray-500">
                        {formatPrice(product.price)} • {product.category} •{" "}
                        {product.supplier}
                      </div>
                      {product.description && (
                        <div className="truncate text-xs text-gray-400">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
