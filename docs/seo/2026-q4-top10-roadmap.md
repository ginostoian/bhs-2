# 3-month roadmap to page 1: Better Homes (Nov 2026 – Jan 2027)

## Where we start (GSC, 27 Jul – 26 Oct 2026)

- 661 clicks, 186.7k impressions, CTR 0.35%, average position ~22
- Clicks fell ~35% after the September redesign (≈60/week → ≈40/week)
- #1 for "house renovation cost london", #8 for "kitchen renovation london"; **no page-1 ranking for any core commercial service query**
- Service pages at positions 38–56, location pages 20–60, calculators 22–42
- About 50 backlinks against competitors with years of press and directory links

## What "top 10 in 3 months" realistically means

Head terms like **"house extensions london"** and **"loft conversion london"** are held by specialist brands with 10–20 years of links (Simply, Plus Rooms, Beams) plus directories. Getting into the top 10 for those in 90 days from position ~40–50 isn't realistic with ~£300 of link budget, and anyone promising it is guessing. What **is** realistic, and what drives enquiries:

| Tier | Example queries | 3-month target |
|---|---|---|
| **1. Cost and decision queries** | loft conversion cost london, side return extension cost, 3 bed house renovation cost, bathroom renovation cost london, kitchen renovation cost london | **Top 10** (several top 5) |
| **2. Service + area** | loft conversion leytonstone, house extension walthamstow, builders woodford, kitchen extension e17 | **Top 10 organic + map pack** in core areas |
| **3. Service head terms** | house extension builders london, loft conversion london, full house renovation london | **Top 20**, moving toward the top 10 by month 6 |
| **4. Calculators** | renovation cost calculator london, bathroom cost calculator, extension cost calculator | **Top 10** |

**Traffic target:** 2.5–3× clicks (≈100–120 a week by end of January vs ≈40 now), with enquiries tracked in the organic report.

---

## The five levers (in order of impact)

1. **Ship what's on `seo/phase-2`.** Keyword H1s and H2s, single H1s, CTR-focused titles and descriptions, trust facts, schema. Nothing helps until it's live.
2. **Authority:** 50 links ([link plan](2026-q4-link-building-plan.md)) + Google reviews.
3. **Content:** 8 single-intent articles a month ([content plan](2026-11-content-plan.md)) + refreshes of pages already on page 1–2.
4. **Local:** GBP optimisation, reviews, 6–8 real area pages.
5. **Conversion:** proof and offer above the fold, so the extra traffic turns into enquiries.

---

## Month 1: November (foundation + quick wins)

