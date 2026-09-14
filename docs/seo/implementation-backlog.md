# Better Homes SEO implementation backlog

Prepared 13 September 2026. Scope: a sequence of implementation briefs, not completed website changes. Source checkout remains at redesign commit b39b0df with a clean working tree. Code findings below were selectively rechecked. Search and crawl measurements are from the 8 September audit; they are not new measurements of today's production site.

## How to use this backlog

Work through one numbered ticket at a time. Every ticket has a problem, evidence, implementation steps, a premium presentation direction and an acceptance check. Status starts as **Not started**. Use **In progress**, **Needs business evidence**, **Verified locally**, and **Verified in production** as subsequent states. A committed or deployed change is not automatically a verified outcome.

For a future implementation request: “Implement SEO-06 from this backlog. Preserve the approved design. Complete its acceptance checks, report the files changed and evidence of verification, and stop before starting another ticket.” Deployment is a separate task unless requested. Take before/after screenshots only for affected visual surfaces, and retain the comparison with the ticket.

The suggested order balances measurement, launch protection and later growth. SEO-01 to SEO-08 address the first protection and acquisition issues. SEO-09 onward strengthens relevance and trust. Use SEO-26's launch gates before publishing, even if optional growth work remains.

Effort estimates below are planning estimates for implementation and focused verification, excluding waiting for business evidence, external services and Google recrawling. They are not quotations.

## Baseline that determines the order

Period: 7 June–6 September 2026, Google Web search, all countries/devices.

| Measure | Baseline |
|---|---:|
| Property-level clicks | 680 |
| Property-level impressions | 211,764 |
| CTR | 0.321% |
| UK clicks | 628, 92.4% |
| Mobile clicks | 363, 53.4% |
| Blog page clicks | 551 of 683 page-level clicks, 80.7% |
| Six commercial service paths, including reported host variants | 10 clicks |
| Location paths | 10 clicks / 20,547 impressions |
| Calculator paths | 16 clicks / 47,259 impressions |

| Landing page | Clicks | Impressions | Export CTR | Average position |
|---|---:|---:|---:|---:|
| /blog/home-renovation-cost-london-2026 | 336 | 49,245 | 0.68% | 8.81 |
| / | 86 | 5,047 | 1.70% | 13.43 |
| /blog/kitchen-providers-comparison-guide | 65 | 20,228 | 0.32% | 18.81 |
| /blog/bespoke-vs-howdens-vs-ikea-kitchen-london | 53 | 6,645 | 0.80% | 7.34 |
| /blog/house-extension-value-london-guide | 25 | 6,743 | 0.37% | 14.31 |
| /blog/loft-conversions-london-complete-guide-2026 | 20 | 4,049 | 0.49% | 13.96 |

Page totals and property totals use different aggregation. The query export has 1,000 rows but only 69 clicks; do not infer a complete branded/non-branded split, join separate page/query exports, or treat all zero-click queries as failed qualified demand. No conversion rate, GBP owner performance, backlink inventory or real-user CWV baseline was supplied. These are evidence gaps, not measured failures.

## Design rules for every ticket

Preserve the existing wordmark, restrained palette, three-zone navigation, generous spacing and editorial photography. Add depth through well-labelled sections, compact tables, accessible disclosures and links placed where they answer the reader's next question. Keep core answers visible; disclosures are for supporting depth, not an excuse to conceal the entire proposition.

Use one strong next step per section, with a quieter alternative where useful. Avoid repeated banners, artificial scarcity, giant review badges, keyword-stuffed area lists and intrusive pop-ups. Price transparency can be premium when scope, assumptions and options are clear. Do not label clients by household income; qualify projects through scope, investment, stage, location and delivery fit. Show a consistent quality of service across project sizes. Use verified different project scopes to demonstrate the breadth of investment levels without inventing three price tiers.

When a user-facing numerical claim is unverified, obtain the evidence or write an accurate non-numerical statement. Do not replace missing facts with confident placeholders. Maintain useful URLs and established search intent throughout.

---

## SEO-01 — Create the protected-page baseline

**Status:** Not started. **Priority:** Foundation, before changes. **Effort:** 2–4 hours.

**What is wrong / evidence:** One article brings 336 clicks; the three leading articles contribute 454 of 683 page-level clicks. A broad rewrite risks changing the assets that currently work. All 100 live sitemap paths survived the original comparison, but that alone does not protect content, images or links.

**How to fix:** Save an immutable baseline of every current sitemap URL plus historical URLs from GSC and any backlink export. Record status, final URL, canonical, robots directives, title, description, H1, important section IDs, main content, image URLs and internal links. Mark the six high-traffic entry points in the table above as protected. Give each a one-sentence intent, such as “understand London full-renovation costs before commissioning work.” Record the current deployment/commit and retain a working rollback version. Compare every subsequent affected page against this baseline; classify removals as corrected inaccuracies, deliberate consolidation or accidental loss.

**Premium treatment:** Invisible infrastructure. It protects the freedom to improve presentation without accidentally rewriting the acquisition strategy.

**Done when:** The protected pages have retrievable before versions and explicit preservation criteria. Any removed URL has an individually justified response/redirect; meaningful sections remain unless deliberately corrected. Do not forbid correction of inaccurate claims.

## SEO-02 — Verify successful enquiry and booking events

**Status:** Not started. **Priority:** Launch measurement. **Effort:** 0.5–1.5 days, depending on GTM/booking access. **Depends on:** SEO-01.

**What is wrong / evidence:** GTM/Plausible are loaded, but EnquiryForm has no explicit success event. Existing GTM rules may cover it; their configuration is unknown. Form clicks and visits to a thank-you URL are not necessarily genuine leads.

**How to fix:** Inspect the current event configuration first. Define one event owner for each action to avoid duplicating automatic GTM tracking. Track enquiry_start once per attempt, enquiry_submit_success only after a real accepted enquiry is persisted, and enquiry_error on failure. Preserve a random submission event ID across retries; deduplicate successful repeats. Do not count honeypot/anti-spam synthetic responses as real leads. Track booking_click separately from booking_confirmed; verify the latter through the booking provider's supported confirmation mechanism, with duplicate delivery handling. Track phone_click as intent, not a completed call. Use separate test data/credentials or suppressed notifications for validation.

