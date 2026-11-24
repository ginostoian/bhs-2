import { formatPrice, projectsFor, projectsInPostcodes } from "@/libs/realProjects";
import { ratings, reviews, reviewsFor } from "@/libs/reviews";

// Real jobs with real prices, plus clients' own words. Used on service and area pages so
// every page carries first-hand evidence rather than generic claims.
export function RecentJobs({ service, postcodes, title, intro, limit = 6 }) {
  const jobs = postcodes ? projectsInPostcodes(postcodes, limit) : projectsFor(service, limit);
  if (!jobs.length) return null;
  return (
    <section className="bh-wrap bh-section" id="recent-jobs">
      <p className="bh-eyebrow">Recent jobs and what they cost</p>
      <h2 className="bh-heading">{title}</h2>
      <p className="bh-lead" style={{ maxWidth: 760 }}>
        {intro ??
          "These are our own quotes for real London homes, before VAT and rounded. Where a client bought their own kitchen units, suite or tiles, the price is for the work."}
      </p>
      <div className="bh-table-scroll">
        <table className="bh-table" style={{ minWidth: 680 }}>
          <thead>
            <tr>
              <th>Client and area</th>
              <th>Work</th>
              <th>Our quote, before VAT</th>
              <th>Time on site</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <th style={{ whiteSpace: "nowrap" }}>
                  {j.client}, {j.area} {j.postcode}
                </th>
                <td style={{ minWidth: 280 }}>
                  <strong style={{ fontWeight: 500, color: "#202925" }}>{j.title}.</strong> {j.scope}
                  {j.priceNote ? <span style={{ display: "block", opacity: 0.8, marginTop: 4 }}>{j.priceNote}</span> : null}
                </td>
                <td style={{ whiteSpace: "nowrap", fontWeight: 500, color: "#202925" }}>About {formatPrice(j.price)}</td>
                <td style={{ whiteSpace: "normal", fontWeight: 400 }}>{j.duration ?? j.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ClientVoices({ service, keys, title = "What our clients say" }) {
  const list = (keys ?? reviewsFor[service] ?? reviewsFor.renovation).map((k) => reviews[k]).filter(Boolean);
  return (
    <section className="bh-band" id="reviews">
      <div className="bh-wrap bh-section">
        <p className="bh-eyebrow">In their words</p>
        <h2 className="bh-heading">{title}</h2>
        <p className="bh-small" style={{ marginBottom: 28 }}>
          {ratings.map((r, i) => (
            <span key={r.source}>
              {i ? " · " : ""}
              <a className="bh-text-link" href={r.url} target="_blank" rel="noopener noreferrer">
                {r.score} on {r.source} ({r.count} reviews)
              </a>
            </span>
          ))}
        </p>
        <div className="bh-project-grid">
          {list.map((r) => (
            <figure key={r.name} style={{ margin: 0, borderTop: "1px solid #D8D2C6", paddingTop: 20 }}>
              <blockquote style={{ margin: 0, fontSize: 18, lineHeight: 1.55 }}>“{r.quote}”</blockquote>
              <figcaption className="bh-small" style={{ marginTop: 14 }}>
                {r.name}, {r.context} ·{" "}
                <a className="bh-text-link" href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.source}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
