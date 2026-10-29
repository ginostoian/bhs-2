/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import ArticleCta from "../components/ArticleCta";

const styles = {
  h2: "mb-4 mt-10 text-2xl font-bold tracking-tight text-black lg:text-4xl",
  h3: "mb-2 mt-7 text-xl font-bold tracking-tight text-black lg:text-2xl",
  p: "mb-6 leading-relaxed text-base-content/90",
  ul: "mb-6 list-disc space-y-2 pl-6 leading-relaxed text-base-content/90",
  answerCapsule:
    "mb-8 rounded-2xl border border-[#4D5B4B]/20 bg-[#F4F1EA] p-6 shadow-sm md:p-7",
  tocGrid: "mb-10 grid gap-5 md:grid-cols-2",
  tocColumn: "overflow-hidden rounded-xl border border-base-content/10 bg-white",
  tocLink:
    "block border-b border-base-content/10 px-4 py-3 text-sm leading-relaxed text-base-content/90 transition hover:bg-[#F4F1EA] hover:text-[#4D5B4B] last:border-b-0 md:text-base",
  figure:
    "my-8 overflow-hidden rounded-2xl border border-base-content/10 bg-white p-4 shadow-sm md:p-6",
  image: "h-auto w-full rounded-xl",
  figcaption: "mt-3 text-sm leading-relaxed text-base-content/70",
  tableWrap: "my-8 overflow-x-auto",
};

const IMG = "/assets/blog/kitchen-extension-cost-london";

const toc = [
  ["is-50k-enough", "Is £50k enough?"],
  ["budget-ladder", "What your budget buys"],
  ["quote-vs-all-in", "Why a £45,500 quote becomes £93,500"],
  ["the-kitchen", "The kitchen inside the extension"],
  ["depth", "3 m, 4 m or 6 m: depth and planning"],
  ["glazing-rule", "The glazing rule nobody mentions"],
  ["hidden-costs", "Costs that get missed"],
  ["hornsey", "A kitchen extension in Hornsey, N8"],
  ["timeline", "How long it takes"],
  ["faqs", "FAQs"],
];

