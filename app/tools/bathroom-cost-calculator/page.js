import Link from "next/link";
import CalculatorPage from "@/components/calculators/CalculatorPage";
import { CALCULATORS, runEstimate } from "@/libs/calculators/registry";
import { loadCalculatorConfig } from "@/libs/calculators/rates";
import { formatGBP } from "@/libs/calculators/common";
import { BATHROOM_TYPES } from "@/libs/calculators/bathroom";

export const revalidate = 3600;

export default async function Page() {
  const calc = CALCULATORS.bathroom;
  const config = await loadCalculatorConfig("bathroom");
  const price = (roomType, products) => {
    const area = config.roomTypes[roomType].defaultArea;
    const r = runEstimate(calc, { ...calc.defaults, roomType, area, products, extras: {} }, config);
    return `${formatGBP(r.low)} – ${formatGBP(r.high)}`;
  };
  const rows = BATHROOM_TYPES.map((t) => [t.label, `${config.roomTypes[t.id].defaultArea} m²`, price(t.id, "essential"), price(t.id, "midRange"), price(t.id, "premium")]);

  return (
    <CalculatorPage
      id="bathroom"
      service="Bathroom renovation"
      eyebrow="Free calculator · Updated for 2026"
      title="Bathroom renovation cost calculator"
      intro="Get a realistic, all-in price for your bathroom, en-suite, cloakroom or wet room: strip-out, plumbing, waterproofing, tiling, sanitaryware, fitting and VAT, priced for where you live."
      points={["Labour and products shown separately", "Layout and tiling options", "Free PDF and shareable link"]}
      benchmark={{
        title: "What a bathroom costs in London, 2026",
        intro: "All-in prices in outer London, keeping the layout, with half-height tiling, including a contingency and VAT.",
        columns: ["Room", "Typical size", "Essential products", "Mid-range products", "Premium products"],
        rows,
        note: "Moving the toilet or creating a wet room adds £1,000–£3,000 of plumbing and waterproofing. Add it in the calculator.",
      }}
      sections={[
        {
          title: "Labour versus products",
          body: (
            <p>
              In London, labour is usually the biggest part of a bathroom: strip-out, plumbing, electrics, waterproofing, boarding, tiling and fitting take a team 2–3 weeks. Products are where the range comes from. The same room can cost twice as much with designer brassware and natural stone. The calculator shows both so you can see where your money goes.
            </p>
          ),
        },
        {
          title: "Want the detail?",
          body: (
            <p>
              See typical prices and project examples on our <Link href="/bathroom-renovation">bathroom renovation page</Link>, and the year&apos;s ideas in our <Link href="/blog/bathroom-renovation-london-trends-2026">2026 bathroom trends guide</Link>.
            </p>
          ),
        },
      ]}
      faqs={[
        { q: "How much does a bathroom renovation cost in London in 2026?", a: "Most London bathrooms cost £8,000–£16,000 all-in. A cloakroom can be £4,000–£7,000, while premium family bathrooms and wet rooms often reach £20,000–£30,000." },
        { q: "Is £10k enough for a new bathroom?", a: "In London, £10,000 usually covers a family bathroom with essential or entry mid-range products, keeping the existing layout. Moving things around or choosing premium products will take it higher." },
        { q: "What is the most expensive part of a bathroom renovation?", a: "Labour, especially plumbing and tiling. Moving the toilet is the biggest single jump because the soil pipe has to move too." },
        { q: "How long does a bathroom renovation take?", a: "Typically 1–2 weeks for a cloakroom, 2–3 weeks for a family bathroom and 3–4 weeks for a wet room, once products are on site." },
        { q: "Does the price include VAT?", a: "Yes, by default. Switch VAT off if you're comparing with a fitter who isn't VAT registered." },
      ]}
      related={[{ href: "/bathroom-renovation", label: "Our bathroom service" }]}
    />
  );
}
