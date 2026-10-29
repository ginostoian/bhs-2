import Link from "next/link";
import CalculatorPage from "@/components/calculators/CalculatorPage";
import { CALCULATORS, runEstimate } from "@/libs/calculators/registry";
import { loadCalculatorConfig } from "@/libs/calculators/rates";
import { formatGBP } from "@/libs/calculators/common";

export const revalidate = 3600;

const RANGES = [
  ["flatPack", "Value (IKEA and flat-pack)", "laminate", "essentials"],
  ["tradeFitted", "Mid-range (Howdens, Wren, Magnet)", "quartz", "standard"],
  ["premium", "Premium (German and high-end British)", "quartz", "premium"],
  ["bespoke", "Bespoke, hand-painted", "quartz", "premium"],
];

export default async function Page() {
  const calc = CALCULATORS.kitchen;
  const config = await loadCalculatorConfig("kitchen");
  const rows = RANGES.map(([range, label, worktop, appliances]) => {
    const r = runEstimate(calc, { ...calc.defaults, range, worktop, appliances }, config);
    return [label, `${formatGBP(r.low)} – ${formatGBP(r.high)}`];
  });

  return (
    <CalculatorPage
      id="kitchen"
      service="Kitchen renovation"
      eyebrow="Free calculator · Updated for 2026"
      title="Kitchen renovation cost calculator"
      intro="Find out what your new kitchen will cost fitted, not just the cabinets. Units, worktops, appliances, splashback, flooring, electrics, plumbing, fitting and VAT, priced for your room."
      points={["Value to bespoke", "Worktop and appliance options", "Free PDF and shareable link"]}
      benchmark={{
        title: "What a fitted kitchen costs in London, 2026",
        intro: "A 12 m² L-shaped kitchen in outer London with tiled splashback, LVT floor and new sockets and lighting, fitted, including VAT.",
        columns: ["Kitchen type", "Likely fitted cost"],
        rows,
        note: "Moving the sink, relocating the boiler or knocking through a wall adds to these figures. Add them in the calculator.",
      }}
      sections={[
        {
          title: "Why fitted kitchens cost more than the brochure",
          body: (
            <p>
              Cabinets are often less than a third of the final bill. Worktops, appliances, fitting labour, electrics, plumbing, flooring and making good make up the rest. That is why a £6,000 kitchen from a showroom regularly becomes £20,000+ once it’s in. For a side-by-side comparison see{" "}
              <Link href="/blog/bespoke-vs-howdens-vs-ikea-kitchen-london">IKEA vs Howdens vs bespoke kitchen costs</Link>. Extending as well? Read our{" "}
              <Link href="/blog/kitchen-extension-cost-london">kitchen extension cost guide</Link>.
            </p>
          ),
        },
        {
          title: "Where to save and where to spend",
          body: (
            <ul>
              <li><strong>Keep the layout</strong> if you can. Moving the sink and appliances adds plumbing and electrical work.</li>
              <li><strong>Spend on worktops and hinges.</strong> They take the most wear.</li>
              <li><strong>Mid-range carcasses with upgraded doors</strong> can look bespoke for a fraction of the price.</li>
            </ul>
          ),
        },
      ]}
      faqs={[
        { q: "How much does a new kitchen cost in London in 2026?", a: "Fitted London kitchens typically cost £12,000–£22,000 for value ranges, £18,000–£38,000 for mid-range trade kitchens such as Howdens, and £45,000–£90,000+ for bespoke, including installation and VAT." },
        { q: "How much does it cost just to fit a kitchen?", a: "Fitting labour for an average kitchen in London is usually £3,500–£7,000, before electrics, plumbing, tiling and decoration." },
        { q: "What's the most expensive part of a kitchen?", a: "Usually the units and worktops together, followed by appliances. Stone or sintered worktops and premium appliances can each add several thousand pounds." },
        { q: "How long does a kitchen renovation take?", a: "Most kitchen renovations take 2–4 weeks on site once everything has been ordered. Bespoke kitchens can take 8–12 weeks to make before fitting starts." },
        { q: "Does the calculator include VAT?", a: "Yes, by default. You can switch it off to compare with quotes that exclude VAT." },
      ]}
      related={[{ href: "/kitchen-renovation", label: "Our kitchen service" }]}
    />
  );
}
