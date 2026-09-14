import { businessFacts } from "@/libs/businessFacts";
export default function MobileTrust() {
  const { reviews } = businessFacts;
  return (
    <p className="bh-mobile-trust">
      <a href={reviews.url}>
        <strong>{reviews.rating}/5</strong> · across all review platforms
      </a>
      <span>Extensions, lofts and renovations</span>
    </p>
  );
}
