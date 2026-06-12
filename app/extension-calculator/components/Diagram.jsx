"use client";

import Image from "next/image";

const extensionVisuals = {
  rearExtension: {
    title: "Rear extension",
    caption: "Single-storey rear addition with rooflights and garden-facing glazing.",
    src: "/assets/extension-calculator/single-storey-extension.jpg",
    alt: "Photorealistic London rear house extension with rooflights and sliding garden doors",
  },
  singleStorey: {
    title: "Rear extension",
    caption: "Single-storey rear addition with rooflights and garden-facing glazing.",
    src: "/assets/extension-calculator/single-storey-extension.jpg",
    alt: "Photorealistic London rear house extension with rooflights and sliding garden doors",
  },
  sideReturn: {
    title: "Side return extension",
    caption: "Narrow side-passage infill with a glazed roof and kitchen connection.",
    src: "/assets/extension-calculator/side-return-extension.jpg",
    alt: "Photorealistic London side return extension with glazed roof and brick side passage",
  },
  wraparound: {
    title: "Wraparound extension",
    caption: "Rear and side-return addition creating a wider open-plan ground floor.",
    src: "/assets/extension-calculator/wraparound-extension.jpg",
    alt: "Photorealistic London wraparound house extension with rear and side glazing",
  },
  kitchenExtension: {
    title: "Kitchen extension with fit-out",
    caption: "Extension budget including a mid-range kitchen and dining fit-out allowance.",
    src: "/assets/extension-calculator/kitchen-extension.jpg",
    alt: "Photorealistic London kitchen extension with island, dining space and garden glazing",
  },
  doubleStorey: {
    title: "Double-storey extension",
    caption: "Two-level addition integrated into the existing London home.",
    src: "/assets/extension-calculator/double-storey-extension.jpg",
    alt: "Photorealistic London double-storey house extension with matching brickwork and large glazing",
  },
  basement: {
    title: "Basement extension",
    caption: "Lower-ground living space with lightwell, steps and courtyard glazing.",
    src: "/assets/extension-calculator/basement-extension.jpg",
    alt: "Photorealistic London basement extension with lower-ground lightwell and glass doors",
  },
  loft: {
    title: "Loft conversion",
    caption: "Dormer loft conversion adding usable roof-level living space.",
    src: "/assets/extension-calculator/loft-conversion.jpg",
    alt: "Photorealistic London loft conversion with dormer windows and rooflights",
  },
};

const fallbackVisual = {
  title: "Choose an extension type",
  caption: "Your project image will update once you select a calculator option.",
  src: "/assets/extension-calculator/single-storey-extension.jpg",
  alt: "Modern London house extension example",
};

const Diagram = ({ extensionType, size }) => {
  const visual = extensionVisuals[extensionType] || fallbackVisual;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes="(max-width: 1024px) 90vw, 360px"
          className={`object-cover transition duration-300 ${
            extensionType ? "scale-100" : "scale-105 opacity-70"
          }`}
          priority={false}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Extension visual
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            {visual.title}
          </h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm leading-6 text-stone-600">{visual.caption}</p>
        {size > 0 && (
          <div className="mt-3 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-950">
            {size} m² estimate
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagram;
