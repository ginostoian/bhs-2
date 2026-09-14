import { businessFacts } from "@/libs/businessFacts";
import RelatedGuides from "@/components/brand/RelatedGuides";
import Link from "next/link";
import Image from "next/image";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import Faq from "@/components/brand/Faq";
import { FaqSchema } from "@/components/brand/Schema";
import { ProjectCTA } from "@/components/brand/ServicePage";
import ProofStrip from "@/components/brand/ProofStrip";
import styles from "./page.module.css";

export const metadata = getSEOTags({
  title: "About Better Homes | People Who Care About Your Home",
  description:
    "Get to know Gino, Celli and the Better Homes team. London renovation expertise, five-star Houzz reviews and clear workmanship guarantees.",
  canonicalUrlRelative: "/about",
});

const services = [
  [
    "Extensions",
    "/house-extension",
    "Bringing structure, daylight and everyday living together, from the foundations to the kitchen that becomes the heart of your home.",
  ],
  [
    "Loft conversions",
    "/loft-conversion",
    "Making the roof space feel like a natural part of the house, with care for the stairs, warmth, headroom and the rooms below.",
  ],
  [
    "Whole-home renovations",
    "/general-renovation",
    "Seeing how the whole house fits together, so changes to the layout, heating, lighting and finishes work as one.",
  ],
  [
    "Kitchens",
    "/kitchen-renovation",
    "Getting the practical details right, from where you prepare dinner to how the cupboards fit and the appliances connect.",
  ],
  [
    "Bathrooms",
    "/bathroom-renovation",
    "Giving as much attention to plumbing, preparation and waterproofing as we do to the tiles and fittings you see every day.",
  ],
  [
    "Basements",
    "/basement-conversion",
    "Working with your appointed specialists to understand the structure, moisture and ventilation before creating comfortable space below ground.",
  ],
];

