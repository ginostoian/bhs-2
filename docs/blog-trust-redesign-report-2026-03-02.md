# Blog Trust Redesign Report (March 2, 2026)

## Scope completed

This rollout upgraded the blog experience into a trust-first learning system for mid-to-high income London homeowners:

- Main blog hub (`/blog`) redesigned as a professional knowledge center.
- Category pages (`/blog/category/[categoryId]`) redesigned with trust framing, social proof, and local SEO schema.
- Individual article pages (`/blog/[articleId]`) redesigned to feel like expert guidance pages with stronger authority signals and consultation CTAs.

## Key UX and copy upgrades

### 1) Blog hub (`/blog`)

- Converted from a simple post listing into a structured learning hub.
- Added credibility framing:
  - "Why homeowners trust this content" section.
  - Trust stats and practical learning-path navigation by category.
- Added stronger conversion moments:
  - "Start with latest guide" CTA.
  - Consultation CTA for project-specific advice.
- Added/kept Blog JSON-LD schema for indexability support.

### 2) Category pages (`/blog/category/[categoryId]`)

- Rebuilt layout around trust and decision support:
  - Premium hero with context and confidence-focused copy.
  - Featured guide + full category learning journey.
  - "Why this category builds trust" block.
  - Related category progression cards to increase topical depth.
- Added social proof with real homeowner testimonials and source links (Houzz).
- Added structured data:
  - `CollectionPage`
  - `BreadcrumbList`
  - `ItemList` of category guides
- Added invalid-param hardening with `notFound()`.

### 3) Article pages (`/blog/[articleId]`)

- Reframed article template as a trust-first advisory page:
  - Strong hero framing around homeowner outcomes.
  - "How to use this guide" decision-support section.
  - Sidebar trust indicators, social proof, related guides, and direct consultation CTA.
  - More premium copy tone aligned with serious renovation buyers.
- Added/updated structured data:
  - `BlogPosting`
  - `BreadcrumbList`
- Added invalid-param hardening with `notFound()`.

## Static generation and indexation behavior

To maximize crawl stability and indexation:

- `app/blog/page.js`:
  - `export const dynamic = "force-static"`
  - `export const revalidate = 86400`
- `app/blog/category/[categoryId]/page.js`:
  - `generateStaticParams()` implemented for all categories.
  - `export const dynamic = "force-static"`
  - `export const dynamicParams = false`
  - `export const revalidate = 86400`
- `app/blog/[articleId]/page.js`:
  - `generateStaticParams()` implemented for all articles.
  - `export const dynamic = "force-static"`
  - `export const dynamicParams = false`
  - `export const revalidate = 86400`

Result: these routes are prebuilt at build time from known slugs, with ISR refresh window configured via `revalidate`.

## Files changed

- `app/blog/page.js`
- `app/blog/category/[categoryId]/page.js`
- `app/blog/[articleId]/page.js`
- `public/sitemap-0.xml` (from build/postbuild sitemap generation workflow)

## Validation run

- Targeted lint passed for updated blog files:
  - `npm run lint -- --file app/blog/page.js --file app/blog/category/[categoryId]/page.js --file app/blog/[articleId]/page.js`
- Full production build could not complete in this sandbox because outbound network calls are blocked for Google Fonts:
  - `next/font` fetch to `fonts.googleapis.com` failed (`ENOTFOUND`).
  - This is environment/network-related, not caused by the page code changes.

## SEO/trust outcome summary

- Better topical architecture and interlinking for crawl depth.
- Stronger trust cues across all blog layers (hub/category/article), including social proof.
- Clearer conversion flow from education into consultation.
- Static prebuild behavior made explicit for `/blog` + category + article routes to support indexation quality.
