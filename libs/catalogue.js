const CATEGORY_DEFINITIONS = [
  {
    id: "bathroom",
    label: "Bathroom",
    description: "Sanitaryware, brassware, mirrors, heating, and bathroom details.",
    accent: "from-stone-900 via-stone-700 to-amber-500",
  },
  {
    id: "kitchen",
    label: "Kitchen",
    description: "Cabinetry, appliances, sinks, and kitchen finishing pieces.",
    accent: "from-zinc-900 via-zinc-700 to-orange-500",
  },
  {
    id: "windows",
    label: "Windows",
    description: "Frames, glazing systems, and opening hardware.",
    accent: "from-slate-900 via-slate-700 to-sky-500",
  },
  {
    id: "doors",
    label: "Doors",
    description: "Interior, exterior, and ironmongery-led door selections.",
    accent: "from-neutral-900 via-neutral-700 to-rose-500",
  },
  {
    id: "furniture",
    label: "Furniture",
    description: "Freestanding pieces, fitted storage, and room-making accents.",
    accent: "from-emerald-950 via-emerald-800 to-lime-500",
  },
  {
    id: "lighting",
    label: "Lighting",
    description: "Decorative fixtures, sockets, switches, and layered lighting.",
    accent: "from-slate-950 via-slate-800 to-yellow-400",
  },
  {
    id: "tiles",
    label: "Tiles",
    description: "Wall, floor, trim, and stone-effect tile collections.",
    accent: "from-stone-950 via-stone-800 to-orange-400",
  },
  {
    id: "flooring",
    label: "Flooring",
    description: "Timber, engineered boards, skirting, and transition details.",
    accent: "from-amber-950 via-amber-800 to-emerald-500",
  },
];

const COLOR_PATTERNS = [
  ["matt black", "#111827"],
  ["matte black", "#111827"],
  ["black", "#111827"],
  ["brushed brass", "#b58b3a"],
  ["brass", "#b58b3a"],
  ["brushed gold", "#b59349"],
  ["gold", "#c8a24d"],
  ["chrome", "#cbd5e1"],
  ["nickel", "#a8adb4"],
  ["silver", "#cbd5e1"],
  ["bronze", "#7c5a3c"],
  ["copper", "#b87333"],
  ["oak", "#b08968"],
  ["walnut", "#6b4f3a"],
  ["concrete grey", "#8f949b"],
  ["grey", "#9ca3af"],
  ["gray", "#9ca3af"],
  ["white", "#f8fafc"],
  ["ivory", "#f5f1e8"],
  ["beige", "#d6c4a5"],
  ["cream", "#f3ead8"],
  ["sand", "#ccb99b"],
  ["taupe", "#9f8c7b"],
  ["green", "#4d7c0f"],
  ["blue", "#2563eb"],
  ["terracotta", "#c96c47"],
];

const CATEGORY_INFERENCE = {
  tiles: [
    /\btile\b/i,
    /\btrim\b/i,
  ],
  flooring: [
    /\bfloor\b/i,
    /\bwood\b/i,
    /\bskirting\b/i,
    /\bengineered wood\b/i,
  ],
  lighting: [
    /\blight/i,
    /\bsconce/i,
    /\bswitch/i,
    /\bsocket/i,
    /\bpendant/i,
    /\bceiling/i,
  ],
  doors: [/\bdoor/i, /\bironmongery/i, /\bhandle/i],
  windows: [/\bwindow/i, /\bglazing/i],
  kitchen: [
    /\bkitchen/i,
    /\bhob\b/i,
    /\boven\b/i,
    /\bappliance/i,
    /\bcabinet/i,
    /\bworktop/i,
    /\bsplashback/i,
    /\bsink/i,
  ],
  furniture: [
    /\bfurniture/i,
    /\btable\b/i,
    /\bchair\b/i,
    /\bsofa\b/i,
    /\bstool\b/i,
    /\bsideboard\b/i,
  ],
  bathroom: [
    /\bbasin/i,
    /\bbath/i,
    /\bshower/i,
    /\btoilet/i,
    /\bvanity/i,
    /\bwetroom/i,
    /\bmirror/i,
    /\bradiator/i,
    /\btowel rail/i,
    /\bmixer/i,
    /\bbathroom/i,
    /\bflush\b/i,
  ],
};

export const CATALOGUE_CATEGORIES = CATEGORY_DEFINITIONS;
export const CATALOGUE_SELECTION_STORAGE_KEY =
  "bhs-public-catalogue-selection";

export const STOCK_STATUSES = [
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
  { value: "made_to_order", label: "Made to order" },
];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "newest", label: "Newest" },
];

export function slugify(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value || 0);
}

export function normalizeCatalogueCategory(value) {
  const normalized = slugify(value);
  return CATALOGUE_CATEGORIES.some((category) => category.id === normalized)
    ? normalized
    : "";
}

