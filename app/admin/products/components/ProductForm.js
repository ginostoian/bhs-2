"use client";

import { useEffect, useMemo, useState } from "react";
import FileUpload from "@/components/FileUpload";
import { CATALOGUE_CATEGORIES, STOCK_STATUSES } from "@/libs/catalogue";

const emptySpecification = { key: "", value: "" };
const emptyVariant = {
  id: "",
  title: "",
  color: "",
  colorValue: "",
  colorSwatch: "",
  size: "",
  finish: "",
  sku: "",
  imageUrl: "",
  price: "",
  stockStatus: "in_stock",
  isDefault: false,
};

function buildInitialState(product) {
  const specificationEntries = Object.entries(product?.specifications || {});

  return {
    name: product?.name || "",
    description: product?.description || "",
    imageUrl: product?.imageUrl || "",
    productUrl: product?.productUrl || "",
    price:
      product?.price === undefined || product?.price === null
        ? ""
        : String(product.price),
    supplier: product?.supplier || "",
    brand: product?.brand || product?.supplier || "",
    category: product?.category || "",
    catalogueCategory: product?.catalogueCategory || "",
    sku: product?.sku || "",
    slug: product?.slug || "",
    tags: product?.tags?.join(", ") || "",
    stockStatus: product?.stockStatus || "in_stock",
    finish: product?.finish || "",
    material: product?.material || "",
    leadTimeDays:
      product?.leadTimeDays === undefined || product?.leadTimeDays === null
        ? ""
        : String(product.leadTimeDays),
    isActive: product?.isActive !== false,
    catalogueEnabled: product?.catalogueEnabled === true,
    gallery: Array.isArray(product?.gallery) ? product.gallery : [],
    variants:
      Array.isArray(product?.variants) && product.variants.length
        ? product.variants.map((variant) => ({
            ...emptyVariant,
            ...variant,
            price:
              variant?.price === undefined || variant?.price === null
                ? ""
                : String(variant.price),
          }))
        : [],
    specifications: specificationEntries.length
      ? specificationEntries.map(([key, value]) => ({
          key,
          value: String(value),
        }))
      : [{ ...emptySpecification }],
  };
}

function VariantEditor({ variants, onChange }) {
  const updateVariant = (index, field, value) => {
    onChange(
      variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  const removeVariant = (index) => {
    onChange(variants.filter((_, variantIndex) => variantIndex !== index));
  };

  const setDefaultVariant = (index) => {
    onChange(
      variants.map((variant, variantIndex) => ({
        ...variant,
        isDefault: variantIndex === index,
      })),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Variants</h3>
          <p className="text-xs text-gray-500">
            Add colour, finish, or size-specific prices and stock states.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...variants, { ...emptyVariant }])}
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700"
        >
          Add variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">
          No variants added yet. The base price will be used in the public catalogue.
        </div>
      ) : (
        variants.map((variant, index) => (
          <div
            key={`${variant.id || "variant"}-${index}`}
            className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Variant {index + 1}
                </h4>
                <p className="text-xs text-gray-500">
                  Use these values to control the selection price and display.
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Variant label
                </label>
                <input
                  type="text"
                  value={variant.title}
                  onChange={(event) =>
                    updateVariant(index, "title", event.target.value)
                  }
                  placeholder="Example: Brushed brass / 600mm"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Colour
                </label>
                <input
                  type="text"
                  value={variant.color}
                  onChange={(event) =>
                    updateVariant(index, "color", event.target.value)
                  }
                  placeholder="Brushed brass"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Colour swatch
                </label>
                <input
                  type="text"
                  value={variant.colorSwatch}
                  onChange={(event) =>
                    updateVariant(index, "colorSwatch", event.target.value)
                  }
                  placeholder="#b58b3a"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <input
                  type="text"
                  value={variant.size}
                  onChange={(event) =>
                    updateVariant(index, "size", event.target.value)
                  }
                  placeholder="600 x 400mm"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Finish
                </label>
                <input
                  type="text"
                  value={variant.finish}
                  onChange={(event) =>
                    updateVariant(index, "finish", event.target.value)
                  }
                  placeholder="Matt black"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(event) =>
                    updateVariant(index, "sku", event.target.value)
                  }
                  placeholder="SKU-001"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    £
                  </span>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(event) =>
                      updateVariant(index, "price", event.target.value)
                    }
                    min="0"
                    step="0.01"
                    className="block w-full rounded-xl border border-gray-300 py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock status
                </label>
                <select
                  value={variant.stockStatus}
                  onChange={(event) =>
                    updateVariant(index, "stockStatus", event.target.value)
                  }
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STOCK_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Variant image URL
                </label>
                <input
                  type="url"
                  value={variant.imageUrl}
                  onChange={(event) =>
                    updateVariant(index, "imageUrl", event.target.value)
                  }
                  placeholder="https://..."
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={variant.isDefault}
                onChange={() => setDefaultVariant(index)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Set as default catalogue selection
            </label>
          </div>
        ))
      )}
    </div>
  );
}

