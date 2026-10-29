import Link from "next/link";
import CalculatorPage from "@/components/calculators/CalculatorPage";
import { CALCULATORS, runEstimate } from "@/libs/calculators/registry";
import { loadCalculatorConfig } from "@/libs/calculators/rates";
import { formatGBP } from "@/libs/calculators/common";
import { LOFT_TYPES } from "@/libs/calculators/loft";

export const revalidate = 3600;

export default async function Page() {
  const calc = CALCULATORS.loft;
  const config = await loadCalculatorConfig("loft");
  const rows = LOFT_TYPES.map((t) => {
    const area = config.loftTypes[t.id].defaultArea;
    const r = runEstimate(calc, { ...calc.defaults, loftType: t.id, area, partyWallNeighbours: 1 }, config);
    const [w1, w2] = config.loftTypes[t.id].weeks;
    return [t.label, `${area} m²`, `${formatGBP(r.low)} – ${formatGBP(r.high)}`, `${w1}–${w2} weeks`];
  });

  return (
    <CalculatorPage
      id="loft"
      service="Loft conversion"
      eyebrow="Free calculator · Updated for 2026"
      title="Loft conversion cost calculator"
      intro="Price a Velux, dormer, L-shaped, hip-to-gable or mansard loft in under a minute. You get the build cost, every fee, a contingency and VAT, plus how long the work takes."
      points={["All five loft types", "London zones and UK regions", "Free PDF and shareable link"]}
      benchmark={{
        title: "Loft conversion costs in London, 2026",
        intro: "Typical all-in budgets for an outer-London terrace or semi at a standard finish, including drawings, engineer, building control, party wall for one neighbour, a 10% contingency and VAT.",
        columns: ["Loft type", "Typical new floor area", "Likely all-in budget", "Time on site"],
        rows,
        note: "Build-only prices you see quoted elsewhere are usually 20–30% lower because they leave out fees and contingency.",
      }}
      sections={[
        {
          title: "Which loft is right for your house?",
          body: (
            <ul>
              <li><strong>Velux</strong> works when you already have good head height. It’s the cheapest option and rarely needs planning.</li>
              <li><strong>Rear dormer</strong> is the London standard on terraces and semis: a full-height room across the back of the roof.</li>
              <li><strong>L-shaped dormer</strong> adds a second dormer over the back addition of a Victorian terrace, often making space for two bedrooms or a bedroom and en-suite.</li>
              <li><strong>Hip-to-gable</strong> squares off a sloping side roof on semis and end-of-terraces, usually with a rear dormer.</li>
              <li><strong>Mansard</strong> rebuilds the roof with near-vertical sides for the most space. It is common in conservation areas but almost always needs planning.</li>
            </ul>
          ),
        },
        {
          title: "Is my loft suitable?",
          body: (
            <p>
              Measure from the top of a ceiling joist to the underside of the ridge. Around 2.2 m or more is usually enough for a comfortable conversion. Less than that can still work by lowering ceilings below or choosing a mansard, but it adds cost. Also check where the new staircase can land on the floor below. That is often the deciding factor in a terrace.
            </p>
          ),
        },
        {
          title: "Planning and permitted development",
          body: (
            <p>
              Most dormer, hip-to-gable and Velux lofts on houses are permitted development, within 40 m³ of extra volume on terraces and 50 m³ on semis and detached houses. Flats, conservation areas and mansards need planning. Either way, you need building regulations approval and, if you share a wall, a party wall agreement. Read more in our{" "}
              <Link href="/blog/planning-permission-loft-conversion-london">loft planning guide</Link>. For worked examples by loft type, zone and house type, see our{" "}
              <Link href="/blog/loft-conversion-cost-london">loft conversion cost in London guide</Link>.
            </p>
          ),
        },
      ]}
      faqs={[
        { q: "How much does a loft conversion cost in London in 2026?", a: "Build costs including VAT are typically £25,000–£45,000 for a Velux loft, £45,000–£75,000 for a rear dormer, £55,000–£85,000 for an L-shaped dormer or hip-to-gable and £60,000–£100,000+ for a mansard. Add drawings, engineer, building control, party wall and a contingency for the full budget." },
        { q: "Can you do a loft conversion for £30,000?", a: "In London, only a simple Velux conversion with good existing head height is likely to come in around £30,000. A dormer, which most London lofts need, usually starts nearer £50,000 all-in." },
        { q: "Does a loft conversion add value?", a: "A well-designed loft that adds a bedroom and bathroom typically adds 15–25% to the value of a London house, which often exceeds the cost of the work." },
        { q: "How long does a loft conversion take?", a: "Most London lofts take 8–12 weeks on site; mansards take 12–16. Allow another 6–12 weeks beforehand for drawings, structural design, party wall notices and approvals." },
        { q: "Do I need to move out?", a: "Usually not. Most of the work happens from scaffolding outside until the staircase goes in, which typically means one or two disruptive weeks near the end." },
        { q: "Can I put this calculator on my website?", a: "Yes. Use the 'Add this calculator to your website' link next to the estimate to copy the embed code. It's free and always uses our latest prices." },
      ]}
      related={[{ href: "/loft-conversion", label: "Our loft conversion service" }]}
    />
  );
}
