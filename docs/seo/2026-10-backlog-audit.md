# Audit of the September SEO backlog: 29 October 2026

Checked against the code on `main` (cfba6ae) and the live site (bhstudio.co.uk, crawled as Googlebot). Verdicts: **Good** = keep, **Weak** = done but not enough to move rankings, **Redone** = fixed on branch `seo/phase-2`, **Open** = not started.

| Ticket | State found | Verdict | Notes |
|---|---|---|---|
| SEO-01 Protected-page baseline | Done (manifest, HTML snapshots, protected pages) | **Good** | Thorough. Keep using it before big edits. |
| SEO-02 Enquiry/booking events | Done in code | **Good**, external gates open | GTM duplicate check, Cal webhook secret and live booking confirmation are still unverified. |
| SEO-03 Organic lead attribution | Done (`/admin/crm/reports`) | **Good** | Use it monthly to judge content by enquiries, not clicks. |
| SEO-04 ROI arithmetic | Done | **Good** | Correct and honest. Leave it. |
| SEO-05 Business facts | Done | **Weak → Redone** | It stripped true, owner-known proof ("12+ years", "hundreds of projects") and left "Specialist builders" as the headline proof. Now reinstated as owner-confirmed. |
| SEO-06 Crawlable extension tabs | Done (`hidden` attribute, all panels rendered) | **Good** | Verified in source. |
| SEO-07 Internal links | Partly done | **Weak → Redone** | Service cost sections linked to the generic `/tools` hub. They now link to each service's own calculator. Extension articles now link to /house-extension and the calculator. |
| SEO-08 Article in-flow CTA | Not done | **Open** | In the roadmap, November week 3. |
| SEO-09 Clear H1s | Not done | **Redone** | Service H1s were brand slogans with no service or location. Every article had two H1s, and the bathroom calculator had three. All fixed. |
| SEO-10 Service decision guidance | Not done | **Partly redone** | Search-matching H2s added. Deeper per-service content is still open. |
| SEO-11 Loft proof | Not done | **Open** | Needs a real loft project with photos. |
| SEO-12 Case studies | Not done | **Open** | Roadmap: retitle projects by type and area (Nov week 4). |
| SEO-13 Fragments | Done | **Good** | Old fragments preserved. |
| SEO-14 Metadata programme | Not done | **Redone** for home + 6 service pages | Articles and calculators are next (Nov week 2). |
| SEO-15/16 Location pages | Not done | **Open** | Roadmap: rebuild 6–8 core areas in December. Meta descriptions are 200 characters of boilerplate. |
| SEO-17 GBP alignment | Not done | **Open** | Roadmap week 1. This is the biggest local lever. |
| SEO-18 Author E-E-A-T | Not done | **Open** | Roadmap week 3. |
| SEO-19 Structured data | Partly done | **Improved** | Added logo, description, award, `knowsAbout`, and the correct Houzz URL in `sameAs`. |
| SEO-20 Indexing and redirects | Done for one alias | **Weak → Redone** | `/blog/extension-guide-2025` and `/blog/loft-conversions-complete-guide-2026` still showed in GSC and returned **404**. Both now 301 to their live guides. |
| SEO-21 Calculators | Not done | **Open** | Bathroom calculator pricing is unrealistically low for London (≈£5.5k small bathroom). Legacy template copy and extra H1s were removed. |
| SEO-22 Performance | Lab only | **Open** (field data) | Check CrUX in GSC in December. |
| SEO-23 Images | Not done | **Open** | |
| SEO-24 Content from evidence | Not done | **Open** → content plan | |
| SEO-25 Authority and reviews | Not done | **Open** → link plan | This is the biggest gap against competitors. |
| SEO-26 Launch gates | Documented | **Weak** | The redesign shipped mid-September. Impressions fell ~38% and clicks ~35% from the following weeks, while service pages lost keyword H1s/H2s and 25–31% of their text. The gates protected URLs but not relevance signals. |

## Overall verdict on the earlier work

The engineering quality is high: baselines, tests, attribution, accessibility, honest claims. But it was **built around avoiding risk, not around ranking**. The redesign replaced search-matching headings with brand lines, removed proof and trimmed service copy. The backlog then spent most of its effort on measurement and protection rather than relevance, authority and reviews, which are what move a site from position 40 to the top 10. The branch `seo/phase-2` restores relevance. The [roadmap](2026-q4-top10-roadmap.md) and [link plan](2026-q4-link-building-plan.md) cover authority.
