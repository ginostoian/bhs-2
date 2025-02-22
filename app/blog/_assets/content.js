import Image from "next/image";
import ginoImg from "@/app/blog/_assets/images/authors/ginoImg.webp";
import bestOfHouzzImg from "/public/assets/img/misc/best-of-houzz-winner.png";
import howToChooseBathroomFitter from "/public/assets/img/bathroom/bathroom-design.webp";
import bathroomCost2025Img from "/public/assets/img/bathroom/industrial-bathroom.webp";
import Link from "next/link";

// ==================================================================================================================================================================
// BLOG CATEGORIES 🏷️
// ==================================================================================================================================================================

// These slugs are used to generate pages in the /blog/category/[categoryI].js. It&apos;s a way to group articles by category.
const categorySlugs = {
  bathroom: "bathroom",
  kitchen: "kitchen",
  fullHome: "full-home",
  announcement: "announcement",
};

// All the blog categories data display in the /blog/category/[categoryI].js pages.
export const categories = [
  {
    // The slug to use in the URL, from the categorySlugs object above.
    slug: categorySlugs.bathroom,
    // The title to display the category title (h1), the category badge, the category filter, and more. Less than 60 characters.
    title: "Bathroom renovation",
    // A short version of the title above, display in small components like badges. 1 or 2 words
    titleShort: "Bathrooms",
    // The description of the category to display in the category page. Up to 160 characters.
    description:
      "Everything about bathroom renovation - from design to budgets and planning.",
    // A short version of the description above, only displayed in the <Header /> on mobile. Up to 60 characters.
    descriptionShort: "Everything about bathroom renovation",
  },
  {
    // The slug to use in the URL, from the categorySlugs object above.
    slug: categorySlugs.kitchen,
    // The title to display the category title (h1), the category badge, the category filter, and more. Less than 60 characters.
    title: "Kitchen renovation",
    // A short version of the title above, display in small components like badges. 1 or 2 words
    titleShort: "Kitchens",
    // The description of the category to display in the category page. Up to 160 characters.
    description:
      "Everything about kitchen renovations - from design to budgets and planning.",
    // A short version of the description above, only displayed in the <Header /> on mobile. Up to 60 characters.
    descriptionShort: "Everything about Kitchen renovation",
  },
  {
    // The slug to use in the URL, from the categorySlugs object above.
    slug: categorySlugs.fullHome,
    // The title to display the category title (h1), the category badge, the category filter, and more. Less than 60 characters.
    title: "Home renovation",
    // A short version of the title above, display in small components like badges. 1 or 2 words
    titleShort: "Home Renovation",
    // The description of the category to display in the category page. Up to 160 characters.
    description:
      "Everything about home renovation - from design to budgets and planning.",
    // A short version of the description above, only displayed in the <Header /> on mobile. Up to 60 characters.
    descriptionShort: "Everything about home renovations",
  },
  {
    // The slug to use in the URL, from the categorySlugs object above.
    slug: categorySlugs.announcement,
    // The title to display the category title (h1), the category badge, the category filter, and more. Less than 60 characters.
    title: "Announcements",
    // A short version of the title above, display in small components like badges. 1 or 2 words
    titleShort: "Announcements",
    // The description of the category to display in the category page. Up to 160 characters.
    description: "News, information, promotions or general announcements.",
    // A short version of the description above, only displayed in the <Header /> on mobile. Up to 60 characters.
    descriptionShort: "News, info and announcements.",
  },
];

// ==================================================================================================================================================================
// BLOG AUTHORS 📝
// ==================================================================================================================================================================

// Social icons used in the author's bio.
const socialIcons = {
  twitter: {
    name: "Twitter",
    svg: (
      <svg
        version="1.1"
        id="svg5"
        x="0px"
        y="0px"
        viewBox="0 0 1668.56 1221.19"
        className="h-9 w-9"
        // Using a dark theme? ->  className="w-9 h-9 fill-white"
      >
        <g id="layer1" transform="translate(52.390088,-25.058597)">
          <path
            id="path1009"
            d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99   h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"
          />
        </g>
      </svg>
    ),
  },
  linkedin: {
    name: "LinkedIn",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        // Using a dark theme? ->  className="w-6 h-6 fill-white"
        viewBox="0 0 24 24"
      >
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
      </svg>
    ),
  },
  github: {
    name: "GitHub",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        // Using a dark theme? ->  className="w-6 h-6 fill-white"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
};

// These slugs are used to generate pages in the /blog/author/[authorId].js. It's a way to show all articles from an author.
const authorSlugs = {
  gino: "gino",
};

// All the blog authors data display in the /blog/author/[authorId].js pages.
export const authors = [
  {
    // The slug to use in the URL, from the authorSlugs object above.
    slug: authorSlugs.gino,
    // The name to display in the author's bio. Up to 60 characters.
    name: "Gino S.",
    // The job to display in the author's bio. Up to 60 characters.
    job: "Founder",
    // The description of the author to display in the author's bio. Up to 160 characters.
    description:
      "Gino is a developer and an entrepreneur. He is the co founder of Better Homes Studio and is commited to change the way people renovate by creating the thing that the industry lacks most - trust.",
    // The avatar of the author to display in the author's bio and avatar badge. It's better to use a local image, but you can also use an external image (https://...)
    avatar: ginoImg,
    // A list of social links to display in the author's bio.
    socials: [
      {
        name: socialIcons.twitter.name,
        icon: socialIcons.twitter.svg,
        url: "https://twitter.com/iamgino_s",
      },
      {
        name: socialIcons.linkedin.name,
        icon: socialIcons.linkedin.svg,
        url: "https://www.linkedin.com/in/ginostoian/",
      },
      {
        name: socialIcons.github.name,
        icon: socialIcons.github.svg,
        url: "https://github.com/ginostoian",
      },
    ],
  },
];

