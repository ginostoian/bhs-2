import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";

const pageTitle = "Bathroom Cost Calculator UK 2026 | Renovation Estimator | Better Homes";
const pageDescription =
  "Free 2026 bathroom renovation cost estimator. Choose size, layout, tiling, concealed fixtures and underfloor heating to see your installation cost in seconds.";
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
        name: "Better Homes",
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
