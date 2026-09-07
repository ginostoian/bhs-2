import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import config from "@/config";
import { BOOKING_URL } from "@/libs/booking";
import { getSEOTags } from "@/libs/seo";
import { categories, articles } from "../../_assets/content";
import CardArticle from "../../_assets/components/CardArticle";
import CardCategory from "../../_assets/components/CardCategory";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 86400;

const siteUrl = `https://${config.domainName}`;

const socialProofTestimonials = [
  {
    name: "Louise Thorogood",
    quote:
      "I could not recommend them more highly. The whole process was streamlined and efficient, with a detailed quote and a very high standard of work.",
    sourceLabel: "Houzz Review",
    sourceUrl:
      "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
  },
  {
    name: "George G",
    quote:
      "After comparing loft conversion companies in North East London, we chose Better Homes. The team delivered our hip-to-gable loft in 9 weeks exactly as promised.",
    sourceLabel: "Houzz Review",
    sourceUrl:
      "https://www.houzz.co.uk/viewReview/2013769/better-homes-studio-review",
  },
  {
    name: "Shyra Muthusamy",
    quote:
      "The quality of workmanship is extremely high and they translated loose ideas into reality with excellent attention to detail.",
    sourceLabel: "Houzz Review",
    sourceUrl:
      "https://www.houzz.co.uk/viewReview/1863607/better-homes-studio-review",
  },
];

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getCategoryArticles = (categorySlug) =>
  articles
    .filter((article) =>
      article.categories.some((articleCategory) => articleCategory.slug === categorySlug),
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const buildCategorySchema = (category, articlesInCategory) => {
  const pageUrl = `${siteUrl}/blog/category/${category.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${category.title} Guides | ${config.appName}`,
        description: category.description,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@type": "Thing",
          name: category.title,
          description: category.description,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Blog",
            item: `${siteUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category.title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: articlesInCategory.length,
        itemListElement: articlesInCategory.slice(0, 12).map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "BlogPosting",
            headline: article.title,
            url: `${siteUrl}/blog/${article.slug}`,
            datePublished: article.publishedAt,
            author: {
              "@type": "Person",
              name: article.author.name,
            },
          },
        })),
      },
    ],
  };
};

export function generateStaticParams() {
  return categories.map((category) => ({
    categoryId: category.slug,
  }));
}

export function generateMetadata({ params }) {
  const category = categories.find((item) => item.slug === params.categoryId);

  if (!category) {
    return getSEOTags({
      title: `${config.appName} Blog`,
      description:
        "Practical, London-focused guidance for homeowners planning extensions, loft conversions and full renovations.",
      canonicalUrlRelative: "/blog",
    });
  }

  return getSEOTags({
    title: `${category.title} Guides | ${config.appName} Knowledge Center`,
    description: category.description,
    canonicalUrlRelative: `/blog/category/${category.slug}`,
    openGraph: {
      title: `${category.title} Guides | ${config.appName} Knowledge Center`,
      description: category.description,
      url: `${siteUrl}/blog/category/${category.slug}`,
    },
    keywords: [
      `${category.title} London`,
      `${category.titleShort} renovation guide`,
      "London homeowner renovation advice",
      "house extension and loft conversion help",
    ],
  });
}

export default function CategoryPage({params}){const category=categories.find(x=>x.slug===params.categoryId);if(!category)notFound();const posts=getCategoryArticles(category.slug);return <main className="bh-wrap"><section className="bh-section"><p className="bh-eyebrow">The journal · {category.titleShort||category.title}</p><h1 className="bh-title">{category.title}</h1><p className="bh-lead">{category.description}</p><Link className="bh-text-link" href="/blog">Explore all guides →</Link></section><section className="bh-project-grid" style={{paddingBottom:80}}>{posts.map(x=><CardArticle key={x.slug} article={x}/>)}</section></main>;}
