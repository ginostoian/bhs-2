import RelatedGuides from "@/components/brand/RelatedGuides";
import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
export const metadata = getSEOTags({
  title: "Renovation Cost Calculators | Better Homes",
  description:
    "Use our free London-focused renovation calculators for kitchens, bathrooms, home refurbishments, extensions and BTU heating estimates.",
  canonicalUrlRelative: "/tools",
  openGraph: {
    title: "Renovation Cost Calculators | Better Homes",
    description:
      "Free calculators to estimate London renovation, extension, kitchen, bathroom and heating project costs.",
    url: `https://${config.domainName}/tools`,
  },
  keywords: [
    "renovation cost calculator London",
    "bathroom cost calculator",
    "kitchen renovation calculator",
    "extension cost calculator London",
  ],
});
export default function Page() {
  const calculators = [
    {
      title: "Kitchen Renovation Calculator",
      description:
        "Explore an early planning estimate for your kitchen renovation project. Our calculator considers your kitchen size, materials, and specific requirements.",
      image: "/assets/img/kitchen/contemporary-kitchen.webp",
      link: "/kitchen-calculator",
      features: [
        "Kitchen size calculation",
        "Material selection",
        "Electrics & plumbing",
        "PDF download",
      ],
      estimatedTime: "5-10 minutes",
      accuracy: "Planning estimate",
    },
    {
      title: "Bathroom Renovation Calculator",
      description:
        "Calculate the cost of your bathroom renovation with our comprehensive tool. Includes tiling, fixtures, and underfloor heating options.",
      image: "/assets/img/bathroom/industrial-bathroom.webp",
      link: "/tools/bathroom-cost-calculator",
      features: [
        "Bathroom size options",
        "Layout changes",
        "Tiling levels",
        "Fixture selection",
      ],
      estimatedTime: "3-5 minutes",
      accuracy: "Planning estimate",
    },
    {
      title: "House Extension Calculator",
      description:
        "Plan your house extension with our detailed cost calculator. Covers single and double-storey extensions with various finishes.",
      image: "/assets/img/extension/extension-1.webp",
      link: "/extension-calculator",
      features: [
        "Extension type",
        "Size calculation",
        "Finishing options",
        "PDF download",
      ],
      estimatedTime: "8-12 minutes",
      accuracy: "Planning estimate",
    },
    {
      title: "General Renovation Calculator",
      description:
        "Comprehensive calculator for general home renovation projects. Perfect for whole house refurbishments and building refurbishment projects.",
      image: "/assets/img/general/london-grey-living-room.webp",
      link: "/renovation-calculator",
      features: [
        "Room-by-room breakdown",
        "Material selection",
        "Labour costs",
        "PDF download",
      ],
      estimatedTime: "10-15 minutes",
      accuracy: "Planning estimate",
    },
    {
      title: "BTU Calculator",
      description:
        "Estimate the BTU output for heating your room with gas or electric radiators. Explore heating requirements based on room size and insulation.",
      image: "/assets/img/general/living-room-1.webp",
      link: "/btu-calculator",
      features: [
        "Room size calculation",
        "Insulation assessment",
        "Heating type selection",
        "Cost estimates",
      ],
      estimatedTime: "3-5 minutes",
      accuracy: "Planning estimate",
    },
  ];
  return (
    <main>
      <section className="bh-wrap bh-section">
        <p className="bh-eyebrow">Cost planning</p>
        <h1 className="bh-title">
          Understand the investment before you commit.
        </h1>
        <p className="bh-lead">
          Use our calculators to explore the scope and choices behind your
          budget. Each tool shows its own assumptions and allowances. A property
          review and itemised quotation turn a planning range into an agreed
          construction price.
        </p>
      </section>
      <section className="bh-wrap bh-section">
        <div className="bh-project-grid">
          {calculators.map((c) => (
            <Link key={c.link} className="bh-project-card" href={c.link}>
              <Image
                src={c.image}
                alt={c.title}
                width={800}
                height={600}
                sizes="(max-width:700px) 100vw, 33vw"
              />
              <p className="bh-eyebrow">{c.estimatedTime}</p>
              <h2 className="bh-heading" style={{ fontSize: 28 }}>
                {c.title}
              </h2>
              <p>{c.description}</p>
              <p className="bh-text-link">Open calculator →</p>
            </Link>
          ))}
        </div>
      </section>
    <RelatedGuides context="tools" /></main>
  );
}
