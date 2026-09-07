import Image from "next/image";
import Link from "next/link";
import Faq from "./Faq";
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
  title = "A better home starts with a conversation.",
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
            Tell us about the property, what you would like to change and your
            target investment. We will discuss the fit, the construction route
            and the next practical step.
          </p>
          <div className="bh-actions">
            <a className="bh-button" href={BOOKING_URL}>
              Discuss your project
            </a>
            <Link href="/contact" className="bh-text-link">
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
  const projects = getPortfolioProjects()
    .filter((p) => slugs.includes(p.slug))
    .slice(0, 3);
  return (
    <main>
      <ServiceSchema
        name={`${name} in London`}
        path={path}
        description={intro}
      />
      <FaqSchema items={faqs} path={path} />
      <section id="overview" className="bh-wrap bh-section">
        <div className="bh-grid-two">
          <div>
            <p className="bh-eyebrow">{name} in London</p>
            <h1 className="bh-title">{title}</h1>
            <p className="bh-lead">{intro}</p>
            <div className="bh-actions">
              <a className="bh-button" href={BOOKING_URL}>
                Discuss your project
              </a>
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
      <div className="bh-wrap">
        <dl className="bh-facts">
          <div>
            <dt>Planning investment</dt>
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
            <p className="bh-eyebrow">The right scope</p>
            <h2 className="bh-heading">Choose the work your home needs</h2>
          </div>
          <p className="bh-lead">
            A considered brief starts with how you use your home. Structure,
            services, access and the finish you choose all shape the right
            route. These are planning examples, with the final scope agreed for
            your property.
          </p>
        </div>
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
            <h2 className="bh-heading">The details that make a home work</h2>
            <ProjectCards projects={projects} />
          </div>
        </section>
      ) : null}
      <section className="bh-wrap bh-section" id="scope">
        <div className="bh-grid-two">
          <div>
            <p className="bh-eyebrow">Your quotation</p>
            <h2 className="bh-heading">
              Clear scope before the first day on site
            </h2>
            <p className="bh-lead">
              We set out the construction work, allowances and exclusions in
              writing. You can see what is included, what you need to select and
              who is responsible for each decision.
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
          <h2 className="bh-heading">Two ways to get the project moving</h2>
          <div className="bh-grid-two">
            <article>
              <h3 style={{ fontSize: 24, marginBottom: 16 }}>
                You need design support
              </h3>
              <p>
                We manage your relationship with a trusted independent architect
                and coordinate construction cost and buildability input. The
                architect provides the drawings and agreed professional
                services. Appointments, fees and responsibilities are identified
                in the proposal.
              </p>
            </article>
            <article>
              <h3 style={{ fontSize: 24, marginBottom: 16 }}>
                You already have drawings
              </h3>
              <p>
                We can build from your existing drawings. We review the design,
                structural information, permissions and specification with you
                and your team, then prepare an itemised construction quotation
                and programme.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="bh-wrap bh-section" id="process">
        <p className="bh-eyebrow">How we work</p>
        <h2 className="bh-heading">A clear route from brief to handover</h2>
        <ol className="bh-list">
          {[
            [
              "Brief and feasibility",
              "We discuss the property, your priorities, access and early budget assumptions.",
            ],
            [
              "Design and approvals",
              "Your appointed professionals resolve design and approval requirements. We coordinate the information needed for construction.",
            ],
            [
              "Scope and quotation",
              "We agree inclusions, exclusions, allowances, payment stages and the programme before work starts.",
            ],
            [
              "Construction",
              "Your project lead coordinates trades and gives weekly progress updates. Changes are priced and agreed before the related work proceeds.",
            ],
            [
              "Handover and aftercare",
              "We record snags, complete agreed checks and hand over the relevant documents and workmanship terms.",
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
            Understand the investment before you commit
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
            <p className="bh-lead">
              Written pricing, a named project lead and regular updates make
              decisions easier. Our workmanship guarantee depends on the work
              delivered: ten years for extensions and loft conversions, two
              years for kitchens and bathrooms, and one year for decorating.
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
          </div>
        </div>
      </section>
      <Faq
        id="faq"
        items={faqs}
        title={`Planning your ${name.toLowerCase()}`}
      />
      <ProjectCTA />
    </main>
  );
}
