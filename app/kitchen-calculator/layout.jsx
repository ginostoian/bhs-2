import { getSEOTags } from "@/libs/seo";

const pageTitle = "Kitchen Renovation Cost Calculator UK | London | Better Homes";
const pageDescription =
  "Estimate kitchen renovation costs in London and across the UK with our free calculator covering size, materials, electrical and plumbing requirements.";
const siteUrl = "https://bhstudio.co.uk";
const pageUrl = `${siteUrl}/kitchen-calculator`;
const kitchenFaqs = [
  {
    question: "Why do online kitchen estimates vary so much?",
    answer:
      "Many only price the units, not the installed project. Real kitchen jobs also depend on appliances, worktops, electrical work, plumbing, flooring, decorating, structural openings, and VAT.",
  },
  {
    question: "What drives kitchen cost the most?",
    answer:
      "The biggest cost drivers are cabinetry tier, worktop material, appliance package, layout changes, and any electrical, plumbing, or structural work.",
  },
  {
    question: "Why do you show a range instead of one exact number?",
    answer:
      "Before the run length, services and structural details are fully confirmed, exact-looking prices are misleading. A transparent range is more useful for budgeting and quote comparison.",
  },
  {
    question: "Does the estimate include appliances?",
    answer:
      "Yes, if you select an appliance package. The result separates appliances from cabinetry so you can see their impact clearly.",
  },
  {
    question: "What is usually missed in a kitchen budget?",
    answer:
      "Common misses are making good, decorating, flooring, boiler work, extractor ducting, waste removal, structural engineer fees, and party wall or building control costs where applicable.",
  },
];
const calculatorSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${pageUrl}#webapplication`,
      name: "Kitchen Renovation Cost Calculator UK",
      url: pageUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      provider: {
        "@type": "Organization",
        name: "Better Homes Studio",
        url: siteUrl,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: kitchenFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Cost Guides",
          item: `${siteUrl}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Kitchen Calculator",
          item: pageUrl,
        },
      ],
    },
  ],
};

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  canonicalUrlRelative: "/kitchen-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://bhstudio.co.uk/kitchen-calculator",
  },
  keywords: [
    "kitchen renovation calculator",
    "kitchen cost calculator London",
    "kitchen refurbishment cost",
  ],
});

export default function KitchenCalculatorLayout({ children }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
    </>
  );
}
