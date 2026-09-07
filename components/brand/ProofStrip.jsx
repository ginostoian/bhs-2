import styles from "./ProofStrip.module.css";

const guarantees = {
  "/": ["10 years", "Extensions & lofts"],
  "/house-extension": ["10 years", "Extension workmanship"],
  "/loft-conversion": ["10 years", "Loft workmanship"],
  "/kitchen-renovation": ["2 years", "Kitchen workmanship"],
  "/bathroom-renovation": ["2 years", "Bathroom workmanship"],
  "/general-renovation": ["By scope", "Cover by work package"],
  "/basement-conversion": ["By scope", "Terms in your quotation"],
};

// Houzz rating/count checked 7 September 2026 against the linked profile.
// Experience and insurance: /about. Workmanship scope: /our-guarantee.
// Keep the review count specific to Houzz; do not aggregate across platforms.
export default function ProofStrip({ servicePath = "/" }) {
  const [duration, scope] = guarantees[servicePath] ?? [
    "By scope",
    "View guarantee details",
  ];
  return (
    <section
      className={styles.proof}
      aria-label="Our track record and your protection"
    >
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>Rated by homeowners</dt>
          <dd>
            <span className={styles.value}>
              5.0<span className={styles.denominator}> / 5</span>
            </span>
            <a href="https://www.houzz.co.uk/professionals/design-and-build/better-homes-pfvwgb-pf~60790866">
              51 reviews on Houzz <span aria-hidden="true">↗</span>
            </a>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>Experience</dt>
          <dd>
            <span className={styles.value}>12+ years</span>
            <span className={styles.detail}>Improving London homes</span>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>Insurance cover</dt>
          <dd>
            <span className={styles.value}>£10 million</span>
            <span className={styles.detail}>Separate from our guarantee</span>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>Workmanship guarantee</dt>
          <dd>
            <span className={styles.value}>{duration}</span>
            <a href="/our-guarantee">
              {scope} <span aria-hidden="true">→</span>
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
