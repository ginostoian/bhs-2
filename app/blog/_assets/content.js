import Image from "next/image";
import marcImg from "@/app/blog/_assets/images/authors/marc.png";
import introducingSupabaseImg from "@/public/blog/introducing-supabase/header.png";
import bestOfHouzzImg from "/public/assets/img/misc/best-of-houzz-winner.png";
import Link from "next/link";

// ==================================================================================================================================================================
// BLOG CATEGORIES 🏷️
// ==================================================================================================================================================================

// These slugs are used to generate pages in the /blog/category/[categoryI].js. It's a way to group articles by category.
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
    name: "Gino S",
    // The job to display in the author's bio. Up to 60 characters.
    job: "Founder",
    // The description of the author to display in the author's bio. Up to 160 characters.
    description:
      "Gino is a developer and an entrepreneur. He is the co founder of Better Homes Studio and is commited to change the way people renovate by creating the thing that the industry lacks most - trust.",
    // The avatar of the author to display in the author's bio and avatar badge. It's better to use a local image, but you can also use an external image (https://...)
    avatar: marcImg,
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
        url: "https://github.com/Marc-Lou-Org/ship-fast",
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
    slug: "introducing-supabase",
    // The title to display in the article page (h1). Less than 60 characters. It's also used to generate the meta title.
    title: "Introducing Supabase to ShipFast",
    // The description of the article to display in the article page. Up to 160 characters. It's also used to generate the meta description.
    description:
      "Supabase is an open-source Firebase alternative. It's a great tool for building a backend for your app. It's now integrated with ShipFast!",
    // An array of categories of the article. It's used to generate the category badges, the category filter, and more.
    categories: [
      categories.find((category) => category.slug === categorySlugs.kitchen),
    ],
    // The author of the article. It's used to generate a link to the author's bio page.
    author: authors.find((author) => author.slug === authorSlugs.gino),
    // The date of the article. It's used to generate the meta date.
    publishedAt: "2023-11-20",
    image: {
      // The image to display in <CardArticle /> components.
      src: introducingSupabaseImg,
      // The relative URL of the same image to use in the Open Graph meta tags & the Schema Markup JSON-LD.
      urlRelative: "/blog/introducing-supabase/header.jpg",
      alt: "Supabase and ShipFast logo combined",
    },
    // The actual content of the article that will be shown under the <h1> title in the article page.
    content: (
      <>
        <Image
          src={introducingSupabaseImg}
          alt="Supabase and ShipFast logo combined"
          width={700}
          height={500}
          priority={true}
          className="rounded-box"
          placeholder="blur"
        />
        <section>
          <h2 className={styles.h2}>Introduction</h2>
          <p className={styles.p}>
            Supabase is an open-source Firebase alternative. It&apos;s a great
            tool for building a backend for your app. It&apos;s now integrated
            with ShipFast!
          </p>
        </section>

        <section>
          <h3 className={styles.h3}>1. Create a supabase account</h3>
          <p className={styles.p}>
            First, go to{" "}
            <a href="https://supabase.com/" className="link-primary link">
              Supabase
            </a>{" "}
            and create an account. It&apos;s free for up to 10,000 rows per
            table.
            <br />
            Then create a new project and a new table. You can use the following
            SQL schema:
          </p>

          <pre className={styles.code}>
            <code>
              {`CREATE TABLE public.users (
  id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  email text NOT NULL,
  password text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);`}
            </code>
          </pre>
        </section>

        <section>
          <h3 className={styles.h3}>2. Add your credentials to ShipFast</h3>
          <p className={styles.p}>
            Copy the <span className={styles.codeInline}>API URL</span> and{" "}
            <span className={styles.codeInline}>API Key</span> from your
            Supabase project settings and add them to your ShipFast project
            settings. Add these files to your project:
          </p>

          <ul className={styles.ul}>
            <li className={styles.li}>.env.local</li>
            <li className={styles.li}>.env.production</li>
          </ul>
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
];
