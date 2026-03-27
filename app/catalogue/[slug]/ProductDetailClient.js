"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CATALOGUE_CATEGORIES,
  CATALOGUE_SELECTION_STORAGE_KEY,
  formatCurrency,
} from "@/libs/catalogue";

function getMatchingVariant(product, selectedColor, selectedSize) {
  return (
    product.variants.find(
      (variant) =>
        (!selectedColor ||
          variant.colorValue === selectedColor ||
          variant.color?.toLowerCase() === selectedColor) &&
        (!selectedSize || variant.size === selectedSize),
    ) ||
    product.variants.find(
      (variant) =>
        selectedColor &&
        (variant.colorValue === selectedColor ||
          variant.color?.toLowerCase() === selectedColor),
    ) ||
    product.variants.find((variant) => selectedSize && variant.size === selectedSize) ||
    product.variants.find((variant) => variant.isDefault) ||
    product.variants[0]
  );
}

export default function ProductDetailClient({ product }) {
  const defaultVariant =
    product.variants.find((variant) => variant.isDefault) || product.variants[0];
  const [selectedColor, setSelectedColor] = useState(
    defaultVariant?.colorValue || "",
  );
  const [selectedSize, setSelectedSize] = useState(defaultVariant?.size || "");
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);

  const activeVariant = useMemo(
    () => getMatchingVariant(product, selectedColor, selectedSize),
    [product, selectedColor, selectedSize],
  );
  const category =
    CATALOGUE_CATEGORIES.find((item) => item.id === product.catalogueCategory) ||
    null;

  useEffect(() => {
    try {
      const currentItems = JSON.parse(
        window.localStorage.getItem(CATALOGUE_SELECTION_STORAGE_KEY) || "[]",
      );
      setSaved(currentItems.some((item) => item.productId === product.id));
    } catch (error) {
      console.error("Failed to read catalogue selection storage:", error);
    }
  }, [product.id]);

  const handleSave = () => {
    try {
      const currentItems = JSON.parse(
        window.localStorage.getItem(CATALOGUE_SELECTION_STORAGE_KEY) || "[]",
      );
          const nextItems = [
        ...currentItems.filter((item) => item.productId !== product.id),
        {
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
          imageUrl: activeVariant?.imageUrl || product.imageUrl || "",
          unitPrice: Number(activeVariant?.price || product.priceRange.min || 0),
          stockStatus: activeVariant?.stockStatus || product.stockStatus,
        },
      ];
      window.localStorage.setItem(
        CATALOGUE_SELECTION_STORAGE_KEY,
        JSON.stringify(nextItems),
      );
      setSaved(true);
    } catch (error) {
      console.error("Failed to save catalogue item:", error);
    }
  };

  return (
    <main className="bg-[linear-gradient(180deg,#f8fafc_0%,#f5f5f4_100%)]">
      <section className="mx-auto max-w-[1680px] px-5 py-10 lg:px-8 lg:py-14">
        <div className="rounded-[2.5rem] border border-stone-200 bg-white p-6 shadow-[0_30px_90px_rgba(28,25,23,0.08)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
                <Link href="/catalogue" className="font-medium text-stone-900">
                  Catalogue
                </Link>
                <span>/</span>
                <span>{category?.label || product.catalogueCategory}</span>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                {product.brand}
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
                {product.description ||
                  `Detailed specification for this curated ${product.productType.toLowerCase()}.`}
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-stone-900 px-6 py-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-300">
                Selected price
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {formatCurrency(activeVariant?.price || product.priceRange.min)}
              </p>
              {product.priceRange.min !== product.priceRange.max ? (
                <p className="mt-1 text-sm text-stone-300">{product.priceRange.label}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_420px]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-100">
                <img
                  src={activeVariant?.imageUrl || product.imageUrl}
                  alt={product.name}
                  className="aspect-[16/12] w-full object-cover"
                />
              </div>

              {product.gallery.length > 1 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {product.gallery.map((imageUrl) => (
                    <div
                      key={imageUrl}
                      className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-100"
                    >
                      <img
                        src={imageUrl}
                        alt={`${product.name} gallery`}
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-4 rounded-[2rem] border border-stone-200 bg-white p-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Product type
                  </p>
                  <p className="mt-2 text-lg font-semibold text-stone-900">
                    {product.productType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Lead time
                  </p>
                  <p className="mt-2 text-lg font-semibold text-stone-900">
                    {product.leadTimeDays ? `${product.leadTimeDays} days` : "TBC"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Finish
                  </p>
                  <p className="mt-2 text-lg font-semibold text-stone-900">
                    {activeVariant?.finish || product.finish || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    SKU
                  </p>
                  <p className="mt-2 text-lg font-semibold text-stone-900">
                    {activeVariant?.sku || product.sku || "Not specified"}
                  </p>
                </div>
              </div>

              {product.specifications.length > 0 ? (
                <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
                  <h2 className="text-2xl font-semibold text-stone-900">
                    Specifications
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {product.specifications.map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                          {key}
                        </p>
                        <p className="mt-2 text-base font-medium text-stone-900">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="space-y-5 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(28,25,23,0.06)]">
              {product.colours.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Colour / finish
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colours.map((colour) => (
                      <button
                        key={colour.value}
                        type="button"
                        onClick={() => setSelectedColor(colour.value)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                          selectedColor === colour.value
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 bg-white text-stone-700"
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
              ) : null}

              {product.sizes.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Size
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold ${
                          selectedSize === size
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 bg-white text-stone-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Quantity
                </p>
                <div className="mt-3 inline-flex overflow-hidden rounded-full border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="px-4 py-2 text-sm font-semibold text-stone-700"
                  >
                    -
                  </button>
                  <span className="border-x border-stone-200 px-4 py-2 text-sm font-semibold text-stone-900">
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

              <div className="rounded-[1.5rem] bg-stone-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                      Availability
                    </p>
                    <p className="mt-2 text-lg font-semibold text-stone-900">
                      {activeVariant?.stockStatus === "out_of_stock"
                        ? "Out of stock"
                        : "Available to shortlist"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                      Total
                    </p>
                    <p className="mt-2 text-xl font-semibold text-stone-900">
                      {formatCurrency(
                        Number(activeVariant?.price || product.priceRange.min) * quantity,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
              >
                {saved ? "Saved to basket" : "Save to basket"}
              </button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
