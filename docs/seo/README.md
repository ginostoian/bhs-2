# Redesign SEO implementation

Started 13 September 2026 from redesign `b39b0df`. Source brief: the supplied
[implementation-backlog.md](implementation-backlog.md), retained unchanged; current
implementation states are recorded below. Its effort estimates are not execution
constraints. Implementation proceeds by dependencies and release risk.

## Old-design archive

- `old-design` and annotated tag `old-design-2026-09-13` both resolve to main
  `9a84cf6f7e02972b1142a895601c7e2343da3573`.
- Both were published with explicit approval to `https://github.com/ginostoian/bhs-2.git`
  and read back from the remote on 13 September 2026.
- Treat the branch as an archive: do not merge redesign into it or reuse it for work.
  The dated tag gives a second named reference. Git refs are still movable/deletable
  by users with permission; GitHub rules protecting both refs are not configured here.
- Inspect the original source with `git show old-design-2026-09-13:path/to/file`.
  A separate checkout of the tag can run the old site with the required environment.
- This is a source rollback reference, not a verified Vercel rollback deployment.
  Record the actual production deployment ID before launch.

## SEO-01: protected-page baseline — captured and verified locally

`baselines/2026-09-13-production/manifest.json` records a fresh public-site capture:
100 sitemap URLs plus 148 historical URLs from the 8 September GSC Pages export,
169 distinct requested URLs. All captures completed; 168 final responses are 200.
The remaining historical URL already returns 404:
`/blog/home-renovation-cost-in-london-the-complete-2026-price-guide`.
This predates these changes; assess its intent/backlinks before choosing a redirect.
No URL has been removed by this implementation.

The manifest contains final URL, HTTP status, canonical, robots meta/header,
title, description, H1 text, IDs, main content, non-script text, image references,
and internal links. Original response HTML is in `html/*.html.gz`; sitemap XML
is retained. All 169 decompressed HTML hashes were checked against the manifest.
`manifest.sha256` detects changes to the manifest. Files are a frozen dated
baseline by convention; the capture script refuses to overwrite its output directory.

`protected-pages.json` identifies all six priority URLs, their intent, before-HTML
path and explicit preservation rules. Main-source commit and live-deployment
identity are distinguished: the remote main commit is verified, the deployed
commit has not been independently established. No backlink export was supplied.
Image URLs and HTML are saved; remote image binaries are not archived separately.

Before each affected-page change, compare against the manifest and original HTML.
Keep working URLs, intent, useful sections, images and onward links. Classify
removals individually as corrected inaccuracies, deliberate consolidation or
accidental loss; correct inaccurate facts instead of treating preservation as a ban
on edits. Before merging for release, resolve accidental losses and justify every
URL removal/redirect, including historical destinations outside the sitemap.

To read a before page, locate its `html` field then use:

```sh
gzip -dc docs/seo/baselines/2026-09-13-production/html/FILE.html.gz
```

To make a later independent baseline, select a **new** output directory:

```sh
python3 scripts/seo/capture-baseline.py --gsc /path/to/Pages.csv \
  --output docs/seo/baselines/NEW-DATED-DIRECTORY --source-commit FULL_COMMIT
```

## Current batch

The requested sequence SEO-04, 05, 07, 02, 03, 20, 22 and 26 is tracked in
[launch-checks.md](launch-checks.md), including implementation, validation and
external release gates. Confirmed guarantee terms and other claim evidence are in
[business-facts.md](business-facts.md). The source backlog remains unchanged.

SEO-06 crawlable extension panels and SEO-13 fragment fixes remain in this branch.
Four utility form URLs now remain accessible but are noindex and omitted from the
sitemap; the generated sitemap has 97 URLs. The historical renovation-guide alias
now permanently redirects to the established guide with matching intent.

No redesign changes have been pushed, merged into main or deployed. Local checks
are not a claim of production measurement or readiness to release.

## Fragment regression check

The checker parses IDs and links from HTML, excluding scripts, decodes fragments,
and distinguishes failed pages from missing anchors:

```sh
python3 scripts/seo/check-fragments.py \
  http://127.0.0.1:3000/blog/kitchen-providers-comparison-guide \
  http://127.0.0.1:3000/blog/kitchen-renovation-full-guide-2025
```
