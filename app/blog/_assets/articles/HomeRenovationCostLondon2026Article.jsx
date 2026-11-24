/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import ArticleCta from "../components/ArticleCta";

const styles = {
  h2: "mb-4 mt-10 text-2xl font-bold tracking-tight text-black lg:text-4xl",
  h3: "mb-2 mt-7 text-xl font-bold tracking-tight text-black lg:text-2xl",
  p: "mb-6 leading-relaxed text-base-content/90",
  ul: "mb-6 list-disc space-y-2 pl-6 leading-relaxed text-base-content/90",
  answer:
    "mb-8 rounded-2xl border border-[#4D5B4B]/20 bg-[#F4F1EA] p-6 shadow-sm md:p-7",
  tableWrap: "my-8 overflow-x-auto",
  note: "mb-6 text-sm leading-relaxed text-base-content/70",
};

function Table({ caption, head, rows }) {
  return (
    <div className={styles.tableWrap}>
      <table className="bh-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {c}
                  </th>
                ) : (
                  <td key={j} className={/^(About |Saves |\+)?£[\d,]+( \+ VAT)?$/.test(String(c)) ? "bh-num" : undefined}>{c}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HomeRenovationCostLondon2026() {
  return (
    <article>
      <div className={styles.answer}>
        <p className={styles.p}>
          On our own London jobs in 2025 and 2026, renovating a flat cost
          £29,000 to £71,000 + VAT, a ground floor about £34,000 + VAT, and
          a whole house about £60,000 to £100,000, rising to £200,000 with an
          extension and loft. Bathrooms ran £7,700 to £12,000 + VAT for the work,
          and fitting a kitchen £6,500 to £9,800 + VAT.
        </p>
      </div>

      <p className={styles.p}>
        I'm Gino, and I've run Better Homes for 12 years. Every figure in this
        guide comes from quotes we sent and jobs we built across London, from
        Limehouse flats to Victorian houses in Tufnell Park. Clients appear by
        first name and area. Our quotes are written before VAT, so add 20% to
        any figure marked "+ VAT".
      </p>

      <ArticleCta
        title="Want a number for your own home?"
        text="Tell the calculator your rooms, finish and postcode. It works from the same prices we quote."
        primary={{ href: "/renovation-calculator", label: "Estimate your renovation" }}
      />

      <h2 className={styles.h2} id="how-much-full-renovation">
        How much does a full renovation cost in London?
      </h2>
      <p className={styles.p}>
        It depends far more on what you're replacing than on the size of the
        home. A two-bed flat that needs two bathrooms, a kitchen and new floors
        can cost more than a bigger house that only needs decorating. Here's
        what our recent jobs actually came to.
      </p>
      <Table
        caption="Better Homes renovations, 2025 to 2026 (our quotes before VAT, rounded)"
        head={["Client and area", "What we did", "Our price", "Time on site"]}
        rows={[
          ["Henry, Limehouse E14", "New bathroom, new floors, decoration throughout", "£29,300 + VAT", "4 weeks"],
          ["Anthony, Limehouse E14", "Whole flat: two bathrooms, kitchen, the rest renovated", "£37,000 + VAT", "5 to 6 weeks"],
          ["Marcus, Bankside SE1", "Two-bed, two-bath duplex flat", "£45,500 + VAT", "In progress"],
          ["Andrew, St John's Wood NW8", "Complete renovation of a flat over two floors", "£70,900 + VAT", "2026"],
          ["Tara, Leytonstone E11", "General renovation with extra works", "£27,700 + VAT", "4 weeks"],
          ["Ana, Woodford Green IG8", "Ground floor: kitchen, bathroom, general works", "£33,600 + VAT", "2025 to 2026"],
          ["Rebecca, Enfield EN1", "Whole ground floor", "£34,200 + VAT", "5 weeks"],
          ["Carrie, Hampstead NW3", "Home renovation", "About £60,000", "Started May 2026"],
          ["Ellie, Tottenham N15", "Whole-house renovation", "About £100,000", "About 8 months"],
          ["Manuela, Tufnell Park N19", "Whole house, with planning, party wall and basement waterproofing", "About £100,000", "On site"],
          ["Richard, Chingford E4", "Loft conversion and whole-house renovation", "About £137,500", "On site"],
          ["Annie, Tufnell Park N19", "Extension, loft conversion and full renovation", "About £200,000", "On site"],
        ]}
      />
      <p className={styles.p}>
        Two things stand out. Flats are quick: four to six weeks once the
        materials are on site, because we can run trades in parallel. Houses
        take months, mostly because of the structural and planning work that
        comes with them.
      </p>

      <h2 className={styles.h2} id="room-by-room-costs">
        Room-by-room costs from real quotes
      </h2>
      <p className={styles.p}>
        Most renovations are a set of rooms plus "general works": the floors,
        walls, doors and decorating that join everything up. This is how a few
        of our quotes split.
      </p>
      <Table
        caption="How real quotes split by room (before VAT)"
        head={["Job", "Kitchen", "Bathroom(s)", "General works", "Total"]}
        rows={[
          ["Andrew, St John's Wood NW8", "£7,000 (fitting)", "£11,050 and £10,150", "£42,700", "£70,900"],
          ["Marcus, Bankside SE1", "£9,800", "£8,000 and £7,900", "£19,800", "£45,500"],
          ["Ana, Woodford Green IG8", "£6,500", "£7,650", "£14,660 plus £4,800 optional", "£33,600"],
          ["Antonia, Clapton E5", "£8,300", "£7,500", "£9,200", "£25,000"],
        ]}
      />

      <h3 className={styles.h3}>Bathrooms</h3>
      <p className={styles.p}>
        Keeping the layout and using the client's own suite and tiles, Angie's
        bathroom in Finsbury Park cost £6,850 for the work, plus £830 of extras:
        a concealed shower valve (£250), a tiled niche (£400) and two new
        sockets and switches (£180). That's £7,700 + VAT, done in two weeks.
      </p>
      <p className={styles.p}>
        Moving things around costs more. Zung's bathroom in Walthamstow had a
        new layout, and the bathroom part of the job broke down like this:
        strip-out £650, new-layout plumbing £1,000, electrics £360, fitting the
        suite £1,950, tiling £3,640 and decorating £400. About £8,000 before
        VAT. Two bathrooms at once in Limehouse came to £21,100 + VAT and took
        three weeks. Our{" "}
        <Link href="/bathroom-renovation">bathroom renovation</Link> page has
        more.
      </p>

      <h3 className={styles.h3}>Kitchens</h3>
      <p className={styles.p}>
        Fitting a kitchen the client has bought from Howdens, Wren or IKEA,
        with the plumbing, electrics, tiling and flooring, cost £6,500 to
        £9,800 + VAT on our recent jobs. Once building work comes in, the price
        jumps: Phil in Stratford wanted a bigger kitchen, which meant taking out
        a shower room and rebuilding the bathroom somewhere else. That was
        £31,750 + VAT. Our comparison of{" "}
        <Link href="/blog/bespoke-vs-howdens-vs-ikea-kitchen-london">
          bespoke, Howdens and IKEA kitchens
        </Link>{" "}
        covers what the units themselves cost.
      </p>

      <h3 className={styles.h3}>Rewiring</h3>
      <p className={styles.p}>
        Ana's ground floor in Woodford Green was rewired in five days for
        £4,500 + VAT, not including a new consumer unit. A full house takes
        longer and costs more, and it has to happen before plastering, so it
        sets the order for everything else.
      </p>

      <h2 className={styles.h2} id="cost-per-square-metre">
        Renovation cost per square metre
      </h2>
      <p className={styles.p}>
        Per square metre figures are useful for a first budget, as long as you
        know what level of work they describe. These come from the 2026 price
        book behind our{" "}
        <Link href="/renovation-calculator">renovation calculator</Link>, for
        a 100 m² Victorian terrace in outer London, including fees, a 10%
        contingency and VAT.
      </p>
      <Table
        caption="London renovation cost per m², 2026 (all-in, including VAT)"
        head={["Level of work", "What it includes", "Per m²", "100 m² house"]}
        rows={[
          ["Cosmetic refresh", "Decorating and new floors", "£566", "£56,500"],
          ["Mid-range refurbishment", "New kitchen and bathroom, rewire, heating, plastering, decorating", "£1,330", "£133,000"],
          ["Full renovation", "All of that plus replumbing and new doors throughout", "£2,600", "£260,000"],
          ["Back to brick", "Stripped to the shell and rebuilt inside, with damp and repairs", "£3,460", "£346,000"],
        ]}
      />
      <p className={styles.p}>
        For comparison, Homebuilding & Renovating puts a full renovation of a
        three-bed semi at £70,000 to £110,000 across the UK, and adds 25 to 35%
        for London. Our{" "}
        <Link href="/prices">London prices page</Link> sets our figures next to
        Checkatrade, Homebuilding & Renovating and BCIS.
      </p>

      <h2 className={styles.h2} id="what-drives-costs-up">
        What pushes the price up
      </h2>
      <p className={styles.p}>
        On a London house, the structure is where budgets move. These are real
        prices from a site visit in Chingford this November, where Richard is
        converting his loft and renovating the house below.
      </p>
      <Table
        caption="Structural options priced for one Chingford house, November 2026 (before VAT)"
        head={["Item", "Our price"]}
        rows={[
          ["Steel box frame across the back wall, ready for a future extension", "£14,500"],
          ["Two steel posts on concrete pad footings instead", "£9,000"],
          ["Taking out every chimney, including the stack above the roof", "£10,000"],
          ["Keeping the chimneys: new supporting beam and strapping", "£5,500"],
          ["One steel beam under a chimney breast", "£2,500"],
          ["Removing a chimney stack and making good the roof", "£3,000"],
          ["Clearing and skimming each opened chimney breast", "£400"],
          ["Removing the kitchen wall without the box frame behind it", "£4,500"],
          ["Keeping the existing back door instead of replacing it", "Saves £1,500"],
        ]}
      />
      <p className={styles.p}>
        The box frame costs more, but it carries the whole back wall, replaces
        a tired timber beam and comes off the price of an extension later. On
        older houses, chimneys are the other big decision: keeping them can
        cost nearly as much as taking them out once you add the beams they
        need.
      </p>
      <ul className={styles.ul}>
        <li>
          <strong>Moving wet rooms.</strong> New waste runs and plumbing cost
          more than the tiles you see.
        </li>
        <li>
          <strong>Opening up walls.</strong> Any load-bearing wall needs an
          engineer's design and a steel.
        </li>
        <li>
          <strong>Products.</strong> Several of our clients buy their own suite,
          tiles and kitchen. That keeps our price to the work, and you choose
          exactly what you want.
        </li>
        <li>
          <strong>Living in.</strong> Staying at home is possible on most flats
          and ground floors, but it slows a whole-house job.
        </li>
      </ul>

      <h2 className={styles.h2} id="hidden-costs">
        Costs people forget to budget for
      </h2>
      <p className={styles.p}>
        These come up on almost every house we quote. None of them appear on a
        Pinterest board.
      </p>
      <ul className={styles.ul}>
        <li>
          <strong>Surveys before work starts.</strong> On a Tufnell Park house
          this year we arranged an asbestos survey and priced a drainage CCTV
          survey, and party wall notices went out before the first wall came
          down.
        </li>
        <li>
          <strong>Party wall.</strong> Steel into a shared wall or a new
          foundation near next door needs notice under the Party Wall Act, and
          an award if your neighbour appoints a surveyor.
        </li>
        <li>
          <strong>Planning and building control.</strong> That house needed a
          full planning application to Islington. Building control is needed
          for structural work, rewiring and new drainage either way.
        </li>
        <li>
          <strong>Fire safety on a new top floor.</strong> Annie's house in
          Tufnell Park is gaining a loft and an extension, and a domestic
          sprinkler system went into the design. On a three-storey house it's
          the usual way to keep an open-plan ground floor without enclosing
          the stairs.
        </li>
        <li>
          <strong>VAT.</strong> Our quotes show it separately. A £37,000 flat
          renovation is £44,400 with VAT.
        </li>
      </ul>

      <h2 className={styles.h2} id="cost-by-property-type">
        Cost by type of home
      </h2>
      <Table
        caption="What our jobs cost by type of home (before VAT unless stated)"
        head={["Home", "Typical scope", "Our quotes"]}
        rows={[
          ["One or two-bed flat", "Bathroom(s), kitchen, floors, decorating", "£29,000 to £46,000"],
          ["Larger flat over two floors", "Everything, including two bathrooms", "About £71,000"],
          ["Ground floor of a house", "Kitchen, bathroom, floors, sometimes a rewire", "£34,000 to £38,000"],
          ["Whole family house", "Every room, often with structural work", "About £60,000 to £100,000"],
          ["House with loft and extension", "Renovation plus new space", "£137,500 to £200,000"],
        ]}
      />
      <p className={styles.p}>
        Flats in towers, like our jobs in Limehouse and Bankside, have their own
        rules: working hours, lift bookings and building management approval.
        Victorian and Edwardian houses bring chimneys, old wiring and uneven
        walls. Budget a 10% contingency on any period house.
      </p>

      <h2 className={styles.h2} id="borough-costs">
        Does it cost more in some boroughs?
      </h2>
      <p className={styles.p}>
        The building work costs much the same. The difference is in the
        process. In Islington and Camden, conservation areas mean more houses
        need full planning, which adds two to three months before we start.
        In central postcodes, parking suspensions and skip licences cost more,
        and access is harder. Our price book adds around 10% for zone 1 compared
        with outer London. See our{" "}
        <Link href="/locations/islington">Islington</Link>,{" "}
        <Link href="/locations/hampstead">Hampstead</Link> and{" "}
        <Link href="/locations/walthamstow">Walthamstow</Link> pages for local
        detail.
      </p>

      <h2 className={styles.h2} id="renovate-or-move">
        Renovate or move?
      </h2>
      <p className={styles.p}>
        Moving has costs you never get back. On a £700,000 London house, stamp
        duty alone is £25,000 at the rates from April 2025, before agents,
        solicitors and removals. That would pay for most of a two-bed flat
        renovation on our list above. If you like the street and the house has
        good bones, renovating usually wins. If you need two more bedrooms and
        there's no loft or garden to build into, moving may be the honest
        answer. Our{" "}
        <Link href="/blog/house-extension-value-london-guide">
          guide to what adds value
        </Link>{" "}
        has the numbers.
      </p>

      <h2 className={styles.h2} id="real-project-costs">
        How long a renovation takes
      </h2>
      <Table
        caption="Time on site on our recent jobs"
        head={["Job", "Time on site"]}
        rows={[
          ["Bathroom, same layout (Finsbury Park)", "2 weeks"],
          ["Two bathrooms (Limehouse)", "3 weeks"],
          ["Bathroom, floors and decorating (Limehouse)", "4 weeks"],
          ["Ground floor (Enfield)", "5 weeks"],
          ["Whole flat with two bathrooms and a kitchen (Limehouse)", "5 to 6 weeks"],
          ["Rear extension with a new WC (Walthamstow)", "12 weeks"],
          ["Whole house (Tottenham)", "About 8 months"],
        ]}
      />
      <p className={styles.p}>
        Before any of that, allow time for drawings, approvals and ordering. A
        bespoke kitchen takes 8 to 12 weeks to make. Planning takes about eight
        weeks once submitted.
      </p>

      <h2 className={styles.h2} id="getting-a-price">
        How to get a price you can rely on
      </h2>
      <p className={styles.p}>
        Ask every builder for a written, itemised quote: each room priced, VAT
        shown separately, and a clear list of what you're supplying. That's how
        we quote, and it's what our clients mention most. Amanda, whose kitchen
        needed a picture-frame steel, wrote on Google that she "received a
        detailed quote with no hidden costs."
      </p>
      <p className={styles.p}>
        If you'd like a price for your home, send us your plans or a few
        photos. We'll visit, talk through the options and send an itemised
        quote. See how we run{" "}
        <Link href="/general-renovation">full house renovations</Link>.
      </p>

      <h2 className={styles.h2} id="faqs">
        Renovation cost questions
      </h2>
      <h3 className={styles.h3}>How much does it cost to renovate a house in London in 2026?</h3>
      <p className={styles.p}>
        On our recent jobs, whole houses cost about £60,000 to £100,000, and
        £137,500 to £200,000 with a loft or extension. A ground floor was
        about £34,000 + VAT.
      </p>
      <h3 className={styles.h3}>How much does it cost to renovate a flat in London?</h3>
      <p className={styles.p}>
        Our flat renovations with a kitchen and one or two bathrooms came to
        £29,000 to £46,000 + VAT, and £70,900 + VAT for a flat over two floors.
        Most took four to six weeks.
      </p>
      <h3 className={styles.h3}>How much does a bathroom renovation cost in London?</h3>
      <p className={styles.p}>
        For the work, £7,700 + VAT keeping the layout with your own suite and
        tiles, about £8,000 with a new layout, and £21,100 + VAT for two
        bathrooms at once.
      </p>
      <h3 className={styles.h3}>How much is it to rewire a house in London?</h3>
      <p className={styles.p}>
        We rewired a ground floor in Woodford Green for £4,500 + VAT in five
        days, excluding a new consumer unit.
      </p>
      <h3 className={styles.h3}>Is it cheaper to renovate or move in London?</h3>
      <p className={styles.p}>
        Stamp duty on a £700,000 home is £25,000 before any other moving
        costs. For most families who like their area, renovating is better
        value.
      </p>
      <h3 className={styles.h3}>Do your prices include VAT?</h3>
      <p className={styles.p}>
        Our quotes show VAT separately at 20%. Figures marked "+ VAT" in this
        guide are before VAT.
      </p>
    </article>
  );
}
