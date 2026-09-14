import ServiceConfidence, { ServiceAftercare } from "./ServiceConfidence";
import PlanningLinks from "./PlanningLinks";
import RelatedGuides from "./RelatedGuides";
import Image from "next/image";
import Link from "next/link";
import Faq from "./Faq";
import ProofStrip from "./ProofStrip";
import MobileTrust from "./MobileTrust";
import { serviceStories } from "./serviceStories";
import { FaqSchema, ServiceSchema } from "./Schema";
import { BOOKING_URL } from "@/libs/booking";
import { getPortfolioProjects } from "@/libs/portfolio-projects";
export function ProjectCards({ projects }) {
  return (
    <div className="bh-project-grid">
      {projects.map((p) => (
        <Link
          className="bh-project-card"
          href={`/portfolio/${p.slug}`}
          key={p.slug}
        >
          <Image
            src={p.coverImage}
            alt={p.coverImageAlt}
            width={800}
            height={600}
            sizes="(max-width:700px) 100vw, 33vw"
          />
          <p className="bh-small">
            {p.location} · {p.category}
          </p>
          <h3>{p.title}</h3>
          <p>{p.teaser}</p>
        </Link>
      ))}
    </div>
  );
}
export function ProjectCTA({
  title = "Tell us what you would love to change.",
  service,
}) {
  return (
    <section className="bh-dark">
      <div className="bh-wrap bh-section bh-grid-two">
        <div>
          <p className="bh-eyebrow">Your next step</p>
          <h2 className="bh-heading">{title}</h2>
        </div>
        <div>
          <p className="bh-lead">
            Whether you have drawings ready or just the beginnings of an idea,
            we would love to hear about it. Tell us about your home and your
            budget, and we will help you work out a sensible next step.
          </p>
          <div className="bh-actions">
            <a className="bh-button" href={BOOKING_URL}>
              Book a 20-minute call
            </a>
            <Link
              href={
                service
                  ? `/contact?service=${encodeURIComponent(service)}#brief`
                  : "/contact#brief"
              }
              className="bh-text-link"
            >
              Send us your brief
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function ServicePage({
  name,
  path,
  title,
  intro,
  image,
  costs = [],
  scope = [],
  faqs = [],
  costRows,
  range,
  timeline,
  guarantee,
  projects: slugs = [],
  notes = [],
}) {
  const story = serviceStories[path];
  const introduction = story?.intro ?? intro;
  const projects = getPortfolioProjects()
    .filter((p) => slugs.includes(p.slug))
    .slice(0, 3);
  return (
    <main>
      <ServiceSchema
        name={`${name} in London`}
        path={path}
        description={introduction}
      />
      <FaqSchema items={faqs} path={path} />
      <section id="overview" className="bh-wrap bh-section bh-mobile-hero">
        <div className="bh-grid-two">
          <div>
            <p className="bh-eyebrow">{name} in London</p>
            <h1 className="bh-title">{title}</h1>
            <p className="bh-lead">{introduction}</p>
            <MobileTrust />
            <div className="bh-actions">
              <Link
                className="bh-button"
                href={`/contact?service=${encodeURIComponent(name)}#brief`}
              >
                Send us your brief
              </Link>
              <a className="bh-text-link" href="#costs">
                Explore costs
              </a>
            </div>
          </div>
          <figure>
            <Image
              src={image}
              alt={`${name} project by Better Homes in London`}
              width={1000}
              height={800}
              priority
              sizes="(max-width:700px) 100vw, 50vw"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: 540,
                objectFit: "cover",
                borderRadius: 0,
              }}
            />
          </figure>
        </div>
      </section>
      <ProofStrip servicePath={path} />
      <div className="bh-wrap" style={{ marginTop: 32 }}>
        <dl className="bh-facts">
          <div>
            <dt>Guide budget</dt>
            <dd>{range}</dd>
          </div>
          <div>
            <dt>Typical construction programme</dt>
            <dd>{timeline}</dd>
          </div>
          <div>
            <dt>Workmanship aftercare</dt>
            <dd>{guarantee}</dd>
          </div>
        </dl>
      </div>
      <section className="bh-wrap bh-section" id="types">
        <div className="bh-grid-two">
          <div>
            <p className="bh-eyebrow">Life in your finished home</p>
            <h2 className="bh-heading">
              {story?.heading ?? "Make more of the home you love"}
            </h2>
          </div>
          <p className="bh-lead">
            Start with the moments you would like to make easier. We will help
            you think through the possibilities, the space you have and what
            feels right for your budget.
          </p>
        </div>
        {story ? (
          <div className="bh-project-grid" style={{ marginTop: 36 }}>
            {story.moments.map(([title, text]) => (
              <article
                key={title}
                style={{ borderTop: "1px solid #D8D2C6", paddingTop: 24 }}
              >
                <h3
                  style={{ fontSize: 24, lineHeight: 1.25, marginBottom: 12 }}
                >
                  {title}
                </h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        ) : null}
        {costs.length ? (
          <h3 className="bh-heading" style={{ marginTop: 56 }}>
            Explore your options
          </h3>
        ) : null}
        <div className="bh-project-grid" style={{ marginTop: 40 }}>
          {costs.map((c) => (
            <article key={c.title}>
              <p className="bh-eyebrow">{c.price || c.range}</p>
              <h3 style={{ fontSize: 24, lineHeight: 1.25, marginBottom: 16 }}>
                {c.title}
              </h3>
              <p>{c.description || c.body}</p>
              {c.timeline ? (
                <p className="bh-small" style={{ marginTop: 16 }}>
                  {c.timeline}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
      {projects.length ? (
        <section id="projects" className="bh-band">
          <div className="bh-wrap bh-section">
            <p className="bh-eyebrow">Completed work</p>
            <h2 className="bh-heading">{path === "/loft-conversion" ? "Explore our loft and renovation work" : "The details that make a home work"}</h2>
            {path === "/loft-conversion" && <p className="bh-small">Explore loft and bathroom work in E17 and a combined extension, loft and refurbishment project in E10.</p>}
            <ProjectCards projects={projects} />
          </div>
        </section>
      ) : null}
      <ServiceConfidence servicePath={path} />
      <section className="bh-wrap bh-section" id="scope">
        <div className="bh-grid-two">
          <div>
            <p className="bh-eyebrow">Your quotation</p>
            <h2 className="bh-heading">
              Know what is included before we begin
            </h2>
            <p className="bh-lead">
              Your quote explains the work, what it costs and the choices still
              to make. We talk it through with you, so you feel comfortable with
              the plan before work begins.
            </p>
          </div>
          <ul className="bh-list">
            {scope.map((s, i) => (
              <li key={i}>
                {typeof s === "string" ? (
                  s
                ) : (
                  <>
                    <h3 style={{ fontSize: 20, marginBottom: 8 }}>{s.title}</h3>
                    <p>{s.body || s.description}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bh-band">
        <div className="bh-wrap bh-section">
          <p className="bh-eyebrow">Design and construction</p>
          <h2 className="bh-heading">
            Your choice of architect. Support either way.
          </h2>
          <div className="bh-grid-two">
            <article>
              <h3 style={{ fontSize: 24, marginBottom: 16 }}>
                You need design support
              </h3>
              <p>
                If your project needs an architect, we can recommend one. They
                prepare the drawings. We help you understand what the options
                mean for the build and your budget, and can look after the
                conversations and follow-up questions. You choose the design and
                approve the cost.
              </p>
            </article>
            <article>
              <h3 style={{ fontSize: 24, marginBottom: 16 }}>
                You have your own architect
              </h3>
              <p>
                We are happy to work with them, whether your drawings are
                underway or complete. If you wish, we can speak with them on
                your behalf and keep the plans and building work moving
                together. You stay informed and make the decisions that matter
                to you.
              </p>
            </article>
          </div>
          <p className="bh-small" style={{ marginTop: 28 }}>
            Your architect prepares the drawings and agreed professional
            submissions; we manage construction. Our proposal sets out the
            coordination support you want, each appointment and the fees before
            you commit.
          </p>
        </div>
      </section>
      <section className="bh-wrap bh-section" id="process">
        <p className="bh-eyebrow">How we work</p>
        <h2 className="bh-heading">From your first ideas to feeling at home</h2>
        <ol className="bh-list">
          {[
            [
              "Tell us what you have in mind",
              "We listen to what you want from your home, talk through your budget and explain the next steps. You do not need every detail decided.",
            ],
            [
              "Make a plan you feel good about",
              "We work through the drawings and choices with you and your design team, then agree the work, price and timing before building starts.",
            ],
            [
              "Stay informed while we build",
              "Your project lead updates you each week and explains any decisions you need to make. We check the finishing details with you and give you a clear aftercare contact.",
            ],
          ].map(([t, b], i) => (
            <li className="bh-grid-two" key={t}>
              <h3 style={{ fontSize: 22 }}>
                <span className="bh-small" style={{ marginRight: 20 }}>
                  0{i + 1}
                </span>
                {t}
              </h3>
              <p>{b}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="bh-dark" id="costs">
        <div className="bh-wrap bh-section">
          <p className="bh-eyebrow">Cost planning</p>
          <h2 className="bh-heading">
            A clearer picture of what it could cost
          </h2>
          <p className="bh-lead">
            {range}. Scope and specification determine the final price. Check
            the written quotation for VAT, professional fees, product allowances
            and contingency. Planning ranges are not a fixed offer.
          </p>
          {notes.length ? (
            <ul className="bh-list">
              {notes.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          ) : null}
          {costRows ? (
            <div style={{ overflowX: "auto", marginTop: 32 }}>
              <table className="bh-cost-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Floor area</th>
                    <th>Basic refurbishment</th>
                    <th>Mid-range</th>
                    <th>High specification</th>
                  </tr>
                </thead>
                <tbody>
                  {costRows.map((r) => (
                    <tr key={r.home}>
                      <th>{r.home}</th>
                      <td>{r.size}</td>
                      <td>{r.basic}</td>
                      <td>{r.mid}</td>
                      <td>{r.high}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="bh-small">
                Basic figures describe lighter refurbishment. They do not
                represent a complete structural and services renovation.
              </p>
            </div>
          ) : null}
          <div className="bh-actions">
            <Link href="/tools" className="bh-button">
              Explore cost planning tools
            </Link>
          </div>
        </div>
      </section>
      <section id="guarantees" className="bh-wrap bh-section">
        <span id="why-us" />
        <div className="bh-grid-two">
          <div>
            <p className="bh-eyebrow">Built on trust</p>
            <h2 className="bh-heading">
              Care during the build. Support afterwards.
            </h2>
          </div>
          <div>
            {["/general-renovation", "/loft-conversion"].includes(path) ? <ServiceAftercare /> : <>
            <p className="bh-lead">
              We want you to feel looked after while we work and once you are
              settled in. Your project lead keeps you informed, and you have a
              clear contact for questions afterwards. Your workmanship cover is
              matched to the work we have done and explained before you commit.
            </p>
            <p style={{ marginTop: 16 }}>
              Manufacturer warranties and insurance are separate.{" "}
              <Link className="bh-text-link" href="/our-guarantee">
                Read about our guarantee
              </Link>{" "}
              and{" "}
              <a
                className="bh-text-link"
                href="https://www.houzz.co.uk/pro/betterhomeslondon/better-homes"
              >
                read independent homeowner reviews
              </a>
              .
            </p>
            </>}
          </div>
        </div>
      </section>
      <PlanningLinks servicePath={path} />
      <Faq id="faq" items={faqs} title="Questions you may be considering" />
      <ProjectCTA service={name} title={story?.cta} />
      <RelatedGuides context={{ "/loft-conversion": "loft", "/general-renovation": "renovation", "/kitchen-renovation": "kitchen", "/bathroom-renovation": "bathroom", "/basement-conversion": "basement" }[path]} />
    </main>
  );
}
