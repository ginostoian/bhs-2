# Extension Calculator Upgrade (February 2026)

## Summary

This update refactors the extension calculator into a more trustworthy budgeting tool with:

- transparent line-item pricing (build, extras, fees, contingency, VAT)
- low / expected / high ranges instead of a single misleading number
- homeowner-friendly inputs for uncertainty (drawings/planning status)
- real lead capture + PDF email flow
- server-side recalculation and anti-bot protections
- admin table for extension calculator leads

## What Changed

### 1) Pricing Engine / Data Model

- Replaced the old flat-fee pricing approach with a structured cost model:
  - UK regions + London zone uplift
  - finish level, site access, glazing level multipliers
  - drawings/planning status confidence widening for ranges
  - unit-based extras (fixed, per-item, per-m²)
- Output now includes:
  - `breakdown` (separate categories, no UI double-counting)
  - `ranges.low / expected / high`
  - confidence score
  - dynamic timeline ranges

### 2) Calculator UX / Design

- Upgraded the wizard to capture more useful inputs without requiring technical knowledge.
- Added live estimate preview in the sidebar.
- Result screen redesigned for trust:
  - range-first presentation
  - transparent breakdown
  - cost-driver context
  - timeline and confidence score

### 3) Lead Capture + PDF Delivery

- `PDFDownload` is now a real form (email + consent), not a placeholder modal.
- Lead capture is handled by `/api/leads` with:
  - rate limiting
  - honeypot field
  - minimum submit-time check
  - server-side recalculation (prevents tampering)
- PDF is emailed as an attachment via Resend (through the existing email service wrapper) and also downloaded locally for immediate UX feedback.

### 4) CRM / Admin

- Added calculator metadata storage to the `Lead` model (`calculatorData`).
- Added admin page:
  - `/admin/extension-calculator-leads`
- Added links in:
  - admin sidebar
  - admin dashboard quick actions

### 5) PDF Content Improvements

PDF now includes:

- low / expected / high budget range
- line-item cost breakdown
- included fees
- indicative timeline
- best-practice next steps (real-world budgeting guidance)
- assumptions / caveats

## Security / Bot Protection

- IP rate limiting via existing `rateLimitMiddleware`
- Honeypot field (`company-website`) silently ignored if filled
- Submission timing threshold to catch instant bot submits
- Email validation
- Server-side price calculation (ignores client totals)
- Captures IP and user-agent in calculator submission metadata for admin review

## Testing Completed

### Passed

- Targeted lint on modified calculator, API, admin, schema, and email wrapper files.
- Runtime smoke test for the new pricing engine (`costEngine`) and sample estimates.

### Not Fully Automated in This Pass

- End-to-end `/api/leads` integration with live MongoDB + Resend (depends on environment credentials and running app server).
- Browser interaction QA (wizard flow and PDF form submission) in a running Next.js environment.
- Full `next build` (not run to avoid unrelated project-wide failures blocking this task).

## Recommended QA Checklist (Manual)

1. Run the app and complete the calculator for:
   - London single-storey
   - London loft
   - Non-London region
2. Verify result breakdown sums correctly.
3. Submit PDF form with a real email and confirm:
   - PDF downloads locally
   - email arrives with attachment
   - lead appears in `/admin/extension-calculator-leads`
4. Test bot protections:
   - submit too quickly
   - invalid email
5. Confirm a repeat submission updates the same lead (same email) and appends history.

