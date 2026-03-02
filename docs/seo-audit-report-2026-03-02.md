# Better Homes Studio SEO Audit
Date: March 2, 2026
Scope: Codebase audit (`/Users/gino_s/Documents/bhs-2`) + lightweight live SERP visibility check

## Executive Summary
Current SEO maturity is medium with strong recent progress in local/location SEO and blog structure, but there are several high-impact technical and on-page blockers that can suppress rankings.

### Scorecard (0-10)
- On-page SEO: 4.5
- Technical SEO: 5.0
- Local SEO: 7.0
- AI-search readiness: 4.0
- Overall: 5.1

### Biggest issues hurting rank potential right now
1. Broken/weak internal linking in key service blocks (`ContentRow`) due relative href + trailing whitespace.
2. Metadata/canonical coverage is incomplete across many indexable pages.
3. Crawl/index control is weak (auth + thank-you pages in sitemap, no explicit noindex strategy for sensitive/low-intent routes).
4. Some structured data is low-quality/invalid-for-intent (FAQ schema uses placeholder answers).
5. Domain/canonical consistency appears weak in live index signals (`www` and non-`www` footprints both visible).

## What Is Already Good
- Strong location architecture with dedicated pages and internal nearby-location links.
  - `/Users/gino_s/Documents/bhs-2/app/locations/[slug]/page.js`
  - `/Users/gino_s/Documents/bhs-2/app/locations/page.js`
- Good use of JSON-LD on location/blog/portfolio pages.
  - `/Users/gino_s/Documents/bhs-2/app/blog/[articleId]/page.js`
  - `/Users/gino_s/Documents/bhs-2/app/blog/category/[categoryId]/page.js`
  - `/Users/gino_s/Documents/bhs-2/app/portfolio/[projectId]/page.js`
- Sitemap + robots infrastructure exists and is automated by `next-sitemap`.
  - `/Users/gino_s/Documents/bhs-2/next-sitemap.config.js`
  - `/Users/gino_s/Documents/bhs-2/public/sitemap.xml`
  - `/Users/gino_s/Documents/bhs-2/public/robots.txt`
- Blog has improved trust framing and static generation controls (`force-static`, ISR).

## Findings By Area

## 1) On-Page SEO

### Critical
- Internal link construction bug in `ContentRow`:
  - Href is built as ```${ctaTallyFormLink || slug} ``` with a trailing space.
  - Many slugs are relative (e.g. `"house-extension"`), not absolute (`"/house-extension"`).
  - This can generate malformed/relative URLs, crawl waste, and broken internal equity flow.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/components/contentRow/ContentRow.js:48`
    - `/Users/gino_s/Documents/bhs-2/config.js:117`

### High
- Too many indexable pages use only global default metadata.
  - Non-admin pages audited: 39
  - With explicit metadata: 13
  - Without explicit metadata: 26
- This causes duplicate titles/descriptions and weak query targeting.
  - Root default metadata is globally applied:
    - `/Users/gino_s/Documents/bhs-2/app/layout.js:25`
    - `/Users/gino_s/Documents/bhs-2/libs/seo.js:18`

### High
- Canonical coverage is incomplete.
  - Canonical tags are only present when `canonicalUrlRelative` is explicitly passed.
  - Several pages export metadata but still do not define canonical hints (example forms).
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/libs/seo.js:58`
    - `/Users/gino_s/Documents/bhs-2/app/kitchen-renovation-form/page.js:3`

### Medium
- Empty heading blocks are rendered on multiple pages.
  - `SectionTitle` always renders `<h2>` and `<p>`, even when props are empty.
  - Many pages call `<SectionTitle />` with no props, creating empty heading nodes.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/components/sectionTitle/SectionTitle.js:6`
    - `/Users/gino_s/Documents/bhs-2/app/about/page.js:148`
    - `/Users/gino_s/Documents/bhs-2/app/faq/page.js:337`

### Medium
- Navigation has empty href entries (`href=""`) for dropdown parents.
  - Can create crawl noise, useless links, and accessibility issues.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/components/navigation/Navigation.js:97`
    - `/Users/gino_s/Documents/bhs-2/components/navigation/Navigation.js:295`

