# Renovation Calculator — Pricing Rebuild Plan (July 2026)

## Why the previous engine drifted from real-life prices

The pre-rebuild engine (`app/renovation-calculator/lib/costEngine.js` + `lib/config.js`, version `2026.03`) had a number of structural problems that made totals feel arbitrary:

1. **Items (fixtures & fittings) were baked into every rate and could not be separated.**
   `roomRates` (kitchen £18k, bathroom £12.5k), `floorRates`, and `doorPackages` all
   bundled supply of the product with labour and materials in a single number. There was
   no way to price "labour + construction materials only", even though that is the number a
   builder actually controls and the one clients most often want first.

2. **Core scope overlapped with rooms and finishing.** `calculateCoreScopeCost` charged
   `impactedArea × baseRate` (£300/m²) as an undefined general allowance, then room fit-out
   *and* finishing (plaster/decoration/flooring) were added on top over the same area —
   plausibly double-counting decoration and making-good.

3. **Multipliers compounded multiplicatively across 6–7 factors** (region × zone × property
   × house style × floor × finish × occupancy), applied inconsistently per category, so edge
   cases drifted and two similar scopes could diverge for hidden reasons.

4. **Regional spread was too narrow** (London 1.10 → North 0.90, ~22%) versus the real
   ~40% spread, and the London base rate was low.

5. **Preliminaries were entirely missing** — no site setup, management, scaffold, skips,
   welfare, insurance or temporary works, which are 10–20% of a real build.

6. **VAT was a flat 20%** with no support for the 5% reduced rate (empty homes / conversions)
   or 0% cases that clients ask about.

7. **Missing real-world items**: asbestos survey (pre-2000 stock), scaffold, waste removal.

## What the rebuild does

### 1. Labour / construction-materials / fittings split *(headline change)*
Every priced element in the price book is now expressed as components:

```
{ labour, materials, fittings }
```

- **`labour + materials`** = the **construction cost** — always included.
- **`fittings`** = the **items / PC-sum layer** (kitchen units, appliances, sanitaryware,
  tiles, floor coverings, door leaves, ironmongery).

A new question — **"Include a ballpark for fixtures, fittings & finishes?"** — controls whether
the fittings layer is added. **Default is OFF**: the calculator returns labour + construction
materials only, and clearly lists what is excluded so the client can add their own product
budgets. Turning it on adds a market-rate fittings allowance driven by the finish level.

### 2. Model corrections
- Core scope redefined as **general builder's work only** (strip-out, prep, protection,
  builder's work) so it no longer double-counts finishing.
- **Preliminaries** line added (% of construction cost, scaled by scope and occupancy).
- Multipliers consolidated into a single, consistently-applied **context multiplier**
  (region × zone × property × house style × floor) on construction cost, with **finish level**
  applied only to fittings and **occupancy** folded into preliminaries.
- Regional spread widened; London base raised.
- **VAT treatment** question added (20% standard / 5% reduced / 0%).
- Asbestos survey auto-added for period stock on intrusive scopes.

### 3. Output now exposes the split
The result and PDF break cost down into **labour**, **construction materials** and
**fittings** (when included), plus preliminaries, fees, contingency and VAT — and state
plainly whether fittings are in or out.

## Price calibration & sources

The default price book is calibrated from **publicly available 2026 UK cost data** (Checkatrade,
HomeOwners Alliance, MyBuilder and trade-guide ranges) blended with **judgement about how
Better Homes builds a quote** (the `TemplateService` model already splits tradesperson vs
material cost, which this mirrors).

> **Note on live quote data:** the calculator cannot read the production MongoDB at build time,
> so the shipped defaults are market-anchored. The intended workflow is that BHS reconciles the
> defaults against **won quotes in the `Quote` / `Project` collections** and tunes them through
> the new **admin rate editor** (`/admin/renovation-calculator-rates`). Because overrides live
> in the database, retuning needs no code deploy.

## Admin-editable rates

- New `CalculatorRates` model stores a per-calculator override document.
- `/admin/renovation-calculator-rates` lets an admin edit base £/m² rates, room
  labour/materials/fittings, systems, finishing, preliminaries, fees, contingency, VAT and
  regional multipliers, then save. Overrides are deep-merged over the code defaults, so any
  field left untouched keeps its shipped value, and "Reset" restores defaults.
- The public calculator and the server-side recalculation both load the merged **effective**
  config, so the on-page estimate, the PDF, and the stored lead all agree.

## Lead capture

