/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import infographicCostsImg from "/public/assets/blog/common-mistakes-extension/infographic-1-costs.svg";
import infographicTimelineImg from "/public/assets/blog/common-mistakes-extension/infographic-2-timeline.svg";
import infographicIcebergImg from "/public/assets/blog/common-mistakes-extension/infographic-3-iceberg.svg";

const styles = {
  h1: "mb-8 text-4xl font-black leading-tight tracking-tight text-[#100b47] md:text-5xl",
  h2: "mb-4 mt-10 text-2xl font-bold tracking-tight text-black lg:text-4xl",
  h3: "mb-2 mt-7 text-xl font-bold tracking-tight text-black lg:text-2xl",
  p: "mb-6 leading-relaxed text-base-content/90",
  tocWrap:
    "mb-8 overflow-hidden rounded-2xl border border-base-content/10 bg-white",
  tocTable: "w-full border-collapse text-sm md:text-base",
  tocHead:
    "bg-[#f3f7ff] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#100b47]",
  tocIndex: "w-16 px-4 py-3 text-sm font-semibold text-base-content/60",
  tocCell: "px-4 py-3 text-base-content/90",
  tocRow: "border-t border-base-content/10 align-top",
  tocLink: "transition hover:text-[#266bf1] hover:underline",
  relatedGrid: "mb-6 grid gap-4 md:grid-cols-2",
  relatedCard:
    "rounded-2xl border border-base-content/10 bg-white p-5 transition hover:border-[#266bf1]/40",
  relatedTitle: "text-base font-bold text-[#100b47]",
  relatedDesc: "mt-2 text-sm leading-relaxed text-base-content/70",
  relatedLink:
    "mt-3 inline-flex text-sm font-semibold text-[#266bf1] underline underline-offset-2",
  refList: "mb-6 list-decimal space-y-4 pl-5",
  refItem: "leading-relaxed text-base-content/90",
  extLink:
    "font-medium text-[#266bf1] underline underline-offset-2 transition hover:text-[#1f56c5]",
  figure:
    "my-8 overflow-hidden rounded-2xl border border-base-content/10 bg-white p-4 md:p-6",
  image: "h-auto w-full rounded-xl",
  figcaption: "mt-3 text-sm leading-relaxed text-base-content/70",
};

{
  /* 
  SEO Meta Recommendations:
  Title Tag: 15 House Extension Mistakes London Homeowners Make
  Meta Description: Avoid costly house extension, loft conversion and home renovation mistakes. Expert guide for London homeowners covering budgets, planning permission, builders and design pitfalls.
  Primary Keywords: house extension, home extension, loft conversion, home renovation
  Target Audience: London homeowners, high income, informational intent
*/
}

