import { articles } from "@/app/blog/_assets/content";

const CONTEXT_PROFILES = {
  home: {
    preferredSlugs: [
      "home-renovation-cost-london-2026",
      "house-extension-mistakes-london",
      "bathroom-renovation-london-trends-2026",
      "kitchen-renovation-full-guide-2025",
    ],
    primaryCategories: ["full-home", "extension", "bathroom", "kitchen"],
    secondaryCategories: [],
    keywords: ["renovation", "extension", "kitchen", "bathroom", "loft"],
  },
  extension: {
    preferredSlugs: [
      "house-extension-mistakes-london",
      "house-extension-value-london-guide",
      "permitted-development-guide",
      "house-extension-types",
    ],
    primaryCategories: ["extension"],
    secondaryCategories: ["full-home"],
    keywords: ["extension", "planning", "permitted development", "loft"],
  },
  loft: {
    preferredSlugs: [
      "planning-permission-loft-conversion-london",
      "loft-conversions-london-complete-guide-2026",
      "house-extension-mistakes-london",
      "permitted-development-guide",
    ],
    primaryCategories: ["extension", "full-home"],
    secondaryCategories: [],
    keywords: ["loft", "roof", "planning", "permitted development"],
  },
  renovation: {
    preferredSlugs: [
      "home-renovation-cost-london-2026",
      "property-buying-checklist-london-2026",
      "house-extension-mistakes-london",
      "bathroom-renovation-london-trends-2026",
    ],
    primaryCategories: ["full-home"],
    secondaryCategories: ["extension", "bathroom", "kitchen"],
    keywords: ["renovation", "refurbishment", "budget", "planning"],
  },
  bathroom: {
    preferredSlugs: [
      "bathroom-renovation-london-trends-2026",
      "bathroom-renovation-cost-2025",
      "how-to-choose-a-bathroom-fitter",
      "home-renovation-cost-london-2026",
    ],
    primaryCategories: ["bathroom"],
    secondaryCategories: ["full-home"],
    keywords: ["bathroom", "fitter", "bathroom renovation"],
  },
  kitchen: {
    preferredSlugs: [
      "kitchen-renovation-full-guide-2025",
      "kitchen-providers-comparison-guide",
      "home-renovation-cost-london-2026",
      "house-extension-mistakes-london",
    ],
    primaryCategories: ["kitchen"],
    secondaryCategories: ["full-home", "extension"],
    keywords: ["kitchen", "cabinetry", "renovation"],
  },
  about: {
    preferredSlugs: [
      "home-renovation-cost-london-2026",
      "planning-permission-loft-conversion-london",
      "bathroom-renovation-london-trends-2026",
      "kitchen-renovation-full-guide-2025",
    ],
    primaryCategories: ["full-home", "extension", "bathroom", "kitchen"],
    secondaryCategories: [],
    keywords: ["renovation", "extension", "bathroom", "kitchen", "loft"],
  },
  contact: {
    preferredSlugs: [
      "home-renovation-cost-london-2026",
      "planning-permission-loft-conversion-london",
      "bathroom-renovation-london-trends-2026",
      "kitchen-renovation-full-guide-2025",
    ],
    primaryCategories: ["full-home", "extension", "bathroom", "kitchen"],
    secondaryCategories: [],
    keywords: ["renovation", "consultation", "extension", "bathroom", "kitchen", "loft"],
  },
  faq: {
    preferredSlugs: [
      "home-renovation-cost-london-2026",
      "house-extension-mistakes-london",
      "planning-permission-loft-conversion-london",
      "bathroom-renovation-cost-2025",
    ],
    primaryCategories: ["full-home", "extension", "bathroom", "kitchen"],
    secondaryCategories: [],
    keywords: ["planning", "cost", "renovation", "extension", "bathroom"],
  },
  portfolio: {
    preferredSlugs: [
      "house-extension-value-london-guide",
      "loft-conversions-london-complete-guide-2026",
      "kitchen-renovation-full-guide-2025",
      "bathroom-renovation-london-trends-2026",
    ],
    primaryCategories: ["extension", "full-home", "kitchen", "bathroom"],
    secondaryCategories: [],
    keywords: ["case study", "extension", "kitchen", "bathroom", "loft"],
  },
  tools: {
    preferredSlugs: [
      "home-renovation-cost-london-2026",
      "bathroom-renovation-cost-2025",
      "kitchen-renovation-full-guide-2025",
      "house-extension-value-london-guide",
    ],
    primaryCategories: ["full-home", "bathroom", "kitchen", "extension"],
    secondaryCategories: [],
    keywords: ["cost", "guide", "budget", "calculator"],
  },
};

function formatDisplayDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toHighlightArticle(article) {
  return {
    title: article.title,
    date: formatDisplayDate(article.publishedAt),
    imgUrl: article.image.urlRelative,
    slug: article.slug,
  };
}

function scoreArticle(article, profile) {
  const categorySlugs = (article.categories || [])
    .map((category) => category?.slug)
    .filter(Boolean);
  const haystack = `${article.title} ${article.description}`.toLowerCase();

  let score = 0;

  const preferredIndex = profile.preferredSlugs.indexOf(article.slug);
  if (preferredIndex !== -1) {
    score += 200 - preferredIndex * 10;
  }

  for (const slug of categorySlugs) {
    if (profile.primaryCategories.includes(slug)) score += 40;
    if (profile.secondaryCategories.includes(slug)) score += 18;
  }

  for (const keyword of profile.keywords) {
    if (haystack.includes(keyword)) score += 12;
  }

  if (article.categories?.some((category) => category?.slug === "announcement")) {
    score -= 200;
  }

  return score;
}

export function getKnowledgeCenterArticles(context, limit = 4) {
  const profile = CONTEXT_PROFILES[context] || CONTEXT_PROFILES.home;

  return articles
    .map((article) => ({
      article,
      score: scoreArticle(article, profile),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.article.publishedAt) - new Date(a.article.publishedAt);
    })
    .slice(0, limit)
    .map(({ article }) => toHighlightArticle(article));
}