### Medium
- Location pages link to parameterized contact URLs (`/contact?location=...`) but contact page lacks dedicated metadata/canonical strategy.
  - Can generate duplicate URL variants with query params.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/app/locations/[slug]/page.js:382`

## 2) Technical SEO

### Critical
- Sitemap includes URLs that should not be prioritized for indexation:
  - `/apple-icon.png`
  - `/auth/signin`
  - `*-form-submitted` pages
- Evidence:
  - `/Users/gino_s/Documents/bhs-2/public/sitemap-0.xml:3`
  - `/Users/gino_s/Documents/bhs-2/public/sitemap-0.xml:5`
  - `/Users/gino_s/Documents/bhs-2/public/sitemap-0.xml:6`
  - `/Users/gino_s/Documents/bhs-2/public/sitemap-0.xml:9`

### High
- `next-sitemap` exclusion list is too narrow and does not exclude low-value/sensitive routes.
  - Current excludes only metadata image routes.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/next-sitemap.config.js:16`

### High
- Robots policy is fully open and does not guide crawlers away from low-value areas.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/public/robots.txt:2`

### High
- No explicit `noindex` strategy for auth/thank-you/tokenized routes.
  - Candidates:
    - `/auth/signin`
    - `*-form-submitted`
    - tokenized share pages (`/gantt/[token]`, `/invoices/[token]`, likely `/quotes/[id]` depending intent)
  - These should be controlled via page metadata and/or headers.

### Medium
- Build robustness/perf signals:
  - Build failed in this environment because Google Fonts fetch failed (`next/font` Inter from `fonts.googleapis.com`).
  - `sharp` is missing (recommended by Next.js for production image optimization).
  - Evidence: build log (`npm run build`, March 2, 2026).

### Medium
- External image source in footer is not in Next image allowlist.
  - Footer uses `carbonneutralwebsite.org` image.
  - Next config allowlist does not include that domain.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/components/footer/Footer.js:116`
    - `/Users/gino_s/Documents/bhs-2/next.config.js:4`

### Medium
- Potential live canonical host inconsistency.
  - Search results show both `bhstudio.co.uk` and `www.bhstudio.co.uk` URLs.
  - This indicates likely host canonicalization/redirect inconsistency or historical indexing leakage.

## 3) Structured Data & Entity SEO

### High
- FAQ schema uses placeholder answer text instead of real answers.
  - This weakens rich-result eligibility and trust.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/app/faq/page.js:288`

### Medium
- Entity schema is fragmented.
  - `LocalBusiness` appears in multiple places with differing richness and no shared stable `@id` across all pages.
  - Add one canonical organization/business graph with consistent `@id`, `sameAs`, contact details, and service area.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/components/WhereWeWork.js:67`
    - `/Users/gino_s/Documents/bhs-2/app/faq/page.js:294`

### Medium
- Author page lacks invalid-param hardening and can fail on unknown slug (`author` assumed present).
  - Risk: soft-500 behavior for crawlers.
  - Evidence:
    - `/Users/gino_s/Documents/bhs-2/app/blog/author/[authorId]/page.js:17`
    - `/Users/gino_s/Documents/bhs-2/app/blog/author/[authorId]/page.js:24`

## 4) Local SEO

### Strong
- Dedicated location landing pages, local keywords, local service schema, and nearby internal links are strong foundations.

### Gaps
- NAP/business identity signals are not strongly surfaced on a dedicated contact/location authority page.
  - No full business address/hours map-style details in core contact UX.
- Structured local signals should include `sameAs` to GBP + key profiles consistently.
- Location pages are template-driven; good structure, but still require periodic unique local proof additions (project refs by area, unique photos, local constraints) to avoid doorway-like similarity over time.

## 5) AI Search Engine Visibility (Google AI Overviews, Perplexity, ChatGPT browsing, etc.)

### Current state
- Positive: you already provide a lot of structured, intent-aligned content and schema in blog/location pages.
- Missing for AI retrievability and citation quality:
  - No `llms.txt` or AI-oriented crawl guidance file.
  - No canonical machine-readable “facts hub” page with stable business facts and citations.
  - Inconsistent entity graph (`@id` + `sameAs`) across templates.
  - Too many pages have generic metadata, reducing snippet/citation precision.

