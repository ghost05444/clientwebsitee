# Deploying

The site is a **static export**: `npm run build` writes 944 prerendered HTML
pages into `out/`, and that folder is the entire website. There is no server,
no database and no environment variables to set.

That one fact decides everything below. Any host that can serve a folder will
serve this site. What does *not* work is pointing a Next.js **server** adapter
at it — there is no server build for an adapter to wrap (see
"If a Cloudflare build fails" at the end).

Security headers and caching rules live in `public/_headers`, which the build
copies to `out/_headers`. Netlify and Cloudflare both read that file, so the
headers travel with the site whichever route you pick.

---

## Option A — drag and drop (no tools needed)

1. Go to https://app.netlify.com/drop
2. Drag the **`out`** folder onto the page.

That is the whole process. The site is live on a `*.netlify.app` address
straight away.

To use a custom domain: **Site configuration → Domain management → Add a
domain**. Netlify issues the HTTPS certificate automatically.

To update later, drag the `out` folder onto the same site's **Deploys** tab.

## Option B — connect the Git repository (Netlify)

1. **Add new site → Import an existing project**, and pick the repository.
2. Leave the build settings alone — `netlify.toml` already sets them
   (`npm run build`, publish `out`, Node 22).

Every push to `main` then rebuilds and redeploys automatically.

---

## Option C — Cloudflare

Both Cloudflare routes work. **Pages is the simpler one** and needs no config
file at all.

### C1. Cloudflare Pages (recommended)

**Workers & Pages → Create → Pages → Connect to Git**, then set:

| Setting | Value |
| --- | --- |
| Framework preset | **None** |
| Build command | `npm run build` |
| Build output directory | `out` |

Framework preset must be **None**. Choosing "Next.js" makes Cloudflare run the
server adapter, which cannot work here — see the failure note below.

Pages reads `out/_headers` natively, so the security headers and caching apply
with nothing further to configure.

### C2. Cloudflare Workers

If you are deploying with `npx wrangler deploy`, `wrangler.jsonc` in the repo
root already describes the site: upload `out/` as static assets, resolve
directory URLs to their `index.html`, and serve `out/404.html` for unknown
paths.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

Change `"name"` in `wrangler.jsonc` to match the Worker in your dashboard —
otherwise a new Worker is created under that name instead of updating the
existing one.

### If a Cloudflare build fails with `pages-manifest.json`

```
Error: ENOENT: no such file or directory, open
  '.next/standalone/.next/server/pages-manifest.json'
```

This means Cloudflare decided the site is a server-rendered Next.js app and
ran the **OpenNext adapter** on it. OpenNext wraps a Next.js *server* build.
This site has no server build — `output: "export"` in `next.config.ts` emits
plain HTML — so `.next/standalone` never exists and the adapter stops there.

The site build itself is fine; the log will show `944/944` pages generated
just before the error. Only the deploy step fails.

Two ways it gets triggered, and the fix for each:

- **Pages:** framework preset set to "Next.js". Set it to **None**, output
  directory `out`.
- **Workers:** `wrangler.jsonc` missing, so `wrangler deploy` auto-detects the
  framework. Keeping that file in the repo root prevents it.

---

## Enquiry form — read this if you deploy to Cloudflare

The contact form posts to **Netlify Forms**. That is a Netlify feature, and it
is the one thing on this site that behaves differently depending on where it
is hosted.

**On Netlify** it works with no backend and nothing to configure. Submissions
appear under **Forms** in the dashboard. Turn on email alerts at **Forms →
Form notifications → Add notification → Email notification**, so enquiries
reach an inbox instead of only the dashboard.

**On Cloudflare** (or any other static host) there is nothing to receive that
POST, so submitting the form shows:

> Something went wrong sending that. Please try WhatsApp below, or email
> support@krushnamfire.in

Nothing breaks and no enquiry is silently lost — the visitor is pointed at
WhatsApp and email, which is how this trade mostly buys anyway, and WhatsApp
is the primary call to action everywhere else on the site. But the form itself
will not collect anything.

If you want a working form on Cloudflare, the least-effort option is a hosted
form endpoint (Formspree, Web3Forms and similar all give you a POST URL).
Point `fetch("/")` in `src/components/EnquiryForm.tsx` at that URL and rebuild.

**Either way, send one test enquiry after the first deploy** and confirm what
happens — that tells you in ten seconds which of the two behaviours you have.

## Product datasheet PDFs

Datasheet download buttons appear only on products whose PDF is present, so
nothing is broken without them — those products simply have no datasheet
link. The PDFs are roughly 770 MB and are not included.

To add them later, run `npm run datasheets` and redeploy, or host them
elsewhere and repoint the links.

## Before pointing a real domain at it

Open `src/lib/site.ts` and check the `url` field near the top. It is
currently `https://krushnamfire.in` and feeds the canonical tags, sitemap and
search-engine structured data. If the live domain differs, change it there
and rebuild — otherwise search engines are told the wrong address.

This only matters for SEO. The site itself works either way.

---

## After the first deploy — a 30-second check

```bash
# 1. Security headers are being applied (expect a Content-Security-Policy line)
curl -sI https://YOUR-DOMAIN/ | grep -i "content-security-policy"

# 2. A deep page and a product image both resolve (expect 200 twice)
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-DOMAIN/products/head-protection/
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-DOMAIN/media/2020/01/Vista-900.webp

# 3. An unknown path returns a real 404, not a 200
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-DOMAIN/no-such-page/
```

If step 1 comes back empty, the host is not reading `out/_headers`. The site
works, but without CSP and cache rules — worth fixing before launch.
