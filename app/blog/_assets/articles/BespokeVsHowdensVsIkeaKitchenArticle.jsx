/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

const styles = {
  article: "",
  h1: "mb-8 text-4xl font-black leading-tight tracking-tight text-[#100b47] md:text-5xl",
  h2: "mb-4 mt-10 text-2xl font-bold tracking-tight text-black lg:text-4xl",
  h3: "mb-2 mt-7 text-xl font-bold tracking-tight text-black lg:text-2xl",
  p: "mb-6 leading-relaxed text-base-content/90",
  capsule:
    "mb-8 rounded-2xl border border-[#266bf1]/20 bg-[#f9fbff] p-6 leading-relaxed text-base-content/90 shadow-sm md:p-7",
  list: "mb-8 list-disc space-y-3 pl-5 leading-relaxed text-base-content/90",
  toc: "mb-10 grid gap-5 md:grid-cols-2",
  tocCol: "overflow-hidden rounded-xl border border-base-content/10 bg-white",
  tocLink:
    "block border-b border-base-content/10 px-4 py-3 text-sm leading-relaxed text-base-content/90 transition hover:bg-[#f9fbff] hover:text-[#266bf1] last:border-b-0 md:text-base",
  inlineLink: "text-[#266bf1] underline underline-offset-2 transition hover:no-underline",
  figure:
    "my-8 overflow-hidden rounded-2xl border border-base-content/10 bg-white p-4 shadow-sm md:p-6",
  image: "h-auto w-full rounded-xl",
  figcaption: "mt-3 text-sm leading-relaxed text-base-content/70",
  referencesList:
    "mb-8 list-decimal space-y-3 pl-5 leading-relaxed text-base-content/90 [&_a]:text-[#266bf1] [&_a]:underline-offset-2 hover:[&_a]:underline",
};