function firstMatch(text = "", expressions = []) {
  return expressions.some((expression) => expression.test(text));
}

export function inferCatalogueCategory(product = {}) {
  const explicitCategory = normalizeCatalogueCategory(product.catalogueCategory);
  if (explicitCategory) {
    return explicitCategory;
  }

  const text = [
    product.category,
    product.productType,
    product.name,
    product.description,
    ...(Array.isArray(product.tags) ? product.tags : []),
  ]
    .filter(Boolean)
    .join(" ");

  const orderedCategories = [
    "tiles",
    "flooring",
    "lighting",
    "doors",
    "windows",
    "kitchen",
    "furniture",
    "bathroom",
  ];

  const matched = orderedCategories.find((category) =>
    firstMatch(text, CATEGORY_INFERENCE[category] || []),
  );

  return matched || "bathroom";
}

export function extractColorsFromText(text = "") {
  const lower = text.toLowerCase();
  return COLOR_PATTERNS.filter(([label]) => lower.includes(label)).map(
    ([label, hex]) => ({
      label: label
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      value: label,
      swatch: hex,
    }),
  );
}

export function extractSizeFromText(text = "") {
  const dimensionMatch = text.match(
    /(\d+(?:\.\d+)?\s?(?:x|×)\s?\d+(?:\.\d+)?(?:\s?(?:x|×)\s?\d+(?:\.\d+)?)?\s?(?:mm|cm|m)?)/i,
  );
  if (dimensionMatch) {
    return dimensionMatch[1].replace(/\s+/g, " ").trim();
  }

  const singleDimensionMatch = text.match(/\b(\d+(?:\.\d+)?\s?(?:mm|cm|m))\b/i);
  return singleDimensionMatch ? singleDimensionMatch[1].trim() : "";
}

export function getProductVariants(product = {}) {
  const fallbackColors = extractColorsFromText(
    [product.name, product.description, product.finish].filter(Boolean).join(" "),
  );
  const fallbackSize = extractSizeFromText(product.name || "");
  const basePrice = Number(product.price || 0);
  const stockStatus = product.stockStatus || "in_stock";
  const variants = Array.isArray(product.variants) ? product.variants : [];

  if (!variants.length) {
    return [
      {
        id: "default",
        title: "Default",
        color: fallbackColors[0]?.label || "",
        colorValue: fallbackColors[0]?.value || "",
        colorSwatch: fallbackColors[0]?.swatch || "",
        size: fallbackSize,
        finish: product.finish || "",
        sku: product.sku || "",
        price: basePrice,
        imageUrl: product.imageUrl || "",
        isDefault: true,
        stockStatus,
        inStock: stockStatus !== "out_of_stock",
      },
    ];
  }

  return variants.map((variant, index) => {
    const detectedColor =
      variant.color ||
      extractColorsFromText(
        [variant.title, variant.finish, product.finish].filter(Boolean).join(" "),
      )[0]?.label ||
      "";
    const detectedColorValue =
      variant.colorValue ||
      slugify(variant.color || detectedColor).replace(/-/g, " ") ||
      "";
    const swatch =
      variant.colorSwatch ||
      extractColorsFromText(
        [variant.color, variant.title, variant.finish].filter(Boolean).join(" "),
      )[0]?.swatch ||
      "";

    return {
      id: variant.id || slugify(variant.title || `${variant.color}-${variant.size}-${index}`) || `variant-${index + 1}`,
      title: variant.title || `Variant ${index + 1}`,
      color: variant.color || detectedColor,
      colorValue: detectedColorValue,
      colorSwatch: swatch,
      size: variant.size || extractSizeFromText(variant.title || ""),
      finish: variant.finish || "",
      sku: variant.sku || "",
      price: Number(
        variant.price === undefined || variant.price === null
          ? basePrice
          : variant.price,
      ),
      imageUrl: variant.imageUrl || product.imageUrl || "",
      isDefault: Boolean(variant.isDefault) || index === 0,
      stockStatus: variant.stockStatus || stockStatus,
      inStock: (variant.stockStatus || stockStatus) !== "out_of_stock",
    };
  });
}

