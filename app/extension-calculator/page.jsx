import Link from "next/link";
import CalculatorPage from "@/components/calculators/CalculatorPage";
import { CALCULATORS, runEstimate } from "@/libs/calculators/registry";
import { loadCalculatorConfig } from "@/libs/calculators/rates";
import { formatGBP } from "@/libs/calculators/common";

export const revalidate = 3600;

const TYPICAL = [
  ["rearExtension", "Single-storey rear", 25],
  ["sideReturn", "Side return", 15],
  ["wraparound", "Wraparound", 35],
  ["doubleStorey", "Double storey (two floors)", 40],
  ["basement", "Basement", 40],
];

export default async function Page() {
  const calc = CALCULATORS.extension;
  const config = await loadCalculatorConfig("extension");
  const rows = TYPICAL.map(([type, label, area]) => {
    const r = runEstimate(calc, { ...calc.defaults, type, area, extras: {} }, config);
    return [label, `${area} m²`, `${formatGBP(r.low)} – ${formatGBP(r.high)}`, formatGBP(r.perM2)];
  });

  return (
    <CalculatorPage
      id="extension"
      service="House extension"
      eyebrow="Free calculator · Updated for 2026"
      title="House extension cost calculator"
      intro="See what your extension will really cost, including the parts most calculators leave out: fees, party wall, contingency and VAT. Built on 2026 London and UK prices and checked against real quotes."
      points={["Rear, side return, wraparound, double storey and basement", "Every cost line itemised", "Free PDF and shareable link"]}
      benchmark={{
        title: "What a London extension costs in 2026",
        intro: "Typical all-in budgets in outer London for a project finished ready to live in, including professional fees, a 10% contingency and VAT.",
        columns: ["Extension", "Typical size", "Likely all-in budget", "Per m²"],
        rows,
        note: "Central London adds 10–15%; most of the UK is 10–25% lower. Use the calculator for your own size, finish and location.",
      }}
      sections={[
        {
          title: "How the calculator works",
          body: (
            <>
              <p>
                We price the build per square metre for your type of extension, then adjust for location, property type, access, glazing and finish. Extras such as bi-fold doors, rooflights and a new kitchen are added at typical London prices.
              </p>
              <p>
                On top of the build we add the costs people forget: measured survey, design, structural engineer, building control, planning or a lawful development certificate, party wall surveyors, a contingency and VAT. The range widens when your plans are less defined, because that is when budgets move most.
              </p>
            </>
          ),
        },
        {
          title: "What makes extensions cost more",
          body: (
            <ul>
              <li><strong>Glazing.</strong> Large sliding or bi-fold doors and glass roofs can add £10,000–£25,000.</li>
              <li><strong>Steelwork.</strong> Opening up the back of the house needs steel beams, often £2,000–£3,000 each installed.</li>
              <li><strong>Ground and drains.</strong> Clay, trees and shared drains can mean deeper foundations or a build-over agreement.</li>
              <li><strong>Access.</strong> In a terrace, everything goes through the house, which slows the build.</li>
              <li><strong>Small extensions.</strong> Fixed costs are spread over fewer square metres, so a side return costs more per m² than a big rear extension.</li>
            </ul>
          ),
        },
        {
          title: "Getting from estimate to quote",
          body: (
            <p>
              Use your range to set a realistic budget, then get drawings and a structural design so builders can price the same thing. Compare quotes line by line against the breakdown in your PDF. For more detail read our{" "}
              <Link href="/blog/house-extension-guide-2025">London extension cost guide</Link> and{" "}
              <Link href="/blog/house-extension-types">types of house extension</Link>. Planning a side return? Read our{" "}
              <Link href="/blog/side-return-extension-cost-london">side return extension cost guide</Link>.
            </p>
          ),
        },
      ]}
      faqs={[
        { q: "How much does a single-storey extension cost in London in 2026?", a: "Most single-storey rear extensions in London cost £2,500–£4,000 per m² to build, excluding VAT and fees. A typical 25 m² extension finished ready to live in comes to roughly £90,000–£120,000 all-in once fees, contingency and VAT are added." },
        { q: "Is a double-storey extension cheaper per square metre?", a: "Usually, yes. The foundations and roof are shared across two floors, so the cost per m² is often 10–20% lower than single storey, even though the total is higher." },
        { q: "Does the calculator include VAT and fees?", a: "Yes. It includes survey, design, engineer, building control, planning or certificate fees, party wall surveyors, a contingency and VAT at 20%. You can switch VAT off to compare with builders who quote ex VAT." },
        { q: "Do I need planning permission for an extension?", a: "Many single-storey rear extensions fit within permitted development: up to 3 m deep on terraced and semi-detached houses and 4 m on detached, or up to 6 m and 8 m under the prior approval scheme. Side, wraparound and double-storey extensions usually need planning permission." },
        { q: "How accurate is the estimate?", a: "It is a budget range based on 2026 prices for typical projects, not a quote. The range narrows as your plans get more defined. A survey, drawings and a structural design are needed for a fixed price." },
        { q: "Can I put this calculator on my website?", a: "Yes. Use the 'Add this calculator to your website' link next to the estimate to copy the embed code. It's free and always uses our latest prices." },
      ]}
      related={[{ href: "/house-extension", label: "Our extension service" }]}
    />
  );
}