export default function BespokeVsHowdensVsIkeaKitchen() {
  return (
    <article className={styles.article}>

      <h1 className={styles.h1}>Bespoke vs Howdens vs IKEA Kitchen: London 2026</h1>

      {/* AI ANSWER CAPSULE */}
      <p className={styles.capsule}>
        In London, a fully fitted IKEA kitchen runs roughly £12,000–£22,000, a Howdens kitchen £18,000–£38,000, and a bespoke kitchen £45,000–£90,000+ in 2026. The cabinets themselves are only 30–40% of the bill: worktops, appliances, fitting, and the London premium of 20–35% decide the real number. IKEA buys flexibility, Howdens buys speed and a 25-year carcass guarantee, bespoke buys a kitchen built to the exact millimetre of your room.
      </p>

      {/* KEY TAKEAWAYS */}
      <h2 className={styles.h2} id="key-takeaways">Key takeaways</h2>
      <p className={styles.p}>
        The headline numbers hide the story. Here is what actually separates the three routes before you read a single cost table.
      </p>
      <ul className={styles.list}>
        <li>Cabinets are the cheapest lie in kitchen pricing. IKEA's METOD carcasses start at £1,233 and a real Howdens 12-unit trade quote came in at £4,284.60 - but neither figure includes a worktop, an appliance, or a fitter.</li>
        <li>A London kitchen costs 20–35% more than the same kitchen in Leeds or Cardiff, driven almost entirely by labour rates, parking permits, skip licences, and period-property surprises.</li>
        <li>The reliable budget split is roughly 40% cabinets and worktops, 20% appliances, 20% labour, 20% everything else - plastering, electrics, plumbing, tiling, flooring.</li>
        <li>IKEA and Howdens both sell you a box of parts. The coordination - who measures, who fits, who fixes the gap the flat-pack cannot cover - is your problem unless someone owns the whole job.</li>
        <li>Bespoke costs 2–3× an IKEA kitchen but is the only route that uses every millimetre of an awkward Victorian return or a chimney-breast alcove.</li>
        <li>Which? found kitchen prices are 22% higher than 2019, but material prices rose just 1.7% in the year to September 2025 - the calmest budgeting climate since the pandemic.</li>
        <li>The worktop is where a £15,000 kitchen and a £40,000 kitchen visibly diverge. It is the smartest place to spend and the hardest to change later.</li>
      </ul>

      {/* TABLE OF CONTENTS */}
      <h2 className={styles.h2} id="contents">What this guide covers</h2>
      <div className={styles.toc}>
        <div className={styles.tocCol}>
          <Link className={styles.tocLink} href="#the-real-number">The real number: fitted, not cabinets-only</Link>
          <Link className={styles.tocLink} href="#ikea">IKEA kitchens: cost, quality, who it suits</Link>
          <Link className={styles.tocLink} href="#howdens">Howdens kitchens: the trade-only route</Link>
          <Link className={styles.tocLink} href="#bespoke">Bespoke kitchens: built to your room</Link>
          <Link className={styles.tocLink} href="#cost-table">Side-by-side cost comparison</Link>
          <Link className={styles.tocLink} href="#quality">Quality: carcasses, hinges, and what wears out</Link>
        </div>
        <div className={styles.tocCol}>
          <Link className={styles.tocLink} href="#worktops">Worktops: where the money shows</Link>
          <Link className={styles.tocLink} href="#timelines">Timelines: how long each route takes</Link>
          <Link className={styles.tocLink} href="#london">The London premium, explained</Link>
          <Link className={styles.tocLink} href="#coordination">The coordination gap nobody quotes for</Link>
          <Link className={styles.tocLink} href="#which-route">Which route is right for your home?</Link>
          <Link className={styles.tocLink} href="#faqs">FAQs</Link>
        </div>
      </div>

      {/* SECTION 1 */}
      <h2 className={styles.h2} id="the-real-number">The real number: fitted, not cabinets-only</h2>
      <p className={styles.capsule}>
        The price you see advertised - "kitchens from £5,000" - is the carcasses and doors, nothing else. The finished room, with worktops, appliances, tiling, flooring, and a fitter, is usually 60–100% higher. For a London kitchen, add another 20–35% on top.
      </p>
      <p className={styles.p}>
        Start here, because it is the single mistake that wrecks kitchen budgets. When a supplier quotes £5,000, they are quoting the cupboards. The worktop is separate. The oven, hob, extractor, dishwasher, and fridge are separate. The plumber who moves your sink waste is separate. The electrician who adds sockets for the island is separate. The plasterer who makes good after the old kitchen comes out is separate.
      </p>
      <p className={styles.p}>
        Put those together and the £5,000 advert becomes a £14,000 project - before London gets involved. The most useful mental model is the 40/20/20 split that holds across almost every budget tier: 40% on cabinets and worktops, 20% on appliances, 20% on labour, and the final 20% on the trades that orbit the kitchen - electrics, plumbing, plastering, tiling, flooring. On a £30,000 mid-range London kitchen, that is roughly £12,000 on cabinets and stone, £6,000 on appliances, £6,000 on fitting, and £6,000 on everything else.
      </p>
      <p className={styles.p}>
        This matters most when you compare an IKEA kitchen to a Howdens or bespoke one. The cabinet gap between them looks enormous on paper - £1,233 versus £20,000. Once you load in the identical worktop, the identical appliances, and the identical London fitting bill, the finished-project gap narrows sharply. You are rarely choosing between a cheap kitchen and an expensive one. You are choosing where, within a fairly fixed envelope, your money does the most work. For a fuller borough-by-borough breakdown, see our <Link href="/blog/kitchen-renovation-cost-london-2026/">kitchen renovation cost London guide</Link>.
      </p>
      <figure className={styles.figure}>
        <Image
          src="/assets/blog/bespoke-vs-howdens-vs-ikea-kitchen/kitchen-budget-split-40-20-20.png"
          alt="Kitchen budget split showing the 40 20 20 20 rule for a mid-range London kitchen covering cabinets and worktops, appliances, labour, and surrounding trades"
          width={1200}
          height={900}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The 40 / 20 / 20 / 20 rule is the simplest realistic budgeting model
          for a fitted London kitchen.
        </figcaption>
      </figure>

      {/* SECTION 2 - IKEA */}
      <h2 className={styles.h2} id="ikea">IKEA kitchens: cost, quality, who it suits</h2>
      <p className={styles.capsule}>
        An <a className={styles.inlineLink} href="https://www.ikea.com/gb/en/cat/metod-kitchens-ka005/" target="_blank" rel="noopener noreferrer">IKEA METOD kitchen</a> starts at £1,233 for cabinets and lands around £12,000–£22,000 fully fitted in London. It buys the most design flexibility of the three, a 25-year carcass guarantee, and a modular system you can adapt with third-party fronts - at the cost of flat-pack assembly and more coordination on site.
      </p>
      <p className={styles.p}>
        IKEA's METOD system is genuinely clever. Every component is priced individually - a base cabinet from £38, a high cabinet from £37 - so a modest single-run kitchen can be assembled for around £2,722 in parts, and a family-sized L-shaped shaker for roughly £4,681. That granularity is why IKEA has a cult following among design-literate renovators: pair the white METOD carcasses with fronts from a specialist like Plykea or Superfront and you get a kitchen that photographs like it cost three times as much.
      </p>
      <p className={styles.p}>
        The caveats are real, and they are all about installation. METOD arrives flat-packed, so someone has to build every box before it goes on the wall. The cabinets have a thin 6mm back panel with no service void, which means in an older London property with surface pipework, units often get pulled proud of the wall - nudging your worktop depth and throwing out alignment across the run. IKEA's dimensions are also fixed and metric, so in a wonky Hackney terrace where no wall is square, you fill the gaps with filler panels rather than a tailored cabinet.
      </p>
      <p className={styles.p}>
        Who it suits: a homeowner comfortable managing the process, or one working with a fitter who has installed METOD before and knows its quirks. Budget £1,500–£2,950 for professional installation of the cabinets alone, on top of the units. Get the design and the fitter right and an IKEA kitchen performs well for years - the failure mode is edging tape lifting and vinyl-wrapped doors peeling at the corners over time, which is a materials-tier issue, not an assembly one.
      </p>

      {/* SECTION 3 - HOWDENS */}
      <h2 className={styles.h2} id="howdens">Howdens kitchens: the trade-only route</h2>
      <p className={styles.capsule}>
        <a className={styles.inlineLink} href="https://www.howdens.com/kitchens" target="_blank" rel="noopener noreferrer">Howdens</a> sells only through builders, not to the public. A real 12-unit London trade quote came in at £4,284.60 supply-only, with a fully fitted kitchen typically £18,000–£38,000. Cabinets arrive rigid - pre-assembled - which fitters love, and carry a 25-year guarantee. The catch: you never see a price until your builder does.
      </p>
      <p className={styles.p}>
        Howdens is built around the tradesperson, not you. You cannot walk in and buy; your builder places the order through their trade account, and the price depends on that builder's discount level at that specific depot. The same kitchen genuinely costs different amounts through different fitters. A February 2025 quote reviewed for a South East homeowner - 12 units including a larder and pan drawers, plus 38mm laminate worktops - came to £4,284.60 including VAT, and a higher-volume builder might have taken it closer to £3,800.
      </p>
      <p className={styles.p}>
        What you get for that trade-only friction is speed and consistency. Howdens carcasses are 18mm, they arrive rigid so there is no flat-pack labour, and most ranges run Blum hinges and drawer runners - the same hardware you find in kitchens costing considerably more. Because depots hold local stock, a missing or damaged part is often replaced within 24 hours, which stops a snag from stalling the whole install. That reliability is precisely why builders default to Howdens.
      </p>
      <p className={styles.p}>
        The honest weaknesses: the buying experience is only as good as your builder, there is no consumer finance, and the design service is whatever your fitter provides. A Howdens kitchen fitted by an indifferent builder is a mid-range kitchen fitted indifferently. The same units in the hands of a builder who liaises directly with the depot over every discrepancy is a genuinely strong result. Always insist on a written quote that separates the kitchen cost from the fitting cost - otherwise you cannot tell what you are actually paying for the cabinets.
      </p>

      {/* SECTION 4 - BESPOKE */}
      <h2 className={styles.h2} id="bespoke">Bespoke kitchens: built to your room</h2>
      <p className={styles.capsule}>
        A bespoke kitchen costs 2–3× an IKEA equivalent - typically £45,000–£90,000+ fully fitted in London - because every cabinet is made to your room's exact dimensions rather than configured from a fixed catalogue. It is the only route that resolves an awkward alcove, a chimney breast, or a sub-600mm return without a filler panel in sight.
      </p>
      <p className={styles.p}>
        Bespoke is the opposite philosophy to flat-pack. Instead of choosing from standard 300mm, 400mm, and 600mm units and filling the leftovers, a cabinetmaker measures your room and builds cabinetry to fit it - solid timber or furniture-grade ply, your choice of species and finish, custom dimensions, and hardware specified rather than bundled. In a period London property, where the difference between "nearly fits" and "fits" is a 40mm gap next to the range, that precision is the entire point.
      </p>
      <p className={styles.p}>
        The trade-offs are cost and time. Custom cabinets run 2–3× an IKEA kitchen for the cabinetry alone, and lead times are 6–14 weeks for fabrication after design sign-off, with design itself often taking a month. You are paying for a skilled maker's hours and for a kitchen that uses space a catalogue system simply cannot reach - a full-height larder tucked into a chimney recess, a run of drawers under a bay window, an island sized to your actual circulation rather than the nearest standard module.
      </p>
      <p className={styles.p}>
        Where bespoke earns its premium is in high-value London homes where the kitchen is the room the whole ground floor revolves around. On a £600,000-plus property, the consumer guidance from Which? is to spend 5–10% of the home's value on the kitchen - roughly £30,000–£60,000 - which is exactly the band where bespoke and high-end fitted overlap. If you are opening the kitchen into a rear <Link className={styles.inlineLink} href="/blog/house-extension-guide-2025">extension</Link>, bespoke lets the cabinetry and the new architecture be designed as one, instead of a catalogue kitchen dropped into a custom space.
      </p>

      {/* SECTION 5 - COST TABLE */}
      <h2 className={styles.h2} id="cost-table">Side-by-side cost comparison</h2>
      <p className={styles.capsule}>
        Cabinets-only, IKEA and Howdens sit close (£1,233 vs £4,285 for comparable unit counts) while bespoke starts at 2–3× IKEA. Fully fitted in London the gap widens: roughly £12k–£22k for IKEA, £18k–£38k for Howdens, and £45k–£90k+ for bespoke - with worktops, appliances, and the London premium doing most of the separating.
      </p>
      <p className={styles.p}>
        The table below is the comparison every competitor stops short of: not cabinets in isolation, but the finished-in-London number for each route. Figures assume a standard 10–15m² London kitchen and include supply, worktops, mid-tier appliances, and fitting. See the visual comparison in the infographic below, and cross-check against our <Link href="/blog/kitchen-renovation-cost-london-2026/">full cost guide</Link>.
      </p>
      <p className={styles.p}>
        <strong>Cabinets only (comparable spec):</strong> IKEA METOD from £1,233 · Howdens 12-unit £4,285 · Bespoke from ~£12,000. <strong>Fully fitted, London:</strong> IKEA £12,000–£22,000 · Howdens £18,000–£38,000 · Bespoke £45,000–£90,000+. <strong>Cabinet guarantee:</strong> IKEA 25 years · Howdens 25 years (doors 5 years) · Bespoke varies by maker. <strong>Lead time to functional kitchen:</strong> IKEA 4–8 weeks · Howdens 3–6 weeks · Bespoke 12–20 weeks.
      </p>
      <p className={styles.p}>
        Read the pattern, not just the numbers. Between IKEA and Howdens, the fitted cost overlaps heavily - the decision is convenience and fitter preference, not budget. The jump to bespoke is a genuine step change, and it is bought with cabinetry precision and materials, not worktops or appliances, which you can specify identically across all three routes.
      </p>
      <figure className={styles.figure}>
        <Image
          src="/assets/blog/bespoke-vs-howdens-vs-ikea-kitchen/kitchen-cost-comparison-london.png"
          alt="Kitchen cost comparison in London for IKEA, Howdens, and bespoke fitted kitchens including fully fitted price bands and timelines"
          width={1200}
          height={1200}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Fully fitted project cost matters more than the cabinets-only sticker
          price when comparing IKEA, Howdens, and bespoke routes.
        </figcaption>
      </figure>

      {/* SECTION 6 - QUALITY */}
      <h2 className={styles.h2} id="quality">Quality: carcasses, hinges, and what wears out</h2>
      <p className={styles.capsule}>
        Carcass thickness (18mm is the mid-range benchmark), hinge and runner brand (Blum is the tell), and door construction decide how a kitchen ages. IKEA and Howdens sit at a similar quality tier; bespoke moves up to solid timber and furniture-grade ply. What fails first is almost always the door finish, not the box.
      </p>
      <p className={styles.p}>
        Judge a kitchen by the parts you touch a thousand times a year. Howdens uses 18mm carcasses with Blum hinges and runners across most ranges - solid for the price point. IKEA's METOD carcasses are comparable in the lab and carry the same 25-year guarantee, though the thin 6mm back and vinyl-wrapped door fronts are where age shows: edging tape can lift and wrap can peel at door corners over five to ten years of steam and handling.
      </p>
      <p className={styles.p}>
        Bespoke is a different tier of material entirely - solid oak, walnut, or painted furniture-grade ply, with hardware chosen for the job rather than bundled by a catalogue. The gap you are paying for is not "does it work" but "how does it feel in year eight." A well-fitted Howdens or IKEA kitchen works beautifully for a decade; a bespoke kitchen is built to be refinished and rehandled rather than replaced.
      </p>
      <p className={styles.p}>
        One insight no competitor states plainly: fitting quality outweighs brand quality. A mid-range kitchen expertly installed - units dead level, doors perfectly aligned, scribed tight to a wonky wall - reads as far more expensive than a premium kitchen fitted carelessly. This is exactly why the coordination question below matters more than the badge on the cabinet.
      </p>

      {/* SECTION 7 - WORKTOPS */}
      <h2 className={styles.h2} id="worktops">Worktops: where the money shows</h2>
      <p className={styles.capsule}>
        Worktops range from laminate at £50–£150 per linear metre to marble at £400–£1,000, with quartz - the London default - at £250–£600. A typical kitchen needs 4–6 linear metres, plus £80–£150 templating and £200–£400 fitting. It is the one element that spans every style, so it is the smartest place to spend on any of the three cabinet routes.
      </p>
      <p className={styles.p}>
        Here is the leverage point. Whether you choose IKEA, Howdens, or bespoke cabinets, the worktop is what lifts the room from functional to designed. A marble-effect quartz across a plain IKEA run does more visual work than upgrading the cabinets ever could. Quartz composite at £250–£600 per linear metre is the London standard - durable, non-porous, heat- and stain-resistant - while natural marble at £400–£1,000 buys the veining at the cost of maintenance and porosity.
      </p>
      <p className={styles.p}>
        Budget the full worktop stack, not just the slab. London suppliers charge £80–£150 for templating and £200–£400 for professional installation including sink cut-outs and tap holes, with upstands and windowsills adding £100–£300. On 4–6 linear metres of quartz that is a £1,500–£4,000 line on its own - and it forces a one-to-two-week pause mid-project while the stone is templated and manufactured, which is the hidden reason kitchen timelines run longer than the cabinet install suggests.
      </p>
      <p className={styles.p}>
        The strategic point: worktops are the hardest element to change later, so they are your commitment piece. You can swap IKEA fronts, handles, and even appliances down the line; you will not casually replace a templated quartz run. Spend here first, then decide how much cabinet you can afford underneath it.
      </p>
      <figure className={styles.figure}>
        <Image
          src="/assets/blog/bespoke-vs-howdens-vs-ikea-kitchen/kitchen-worktop-cost-by-material.png"
          alt="Kitchen worktop cost by material showing laminate, solid wood, quartz, granite, and marble price ranges per linear metre in London"
          width={1200}
          height={800}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Worktop choice often decides whether a kitchen reads as budget,
          mid-range, or premium - regardless of cabinet supplier.
        </figcaption>
      </figure>

      {/* SECTION 8 - TIMELINES */}
      <h2 className={styles.h2} id="timelines">Timelines: how long each route takes</h2>
      <p className={styles.capsule}>
        On-site work for a London kitchen is 2–4 weeks regardless of route. The full timeline differs at the front end: IKEA and Howdens are 4–8 and 3–6 weeks to a functional kitchen, while bespoke runs 12–20 weeks because cabinetry is made to order after design sign-off. The worktop templating pause adds 1–2 weeks to all three.
      </p>
      <p className={styles.p}>
        The install itself is remarkably consistent. Days one to three are strip-out and first-fix electrics and plumbing; days four to eight are cabinet installation and worktop templating; days nine to fourteen are worktop fitting, tiling, flooring, and second-fix. That two-to-four-week on-site window barely moves between IKEA, Howdens, and bespoke - a rigid Howdens kitchen saves a day or two of flat-pack assembly over IKEA, and that is about it.
      </p>
      <p className={styles.p}>
        The real difference is upstream. Howdens units are stocked at depots, so lead time is short - often days. IKEA delivery can be slower and partial deliveries are a known frustration. Bespoke is the outlier: design takes around a month, then fabrication is 6–14 weeks from sign-off, so budget 12–20 weeks from decision to a working kitchen. In every case, the quartz templating pause is unavoidable - do not commit to hosting dinner in the first month after "completion," because a snag list always follows.
      </p>
      <p className={styles.p}>
        In a London context, timeline risk lives in the property, not the cabinets. A Victorian terrace with original joists, shallow wall cavities, and surface pipework can add days of making-good that no catalogue lead time accounts for - which is where having one team who anticipated the surprise, rather than three trades pointing at each other, changes the finish date.
      </p>

      {/* SECTION 9 - LONDON PREMIUM */}
      <h2 className={styles.h2} id="london">The London premium, explained</h2>
      <p className={styles.capsule}>
        London kitchens cost 20–35% more than the UK average - up to 50% higher on labour alone. The premium is not the cabinets, which are priced nationally, but the fitting: parking and skip permits, mansion-block carries, leasehold consent fees of £200–£1,500, party wall costs, and period-property surprises hidden in E8 and N10 terraces.
      </p>
      <p className={styles.p}>
        Suppliers charge national prices; fitters charge local rates. That single fact explains the London premium. An IKEA or Howdens cabinet costs the same in E17 as it does in Yorkshire - but the fitter installing it in Walthamstow charges London rates, and everything around the install carries a capital surcharge. Labour in particular can run 30–50% above national averages on identical scope.
      </p>
      <p className={styles.p}>
        The surcharges stack up in ways homeowners rarely budget for. An upper-floor mansion-block flat without a lift adds £200–£600 for carrying materials up by hand. A leasehold flat needs freeholder consent for plumbing or structural changes, with licence fees typically £200–£1,500. Party wall agreements add £700–£1,000 per adjacent owner where structural work is involved. And the housing stock itself - Victorian and Edwardian terraces across most of North and East London, with older pipework, shallow cavities, and original floor joists - reliably turns up work mid-project that a modern build would not.
      </p>
      <p className={styles.p}>
        This is why the same kitchen "from £5,000" is a genuinely different project in Hackney than in a 1990s semi elsewhere. It is also why a fixed-price contract with one team matters more in London than almost anywhere: the borough-specific friction is precisely the part that spirals when responsibility is split across a supplier, a fitter, and whoever handles the leasehold paperwork. If your kitchen is part of a wider project, see our <Link className={styles.inlineLink} href="/blog/home-renovation-cost-london-2026">home renovation cost guide</Link> plus our <Link className={styles.inlineLink} href="/areas/hackney/">Hackney</Link> and <Link className={styles.inlineLink} href="/areas/islington/">Islington</Link> renovation guides for borough-level detail.
      </p>
      <figure className={styles.figure}>
        <Image
          src="/assets/blog/bespoke-vs-howdens-vs-ikea-kitchen/london-kitchen-premium-breakdown.png"
          alt="Breakdown of the London kitchen renovation premium including labour uplift, leasehold consent, party wall awards, and period property surprises"
          width={1200}
          height={900}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The London premium is mostly a labour, logistics, and property-stock
          issue - not a cabinet-brand issue.
        </figcaption>
      </figure>

      {/* SECTION 10 - COORDINATION GAP */}
      <h2 className={styles.h2} id="coordination">The coordination gap nobody quotes for</h2>
      <p className={styles.capsule}>
        IKEA and Howdens sell parts, not projects. The gap between a box of cabinets and a finished kitchen - measuring, sequencing five trades, owning the mistakes - is unpriced and lands on you. A design-and-build firm closes that gap with one team and one contract, which is where BH Studio's model differs from a supply-only kitchen.
      </p>
      <p className={styles.p}>
        Every kitchen route above ends at the same cliff edge: someone has to run the job. IKEA gives you a planner and a flat-pack delivery. Howdens gives your builder a trade account. Neither owns the outcome. The measuring, the trade sequencing, the moment the plumber and the electrician need to be on site in the right order, the gap where the flat-pack cabinet does not quite meet the wall - that coordination is real work, and when it is split across a supplier and a separately hired fitter, the seams are where projects go wrong.
      </p>
      <p className={styles.p}>
        This is the difference between buying a kitchen and commissioning one. BH Studio runs a full design-and-build model - one team, one contract, no handoff between a designer who draws it and a builder who fits it. Across 300+ London projects, the pattern is consistent: the problems that blow budgets are almost never the cabinets themselves, but the uncoordinated space between trades. Our head of design, Gino, sizes cabinetry, worktop, and the trades around them as a single sequenced job rather than a shopping list you assemble yourself.
      </p>
      <p className={styles.p}>
        It is worth being clear about what this does and does not mean. If you have a trusted fitter and a straightforward room, a Howdens kitchen through that builder is hard to beat on value. The design-and-build case gets stronger as the job gets more complex - a period property, a knock-through, a bespoke run into an extension - because that is where a single point of responsibility, a 10-year workmanship guarantee, and £10M insurance stop being paperwork and start being the reason the finish date holds. If the kitchen sits inside a larger structural rethink, our <Link className={styles.inlineLink} href="/blog/house-extension-guide-2025#planning-permission">house extension planning guide</Link> is the relevant next read.
      </p>

      {/* SECTION 11 - WHICH ROUTE */}
      <h2 className={styles.h2} id="which-route">Which route is right for your home?</h2>
      <p className={styles.capsule}>
        Choose IKEA for design flexibility on a controlled budget with a confident fitter. Choose Howdens for a solid mid-range kitchen through a trusted builder. Choose bespoke when the room is awkward, the property is high-value, or the kitchen opens into an extension - and let one team own the whole job.
      </p>
      <p className={styles.p}>
        Match the route to the room and the risk, not to a price you saw advertised. A square, modern kitchen where the walls are true and the layout is staying put is a strong fit for IKEA or Howdens - the standard modules land cleanly and the saving is real. The moment the room fights back - a Victorian return, a chimney breast, a sub-600mm gap, a floor that slopes - the filler-panel compromises of a catalogue kitchen start to show, and bespoke's made-to-measure logic earns its cost.
      </p>
      <p className={styles.p}>
        Layer in property value. On a £750,000 N10 home, a £15,000 kitchen can look underspecified against the house; the Which? 5–10% guidance points toward £37,500–£75,000, squarely in bespoke or high-end fitted territory. On a £480,000 E17 terrace, a well-fitted Howdens kitchen with a good quartz worktop hits the value sweet spot without over-capitalising. The kitchen should match the home it sits in, up and down.
      </p>
      <p className={styles.p}>
        Then decide who runs it. If the answer is "a builder I trust, on a simple job," any of the three routes works. If the answer is "I'm not sure who owns the mistakes," that uncertainty is the strongest argument for a single design-and-build team - because the cabinet brand is a smaller decision than who takes responsibility for the finished room.
      </p>
      <figure className={styles.figure}>
        <Image
          src="/assets/blog/bespoke-vs-howdens-vs-ikea-kitchen/kitchen-route-decision-guide.png"
          alt="Decision guide for choosing IKEA, Howdens, or bespoke kitchen routes based on room shape, budget, property type, and project complexity"
          width={1200}
          height={900}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The right route depends on the room, the home value, and who is
          taking responsibility for the finished project.
        </figcaption>
      </figure>

      {/* QUICK TAKEAWAYS */}
      <h2 className={styles.h2} id="quick-takeaways">Quick takeaways</h2>
      <ul className={styles.list}>
        <li>Fully fitted in London: IKEA £12k–£22k, Howdens £18k–£38k, bespoke £45k–£90k+. Cabinets alone hugely understate all three.</li>
        <li>IKEA and Howdens overlap on finished cost - the choice is flexibility versus fitter convenience, not budget.</li>
        <li>Bespoke is a real step change, bought with cabinetry precision and materials, and justified by awkward rooms or high-value homes.</li>
        <li>Spend on the worktop first: quartz at £250–£600/linear metre lifts any cabinet route and is the hardest element to change later.</li>
        <li>The London premium (20–35%, up to 50% on labour) lives in the fitting and the property, never the cabinets.</li>
        <li>The unpriced coordination gap - five trades, one sequence, who owns the mistakes - is where projects go wrong and where one team pays off.</li>
      </ul>

      {/* CONCLUSION */}
      <h2 className={styles.h2} id="conclusion">The bottom line</h2>
      <p className={styles.p}>
        The bespoke-versus-Howdens-versus-IKEA question is really three questions wearing one coat: how much cabinet precision does your room need, how much are you willing to spend within a fairly fixed London envelope, and who is going to run the job. Get those in order and the brand almost chooses itself. For a straight room and a trusted fitter, IKEA or Howdens delivers a kitchen that looks and lasts far beyond its price. For an awkward period property, a high-value home, or a kitchen that opens into new space, bespoke is the only route that fits the room rather than fighting it.
      </p>
      <p className={styles.p}>
        What none of the three brands sells you is the coordination - and in London, on period stock, that is where the money and the stress actually live. BH Studio designs and builds the whole kitchen as one job: one team, one contract, one point of responsibility, backed by a 10-year workmanship guarantee and £10M insurance across 300+ completed London projects. If you want a clear, fixed-price picture of your kitchen - whichever cabinet route suits your home - <Link href="/contact/">book a free design consultation</Link> and we will scope it properly, from the worktop down.
      </p>

      {/* ENGAGEMENT */}
      <p className={styles.p}>
        <strong>Which route are you leaning toward - and what's holding you back?</strong> Tell us your room, your budget, and your property type in the comments, and we'll tell you honestly whether IKEA, Howdens, or bespoke is the smarter spend for your home.
      </p>

      {/* FAQs */}
      <h2 className={styles.h2} id="faqs">Frequently asked questions</h2>

      <h3 className={styles.h3} id="faq-1">Is a bespoke kitchen worth the extra cost over Howdens or IKEA?</h3>
      <p className={styles.p}>
        Bespoke is worth it when the room is awkward or the property is high-value. In a period London home with alcoves, a chimney breast, or non-standard walls, bespoke uses space a catalogue system cannot reach, and on a £600,000-plus property the spend aligns with the Which? 5–10%-of-value guidance. For a square, modern room, a well-fitted Howdens or IKEA kitchen delivers most of the visible result for a third to a half of the cost.
      </p>

      <h3 className={styles.h3} id="faq-2">Are IKEA kitchens as good quality as Howdens?</h3>
      <p className={styles.p}>
        They sit at a similar quality tier. IKEA METOD and Howdens both carry 25-year carcass guarantees and perform comparably; Howdens uses 18mm carcasses with Blum hardware and arrives rigid, while IKEA is flat-pack with a thinner 6mm back. IKEA's weak point over time is vinyl-wrapped door fronts peeling at corners. In practice, fitting quality affects the result more than the gap between the two brands.
      </p>

      <h3 className={styles.h3} id="faq-3">How much does a fitted kitchen cost in London in 2026?</h3>
      <p className={styles.p}>
        Expect £12,000–£22,000 fully fitted for IKEA, £18,000–£38,000 for Howdens, and £45,000–£90,000+ for bespoke, for a standard 10–15m² London kitchen. London runs 20–35% above the UK average, driven by labour rates and logistics. Cabinets are only 40% of the bill once worktops, appliances, and fitting are included.
      </p>

      <h3 className={styles.h3} id="faq-4">Why can't I get a price directly from Howdens?</h3>
      <p className={styles.p}>
        Howdens is trade-only, so you buy through a builder with a trade account rather than directly. The price depends on that builder's discount level at their local depot, which is why the same kitchen costs different amounts through different fitters. Always ask your builder for a written quote that separates the kitchen supply cost from the fitting cost.
      </p>

      <h3 className={styles.h3} id="faq-5">Can you make an IKEA kitchen look high-end?</h3>
      <p className={styles.p}>
        Yes - the most effective upgrades are custom door fronts and a premium worktop. Pairing IKEA METOD carcasses with fronts from specialists like Plykea or Superfront, then adding a quartz worktop at £250–£600 per linear metre, produces a kitchen that reads far above its cabinet cost. The worktop does more visual work than any cabinet upgrade.
      </p>

      <h3 className={styles.h3} id="faq-6">How long does a kitchen renovation take in London?</h3>
      <p className={styles.p}>
        On-site work is 2–4 weeks for all three routes. To a fully functional kitchen, budget 4–8 weeks for IKEA, 3–6 weeks for Howdens, and 12–20 weeks for bespoke, which is made to order. A one-to-two-week worktop templating pause applies to all three, and period London properties can add days of unforeseen making-good.
      </p>

      <h3 className={styles.h3} id="faq-7">Do I need planning permission or building regs for a kitchen renovation?</h3>
      <p className={styles.p}>
        A like-for-like kitchen replacement needs neither. Building regulations approval is triggered if you remove a load-bearing wall, alter structure, or significantly move plumbing or electrics. In a leasehold London flat you may also need freeholder consent for plumbing or structural changes, with licence fees typically £200–£1,500. Conservation areas and listed buildings carry additional restrictions. If the kitchen is part of a rear extension, start with our <Link className={styles.inlineLink} href="/blog/house-extension-guide-2025#planning-permission">house extension planning section</Link>; if an application has already been knocked back, read our <Link className={styles.inlineLink} href="/blog/planning-permission-refused-london">planning permission refused guide</Link>.
      </p>

      {/* REFERENCES */}
      <h2 className={styles.h2} id="references">References</h2>
      <ol className={styles.referencesList}>
        <li>
          <a href="https://www.which.co.uk/reviews/fitted-kitchens/article/best-kitchen-brands/ikea-kitchens-review-aEfwd3Z5w1Ec" target="_blank" rel="noopener noreferrer">
            Which? - IKEA kitchens review and 12-unit price comparison
          </a>
        </li>
        <li>
          <a href="https://buildaway.co.uk/blog/kitchen-renovation-cost-london-2026.html" target="_blank" rel="noopener noreferrer">
            Which? / HomeOwners Alliance - Kitchen renovation cost London breakdown and budget splits
          </a>
        </li>
        <li>
          <a href="https://www.pricingpenguin.co.uk/cost-guides/kitchen-renovation" target="_blank" rel="noopener noreferrer">
            Pricing Penguin - Kitchen renovation cost UK, fitted totals by supplier tier
          </a>
        </li>
        <li>
          <a href="https://www.hellomag.co.uk/howdens-kitchens-prices/" target="_blank" rel="noopener noreferrer">
            Hello Magazine - Howdens kitchen prices and real trade quote data
          </a>
        </li>
        <li>
          <a href="https://www.ikea.com/gb/en/cat/metod-kitchens-ka005/" target="_blank" rel="noopener noreferrer">
            IKEA UK - METOD kitchen system pricing and specifications
          </a>
        </li>
      </ol>

    </article>
  );
}
