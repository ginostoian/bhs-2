# Search performance review and recovery plan: 25 November 2026

Data: GSC export 23 May to 22 November 2026 (6 months), the 28 October export, and live
Search Console comparisons pulled on 25 November (last 4 weeks vs previous 4 weeks;
1 to 9 November vs 14 to 22 November; daily data for the flagship guide), plus the
Page indexing, Links and Manual actions reports.

---

## 1. What actually happened

Traffic didn't drift down. It fell in three steps, and the last one is the big one.

| Period | Clicks per week | Impressions per week | Avg position | What changed |
|---|---|---|---|---|
| August | ~55 to 60 | ~17,000 | 22 to 26 | Old site |
| Mid-September to October | ~35 to 50 | ~10,000 to 11,500 | 16 to 20 | New site design went live on 7 September |
| 1 to 13 November | ~40 | ~12,500 | 18 to 20 | SEO changes, calculators and new guides live from 29 to 30 October |
| 14 to 22 November | **~8** | ~7,500 | **27 to 34** | **Google November 2026 core update** |

**Step 1, September.** After the redesign, impressions fell about 35%, but the average
position *improved*. The site lost low-ranking long-tail impressions (positions 30+), not
its best rankings. Clicks dipped from about 58 to about 42 a week. This is a normal
post-redesign pattern; the content of key pages was largely kept (service pages are
still 1,700 to 2,500 words).

**Step 2, October.** Stable at about 40 clicks a week.

**Step 3, 14 November: the core update.** Google started rolling out its November 2026
core update on 10 November; volatility peaked on Saturday 14 November. That is the exact
day the site fell:

- Daily clicks went from 5 to 9 to about 1. Average position went from 18 to 20 to 27 to 34.
- **124 of 185 search terms lost more than 2 positions. Only 21 gained.**
- No code was deployed after 30 October, there's no manual action, and the site serves
  correctly. This is Google re-scoring the site's quality, not a bug.

The flagship guide took the hardest hit:

| Search term | Position before (1 to 9 Nov) | Position after (14 to 22 Nov) |
|---|---|---|
| house renovation london cost | 1.7 | 49.3 |
| renovation costs london | 2.7 | 50.7 |
| full house renovation cost london | 2.4 | 45.5 |
| house renovation cost london | 2.2 | 37.9 |
| house extensions | 23.3 | 65.6 |
| house extension london | 19.3 | 46.8 |
| rear extension london | 22.3 | 52.5 |
| kitchen renovation london | 23.8 | 45.9 |
| better homes (your brand) | 1.9 | 4.3 |

`/blog/home-renovation-cost-london-2026` went from about 130 impressions a day at
position 8 to about 30 a day at positions 27 to 73, overnight on 14 November. That one
page produced 42% of all clicks in the last six months.

**Seasonality** makes November and December quieter for renovation searches anyway,
but it doesn't explain a one-day cliff.

---

## 2. Every page, ranked

Six-month totals, with the average position over the last 4 weeks (26 Oct to 22 Nov),
which is partly after the update.

### Tier 1: the pages that earn clicks

| Page | Clicks (6 mo) | Impressions | Position (6 mo → last 4 wks) | Verdict |
|---|---|---|---|---|
| /blog/home-renovation-cost-london-2026 | 521 | 80,023 | 8.4 → 11.4 (40+ since 14 Nov) | Was the engine of the site. Demoted by the update. Priority 1 to rebuild. |
| / (homepage) | 174 | 9,356 | 12.2 → 12.4 | Mostly brand searches. Holding. |
| /blog/bespoke-vs-howdens-vs-ikea-kitchen-london | 159 | 21,938 | 7.1 → 6.9 | **Survived the update.** Specific, comparative, real numbers. This is the model. |
| /blog/kitchen-providers-comparison-guide | 120 | 36,166 | 18.9 → 18.0 | Impressions growing, but mostly long AI-search questions ("how do Wickes kitchens compare to Magnet...") that rarely click. |

### Tier 2: page two, could move up

| Page | Clicks | Impressions | Position | Verdict |
|---|---|---|---|---|
| /blog/house-extension-value-london-guide | 48 | 13,605 | 12.9 → 14.4 | Slipping. Value questions have an AI answer on top; needs a sharper answer and real data. |
| /blog/loft-conversions-london-complete-guide-2026 | 37 | 6,904 | 12.5 → 14.9 | Slipping, and now overlaps the new loft cost guide. |
| /blog/planning-permission-refused-london | 20 | 4,160 | 15.5 → 21.6 | Slipping. |
| /blog/how-to-finance-house-extension-renovation-london-2026 | 12 | 6,500 | 15.3 → 14.9 | Stable. |
| /blog/kitchen-renovation-full-guide-2025 | 13 | 8,832 | 14.2 → 18.6 | Slipped after the 2026 refresh. Overlaps the kitchen comparison pages. |
| /blog/house-extension-mistakes-london | 11 | 871 | 13.1 → 15.3 | Small, decent CTR. |

