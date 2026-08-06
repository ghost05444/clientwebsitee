# Deploying

The site is a static export. There is no server, no database and no
environment variables to set. Pick either route below — both give the same
result, including the security headers and caching rules, because those live
in `public/_headers` and are copied into the build output.

## Option A — drag and drop (no tools needed)

1. Go to https://app.netlify.com/drop
2. Drag the **`out`** folder onto the page.

That is the whole process. The site is live on a `*.netlify.app` address
straight away.

To use a custom domain: **Site configuration → Domain management → Add a
domain**. Netlify issues the HTTPS certificate automatically.

To update later, drag the `out` folder onto the same site's **Deploys** tab.

## Option B — connect the Git repository

1. **Add new site → Import an existing project**, and pick the repository.
2. Leave the build settings alone — `netlify.toml` already sets them
   (`npm run build`, publish `out`, Node 22).

Every push to `main` then rebuilds and redeploys automatically.

---

## Enquiry form

The contact form posts to **Netlify Forms** — no backend, nothing to
configure. Submissions appear under **Forms** in the Netlify dashboard.

Turn on email alerts at **Forms → Form notifications → Add notification →
Email notification**, so enquiries reach an inbox instead of only the
dashboard. Worth sending one test enquiry after the first deploy to confirm
it arrives.

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
