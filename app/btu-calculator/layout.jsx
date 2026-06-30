import { getSEOTags } from "@/libs/seo";

const pageTitle = "BTU Calculator UK | Radiator & Heating Size | Better Homes";
const pageDescription =
  "Calculate radiator BTU requirements for rooms in the UK using dimensions, insulation level, and heating type with our free BTU calculator.";
const siteUrl = "https://bhstudio.co.uk";
const pageUrl = `${siteUrl}/btu-calculator`;
const btuFaqs = [
  {
    question: "What is BTU and why is it important for heating?",
    answer:
      "BTU is a measurement of thermal energy. For radiators, BTU ratings help you choose the right size so the room gets warm enough without wasting energy.",
  },
  {
    question: "How do I measure my room for BTU calculation?",
    answer:
      "Measure the length, width, and height of your room in metres. For irregular rooms, break them into rectangular sections and calculate each separately.",
  },
  {
    question: "What is the difference between gas and electric radiators?",
    answer:
      "Gas radiators connect to a central heating system, while electric radiators heat independently. The right choice depends on installation, running cost, and room use.",
  },
  {
    question: "How does insulation affect BTU requirements?",
    answer:
      "Good insulation reduces BTU requirements because the room retains heat better. Poorly insulated rooms need higher BTU output to compensate for heat loss.",
  },
];
const calculatorSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${pageUrl}#webapplication`,
      name: "BTU Calculator UK",
      url: pageUrl,
      applicationCategory: "UtilityApplication",
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
      mainEntity: btuFaqs.map((faq) => ({
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
          name: "BTU Calculator",
          item: pageUrl,
        },
      ],
    },
  ],
};

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  canonicalUrlRelative: "/btu-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://bhstudio.co.uk/btu-calculator",
  },
  keywords: [
    "BTU calculator",
    "radiator BTU calculator",
    "room heating calculator",
  ],
});

export default function BTUCalculatorLayout({ children }) {
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