**Implementation:** [EnquiryForm.jsx](/Users/gino_s/Documents/bhs-2/components/brand/EnquiryForm.jsx), [contact API](/Users/gino_s/Documents/bhs-2/app/api/contact/route.js), [CookieConsent.js](/Users/gino_s/Documents/bhs-2/components/CookieConsent.js), and existing GTM/Cal.com configuration.

**Premium treatment:** No new visual clutter. Keep the clear success message and response expectation.

**Done when:** A controlled successful enquiry counts once; invalid, failed and spam submissions do not count; reload does not duplicate; a booking click without confirmation is not a booked call. Record consent-state behaviour and actual destinations receiving events.

## SEO-03 — Attribute qualified leads and revenue to organic entry pages

**Status:** Not started. **Priority:** Measurement foundation. **Effort:** 1–2 days. **Depends on:** SEO-02.

**What is wrong / evidence:** GSC measures clicks, not qualification or revenue. The form carries a partner referral code but its payload does not show organic landing-page attribution. Optimising only the 0.32% sitewide CTR could reward irrelevant traffic.

**How to fix:** Document existing CRM source handling before adding fields. Preserve partner referral attribution separately from marketing attribution. Capture consent-respecting first landing pathname, last meaningful acquisition source/medium, allowlisted campaign fields and timestamp; do not overwrite a known acquisition source with a later internal/direct visit. Strip sensitive URL parameters and never send email, telephone, full address, free-text brief or raw referrer query strings to analytics. Store service, stage and budget as structured CRM fields as well as readable enquiry context. Use a stable internal lead relationship to progress through qualified, consultation, quote and won stages. Keep direct/unknown traffic explicitly unknown; never force it into organic.

**Implementation:** [Contact model](/Users/gino_s/Documents/bhs-2/models/Contact.js), contact API, enquiry form and the relevant CRM/reporting code after inspecting its current contracts.

**Premium treatment:** Retain optional qualification fields and “not sure yet”. Prepopulate valid service selections from the originating page; confirm the extension route's label mapping as well as loft/renovation routes. Do not demand household income.

**Done when:** A test organic journey can be traced to an accepted lead and later status without exposing PII to analytics. Reports distinguish sessions, enquiries, qualified leads and won projects. Use qualified enquiries / organic landing sessions as a clearly defined conversion metric; GSC clicks are a separate measure.

## SEO-04 — Correct ROI arithmetic and verify cost claims

**Status:** Not started. **Priority:** Before promoting or relaunching the leading article. **Effort:** 0.5–1 day plus evidence gathering. **Depends on:** SEO-01.

**What is wrong / evidence:** The 336-click renovation article claims that recovering 60–85% of spend means receiving £1.60–£1.85 per £1 invested. Its £148,000 spend / £120,000 uplift example actually shows 81.1% cost recovery and -18.9% net ROI on spend, before other costs. That is arithmetic; it does not validate the underlying valuation.

**How to fix:** Use cost recovery = value uplift / project spend, and net ROI = (value uplift − spend) / spend. Correct prose, examples, summaries and any matching graphics/FAQ answers. Distinguish estimated valuation uplift from realised sale proceeds and lifestyle benefit. For every project budget claim, obtain scope, date, VAT treatment, floor-area denominator, exclusions and a supporting record. If an example is illustrative, explicitly label it illustrative; do not imply it was a completed Better Homes project. Verify current legal/regulatory claims against their exact official sources during the edit.

**Implementation:** [HomeRenovationCostLondon2026Article.jsx](/Users/gino_s/Documents/bhs-2/app/blog/_assets/articles/HomeRenovationCostLondon2026Article.jsx), related article metadata and referenced graphics.

**Premium treatment:** A restrained “Understanding the investment” table with spend, estimated uplift and recovery. Explain comfort and longevity separately from financial returns. Keep the existing URL and useful article structure.

**Done when:** Every repeated ROI statement agrees, calculations reconcile and evidence supports each “real project” claim. Record a genuine update date after the material correction.

## SEO-05 — Establish one approved source for business facts

**Status:** Not started. **Priority:** Launch trust. **Effort:** 0.5–1 day plus business evidence.

**What is wrong / evidence:** New proof strips scope guarantees by work package, while older article/location wording still includes blanket 10-year promises, “500+” claims and inconsistent design-service language. The extension meta description says “your architect or ours”.

**How to fix:** Create a facts register with claim, evidence, approved wording, scope, owner and review date. Store only approved public facts in a shared source module; keep policies/private documents outside public assets. Separate company incorporation from the team's years of experience. Separate insurance type/limit from workmanship guarantees and product warranties. Record review platform, rating, count and verification date without combining platforms. Standardise the architect statement: “Bring your architect or choose an independent architect we recommend. We manage construction, with agreed coordination support.” Search all public templates, article prose, calculator exports, metadata and schema for conflicting variants and reconcile them.

**Implementation:** [ProofStrip.jsx](/Users/gino_s/Documents/bhs-2/components/brand/ProofStrip.jsx), [structuredData.js](/Users/gino_s/Documents/bhs-2/libs/structuredData.js), About, guarantee, location and article templates.

**Premium treatment:** Keep the existing elegant proof strip. Link short claims to readable terms/proof instead of putting policy text into the hero. Do not replace numerical claims with equally vague superlatives.

**Done when:** Every claim has a matching scope and evidence owner; conflicting public wording is removed. Missing evidence is explicitly outstanding rather than assumed verified.

## SEO-06 — Make extension tabs crawlable while keeping the design

**Status:** Not started. **Priority:** Launch blocker. **Effort:** 3–6 hours. **Depends on:** SEO-01.

**What is wrong / evidence:** ReferenceExtension conditionally mounts content with `t.selected ? (...) : null` and `s.selected ? (...) : null`. Three extension-type descriptions and later process steps are missing until clicked. Source was rechecked on 13 September. Google does not interact with tabs to discover content.

**How to fix:** Render every type and step panel on the server/initial render. Apply the HTML `hidden` attribute to inactive panels instead of omitting their children. Give tab buttons stable IDs, `aria-controls`, `aria-selected` and appropriate keyboard behaviour; give panels matching IDs and labelling. Preserve current active-state styling. On mobile an equivalent native details/summary treatment is an option if it fits better, but do not duplicate two complete content trees. Keep static copy outside unnecessary client state; do not adopt APIs from a newer React version just to solve this. Google-visible content must also remain accessible to users.