### Tier 3: lots of impressions, almost no clicks (calculators)

| Page | Clicks | Impressions | Position | Verdict |
|---|---|---|---|---|
| /renovation-calculator | 17 | 32,738 | 28.0 → 25.9 | **Improved after the rebuild** (42 → 26 in October vs November). |
| /extension-calculator | 2 | 23,526 | 41.9 → 27.2 | **Improved a lot** (65 → 27). |
| /tools/bathroom-cost-calculator | 13 | 16,899 | 21.3 → 11.3 | **Improved** (19 → 11). Closest calculator to page one. |
| /kitchen-calculator | 0 | 6,337 | 42 → 30 | Improving. |
| /btu-calculator | 2 | 4,989 | 48 → 36 | Low value. |

Many calculator impressions are US searches ("remodel cost estimator", "condo remodel
calculator"). They look good in totals but will never become London clients.

### Tier 4: big topics, poor positions

| Page | Clicks | Impressions | Position | Verdict |
|---|---|---|---|---|
| /blog/house-extension-types | 6 | 37,983 | 34.1 → 34.4 | Huge demand ("house extensions", 10,800 impressions alone), never cracked page 3. |
| /blog/house-extension-guide-2025 | 15 | 17,764 | 28.3 → 24.4 | Competes with the page above and with /house-extension for the same searches. |
| /blog/bathroom-renovation-cost-2025 | 1 | 4,519 | 29 → 38.6 | Fell after the update. |

### Tier 5: the money pages, invisible

| Page | Clicks | Impressions | Position (last 4 wks) |
|---|---|---|---|
| /house-extension | 2 | 971 | 56.3 |
| /loft-conversion | 0 | 393 | 44.2 (12 impressions in 4 weeks) |
| /bathroom-renovation | 5 | 3,185 | 53.7 (was 19.8) |
| /kitchen-renovation | 2 | 996 | 28.6 |
| /general-renovation | 7 | 784 | 15.2 |
| /basement-conversion | 0 | 258 | 69.7 |

The pages that sell your services don't appear for the searches that bring work.

### Tier 6: location pages

40 area pages produced about 22 clicks in six months. In the last four weeks most had
**zero impressions** (Kensington went from 322 to 0). They're templated: two random area
pages are about 70% identical once the area name is removed. Google treats this
pattern as doorway pages, and core updates punish it.

### Tier 7: the new guides (published 29 to 30 October)

| Page | Position | Note |
|---|---|---|
| /blog/loft-conversion-cost-london | 31.4 | Indexed, too early to judge |
| /blog/side-return-extension-cost-london | 34.9 | Indexed, too early to judge |
| /prices | 30.7 | Indexed, too early to judge |
| /blog/kitchen-extension-cost-london | none | **Google hasn't crawled it yet** |

---

## 3. Why we're not higher

Ranked by how much each one is holding the site back.

### 1. Almost no independent authority
Search Console shows 288 links, but:
- **131 come from `bhs-2.vercel.app`**, a full public copy of your own site on Vercel.
- **116 come from one directory**, thomsonlocal.com.
- What's left is about 30 small sites, mostly directories, each linking once.

For "house extension london", Google's page one is Checkatrade, FMB, MyBuilder, Houzz
and Bark. For cost guides it's Checkatrade, FMB, Homebuilding & Renovating and
established builders. Every one of them has thousands of referring sites. A builder's
website with about 20 real referring sites can't hold page one for commercial terms on
content alone. That's why even good pages sit at positions 10 to 30, and why a core
update could knock them off so easily.

**Crawling confirms it.** Google hasn't crawled the kitchen extension guide (26 days
old), the single-storey extension cost guide or the loft planning guide at all. Google
spends little crawl effort on sites it doesn't consider important.

### 2. Site-wide quality signals the core update dislikes
Core updates score the whole site, then rank pages within that score. We send several
weak signals at once:

- **40 near-duplicate location pages** (doorway pattern).
- **Hedged, invented-feeling examples.** The flagship guide calls its worked examples
  "illustrative" nine times and says they are "planning examples rather than
  completed-project costs". The update rewards first-hand experience; this reads as the
  opposite.