export default function CommonMistakesExtensionArticle() {
  const tocItems = [
    { href: "#why-this-matters", label: "Why This Matters for London Homeowners" },
    { href: "#unrealistic-budget", label: "Not Setting a Realistic Budget" },
    { href: "#hidden-costs", label: "Hidden Costs That Catch You Off Guard" },
    { href: "#contingency-fund", label: "The Contingency Fund Most People Forget" },
    {
      href: "#skipping-professional-advice",
      label: "Skipping Professional Advice at the Planning Stage",
    },
    { href: "#architect-first", label: "Why Hiring an Architect First Saves Thousands" },
    {
      href: "#planning-permission",
      label: "Ignoring Planning Permission and Permitted Development Rules",
    },
    {
      href: "#conservation-areas",
      label: "Conservation Areas and Listed Buildings in London",
    },
    { href: "#building-regulations", label: "Overlooking Building Regulations" },
    { href: "#party-wall", label: "Forgetting About the Party Wall Act" },
    { href: "#wrong-builder", label: "Choosing the Wrong Builder or Contractor" },
    { href: "#vetting-builders", label: "How to Vet a Builder Properly" },
    { href: "#poor-design", label: "Poor Design That Kills Natural Light and Flow" },
    { href: "#side-return-trap", label: "The Side Return Trap: A London-Specific Pitfall" },
    {
      href: "#thinking-too-small",
      label: "Not Thinking Big Enough — or Thinking Too Big",
    },
    { href: "#loft-conversion-blunders", label: "Loft Conversion Blunders" },
    { href: "#headroom-stairs-fire", label: "Headroom, Staircases, and Fire Safety" },
    { href: "#underestimating-timeline", label: "Underestimating the Timeline" },
    {
      href: "#energy-efficiency",
      label: "Neglecting Energy Efficiency and Insulation",
    },
    {
      href: "#how-you-live",
      label: "Failing to Consider How You Actually Live",
    },
    { href: "#multiple-quotes", label: "Not Getting Multiple Quotes" },
    {
      href: "#finishing-touches",
      label: "Forgetting the Finishing Touches Until It Is Too Late",
    },
    { href: "#quick-takeaways", label: "Quick Takeaways" },
    { href: "#conclusion", label: "Conclusion" },
    { href: "#faqs", label: "FAQs" },
    { href: "#related-guides", label: "Related Guides" },
    { href: "#references", label: "References" },
  ];

  const relatedGuides = [
    {
      href: "/blog/house-extension-value-london-guide",
      title: "How Much Value a House Extension Adds in London",
      description:
        "Value uplift, ROI ranges and cost-vs-value benchmarks for 2026 projects.",
    },
    {
      href: "/blog/permitted-development-guide",
      title: "Permitted Development Guide for London Homeowners",
      description:
        "Clear rules on what can be built without full planning permission.",
    },
    {
      href: "/blog/house-extension-guide-2025",
      title: "Complete House Extension Planning Guide",
      description:
        "Step-by-step overview from feasibility to approvals, procurement and delivery.",
    },
    {
      href: "/blog/house-extension-types",
      title: "House Extension Types Compared",
      description:
        "Compare rear, side return, wraparound and double-storey options.",
    },
  ];

  return (
    <article>
      <h1 className={styles.h1}>
        15 House Extension Mistakes London Homeowners Make
      </h1>

      {/* ===== TABLE OF CONTENTS ===== */}
      <nav aria-label="Table of contents">
        <h2 className={styles.h2}>What This Guide Covers</h2>
        <div className={styles.tocWrap}>
          <table className={styles.tocTable}>
            <thead>
              <tr>
                <th className={styles.tocHead}>No.</th>
                <th className={styles.tocHead}>Section</th>
              </tr>
            </thead>
            <tbody>
              {tocItems.map((item, index) => (
                <tr key={item.href} className={styles.tocRow}>
                  <td className={styles.tocIndex}>{index + 1}</td>
                  <td className={styles.tocCell}>
                    <Link href={item.href} className={styles.tocLink}>
                      {item.label}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </nav>

      {/* ===== INTRODUCTION ===== */}
      <section id="why-this-matters">
        <h2 className={styles.h2}>Why This Matters for London Homeowners</h2>
        <p className={styles.p}>
          A house extension or home renovation in London is one of the largest
          financial commitments you will ever make outside of buying the
          property itself. With average extension costs in the capital running
          between £3,000 and £5,000 per square metre — and full home renovation
          budgets regularly exceeding £150,000 — the margin for error is razor
          thin.
        </p>
        <p className={styles.p}>
          Yet every year, thousands of London homeowners fall into the same
          avoidable traps. They underestimate costs, skip critical approvals,
          hire the wrong team, or design spaces that look beautiful on paper but
          fail in daily life. The result is delayed timelines, blown budgets,
          and extensions that add less value than they should.
        </p>
        <p className={styles.p}>
          This guide draws on current industry data and expert insight to walk
          you through the fifteen biggest mistakes people make when extending or
          renovating their homes — and, more importantly, how to sidestep every
          single one. Whether you are planning a rear kitchen extension in
          Hackney, a loft conversion in Wandsworth, or a full home renovation in
          Islington, what follows could save you tens of thousands of pounds and
          months of unnecessary stress.
        </p>
      </section>

      {/* ===== MISTAKE 1: BUDGET ===== */}
      <section id="unrealistic-budget">
        <h2 className={styles.h2}>
          1. Not Setting a Realistic Budget from Day One
        </h2>
        <p className={styles.p}>
          The single most common home extension mistake is starting with a
          number pulled from thin air — or worse, from a vague online average
          that bears no resemblance to London pricing. National cost guides
          often quote extension rates of £1,800 to £3,000 per square metre, but
          those figures rarely account for the capital's premium on labour,
          materials delivery, and restricted site access that push costs
          significantly higher.
        </p>
        <p className={styles.p}>
          In London, a single-storey rear extension typically costs between
          £2,500 and £4,000 per square metre for the shell and basic finishes
          alone. A double-storey extension adds roughly 50 to 60 per cent on
          top. Factor in a kitchen fit-out, and you could be looking at an
          additional £15,000 to £40,000 depending on your specification. These
          are construction costs only — they exclude VAT at 20 per cent and
          professional fees that typically add another 15 to 20 per cent.
        </p>
        <p className={styles.p}>
          The fix is straightforward but requires discipline. Before you
          commission any design work, spend time understanding current London
          build costs for your specific borough. Speak to at least two
          architectural practices for ballpark estimates, and build your budget
          from the ground up. Include every line item — from structural
          engineering fees and party wall surveyor costs to skip hire and
          temporary accommodation if you cannot live on site during the build.
        </p>
        <p className={styles.p}>
          We see this constantly at BH Studio: homeowners who arrive with a
          £60,000 budget for a project that realistically needs £90,000 to
          £100,000. It is far better to right-size your expectations early than
          to run out of money mid-build and end up compromising on the very
          features that prompted the project in the first place.
        </p>
        <figure className={styles.figure}>
          <Image
            src={infographicCostsImg}
            alt="Infographic summarising common extension cost lines and realistic budget allowances in London"
            width={1200}
            height={760}
            className={styles.image}
          />
          <figcaption className={styles.figcaption}>
            Budget structure snapshot: realistic cost planning for London
            extensions.
          </figcaption>
        </figure>

        <section id="hidden-costs">
          <h3 className={styles.h3}>
            Hidden Costs That Catch London Homeowners Off Guard
          </h3>
          <p className={styles.p}>
            Beyond the headline build cost, there is a long list of ancillary
            expenses that catch first-time extenders by surprise. Planning
            application fees, building control inspection charges, a lawful
            development certificate if you are relying on permitted development
            rights, Thames Water build-over agreements, asbestos surveys for
            pre-1980 properties, and ecological assessments if your loft
            conversion disturbs bat habitats — these all add up quickly.
          </p>
          <p className={styles.p}>
            Landscaping is another frequently underestimated cost. Industry
            guidance suggests budgeting roughly 10 to 20 per cent of your total
            extension cost for restoring or improving outdoor space once
            construction wraps. If your garden has been used as a site compound
            for four months, you will want to bring it back to life — and that
            rarely happens cheaply in London.
          </p>
          <p className={styles.p}>
            Finally, do not forget the cost of living through a renovation. If
            your kitchen is out of commission for three months, you will be
            eating out or relying on takeaways far more than usual. If noise and
            dust make the house uninhabitable, short-term rental in London could
            easily run £2,000 to £4,000 per month depending on area and family
            size.
          </p>
          <figure className={styles.figure}>
            <Image
              src={infographicIcebergImg}
              alt="Iceberg infographic showing visible versus hidden extension costs"
              width={1200}
              height={760}
              className={styles.image}
            />
            <figcaption className={styles.figcaption}>
              The hidden-cost iceberg: what sits below headline build figures.
            </figcaption>
          </figure>
        </section>

        <section id="contingency-fund">
          <h3 className={styles.h3}>The Contingency Fund Most People Forget</h3>
          <p className={styles.p}>
            Every experienced architect and project manager will tell you the
            same thing: set aside a contingency of at least 10 to 15 per cent of
            your total project cost. For extensions involving older London
            properties — Victorian terraces, Edwardian semis, Georgian
            townhouses — you should push that contingency closer to 20 per cent.
            These properties are full of surprises: inadequate foundations,
            hidden asbestos, rotten timbers, and non-standard construction that
            only reveals itself once the walls are opened up.
          </p>
          <p className={styles.p}>
            A contingency fund is not money you plan to spend. It is insurance
            against the unknown. If you reach the end of your project without
            touching it, congratulations — you have a healthy budget left over
            for furnishing your new space. But if your builder discovers that
            your Victorian rear wall has no proper foundation and needs
            underpinning, you will be extremely glad that buffer exists.
          </p>
        </section>
      </section>

      {/* ===== MISTAKE 2: PROFESSIONAL ADVICE ===== */}
      <section id="skipping-professional-advice">
        <h2 className={styles.h2}>
          2. Skipping Professional Advice at the Planning Stage
        </h2>
        <p className={styles.p}>
          One of the most damaging home renovation mistakes is bringing in
          professionals too late — or not bringing them in at all. Some
          homeowners try to save money by drawing up their own plans, going
          straight to a builder, or treating the architect as a luxury rather
          than a necessity. This approach almost always costs more in the long
          run.
        </p>
        <p className={styles.p}>
          A RIBA-chartered architect does far more than draw pretty pictures.
          They assess the feasibility of your project against local planning
          policy, identify structural constraints before they become expensive
          problems, and produce the detailed drawings that allow builders to
          provide accurate, comparable quotes. Without proper drawings, builder
          quotes are essentially guesswork — and guesswork leads to variations,
          disputes, and ballooning costs once the project is underway.
        </p>
        <p className={styles.p}>
          In London specifically, the interplay between permitted development
          rights, borough-specific planning policies, conservation area
          restrictions, and building regulations is complex enough to trip up
          even experienced developers. An architect who knows your borough will
          understand what is likely to be approved, what will be refused, and
          how to design within those constraints while still delivering the
          space you need.
        </p>
        <p className={styles.p}>
          Equally important is engaging a structural engineer early. Extensions
          require calculations for steel beams, foundation design, and load
          paths. If these are done as an afterthought, the builder may need to
          pause work while they wait for engineering details — and every week of
          delay on a London building site costs money.
        </p>

        <section id="architect-first">
          <h3 className={styles.h3}>
            Why Hiring an Architect First Saves You Thousands
          </h3>
          <p className={styles.p}>
            Think of it this way: your architect is the person who translates
            your vision into a buildable, compliant design. They can suggest
            alternative approaches that you would never have considered —
            perhaps reorganising existing rooms rather than building out, or
            combining a small rear extension with a loft conversion to get more
            space for less money.
          </p>
          <p className={styles.p}>
            Professional fees for a full architectural service typically run 10
            to 12 per cent of the construction cost. On a £100,000 extension,
            that is £10,000 to £12,000. But the savings they deliver through
            smarter design, accurate tender documents, and proper contract
            administration routinely exceed that figure several times over. At
            BH Studio, we have seen projects where early architectural
            intervention saved the client 15 to 25 per cent compared to their
            original concept — simply by rethinking the approach.
          </p>
        </section>
      </section>

      {/* ===== MISTAKE 3: PLANNING PERMISSION ===== */}
      <section id="planning-permission">
        <h2 className={styles.h2}>
          3. Ignoring Planning Permission and Permitted Development Rules
        </h2>
        <p className={styles.p}>
          According to UK Government planning statistics, householder
          applications — which include home extensions — make up over half of
          all planning decisions in England. Many of those applications are
          refused, and a significant proportion of refusals stem from homeowners
          misunderstanding what they are allowed to build.
        </p>
        <p className={styles.p}>
          Permitted development rights allow certain types of house extension to
          proceed without a full planning application, provided strict size,
          height, and design criteria are met. For a detached house, you may be
          able to extend up to eight metres to the rear under the prior approval
          process. For a semi-detached or terraced property, the limit is six
          metres. But these allowances come with a long list of conditions
          relating to ridge height, eaves height, materials, proximity to
          boundaries, and the percentage of the original plot that can be
          covered by buildings.
        </p>
        <p className={styles.p}>
          The danger lies in assumption. Too many homeowners assume their
          project falls under permitted development without verifying it. If you
          proceed without the correct approval and your local authority later
          discovers the breach, you can face enforcement action — including a
          requirement to demolish the extension at your own expense. Even if
          enforcement does not follow immediately, an unapproved extension will
          create serious problems when you come to sell the property.
        </p>
        <p className={styles.p}>
          The safest approach is to apply for a lawful development certificate
          before starting work. This costs around £103 and provides formal
          confirmation from your council that the proposed works are lawful. It
          is a small price to pay for certainty and peace of mind.
        </p>

        <section id="conservation-areas">
          <h3 className={styles.h3}>
            Conservation Areas and Listed Buildings in London
          </h3>
          <p className={styles.p}>
            London has more conservation areas than any other city in the United
            Kingdom. If your property falls within one — and many do,
            particularly in boroughs like Camden, Westminster, Islington,
            Richmond, and Greenwich — your permitted development rights are
            significantly restricted. Side extensions, rear dormers, and changes
            to front elevations that would be fine elsewhere may require a full
            planning application in a conservation area.
          </p>
          <p className={styles.p}>
            Listed buildings introduce an even higher level of scrutiny. Any
            alteration that affects the character of a listed building requires
            listed building consent, which is separate from planning permission
            and carries its own criteria. Even internal changes — removing an
            original fireplace, for example — can require consent if the
            building is listed.
          </p>
          <p className={styles.p}>
            If you own a property in a London conservation area or a listed
            building, engaging a planning consultant or architect with specific
            experience in heritage projects is not optional. It is essential.
            The wrong approach can waste months of time and thousands of pounds
            in application fees, specialist reports, and redesign costs.
          </p>
        </section>
      </section>

      {/* ===== MISTAKE 4: BUILDING REGULATIONS ===== */}
      <section id="building-regulations">
        <h2 className={styles.h2}>4. Overlooking Building Regulations</h2>
        <p className={styles.p}>
          Planning permission and building regulations are two entirely separate
          systems, and confusing them is one of the most expensive mistakes a
          homeowner can make. Planning permission controls whether you can
          build. Building regulations control how you build. Even if your
          extension falls under permitted development and requires no planning
          application, you will almost certainly need building regulations
          approval.
        </p>
        <p className={styles.p}>
          Building regulations cover structural integrity, fire safety, thermal
          performance, ventilation, drainage, and electrical safety. A building
          control inspector will need to visit at key stages of the construction
          — typically at foundation level, damp-proof course, pre-plaster, and
          final completion — to sign off each element. Skipping this process or
          cutting corners means you will not receive a completion certificate,
          which creates a serious liability when selling or remortgaging.
        </p>
        <p className={styles.p}>
          The consequences of non-compliance go beyond paperwork. Poorly
          insulated extensions waste energy and feel uncomfortable to live in.
          Inadequate fire protection in a loft conversion can endanger your
          family. Sub-standard drainage can lead to flooding and subsidence.
          Building regulations exist for good reason, and treating them as a
          box-ticking exercise rather than a quality framework is a mistake that
          London homeowners cannot afford to make.
        </p>
        <p className={styles.p}>
          Work with your architect or design team to produce a full building
          regulations package — detailed technical drawings that your builder
          can follow precisely. This upfront investment in documentation pays
          for itself many times over by reducing errors, rework, and failed
          inspections during construction.
        </p>
      </section>

      {/* ===== MISTAKE 5: PARTY WALL ===== */}
      <section id="party-wall">
        <h2 className={styles.h2}>5. Forgetting About the Party Wall Act</h2>
        <p className={styles.p}>
          If you live in a terraced or semi-detached house in London — which the
          vast majority of London homeowners do — there is a strong chance your
          extension project will trigger the Party Wall etc. Act 1996. This
          applies whenever you are building on or near a shared boundary wall,
          excavating within three metres of an adjoining property's foundation,
          or excavating within six metres if your foundations go deeper than
          your neighbour's.
        </p>
        <p className={styles.p}>
          The Act requires you to serve formal notice on affected neighbours at
          least two months before construction begins. If your neighbour
          consents in writing, you can proceed without appointing surveyors. If
          they dissent — or simply fail to respond — you will need to appoint
          party wall surveyors to prepare an award that protects both parties.
          This process can take weeks and cost anywhere from £1,000 to £3,000
          per neighbour depending on complexity.
        </p>
        <p className={styles.p}>
          The mistake most people make is not ignoring the Party Wall Act
          entirely — that is relatively rare — but rather leaving it too late.
          Serving notice at the last minute can delay your start date by months
          if neighbours are slow to respond or decide to dissent. Begin the
          party wall process as soon as your design is sufficiently developed,
          ideally while you are still finalising planning or building
          regulations. That way, the party wall award is in place by the time
          your builder is ready to break ground.
        </p>
        <p className={styles.p}>
          Neighbour relationships matter enormously on London's tightly packed
          residential streets. A polite conversation before the formal notice
          goes out can make the entire process smoother. Explain what you are
          planning, show them the drawings, and reassure them that you are
          following the legal process. A little diplomacy goes a long way toward
          preventing disputes that can derail even the best-planned extension.
        </p>
      </section>

      {/* ===== MISTAKE 6: WRONG BUILDER ===== */}
      <section id="wrong-builder">
        <h2 className={styles.h2}>
          6. Choosing the Wrong Builder or Contractor
        </h2>
        <p className={styles.p}>
          Your home extension is only as good as the people who build it. Yet
          choosing a builder is where many London homeowners make their most
          consequential mistake — often by selecting the cheapest quote or the
          first name recommended by a friend without carrying out proper due
          diligence.
        </p>
        <p className={styles.p}>
          A low quote should be treated with caution rather than celebration.
          Builders who underquote typically make their money back through
          variations — additional charges for work that was either poorly scoped
          or deliberately excluded from the original price. By the time you
          realise what is happening, the project is half-built and you have no
          realistic option but to pay up.
        </p>
        <p className={styles.p}>
          Equally problematic is hiring a builder before your designs and
          approvals are fully in place. Without complete tender drawings,
          builders cannot give you a fixed price because they do not know
          exactly what they are building. This leads to provisional sums,
          estimates, and open-ended contracts that leave you exposed to cost
          overruns. A well-organised project moves from design to approval to
          tender, ensuring that builders can price against a complete and
          unambiguous set of drawings.
        </p>
        <p className={styles.p}>
          Look for builders who are willing to work from detailed architectural
          drawings, who provide itemised quotes rather than a single lump sum,
          who carry adequate insurance, and who can provide verifiable
          references from recent London projects of a similar scale. Membership
          of recognised trade bodies — the Federation of Master Builders,
          TrustMark, or the Chartered Institute of Building — is a useful
          indicator of professionalism, though it should not replace your own
          checks.
        </p>

        <section id="vetting-builders">
          <h3 className={styles.h3}>How to Vet a Builder Properly</h3>
          <p className={styles.p}>
            Get a minimum of three detailed, like-for-like quotes based on the
            same set of tender drawings. Visit at least one completed project by
            each shortlisted builder — ideally a home extension in London that
            is comparable in size and complexity to yours. Speak to previous
            clients about the builder's communication, timekeeping, quality of
            finish, and how they handled unexpected problems.
          </p>
          <p className={styles.p}>
            Before signing any contract, verify that the builder has public
            liability insurance and employer's liability insurance. Check
            whether they are VAT registered — an unregistered builder might seem
            cheaper, but it raises questions about the scale and legitimacy of
            their operation. Finally, insist on a proper written contract that
            includes a fixed price, a programme of works with milestones, a
            clear payment schedule linked to completed stages, a defects
            liability period, and provisions for delay and dispute resolution.
          </p>
        </section>
      </section>

      {/* ===== MISTAKE 7: POOR DESIGN ===== */}
      <section id="poor-design">
        <h2 className={styles.h2}>
          7. Poor Design That Kills Natural Light and Flow
        </h2>
        <p className={styles.p}>
          An extension that makes your home bigger but darker, more disjointed,
          or harder to navigate is an extension that has failed. Yet this is
          exactly what happens when design is treated as secondary to size. Too
          many homeowners focus on maximising square footage without considering
          how the new space will connect to the existing house, where natural
          light will come from, and how the overall layout will function for
          daily life.
        </p>
        <p className={styles.p}>
          Light is the single most underestimated element in home extension
          design. A deep rear extension can plunge the middle of your home into
          permanent shadow if it is not designed with glazing strategy in mind.
          Rooflights, clerestory windows, glass doors, and internal glazed
          partitions are not luxuries — they are essential tools for ensuring
          that your entire home benefits from the extension, not just the new
          room itself.
        </p>
        <p className={styles.p}>
          Flow is equally critical. Think about how you move through your home
          on a typical day: from the front door to the kitchen, from the kitchen
          to the garden, from the living room to the stairs. A well-designed
          extension enhances these movement patterns. A poorly designed one
          interrupts them, creating awkward corridors, dead-end rooms, or spaces
          that only function if you walk through another room to reach them.
        </p>
        <p className={styles.p}>
          The best London extensions feel as though they have always been part
          of the house. Achieving that requires thinking about the whole
          property — not just the new addition — and designing from the inside
          out rather than the outside in.
        </p>

        <section id="side-return-trap">
          <h3 className={styles.h3}>
            The Side Return Trap: A London-Specific Pitfall
          </h3>
          <p className={styles.p}>
            Side return extensions are enormously popular in London,
            particularly on Victorian and Edwardian terraced houses where a
            narrow alleyway runs along one side of the kitchen. Filling in this
            space to create a wider, open-plan kitchen-diner is one of the most
            common extension projects in the capital.
          </p>
          <p className={styles.p}>
            The trap is assuming that a side return extension is simple because
            it is small. In reality, these projects often involve removing a
            load-bearing wall, installing a substantial steel beam, rerouting
            drainage that runs under the side return, and managing the
            transition between the new flat roof and the existing pitched roof.
            The construction cost per square metre for a side return can be
            surprisingly high because you are paying for complex structural and
            waterproofing work in a compact footprint.
          </p>
          <p className={styles.p}>
            Furthermore, a side return extension that is poorly detailed can
            create a dark, narrow extension with a single rooflight that does
            little to compensate for the loss of the side window. The best side
            return designs combine full-width rooflights, carefully positioned
            glazing, and a considered floor plan that makes the new space feel
            generous rather than merely functional.
          </p>
        </section>
      </section>

      {/* ===== MISTAKE 8: SIZE ===== */}
      <section id="thinking-too-small">
        <h2 className={styles.h2}>
          8. Not Thinking Big Enough — or Thinking Too Big
        </h2>
        <p className={styles.p}>
          There is a bittersweet irony in home extension projects: the
          homeowners who build too small often regret it within two years, while
          those who build too big find that the extension costs more than the
          value it adds. Getting the size right is a balancing act that requires
          you to think beyond your immediate needs.
        </p>
        <p className={styles.p}>
          A common regret among homeowners is not extending far enough when they
          had the opportunity. The marginal cost of adding an extra metre or two
          to an extension is relatively small compared to the overall project
          cost — you are already paying for foundations, a roof, and
          professional fees. That additional space might mean the difference
          between a kitchen that feels adequate and one that genuinely
          transforms how your family lives.
        </p>
        <p className={styles.p}>
          On the other hand, over-extending can be a financial mistake if it
          pushes your property value above the ceiling price for your street. In
          London, where property values vary enormously from one postcode to the
          next, it is important to understand what the market will bear. A
          four-bedroom house on a street of three-bedroom terraces will add
          value, but a six-bedroom mansion on the same street may not recoup its
          costs. Speak to a local estate agent before you finalise your design
          to understand the realistic uplift in value your extension will
          deliver.
        </p>
        <p className={styles.p}>
          The sweet spot is an extension that meets your needs for the next ten
          to fifteen years while remaining proportionate to the character and
          value of neighbouring properties. Think about how your household will
          evolve: children growing into teenagers who need their own space, the
          possibility of working from home permanently, or ageing parents who
          may need a ground-floor bedroom. Designing for these scenarios now is
          far cheaper than adding them later.
        </p>
      </section>

      {/* ===== MISTAKE 9: LOFT CONVERSIONS ===== */}
      <section id="loft-conversion-blunders">
        <h2 className={styles.h2}>9. Loft Conversion Blunders</h2>
        <p className={styles.p}>
          A loft conversion is often described as the most cost-effective way to
          add space to a London home. Costs typically range from £55,000 to
          £120,000 depending on the type of conversion and the level of finish,
          and the value added can be substantial — particularly if the
          conversion creates an additional bedroom with en suite bathroom. But
          loft conversions come with their own set of pitfalls that are distinct
          from ground-floor extensions.
        </p>
        <p className={styles.p}>
          The most fundamental mistake is failing to check whether your loft is
          actually suitable for conversion before committing time and money to
          the project. Not all lofts can be converted. The minimum usable
          headroom is around 2.2 metres from finished floor to ridge, though 2.4
          metres is far more comfortable. You also need to account for the depth
          of floor insulation and finished floor build-up, which can eat into
          available headroom. If your loft falls short, options like a dormer or
          mansard conversion can increase headroom, but they add significantly
          to cost and may require planning permission.
        </p>
        <p className={styles.p}>
          Roof structure is another critical factor. Many post-1960s houses use
          trussed rafter roofs, where the timber framework criss-crosses the
          loft space and cannot simply be removed. Converting a trussed roof is
          possible but requires specialist structural engineering and is
          considerably more expensive than converting a traditional cut-roof
          with simple rafters and purlins.
        </p>

        <section id="headroom-stairs-fire">
          <h3 className={styles.h3}>Headroom, Staircases, and Fire Safety</h3>
          <p className={styles.p}>
            The staircase is where many loft conversion projects go wrong. A
            poorly positioned staircase can eat into the floor below, destroying
            bedroom space or creating an awkward layout that disrupts the flow
            of the entire house. Ideally, the new loft stairs should rise above
            the existing staircase so that you are not sacrificing valuable
            floor space on the level below. This requires careful early-stage
            design work — not an afterthought once the dormer is already built.
          </p>
          <p className={styles.p}>
            Fire safety in loft conversions is governed by strict building
            regulations, and misunderstanding them is a mistake that can have
            genuinely dangerous consequences. When you convert a loft into
            habitable space, you are adding a third storey to your home, which
            triggers requirements for protected escape routes, fire doors to
            every habitable room opening onto the staircase, interlinked
            mains-wired smoke and heat alarms, and in some cases fire-resistant
            glazing. These are not negotiable and should be incorporated into
            the design from the outset.
          </p>
          <p className={styles.p}>
            Soundproofing is the final loft conversion detail that homeowners
            frequently overlook. Without proper acoustic insulation between the
            loft floor and the rooms below, every footstep, conversation, and
            creaky floorboard will transmit through the house. Specifying the
            right floor build-up — resilient bars, acoustic mineral wool, and an
            independent ceiling — is far easier and cheaper to do during
            construction than to retrofit after the fact.
          </p>
        </section>
      </section>

      {/* ===== MISTAKE 10: TIMELINE ===== */}
      <section id="underestimating-timeline">
        <h2 className={styles.h2}>10. Underestimating the Timeline</h2>
        <p className={styles.p}>
          A common expectation among London homeowners is that their extension
          will be finished in a few weeks. The reality is that a well-managed
          single-storey extension typically takes three to six months on site,
          and the total project timeline — from initial design through to moving
          your furniture into the completed space — can be twelve months or more
          when you factor in design development, planning and building
          regulations applications, party wall agreements, and tender periods.
        </p>
        <p className={styles.p}>
          Rushing any part of this process is counterproductive. Compressed
          design timelines lead to incomplete drawings, which lead to builder
          queries on site, which lead to delays and variations. Skipping the
          tender period in favour of going with the first available builder
          often means overpaying or under-specifying. And starting construction
          before all approvals are in place is a gamble that can result in
          stop-work notices and costly redesign.
        </p>
        <p className={styles.p}>
          Build a realistic programme at the outset with your architect and
          builder. Include buffer time for weather delays, material lead times,
          and the inevitable minor hiccups that occur on every building project.
          If your builder tells you a 30-square-metre rear extension will be
          done in eight weeks, treat that claim with healthy scepticism. The
          best builders are honest about timelines precisely because they know
          how many variables are involved.
        </p>
        <p className={styles.p}>
          For homeowners planning to live on site during construction, timeline
          realism is doubly important. Three months of building work is
          manageable with some patience and organisation. Six months of dust,
          noise, and no kitchen is a different proposition entirely. Have a
          clear conversation with your builder about phasing — which rooms will
          be out of commission and when — so you can plan your life accordingly.
        </p>
        <figure className={styles.figure}>
          <Image
            src={infographicTimelineImg}
            alt="Infographic illustrating a realistic home extension project timeline in London"
            width={1200}
            height={760}
            className={styles.image}
          />
          <figcaption className={styles.figcaption}>
            Realistic timeline flow from design and approvals to completion.
          </figcaption>
        </figure>
      </section>

      {/* ===== MISTAKE 11: ENERGY EFFICIENCY ===== */}
      <section id="energy-efficiency">
        <h2 className={styles.h2}>
          11. Neglecting Energy Efficiency and Insulation
        </h2>
        <p className={styles.p}>
          Building regulations set minimum standards for thermal performance in
          new extensions, but minimum standards are exactly that — the bare
          minimum. In a city where energy costs have risen sharply and
          environmental awareness is increasing, building to a higher standard
          than the minimum is both financially and ethically sensible.
        </p>
        <p className={styles.p}>
          A well-insulated extension with high-performance glazing, airtight
          construction, and properly designed heating will cost less to run
          every year for decades. The upfront cost difference between a
          minimum-compliance extension and one built to a genuinely comfortable
          thermal standard is often only five to ten per cent of the total build
          cost — a premium that pays for itself within a few years through
          reduced energy bills.
        </p>
        <p className={styles.p}>
          The mistake most people make is treating insulation as an invisible
          commodity — something that gets buried in the walls and forgotten
          about. In reality, the quality of your insulation, the continuity of
          your airtightness layer, and the performance of your windows and doors
          will determine whether your new extension feels warm and cosy on a
          January evening or draughty and expensive to heat.
        </p>
        <p className={styles.p}>
          If you are extending a Victorian or Edwardian house, consider whether
          this is the right moment to address insulation in the existing
          building as well. Connecting a well-insulated new extension to a
          poorly insulated original house can create uncomfortable temperature
          differences between rooms. Upgrading the existing walls, floors, or
          roof at the same time as building the extension can be significantly
          more cost-effective than tackling them as a separate project later.
        </p>
      </section>

      {/* ===== MISTAKE 12: LIFESTYLE ===== */}
      <section id="how-you-live">
        <h2 className={styles.h2}>
          12. Failing to Consider How You Actually Live
        </h2>
        <p className={styles.p}>
          It is easy to get seduced by glossy design magazines and Instagram
          interiors that prioritise aesthetics over practicality. But a home
          extension exists to serve your life — not the other way around. The
          best designs start with an honest conversation about how you and your
          household actually use your home on a daily basis, not how you wish
          you used it.
        </p>
        <p className={styles.p}>
          Where do you eat most of your meals? Where do the children do
          homework? Where do you work from home? Where does the dog sleep? Where
          do you dump your keys, coats, and bags when you walk through the front
          door? These mundane questions are the foundation of good residential
          design, and ignoring them is a surprisingly common home renovation
          mistake.
        </p>
        <p className={styles.p}>
          Storage is a prime example. London homes are typically compact, and
          the need for storage only grows over time. Yet many extension designs
          maximise open floor space at the expense of cupboards, utility rooms,
          and built-in storage. The result is a beautiful new kitchen-diner that
          is permanently cluttered because there is nowhere to put anything.
          Think hard about where your possessions will live, and design storage
          into the project from the start — not as an afterthought.
        </p>
        <p className={styles.p}>
          Similarly, think about the relationship between indoor and outdoor
          space. London gardens are precious, and a rear extension that consumes
          your entire garden may give you a bigger kitchen but leave you with no
          usable outdoor area. The best projects strike a balance between
          interior space and garden, often using large glazed doors to blur the
          boundary between inside and outside.
        </p>
      </section>

      {/* ===== MISTAKE 13: MULTIPLE QUOTES ===== */}
      <section id="multiple-quotes">
        <h2 className={styles.h2}>13. Not Getting Multiple Quotes</h2>
        <p className={styles.p}>
          Industry surveys consistently find that a large proportion of
          homeowners rely on a single builder quote before committing to a
          project. This is a significant mistake. Without at least three
          detailed, like-for-like quotations based on the same set of drawings,
          you have no way of knowing whether you are paying a fair price.
        </p>
        <p className={styles.p}>
          The key word is like-for-like. Three quotes are only useful if they
          are pricing the same scope of work to the same specification. This is
          why having complete tender drawings before you approach builders is so
          important — it removes ambiguity and gives you a genuine basis for
          comparison. If one quote is significantly lower than the others, it
          almost certainly means something has been excluded or underestimated.
          If one is significantly higher, it may reflect the builder's current
          workload rather than a quality premium.
        </p>
        <p className={styles.p}>
          Beyond the headline price, compare what each quote includes. Does it
          cover building control fees? Is scaffolding included? What about waste
          removal, temporary works, and making good to existing areas? A cheap
          quote that excludes key items can end up costing more than a higher
          quote that covers everything. Read the small print, ask questions, and
          do not be afraid to go back for clarification.
        </p>
      </section>

      {/* ===== MISTAKE 14: FINISHING TOUCHES ===== */}
      <section id="finishing-touches">
        <h2 className={styles.h2}>
          14. Forgetting the Finishing Touches Until It Is Too Late
        </h2>
        <p className={styles.p}>
          There is a pattern that plays out on home renovation projects with
          depressing regularity: the homeowner invests heavily in the structure,
          runs over budget, and then has to cut corners on the finishes that
          they will see and touch every single day. Cheap kitchen handles, basic
          lighting, the wrong floor finish, a bathroom suite chosen in a panic
          because the plumber needs it on Monday — these compromises are visible
          long after the excitement of the new extension has faded.
        </p>
        <p className={styles.p}>
          The solution is to select your finishes early — ideally during the
          design stage, well before construction begins. This includes kitchen
          units and appliances, bathroom fittings, flooring, lighting, switches,
          sockets, paint colours, and external materials. Early selection serves
          two purposes: it ensures these costs are captured in your budget from
          the start, and it prevents delays caused by long lead times on popular
          products.
        </p>
        <p className={styles.p}>
          In London, where property values are high and buyer expectations are
          sophisticated, the quality of finishing is critical to the value your
          extension adds. A beautifully built extension with cheap finishes will
          look and feel disappointing. Conversely, thoughtful material choices
          can make even a modest extension feel luxurious. Allocate your budget
          wisely: spend on the things you interact with daily — worktops, taps,
          flooring, lighting — and economise on the things hidden behind the
          walls.
        </p>
      </section>

      {/* ===== MISTAKE 15: MATERIALS ===== */}
      <section id="cheap-materials">
        <h2 className={styles.h2}>
          15. Using Cheap Materials to Save Money Now
        </h2>
        <p className={styles.p}>
          There is a false economy in choosing the cheapest available materials
          for your extension. Budget roofing membranes that fail after five
          years, inexpensive windows that mist up and lose their thermal
          performance, render that cracks and stains within a season — these
          short-term savings create long-term maintenance headaches and erode
          the value of your investment.
        </p>
        <p className={styles.p}>
          The external appearance of your extension matters not only to you but
          also to your local planning authority and your neighbours. Under
          permitted development rules, external materials must match the
          existing house. Under a planning permission, you have more flexibility
          but the design should be sympathetic to the streetscape. Selecting
          materials that look acceptable initially but deteriorate quickly is a
          false saving — especially on an extension that may have cost upwards
          of £100,000.
        </p>
        <p className={styles.p}>
          Work with your architect to select materials that balance cost,
          durability, and appearance. There are areas where you can economise
          and areas where you should invest. Structural elements, waterproofing,
          insulation, and windows are not the places to cut costs. Decorative
          finishes, paint, and some internal fittings offer more flexibility for
          budget-conscious homeowners without compromising the longevity of the
          build.
        </p>
      </section>

      {/* ===== QUICK TAKEAWAYS ===== */}
      <section id="quick-takeaways">
        <h2 className={styles.h2}>Quick Takeaways</h2>
        <p className={styles.p}>
          1. Budget realistically for London prices — extensions typically cost
          £3,000 to £5,000 per square metre excluding VAT and professional fees,
          so plan accordingly and maintain a contingency of at least 10 to 20
          per cent.
        </p>
        <p className={styles.p}>
          2. Engage an architect and structural engineer before you approach any
          builder — the savings from proper design and documentation far
          outweigh the professional fees.
        </p>
        <p className={styles.p}>
          3. Never assume your project falls under permitted development —
          verify it with a lawful development certificate and check conservation
          area restrictions specific to your London borough.
        </p>
        <p className={styles.p}>
          4. Start the party wall process early and invest in good neighbour
          relationships to avoid costly delays on terraced and semi-detached
          properties.
        </p>
        <p className={styles.p}>
          5. Prioritise natural light and internal flow over raw square footage
          — a smaller, beautifully designed extension will serve you better than
          a larger, poorly planned one.
        </p>
        <p className={styles.p}>
          6. Get three like-for-like builder quotes based on complete tender
          drawings, and vet your shortlisted builders thoroughly before
          committing.
        </p>
        <p className={styles.p}>
          7. Design for how your household will live in five to fifteen years,
          not just how it lives today — future-proofing is far cheaper than
          retrofitting.
        </p>
      </section>

      {/* ===== CONCLUSION ===== */}
      <section id="conclusion">
        <h2 className={styles.h2}>
          Conclusion: Build Smarter, Not Just Bigger
        </h2>
        <p className={styles.p}>
          A successful house extension or home renovation in London is never an
          accident. It is the product of careful planning, informed
          decision-making, and the right professional team working together from
          the earliest stages. The fifteen mistakes outlined in this guide are
          not obscure edge cases — they are the issues that trip up thousands of
          London homeowners every year, often costing tens of thousands of
          pounds and months of avoidable delay.
        </p>
        <p className={styles.p}>
          The common thread running through every one of these mistakes is a
          failure to invest enough time and thought at the front end of the
          project. Rushing into construction before the design is resolved, the
          approvals are in place, the costs are understood, and the right
          builder is appointed is the single biggest risk factor for a troubled
          build. The most successful projects we see at BH Studio are those
          where the homeowner has spent the first few months getting everything
          right on paper — so that the construction phase is simply an execution
          of a well-prepared plan.
        </p>
        <p className={styles.p}>
          If you are considering extending or renovating your London home, start
          by having an honest conversation about what you need, what you can
          afford, and who you need on your team to make it happen. Whether you
          are exploring a loft conversion, a rear extension, a side return, or a
          full home renovation, the principles are the same: plan thoroughly,
          budget honestly, design intelligently, and build with the right
          people.
        </p>
        <p className={styles.p}>
          Ready to start your project on the right foot? Get in touch with us at{" "}
          <Link href="https://bhstudio.co.uk">bhstudio.co.uk</Link> for a free
          initial consultation. We will help you understand what is possible,
          what it will cost, and how to avoid every one of the mistakes you have
          just read about.
        </p>
      </section>

      {/* ===== FAQs ===== */}
      <section id="faqs">
        <h2 className={styles.h2}>Frequently Asked Questions</h2>

        <h3 className={styles.h3}>
          How much does a house extension cost in London in 2026?
        </h3>
        <p className={styles.p}>
          A single-storey house extension in London typically costs between
          £2,500 and £4,000 per square metre for construction, excluding VAT and
          professional fees. A 30-square-metre rear extension might therefore
          cost £75,000 to £120,000 once you factor in everything from
          architectural fees and structural engineering to building control,
          party wall agreements, and a fitted kitchen. Double-storey extensions
          and basements cost more per square metre due to added structural
          complexity.
        </p>

        <h3 className={styles.h3}>
          Do I need planning permission for a home extension in London?
        </h3>
        <p className={styles.p}>
          Not always. Many single-storey rear extensions fall under permitted
          development rights and do not require a full planning application,
          provided they meet strict criteria on size, height, materials, and
          boundary distances. However, London has many conservation areas where
          these rights are restricted. It is always wise to apply for a lawful
          development certificate to confirm your project is compliant before
          starting work.
        </p>

        <h3 className={styles.h3}>
          What is the biggest mistake people make with loft conversions?
        </h3>
        <p className={styles.p}>
          The most common loft conversion mistake is failing to check
          feasibility before committing. Insufficient headroom, unsuitable roof
          structures, and a lack of awareness about fire safety requirements and
          building regulations can all derail a project. Always commission a
          professional survey and engage a specialist loft conversion architect
          or company before investing in design work.
        </p>

        <h3 className={styles.h3}>
          How long does a home extension take to complete in London?
        </h3>
        <p className={styles.p}>
          From initial design to completion, a typical London home extension
          takes nine to twelve months in total. This includes two to four months
          of design and approvals, and three to six months of construction
          depending on size and complexity. Add time for the party wall process,
          building regulations, and tender if applicable. Rushing any of these
          stages usually creates problems rather than saving time.
        </p>

        <h3 className={styles.h3}>
          Should I get a structural engineer for my extension?
        </h3>
        <p className={styles.p}>
          Yes. A structural engineer is required for virtually all extensions
          and loft conversions. They design the steel beams, foundations, and
          structural connections that keep your extension safe and compliant
          with building regulations. Engaging them early — during the design
          phase rather than as a last-minute addition — helps avoid delays and
          ensures the architectural design is structurally feasible from the
          start.
        </p>

        <h3 className={styles.h3}>
          How much value does a house extension add in London?
        </h3>
        <p className={styles.p}>
          A well-designed extension can add significant value to a London
          property, though the return varies by location, property type, and
          quality of finish. As a general guide, extensions that add a bedroom
          or create an open-plan kitchen-diner tend to deliver the strongest
          returns. Industry estimates suggest you can typically expect to recoup
          50 to 100 per cent of your construction costs through increased
          property value, with loft conversions and double-storey extensions
          often at the higher end of that range.
        </p>

        <h3 className={styles.h3}>
          What is a party wall agreement and do I need one?
        </h3>
        <p className={styles.p}>
          A party wall agreement is a legal arrangement under the Party Wall
          etc. Act 1996 that governs building work affecting a shared wall,
          boundary, or nearby foundations. You are required to serve notice on
          your neighbours if your extension involves work to a party wall or
          excavation within three to six metres of an adjoining property. If
          your neighbour does not consent, a surveyor must be appointed to
          prepare a party wall award. In London, where terraced and
          semi-detached properties are the norm, most extensions trigger this
          requirement.
        </p>
      </section>

      {/* ===== INTERNAL LINKS ===== */}
      <section id="related-guides">
        <h2 className={styles.h2}>Related Guides You Should Read Next</h2>
        <div className={styles.relatedGrid}>
          {relatedGuides.map((guide) => (
            <article key={guide.href} className={styles.relatedCard}>
              <h3 className={styles.relatedTitle}>{guide.title}</h3>
              <p className={styles.relatedDesc}>{guide.description}</p>
              <Link href={guide.href} className={styles.relatedLink}>
                Read this guide
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ===== ENGAGEMENT / SOCIAL SHARE ===== */}
      <section id="feedback">
        <h2 className={styles.h2}>We Would Love to Hear From You</h2>
        <p className={styles.p}>
          If you have been through a home extension or renovation in London, we
          would love to hear about your experience. What was the one thing you
          wish you had known before you started? Did you encounter any of the
          mistakes we have covered in this guide — or discover a pitfall we
          missed?
        </p>
        <p className={styles.p}>
          Share this article with anyone you know who is planning to extend or
          renovate their home. The more homeowners who go into these projects
          with their eyes open, the fewer horror stories we will hear. And if
          you found this guide helpful, let us know — your feedback helps us
          create more content that actually makes a difference.
        </p>
      </section>

      {/* ===== REFERENCES ===== */}
      <section id="references">
        <h2 className={styles.h2}>References</h2>
        <ol className={styles.refList}>
          <li className={styles.refItem}>
            UK Government — Planning application statistics for England,
            including householder applications data.{" "}
            <a
              href="https://www.gov.uk/government/collections/planning-applications-statistics"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.extLink}
            >
              View source
            </a>
            .
          </li>
          <li className={styles.refItem}>
            Royal Institution of Chartered Surveyors (RICS) — Building Cost
            Information Service and UK Residential Market Survey data,
            including regional price balance reports.{" "}
            <a
              href="https://www.rics.org/uk/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.extLink}
            >
              View source
            </a>
            .
          </li>
          <li className={styles.refItem}>
            Office for National Statistics (ONS) — UK House Price Index and
            construction output statistics, including material and labour cost
            trends.{" "}
            <a
              href="https://www.ons.gov.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.extLink}
            >
              View source
            </a>
            .
          </li>
          <li className={styles.refItem}>
            The Party Wall etc. Act 1996 — Full legislation governing rights
            and obligations where building work affects party walls and
            neighbouring properties.{" "}
            <a
              href="https://www.legislation.gov.uk/ukpga/1996/40/contents"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.extLink}
            >
              View source
            </a>
            .
          </li>
          <li className={styles.refItem}>
            HM Government — The Town and Country Planning (General Permitted
            Development) (England) Order 2015 (as amended), including 2024/2025
            updates to permitted development rights for householder
            extensions.{" "}
            <a
              href="https://www.legislation.gov.uk/uksi/2015/596/contents"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.extLink}
            >
              View source
            </a>
            .
          </li>
        </ol>
      </section>
    </article>
  );
}