- Leads are still saved exactly as before (`/api/renovation-calculator-leads` → `Lead`
  with `customSource: "Renovation Calculator"`).
- The stored submission now keeps the **full set of answers** the client entered (every wizard
  field, including the fittings toggle and VAT treatment) plus a **human-readable labelled
  summary**, so the team can see precisely what was asked for. Visible in
  `/admin/renovation-calculator-leads`.

## Files touched

- `app/renovation-calculator/lib/config.js` — restructured price book + new option lists.
- `app/renovation-calculator/lib/costEngine.js` — rebuilt engine (config injection, fittings
  toggle, prelims, VAT treatments, component totals).
- `app/renovation-calculator/lib/rates.js` — deep-merge of overrides over defaults.
- `models/CalculatorRates.js` + `models/index.js` — override storage.
- `app/api/admin/calculator-rates/route.js` — admin GET/PUT.
- `app/api/renovation-calculator/rates/route.js` — public effective-config GET.
- `app/admin/renovation-calculator-rates/page.js` + client editor.
- `app/admin/components/AdminSidebar.js` — nav link.
- Wizard: `StepEstimateOptions.jsx` (new), `StepFinish.jsx`, `page.jsx`.
- `components/ResultCard.jsx`, `lib/pdfGenerator.js` — split-aware output.
- `app/api/renovation-calculator-leads/route.js` + `app/admin/renovation-calculator-leads/page.js`
  — full-answer capture + display.

## Follow-ups (not in this pass)

- Back-calibrate the defaults against real won quotes via the admin editor.
- Per-room size sensitivity (kitchen/bathroom sized rather than tiered only).
- Feedback loop comparing calculator estimates to eventual won-quote values.
- Share one price book across the kitchen / bathroom calculators.

## Extension calculator — same makeover

The house extension calculator (`app/extension-calculator`) received the same treatment,
adapted to its per-m² build model:

- **Fittings split, default OFF.** Each `baseBuildRates` entry is now split into
  `{ labour, materials, fittings }` per m², and every optional extra is tagged
  `category: "build" | "fittings"` (kitchen, bathrooms, bi-folds, bespoke joinery, premium
  flooring are fittings). The new "Estimate options" step defaults to **structural build +
  construction materials only**; opting in adds the internal-finish portion of the build plus
  any fittings-category extras. Excluded fittings extras are still listed (struck through /
  flagged) so nothing is hidden. Existing rate totals were preserved (the split sums to the
  previous per-m² figures), so the calibration is unchanged — only the structure and the
  opt-out are new.
- **VAT treatment** choice (20% / 5% / 0%), same as renovation.
- **Admin-editable rates.** The rate infrastructure was generalised by `calculatorType`: the
  `CalculatorRates` model already keys per type, the admin API (`/api/admin/calculator-rates`)
  and the recursive `RatesEditor` now take a `type`, and there's a public
  `/api/extension-calculator/rates` plus an admin page at `/admin/extension-calculator-rates`
  (sidebar link added). Renovation behaviour is unchanged (it stays the default type).
- **Full answers on the lead.** `/api/leads` (which serves the extension calculator)
  recalculates with the merged config and stores the full labelled set of answers — including
  the fittings toggle, VAT treatment, selected extras and planning fees — shown in
  `/admin/extension-calculator-leads`.
- The result card and PDF gained the same "where the money goes" make-up (build / fittings /
  fees / contingency) and the excluded-items note.

### Extension files touched

- `app/extension-calculator/lib/config.js` — component split, feature categories, VAT
  treatments, fittings/VAT option lists.
- `app/extension-calculator/lib/costEngine.js` — config injection, fittings toggle, VAT
  treatments, component roll-up.
- `app/extension-calculator/lib/rates.js` — effective-config merge.
- `libs/extensionRates.js` — server loader for the merged config/engine.
- `app/api/extension-calculator/rates/route.js` — public effective-config GET.
- `app/admin/extension-calculator-rates/page.js` — admin editor (reuses `RatesEditor`).
- `app/api/admin/calculator-rates/route.js` — generalised by `type`.
- `app/admin/renovation-calculator-rates/components/RatesEditor.js` — `calculatorType` prop.
- Wizard: `StepEstimateOptions.jsx` (new), `StepFinish.jsx`, `page.jsx`.
- `components/ResultCard.jsx`, `lib/pdfGenerator.js` — split-aware output.
- `app/api/leads/route.js` + `app/admin/extension-calculator-leads/page.js` — full-answer capture + display.
