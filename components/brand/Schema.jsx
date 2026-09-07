import { SITE_URL, BUSINESS_IDS } from "@/libs/structuredData";
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export function ServiceSchema({ name, path, description }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}${path}#service`,
        name,
        description,
        url: `${SITE_URL}${path}`,
        provider: { "@id": BUSINESS_IDS.localBusiness },
        areaServed: { "@type": "City", name: "London" },
      }}
    />
  );
}
export function FaqSchema({ items, path }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}${path}#faq`,
        mainEntity: items.map((x) => ({
          "@type": "Question",
          name: x.question,
          acceptedAnswer: { "@type": "Answer", text: x.answer || x.answerText },
        })),
      }}
    />
  );
}