function SpecificationEditor({ specifications, onChange }) {
  const updateSpecification = (index, field, value) => {
    onChange(
      specifications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Specifications</h3>
          <p className="text-xs text-gray-500">
            Optional info chips displayed in the public catalogue.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([...specifications, { ...emptySpecification }])
          }
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700"
        >
          Add spec
        </button>
      </div>

      {specifications.map((item, index) => (
        <div key={`spec-${index}`} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            value={item.key}
            onChange={(event) =>
              updateSpecification(index, "key", event.target.value)
            }
            placeholder="Material"
            className="rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={item.value}
            onChange={(event) =>
              updateSpecification(index, "value", event.target.value)
            }
            placeholder="Solid brass"
            className="rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() =>
              onChange(specifications.filter((_, itemIndex) => itemIndex !== index))
            }
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode,
  isSubmitting,
  categories,
  suppliers,
}) {
  const [formData, setFormData] = useState(buildInitialState(product));

  useEffect(() => {
    if (isOpen) {
      setFormData(buildInitialState(product));
    }
  }, [isOpen, product]);

  const specificationPreview = useMemo(
    () =>
      formData.specifications
        .filter((item) => item.key.trim() && item.value.trim())
        .map((item) => `${item.key}: ${item.value}`),
    [formData.specifications],
  );

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.imageUrl ||
      !formData.supplier ||
      !formData.category ||
      formData.price === ""
    ) {
      alert("Please fill in the required fields: name, image, supplier, type, and price.");
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      leadTimeDays:
        formData.leadTimeDays === "" ? undefined : parseInt(formData.leadTimeDays, 10),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      specifications: formData.specifications.reduce((accumulator, item) => {
        const key = item.key.trim();
        const value = item.value.trim();
        if (key && value) {
          accumulator[key] = value;
        }
        return accumulator;
      }, {}),
      variants: formData.variants
        .filter((variant) =>
          [variant.title, variant.color, variant.size, variant.finish, variant.sku].some(
            (value) => value?.trim(),
          ),
        )
        .map((variant, index) => ({
          ...variant,
          id: variant.id || undefined,
          colorValue:
            variant.colorValue ||
            variant.color.toLowerCase().trim().replace(/\s+/g, " "),
          price:
            variant.price === "" || variant.price === undefined
              ? parseFloat(formData.price)
              : parseFloat(variant.price),
          isDefault:
            formData.variants.some((item) => item.isDefault) && variant.isDefault
              ? true
              : index === 0,
        })),
      gallery: formData.gallery.filter(Boolean),
      brand: formData.brand || formData.supplier,
      catalogueCategory: formData.catalogueCategory || undefined,
      slug: formData.slug.trim() || undefined,
      productUrl: formData.productUrl.trim() || undefined,
      finish: formData.finish.trim() || undefined,
      material: formData.material.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {mode === "create" ? "Add catalogue product" : "Edit catalogue product"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage the internal product record and its public catalogue presentation in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 px-6 py-6">
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-4 rounded-[2rem] border border-gray-200 bg-gray-50 p-5">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Core product
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Base price *
                  </label>
                  <div className="relative mt-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      £
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="block w-full rounded-xl border border-gray-300 py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lead time (days)
                  </label>
                  <input
                    type="number"
                    name="leadTimeDays"
                    value={formData.leadTimeDays}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier *
                  </label>
                  <select
                    value={suppliers.includes(formData.supplier) ? formData.supplier : ""}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        supplier: event.target.value || current.supplier,
                      }))
                    }
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>
                        {supplier}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="Or enter a new supplier"
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Defaults to supplier if blank"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product type *
                  </label>
                  <select
                    value={categories.includes(formData.category) ? formData.category : ""}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        category: event.target.value || current.category,
                      }))
                    }
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select product type</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Or enter a new type"
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Catalogue category
                  </label>
                  <select
                    name="catalogueCategory"
                    value={formData.catalogueCategory}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Auto-detect from product type</option>
                    {CATALOGUE_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock status
                  </label>
                  <select
                    name="stockStatus"
                    value={formData.stockStatus}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STOCK_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Finish
                  </label>
                  <input
                    type="text"
                    name="finish"
                    value={formData.finish}
                    onChange={handleChange}
                    placeholder="Brushed brass"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder="Porcelain, solid brass, oak..."
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="modern, hotel-look, brass"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-gray-200 bg-gray-50 p-5">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Imagery & publishing
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Main image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <FileUpload
                multiple={false}
                maxFiles={1}
                folder="catalogue-products"
                allowedTypes={[".jpg", ".jpeg", ".png", ".webp"]}
                onUploadComplete={(files) => {
                  if (files[0]?.url) {
                    setFormData((current) => ({
                      ...current,
                      imageUrl: files[0].url,
                    }));
                  }
                }}
              />

              {formData.imageUrl ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <img
                    src={formData.imageUrl}
                    alt={formData.name || "Product preview"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gallery images
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Upload additional detail or lifestyle images for the public catalogue page.
                </p>
              </div>

              <FileUpload
                folder="catalogue-products"
                allowedTypes={[".jpg", ".jpeg", ".png", ".webp"]}
                onUploadComplete={(files) => {
                  const urls = files.map((file) => file.url).filter(Boolean);
                  setFormData((current) => ({
                    ...current,
                    gallery: [...new Set([...current.gallery, ...urls])],
                  }));
                }}
              />

              {formData.gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {formData.gallery.map((imageUrl) => (
                    <div
                      key={imageUrl}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    >
                      <img
                        src={imageUrl}
                        alt="Gallery preview"
                        className="aspect-square w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((current) => ({
                            ...current,
                            gallery: current.gallery.filter((item) => item !== imageUrl),
                          }))
                        }
                        className="w-full border-t border-gray-200 px-3 py-2 text-xs font-semibold text-red-600"
                      >
                        Remove image
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product source URL
                  </label>
                  <input
                    type="url"
                    name="productUrl"
                    value={formData.productUrl}
                    onChange={handleChange}
                    placeholder="https://supplier-site.com/product"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="auto-generated if left blank"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="catalogueEnabled"
                    checked={formData.catalogueEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  Show this product in the public catalogue
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  Keep this product active for internal moodboards
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-gray-200 bg-white p-5">
            <VariantEditor
              variants={formData.variants}
              onChange={(variants) => setFormData((current) => ({ ...current, variants }))}
            />
          </section>

          <section className="rounded-[2rem] border border-gray-200 bg-white p-5">
            <SpecificationEditor
              specifications={formData.specifications}
              onChange={(specifications) =>
                setFormData((current) => ({ ...current, specifications }))
              }
            />
            {specificationPreview.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {specificationPreview.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create product"
                  : "Update product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
