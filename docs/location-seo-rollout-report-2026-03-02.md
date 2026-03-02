# Location SEO Rollout Report
Date: March 2, 2026

## Objective
Create dedicated server-side rendered location pages for London service areas, strengthen local SEO signals, and replace generic location links in the global "Where We Work" section with direct links to each location page.

## Completed Work

### 1. Centralized location data and slug system
- Added canonical location dataset:
  - `libs/london-locations.json`
- Added shared location utilities:
  - `libs/locations.js`
- Implemented:
  - Deterministic slug generation for each location.
  - Location lookup by slug.
  - Grouping by area for reusable UI rendering.
  - Nearby-location helper for internal linking.
  - Area-context copy helper for location-specific narrative.

### 2. New SSR location detail pages
- Added dynamic route:
  - `app/locations/[slug]/page.js`
  - `app/locations/[slug]/page.module.css`
- Route is explicitly server-rendered on demand:
  - `export const dynamic = "force-dynamic";`
- Implemented location-specific page template with:
  - Trust-focused hero copy.
  - Service emphasis on:
    - House extensions
    - Loft conversions
    - Full home renovations
  - Supporting services and process explanation.
  - FAQ section customized per location name.
  - Strong CTAs to:
    - Contact page with `location` query param
    - Portfolio
  - Nearby location internal links to reinforce local relevance.

### 3. New location index page
- Added:
  - `app/locations/page.js`
  - `app/locations/page.module.css`
- Provides discoverable hub page listing all service locations grouped by area.
- Improves crawl path and internal linking structure.

### 4. Updated global "Where We Work" section links
- Updated:
  - `components/WhereWeWork.js`
- Replaced all location links from:
  - `/contact?location=...`
- To:
  - `/locations/[slug]`
- Added `id="where-we-work"` anchor and switched to shared location data source.

### 5. Structured data enhancements
- **Global area section schema** (`components/WhereWeWork.js`):
  - Upgraded `areaServed` entries to include dedicated location page URLs.
- **Per-location page schema** (`app/locations/[slug]/page.js`):
  - `HomeAndConstructionBusiness` / `GeneralContractor` / `LocalBusiness`
  - Service entities for:
    - House extensions
    - Loft conversions
    - Full home renovations
  - `FAQPage`
  - `BreadcrumbList`
  - `WebPage`
- This gives each location page strong local-intent and service-intent schema coverage.

### 6. Metadata and local SEO targeting
- Added per-location metadata generation with:
  - Location-specific title and description.
  - Canonical URL per location page.
  - Open Graph URL/title/description.
  - Local service-focused keyword set.
- Added `/locations` index metadata optimized for London local-service discovery.

### 7. Sitemap integration for all location pages
- Updated:
  - `next-sitemap.config.js`
- Added `additionalPaths` generation for all location routes from shared location dataset.
- Built and generated updated sitemap including location URLs:
  - `public/sitemap-0.xml`

## Verification and Validation

### Lint
- Command run: `npm run lint`
- Result: Passed for new changes.
- Existing project warnings remain (pre-existing hook dependency and image warnings in unrelated files).

### Build
- Command run: `npm run build`
- Result: Successful production build and successful `next-sitemap` generation.
- New route status confirmed in build output:
  - `/locations` (static page)
  - `/locations/[slug]` (dynamic SSR route)
- Location URLs verified present in generated sitemap.

## SEO/Conversion Impact Summary
- Dedicated URLs for each London location improve:
  - Local intent matching
  - Relevance signals for area + service combinations
  - Crawl depth and internal linking quality
- Rich schema per location improves eligibility for stronger SERP understanding.
- Trust-first copy and clear process framing improve conversion quality for higher-value homeowner leads.
- Contact CTA retains location context via query parameter, supporting sales workflow continuity.

## Social Proof Enhancement (Added After Initial Rollout)

### What was added
- Enhanced each location page with a dedicated social proof section:
  - Proof-point cards focused on trust and risk reduction.
  - Rotating client testimonial cards sourced from existing review/testimonial content.
  - Source links to review references (Houzz and on-site testimonial section).

### Why this matters
- Strengthens conversion intent for high-consideration homeowners.
- Reinforces credibility near service descriptions and CTAs.
- Adds local relevance through trustworthy evidence before enquiry.

### Technical implementation
- Updated:
  - `app/locations/[slug]/page.js`
  - `app/locations/[slug]/page.module.css`
- Added testimonial selection logic:
  - Stable per-location rotation (based on slug hash) so pages are differentiated while remaining deterministic.
- Expanded local schema:
  - Injected `Review` objects in the location page business schema graph using selected social proof testimonials.

## Rendering Strategy Update (SEO Optimization)

- Updated location pages from request-time SSR to static generation with prebuilt params.
- Implemented in `app/locations/[slug]/page.js`:
  - `generateStaticParams()` for all London location slugs.
  - `dynamicParams = false` for strict known-route generation.
  - `revalidate = 86400` for daily ISR refresh.
- Outcome:
  - Faster first crawl/render response for Googlebot.
  - Stable HTML output per location URL.
  - Continued indexability with canonical tags and sitemap inclusion.

## Files Added
- `libs/london-locations.json`
- `libs/locations.js`
- `app/locations/page.js`
- `app/locations/page.module.css`
- `app/locations/[slug]/page.js`
- `app/locations/[slug]/page.module.css`
- `docs/location-seo-rollout-report-2026-03-02.md`

## Files Updated
- `components/WhereWeWork.js`
- `next-sitemap.config.js`
- `public/sitemap-0.xml`
- `app/locations/[slug]/page.js`
- `app/locations/[slug]/page.module.css`