### Week 1
- [ ] **Review and deploy `seo/phase-2`** (merge to main → production). Then in Search Console: inspect and request indexing for the homepage, the 6 service pages and the top 5 articles. Resubmit the sitemap. Add a launch annotation.
- [ ] Export Search Console links to `docs/seo/backlinks-2026-10.csv` (baseline).
- [ ] **GBP overhaul:** categories, services with price ranges, 30+ geotagged project photos, Q&A seeded with real FAQs, weekly posts from now on, booking link with UTM.
- [ ] **Review engine:** at every handover (and to the last 12 months of finished clients), send a personal request with a direct Google review link. Target: **+25 Google reviews by end of January**. Never incentivise, script the praise or filter out unhappy clients.
- [ ] Publish articles 1 and 2. Refresh the kitchen cost guide (2025 → 2026; it already ranks #8).

### Week 2
- [ ] **Hero proof on service pages:** under each hero, add 2–3 short named reviews with the area ("Sarah, Leytonstone") from Houzz or Google, plus "12+ years · 5.0 on Houzz and Google · up to 10-year guarantee". Competitors all do this, and it lifts CTR from the SERP indirectly and conversion directly.
- [ ] **Calculator titles and copy** (SEO-21): add "London 2026" and a price hint to titles. Make sure each calculator page has a server-rendered explainer, sample result and FAQ. **Fix the bathroom calculator's pricing**: £5,000 × 1.1 for a small bathroom is well below London reality and costs trust.
- [ ] 15 citations live (link plan A).
- [ ] Publish articles 3 and 4.

### Week 3
- [ ] **Article conversion path** (SEO-08): after the opening answer of the top 3 articles, add an in-flow CTA ("Planning your own? Estimate your renovation" → calculator; "Discuss your project" → contact). Mobile users currently scroll ~6,000px to reach the first action.
- [ ] **Author E-E-A-T** (SEO-18): rewrite the Gino author profile around construction experience (12+ years, hundreds of London projects, what he does on each job), add a real photo, and link representative projects.
- [ ] Ask the first 5 suppliers and architects for project credits (link plan B).
- [ ] Publish articles 5 and 6. Tighten the house-extension-types article.

### Week 4
- [ ] **Portfolio pages as ranking assets** (SEO-12): retitle each project "[Project type] in [Area], [Postcode]", e.g. "Side-return kitchen extension in Forest Gate, E7". Add scope, duration, challenges/solutions and the review if there is one. Abbey Extensions and S&M Solutions rank on page 1 with exactly this.
- [ ] Pull CRM pricing data for the Cost Index (link plan D2).
- [ ] Publish articles 7 and 8. Cut the cost section from the loft mega-guide down to a summary that links to article 1.
- **End of month check:** GSC clicks/week, position for the 8 new targets, link count (target 20), review count.

---

## Month 2: December (local + authority push)

- [ ] **Rebuild 6–8 core area pages** (SEO-15/16): Leytonstone, Walthamstow, Woodford/South Woodford, Wanstead, Hackney, Stoke Newington, Loughton, Islington. Each needs:
  - An H1 like "Builders in Leytonstone: Extensions, Lofts & Renovations"
  - 1–3 **real projects nearby** with photos
  - Local housing stock (Victorian terraces, conservation areas) and planning notes (Waltham Forest / Redbridge / Hackney Article 4 and conservation areas)
  - Reviews **from that area**, and nearby areas you actually work in
  - Unique FAQs
  - Leave the other 30+ location pages as they are for now, and review them after the core pages show results. Don't mass-delete them.
- [ ] **Publish the London Renovation Cost Index** and pitch it to 20 journalists (link plan D2).
- [ ] **`/prices` hub:** one page with typical London costs for every service (inc VAT), linking to each cost guide and calculator. It mirrors Beams' `/our-prices`, which ranks.
- [ ] Publish 8 December articles (backlog in the content plan).
- [ ] Estate-agent guest articles (2) and the local sponsorship (link plan C).
- [ ] **Technical:** check Core Web Vitals field data in GSC (CrUX) now that traffic is higher. Fix any page with poor LCP or CLS (SEO-22). Verify all section anchors still work (`scripts/seo/check-fragments.py`).
- **End of month check:** target 35 links, +15 reviews, 2–3 cost articles on page 1.

---

## Month 3: January (scale what works)

- [ ] **Double down on winners:** any article at positions 8–20 gets an update (new FAQ from GSC queries, better title, 2 more internal links, a project example).
- [ ] **CTR test round 2** (SEO-14): for pages at position ≤10 with CTR < 2%, rewrite title and description. Record before and after in a metadata change log.
- [ ] **Downloadable guide** ("The London Extension Planner, 2027 edition", a PDF lead magnet) linked from the extension service page and articles, as Simply Extend does. It's also a reason for other sites to link.
- [ ] January PR angle (link plan D3) + journalist requests.
- [ ] Publish 8 January articles.
- [ ] **Quarter review:** compare GSC Oct vs Jan (clicks, impressions, positions by tier), enquiries by landing page, link count, reviews. Set the Q1 plan.

---

## Ongoing weekly habits (owner: you or a marketing assistant, ~5–6 h/week)

| Habit | Time |
|---|---|
| 2 articles published + distributed | 2–3 h (with Claude drafting) |
| Link outreach and journalist requests | 2 h |
| 1 GBP post + reply to every review | 20 min |
| Review requests at every handover | 10 min each |
| Glance at GSC for new queries and drops | 15 min |

## KPIs

| KPI | Now | End Nov | End Dec | End Jan |
|---|---|---|---|---|
| Organic clicks / week | ~40 | 55 | 80 | 100–120 |
| Non-brand clicks share | ~50% | 55% | 60% | 65% |
| Queries in top 10 (GSC) | ~190 | 230 | 300 | 380 |
| Service pages average position | 38–56 | 30–40 | 20–30 | 12–20 |
| Referring links | ~50 | 70 | 85 | 100 |
| Google reviews | (current) | +10 | +18 | +25 |
| Organic enquiries / month | measure | baseline | +30% | +60% |

## What I need from you

1. **Review and merge `seo/phase-2`**, then deploy (I haven't pushed or deployed anything).
2. **Real proof for hero sections and case studies:** 2–3 named reviews per service with area, and permission for project details (area, scope, timeline).
3. **CRM pricing pull:** say yes and I'll aggregate the quote data from the admin dashboard into the cost table (no client names).
4. **Ahrefs:** authorise the connector via `/mcp` in an interactive Claude terminal if you want competitor backlink gap lists.
5. **Search Console links export** for the backlink baseline.
6. **Budget call on FMB membership.** It's the most valuable single trade listing, but it's above the £100/month budget.

## What's already done on branch `seo/phase-2` (not yet live)

- One H1 per page across all articles (14 had two) and the bathroom calculator (had three)
- Service pages, homepage and extension page: H1 now leads with the search phrase ("House extension builders in London", "Loft conversion specialists in London", etc.), and the visual design is unchanged
- Service page H2s now match what people search ("How much does a loft conversion cost in London?", "Types of house extension we build in London", "What your quote includes", "[Service] FAQs")
- New titles and descriptions for the homepage and 6 service pages, written for CTR with real proof (12+ years, hundreds of homes, 5-star, up to 10-year guarantee)
- Trust strip and mobile trust line show "12+ years" and "Hundreds of London homes" (you confirmed both)
- Organization and LocalBusiness schema: logo, description, Best of Houzz 2023 award, `knowsAbout`, corrected Houzz profile link
- Contextual links from extension articles to /house-extension and the extension calculator (fixes the cannibalisation where the blog outranks the service page)
- Leftover template copy on the bathroom calculator replaced ("Our values are aligned with you!", "Do not fret. We got you covered!")