**Implementation:** [ReferenceExtension.jsx](/Users/gino_s/Documents/bhs-2/components/brand/ReferenceExtension.jsx:576) and process panels near line 1242. The existing Home/Extension FAQs already render their answer containers with `hidden`; shared Faq.jsx uses native details. Preserve those working patterns.

**Premium treatment:** Same typography, layout, selector and spacing. This fix need not alter appearance.

**Done when:** Raw response HTML contains unique sentences from all four extension types and all process steps; a parser excluding scripts can find them. Keyboard navigation and mobile layout still work; no hydration warning or duplicate IDs. Later validate representative production output in URL Inspection.

## SEO-07 — Restore a deliberate internal-link network

**Status:** Not started. **Priority:** Before launch. **Effort:** 0.5–1 day. **Depends on:** SEO-01, SEO-06.

**What is wrong / evidence:** Unique crawled linking-page coverage dropped from 100 to 6 for renovation/kitchen calculators, 100 to 9 for the extension calculator, and 100 to 5 for Hackney. These include global links and are not PageRank estimates. Neither leading kitchen comparison has a calculator link in the audited initial HTML.

**How to fix:** Maintain a small service-resource map. Connect /house-extension to /extension-calculator and the extension-cost guide; /general-renovation to /renovation-calculator and the renovation-cost guide; /kitchen-renovation to /kitchen-calculator and the kitchen comparison; /bathroom-renovation to /tools/bathroom-cost-calculator. For lofts, link to the real loft guide until a suitable loft calculator exists. Add contextual return links from articles to their relevant service and project proof. Make the existing Cost planning navigation item a link to the hub with an adjacent dropdown control containing calculator links rendered in HTML. Preserve the three header zones. Restore category discovery where useful, rather than adding every category to every page.

**Implementation:** [Navigation.jsx](/Users/gino_s/Documents/bhs-2/components/brand/Navigation.jsx), [ServicePage.jsx](/Users/gino_s/Documents/bhs-2/components/brand/ServicePage.jsx), [RelatedGuides.jsx](/Users/gino_s/Documents/bhs-2/components/brand/RelatedGuides.jsx), [knowledgeCenter.js](/Users/gino_s/Documents/bhs-2/libs/knowledgeCenter.js), article content.

**Premium treatment:** A quiet dropdown, one useful cost-planning panel per service and natural text links inside relevant advice. No 37-area footer dump.

**Done when:** All mapped links return 200 and point to canonical URLs, the menu works with keyboard/mobile, and every priority article has an appropriate onward service/tool path. Measure coverage and user clicks; do not target an arbitrary link count.

## SEO-08 — Bring the article conversion offer into the reading journey

**Status:** Not started. **Priority:** Highest near-term conversion experiment. **Effort:** 0.5–1 day. **Depends on:** SEO-02, SEO-03, SEO-04, SEO-07.

**What is wrong / evidence:** Mobile supplies 53.4% of search clicks. On the 390px audit snapshot, the main article's first calculator link was about 6,150px down and the sidebar began about 34,550px down. This is observed placement, not proven drop-off.

**How to fix:** Add a reusable editorial CTA immediately after the opening answer summary inside the renovation article. Suggested text: “Planning your own renovation? Apply these figures to your home.” Primary: “Estimate your renovation”; secondary: “Discuss your project”. Add one proof-led CTA after the first substantial budget section, linking a verified relevant case study. Map the kitchen comparisons to kitchen tools/service, rather than repeating the same generic offer. Keep desktop sidebar utility, but move the important mobile action into article flow. Avoid placing a full form before the answer. Tag event context using article path and CTA placement, not user content.

**Implementation:** [article page template](/Users/gino_s/Documents/bhs-2/app/blog/[articleId]/page.js), relevant article components, [brand.css](/Users/gino_s/Documents/bhs-2/app/brand.css:769); proposed reusable EditorialCTA component.

**Premium treatment:** Pale brand background or a fine divider, a short title and two restrained actions. Original project photography is optional when it adds evidence. Avoid sticky overlays initially; chat/cookie controls already compete for mobile space.

**Done when:** The first relevant action follows the opening answer at 390px and 1440px, creates no overlap, and is tracked by placement. Review calculator starts and qualified enquiry rate over sufficient sessions; do not declare uplift from one or two leads.

## SEO-09 — Clarify search intent without sacrificing expressive headlines

**Status:** Not started. **Priority:** On-page clarity. **Effort:** 0.5 day. **Depends on:** SEO-01.

**What is wrong / evidence:** Service H1s are evocative but omit the service/location. Fourteen audited blog pages have duplicate H1s; the bathroom calculator has three. Multiple H1s do not automatically cause a penalty, but template hierarchy and reader orientation should be clearer.

**How to fix:** Keep the expressive hero line. Make the visible service/location label and headline one intentional H1 composition: a smaller readable span “House extensions in London”, followed by the current large emotional line. Another acceptable design is a concise descriptive H1 with the emotional line as a styled paragraph. Do not hide keywords off-screen. Let the article template own its H1; replace duplicate article-body titles with a useful H2 or remove only the redundant title while preserving introductory content. Use H2 for major answers and H3 for subdivisions. Keep established fragment IDs where linked.

**Implementation:** [ReferenceHome.jsx](/Users/gino_s/Documents/bhs-2/components/brand/ReferenceHome.jsx), ReferenceExtension, ServicePage, article template/content and calculator components.

**Premium treatment:** Preserve headline scale, line-height and whitespace. The semantic tag should not force a visual redesign. “London construction” and the three core services can orient the homepage without stuffing six keywords into its hero.

**Done when:** Every affected page has one intentional primary heading and a sensible outline, visible service context and no changed anchor destinations. Check wrapping at mobile widths and 200% zoom.

## SEO-10 — Restore service-specific decision guidance

**Status:** Not started. **Priority:** Commercial relevance. **Effort:** 1–2 days per core service including editorial verification. **Depends on:** SEO-05, SEO-07, SEO-09.

**What is wrong / evidence:** Initially rendered service text fell about 25–31%. Word count is not the target; removed useful answers are. ServicePage displays type descriptions/timelines but omits the existing loft `planning` field. The six service paths produce only 10 search clicks in the export.

