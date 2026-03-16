# Kitchen Calculator Upgrade (March 2026)

## Audit Summary

The previous kitchen calculator was too simplistic for trustworthy budgeting:

- it priced kitchens mainly off a flat per-m² kitchen type allowance
- it used fixed assumed worktop and splashback areas without explaining them
- it did not separate cabinetry, appliances, services, structure, and finishing clearly
- it had no real lead capture or admin view for calculator submissions

## What Changed

- Replaced the kitchen model with a more realistic installed-cost engine using:
  - estimated cabinet run length from kitchen size and layout
  - cabinetry tier
  - appliance package
  - worktop and splashback materials
  - flooring and decoration
  - electrical, plumbing, boiler, and structural allowances
  - fees, contingency, and VAT
- Added low / expected / high range output and confidence score.
- Added real PDF/email lead capture with server-side recalculation.
- Added admin page `/admin/kitchen-calculator-leads`.

## Reference Guides Used For Calibration

- Checkatrade kitchen fitting and refurbishment cost guidance
- Checkatrade worktop, flooring, and boiler cost guides
- MyBuilder / UK trade pricing references used as broad market sense-checks
- Review of common UK kitchen planning / pricing tools, most of which either:
  - focus on design planning rather than installed-budget transparency
  - collect leads without showing useful line-item assumptions

## Testing Completed

- Targeted lint on the kitchen calculator, new API route, and admin page.

## Manual QA Checklist

1. Run a London trade-fitted kitchen scenario.
2. Run a premium / bespoke kitchen with island and structural opening.
3. Check the result breakdown sums correctly.
4. Submit a real email and verify:
   - PDF downloads
   - email arrives
   - lead appears in `/admin/kitchen-calculator-leads`
