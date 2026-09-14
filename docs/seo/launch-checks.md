# Release checks — 14 September 2026

Working branch: `redesign`. Changes are local, uncommitted and not deployed.
The old-design branch and dated tag are published source archives; a verified
hosting rollback deployment is still required. Do not treat this file as release approval.

| Ticket | Current evidence | Remaining release requirement |
| --- | --- | --- |
| SEO-04 | Corrected cost recovery versus net ROI, labelled unverified budgets as illustrative, corrected moving-cost comparison, retained protected route and fragments | Estimator review of remaining ranges and graphics; no verified project accounts supplied |
| SEO-05 | Shared business facts; owner confirmed 10/2/1-year guarantees, including manufacturer exclusion; removed unsupported marketing totals and insurance amounts | Verify any reinstated insurance limits and project/experience totals; broader article claims remain subject to evidence review |
| SEO-07 | Four calculator links in accessible navigation; service and priority article planning links use existing destinations | Production link crawl after deployment |
| SEO-02 | Persisted submission IDs, retry deduplication, consent-aware custom events; signed and deduplicated Cal confirmation endpoint; isolated handler and browser checks | Inspect GTM container for duplicate automatic events, confirm actual destination receipt, configure Cal webhook secret and booking provider, test a provider confirmation |
| SEO-03 | Consent-aware first entry attribution, structured qualification, contact-to-lead linkage, admin organic outcome report | Verify with a controlled staging database and admin account; sessions unavailable without analytics integration; won pipeline value is not recognised revenue |
| SEO-20 | Six protected canonicals retained; four utility forms remain 200/noindex and leave sitemap; 97 sitemap URLs; legacy guide redirects permanently | Confirm production headers and representative private/dynamic URLs with deployment configuration |
| SEO-22 | Repeatable mobile lab measurements on five routes, production build used; see performance.md | Field CrUX/GSC evidence unavailable; hosting-preview repeat remains required before release |
| SEO-26 | Dated source/HTML baseline, protected HTML checks, fragment checks, release requirements recorded here | Resolve the external gates above, identify exact rollback deployment and verify deployed version; no merge/deployment performed |

## Measurement configuration

The website emits `enquiry_start`, `enquiry_submit_success`, `enquiry_error`,
`booking_click` and `phone_click` through the data layer with owner `bhs-site-v1`.
GTM owns destination delivery. No second Plausible custom event is emitted.
Only accepted, persisted responses emit enquiry success; thank-you page views are
not conversions. Declined consent prevents these custom analytics events and
source storage without blocking enquiries. Names, emails, postcode, free text and
query strings are excluded from event payloads. Campaign values require a deliberate
allowlist; arbitrary UTM campaign text is not stored.

Set `CAL_WEBHOOK_SECRET` in the deployment and the same secret in Cal.com. Configure
a booking-created webhook to `/api/webhook/cal`; it verifies the raw-body
`x-cal-signature-256` HMAC, accepts the configured `discovery` event type and records
each booking UID once. Confirm the actual provider payload matches before release.
A link click does not create a confirmed booking. Confirmations are stored in the
CRM ledger, not silently delivered as an analytics conversion. Provider setup and
live delivery have not been verified.

Existing partner referrals retain their referral handling. Existing CRM leads keep
their original source. Direct/unknown enquiries are not labelled Google. The report
at `/admin/crm/reports` shows a selected-period enquiry cohort, linked qualification,
quotes, confirmations and recorded won value. Organic sessions and conversion rates
remain unavailable rather than inferred from Search Console clicks. Legacy records
without attribution cannot be retrospectively assigned a landing page.

## Validation

- Thirteen isolated helper/API tests pass, including invalid/spam/database failure,
  duplicate submissions, consent, attribution, signed/forged booking delivery and outcomes.
- Desktop 1440px and mobile 390px: guarantee, whole-home, kitchen, extension and
  renovation article return 200 with no horizontal overflow or runtime errors.
- Calculator dropdown opens/closes and Escape restores focus on both layouts.
- Mocked browser enquiry: failed response creates no success event; retry preserves
  payload and event ID; accepted response emits once with consent and zero times
  without consent. No real enquiry or email was sent.
- All six protected pages retain production canonicals and remain indexable.
- Both priority kitchen articles: 29 fragment links checked, zero failures.
- Guarantee terms and quote fallbacks use owner-confirmed periods; existing stored
  bespoke quotations are not rewritten. Targeted guarantee lint passes.
- Final production build and repeated final browser checks pass with existing repository warnings; database-dependent build paths
  report unavailable Mongo DNS in this environment. This is not a live database test.

## After authorised deployment

Record deployment ID and source commit. Crawl production and compare the six
protected pages with the frozen baseline. Verify forms, booking receipt, canonicals,
robots, sitemap and important links. Inspect representative URLs in the existing
Search Console property and submit the sitemap there. Record a launch annotation.
Review operational failures daily initially and compare organic outcomes weekly and
in comparable 28-day windows. Roll back confirmed accidental noindex, 404, missing
content or form failures; do not infer a regression from one noisy traffic day.

## Protected-content comparison

The raw comparison in `verification/2026-09-14/protected-comparison.json` compares
live HTML with the local redesign before the final legacy-anchor restoration.
All six page titles match. No article section IDs were removed. Obsolete menu/SVG
IDs belong to replaced navigation; `where-we-work` has been restored in the footer.
Article reductions largely reflect the previous redesign's global footer and
byline consolidation, plus this batch's evidence corrections. The renovation
moving-cost diagram was removed deliberately because its comparison was misleading;
the original asset file remains available. Other protected article editorial images
remain; generated image variants and old decorative global assets differ.

The former exhaustive location footer is consolidated into the locations hub,
linked from navigation/footer and now contextual planning sections. Calculator
links are restored in navigation and relevant editorial/service contexts. Original
location, calculator, category, catalogue and portfolio routes are retained.
Homepage stock/service illustrations and badges were replaced by the existing
redesign's project photography and restrained proof. Unverified numeric proof was
removed or replaced with the shared evidence-backed business facts. These are
explicit consolidations and corrections, not proof of unchanged search performance.
