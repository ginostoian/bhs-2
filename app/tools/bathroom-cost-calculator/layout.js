import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";

const pageTitle = "Bathroom Renovation Cost Calculator UK | London | Better Homes";
const pageDescription =
  "Estimate bathroom renovation costs in London and across the UK with our free calculator including layout changes, tiling levels, fixtures and underfloor heating.";
const siteUrl = "https://bhstudio.co.uk";
const pageUrl = `${siteUrl}/tools/bathroom-cost-calculator`;
const bathroomFaqs = getPageFaqs("bathroomCalculator");
const calculatorSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${pageUrl}#webapplication`,
      name: "Bathroom Renovation Cost Calculator UK",
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
      mainEntity: bathroomFaqs.map((faq) => ({
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
          name: "Bathroom Cost Calculator",
          item: pageUrl,
        },
      ],
    },
  ],
};

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  canonicalUrlRelative: "/tools/bathroom-cost-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://bhstudio.co.uk/tools/bathroom-cost-calculator",
  },
  keywords: [
    "bathroom renovation calculator",
    "bathroom cost calculator London",
    "bathroom refurbishment estimate",
  ],
});

export default function BathroomCostCalculatorLayout({ children }) {
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
