import Link from "next/link";
import CalculatorApp from "./CalculatorApp";
import { getCalculator } from "@/libs/calculators/registry";
import { businessFacts } from "@/libs/businessFacts";

const SITE = "https://bhstudio.co.uk";

// Server-rendered shell for every calculator page: a clear H1 and promise, the
// interactive calculator, a live price table from the same engine, then guidance and FAQs
// that search engines and AI answers can read.
export default function CalculatorPage({ id, eyebrow, title, intro, points = [], benchmark, sections = [], faqs = [], related = [], service }) {
  const calc = getCalculator(id);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: calc.name.replace(/^./, (c) => c.toUpperCase()),
        url: `${SITE}${calc.path}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
        provider: { "@id": `${SITE}/#organization` },
      },
      faqs.length
        ? {
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }
        : null,
    ].filter(Boolean),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="bh-wrap" style={{ paddingTop: "clamp(28px, 5vw, 56px)", paddingBottom: 28 }}>
        <p className="bh-eyebrow">{eyebrow}</p>
        <h1 className="bh-title" style={{ maxWidth: 900, marginBottom: 16 }}>
          {title}
        </h1>
        <p className="bh-lead" style={{ maxWidth: 760 }}>
          {intro}
        </p>
        {points.length ? (
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", listStyle: "none", padding: 0, margin: "18px 0 0", fontSize: 15, color: "#4d5b4b" }}>
            {points.map((p) => (
              <li key={p}>✓ {p}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="bh-wrap" style={{ paddingBottom: "clamp(48px, 7vw, 88px)" }}>
        <CalculatorApp id={id} service={service} />
      </section>

      {benchmark ? (
        <section className="bh-band">
          <div className="bh-wrap bh-section">
            <p className="bh-eyebrow">2026 benchmarks</p>
            <h2 className="bh-heading">{benchmark.title}</h2>
            {benchmark.intro ? <p className="bh-lead" style={{ maxWidth: 760 }}>{benchmark.intro}</p> : null}
            <div style={{ overflowX: "auto", marginTop: 28 }}>
              <table className="bh-cost-table">
                <thead>
                  <tr>
                    {benchmark.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {benchmark.rows.map((r) => (
                    <tr key={r[0]}>
                      {r.map((cell, i) => (i === 0 ? <th key={i}>{cell}</th> : <td key={i}>{cell}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {benchmark.note ? <p className="bh-small" style={{ marginTop: 14 }}>{benchmark.note}</p> : null}
          </div>
        </section>
      ) : null}

      {sections.map((sec) => (
        <section key={sec.title} className="bh-wrap bh-section" style={{ paddingBottom: 0 }}>
          <div className="bh-grid-two">
            <h2 className="bh-heading">{sec.title}</h2>
            <div className="bh-prose" style={{ fontSize: 17, lineHeight: 1.65 }}>
              {sec.body}
            </div>
          </div>
        </section>
      ))}

      {faqs.length ? (
        <section className="bh-wrap bh-section">
          <p className="bh-eyebrow">FAQs</p>
          <h2 className="bh-heading">Questions people ask</h2>
          <div style={{ display: "grid", gap: 0, marginTop: 24, borderTop: "1px solid #d8d2c6" }}>
            {faqs.map((f) => (
              <details key={f.q} style={{ borderBottom: "1px solid #d8d2c6", padding: "18px 0" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 18 }}>{f.q}</summary>
                <p style={{ margin: "12px 0 0", maxWidth: 820, lineHeight: 1.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bh-dark">
        <div className="bh-wrap bh-section bh-grid-two">
          <div>
            <p className="bh-eyebrow">From estimate to fixed price</p>
            <h2 className="bh-heading">Turn your budget into a plan</h2>
          </div>
          <div>
            <p className="bh-lead">
              {businessFacts.experience} building London homes, {businessFacts.reviews.rating}/5 on Houzz and workmanship guarantees of {businessFacts.guaranteeHeadline.toLowerCase()}. Tell us about your home and we&apos;ll tell you honestly what it will take.
            </p>
            <div className="bh-actions">
              <Link className="bh-button" href={`/contact?service=${encodeURIComponent(service || calc.short)}#brief`}>
                Send us your brief
              </Link>
              {related.map((r) => (
                <Link key={r.href} className="bh-text-link" href={r.href}>
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