export function getProductPriceRange(product = {}) {
  const prices = getProductVariants(product)
    .map((variant) => Number(variant.price || 0))
    .filter((price) => Number.isFinite(price));

  const min = prices.length ? Math.min(...prices) : Number(product.price || 0);
  const max = prices.length ? Math.max(...prices) : Number(product.price || 0);

  return {
    min,
    max,
    label: min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`,
  };
}

export function serializeCatalogueProduct(product = {}) {
  const variants = getProductVariants(product);
  const priceRange = getProductPriceRange(product);
  const colourMap = new Map();
  const sizeSet = new Set();

  variants.forEach((variant) => {
    if (variant.color) {
      const key = variant.colorValue || slugify(variant.color).replace(/-/g, " ");
      if (!colourMap.has(key)) {
        colourMap.set(key, {
          label: variant.color,
          value: key,
          swatch: variant.colorSwatch || "",
        });
      }
    }

    if (variant.size) {
      sizeSet.add(variant.size);
    }
  });

  const gallery = [
    product.imageUrl,
    ...(Array.isArray(product.gallery) ? product.gallery : []),
  ].filter(Boolean);

  const specifications = Object.entries(product.specifications || {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  return {
    id: product.id || product._id?.toString() || "",
    slug: product.slug || slugify(product.name || ""),
    name: product.name || "",
    description: product.description || "",
    brand: product.brand || product.supplier || "",
    supplier: product.supplier || product.brand || "",
    productType: product.category || product.productType || "Product",
    catalogueCategory: inferCatalogueCategory(product),
    imageUrl: product.imageUrl || "",
    gallery,
    productUrl: product.productUrl || "",
    sku: product.sku || "",
    finish: product.finish || "",
    material: product.material || "",
    stockStatus: product.stockStatus || "in_stock",
    isPublished:
      product.catalogueEnabled === undefined
        ? product.isActive !== false
        : Boolean(product.catalogueEnabled),
    isActive: product.isActive !== false,
    tags: Array.isArray(product.tags) ? product.tags : [],
    variants,
    colours: Array.from(colourMap.values()),
    sizes: Array.from(sizeSet),
    price: Number(product.price || 0),
    priceRange,
    leadTimeDays:
      product.leadTimeDays === undefined || product.leadTimeDays === null
        ? ""
        : Number(product.leadTimeDays),
    specifications,
    createdAt: product.createdAt || null,
    updatedAt: product.updatedAt || null,
  };
}

export function getCatalogueFilterOptions(products = []) {
  const brands = new Set();
  const productTypes = new Set();
  const colours = new Map();

  products.forEach((product) => {
    if (product.brand) {
      brands.add(product.brand);
    }
    if (product.productType) {
      productTypes.add(product.productType);
    }
    (product.colours || []).forEach((colour) => {
      if (!colours.has(colour.value)) {
        colours.set(colour.value, colour);
      }
    });
  });

  return {
    brands: Array.from(brands).sort((a, b) => a.localeCompare(b)),
    productTypes: Array.from(productTypes).sort((a, b) => a.localeCompare(b)),
    colours: Array.from(colours.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
  };
}

export function filterAndSortCatalogueProducts(products = [], filters = {}) {
  const selectedCategory =
    normalizeCatalogueCategory(filters.category || filters.room) || "";
  const search = (filters.search || "").trim().toLowerCase();
  const brand = (filters.brand || "").trim();
  const productType = (filters.type || "").trim();
  const colour = (filters.colour || "").trim().toLowerCase();
  const availability = (filters.availability || "").trim();
  const sort = filters.sort || "featured";

  const filteredProducts = products.filter((product) => {
    if (!product.isPublished || !product.isActive) {
      return false;
    }

    if (selectedCategory && product.catalogueCategory !== selectedCategory) {
      return false;
    }

    if (brand && product.brand !== brand) {
      return false;
    }

    if (productType && product.productType !== productType) {
      return false;
    }

    if (
      colour &&
      !(product.colours || []).some(
        (productColour) =>
          productColour.value === colour ||
          productColour.label.toLowerCase() === colour,
      )
    ) {
      return false;
    }

    if (availability === "in_stock" && product.stockStatus === "out_of_stock") {
      return false;
    }

    if (availability === "out_of_stock" && product.stockStatus !== "out_of_stock") {
      return false;
    }

    if (search) {
      const haystack = [
        product.name,
        product.description,
        product.brand,
        product.productType,
        product.catalogueCategory,
        ...(product.tags || []),
        ...(product.colours || []).map((item) => item.label),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) {
        return false;
      }
    }

    return true;
  });

  filteredProducts.sort((left, right) => {
    switch (sort) {
      case "price-asc":
        return left.priceRange.min - right.priceRange.min;
      case "price-desc":
        return right.priceRange.min - left.priceRange.min;
      case "name-asc":
        return left.name.localeCompare(right.name);
      case "newest":
        return new Date(right.updatedAt || 0) - new Date(left.updatedAt || 0);
      case "featured":
      default:
        return new Date(right.updatedAt || 0) - new Date(left.updatedAt || 0);
    }
  });

  return filteredProducts;
}

export function getCategoryCounts(products = []) {
  return CATALOGUE_CATEGORIES.map((category) => ({
    ...category,
    count: products.filter(
      (product) =>
        product.isPublished &&
        product.isActive &&
        product.catalogueCategory === category.id,
    ).length,
  }));
}
