# Mobile performance evidence — 14 September 2026

Chrome, 390 × 844, 4× CPU slowdown, 150 ms latency, 1.6 Mbps download, 0.75 Mbps upload, cache disabled, fresh unset consent. Three runs per route; observation ends four seconds after load. Values below are medians.

This is a browser lab comparison of the live production site and a local production build. Hosting/network origins differ, so the loading-time difference does not establish a speed improvement for a deployed redesign. The before column is the earlier local redesign build, not the old production design. No CrUX/GSC field data or representative INP sample is available. No field pass is claimed.

| Route | Earlier local LCP (ms) | Current local LCP (ms) | Live LCP (ms) | Local CLS | Live CLS | Local long-task excess (ms) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 1548 | 1328 | 2220 | 0.0001 | 0.0006 | 157 |
| `/blog/home-renovation-cost-london-2026` | 1372 | 1300 | 2332 | 0.0010 | 0.0001 | 150 |
| `/house-extension` | 1428 | 1336 | 2116 | 0.0001 | 0.0001 | 148 |
| `/locations/hackney` | 1252 | 1224 | 1992 | 0.0009 | 0.0001 | 141 |
| `/renovation-calculator` | 1428 | 1364 | 2416 | 0.0004 | 0.0195 | 153 |

All 45 page loads returned 200 without horizontal overflow. No large layout-shift regression was observed. Long-task excess is the sum of task durations above 50 ms during this observation window, not a Lighthouse TBT score or INP. Hero images/text remain the LCP candidates recorded per run in the raw JSON. Image quality was not reduced to improve these numbers.

The final subsequent edits restore a footer fragment, add a contextual service-area link, correct a quotation fallback and improve server-side enquiry recovery. These do not establish a hosted performance result; repeat this procedure on the hosting preview before release.

Run `node scripts/seo/performance.cjs ORIGIN LABEL` with Playwright installed or `PLAYWRIGHT_MODULE` pointing to an available module. Set `SEO_EVIDENCE_DIR` to an existing output directory. The script uses installed Chrome.
