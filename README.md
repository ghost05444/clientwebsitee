# Krushnam Fire — Industrial Safety & Fire Protection

Product catalogue site for Krushnam Fire (Anjar, Kachchh, Gujarat). Next.js App
Router + Tailwind v4, fully statically generated: **841 products**, 14 top-level
categories, 57 subcategory pages.

The business quotes per enquiry rather than selling online, so there is no cart
or checkout anywhere — every product routes to WhatsApp, phone or the enquiry
form. This mirrors the reference site's actual behaviour.

---

## Quick start

```bash
npm install
npm run data        # build src/data/*.json from scripts/raw/
npm run images      # download + convert product images  (~35 MB, one-off)
npm run datasheets  # mirror datasheet PDFs              (~770 MB, optional)
npm run dev
```

`npm run build` writes a fully static site to `out/` — 919 prerendered pages,
no server at runtime. To preview that build exactly as it will deploy:

```bash
npm run build
npx serve out
```

---

## Deploying to Netlify

Connect the repo and Netlify reads [`netlify.toml`](netlify.toml) — build
command `npm run build`, publish directory `out`. Nothing else to configure.

**Enquiries arrive through Netlify Forms.** The form on `/contact` carries
`data-netlify="true"`, and because the page is prerendered as real HTML,
Netlify finds it at deploy time. Submissions land under **Forms** in the site
dashboard; add an email notification there (*Site settings → Forms →
Notifications*) to have them forwarded to support@krushnamfire.in. A honeypot
field (`company-website`) filters basic spam; turn on Netlify's built-in spam
filtering for more.

The free tier allows 100 submissions/month.

WhatsApp remains a one-tap alternative on the same form, and is still the
primary CTA everywhere else on the site.

### Before the first deploy

1. Set `site.url` in [`src/lib/site.ts`](src/lib/site.ts) to the real domain.
2. Decide what to do about datasheets (see below) — they are gitignored, so a
   fresh clone deploys without them and simply omits the download buttons.
3. After deploying, submit the form once and confirm it appears in the Netlify
   Forms dashboard.

### A note on `output: "export"`

The site is a pure static export, which is why it drops onto Netlify (or any
static host) with no adapter. One consequence: Next 16's link prefetching does
not work under static export for dynamic routes — it requests
`__next.products.$d$category.txt` while the build writes
`__next.products/$d$category.txt`, so every prefetch would 404.

[`src/components/Link.tsx`](src/components/Link.tsx) wraps `next/link` with
`prefetch={false}` to avoid that. Navigation is unaffected — pages are static
HTML on a CDN.

If you later want prefetching back, remove `output: "export"` from
`next.config.ts` and let Netlify's Next.js runtime serve the site; then delete
`src/components/Link.tsx` and point the imports back at `next/link`.

---

## Contact details

All client details live in one file: [`src/lib/site.ts`](src/lib/site.ts).
Phone, WhatsApp, email, address, hours and the canonical URL are read from
there by the header, footer, contact page, enquiry form, structured data and
sitemap. Change them once.

**Before launch, set `site.url`** to the real domain — it is used for canonical
URLs, OpenGraph and `sitemap.xml`.

Currently configured:

| Field   | Value                                      |
| ------- | ------------------------------------------ |
| Email   | support@krushnamfire.in                    |
| Phone   | +91 96242 00234 (also the WhatsApp number) |
| Address | Vaghamshi Vadi, Vidi Road, Anjar, Kachchh  |

> The postcode (`370110`) and opening hours (`Mon–Sat 9:30–19:00`) were assumed —
> confirm and correct them in `src/lib/site.ts`.

---

## Scripts

| Command              | What it does                                                            |
| -------------------- | ----------------------------------------------------------------------- |
| `npm run data`       | Transforms `scripts/raw/*.json` into typed catalogue data + search index |
| `npm run images`     | Downloads product images, emits 400w/900w WebP into `public/media/`      |
| `npm run datasheets` | Mirrors datasheet PDFs into `public/datasheets/`                         |
| `npm run mosaics`    | Bakes the blurred product-mosaic backdrop textures into public/bg/ |
| `npm run banner`     | Imports the client's hero artwork + logo lockup into `public/banner/`    |
| `npm run icons`      | Cuts the favicon set from the brand flame                               |
| `npm run qa`         | Playwright sweep: overflow, alt text, tap targets, console errors, links |
| `npm run ix`         | Interaction tests: drawer, search, filters, form validation              |
| `npm run crawl`      | Requests all 919 routes, fails on any non-200                            |