**How to fix:** Complete one service page before applying its pattern elsewhere. For extensions cover types, suitability, scope, pricing basis, approvals and disruption. For lofts cover roof type/headroom feasibility, stairs, available types, professional assessment, programme and approvals. For whole-home renovation distinguish cosmetic refresh from structural/services renovation, phasing and occupancy. Display existing planning fields only after their wording is checked. Add direct official references beside relevant technical guidance. Retain a concise visible answer, with supporting detail in server-rendered disclosures. Map each module to an actual homeowner question; cut modules that merely restate marketing.

**Implementation:** ServicePage, [loft page](/Users/gino_s/Documents/bhs-2/app/loft-conversion/page.js), [renovation page](/Users/gino_s/Documents/bhs-2/app/general-renovation/page.js), ReferenceExtension and [pageFaqs.js](/Users/gino_s/Documents/bhs-2/libs/pageFaqs.js).

**Premium treatment:** Three or four strong editorial sections, an elegant comparison table and short “Before you build” disclosures. Use meaningful section titles; avoid an undifferentiated wall of copy.

**Done when:** A reader can identify suitability, approximate budget basis, responsibilities, next step and relevant evidence without needing a sales call for every basic answer. Validate regulated advice against current official sources. No arbitrary minimum word count.

## SEO-11 — Give the loft service genuine loft proof

**Status:** Needs business evidence. **Priority:** High commercial trust. **Effort:** 0.5–1 day once assets are available. **Depends on:** SEO-05.

**What is wrong / evidence:** The loft page has an N19 kitchen/extension hero and extension project cards. The loft service path recorded zero clicks and position 34.37 in the supplied export. The image mismatch is a relevance/conversion hypothesis, not proven causation.

**How to fix:** Identify a verified completed loft job. Obtain permission to publish selected photographs, approximate area, conversion type, actual scope, completion date and professional credits. Select a hero that visibly demonstrates a loft's roof form, staircase or finished use. Add a relevant case study and an exact, attributable loft review where available. If no usable photography exists yet, label an illustration as illustrative and keep unrelated work clearly described as other construction experience. Do not generate fake completion photographs or relabel an extension as a loft.

**Implementation:** Loft page's image and project selection, [portfolio-projects.js](/Users/gino_s/Documents/bhs-2/libs/portfolio-projects.js), [portfolio-details.js](/Users/gino_s/Documents/bhs-2/libs/portfolio-details.js).

**Premium treatment:** One excellent full-width image with a precise caption and a small factual project summary. Genuine light, joinery and stair details communicate quality more convincingly than luxury adjectives.

**Done when:** All displayed project claims and imagery match the service; permissions and source records exist. Missing evidence remains visible in the internal ticket, not replaced by invented content.

## SEO-12 — Turn portfolio pages into persuasive case studies

**Status:** Needs business evidence. **Priority:** Trust, local relevance and assisted conversions. **Effort:** 1–2 days for the template; 0.5–1 day per documented project. **Depends on:** SEO-05.

**What is wrong / evidence:** Existing cases provide photographs and broad outcomes, but do not consistently substantiate costs, delivery constraints or project roles. The N19 case gives a broad 2025–2026 completion period. High-budget clients need evidence of delivery control as well as attractive rooms.

**How to fix:** Add optional, verified fields for neighbourhood, completion month/year, property type, floor area and its definition, scope, construction programme, cost band and price basis, Better Homes' role, separately appointed professionals, challenges and solutions. Leave unavailable fields out of the public layout. Write each case as brief → constraint → decision → execution → outcome. Include before/during/after material where available and privacy-safe. Add service and area links plus “Discuss a similar project”, carrying a project reference into the contact journey. Do not expose full private addresses.

**Implementation:** Portfolio data modules and [project page](/Users/gino_s/Documents/bhs-2/app/portfolio/[projectId]/page.js).

**Premium treatment:** An architectural editorial: generous images, concise captions, one restrained facts panel and a meaningful construction story. Demonstrate differing investment levels through actual projects, not invented luxury tiers.

**Done when:** A reviewer can trace every factual statement to a project record or approved source. At least one case for each priority service is genuinely representative. Project-origin enquiries are distinguishable in the CRM.

## SEO-13 — Repair broken contents links and preserve old fragments

**Status:** Not started. **Priority:** Quick user-experience repair. **Effort:** 2–4 hours. **Depends on:** SEO-01.

**What is wrong / evidence:** The 65-click kitchen-provider comparison has broken `#providers` and `#case-studies` links. The full kitchen-renovation guide has two unmatched long-form contents fragments. These are inherited issues, not redesign losses.

**How to fix:** Match each contents link to the intended visible heading. Prefer adding a stable explicit ID to the correct section where the old fragment is semantically sound; otherwise update the link and retain an unobtrusive old-ID anchor where legitimate inbound references might exist. Build a same-site fragment check using parsed IDs and decoded URL fragments; distinguish missing pages from missing anchors. Add `scroll-margin-top` to targets so the fixed header does not cover them. Do not redirect every fragment to the top of the article.

**Implementation:** Matching article content in [content.js](/Users/gino_s/Documents/bhs-2/app/blog/_assets/content.js) and article components; brand article CSS.

**Premium treatment:** A compact “In this guide” contents block with understated links. All table-of-contents items should feel intentional rather than generated from unreadable slugs.

**Done when:** Every contents link on the affected articles lands on the intended readable section at mobile and desktop widths; previously valid anchors still work.

## SEO-14 — Introduce a controlled metadata improvement programme

**Status:** Not started. **Priority:** CTR and intent, after basic protection. **Effort:** 0.5–1 day to implement; several weeks to evaluate. **Depends on:** SEO-01, SEO-04, SEO-05, SEO-09.

**What is wrong / evidence:** Many descriptions are unchanged. The extension description is 169 characters and contains “ours”; the loft description is 187 characters. Length is a truncation diagnostic, not a Google character-limit rule. The renovation article has 49,245 impressions at 0.68% CTR and position 8.81; that is a stronger initial testing opportunity than a service query at position 57.

**How to fix:** Keep a metadata change log recording page, intended query cohort, old/new copy, date and hypothesis. First repair factual inconsistency and BH Studio/Better Homes naming. Front-load service/location or the article's question, then one substantiated benefit. Do not change every winning title alongside the redesign. Start with one or two descriptions; inspect actual Google snippets after recrawl. Compare UK/device/query cohorts within similar position bands, using matched periods and acknowledging incomplete GSC queries. If impressions remain unchanged, 1% CTR on the renovation article would imply roughly 156 extra clicks for the baseline period; label this a scenario, not a promised outcome.

