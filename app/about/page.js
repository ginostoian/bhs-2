import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import Faq from "@/components/brand/Faq";
import { FaqSchema } from "@/components/brand/Schema";
import { ProjectCards, ProjectCTA } from "@/components/brand/ServicePage";
import { getPortfolioProjects } from "@/libs/portfolio-projects";
export const metadata = getSEOTags({
  title: "About Better Homes | London Construction & Renovation",
  description:
    "Meet Better Homes, a London construction company focused on clear pricing, careful project management and quality home renovations.",
  canonicalUrlRelative: "/about",
});
export default function Page() {
  const faqs = getPageFaqs("about");
  return (
    <main>
      <section className="bh-wrap bh-section bh-grid-two">
        <div>
          <p className="bh-eyebrow">About Better Homes</p>
          <h1 className="bh-title">
            Good building starts with good management.
          </h1>
          <p className="bh-lead">
            With 12+ years of experience, we are a London construction company
            for homeowners who value thoughtful work, clear communication and a
            dependable team. Our focus is extensions, loft conversions and
            whole-home renovations, alongside standalone kitchen and bathroom
            projects.
          </p>
        </div>
        <Image
          src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp"
          alt="A completed Better Homes extension and renovation in North London"
          width={1000}
          height={800}
          priority
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 0,
          }}
        />
      </section>
      <section className="bh-band">
        <div className="bh-wrap bh-section">
          <p className="bh-eyebrow">What you can expect</p>
          <div className="bh-project-grid">
            {[
              [
                "Clear pricing",
                "An itemised scope with inclusions, exclusions and allowances. Changes are priced and agreed before the related work proceeds.",
              ],
              [
                "A well-managed site",
                "A named project lead coordinates trades, sequencing and quality checks. Weekly updates keep progress and decisions visible.",
              ],
              [
                "Care beyond completion",
                "A documented handover, snagging record and workmanship terms matched to the work delivered.",
              ],
            ].map(([t, b]) => (
              <article key={t}>
                <h2 className="bh-heading">{t}</h2>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bh-wrap bh-section bh-grid-two">
        <div>
          <p className="bh-eyebrow">Design and build, explained</p>
          <h2 className="bh-heading">
            The right people, with clear responsibilities.
          </h2>
        </div>
        <div>
          <p className="bh-lead">
            We manage your relationship with one of our trusted independent
            architects when you need design support. Better Homes manages the
            construction; your architect provides the agreed drawings and
            professional services.
          </p>
          <p style={{ marginTop: 20 }}>
            Already have drawings? We can build from them and work alongside
            your existing architect and engineer. Our proposal sets out the
            appointments, responsibilities and fees, so you understand who does
            what.
          </p>
        </div>
      </section>
      <section className="bh-wrap bh-section">
        <p className="bh-eyebrow">Independent reviews</p>
        <h2 className="bh-heading">Hear from London homeowners</h2>
        <p className="bh-lead">
          Read clients’ accounts of the planning, communication and finish on{" "}
          <a
            className="bh-text-link"
            href="https://www.houzz.co.uk/pro/betterhomeslondon/better-homes"
          >
            Houzz
          </a>
          ,{" "}
          <a className="bh-text-link" href="https://g.page/r/CaGIVAg_unOVEBM/">
            Google
          </a>{" "}
          and{" "}
          <a
            className="bh-text-link"
            href="https://www.mybuilder.com/profile/view/celli/feedback"
          >
            MyBuilder
          </a>
          .
        </p>
        <dl className="bh-facts">
          <div>
            <dt>Completed projects</dt>
            <dd>500+ completed projects</dd>
          </div>
          <div>
            <dt>Insurance cover</dt>
            <dd>£10M</dd>
          </div>
          <div>
            <dt>Our workmanship guarantee</dt>
            <dd>1 to 10 years, by scope</dd>
          </div>
        </dl>
      </section>
      <Faq items={faqs} />
      <FaqSchema items={faqs} path="/about" />
      <ProjectCTA />
    </main>
  );
}