### What to do for AI discoverability
1. Add `llms.txt` and `llms-full.txt` with:
   - Company identity
   - Service coverage
   - Source-of-truth pages
   - Citation policy and update cadence
2. Publish a facts page (`/about/facts` or `/trust`) with:
   - Legal entity
   - Service areas
   - Insurance, guarantee terms, years in business
   - Verifiable review profile links
3. Standardize structured data graph IDs sitewide (`Organization` + `LocalBusiness` + `WebSite` + `WebPage`).
4. Add “last reviewed / updated” and author-editor accountability on key commercial pages.
5. Ensure clean canonicals for all query-parameter entry points.

## 6) Live Visibility Spot Check (Lightweight)
- SERP snapshots indicate indexed URLs on both hosts:
  - [bhstudio.co.uk contact](https://bhstudio.co.uk/contact)
  - [www.bhstudio.co.uk bathroom renovation](https://www.bhstudio.co.uk/bathroom-renovation)
- Additional historical host footprint visible:
  - [better-homes.vercel.app](https://better-homes.vercel.app)
- Interpretation: domain consolidation and canonical enforcement need tightening.

## Prioritized Execution Plan

## Phase 1 (0-7 days): Fastest Ranking/Indexation Gains
1. Fix `ContentRow` links:
   - Remove trailing whitespace from href.
   - Enforce absolute internal paths with leading `/`.
2. Add explicit metadata + canonical to all commercial pages:
   - Home, core services, tools/calculators, contact, portfolio index, FAQ.
3. Add `robots: noindex, follow` for:
   - `/auth/signin`
   - all `*-form-submitted` pages
   - tokenized/document pages not intended for SERP landing.
4. Clean sitemap:
   - Exclude auth/signin, thank-you pages, metadata image files, and other low-value URLs.

## Phase 2 (1-3 weeks): On-Page & Entity Consolidation
1. Standardize title/H1/description strategy per primary keyword intent.
2. Replace duplicate FAQ blocks with page-specific FAQs + unique schema answers.
3. Unify organization/local business schema with stable IDs and `sameAs` links.
4. Improve contact/local trust block with clear NAP and service coverage authority signals.

## Phase 3 (3-8 weeks): Authority & Topical Depth
1. Build service cluster pages by intent stage:
   - Cost, planning, timeline, mistakes, permits, finish levels.
2. Add internal linking rules:
   - Every commercial page links to related service + location + case study + guide.
3. Add location-specific proof assets over time (case snippets, area-specific constraints).

## Phase 4 (8-12 weeks): AI + SERP Optimization
1. Publish `llms.txt` + facts hub.
2. Add comparison content and buyer decision pages with clear sourcing.
3. Build citation-ready tables/checklists (AI systems cite concise structured sections well).

## KPI Targets (Track in GSC/GA/Plausible)
- Indexed pages quality ratio (valuable indexed pages / total indexed pages).
- Duplicate title and duplicate description counts.
- Impressions + avg position for:
  - `service + london`
  - `service + [location]`
  - `calculator` queries.
- Click-through rate on service pages after metadata rewrite.
- Non-brand organic leads from contact forms.

## Immediate Engineering Backlog (Concrete)
1. `P0` Fix service links and path hygiene.
   - `/Users/gino_s/Documents/bhs-2/components/contentRow/ContentRow.js:48`
   - `/Users/gino_s/Documents/bhs-2/config.js:117`
2. `P0` Expand sitemap exclusions + rebuild sitemap.
   - `/Users/gino_s/Documents/bhs-2/next-sitemap.config.js:16`
3. `P0` Add `noindex` metadata to auth/thank-you/token pages.
4. `P1` Add unique metadata + canonical for all high-value pages currently using defaults.
5. `P1` Replace FAQ placeholder schema answers with real text extraction.
   - `/Users/gino_s/Documents/bhs-2/app/faq/page.js:288`
6. `P1` Add host canonicalization redirect policy (`www` -> apex or vice versa) at edge/platform.
7. `P2` Add `llms.txt` and facts hub page.

## Audit Constraints
- Full production build verification was blocked by sandbox DNS restrictions to `fonts.googleapis.com` during `next/font` fetch.
- Live checks were limited to search-index snapshots and code-level inspection.