**Implementation:** Individual page metadata, [seo.js](/Users/gino_s/Documents/bhs-2/libs/seo.js), article metadata. See the copy matrix below.

**Premium treatment:** Search snippets should sell specificity and confidence: scope, delivery, genuine proof and clear next steps. Avoid “cheap”, exaggerated superlatives and price hooks with unclear exclusions.

**Done when:** Copy matches visible content, canonical/OG URLs remain correct, the log isolates the hypothesis and no protected slug changes. A test is inconclusive until sufficient comparable data exists; four to six weeks is a review window, not automatic statistical proof.

## SEO-15 — Rebuild five to eight location pages around real evidence

**Status:** Needs business evidence. **Priority:** Local organic growth. **Effort:** 1 day for extensible data/template; 0.5–1 day per area. **Depends on:** SEO-05, SEO-12.

**What is wrong / evidence:** Location pages produce 10 clicks from 20,547 impressions. Much content varies only by place and regional paragraph. Chelsea has 1,816 impressions, Barnet 1,469, Leytonstone 1,384 and Notting Hill 1,137. Demand alone does not establish profitable delivery fit.

**How to fix:** Select priority areas using search opportunity, verified completed work, service capacity and qualified-lead economics. Extend location data with specific introduction, verified council/borough relationship, housing context, case-study references, practical site constraints, genuine FAQs and supporting source URLs. Draft each page from evidence. A place spanning boundaries requires property-specific council confirmation. Clearly label nearby work; do not imply a postcode maps to one borough. Keep existing slugs. Reassess weak pages only after checking queries, backlinks and leads; do not mass-noindex them because clicks are low.

**Implementation:** [locations.js](/Users/gino_s/Documents/bhs-2/libs/locations.js), location data and [location template](/Users/gino_s/Documents/bhs-2/app/locations/[slug]/page.js).

**Premium treatment:** One authentic area/project photograph, a specific headline, two useful local observations, relevant work and a short consultation invitation. Local competence should carry the page, not repeated “premium neighbourhood” language.

**Done when:** Each selected page contains materially unique useful evidence, correct local relationships, relevant service links and an honest coverage statement. No fake office, fabricated local review or mass service × area expansion.

## SEO-16 — Make local testimonials and nearby links truthful

**Status:** Not started. **Priority:** Local trust and architecture. **Effort:** 0.5–1 day. **Depends on:** SEO-05, SEO-12, SEO-15.

**What is wrong / evidence:** Testimonials are selected with a slug hash, not location relevance. Nearby links use the first six records in a broad region, not measured adjacency. That can make pages superficially different without helping the reader.

**How to fix:** Add explicit reviewed location-to-project and location-to-review relationships. Use a local review only when the location is verified. Otherwise label it “A homeowner's experience with Better Homes” and preserve the original review's project/location context. Replace first-six selection with curated adjacent/operationally relevant areas, or verified geographic adjacency with a human review. Add case-study → area → relevant service paths. Keep quotes exact or transparently excerpted, with direct source links where available. Resolve any broken review-fragment references rather than using them as proof.

**Implementation:** Location template's `pickTestimonialsForLocation`, `getNearbyLocations` in locations.js, portfolio relationships.

**Premium treatment:** One relevant quotation next to one project detail; a short “Nearby areas we serve” line. Avoid testimonial carousels full of interchangeable praise.

**Done when:** Every local attribution is supported; company-wide reviews are clearly distinguished; neighbours are actually relevant; all relationship links resolve. Link-count growth alone is not success.

## SEO-17 — Align contact identity and Google Business Profile

**Status:** Needs account/business evidence. **Priority:** Local discovery. **Effort:** 0.5–1 day after access. **Depends on:** SEO-05.

**What is wrong / evidence:** Shared schema specifies only London/GB for address. GBP performance, categories and current profile configuration were not audited from owner access. Do not assume a complete address or category change is appropriate without checking the business model.

**How to fix:** Verify public trading name, legal entity, business telephone, contact hours and actual service-area/customer-location setup. Add appropriate contact detail to the contact page. Distinguish registered office from staffed customer premises; do not expose a private address or invent one for schema. Inspect GBP primary/secondary categories against actual services, business hours, website/booking links, coverage, duplicates and photos. Keep the business name genuine rather than adding keywords. Add agreed UTMs to profile website/appointment links and preserve the site's canonical URL. Record starting GBP website clicks, calls and other available actions before changes.

**Implementation:** [contact page](/Users/gino_s/Documents/bhs-2/app/contact/page.js), footer, structuredData.js and GBP owner settings.

**Premium treatment:** A clean contact-information panel with telephone, hours, coverage and appointment expectations. Show a map only when it represents a real useful customer location or clearly labelled service coverage.

**Done when:** Website and profile facts agree, the location model is honest, links work and attribution is testable. Measure local visibility separately from organic website ranking; service-area labels do not override distance.

## SEO-18 — Strengthen authorship and editorial accountability

**Status:** Needs verified biography. **Priority:** Trust and expert content. **Effort:** 0.5–1 day. **Depends on:** SEO-05.

**What is wrong / evidence:** The author profile describes “Gino S.” mainly as a developer and entrepreneur. That does not explain why a reader should rely on construction-cost, planning or finance advice. This is a credibility gap, not an inferred E-E-A-T score.

**How to fix:** Use the author's approved public name, actual role, relevant experience and a real photograph. Explain how he contributes to scoping, construction coordination or commercial decisions only where true. Link representative projects and describe the source/review method. Add reviewedBy/dateReviewed only when a real qualified professional has reviewed the relevant specialist claims; do not imply every article needs an engineer or that a developer bio confers financial qualifications. Preserve published dates and change modified dates only for substantive updates. Add a short editorial/corrections policy through the About or author surface instead of a thin page created purely for SEO.

**Implementation:** [authors in content.js](/Users/gino_s/Documents/bhs-2/app/blog/_assets/content.js), [author page](/Users/gino_s/Documents/bhs-2/app/blog/author/[authorId]/page.js), article byline/schema.

**Premium treatment:** Small editorial portrait, concise role statement and “How this guide was prepared” disclosure. Keep author detail out of every paragraph.

**Done when:** Names and roles are consistent, credentials are verifiable, reviews actually occurred, and meaningful dates are identical across visible copy and schema.

