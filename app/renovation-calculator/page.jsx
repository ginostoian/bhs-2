import Link from "next/link";
import CalculatorPage from "@/components/calculators/CalculatorPage";
import { CALCULATORS, runEstimate } from "@/libs/calculators/registry";
import { loadCalculatorConfig } from "@/libs/calculators/rates";
import { formatGBP } from "@/libs/calculators/common";

export const revalidate = 3600;

const LEVELS = [
  ["cosmetic", "Cosmetic refresh"],
  ["standard", "Mid-range refurbishment"],
  ["fullRenovation", "Full renovation"],
  ["backToBrick", "Back to brick"],
];

export default async function Page() {
  const calc = CALCULATORS.renovation;
  const config = await loadCalculatorConfig("renovation");
  const rows = LEVELS.map(([level, label]) => {
    const r = runEstimate(calc, { ...calc.defaults, level, works: calc.onChange({ level }).works }, config);
    return [label, `${formatGBP(r.low)} – ${formatGBP(r.high)}`, formatGBP(r.perM2)];
  });

  return (
    <CalculatorPage
      id="renovation"
      service="Whole-home renovation"
      eyebrow="Free calculator · Updated for 2026"
      title="House renovation and refurbishment cost calculator"
      intro="Work out a realistic budget for anything from a cosmetic refresh to a back-to-brick renovation. It covers the rooms, rewiring, heating, plastering, floors, fees, contingency and VAT, sized to your home."
      points={["Room-by-room scope", "Period-property adjustments", "Free PDF and shareable link"]}
      benchmark={{
        title: "What renovating a 3-bed London house costs in 2026",
        intro: "All-in budgets for a 100 m² Victorian terrace in outer London, whole home, standard finish, including fees, contingency and VAT.",
        columns: ["Renovation level", "Likely all-in budget", "Per m²"],
        rows,
        note: "Flats, newer homes and areas outside London are usually cheaper; central London and large period houses cost more.",
      }}
      sections={[
        {
          title: "How the calculator works",
          body: (
            <>
              <p>
                You tell us the size of your home, how deep the work goes and which rooms and systems are included. We price general building work per square metre, add kitchen and bathroom fit-outs, rewiring, heating, plumbing, plastering, decoration, flooring and doors, then site management, fees, a contingency and VAT.
              </p>
              <p>
                Victorian and Edwardian homes carry a higher allowance because opening them up usually reveals more repair work. Living in during the works adds time and protection costs.
              </p>
            </>
          ),
        },
        {
          title: "Where renovation budgets go wrong",
          body: (
            <ul>
              <li><strong>Hidden condition.</strong> Old wiring, lead pipes, damp and rotten joists only show once the floors are up. Keep a 10–15% contingency.</li>
              <li><strong>Finish creep.</strong> Upgrading taps, tiles and joinery room by room adds up quickly. Agree a finish level early.</li>
              <li><strong>Sequencing.</strong> Doing a kitchen now and rewiring next year means paying to open walls twice.</li>
            </ul>
          ),
        },
        {
          title: "Want the detail?",
          body: (
            <p>
              Our <Link href="/blog/home-renovation-cost-london-2026">London home renovation cost guide</Link> breaks costs down room by room, by property type and by borough, with worked examples.
            </p>
          ),
        },
      ]}
      faqs={[
        { q: "How much does it cost to renovate a house in London in 2026?", a: "Most full renovations in London cost £1,400–£2,600 per m² before VAT and fees. For a typical 3-bed house of around 100 m² that is roughly £150,000–£260,000 all-in for a full renovation, and much less for a mid-range refurbishment." },
        { q: "Is £50k enough to renovate a house?", a: "In London, £50,000 usually covers a cosmetic refresh of a whole house or a new kitchen and bathroom with decoration. It is unlikely to cover a rewire, new heating and replastering throughout." },
        { q: "What is the most expensive part of a renovation?", a: "Kitchens, bathrooms and the hidden services (rewiring, plumbing and heating) usually make up half the budget. Structural changes such as knocking through load-bearing walls add more." },
        { q: "Does the estimate include VAT?", a: "Yes, by default. You can switch VAT off to compare with builders who quote ex VAT. Fees, site management and a contingency are always included." },
        { q: "Can I live in the house during a renovation?", a: "For lighter work, yes. For a full renovation with a rewire and new heating, most people move out for at least part of the work. It's faster, safer and often cheaper." },
      ]}
      related={[{ href: "/general-renovation", label: "Our renovation service" }]}
    />
  );
}
