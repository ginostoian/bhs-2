import { businessFacts } from "@/libs/businessFacts";
import { serviceReviews } from "@/libs/serviceReviews";

// Compact proof directly under a service hero: rating, experience, guarantee and one real review.
export default function HeroProof({ path }) {
  const review = serviceReviews[path];
  const { reviews } = businessFacts;
  return (
    <div
      style={{
        marginTop: 28,
        paddingTop: 20,
        borderTop: "1px solid #D8D2C6",
        display: "grid",
        gap: 14,
        maxWidth: 560,
      }}
    >
      <p className="bh-small" style={{ margin: 0, color: "#4D5B4B" }}>
        <a href={reviews.url} style={{ color: "inherit" }}>
          <strong>{reviews.rating}/5</strong> from {reviews.count} Houzz reviews
        </a>
        {" · "}
        {businessFacts.experience} building London homes
        {" · "}
        {businessFacts.guaranteeHeadline} guarantee
      </p>
      {review ? (
        <figure style={{ margin: 0 }}>
          <blockquote style={{ margin: 0, fontSize: 17, lineHeight: 1.55 }}>
            “{review.quote}”
          </blockquote>
          <figcaption className="bh-small" style={{ marginTop: 8, color: "#4D5B4B" }}>
            {review.name} · {review.context}
            {review.url ? (
              <>
                {" · "}
                <a href={review.url} style={{ color: "inherit" }}>
                  {review.source}
                </a>
              </>
            ) : (
              ` · ${review.source}`
            )}
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
