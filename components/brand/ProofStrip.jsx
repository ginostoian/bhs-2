import { businessFacts } from "@/libs/businessFacts";
import styles from "./ProofStrip.module.css";

export default function ProofStrip() {
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
              {businessFacts.reviews.rating}
              <span className={styles.denominator}> / 5</span>
            </span>
            <a href={businessFacts.reviews.url}>
              {businessFacts.reviews.summary}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>Building London homes</dt>
          <dd>
            <span className={styles.value}>{businessFacts.experience}</span>
            <a href="/portfolio">{businessFacts.projectsSummary} →</a>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>Insurance cover</dt>
          <dd>
            <span className={styles.value}>{businessFacts.insuranceHeadline}</span>
            <a href="/contact">Request insurance details →</a>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>Workmanship guarantee</dt>
          <dd>
            <span className={styles.value}>{businessFacts.guaranteeHeadline}</span>
            <a href="/our-guarantee">
              Cover by work type <span aria-hidden="true">→</span>
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