- **Very long guides on overlapping topics.** Three 4,000 to 8,000-word extension guides
  plus a service page, two loft guides plus a service page, three kitchen guides. Lots
  of words, little that only Better Homes could have written.
- **Pages Google already declined:** "loft conversion vs house extension" and the
  permitted development guide are crawled but not indexed. A low-value "Best of Houzz
  2023" post and empty category pages are also in the queue.

The bespoke vs Howdens vs IKEA article came through the update unharmed. It's specific,
comparative and grounded in real prices. That's the standard every page needs to meet.

### 3. Several of our pages compete for the same searches
For "house extensions" we have /house-extension (position 56),
/blog/house-extension-guide-2025 (24), /blog/house-extension-types (34),
/blog/house-extension-value-london-guide and three cost guides. Google splits its
signals between them and ranks none well. The same is true, to a lesser degree, for
lofts and kitchens.

### 4. The service pages have no proof
They're well written now, but they carry no hard evidence: no real project with a real
price, area and duration, few named reviews, no FMB or TrustMark membership, and almost
no external links pointing at them (except /loft-conversion with 32 links, which still
sits at position 44). For "builder" searches, Google trusts directories with thousands
of reviews over a firm's own claims.

### 5. A weak brand
You're at position 4.3 for "better homes" because the name is generic (Better Homes &
Gardens, Better Homes estate agents). You only win clearly on "better homes london" and
"better homes studio". Without a strong Google Business Profile, reviews volume and
mentions, Google doesn't see a clear brand behind the site.

### 6. Vanity impressions
About 18,000 impressions are from the US, and a large share of the UK impressions are
long AI-search questions about Wickes, Magnet and B&Q kitchens. They inflate totals,
drag CTR to 0.3% and will never bring a client. Judge progress on London commercial
terms, not total impressions.

---

## 4. Copy changes

### Home renovation cost guide (the priority)
`/blog/home-renovation-cost-london-2026`

- **Replace the three "illustrative" examples with real completed projects.** Use the
  area, postcode district, scope, floor area, final cost band, weeks on site and a
  photo. Even three real jobs beat ten hypothetical ones. If a job can't be named, say
  "a Victorian terrace in E8 we finished in March 2026", not "an illustrative example".
- **Delete the hedging.** One sentence on scope and VAT near the top is enough. Remove
  the repeated "illustrative", "planning assumptions" and "not a valuation" lines.
- **Cut from about 6,800 to about 3,500 words.** Keep: the short answer, cost per m²
  table, room-by-room, hidden costs, three real projects, FAQ. Move "renovate or move"
  and "borough costs" to their own pages or cut them.
- **Lead with a sourced data table.** Your price book next to Checkatrade, Homebuilding
  & Renovating and BCIS, as on /prices. That's what survived on the IKEA vs Howdens page.
- **Make the byline real.** "Gino S., founder, 12 years running London renovations.
  Reviewed against 2026 project costs." Add a photo of Gino on site.
- Keep the URL. Update `dateModified` only when the content genuinely changes.

### Service pages
`/house-extension`, `/loft-conversion`, `/kitchen-renovation`, `/bathroom-renovation`,
`/general-renovation`, `/basement-conversion`

- **Open with the answer people search for.** For example: "House extension builders
  in London. Most of our rear extensions cost £72,000 to £136,000 all-in and take 8 to
  14 weeks on site." Price, timing and area in the first two lines.
- **Add three real projects per service**, each with area, cost band, duration, photo
  and the client's review in their own words (from Houzz or Google, verbatim).
- **Add proof blocks:** guarantee terms, insurance (up to £10 million), Houzz rating
  and count, and FMB and TrustMark membership once you have them.
- **Make the decorative second line of each H1 a subtitle,** so the H1 is only the
  search phrase.
- **Add a "Prices" section** linking to /prices and the matching calculator.
- **Answer the five questions people ask** for that service, in one or two sentences
  each, with numbers.

### Location pages
- **Keep 8 real area pages:** Walthamstow, Leytonstone, Leyton, Woodford/South Woodford,
  Chingford, Hackney, Stoke Newington/Dalston, Islington. Each gets real projects in
  that area, local housing stock and planning notes (borough, conservation areas,
  Article 4), and reviews from clients there.
- **For the other 32:** `noindex` them now, or redirect each to the nearest kept area page
  or to /locations. Bring one back only when there's a real project to show.

### Consolidation
- **Extension guides:** merge `/blog/house-extension-guide-2025` into
  `/blog/house-extension-types` with a 301 redirect. One strong guide to extension types
  and costs, linking to the cost guides and to /house-extension.