`banner` and `icons` read source artwork from the client's download folder; pass
a directory as the first argument to point them elsewhere.

`data`, `images` and `datasheets` are resumable — re-running skips work already
done.

---

## How the catalogue is built

`scripts/build-data.mjs` is the single transformation step. It:

- parses the scraped WooCommerce export into clean, typed records
- **strips the previous supplier's brand** from names, copy, spec values, image
  alt text and URL slugs
- extracts specs from `Label: Value` bullets, and EN/IS/ANSI standards from
  anywhere in the copy (normalised, so `EN397:2012` and `EN 397:2012` become one
  filter chip)
- **re-homes ~96 products** out of the source site's dead-end legacy taxonomy
  branches into the 14 real categories, so nothing lands in a junk drawer
- flattens a 4-level-deep taxonomy to 2 routed levels; deeper terms become
  filter chips instead, because 4 levels of nesting is unusable on a phone
- only emits a datasheet link when the PDF actually exists locally, so a
  checkout without the PDF bundle never renders a dead download button

Re-run `npm run data` after changing any of it.

### Category counts

| Category                      | Products |
| ----------------------------- | -------: |
| Workplace Safety Solutions    |      180 |
| Fall Protection               |      151 |
| Workwear & Body Protection    |      106 |
| Eye & Face Protection         |       92 |
| Hand Protection               |       63 |
| SCBA, Gas Detection & Blowers |       52 |
| Foot Protection               |       48 |
| Respiratory Protection        |       39 |
| Lifeline & Height Access      |       28 |
| Eye Wash & Safety Shower      |       24 |
| Head Protection               |       20 |
| Arc Flash & Electrical Safety |       18 |
| Hearing Protection            |       13 |
| Other Products                |        7 |

---

## Datasheets (needs a decision)

563 PDFs totalling **~770 MB**. `public/datasheets/` is gitignored — the repo
stays at ~40 MB and the PDFs are regenerated with `npm run datasheets`.

This matters for the deploy target:

- **Cloudflare Pages** rejects it — 25 MB per-file limit, and the largest PDF is
  54 MB
- **Netlify / Vercel** will carry it, but every deploy uploads 770 MB

Recommended: put the PDFs on object storage (R2, S3) and change the
`/datasheets/` prefix in `scripts/build-data.mjs` to the bucket URL. Failing
that, run `npm run datasheets` before deploying and accept the size.

If you skip the step entirely, the site builds and works — product pages simply
omit the datasheet button.

---

## Security

Headers live in [`netlify.toml`](netlify.toml) and apply to every response:
a scoped **Content-Security-Policy**, **HSTS** (2 years, subdomains, preload),
**Permissions-Policy** denying camera/mic/geolocation/payment, `nosniff`, and
`strict-origin-when-cross-origin`.

The CSP is `default-src 'none'` with allowances only for what the site actually
loads. Two notes on it:

- `script-src` includes `'unsafe-inline'`. A nonce would be stronger, but a
  static export has no server to mint one per request. The injection path that
  actually mattered is closed at the source instead — see below.
- `frame-src` allows exactly one origin, `https://www.google.com`, for the map
  embed on the contact page. `form-action 'self'` stops an injected form from
  posting anywhere but back to Netlify.

Verified with the real policy applied: **0 violations** across the home,
category, product, contact and about pages, and all 18 interaction checks still
pass — so the search-index fetch and the Netlify Forms POST are both within it.

### JSON-LD escaping

Structured data is built from product names and spec values scraped from a
third-party catalogue. `JSON.stringify` does **not** escape `<`:

```js
JSON.stringify("</script><img onerror=…>")   // -> "</script><img onerror=…>"
```

Injected with `dangerouslySetInnerHTML`, that closes the script element early
and everything after it parses as HTML. [`src/lib/jsonLd.ts`](src/lib/jsonLd.ts)
escapes `<`, `>`, `&` and the U+2028/U+2029 line terminators as unicode
sequences — semantically identical JSON, impossible to break out of. Every
`ld+json` block on the site goes through it. Verified in the built output: no
block contains a raw `<`, and all parse.

### Known advisories

`npm audit` reports 3 high-severity issues, in `postcss` and `sharp`. Both are
**build-time only** — CSS processing and image conversion. Neither reaches the
browser: the site is a static export, and grepping the shipped bundles for them
returns only the English word "sharp" inside product copy. `npm audit fix
--force` wants to change Next's major version, which is not a trade worth
making for a build-time dependency. Re-check when Next ships an update.

---

## Enquiry form