export default function KitchenExtensionCostLondonArticle() {
  const half = Math.ceil(toc.length / 2);
  return (
    <article>
      <div className={styles.answerCapsule}>
        <p className={styles.p}>
          A kitchen extension in London costs about £93,500 all-in in 2026 for
          a 3 m deep rear extension on a terrace with a new mid-range kitchen.
          £50,000 buys a 2 m deep extension finished without a new kitchen, or
          the bare build of a 3 m one. Figures include fees, contingency and
          VAT.
        </p>
      </div>

      <h2 className={styles.h2} id="key-takeaways">
        Key takeaways
      </h2>
      <ul className={styles.ul}>
        <li>
          <strong>£50k isn't enough</strong> for a London kitchen extension with
          a new kitchen. Plan on £73,500 for 2 m deep and £93,500 for 3 m.
        </li>
        <li>
          <strong>The builder's quote is about half the bill.</strong> A
          £45,500 build becomes £93,500 with the kitchen, fees, contingency and
          VAT.
        </li>
        <li>
          <strong>Each extra metre of depth adds about £20,000</strong> up to
          4 m on a 4.5 m wide terrace, then about £15,500 a metre.
        </li>
        <li>
          <strong>3 m is the permitted development limit</strong> on a terrace
          or semi. Up to 6 m needs prior approval from the council.
        </li>
        <li>
          <strong>Big glass doors can break the rules.</strong> Glazing over 25%
          of the new floor area needs an energy calculation to pass building
          control.
        </li>
      </ul>

      <div className={styles.tocGrid}>
        {[toc.slice(0, half), toc.slice(half)].map((col, i) => (
          <div key={i} className={styles.tocColumn}>
            {col.map(([id, label]) => (
              <Link key={id} className={styles.tocLink} href={`#${id}`}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <h2 className={styles.h2} id="is-50k-enough">
        Is £50k enough for a kitchen extension in London?
      </h2>
      <p className={styles.p}>
        <strong>
          Not if you want a new kitchen in it. £50,000 covers a small, finished
          2 m extension where you keep your kitchen, or the build of a 3 m
          extension before fees and VAT.
        </strong>
      </p>
      <p className={styles.p}>
        The £50k figure comes from somewhere real. It's roughly what a London
        builder will quote to build a 3 m deep rear extension: £45,500 before
        VAT. The trouble is what that number leaves out. There's no kitchen in
        it, no architect, no engineer, no party wall surveyor, no building
        control and no VAT.
      </p>
      <p className={styles.p}>
        So here's the honest version. With a new mid-range kitchen, a 2 m deep
        kitchen extension costs about £73,500 all-in in outer London. A 3 m
        one costs about £93,500. If £50,000 is your ceiling, either keep the
        extension small and reuse your kitchen, or renovate the kitchen you
        have. Our{" "}
        <Link href="/blog/kitchen-renovation-full-guide-2025">
          kitchen renovation cost guide
        </Link>{" "}
        covers that route.
      </p>
      <p className={styles.p}>
        Every figure here comes from the 2026 London price book
        behind our{" "}
        <Link href="/extension-calculator">extension cost calculator</Link>.
        The base case is a 4.5 m wide terrace in outer London (zone 3),
        finished and ready to use, with large glazed doors and a £16,000
        allowance for a mid-range kitchen.
      </p>

      <h2 className={styles.h2} id="budget-ladder">
        What your budget buys
      </h2>
      <p className={styles.p}>
        <strong>
          Each rung below is an all-in figure for a 4.5 m wide London terrace.
          Pick the one that matches your budget and read across.
        </strong>
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>Kitchen extension cost in London, 2026 (all-in, including VAT)</caption>
          <thead>
            <tr>
              <th scope="col">Budget</th>
              <th scope="col">What it buys</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">£42,000</th><td>A 2 m deep (9 m²) shell, ready for your own trades</td></tr>
            <tr><th scope="row">£52,500</th><td>A 2 m deep extension, finished, keeping your kitchen</td></tr>
            <tr><th scope="row">£73,500</th><td>A 2 m deep extension with a new mid-range kitchen</td></tr>
            <tr><th scope="row">£93,500</th><td>A 3 m deep (13.5 m²) extension with a new kitchen</td></tr>
            <tr><th scope="row">£114,000</th><td>A 4 m deep (18 m²) extension with a new kitchen</td></tr>
            <tr><th scope="row">£145,000</th><td>A 6 m deep (27 m²) extension, or a wraparound, with a new kitchen</td></tr>
            <tr><th scope="row">£164,000+</th><td>6 m deep with premium finishes and a glass roof</td></tr>
          </tbody>
        </table>
      </div>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/kitchen-extension-cost-london-budget-ladder.png`}
          alt="Kitchen extension cost London 2026 budget ladder: £52,500 for 2 m finished, £73,500 for 2 m with a kitchen, £93,500 for 3 m with a kitchen, £114,000 for 4 m and £145,000 for 6 m"
          width={1200}
          height={900}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          What each budget buys on a typical London terrace, all-in.
        </figcaption>
      </figure>

      <ArticleCta
        title="Price your own kitchen extension"
        text="Enter your depth, finish and postcode. The calculator shows a low, expected and high budget with every fee listed."
        primary={{ href: "/extension-calculator", label: "Use the extension calculator" }}
      />

      <h2 className={styles.h2} id="quote-vs-all-in">
        Why a £45,500 quote becomes a £93,500 kitchen extension
      </h2>
      <p className={styles.p}>
        <strong>
          The build is less than half the total. The kitchen, fees, contingency
          and VAT make up the rest.
        </strong>{" "}
        This is the 3 m extension from the table, line by line.
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>3 m deep kitchen extension, 13.5 m², outer London</caption>
          <thead>
            <tr><th scope="col">Item</th><th scope="col">Cost</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">Construction: foundations, walls, roof, steel, glazing</th><td>£38,780</td></tr>
            <tr><th scope="row">Floors, plastering, decoration and lighting</th><td>£6,729</td></tr>
            <tr><th scope="row">Kitchen: units, worktops and appliances</th><td>£16,000</td></tr>
            <tr><th scope="row">Survey and architect</th><td>£3,400</td></tr>
            <tr><th scope="row">Structural engineer</th><td>£1,800</td></tr>
            <tr><th scope="row">Planning application and council fee</th><td>£1,748</td></tr>
            <tr><th scope="row">Building control</th><td>£1,200</td></tr>
            <tr><th scope="row">Party wall surveyor</th><td>£2,500</td></tr>
            <tr><th scope="row">Contingency (10%)</th><td>£6,151</td></tr>
            <tr><th scope="row">VAT (20%)</th><td>£15,312</td></tr>
            <tr><th scope="row">All-in total</th><td><strong>£93,620</strong></td></tr>
          </tbody>
        </table>
      </div>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/kitchen-extension-quote-vs-all-in-cost.png`}
          alt="How a £45,509 kitchen extension build quote becomes a £93,620 all-in cost in London once the kitchen, fees, party wall, contingency and VAT are added"
          width={1200}
          height={800}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The build is £45,509. Everything else adds £48,111.
        </figcaption>
      </figure>
      <p className={styles.p}>
        Read any quote against this list. If the kitchen, the fees or the VAT
        are missing, add them yourself before you compare it with anything.
      </p>

      <h2 className={styles.h2} id="the-kitchen">
        The kitchen inside the extension
      </h2>
      <p className={styles.p}>
        <strong>
          The kitchen is the one line you control completely, and it can swing
          the total by £50,000.
        </strong>{" "}
        Our figures use £16,000 for units, worktops and appliances.
      </p>
      <p className={styles.p}>
        That buys a good trade kitchen, the Howdens or Magnet level, with
        quartz worktops and mid-range appliances. A flat-pack kitchen can come
        in under it. A bespoke kitchen from a London maker typically costs
        £45,000 to £90,000 fitted, which puts a 3 m extension well past
        £120,000. Our comparison of{" "}
        <Link href="/blog/bespoke-vs-howdens-vs-ikea-kitchen-london">
          bespoke, Howdens and IKEA kitchens
        </Link>{" "}
        shows what each costs once it's fitted, and the{" "}
        <Link href="/kitchen-calculator">kitchen cost calculator</Link> prices
        your layout.
      </p>
      <p className={styles.p}>
        Choose the kitchen before the builder prices the job. The sink
        position decides the drainage, the hob decides where the extract runs,
        and an island needs power in the floor before the screed goes down.
        Change any of them after the slab is poured and you pay twice.
      </p>

      <h2 className={styles.h2} id="depth">
        3 m, 4 m or 6 m: depth, planning and cost
      </h2>
      <p className={styles.p}>
        <strong>
          Each extra metre adds about £20,000 up to 4 m, then about £15,500.
          Past 3 m on a terrace or semi, you'll need prior approval from the
          council.
        </strong>
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>Rear kitchen extension on a 4.5 m wide terrace, with a new kitchen</caption>
          <thead>
            <tr>
              <th scope="col">Depth</th>
              <th scope="col">New floor</th>
              <th scope="col">All-in cost</th>
              <th scope="col">Planning route</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">2 m</th><td>9 m²</td><td>£73,500</td><td>Permitted development</td></tr>
            <tr><th scope="row">3 m</th><td>13.5 m²</td><td>£93,500</td><td>Permitted development</td></tr>
            <tr><th scope="row">4 m</th><td>18 m²</td><td>£114,000</td><td>Prior approval (permitted development on a detached house)</td></tr>
            <tr><th scope="row">6 m</th><td>27 m²</td><td>£145,000</td><td>Prior approval</td></tr>
          </tbody>
        </table>
      </div>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/kitchen-extension-cost-by-depth.png`}
          alt="Kitchen extension cost in London by depth in 2026: 2 metres £73,500, 3 metres £93,500, 4 metres £114,000 and 6 metres £145,000, with the planning route for each"
          width={1200}
          height={820}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Cost and planning route for each depth on a terrace or semi.
        </figcaption>
      </figure>
      <p className={styles.p}>
        Under the{" "}
        <a
          href="https://www.planningportal.co.uk/permission/common-projects/extensions/planning-permission"
          target="_blank"
          rel="noopener noreferrer"
        >
          Planning Portal's rules
        </a>
        , a single-storey rear extension on a terrace or semi can go 3 m from
        the original back wall without planning permission (4 m on a detached
        house). It can't be taller than 4 m, and the eaves can't go above 3 m
        within 2 m of a boundary. Prior approval stretches that to 6 m (8 m
        detached): the council writes to your neighbours and has 42 days to
        decide. Conservation areas and Article 4 areas, common in Hackney and
        Islington, need full planning either way.
      </p>
      <p className={styles.p}>
        Is a 3 metre extension worth it? On most London terraces, yes. It's the
        biggest you can build without asking anyone, and 13.5 m² is enough for
        a kitchen, an island and a table. Going deeper is cheaper per square
        metre (£5,363 per m² at 6 m against £6,935 at 3 m) but darker in the
        middle, so plan the roof glazing with it.
      </p>

      <h2 className={styles.h2} id="glazing-rule">
        The glazing rule that catches big kitchen extensions
      </h2>
      <p className={styles.p}>
        <strong>
          Building regulations cap glazing at 25% of the extension's floor
          area, plus whatever existing windows and doors it covers.
        </strong>{" "}
        Wall-to-wall glass usually breaks it.
      </p>
      <p className={styles.p}>
        Do the sum for a 3 m extension. 25% of 13.5 m² is 3.4 m². Add the old
        back door and kitchen window you're removing, say 2.5 m², and your
        allowance is about 5.9 m². A 4.5 m run of sliding doors, 2.2 m high, is
        9.9 m² on its own. Before any rooflights.
      </p>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/kitchen-extension-glazing-25-percent-rule.png`}
          alt="Kitchen extension glazing rule under Approved Document L: a 13.5 m² extension allows about 5.9 m² of glazing, while full-width sliding doors are 9.9 m²"
          width={1200}
          height={760}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The 25% glazing allowance against full-width doors on a 3 m extension.
        </figcaption>
      </figure>
      <p className={styles.p}>
        You can still have the glass. Under{" "}
        <a
          href="https://www.gov.uk/government/publications/conservation-of-fuel-and-power-approved-document-l"
          target="_blank"
          rel="noopener noreferrer"
        >
          Approved Document L
        </a>
        , you show with an energy calculation that the extension loses no more
        heat than a compliant one, usually with better glass, more insulation
        or a more efficient boiler or heat pump. Budget a few hundred pounds
        for the calculation, and decide on the glazing before the drawings go
        to building control, not after.
      </p>

      <h2 className={styles.h2} id="hidden-costs">
        Kitchen extension costs that get missed
      </h2>
      <p className={styles.p}>
        <strong>
          Your 10% contingency is for these. Know them before you sign.
        </strong>
      </p>
      <ul className={styles.ul}>
        <li>
          <strong>Drains:</strong> moving a manhole or re-routing a drain under
          the new floor costs £1,500 to £4,000. Shared sewers need Thames
          Water's consent to build over.
        </li>
        <li>
          <strong>Steel:</strong> each beam that opens the house to the
          extension is about £2,500 fitted.
        </li>
        <li>
          <strong>Heating:</strong> underfloor heating adds about £110 per m².
          On 13.5 m² that's roughly £1,500 before VAT.
        </li>
        <li>
          <strong>Flooring into the old house:</strong> if the new floor runs
          into the existing rooms, budget for those rooms too.
        </li>
        <li>
          <strong>Access:</strong> no parking and everything through the house
          adds about £4,000 on a typical job.
        </li>
        <li>
          <strong>Living without a kitchen:</strong> six to eight weeks of
          takeaways and a microwave in the front room.
        </li>
      </ul>
      <p className={styles.p}>
        Postcode matters less than you'd think. The same 3 m extension is
        about £97,500 in zone 1 and £91,000 in zone 5. Local notes for our
        core areas are on our{" "}
        <Link href="/locations/walthamstow">Walthamstow</Link> and{" "}
        <Link href="/locations/hackney">Hackney</Link> pages.
      </p>

      <h2 className={styles.h2} id="hornsey">
        A kitchen extension in Hornsey, N8
      </h2>
      <p className={styles.p}>
        <strong>
          This N8 project shows what a well-planned extension feels like: the structure is part of the design, not hidden behind it.
        </strong>
      </p>
      <figure className={styles.figure}>
        <Image
          src="/assets/portfolio/extension-james-n8/extension-james-1.webp"
          alt="Kitchen extension in Hornsey N8 with an exposed steel beam beside roof glazing, timber slats and a window seat next to the island"
          width={1000}
          height={1015}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Hornsey, N8: exposed steel beside the roof glazing, with a window seat
          next to the island.
        </figcaption>
      </figure>
      <p className={styles.p}>
        The steel beam that carries the house stays visible beside the roof
        glazing, finished to match the door frames and cabinetry. The island
        sink faces the garden. Timber slats and a built-in window seat give
        someone a place to sit while someone else cooks. See{" "}
        <Link href="/portfolio/james-n8">the full Hornsey project</Link> in our
        portfolio.
      </p>

      <h2 className={styles.h2} id="timeline">
        How long a kitchen extension takes
      </h2>
      <p className={styles.p}>
        <strong>
          Eight to 14 weeks on site, after six to 16 weeks of design and
          approvals.
        </strong>{" "}
        Prior approval adds about six weeks; full planning about eight.
      </p>
      <p className={styles.p}>
        Order the kitchen when the drawings are signed off, not when the
        roof goes on. Trade kitchens take two to four weeks to arrive and
        bespoke ones eight to 12. If the kitchen is late, the plasterer,
        flooring and electrician all wait, and so do you.
      </p>

      <h2 className={styles.h2} id="setting-your-budget">
        Setting your kitchen extension budget
      </h2>
      <p className={styles.p}>
        Start from the depth. £73,500 for 2 m, £93,500 for 3 m, £114,000 for
        4 m and £145,000 for 6 m, with a £16,000 kitchen in each. Swap in the
        kitchen you actually want. Add £4,000 if access is difficult, and keep
        the 10% contingency for what's under the floor.
      </p>
      <p className={styles.p}>
        If the number is more than you planned, don't cut the structure.
        Take a metre off the depth, or keep the glazing within the 25%
        allowance, or start with a trade kitchen and upgrade the worktops
        later. Each saves more than haggling over the build.
      </p>
      <p className={styles.p}>
        With Better Homes you have one construction contract and one team on
        site. Bring your own architect or choose an independent one we
        recommend; we coordinate the engineer, building control, party wall
        and the kitchen fit, so nothing falls between trades. Structural work
        carries a workmanship guarantee of up to 10 years. See our{" "}
        <Link href="/house-extension">house extensions in London</Link> page,
        or{" "}
        <Link href="/contact?service=Kitchen%20extension#brief">
          send us your brief
        </Link>{" "}
        for an itemised price.
      </p>
      <p className={styles.p}>
        <strong>Over to you:</strong> what's your budget, and how deep is your
        garden? Send us both and we'll tell you which rung you're on.
      </p>

      <h2 className={styles.h2} id="faqs">
        Kitchen extension cost FAQs
      </h2>
      <h3 className={styles.h3}>How much does a kitchen extension cost in London in 2026?</h3>
      <p className={styles.p}>
        About £93,500 all-in for a 3 m deep rear extension on a terrace with a
        new mid-range kitchen, including fees, contingency and VAT. A 2 m
        extension with a kitchen is about £73,500.
      </p>
      <h3 className={styles.h3}>Can you do a kitchen extension for £50k?</h3>
      <p className={styles.p}>
        Not with a new kitchen in London. £50,000 covers a small finished 2 m
        extension where you keep your kitchen, or the build of a 3 m extension
        before fees and VAT.
      </p>
      <h3 className={styles.h3}>How much does a 2m kitchen extension cost?</h3>
      <p className={styles.p}>
        About £52,500 all-in finished, or £73,500 with a new mid-range kitchen,
        for a 9 m² rear extension on a London terrace.
      </p>
      <h3 className={styles.h3}>Is a 3 metre extension worth it?</h3>
      <p className={styles.p}>
        Usually. It's the largest rear extension most terraces and semis can
        build without planning permission, and 13.5 m² fits a kitchen, island
        and table.
      </p>
      <h3 className={styles.h3}>What is the most expensive part of a kitchen extension?</h3>
      <p className={styles.p}>
        The structure: foundations, walls, roof, steel and glazing, at about
        £38,800 on a 3 m extension. The kitchen comes next, and it's the line
        that varies most.
      </p>
      <h3 className={styles.h3}>Do I need planning permission for a kitchen extension?</h3>
      <p className={styles.p}>
        Not for a single-storey rear extension up to 3 m deep on a terrace or
        semi (4 m detached) outside a conservation area. Up to 6 m needs prior
        approval.
      </p>

      <h2 className={styles.h2} id="references">
        References
      </h2>
      <ul className={styles.ul}>
        <li>
          <a href="https://www.planningportal.co.uk/permission/common-projects/extensions/planning-permission" target="_blank" rel="noopener noreferrer">
            Planning Portal: extensions and permitted development
          </a>
        </li>
        <li>
          <a href="https://www.gov.uk/government/publications/conservation-of-fuel-and-power-approved-document-l" target="_blank" rel="noopener noreferrer">
            GOV.UK: Approved Document L, conservation of fuel and power
          </a>
        </li>
        <li>
          <a href="https://www.gov.uk/government/publications/permitted-development-rights-for-householders-technical-guidance" target="_blank" rel="noopener noreferrer">
            GOV.UK: permitted development rights for householders
          </a>
        </li>
        <li>
          <a href="https://www.gov.uk/guidance/party-wall-etc-act-1996-guidance" target="_blank" rel="noopener noreferrer">
            GOV.UK: Party Wall etc. Act 1996 guidance
          </a>
        </li>
      </ul>
    </article>
  );
}