// ==================================================================================================================================================================
// BLOG ARTICLES 📚
// ==================================================================================================================================================================

// These styles are used in the content of the articles. When you update them, all articles will be updated.
const styles = {
  h2: "text-2xl lg:text-4xl font-bold tracking-tight mb-4 text-black",
  h3: "text-xl lg:text-2xl font-bold tracking-tight mb-2 text-black",
  p: "text-base-content/90 leading-relaxed mb-6",
  ul: "list-inside list-disc text-base-content/90 leading-relaxed",
  li: "list-item",
  // Altnernatively, you can use the library react-syntax-highlighter to display code snippets.
  accent: "text-[#266bf1]",
  pAccent: "mb-6 text-[#266bf1]",
};

// All the blog articles data display in the /blog/[articleId].js pages.
export const articles = [
  {
    // The unique slug to use in the URL. It's also used to generate the canonical URL.
    slug: "bathroom-renovation-cost-2025",
    // The title to display in the article page (h1). Less than 60 characters. It's also used to generate the meta title.
    title: "How Much Does a Bathroom Renovation Cost in London in 2025?",
    // The description of the article to display in the article page. Up to 160 characters. It's also used to generate the meta description.
    description:
      "This comprehensive guide will break down the costs you can expect in 2025, providing realistic estimates and helping you budget effectively for your dream bathroom.",
    // An array of categories of the article. It's used to generate the category badges, the category filter, and more.
    categories: [
      categories.find((category) => category.slug === categorySlugs.bathroom),
    ],
    // The author of the article. It's used to generate a link to the author's bio page.
    author: authors.find((author) => author.slug === authorSlugs.gino),
    // The date of the article. It's used to generate the meta date.
    publishedAt: "2025-02-23",
    image: {
      // The image to display in <CardArticle /> components.
      src: bathroomCost2025Img,
      // The relative URL of the same image to use in the Open Graph meta tags & the Schema Markup JSON-LD.
      urlRelative: "/assets/img/bathroom/industrial-bathroom.webp",
      alt: "Bathroom renovation in London",
    },
    // The actual content of the article that will be shown under the <h1> title in the article page.
    content: (
      <>
        <Image
          src={bathroomCost2025Img}
          alt="Bathroom renovation in london by Better Homes Studio"
          width={700}
          height={500}
          priority={true}
          className="rounded-box"
          placeholder="blur"
        />
        <section>
          <p className={styles.p}>
            Planning a <b>bathroom renovation</b> in London? One of the first
            questions you&apos;ll likely have is, &apos;How much will it
            cost?&apos; Bathroom renovation costs in London can vary
            significantly depending on the scope of the project, the materials
            you choose, and the <b>bathroom fitter</b> you hire. This
            comprehensive guide will break down the costs you can expect in
            2025, providing realistic estimates and helping you budget
            effectively for your dream bathroom.
          </p>

          <h2 className={styles.h3}>Table of Contents</h2>
          <ul className={`${styles.ul} + ${styles.pAccent}`}>
            <li className={styles.li}>
              <Link href="#factors-affecting-cost">
                Factors Affecting Bathroom Renovation Costs in London
              </Link>
            </li>
            <li>
              <Link href="#average-cost-breakdown">
                Average Cost Breakdown (2025 Estimates)
              </Link>
            </li>
            <li>
              <Link href="#cost-saving-tips">
                Cost-Saving Tips for Your London Bathroom Renovation
              </Link>
            </li>
            <li>
              <Link href="#finding-reliable-fitters">
                Finding Reliable Fitters and Getting Quotes
              </Link>
            </li>
            <li>
              <Link href="#conclusion-budgeting">
                Conclusion: Budgeting for Your Dream Bathroom
              </Link>
            </li>
          </ul>

          <h2 className={styles.h2} id="factors-affecting-cost">
            Factors Affecting Bathroom Renovation Costs in London
          </h2>

          <p className={styles.p}>
            Several factors influence the overall cost of a{" "}
            <b>bathroom renovation in London</b>. Understanding these factors
            will help you create a realistic budget and avoid unexpected
            expenses.
          </p>

          <h3 className={styles.h3}>Size of the Bathroom</h3>

          <p className={styles.p}>
            This one&apos;s fairly obvious: a larger bathroom will generally
            cost more to renovate than a smaller one. More square footage means
            more materials (tiles, flooring, paint), and potentially more labor
            hours. A small cloakroom will be significantly cheaper than a large
            family bathroom or a master en-suite.
          </p>

          <h3 className={styles.h3}>Scope of Work</h3>

          <p className={styles.p}>
            The extent of the renovation has a major impact on cost. Are you
            simply replacing a few fixtures (like a new toilet and sink), or are
            you undertaking a complete gut renovation, including moving plumbing
            and electrical work? Here&apos;s a breakdown of different project
            scopes:
          </p>

          <ul>
            <li>
              <p className={styles.p}>
                <b>Basic Refresh:</b> This might involve replacing the toilet,
                sink, and taps, perhaps adding a new coat of paint and some new
                accessories. This is the most budget-friendly option.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Mid-Range Renovation:</b> This could include replacing the
                bathtub with a shower, new tiling, and updating the vanity. It
                offers a significant upgrade without a complete overhaul.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Full Renovation (Gut Renovation):</b> This involves stripping
                the bathroom down to the studs, potentially reconfiguring the
                layout, moving plumbing and electrical, and installing all new
                fixtures and finishes. This is the most expensive option.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Luxury Renovation:</b> This includes everything in a full
                renovation, but with high-end materials, designer fixtures,
                bespoke cabinetry, and potentially features like underfloor
                heating, steam showers, and smart technology.
              </p>
            </li>
          </ul>

          <h3 className={styles.h3}>Materials and Fixtures</h3>

          <p className={styles.p}>
            The quality and type of materials you choose will significantly
            impact the price. From budget-friendly ceramic tiles to luxurious
            marble, the options are vast. Similarly, fixture costs can range
            from basic models to high-end designer brands. Consider the
            following:
          </p>

          <ul>
            <li>
              <p className={styles.p}>
                <b>Tiles:</b> Ceramic, porcelain, natural stone (marble,
                granite, slate), glass, mosaic.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Flooring:</b> Tiles (as above), vinyl, LVT (Luxury Vinyl
                Tile), waterproof laminate.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Bathtub:</b> Acrylic, steel, cast iron, freestanding.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Shower:</b> Shower enclosure, wet room, shower tray,
                showerhead (standard, rainfall, power shower).
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Toilet:</b> Close-coupled, wall-hung, back-to-wall, smart
                toilet.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Sink/Vanity:</b> Pedestal sink, wall-hung vanity, countertop
                basin, bespoke cabinetry.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Taps:</b> Mixer taps, pillar taps, wall-mounted taps,
                designer brands.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Lighting:</b> Downlights, spotlights, mirror lights, LED
                strips.
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Accessories:</b> Towel rails, toilet roll holders, mirrors,
                soap dishes.
              </p>
            </li>
          </ul>

          <h3 className={styles.h3}>Labor Costs</h3>

          <p className={styles.p}>
            Labor costs in London are generally higher than in other parts of
            the UK. The complexity of the project and the experience level of
            the <b>bathroom fitter</b> will also affect labor costs. A highly
            skilled and experienced fitter will charge more, but they are also
            more likely to deliver a high-quality finish and avoid costly
            mistakes.
          </p>

          <h3 className={styles.h3}>Location Within London</h3>

          <p className={styles.p}>
            While London is generally more expensive, prices can even fluctuate
            within the city itself. Renovations in more affluent boroughs (e.g.,
            Kensington and Chelsea, Westminster) may have slightly higher labor
            and potentially material costs compared to outer boroughs.
          </p>

          <h3 className={styles.h3}>Plumbing and Electrical Work</h3>
          <p className={styles.p}>
            If your renovation involves moving plumbing (e.g., relocating the
            toilet or sink) or adding new electrical outlets or lighting, this
            will add to the cost. These tasks require qualified professionals (a
            plumber and an electrician) and can be more time-consuming.
          </p>

          <h3 className={styles.h3}>Waste Disposal</h3>
          <p className={styles.p}>
            Don&apos;t forget to factor in the cost of waste disposal. A
            bathroom renovation generates a significant amount of waste, and
            you&apos;ll likely need to hire a skip or pay for waste removal
            services. Skip hire prices can vary in London based on size and
            location.
          </p>
          <h3 className={styles.h3}>Unexpected Issues</h3>
          <p className={styles.p}>
            It&apos;s always wise to have a contingency fund (typically 10-20%
            of the total budget) to cover any unexpected issues that may arise
            during the renovation. This could include things like discovering
            hidden water damage, asbestos, or structural problems.
          </p>

          <h2 className={styles.h2} id="average-cost-breakdown">
            Average Cost Breakdown (2025 Estimates)
          </h2>

          <p className={styles.p}>
            Based on industry data and current trends, here&apos;s a breakdown
            of average <b>bathroom renovation costs in London in 2025</b>. Keep
            in mind that these are estimates, and your actual costs may vary
            depending on the factors mentioned above. We are excluding options
            below £5,800 as requested.
          </p>

          <h3 className={styles.h3}>
            Basic Bathroom Refresh (Starting from £5,800)
          </h3>

          <ul>
            <li>
              <p className={styles.p}>
                Replacing like-for-like fixtures (toilet, sink, taps)
              </p>
            </li>
            <li>
              <p className={styles.p}>New flooring (e.g., vinyl or LVT)</p>
            </li>
            <li>
              <p className={styles.p}>Painting</p>
            </li>
            <li>
              <p className={styles.p}>New accessories</p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Typical Cost: £5,800 - £8,000</b>
              </p>
            </li>
          </ul>

          <h3 className={styles.h3}>
            Mid-Range Bathroom Renovation (Starting from £8,000)
          </h3>

          <ul>
            <li>
              <p className={styles.p}>
                Replacing bathtub with a shower enclosure
              </p>
            </li>
            <li>
              <p className={styles.p}>New tiling (walls and floor)</p>
            </li>
            <li>
              <p className={styles.p}>New vanity unit and sink</p>
            </li>
            <li>
              <p className={styles.p}>New toilet</p>
            </li>
            <li>
              <p className={styles.p}>New lighting and accessories</p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Typical Cost: £8,000 - £15,000</b>
              </p>
            </li>
          </ul>

          <h3 className={styles.h3}>
            Full Bathroom Renovation (Starting from £12,000)
          </h3>

          <ul>
            <li>
              <p className={styles.p}>
                Complete gut renovation (stripping down to the studs)
              </p>
            </li>
            <li>
              <p className={styles.p}>
                Potential layout changes (moving plumbing and electrical)
              </p>
            </li>
            <li>
              <p className={styles.p}>New bathtub or shower</p>
            </li>
            <li>
              <p className={styles.p}>New tiling (walls and floor)</p>
            </li>
            <li>
              <p className={styles.p}>New vanity unit and sink</p>
            </li>
            <li>
              <p className={styles.p}>New toilet</p>
            </li>
            <li>
              <p className={styles.p}>
                New lighting, ventilation, and accessories
              </p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Typical Cost: £12,000 - £25,000+</b>
              </p>
            </li>
          </ul>

          <h3 className={styles.h3}>
            Luxury Bathroom Renovation (Starting from £20,000)
          </h3>

          <ul>
            <li>
              <p className={styles.p}>
                Everything included in a full renovation
              </p>
            </li>
            <li>
              <p className={styles.p}>
                High-end materials (e.g., natural stone, bespoke cabinetry)
              </p>
            </li>
            <li>
              <p className={styles.p}>
                Designer fixtures (e.g., freestanding bathtub, rainfall shower)
              </p>
            </li>
            <li>
              <p className={styles.p}>Underfloor heating</p>
            </li>
            <li>
              <p className={styles.p}>
                Smart technology (e.g., smart toilet, digital shower controls)
              </p>
            </li>
            <li>
              <p className={styles.p}>Steam shower or sauna (optional)</p>
            </li>
            <li>
              <p className={styles.p}>
                <b>Typical Cost: £20,000 - £50,000+</b>
              </p>
            </li>
          </ul>

          <h2 className={styles.h2} id="cost-saving-tips">
            Cost-Saving Tips for Your London Bathroom Renovation
          </h2>

          <p className={styles.p}>
            While a bathroom renovation can be a significant investment, there
            are ways to save money without compromising on quality:
          </p>

          <h3 className={styles.h3}>Keep the Existing Layout</h3>

          <p className={styles.p}>
            Moving plumbing and electrical work is expensive. If possible, keep
            the existing layout of your bathroom to avoid these extra costs.
          </p>

          <h3 className={styles.h3}>Choose Affordable Materials</h3>

          <p className={styles.p}>
            There are many stylish and durable materials available at affordable
            prices. Consider ceramic or porcelain tiles instead of natural
            stone, and opt for LVT or vinyl flooring instead of more expensive
            options.
          </p>

          <h3 className={styles.h3}>Shop Around for Fixtures</h3>

          <p className={styles.p}>
            Don&apos;t settle for the first fixtures you see. Compare prices
            from different suppliers, both online and in-store. Look for sales
            and discounts.
          </p>

          <h3 className={styles.h3}>DIY Where Possible (But Be Realistic)</h3>

          <p className={styles.p}>
            If you have some DIY skills, you could consider tackling some of the
            simpler tasks yourself, such as painting or removing old fixtures.
            However, be realistic about your abilities and avoid taking on tasks
            that require professional expertise (like plumbing or electrical
            work).
          </p>

          <h3 className={styles.h3}>Get Multiple Quotes</h3>

          <p className={styles.p}>
            Always get quotes from at least three different{" "}
            <b>bathroom fitters</b> before making a decision. This will give you
            a better idea of the average cost and help you identify any
            outliers.
          </p>

          <h3 className={styles.h3}>Consider Ex-Display Items</h3>
          <p className={styles.p}>
            Bathroom showrooms often sell ex-display items (like vanities,
            sinks, and toilets) at discounted prices. These items are usually in
            excellent condition and can offer significant savings.
          </p>

          <h3 className={styles.h3}>Prioritize Your Needs</h3>

          <p className={styles.p}>
            If your budget is tight, prioritize the most essential elements of
            the renovation. Focus on functionality and durability, and consider
            adding luxury features later on.
          </p>

          <h2 className={styles.h2} id="finding-reliable-fitters">
            Finding Reliable Fitters and Getting Quotes
          </h2>

          <p className={styles.p}>
            Finding a reliable and experienced <b>bathroom fitter</b> is crucial
            for a successful renovation. Use online platforms like{" "}
            <Link href="https://www.mybuilder.com/">MyBuilder</Link>,{" "}
            <Link href="https://www.checkatrade.com/">Checkatrade</Link>, and{" "}
            <Link href="https://www.houzz.co.uk/">Houzz</Link> to find vetted
            and reviewed tradespeople in London. Request detailed quotes that
            break down the costs of labor, materials, and any other expenses.
            Always check references and insurance details.
          </p>

          <h2 className={styles.h2} id="conclusion-budgeting">
            Conclusion: Budgeting for Your Dream Bathroom
          </h2>

          <p className={styles.p}>
            A <b>bathroom renovation in London</b> can be a rewarding
            investment, adding value and comfort to your home. By understanding
            the factors that affect costs, creating a realistic budget, and
            following these tips, you can achieve your dream bathroom without
            breaking the bank. Remember to plan carefully, get multiple quotes,
            and choose a reputable <b>bathroom fitter</b> to ensure a smooth and
            successful renovation.
          </p>
          <a
            href="/contact"
            className="mb-10 flex min-h-[64px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-[#266bf1] px-[20px] text-[18px] font-bold capitalize text-white transition duration-200 hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] lg:min-h-[72px] lg:px-[24px]"
            data-tally-open="wQEoXw"
            data-tally-align-left="1"
            data-tally-overlay="1"
            data-tally-emoji-text="📋"
            data-tally-emoji-animation="rubber-band"
            data-tally-auto-close="2000"
          >
            Contact us now!
          </a>
        </section>
      </>
    ),
  },
  {
    // The unique slug to use in the URL. It's also used to generate the canonical URL.
    slug: "best-of-houzz-2023",
    // The title to display in the article page (h1). Less than 60 characters. It's also used to generate the meta title.
    title: "Better Homes Studio wins Best of Houzz 2023",
    // The description of the article to display in the article page. Up to 160 characters. It's also used to generate the meta description.
    description:
      "We are excited to be one of the few winners of the prestigious industry award - Best of Houzz Service 2023. Customer satisfaction is our core principle!",
    // An array of categories of the article. It's used to generate the category badges, the category filter, and more.
    categories: [
      categories.find(
        (category) => category.slug === categorySlugs.announcement,
      ),
    ],
    // The author of the article. It's used to generate a link to the author's bio page.
    author: authors.find((author) => author.slug === authorSlugs.gino),
    // The date of the article. It's used to generate the meta date.
    publishedAt: "2023-02-23",
    image: {
      // The image to display in <CardArticle /> components.
      src: bestOfHouzzImg,
      // The relative URL of the same image to use in the Open Graph meta tags & the Schema Markup JSON-LD.
      urlRelative: "/assets/img/misc/best-of-houzz-winner.png",
      alt: "Best of Houzz Winner Image",
    },
    // The actual content of the article that will be shown under the <h1> title in the article page.
    content: (
      <>
        <Image
          src={bestOfHouzzImg}
          alt="Best of Houzz 2023 Image"
          width={700}
          height={500}
          priority={true}
          className="rounded-box"
          placeholder="blur"
        />
        <section>
          <h2 className={styles.h2}>
            Better Homes Studio has won Best of Houzz Service Award - 2023
          </h2>
          <p className={styles.p}>
            We are thrilled to share the best and most flattering news:{" "}
            <Link href="https://bhstudio.co.uk" target="_blank">
              Better Homes Studio
            </Link>{" "}
            is a Best of Houzz Service 2023 Winner!!
          </p>
          <p className={styles.p}>
            Normally it is not in our nature to brag or bring our achievements
            to the fore. We prefer to enjoy discreetly the smile of our
            satisfied customers when we see them delighted with the final
            result. However, when your business has been recognized by the Houzz
            community of more than 65 million homeowners and home design
            enthusiasts for the quality of your work or customer service, this
            is a big deal and this award cannot go unnoticed and unmentioned.
          </p>
          <p className={styles.pAccent}>
            The Best of Houzz Service awards recognize pros providing great
            service to their customers, and are based on several factors,
            including a pro&apos;s overall rating on Houzz and client reviews
            submitted in the year prior to the award period.
          </p>
          <p className={styles.p}>
            We are so proud of everything our team has achieved and honoured to
            be recognized for the hard work we put in on behalf of our clients.
          </p>
          <p className={styles.pAccent}>
            It is the second Best of Houzz award we have won (in a row), and
            this makes us extremely happy and proud, especially when these
            recognitions come from one of the largest and most important niche
            platforms.
          </p>
          <p className={styles.p}>
            Three years ago, when we decided to showcase our services on this
            platform, it was one of the best decisions our company could make.
            Houzz is a place where you can find a community of millions of
            homeowners, home improvement professionals and design enthusiasts
            around the world, which gained its notoriety through the seriousness
            and professionalism of high-quality services over time.
          </p>
        </section>

        <section>
          <h3 className={styles.h3}>The Houzz Platform</h3>
          <p className={styles.p}>
            If you want to do any type of renovation, from a simple bathroom
            remodel, a full house renovation to big home makeovers like an
            extension or a basement conversion, searching a{" "}
            <Link
              href="https://houzz.co.uk"
              target="_blank"
              className="link-primary link"
            >
              reputable contractor on Houzz
            </Link>{" "}
            is a great place to start.
          </p>
          <p className={styles.p}>
            They offer you recommendations for contractors based on your
            specific need and location, giving you access to their profiles
            showcasing past work, reviews and other relevant information. Even
            if you are completely new to the home improvement scene, their team
            will guide you through the whole process of{" "}
            <Link
              className="link-primary link"
              href="https://www.houzz.co.uk/professionals/probr0-bo~"
              target="_blank"
            >
              finding a great contractor
            </Link>
            .
          </p>
          <p className={styles.p}>
            This award is an honour even more when we know that in addition to
            the fact that it is offered by some of the best in the field, this
            award is won due to the undisputed opinions of the customers.
          </p>
          <p className={styles.p}>
            Our company has been active in this field of services for over 10
            years and every time, we have tried to offer the highest quality
            services, the wishes and needs of our clients being the most.{" "}
            <span className={styles.accent}>
              Professionalism, seriousness, transparency and flexibility
            </span>{" "}
            to any client&apos;s needs are the most important assets that we
            have built with great care and attention in order to deliver the
            most satisfactory results for our clients.
          </p>
          <p className={styles.p}>
            We always try to offer complete services and detailed, explicit and
            transparent quotes, without hidden costs. We are always in direct
            contact with our clients, they have the opportunity at any time to
            find out details about their project and to ask any question that
            worries them.{" "}
            <span className={styles.accent}>
              We believe that communication is the key to success
            </span>{" "}
            when it comes to building a clear relationship between us and our
            clients, for this reason, the project manager keeps constant contact
            with them.
          </p>
          <p className={styles.p}>
            From the moment the contract was signed, we constantly offer updates
            from the field, so that the client is always up to date with the
            progress of the works.
          </p>
          <p className={styles.pAccent}>
            All these things are reflected in this award, which is strictly
            based on the undisputed opinion of the customers, and for that we
            very much thank you.
          </p>
          <p className={styles.p}>
            <span className={styles.accent}>
              Thank you for choosing and for trusting us
            </span>
            , for letting us be part of the realisation of your long-dreamed-of
            projects.
          </p>
          <p className={styles.p}>
            It means a lot to us to know that all the work done by our team is
            appreciated, and this gives us confidence and energy to make things
            even better and more beautiful in the future.
          </p>
          <p className={styles.pAccent}>
            Every satisfied customer is part of our family, which we want to
            grow larger year over year and with your help, become the best in
            London’s construction and renovation scene.
          </p>
          <p className={styles.p}>
            Thank you again for this award, we are honoured and delighted, and
            this recognition makes us even more motivated to offer the most
            spectacular results.
          </p>
          <a
            href="/contact"
            className="mb-10 flex min-h-[64px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-[#266bf1] px-[20px] text-[18px] font-bold capitalize text-white transition duration-200 hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] lg:min-h-[72px] lg:px-[24px]"
            data-tally-open="wQEoXw"
            data-tally-align-left="1"
            data-tally-overlay="1"
            data-tally-emoji-text="📋"
            data-tally-emoji-animation="rubber-band"
            data-tally-auto-close="2000"
          >
            Contact us now!
          </a>
        </section>
      </>
    ),
  },
  {
    // The unique slug to use in the URL. It's also used to generate the canonical URL.
    slug: "how-to-choose-a-bathroom-fitter",
    // The title to display in the article page (h1). Less than 60 characters. It's also used to generate the meta title.
    title: "How to choose your bathroom fitter/renovation company",
    // The description of the article to display in the article page. Up to 160 characters. It's also used to generate the meta description.
    description:
      "Tips and trick on how to find and hire a reliable bathroom fitter or renovation company.",
    // An array of categories of the article. It's used to generate the category badges, the category filter, and more.
    categories: [
      categories.find((category) => category.slug === categorySlugs.bathroom),
    ],
    // The author of the article. It's used to generate a link to the author's bio page.
    author: authors.find((author) => author.slug === authorSlugs.gino),
    // The date of the article. It's used to generate the meta date.
    publishedAt: "2025-02-22",
    image: {
      // The image to display in <CardArticle /> components.
      src: howToChooseBathroomFitter,
      // The relative URL of the same image to use in the Open Graph meta tags & the Schema Markup JSON-LD.
      urlRelative: "/assets/img/misc/best-of-houzz-winner.png",
      alt: "Bathroom renovation in London",
    },
    // The actual content of the article that will be shown under the <h1> title in the article page.
    content: (
      <>
        <Image
          src={howToChooseBathroomFitter}
          alt="Bathroom renovation in london"
          width={700}
          height={500}
          priority={true}
          className="rounded-box"
          placeholder="blur"
        />
        <section>
          <h2 className={styles.h2}>
            Dreaming of a Sparkling New Bathroom in London? Finding the Right
            Fitter is Key!
          </h2>

          <p className={styles.p}>
            A <b className={styles.accent}>bathroom renovation</b> can transform
            your London home, adding value, comfort, and a touch of luxury. But
            let&apos;s be honest, the thought of finding a reliable, skilled
            bathroom fitter can be daunting. London is a vast city, and the
            sheer number of options can feel overwhelming. This guide will walk
            you through the process, helping you navigate the search and find
            the perfect professional to bring your bathroom dreams to life.
          </p>

          <h2 className={styles.h2}>
            Why is Choosing the Right Bathroom Fitter So Important? (And Why
            This Article is for You)
          </h2>

          <p className={styles.p}>
            A bathroom isn&apos;t just a functional space; it&apos;s a
            sanctuary. A poorly executed renovation can lead to endless
            headaches, costly repairs, and a bathroom that&apos;s more
            stress-inducing than serene. Choosing the right fitter ensures a
            smooth process, a high-quality finish, and a bathroom you&apos;ll
            love for years to come. This article focuses on the specific
            challenges and opportunities of finding a bathroom fitter in London,
            addressing your concerns and providing actionable advice.
          </p>

          <h2 className={styles.h2}>
            Understanding Your Needs: Before You Start Searching
          </h2>

          <p className={styles.p}>
            Before diving into directories and review sites, take some time to
            define your project. This will help you narrow your search and
            communicate effectively with potential fitters. Consider the
            following:
          </p>

          <ul>
            <li className={styles.p}>
              <b className={styles.accent}>Scope of Work:</b> Are you planning a
              complete <b className={styles.accent}>bathroom remodel</b>, a
              simple <b className={styles.accent}>bathroom refurbishment</b>, or
              just replacing a few fixtures (like a new{" "}
              <b className={styles.accent}>shower installation</b> or{" "}
              <b className={styles.accent}>toilet installation</b>)? A full
              renovation requires a different skillset (and often a larger team)
              than a smaller update.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Budget:</b> Be realistic about your{" "}
              <b className={styles.accent}>bathroom renovation cost</b>. London
              prices can vary significantly. Having a clear budget upfront will
              help you filter out fitters who are outside your price range. Get
              quotes for various levels of finish to understand the potential
              costs.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Style and Design:</b> Do you have a
              specific design in mind (e.g., modern, traditional, minimalist)?
              Look for fitters who have experience with the style you&apos;re
              envisioning. Gathering inspiration from magazines, websites like{" "}
              <Link
                className="link-primary link"
                href="https://houzz.co.uk"
                target="_blank"
              >
                Houzz
              </Link>
              , or{" "}
              <Link
                className="link-primary link"
                href="https://pinterest.co.uk"
                target="_blank"
              >
                Pinterest
              </Link>{" "}
              can be incredibly helpful.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Timeline:</b> When do you need the
              project completed? Be upfront about your timeline expectations,
              but also be realistic about potential delays (which are common in
              construction).
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Specific Requirements:</b> Do you
              need a fitter who specializes in{" "}
              <b className={styles.accent}>wet room installation</b>,{" "}
              <b className={styles.accent}>accessible bathrooms</b>, or working
              with specific materials (e.g.,{" "}
              <b className={styles.accent}>marble tiling</b>,{" "}
              <b className={styles.accent}>underfloor heating</b>)?
            </li>
          </ul>

          <h2 className={styles.h2}>
            Where to Find Reputable Bathroom Fitters in London: Your Search
            Toolkit
          </h2>

          <p className={styles.p}>
            London offers a wealth of resources for finding qualified bathroom
            fitters. Here are some of the best places to start your search:
          </p>

          <ul>
            <li className={styles.p}>
              <b>Online Platforms:</b>
              <ul>
                <li className={styles.p}>
                  <b className={styles.accent}>
                    <Link
                      className="link-primary link"
                      href="https://mybuilder.com"
                      target="_blank"
                    >
                      MyBuilder
                    </Link>
                    :
                  </b>{" "}
                  A popular platform where you can post your job details and
                  receive quotes from interested tradespeople. You can read
                  reviews from previous clients, view profiles, and compare
                  prices. Be sure to check the feedback carefully and look for
                  fitters with a strong track record of positive reviews.
                </li>
                <li className={styles.p}>
                  <b className={styles.accent}>
                    <Link
                      className="link-primary link"
                      href="https://houzz.co.uk"
                      target="_blank"
                    >
                      Houzz
                    </Link>
                    :
                  </b>{" "}
                  Houzz is excellent for finding design inspiration and
                  connecting with professionals. You can browse portfolios, read
                  reviews, and contact fitters directly. Houzz often features
                  higher-end designers and renovators, so it&apos;s a good
                  option if you&apos;re looking for a premium finish. Search for{" "}
                  <b className={styles.accent}>bathroom designers London</b> or{" "}
                  <b className={styles.accent}>bathroom fitters London</b> to
                  find local professionals.
                </li>
                <li className={styles.p}>
                  <b className={styles.accent}>
                    <Link
                      className="link-primary link"
                      href="https://checkatrade.com"
                      target="_blank"
                    >
                      Checkatrade
                    </Link>
                    :
                  </b>{" "}
                  Checkatrade is another well-established platform that vets
                  tradespeople and provides customer reviews. They perform
                  background checks and verify insurance, giving you added peace
                  of mind.
                </li>
                <li className={styles.p}>
                  <b className={styles.accent}>
                    <Link
                      className="link-primary link"
                      href="https://trustatrader.com"
                      target="_blank"
                    >
                      Trustatrader
                    </Link>
                    :
                  </b>{" "}
                  Similar to{" "}
                  <Link
                    className="link-primary link"
                    href="https://checkatrade.com"
                    target="_blank"
                  >
                    Checkatrade
                  </Link>
                  , TrustATrader offers a directory of vetted and reviewed
                  tradespeople. You can search by location and trade, making it
                  easy to find{" "}
                  <b className={styles.accent}>bathroom fitters near me</b>.
                </li>
                <li className={styles.p}>
                  <b className={styles.accent}>
                    <Link
                      className="link-primary link"
                      href="https://ratedpeople.com"
                      target="_blank"
                    >
                      Rated People
                    </Link>
                    :
                  </b>{" "}
                  Another platform connecting homeowners with local
                  tradespeople. You can post your job and receive quotes, then
                  compare profiles and reviews.
                </li>
              </ul>
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Word-of-Mouth Recommendations:</b>{" "}
              Ask friends, family, neighbors, and colleagues in London if
              they&apos;ve had positive experiences with bathroom renovation
              companies. Personal recommendations are often the most reliable
              source of information.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Local Trade Directories:</b> Check
              local newspapers, community websites, and notice boards for
              advertisements from bathroom renovation specialists in your area.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Bathroom Showrooms:</b> Visit local
              bathroom showrooms. They often have partnerships with reputable
              installers and can provide recommendations. This also allows you
              to see the quality of materials and fixtures firsthand.
            </li>
          </ul>

          <h2 className={styles.h2}>
            Red Flags and Green Lights: How to Spot a Good (and Bad) Bathroom
            Fitter
          </h2>

          <p className={styles.p}>
            Once you&apos;ve shortlisted some potential fitters, it&apos;s
            crucial to assess their suitability. Here are some key indicators to
            look for:
          </p>

          <h3 className={styles.h3}>
            Green Lights (Signs of a Reputable Fitter):
          </h3>

          <ul>
            <li className={styles.p}>
              <b className={styles.accent}>Professionalism:</b> They respond
              promptly to your inquiries, provide clear and detailed quotes, and
              communicate effectively throughout the process.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Experience and Qualifications:</b>{" "}
              They have relevant experience in bathroom renovations and can
              provide proof of qualifications (e.g., City & Guilds, NVQ). Ask
              about their specific experience with projects similar to yours.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Insurance:</b> They have adequate
              public liability insurance (this is essential to protect you in
              case of accidents or damage). Ask to see a copy of their insurance
              certificate.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>References and Reviews:</b> They are
              willing to provide references from previous clients, and they have
              positive reviews online (on platforms like{" "}
              <Link
                className="link-primary link"
                href="https://mybuilder.com"
                target="_blank"
              >
                Mybuilder
              </Link>
              ,{" "}
              <Link
                className="link-primary link"
                href="https://houzz.co.uk"
                target="_blank"
              >
                Houzz
              </Link>
              ,{" "}
              <Link
                className="link-primary link"
                href="https://checkatrade.com"
                target="_blank"
              >
                Checkatrade
              </Link>
              , etc.). Don&apos;t just rely on the overall rating; read the
              individual reviews carefully.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Detailed Quotation:</b> They provide
              a written quotation that breaks down the costs of labor,
              materials, and any other expenses. The quote should be clear,
              comprehensive, and easy to understand. Avoid vague or overly
              simplistic quotes.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Contract:</b> They are willing to
              sign a written contract that outlines the scope of work, payment
              schedule, timeline, and any other relevant details. A contract
              protects both you and the fitter.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Portfolio:</b> They can show you
              examples of their previous work, either through photos or by
              arranging a visit to a completed project (if possible).
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Membership of Trade Associations:</b>{" "}
              While not mandatory, membership of a trade association (e.g., The
              Guild of Master Craftsmen, Federation of Master Builders) can
              indicate a commitment to quality and professionalism.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>VAT Registration:</b> If their
              turnover exceeds the VAT threshold, they should be VAT registered.
              This is a good sign of a legitimate business.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Good Communication:</b> They listen
              to your needs, answer your questions thoroughly, and keep you
              informed throughout the project.
            </li>
          </ul>

          <h3 className={styles.h3}>Red Flags (Signs to Avoid):</h3>

          <ul>
            <li className={styles.p}>
              <b className={styles.accent}>
                Unwillingness to Provide References or Insurance Details:
              </b>{" "}
              This is a major red flag. A reputable fitter should be happy to
              provide this information.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Pressure Tactics:</b> Beware of
              fitters who pressure you to make a quick decision or sign a
              contract without giving you time to consider your options.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Cash-Only Payments:</b> Avoid fitters
              who insist on cash payments without providing a proper invoice or
              receipt. This can make it difficult to track payments and resolve
              disputes.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Unrealistic Quotes:</b> Be wary of
              quotes that are significantly lower than others. This could
              indicate that the fitter is cutting corners or using inferior
              materials.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Lack of a Contract:</b> Never proceed
              with a renovation without a written contract. This protects you
              from potential disputes and misunderstandings.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Poor Communication:</b> If a fitter
              is difficult to reach or doesn&apos;t respond to your questions
              promptly, this could be a sign of problems to come.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Negative Reviews:</b> Pay close
              attention to negative reviews online, especially if there are
              recurring themes (e.g., poor workmanship, unreliability, hidden
              costs).
            </li>
          </ul>

          <h2 className={styles.h2}>
            The Importance of a Detailed Quotation and Contract
          </h2>

          <p className={styles.p}>
            A detailed quotation and a comprehensive contract are essential for
            a successful bathroom renovation. The quotation should include:
          </p>

          <ul>
            <li className={styles.p}>
              <b className={styles.accent}>Itemized Breakdown of Costs:</b> This
              should include the cost of labor, materials (with specific product
              details), and any other expenses (e.g., waste disposal, permits).
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Payment Schedule:</b> A clear payment
              schedule, typically with staged payments tied to project
              milestones. Avoid paying a large upfront deposit.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>VAT:</b> If the fitter is VAT
              registered, the VAT should be clearly stated.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Validity Period:</b> The quote should
              specify how long it is valid for.
            </li>
          </ul>

          <p className={styles.p}>The contract should cover:</p>

          <ul>
            <li className={styles.p}>
              <b className={styles.accent}>Scope of Work:</b> A detailed
              description of the work to be performed, including specific
              materials and fixtures.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Payment Schedule:</b> As outlined in
              the quotation.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Timeline:</b> Start and completion
              dates, with allowances for potential delays.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Warranties and Guarantees:</b>{" "}
              Details of any warranties on workmanship and materials.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Dispute Resolution:</b> A process for
              resolving any disputes that may arise.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Insurance:</b> Confirmation that the
              fitter has adequate public liability insurance.
            </li>
            <li className={styles.p}>
              <b className={styles.accent}>Changes and Variations:</b> A
              procedure of agreeing to any changes before additional work is
              done, and costed accordingly.
            </li>
          </ul>

          <p className={styles.p}>
            Before signing a contract, read it carefully and make sure you
            understand all the terms and conditions. If you have any doubts,
            seek legal advice.
          </p>

          <h2 className={styles.h2}>
            During the Renovation: Communication is Key
          </h2>

          <p className={styles.p}>
            Once the work begins, maintain open communication with your fitter.
            Regular site meetings, phone calls, and emails will help ensure that
            the project stays on track and that any issues are addressed
            promptly. Don&apos;t be afraid to ask questions or raise concerns. A
            good fitter will be happy to keep you informed and involved in the
            process.
          </p>

          <h2 className={styles.h2}>
            After the Renovation: Snagging and Aftercare
          </h2>

          <p className={styles.p}>
            Once the renovation is complete, conduct a thorough inspection
            (snagging) to identify any minor defects or unfinished work. Create
            a snagging list and discuss it with your fitter. They should be
            willing to rectify any issues to your satisfaction. Also be sure to
            ask for the warranty period, and get it in writing. Good fitters
            will often have a 12 month workmanship guarantee as standard.
          </p>
          <p className={styles.p}>
            Finally, ask your fitter for advice on maintaining your new
            bathroom. Proper cleaning and maintenance will help ensure that it
            stays looking its best for years to come. Consider asking for advice
            specific cleaning products for items such as{" "}
            <b className={styles.accent}>tiles, grout,</b> and the{" "}
            <b className={styles.accent}>shower screen.</b>
          </p>

          <h2 className={styles.h2}>Conclusion: Your Dream Bathroom Awaits!</h2>

          <p className={styles.p}>
            Finding the right bathroom fitter in London can seem like a
            challenge, but by following these steps, you can confidently
            navigate the process and find a professional who will deliver a
            high-quality renovation. Remember to do your research, ask the right
            questions, and trust your instincts. Your dream bathroom is within
            reach!
          </p>
          <a
            href="/contact"
            className="mb-10 flex min-h-[64px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-[#266bf1] px-[20px] text-[18px] font-bold capitalize text-white transition duration-200 hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] lg:min-h-[72px] lg:px-[24px]"
            data-tally-open="wQEoXw"
            data-tally-align-left="1"
            data-tally-overlay="1"
            data-tally-emoji-text="📋"
            data-tally-emoji-animation="rubber-band"
            data-tally-auto-close="2000"
          >
            Contact us now!
          </a>
        </section>
      </>
    ),
  },
];