export default function Page() {
  const faqs = getPageFaqs("about");
  return (
    <main>
      <section className={`bh-wrap bh-section ${styles.hero}`}>
        <div>
          <p className="bh-eyebrow">About Better Homes</p>
          <h1 className="bh-title">
            Your home matters. So does who you trust with it.
          </h1>
          <p className="bh-lead">
            Inviting a building team into your home is a big decision. You want
            people who know their work, listen to what matters to you and stay
            involved until the details are right.
          </p>
          <p className={styles.intro}>
            We are Better Homes. Gino, Celli and a team of skilled tradespeople,
            bringing care and renovation expertise to homes across
            London.
          </p>
          <div className="bh-actions">
            <Link href="/contact#brief" className="bh-button">
              Send us your brief
            </Link>
            <Link href="/portfolio" className="bh-text-link">
              See our work →
            </Link>
          </div>
        </div>
        <figure className={styles.photo}>
          <Image
            src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp"
            alt="A completed Better Homes kitchen and living space opening onto the garden in N19"
            width={1000}
            height={1000}
            sizes="(max-width: 800px) 100vw, 50vw"
            priority
          />
          <figcaption>
            A family home opened to the garden, N19.{" "}
            <Link href="/portfolio/daniel-n19">Explore the project →</Link>
          </figcaption>
        </figure>
      </section>
      <ProofStrip servicePath="/about" />

      <section className="bh-wrap bh-section bh-grid-two">
        <div>
          <p className="bh-eyebrow">The people behind the work</p>
          <h2 className="bh-heading">
            Gino, Celli and a team that cares how it turns out.
          </h2>
        </div>
        <div className={styles.copy}>
          <p className="bh-lead">
            Our story is in the homes we have worked on and the relationships we
            have built along the way. A first flat made your own. A kitchen with
            room for everyone. A family house ready for its next chapter.
          </p>
          <p>
            Gino and Celli are part of that story, working with homeowners and
            the people carrying out the work. You will find their names
            throughout our customer reviews, alongside the craftspeople whose
            care shows in the finished rooms.
          </p>
          <p>
            Before work begins, you will know your project lead and who to
            contact. They coordinate the people working in your home and keep
            you updated each week. You should never have to wonder who to ask
            when you need an answer.
          </p>
        </div>
      </section>

      <section className="bh-band">
        <div className="bh-wrap bh-section">
          <p className="bh-eyebrow">Experience that makes a difference</p>
          <h2 className="bh-heading">
            From one important room to a whole new way of living.
          </h2>
          <p className="bh-lead">
            Years of working in London homes teach you to look beyond the
            surface. How a room will feel. What needs attention behind a wall.
            Which decisions are worth making early. We bring that practical care
            to every size of project.
          </p>
          <div className={styles.services}>
            {services.map(([title, href, body]) => (
              <article key={href}>
                <h3>
                  <Link href={href}>
                    {title} <span aria-hidden="true">↗</span>
                  </Link>
                </h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`bh-wrap bh-section ${styles.reviews}`}>
        <div>
          <p className="bh-eyebrow">Earned in real homes</p>
          <h2 className="bh-heading">
            Five-star feedback. Personal reasons behind it.
          </h2>
          <p className="bh-lead">
            Our 5.0 out of 5 rating from 51 Houzz reviews reflects more than the
            finish. Homeowners write about feeling listened to, having questions
            answered and getting support when they need it.
          </p>
          <p className={styles.intro}>
            <a
              className="bh-text-link"
              href="https://www.houzz.co.uk/professionals/design-and-build/better-homes-pfvwgb-pf~60790866"
            >
              Read the reviews on Houzz ↗
            </a>
          </p>
        </div>
        <figure className={styles.quote}>
          <blockquote>
            “they both really care and treated my home as if it were their own.”
          </blockquote>
          <figcaption>
            Shyra Muthusamy <span>Homeowner review on Houzz</span>
          </figcaption>
        </figure>
      </section>

      <section className="bh-band">
        <div className="bh-wrap bh-section bh-grid-two">
          <div>
            <p className="bh-eyebrow">Taking responsibility</p>
            <h2 className="bh-heading">
              If something is not right, we want to hear about it.
            </h2>
          </div>
          <div className={styles.copy}>
            <p className="bh-lead">
              We want you to feel proud of your home and happy you chose us.
              That means listening when you raise a concern, taking it seriously
              and working with you to put things right.
            </p>
            <p>
              Before we finish, we walk through the work together, record
              anything that needs attention and follow it through. If a question
              comes up afterwards, you have a clear aftercare contact. We
              explain what happens next and how any issue will be handled under
              your agreed cover.
            </p>
            <p>
              Our commitment is simple: care about the outcome, take
              responsibility for our work and keep the conversation open.
            </p>
          </div>
        </div>
      </section>

      <section className="bh-wrap bh-section">
        <p className="bh-eyebrow">Care that continues</p>
        <h2 className="bh-heading">Workmanship we stand behind.</h2>
        <dl className="bh-facts">
          <div>
            <dt>Structural work, extensions and loft conversions</dt>
            <dd>{businessFacts.guaranteePeriods.structural}</dd>
          </div>
          <div>
            <dt>Kitchens and bathrooms</dt>
            <dd>{businessFacts.guaranteePeriods.kitchen}</dd>
          </div>
          <div>
            <dt>Painting and decorating</dt>
            <dd>{businessFacts.guaranteePeriods.decoration}</dd>
          </div>
        </dl>
        <p className={styles.intro}>
          {businessFacts.workmanship}
        </p>
        <p className={styles.intro}>
          <Link className="bh-text-link" href="/our-guarantee">
            Read the cover and aftercare details →
          </Link>
        </p>
      </section>

      <section id="design-and-build" className="bh-band">
        <div className="bh-wrap bh-section bh-grid-two">
          <div>
            <p className="bh-eyebrow">Support that suits you</p>
            <h2 className="bh-heading">
              Your architect. Our recommendation. The same care either way.
            </h2>
          </div>
          <div className={styles.copy}>
            <p className="bh-lead">
              Bring your own architect or choose one we recommend. They prepare
              the drawings. We build, and can look after the conversations
              between everyone if you would like less to organise.
            </p>
            <p>
              With your agreement, we can speak on your behalf, follow up
              questions and help you understand what the choices mean for the
              build and your budget. You stay informed and approve the
              decisions.
            </p>
            <p>
              Before you commit, our proposal explains the support you have
              chosen, the separate professional appointments and their fees.
            </p>
          </div>
        </div>
      </section>
      <Faq items={faqs} />
      <FaqSchema items={faqs} path="/about" />
      <ProjectCTA title="Let’s talk about the home you have in mind." />
    <RelatedGuides context="about" /></main>
  );
}