## SEO-19 — Consolidate structured data around verified entities

**Status:** Not started. **Priority:** Technical clarity. **Effort:** 0.5–1 day. **Depends on:** SEO-05, SEO-18.

**What is wrong / evidence:** Stable root IDs already exist, which is good. Article publisher/author references can be more consistent; the extension ServiceSchema call omits description. An unused sample SoftwareApplication helper contains rating/USD-price placeholders, but was not emitted in the audit. It is cleanup, not evidence of a live wrong-schema penalty.

**How to fix:** Keep the current organization/localbusiness/website IDs. Reference them from page, service and article nodes instead of creating disconnected duplicate businesses. Add verified legalName/logo/contact details where appropriate. Use a stable author Person ID tied to the author page. Add accurate extension description, Service provider, and WebPage relationships. Ensure JSON-LD image URLs are absolute and resolve. Keep BreadcrumbList aligned with actual navigable hierarchy. Retain only genuine FAQ answers; do not add redundant generic FAQ filler. Safely remove the unused software helper once import usage is checked. Use schema validation for vocabulary and Rich Results Test for Google's supported features; they answer different questions.

**Implementation:** [structuredData.js](/Users/gino_s/Documents/bhs-2/libs/structuredData.js), [Schema.jsx](/Users/gino_s/Documents/bhs-2/components/brand/Schema.jsx), seo.js and article/location templates.

**Premium treatment:** No visible design change beyond any factual content needed to support the markup.

**Done when:** Representative graphs parse, references resolve, supported rich-result tests have no critical errors and visible facts match markup. Do not promise Service-rich results, self-serving company review stars or Google FAQ snippets; FAQ rich results were retired in May 2026.

## SEO-20 — Make indexing and sitemap decisions explicit

**Status:** Not started. **Priority:** Pre-launch verification/cleanup. **Effort:** 0.5 day. **Depends on:** SEO-01.

**What is wrong / evidence:** Four form pages were in the sitemap without canonicals: bathroom-renovation-form, its /detailed child, general-renovation-form and kitchen-renovation-form. Preview noindex and tested HTTP/www redirects passed on 8 September; retain and recheck them rather than treating them as broken.

**How to fix:** Classify each form as a distinct useful search landing page or a lead-collection utility. For utilities, apply noindex/follow and exclude from the sitemap while keeping useful customer links. For genuinely distinct content, keep a self-canonical and useful page-specific metadata. Do not block crawling in robots.txt while relying on Google to see noindex. Review catalogue facets separately before choosing clean-page canonicals or noindex: the proper choice depends on whether a facet has unique search value. Give the historical renovation-cost alias a direct permanent redirect to the established article, after checking equivalent intent. Build sitemap lastmod from real material content dates where available; omit rather than fabricate freshness.

**Implementation:** Form page metadata, [next-sitemap.config.js](/Users/gino_s/Documents/bhs-2/next-sitemap.config.js), [next.config.js](/Users/gino_s/Documents/bhs-2/next.config.js), catalogue metadata.

**Premium treatment:** No visual changes needed.

**Done when:** Sitemap URLs are canonical, indexable and 200; intentionally excluded forms still work; known auth/thank-you/token pages retain noindex. Production cannot accidentally inherit preview noindex. Test headers and HTML on the exact host before launch.

## SEO-21 — Improve calculators as a premium planning service

**Status:** Not started. **Priority:** Acquisition and conversion growth. **Effort:** 1–2 days per priority flow. **Depends on:** SEO-02, SEO-03, SEO-05, SEO-07.

**What is wrong / evidence:** Calculators generate 16 clicks from 47,259 impressions. Renovation alone has 21,737 impressions and 10 clicks at position 26.19. The tools hub's audited main text fell from 1,617 to 248 words; some removed material was generic, so do not restore it wholesale.

**How to fix:** Give each tool a concise server-rendered explanation of who it suits, required inputs, output and limitations. On the hub, prioritise extensions/whole-home renovation while retaining kitchen, bathroom and BTU access. Audit the claimed completion times with actual use; do not assert unmeasured “two minutes” or “accurate to 5%”. Present low/expected/high ranges, the selected scope, explicit VAT treatment, included/excluded fees and next decisions. Derive displayed allowances from the same cost engine as the results/PDF where practical. Add “Discuss this estimate” with a privacy-safe estimate reference so the client need not re-enter everything. Preserve existing calculator arithmetic unless separately validated changes are required.

**Implementation:** [tools page](/Users/gino_s/Documents/bhs-2/app/tools/page.js), calculator layouts, result components and PDF generators.

**Premium treatment:** A considered budget briefing, with a clean range and concise assumptions. Useful indicative results should remain accessible; offer optional saving or consultation afterwards rather than an aggressive gate.

**Done when:** Representative input cases reconcile to results and PDF, assumptions are visible, no misleading accuracy claim remains, and start/completion/enquiry events are distinct. Track qualified estimate-led enquiries, not PDF downloads alone.

## SEO-22 — Verify production performance while preserving image quality

**Status:** Needs comparable performance measurement. **Priority:** Launch quality. **Effort:** 0.5–1 day to baseline; fixes depend on findings. **Depends on:** affected visual tickets.

**What is wrong / evidence:** No field-CWV regression was measured. The prior local server was a development server and cannot provide a fair speed comparison. Home/Extension switch layout based on post-mount viewport state, which warrants inspection rather than an assumed CLS failure.

**How to fix:** Compare live and preview production builds using the same mobile lab configuration and repeated runs; separately obtain CrUX/GSC field data where available. Test home, top article, extension, a location and a calculator. Identify actual LCP element, layout-shift sources and main-thread work. Replace layout-only viewport state with responsive CSS where safe. Reserve image dimensions/aspect ratios; serve appropriate responsive sizes; prioritise the true hero only; lazy-load below-fold galleries. Keep server-rendered editorial content out of unnecessary client bundles and defer non-critical third parties without breaking consent or measurement. Inspect the actual React/Next versions before selecting APIs.

**Implementation:** Root/client layout, ReferenceHome/Extension, image components, brand CSS and analytics/chat loading.

**Premium treatment:** Preserve photographic detail at its intended display size, not oversized downloads. No placeholder flashes, jumping headlines or compressed images that undermine finish quality.

