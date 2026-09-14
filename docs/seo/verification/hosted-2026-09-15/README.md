# Hosted preview verification

Preview: https://bhs-v2-zkzl2haj5-gino-stoian.vercel.app/
Local source HEAD when checked: 8e95534. Deployment commit identity not independently verified.

- 107 sitemap URLs loaded successfully; 114 public route/resource checks in crawl.json.
- Six protected titles match the baseline and canonicals point to bhstudio.co.uk.
- Vercel preview sends X-Robots-Tag: noindex. Confirm absent on public marketing routes after production deployment.
- Four utility forms retain deliberate noindex, follow metadata.
- Legacy renovation-guide URL returns 308 to the retained guide.
- Twenty desktop/mobile viewport checks: 19 had no horizontal overflow; extension calculator overflowed at 390px. Portfolio filters, E14 current content and gallery controls passed.
- Mocked hosted enquiry failure/retry/success checks passed with consent accepted and rejected. No real API submissions, emails or CRM records created. No actual destination analytics receipt verified.

Issues fixed locally after this preview:
- Reduced extension calculator step connector spacing on mobile.
- Removed breadcrumb links to non-existent /blog/author and /blog/category grouping routes.
- Replaced two links to missing kitchen-renovation-cost-london-2026 with the existing kitchen-renovation-full-guide-2025 guide.
- Targeted lint passed. These fixes require another push and preview deployment.

Remaining gates: controlled real enquiry delivery to database/CRM/email; GTM destination and duplicate-event checks; actual Cal webhook setup/delivery; known hosting rollback deployment; estimator review of published cost assumptions. Hosted field/lab performance scoring and authenticated admin workflows were not validated by this pass. No production merge or deployment performed.