- **Planning guides:** merge `/blog/permitted-development-guide` into the loft planning
  guide and a future rear-extension planning guide, with a redirect.
- **Comparison page:** rework `/blog/loft-conversion-vs-house-extension-london` with real
  numbers, or merge it into /prices.
- **Housekeeping:** `noindex` blog category pages and the "Best of Houzz 2023" post.
- **Cost sections:** cut the cost section of the loft complete guide to a summary that
  links to the loft cost guide (the week-4 item from the content plan).

---

## 5. Plan to recover, then dominate

**When to expect results.** Core update losses are usually re-assessed at the next core
update, typically 2 to 4 months later. Work done in the next 6 to 8 weeks is what
Google will judge then. Expect partial recovery in February to March 2027, not before.
Small gains can show sooner, but not the full recovery.

### Phase 1: weeks 1 to 2, fix and prune
| Action | Who |
|---|---|
| Redirect `bhs-2.vercel.app` to bhstudio.co.uk (Vercel → Project → Domains → redirect) | You |
| Remove the `/prices` image files from the sitemap | Claude |
| `noindex` or redirect 32 location pages; keep 8 | Claude (you approve the 8) |
| Merge and redirect the overlapping guides (section 4) | Claude |
| `noindex` category pages and the Houzz 2023 post | Claude |
| Request indexing for the kitchen extension, single-storey and loft planning guides | You (Search Console) |

### Phase 2: weeks 1 to 4, rebuild the pages that matter with real proof
| Action | Who |
|---|---|
| Send 10 to 15 real completed projects: area, scope, m², cost band, weeks, photos, the client's review | **You** (this unlocks everything else) |
| Rewrite the home renovation cost guide around those projects (section 4) | Claude |
| Rewrite the six service pages with real projects, prices and proof | Claude |
| Turn each project into a portfolio page with cost and duration: "Side return in Forest Gate, E7: £68,000, 11 weeks" | Claude |
| Rebuild the 8 area pages around local projects | Claude |

### Phase 3: weeks 2 to 12, authority (the biggest lever)
Target: **+40 real referring sites in 12 weeks.**
| Action | Links |
|---|---|
| Join the FMB (Master Builder), TrustMark, Checkatrade, MyBuilder (upgrade) and Houzz pro. These rank on page one themselves and link to you | 5 to 8 |
| Google Business Profile: correct categories, services with prices, 50+ project photos, weekly posts, Q&A | Map pack |
| Reviews: ask every client from the last 2 years for a Google review. Target +30 by February | Map pack and brand |
| Suppliers and partners: ask kitchen, glazing, steel and architect partners to list you with a project credit | 8 to 12 |
| Digital PR with /prices: "London Renovation Cost Index 2026", pitched to London property and local news, plus journalist request services | 6 to 12 |
| Local: estate agent guides, residents' associations, school and club sponsorship in E17, E11, E18 | 5 to 8 |
| Guest articles for architects and estate agents ("what a loft really costs in Walthamstow") | 3 to 5 |

### Phase 4: weeks 4 to 12, content, fewer but better
- **Pause the two-a-week calendar.** One piece a week at most, and only if it carries
  first-hand material: a real project, real prices, photos, or data nobody else has.
- **Priority topics:** real project cost write-ups (one per service), "rear extension
  planning permission in London" (merging the permitted development guide), and
  borough planning guides for Waltham Forest, Redbridge and Hackney.
- **Every piece:** about 2,000 to 3,000 words, a named author, a real project, a sourced
  table, links to the service page and calculator.

### What not to do
- Don't buy links or use link schemes. The site's thin profile makes it easy to penalise.
- Don't rewrite every page at once or change more URLs than the consolidation above.
- Don't publish more long, generic articles to "win back" traffic. That's what the
  update penalised.
- Don't judge progress on total impressions. Track London commercial terms.

---

## 6. How we'll measure it

| Metric | Now (14 to 22 Nov) | 12-week target (late Feb 2027) |
|---|---|---|
| Clicks per week | ~8 | 60+ (above the September level) |
| "house renovation cost london" position | 38 to 50 | Top 10 |
| /house-extension position | 56 | Under 25 |
| Real referring sites | ~30 (mostly directories) | 70+ |
| Google reviews | (check) | +30 |
| Location pages indexed | 40 thin | 8 strong |
| Enquiries from organic search | (check in CRM) | Track monthly |

Review weekly in Search Console. Filter to UK and compare against these terms: house
extension london, loft conversion london, house renovation cost london, kitchen
extension cost london, plus the area terms "builders [area]".