**Done when:** A comparable before/after record shows affected regressions resolved, no broken interactions and no new mobile overflow. Aim for good field p75 LCP ≤2.5s, INP ≤200ms and CLS ≤0.1; if field data is absent, mark it absent rather than declaring a field pass from Lighthouse.

## SEO-23 — Make photography and diagrams useful search assets

**Status:** Not started. **Priority:** Image discovery and proof. **Effort:** 0.5–1 day for priority assets. **Depends on:** SEO-05, SEO-12, SEO-22.

**What is wrong / evidence:** Strong project photography exists, but generic/repeated descriptions and infographic-only information can weaken understanding. No Google Images export was provided, so image-search loss is not measured. Some top articles repeat a large graphic near the opening.

**How to fix:** Preserve existing indexed image URLs where possible. Write factual alt text describing what the image demonstrates; use empty alt for truly decorative repeats. Add concise project/location captions when verified. Keep important figures in adjacent HTML text/tables, with methodology and dates. Offer accessible enlargement for detailed diagrams and optimise the initial-size asset independently. Include appropriate image information in Article schema; add image sitemap support only where it helps discover meaningful assets, not as a universal requirement. Retain original before/during/after photography with publication permission.

**Implementation:** Portfolio/article image metadata and components; metadata images and generated cost-graphic source files when their data changes.

**Premium treatment:** Captions should read like architectural editorial captions: specific, restrained and useful. Give key imagery space and avoid turning photographs into text-covered advertisements.

**Done when:** Images remain crawlable, no old priority asset is accidentally broken, factual alt/captions match the photograph, diagrams have readable equivalent data and mobile visual quality remains strong.

## SEO-24 — Build content and AI visibility from original evidence

**Status:** Not started. **Priority:** Sustained growth. **Effort:** 0.5 day for intent map; 1–3 days per substantiated article. **Depends on:** SEO-04, SEO-05, SEO-07, SEO-12, SEO-18.

**What is wrong / evidence:** Articles drive 80.7% of page clicks, but broad extension terms often rank poorly and generic coverage is easily replicated. Several existing extension cost/guide/calculator pages can overlap in intent. This is a cannibalisation risk to investigate, not a confirmed finding without page-query data.

**How to fix:** Create a page-intent map: service page = appoint a builder; cost article = understand scope/price; calculator = model a scenario; case study = verify experience; location = establish local fit. Assign a primary page per intent and obtain page-filtered GSC queries before merging anything. First improve the renovation-cost and kitchen comparison winners. Develop subsequent articles from actual estimating/build decisions: why comparable quotes differ, renovating a period home while occupied, where high-spec finishes change cost, or lessons from a documented side-return. Label proposed topics as hypotheses until supported by queries/leads. Publish concise answer summaries, original HTML tables, verifiable project evidence and direct sources for important claims. Date meaningful updates honestly.

**Implementation:** Article content/metadata, related-guide mapping and project references.

**Premium treatment:** A curated journal with a distinct point of view and useful expertise. Keep real costs visible and explain choices; do not replace useful information with vague luxury messaging.

**Done when:** Each article has a distinct intent, original substantiated value and a natural commercial next step. Track qualified landing-page outcomes and observable AI referrals/citations separately. No special AI schema or llms.txt task is required for Google visibility; optional external-tool files are lower priority than evidence.

## SEO-25 — Build genuine external authority and a review programme

**Status:** Needs relationship/account evidence. **Priority:** Organic and local growth. **Effort:** Ongoing; start with a documented shortlist. **Depends on:** SEO-05, SEO-12, SEO-17.

**What is wrong / evidence:** Only 10 service-page clicks and weak commercial positions indicate room for authority growth, but no backlink export was supplied. It would be inaccurate to claim a measured backlink deficit or lost links. Attractive on-site copy cannot create independent reputation by itself.

**How to fix:** Export available referring-page/linked-page data from GSC or an established backlink tool. Check existing valuable links and cited URLs before chasing new ones. Identify completed collaborations with architects, suppliers, photographers and relevant local/editorial publications. Prepare accurate project features with approved credits and real images for appropriate publication; seek genuine attribution where warranted. Request honest reviews from eligible clients at a consistent project milestone, without incentives, scripts dictating praise or filtering out unhappy clients. Reply professionally and keep project privacy. Record referring domains, relevance, referral enquiries and review recency. Outreach messages/publication are separate explicitly authorised actions.

**Premium treatment:** Let original projects earn editorial attention. Show a curated, attributable selection of reviews and recognised coverage rather than an unverified wall of badges.

**Done when:** Existing valuable destinations are preserved, the first evidence-backed features are prepared, and a repeatable honest review process has an owner. Reject bought links and fabricated awards; do not equate number of directory listings with authority.

## SEO-26 — Launch with explicit gates and iterate from outcomes

**Status:** Not started. **Priority:** Required before release. **Effort:** 0.5–1 day for release verification, then weekly review. **Depends on:** completed launch-critical tickets and any public claims they use.

**What is wrong / evidence:** Preserving routes alone does not prove a safe release. At 680 clicks over 92 days, daily traffic is noisy. Last comparable 28-day clicks were 219 versus 225; that does not justify assuming an existing collapse or setting a guaranteed growth target.

**How to fix:** Require: protected URL/content comparison; crawlable extension panels; correct production canonicals and index controls; working internal links; evidence-consistent claims; demonstrated form/booking measurement; acceptable production mobile experience; and a known rollback deployment. Hold full rollout for missing critical evidence, but do not block it indefinitely on optional future articles or off-site outreach. Re-crawl production immediately after launch. Recheck protected pages and form paths, then use URL Inspection on representative templates. Submit the correct sitemap through the existing property, not a Change of Address request for an unchanged domain. Annotate launch and subsequent changes.

**Launch-gate ticket map:** Require SEO-01 (protected-page evidence), SEO-02 (accepted-enquiry measurement; booking confirmation if booking is offered), SEO-04/05 (correction or removal of unsupported public claims), SEO-06 (crawlable panels), SEO-07/13 (critical links and fragments), SEO-20 (index controls) and SEO-22 (production performance assessment). SEO-03 needs at least a working source/landing-page attribution path at launch; complete longer-term revenue reporting as CRM data accumulates. For SEO-22, document field-data availability: a new preview cannot supply a mature production field baseline, so use representative lab checks and existing field evidence, then monitor production. These are release checks, not a claim that every ticket contains a present defect. SEO-08 onward contains growth work that can proceed in controlled iterations; SEO-11/16/17/19 still require correction before release wherever the current page makes a false or contradictory claim. Retain the existing working experience if an optional replacement lacks evidence.

