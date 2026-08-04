import Link from "next/link";

export default function CalculatorCTA({
  calculatorHref,
  calculatorLabel,
  title,
  description,
  secondaryHref,
  secondaryLabel = "Book a consultation",
}) {
  const isExternal = secondaryHref?.startsWith("http");

  return (
    <aside className="mt-8 overflow-hidden rounded-2xl border border-[#cfe0ff] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8">
      <h3 className="text-2xl font-black text-[#100b47] md:text-3xl">{title}</h3>
      <p className="mt-3 max-w-3xl text-base leading-8 text-gray-700">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={calculatorHref} className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#266bf1] px-6 text-sm font-bold text-white transition hover:bg-[#1449B0]">
          {calculatorLabel}
        </Link>
        {secondaryHref ? (
          <Link
            href={secondaryHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[#bfd3f9] bg-white px-6 text-sm font-bold text-[#266bf1] transition hover:border-[#266bf1]"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