Validates client-side (name, Indian mobile format, optional email, message),
then posts to **Netlify Forms** — see the deploy section above. **Send on
WhatsApp** is offered alongside as a one-tap alternative, since that is how
this trade actually buys.

Product pages deep-link into it — `/contact?product=Vista%208000%20Series`
prefills the product field.

The form deliberately avoids `useSearchParams` (see
[`src/lib/useQueryParam.ts`](src/lib/useQueryParam.ts)): that hook forces its
subtree behind a Suspense boundary, so only the loading skeleton — not the
form — would end up in the prerendered HTML, and Netlify's build-time form
detection would find nothing.

---

## The fire-safety visual theme

The brand identity is built from assets we control, not stock photography.

- **Ember particles** ([`EmberField.tsx`](src/components/EmberField.tsx)) — a
  canvas field of embers drifting up through the hero and the closing CTA.
  Particles are pre-rendered once as sprites and blitted, rather than building
  a radial gradient per particle per frame. Pauses when off-screen or when the
  tab is hidden, and never mounts at all under `prefers-reduced-motion`.
- **Heat wash** (`.heat-base`, `.heat-top`) — layered radial gradients casting
  ember light up from the bottom edge of dark sections, with a slow breathing
  `.heat-pulse`.
- **Flame headline** (`.text-flame`) — a gradient fill that drifts across the
  glyphs. Falls back to a solid `text-brand-500` where `background-clip: text`
  is unsupported.
- **Molten seam** (`.ember-rule`) — a glowing hairline that closes the hero and
  underlines each interior page header.
- **Warm wash** (`.warm-wash`) — light sections carry a faint warm tint so the
  page stays one temperature instead of alternating hot dark slabs with
  clinical white ones.
- **Product mosaic** ([`ProductMosaic.tsx`](src/components/ProductMosaic.tsx)) —
  abstract industrial texture behind dark sections.

### Why the backdrops are not stock photos

Stock imagery was tried and rejected. Filtering to licences that carry no
attribution requirement (CC0 / public domain) leaves a pool with almost nothing
on-brand for this trade — the best matches returned were a Belgian fire
brigade's liveried truck and a Scandinavian jetty at night. Either would look
worse on a Gujarati PPE supplier's site than no photo at all.

Instead the backdrops are generated from the client's own ~1900 product shots
by [`scripts/build-mosaics.mjs`](scripts/build-mosaics.mjs), which tiles them,
blurs them into abstract texture and writes three ~7KB WebP files. On-domain by
definition, no licensing questions, and it reuses images the site already ships.

Two things that script gets right and are easy to get wrong:

- The blur is a **second sharp pass** over a flattened buffer. sharp applies
  `composite` at the end of a pipeline, so `.composite(tiles).blur()` blurs the
  blank base and paints sharp tiles on top — the mosaic came out as a fully
  legible product grid.
- Tiles are filtered by **image entropy**. The catalogue contains a few
  near-blank shots, including a literal "No image available" graphic, which are
  invisible in a product grid but obvious as flat rectangles in a mosaic.

### Performance

The blur is baked at build time rather than applied with a CSS `filter`, and
the ambient glows are radial gradients rather than `blur-[120px]` on a solid
circle. Both started life as runtime filters; because the elements drift, the
compositor re-blurred them every frame.

Note for anyone re-measuring: **headless Chromium reports misleading frame
rates.** The same page measured 19fps by default and 103fps with
`--disable-gpu-vsync --disable-frame-rate-limit`, on the same software
renderer. Profile with those flags, or in a real browser, before chasing a
regression that isn't there.

---

## Mobile-first notes

- Hamburger drawer with per-category accordions; body scroll locks while open,
  and the parked panel is `inert` so screen readers don't announce a duplicate
  nav
- Fixed bottom call/WhatsApp bar on mobile, clear of the iOS home indicator
- All interactive targets ≥ 44 px; nothing is hover-only
- Grids reflow 2 → 3 → 4 columns; images are fixed-ratio with explicit
  dimensions, so there is no layout shift
- 16 px form inputs to stop iOS zoom-on-focus
- `overflow-x: clip` (not `hidden`) on the root — `hidden` would silently break
  every `position: sticky` on the page

Verified at 375 / 768 / 1024 / 1440 px by `npm run qa`.

---

## Content provenance

Product data, copy and imagery are reused from udyogisafety.com with the
client's stated permission. The previous supplier's brand has been removed from
all text, slugs and alt text.

**Not automatable — check before launch:** some product photographs have the
original manufacturer's logo printed on the product itself or embedded in the
image. Review `public/media/` and replace any that are unsuitable.