**Iteration:** Review technical failures daily immediately after release. Review protected landing pages weekly and on comparable 28-day windows. Examine UK/device/query-position cohorts where data supports them. Investigate sustained declines; immediately roll back confirmed accidental noindex/404/missing-content/form failures. Do not roll back on a single low-traffic day. Report organic sessions, accepted enquiries, qualified enquiries, consultation confirmations, quotes and won value as distinct funnel measures. Track organic contribution to qualified pipeline over a business-appropriate sales-cycle window; compare acquisition cost only after including SEO/content effort and reliable CRM attribution.

**Premium treatment:** Operational reliability is part of the brand. No visible redesign is required for this ticket.

**Done when:** Every launch gate has evidence, the exact production version is verified, and an owner can review the dashboard without confusing clicks, enquiries and revenue. Unmeasured outcomes remain explicitly unavailable.

## Metadata copy matrix for SEO-14

These are candidates, not approved test winners. Check factual promises against SEO-05 and existing page content before implementation. Do not deploy all title changes at once.

| Page | Proposed title | Proposed description |
|---|---|---|
| Homepage | London Extensions, Lofts & Renovations — Better Homes | Extensions, loft conversions and whole-home renovations in London. Explore completed homes, clear budgets and a build managed around you. |
| /house-extension | House Extension Builders London — Better Homes | Rear, side-return and double-storey extensions in London. Clear scope, weekly updates and 10-year extension workmanship cover. Discuss your plans. |
| /loft-conversion | Loft Conversions London — Better Homes | Dormer, hip-to-gable and mansard loft conversions in London. Explore costs, build times and your options with Better Homes. |
| /general-renovation | Whole-Home Renovations London — Better Homes | Renovate your London home with one construction team managing structural work, services and finishes. Explore costs and discuss your brief. |
| /kitchen-renovation | Kitchen Renovation & Installation London — Better Homes | Plan your London kitchen renovation with clear installation scope, coordinated trades and careful finishing. Explore completed kitchens and discuss your brief. |
| /bathroom-renovation | Bathroom Renovation & Installation London — Better Homes | London bathroom renovations with carefully managed plumbing, waterproofing and finishing. Explore our work and discuss your bathroom. |
| /renovation-calculator | London Renovation Cost Calculator — Better Homes | Estimate a London renovation budget from your property and scope. See a planning range, then discuss a detailed quotation with our team. |
| Renovation-cost article | Keep established title initially | Plan your London renovation with 2026 budgets by property size and specification. Compare costs, VAT, exclusions and contingency before requesting a quote. |
| Bespoke/Howdens/IKEA article | Keep established title initially | Compare fitted costs, cabinetry, worktops and lead times for bespoke, Howdens and IKEA kitchens in London. Find the right route for your project. |
| Location example, Chingford | Extensions & Home Renovations Chingford — Better Homes | Planning an extension, loft conversion or renovation in Chingford? Discuss your property, budget and build with Better Homes. |

For the last example, revise the primary service emphasis only after inspecting page-filtered queries. Other locations should not mechanically receive the same wording; local proof from SEO-15 should supply genuine differentiation.

## Definition of premium conversion

Make planning feel clear and considered. Give the research-stage visitor a useful answer and calculator, the homeowner with drawings a brief-review route, and the ready-to-appoint client a well-defined consultation. Use “Discuss your project”, “Explore the investment” and “See the completed home” where those actions accurately describe the destination. Keep useful price information for mid-range clients, while demonstrating complex, high-spec delivery with documented projects. No fake “starting from” prices, assumed wealth from a postcode or pressure tactics.

The brand should repeatedly demonstrate three propositions through evidence: carefully executed homes, a well-managed construction process, and clear responsibility. Architect coordination is a useful service boundary to explain once clearly and reinforce where relevant; it should not overwhelm every headline and snippet.

## Evidence and reference documents

- [Full original audit](Better-Homes-SEO-Audit.md).
- [All 101 paths: page-by-page metadata, HTML schema and GSC evidence](Page-by-page-SEO-evidence.md).
- GSC inputs: `/Users/gino_s/Downloads/bhstudio.co.uk-Performance-on-Search-2026-09-08/`. Figures above reuse the audited 7 June–6 September baseline, not a fresh export.
- Source inspection on 13 September: current checkout at b39b0df. No website code changed by preparation of this backlog.
- [Google: content should not require interaction to load](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading).
- [Google: title links](https://developers.google.com/search/docs/appearance/title-link) and [meta descriptions](https://developers.google.com/search/docs/appearance/snippet).
- [Google: local ranking](https://support.google.com/business/answer/7091).
- [Google: review snippet eligibility](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).
- [Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals).
- [Google: AI optimisation guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
- [Google: FAQ retirement and llms.txt clarification](https://developers.google.com/search/updates).

## Working checklist

- [ ] SEO-01 Protected-page baseline
- [ ] SEO-02 Enquiry and booking events
- [ ] SEO-03 Organic attribution and CRM outcomes
- [ ] SEO-04 ROI and cost evidence
- [ ] SEO-05 Approved business facts
- [ ] SEO-06 Crawlable extension panels
- [ ] SEO-07 Internal-link network
- [ ] SEO-08 Article conversion journey
- [ ] SEO-09 Headings and intent
- [ ] SEO-10 Service decision guidance
- [ ] SEO-11 Genuine loft proof
- [ ] SEO-12 Case-study evidence
- [ ] SEO-13 Contents/fragment repairs
- [ ] SEO-14 Metadata experiments
- [ ] SEO-15 Priority location pages
- [ ] SEO-16 Local relationships/testimonials
- [ ] SEO-17 Contact identity and GBP
- [ ] SEO-18 Author/editorial accountability
- [ ] SEO-19 Entity/schema consistency
- [ ] SEO-20 Indexing and sitemaps
- [ ] SEO-21 Calculator planning experience
- [ ] SEO-22 Production performance
- [ ] SEO-23 Photography and diagram accessibility
- [ ] SEO-24 Original content and AI discovery
- [ ] SEO-25 Independent authority and reviews
- [ ] SEO-26 Launch and outcome monitoring
