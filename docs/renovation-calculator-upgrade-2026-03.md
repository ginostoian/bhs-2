# Renovation Calculator Upgrade (March 2026)

## Audit Summary

The previous renovation calculator was not reliable enough for lead generation because:

- it used broad flat room costs that did not map cleanly to real refurbishment scope
- it hardcoded timelines
- it mixed pricing categories in the result view
- the PDF CTA was a placeholder, not a real lead form
- there was no dedicated admin view for calculator submissions

## What Changed

- Replaced the pricing model with a scope-based refurbishment engine:
  - affected-area allowance
  - room fit-out allowances
  - systems upgrades
  - structural allowances
  - finishing allowances
  - professional/statutory fees
  - contingency and VAT
- Added London-first and UK regional pricing factors.
- Added confidence score and low / expected / high range output.
- Added dynamic timeline ranges.
- Rebuilt the calculator UI around more homeowner-friendly questions.
- Added real PDF/email lead capture through `/api/renovation-calculator-leads`.
- Added admin page `/admin/renovation-calculator-leads`.

## Calibration Notes

The calculator is calibrated for early-stage budgeting, not formal quoting. The new assumptions were set to better reflect UK / London renovation patterns using current market guidance and typical delivered-scope allowances, including:

- whole-home refurbishment rates
- kitchen and bathroom replacement ranges
- electrical rewire allowances
- plastering / decorating ranges
- boiler / heating upgrade allowances

The model intentionally shows a range rather than a single exact figure.

Reference guides used for calibration:

- Checkatrade house renovation / refurbishment cost guides
- Checkatrade rewire cost guide
- Checkatrade painting and decorating cost guide
- Checkatrade flooring cost guides
- Checkatrade kitchen fitting / kitchen refurbishment guidance
- UK boiler replacement pricing guides referencing current Checkatrade averages

## Security / Bot Protection

- IP rate limiting through existing middleware
- honeypot field
- minimum form completion time
- server-side recalculation before storing/sending the estimate
- email validation

## Testing Completed

- Targeted lint on the renovation calculator, new API route, and admin page.

## Manual QA Checklist

1. Run the renovation calculator for a London mid-range refurbishment.
2. Run it for a full renovation / back-to-brick scope.
3. Confirm the result breakdown sums correctly.
4. Submit a real email and verify:
   - PDF downloads
   - email arrives
   - lead appears in `/admin/renovation-calculator-leads`
5. Test invalid email and very-fast submit protection.
