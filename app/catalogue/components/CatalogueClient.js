"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CATALOGUE_CATEGORIES,
  CATALOGUE_SELECTION_STORAGE_KEY,
  SORT_OPTIONS,
  STOCK_STATUSES,
  formatCurrency,
} from "@/libs/catalogue";

function buildParams(searchParams, updates = {}) {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
      return;
    }
    params.set(key, value);
  });

  return params.toString();
}

function CatalogueCategoryRail({ categoryCards, activeCategory, searchParams }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-4">
        <Link
          href={`/catalogue${searchParams ? `?${buildParams(searchParams, { room: "", page: 1 })}` : ""}`}
          className={`group relative overflow-hidden rounded-[2rem] border px-5 py-4 transition ${
            !activeCategory
              ? "border-stone-900 bg-stone-900 text-white"
              : "border-white/70 bg-white/70 text-stone-900 backdrop-blur"
          }`}
        >
          <div className="text-sm font-semibold">All categories</div>
          <div className={`mt-1 text-xs ${!activeCategory ? "text-white/70" : "text-stone-500"}`}>
            Browse the full specification library.
          </div>
        </Link>
        {categoryCards.map((category) => (
          <Link
            key={category.id}
            href={`/catalogue?${buildParams(searchParams, { room: category.id.toUpperCase(), page: 1 })}`}
            className={`group relative overflow-hidden rounded-[2rem] border px-5 py-4 transition ${
              activeCategory === category.id
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-white/70 bg-white/70 text-stone-900 backdrop-blur hover:border-stone-300"
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${category.accent}`}
            />
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-semibold">{category.label}</div>
                <div
                  className={`mt-1 text-xs ${
                    activeCategory === category.id
                      ? "text-white/70"
                      : "text-stone-500"
                  }`}
                >
                  {category.description}
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  activeCategory === category.id
                    ? "bg-white/10 text-white"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {category.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CatalogueFilters({
  filters,
  filterOptions,
  searchDraft,
  setSearchDraft,
  onSearchSubmit,
  onImmediateFilterChange,
}) {
  return (
    <aside className="space-y-5 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_20px_60px_rgba(28,25,23,0.06)]">
      <div>
        <h2 className="text-base font-semibold text-stone-900">Refine results</h2>
        <p className="mt-1 text-sm text-stone-500">
          Filter by brand, type, finish cues, and stock status.
        </p>
      </div>

      <form onSubmit={onSearchSubmit} className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Search
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Product, finish, colour, brand..."
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900"
          />
          <button
            type="submit"
            className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Apply
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Sort
          </label>
          <select
            value={filters.sort || "featured"}
            onChange={(event) => onImmediateFilterChange("sort", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-900"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Brand
          </label>
          <select
            value={filters.brand || ""}
            onChange={(event) => onImmediateFilterChange("brand", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-900"
          >
            <option value="">All brands</option>
            {filterOptions.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Product type
          </label>
          <select
            value={filters.type || ""}
            onChange={(event) => onImmediateFilterChange("type", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-900"
          >
            <option value="">All product types</option>
            {filterOptions.productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Colour
          </label>
          <select
            value={filters.colour || ""}
            onChange={(event) =>
              onImmediateFilterChange("colour", event.target.value)
            }
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-900"
          >
            <option value="">All colours</option>
            {filterOptions.colours.map((colour) => (
              <option key={colour.value} value={colour.value}>
                {colour.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Availability
          </label>
          <select
            value={filters.availability || ""}
            onChange={(event) =>
              onImmediateFilterChange("availability", event.target.value)
            }
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-900"
          >
            <option value="">All availability</option>
            {STOCK_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}

function getMatchingVariant(product, selectedColor, selectedSize) {
  const exactMatch = product.variants.find(
    (variant) =>
      (!selectedColor ||
        variant.colorValue === selectedColor ||
        variant.color?.toLowerCase() === selectedColor) &&
      (!selectedSize || variant.size === selectedSize),
  );

  if (exactMatch) {
    return exactMatch;
  }

  if (selectedColor) {
    const colorMatch = product.variants.find(
      (variant) =>
        variant.colorValue === selectedColor ||
        variant.color?.toLowerCase() === selectedColor,
    );
    if (colorMatch) {
      return colorMatch;
    }
  }

  if (selectedSize) {
    const sizeMatch = product.variants.find((variant) => variant.size === selectedSize);
    if (sizeMatch) {
      return sizeMatch;
    }
  }

  return product.variants.find((variant) => variant.isDefault) || product.variants[0];
}

function CatalogueProductCard({ product, selectedItem, onSaveItem, onOpen }) {
  const defaultVariant = product.variants.find((variant) => variant.isDefault) || product.variants[0];
  const [selectedColor, setSelectedColor] = useState(
    selectedItem?.colorValue || defaultVariant?.colorValue || "",
  );
  const [selectedSize, setSelectedSize] = useState(
    selectedItem?.size || defaultVariant?.size || "",
  );
  const [quantity, setQuantity] = useState(selectedItem?.quantity || 1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setSelectedColor(selectedItem.colorValue || "");
      setSelectedSize(selectedItem.size || "");
      setQuantity(selectedItem.quantity || 1);
    }
  }, [selectedItem]);

  const activeVariant = useMemo(
    () => getMatchingVariant(product, selectedColor, selectedSize),
    [product, selectedColor, selectedSize],
  );

  const cardImage = activeVariant?.imageUrl || product.imageUrl;
  const categoryLabel =
    CATALOGUE_CATEGORIES.find((item) => item.id === product.catalogueCategory)
      ?.label || product.catalogueCategory;
  const descriptionText =
    product.description ||
    `Curated ${product.productType.toLowerCase()} with configurable finish, size, and pricing.`;
  const canToggleDescription = descriptionText.length > 140;

  return (
    <article
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      role="link"
      tabIndex={0}
      className="cursor-pointer overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(28,25,23,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(28,25,23,0.12)]"
    >
      <div className="relative aspect-[4/4.4] overflow-hidden bg-stone-100">
        <img
          src={cardImage}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-900">
            {categoryLabel}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              product.stockStatus === "out_of_stock"
                ? "bg-rose-100 text-rose-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {product.stockStatus === "out_of_stock" ? "Out of stock" : "Available"}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                {product.brand}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-stone-900">
                {product.name}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Price
              </p>
              <p className="text-lg font-semibold text-stone-900">
                {formatCurrency(activeVariant?.price || product.priceRange.min)}
              </p>
              {product.priceRange.min !== product.priceRange.max && (
                <p className="text-xs text-stone-500">{product.priceRange.label}</p>
              )}
            </div>
          </div>

          <div>
            <p
              className="text-sm leading-6 text-stone-600"
              style={
                descriptionExpanded
                  ? undefined
                  : {
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }
              }
            >
              {descriptionText}
            </p>
            {canToggleDescription ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setDescriptionExpanded((current) => !current);
                }}
                className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 hover:text-stone-900"
              >
                {descriptionExpanded ? "Show less" : "Show more"}
              </button>
            ) : null}
          </div>
        </div>

        <div
          className="grid gap-3 rounded-[1.5rem] bg-stone-50 p-4"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Product type
              </p>
              <p className="mt-1 text-sm font-medium text-stone-900">{product.productType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Lead time
              </p>
              <p className="mt-1 text-sm font-medium text-stone-900">
                {product.leadTimeDays ? `${product.leadTimeDays} days` : "TBC"}
              </p>
            </div>
          </div>

          {product.colours.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Colour / finish
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colours.map((colour) => (
                  <button
                    key={colour.value}
                    type="button"
                    onClick={() => setSelectedColor(colour.value)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      selectedColor === colour.value
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-black/10"
                      style={{ backgroundColor: colour.swatch || "#e7e5e4" }}
                    />
                    {colour.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Size
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      selectedSize === size
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Quantity
              </p>
              <div className="mt-2 inline-flex overflow-hidden rounded-full border border-stone-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="px-4 py-2 text-sm font-semibold text-stone-700"
                >
                  -
                </button>
                <span className="flex min-w-12 items-center justify-center border-x border-stone-200 px-4 py-2 text-sm font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="px-4 py-2 text-sm font-semibold text-stone-700"
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSaveItem({
                  productId: product.id,
                  variantId: activeVariant?.id || "default",
                  quantity,
                  name: product.name,
                  brand: product.brand,
                  productType: product.productType,
                  catalogueCategory: product.catalogueCategory,
                  color: activeVariant?.color || "",
                  colorValue: activeVariant?.colorValue || "",
                  size: activeVariant?.size || "",
                  finish: activeVariant?.finish || product.finish || "",
                  sku: activeVariant?.sku || product.sku || "",
                  imageUrl: cardImage || "",
                  unitPrice: Number(activeVariant?.price || product.priceRange.min || 0),
                  stockStatus: activeVariant?.stockStatus || product.stockStatus,
                });
              }}
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 sm:col-start-3"
            >
              {selectedItem ? "Update selection" : "Save selection"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-stone-900">
            View product details
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700">
            Open page
          </span>
        </div>

        {product.specifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.specifications.slice(0, 4).map(([key, value]) => (
              <span
                key={key}
                className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-600"
              >
                <strong className="text-stone-800">{key}:</strong> {String(value)}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function SelectionPanel({ items, onRemove, onQuantityChange, onShare }) {
  const totalPrice = items.reduce(
    (total, item) => total + Number(item.unitPrice || 0) * Number(item.quantity || 0),
    0,
  );

  return (
    <aside className="sticky top-6 space-y-5 rounded-[2rem] border border-stone-900 bg-stone-900 p-5 text-white shadow-[0_24px_80px_rgba(28,25,23,0.18)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-300">
          Saved basket
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Share a curated shortlist</h2>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          Save products without checkout, then generate a public link for review.
        </p>
      </div>

      <div className="rounded-[1.5rem] bg-white/5 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-stone-300">Items</span>
          <span className="text-2xl font-semibold">{items.length}</span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-sm text-stone-300">Estimated total</span>
          <span className="text-lg font-semibold">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-stone-300">
          No products saved yet. Use the product cards to build a shareable basket.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.productId}:${item.variantId}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-stone-300">
                    {[item.brand, item.color, item.size].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300"
                >
                  Remove
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="inline-flex overflow-hidden rounded-full border border-white/10">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1.5 text-sm"
                  >
                    -
                  </button>
                  <span className="border-x border-white/10 px-3 py-1.5 text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item, item.quantity + 1)}
                    className="px-3 py-1.5 text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-semibold">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onShare}
        disabled={items.length === 0}
        className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Generate share link
      </button>
    </aside>
  );
}

export default function CatalogueClient({
  products,
  totalCount,
  page,
  totalPages,
  filters,
  filterOptions,
  categoryCards,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = (filters.room || filters.category || "").toLowerCase();
  const [searchDraft, setSearchDraft] = useState(filters.search || "");
  const [savedItems, setSavedItems] = useState([]);
  const [shareState, setShareState] = useState({
    loading: false,
    url: "",
    error: "",
  });

  useEffect(() => {
    setSearchDraft(filters.search || "");
  }, [filters.search]);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(
        CATALOGUE_SELECTION_STORAGE_KEY,
      );
      setSavedItems(storedValue ? JSON.parse(storedValue) : []);
    } catch (error) {
      console.error("Failed to restore saved catalogue items:", error);
    }
  }, []);

  useEffect(() => {
    if (savedItems.length) {
      window.localStorage.setItem(
        CATALOGUE_SELECTION_STORAGE_KEY,
        JSON.stringify(savedItems),
      );
    } else {
      window.localStorage.removeItem(CATALOGUE_SELECTION_STORAGE_KEY);
    }
  }, [savedItems]);

  const selectedItemsByProduct = useMemo(
    () =>
      savedItems.reduce((accumulator, item) => {
        accumulator[item.productId] = item;
        return accumulator;
      }, {}),
    [savedItems],
  );

  const navigateWith = (updates) => {
    const queryString = buildParams(searchParams, { ...updates, page: 1 });
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigateWith({ search: searchDraft });
  };

  const handleSaveItem = (item) => {
    setShareState({ loading: false, url: "", error: "" });
    setSavedItems((currentItems) => {
      const remainingItems = currentItems.filter(
        (currentItem) => currentItem.productId !== item.productId,
      );

      return [
        ...remainingItems,
        {
          ...item,
          quantity: Math.max(1, parseInt(item.quantity || 1, 10)),
        },
      ];
    });
  };

  const handleRemoveItem = (itemToRemove) => {
    setShareState({ loading: false, url: "", error: "" });
    setSavedItems((currentItems) =>
      currentItems.filter(
        (item) =>
          `${item.productId}:${item.variantId}` !==
          `${itemToRemove.productId}:${itemToRemove.variantId}`,
      ),
    );
  };

  const handleQuantityChange = (itemToUpdate, quantity) => {
    setShareState({ loading: false, url: "", error: "" });
    setSavedItems((currentItems) =>
      currentItems.map((item) =>
        `${item.productId}:${item.variantId}` ===
        `${itemToUpdate.productId}:${itemToUpdate.variantId}`
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const handleShare = async () => {
    setShareState({ loading: true, url: "", error: "" });
    try {
      const response = await fetch("/api/catalogue/shares", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: savedItems }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to generate a share link.");
      }

      setShareState({ loading: false, url: result.shareUrl, error: "" });
    } catch (error) {
      setShareState({
        loading: false,
        url: "",
        error: error.message || "Failed to generate a share link.",
      });
    }
  };

  return (
    <main className="bg-[linear-gradient(180deg,#f8fafc_0%,#f5f5f4_100%)]">
      <section className="mx-auto max-w-[1680px] px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[2.5rem] border border-stone-200 bg-white p-6 shadow-[0_32px_100px_rgba(28,25,23,0.08)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
                Better Homes Catalogue
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                Explore beautifully curated products for your renovation, all in one place.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                Discover hand-picked finishes, fittings, and materials across every
                space in the home, then save your favourites into a shortlist you
                can review and share with ease.
              </p>
            </div>
            <div className="grid gap-3 rounded-[2rem] bg-stone-900 p-5 text-white sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-300">
                  Products
                </p>
                <p className="mt-2 text-3xl font-semibold">{totalCount}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-300">
                  Categories
                </p>
                <p className="mt-2 text-3xl font-semibold">{CATALOGUE_CATEGORIES.length}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-300">
                  Shareable
                </p>
                <p className="mt-2 text-lg font-semibold">Selection links</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <CatalogueCategoryRail
              categoryCards={categoryCards}
              activeCategory={activeCategory}
              searchParams={searchParams}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1680px] px-5 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <CatalogueFilters
            filters={filters}
            filterOptions={filterOptions}
            searchDraft={searchDraft}
            setSearchDraft={setSearchDraft}
            onSearchSubmit={handleSearchSubmit}
            onImmediateFilterChange={(key, value) =>
              navigateWith({ [key]: value })
            }
          />

          <div className="space-y-5">
            <div className="flex flex-col gap-2 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_20px_60px_rgba(28,25,23,0.06)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Showing page {page} of {totalPages}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-stone-900">
                  {totalCount} products ready to review
                </h2>
              </div>
              {shareState.url && (
                <div className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Share link created:
                  {" "}
                  <a className="font-semibold underline" href={shareState.url}>
                    open selection
                  </a>
                </div>
              )}
              {shareState.error && (
                <div className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {shareState.error}
                </div>
              )}
              {shareState.loading && (
                <div className="rounded-[1.25rem] bg-stone-900 px-4 py-3 text-sm text-white">
                  Generating share link...
                </div>
              )}
            </div>

            {products.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/70 p-12 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                  No matches
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-stone-900">
                  No products match the current filters.
                </h3>
                <p className="mt-3 text-sm text-stone-500">
                  Reset the search or switch category to broaden the shortlist.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {products.map((product) => (
                  <CatalogueProductCard
                    key={product.id}
                    product={product}
                    selectedItem={selectedItemsByProduct[product.id]}
                    onSaveItem={handleSaveItem}
                    onOpen={() => router.push(`/catalogue/${product.slug || product.id}`)}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 rounded-[2rem] border border-stone-200 bg-white p-4 shadow-[0_20px_60px_rgba(28,25,23,0.06)]">
                <Link
                  href={`/catalogue?${buildParams(searchParams, {
                    page: Math.max(1, page - 1),
                  })}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    page === 1
                      ? "pointer-events-none bg-stone-100 text-stone-400"
                      : "bg-stone-900 text-white"
                  }`}
                >
                  Previous
                </Link>
                <span className="text-sm text-stone-600">
                  Page {page} of {totalPages}
                </span>
                <Link
                  href={`/catalogue?${buildParams(searchParams, {
                    page: Math.min(totalPages, page + 1),
                  })}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    page === totalPages
                      ? "pointer-events-none bg-stone-100 text-stone-400"
                      : "bg-stone-900 text-white"
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </div>

          <SelectionPanel
            items={savedItems}
            onRemove={handleRemoveItem}
            onQuantityChange={handleQuantityChange}
            onShare={handleShare}
          />
        </div>
      </section>
    </main>
  );
}
