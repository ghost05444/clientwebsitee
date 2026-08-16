# How to put this website online

This website is just a folder of ready-made pages. There is no server to run,
no database to set up, and no passwords or API keys to enter.

You only need to do two things:

1. Build the site — this creates a folder called `out`
2. Upload that `out` folder to a hosting service

Pick **one** of the options below. Cloudflare is what you are using now, so
start there.

---

## Option 1 — Cloudflare Workers (what you are using)

Everything is already set up in the project. In your Cloudflare dashboard,
open your Worker and go to **Settings → Build**, then use exactly this:

| Setting | What to put |
| --- | --- |
| Build command | **leave this empty** |
| Deploy command | `npx wrangler deploy` |

Then click **Retry deployment** (or push any change to GitHub).

That's it. The site builds and goes live on its own.

### One thing you must check

Open the file `wrangler.jsonc` in the project. Near the top there is a line:

```
"name": "krushanm-web",
```

This name **must be exactly the same** as your Worker name in Cloudflare. You
can see your Worker name at the top of the dashboard page
(**Workers & Pages → your worker**).

If the two names are different, Cloudflare will say the deploy worked, but
your website will not change — because it was sent to a different place.
Just edit that line to match and save.

---

## Option 2 — Cloudflare Pages

If you prefer Pages instead of Workers:

**Workers & Pages → Create → Pages → Connect to Git**, then:

| Setting | What to put |
| --- | --- |
| Framework preset | **None** |
| Build command | `npm run build` |
| Build output directory | `out` |

> ⚠️ Framework preset must be **None**.
> If you pick "Next.js", the deploy will fail. See *Common errors* below.

---

## Option 3 — Netlify (easiest of all)

### The quick way — no tools needed

1. Go to https://app.netlify.com/drop
2. Drag the **`out`** folder onto the page

Done. The site is live straight away.

To update it later, drag the `out` folder onto the same site's **Deploys** tab.

### Or connect GitHub

**Add new site → Import an existing project** → pick the repository → click
Deploy. Everything is already configured in `netlify.toml`. Every time you
push to GitHub, the site updates automatically.

---

## Building it yourself (only if you need the `out` folder on your computer)

You need Node.js 22 or newer installed. Then, inside the project folder:

```bash
npm install      # first time only — downloads what the project needs
npm run build    # creates the "out" folder
```

The `out` folder is now the complete website. That is the folder you drag onto
Netlify, or that Cloudflare uploads for you.

---

## After it is live — a quick check

Open your website and click around a few pages. Also check these two things:

1. **Go to a page that does not exist**, for example `yoursite.com/hello123` —
   you should see the site's own "page not found" page, not a Cloudflare
   error page.

2. **Send one test enquiry** through the contact form, and see what happens.
   The next section explains what you should expect.

---

## Important: the contact form

The contact form was built for **Netlify**. This is the only part of the
website that behaves differently depending on where you host it.

**If you host on Netlify** — the form works with no setup. Messages appear in
your Netlify dashboard under **Forms**.

To also get them by email: **Forms → Form notifications → Add notification →
Email notification**. Do this, otherwise you have to remember to log in and
check.

**If you host on Cloudflare** — the form will show this message when someone
submits it:

> Something went wrong sending that. Please try WhatsApp below, or email
> support@krushnamfire.in

Nothing is broken and no customer is lost — they are pointed to WhatsApp and
email instead, and WhatsApp is the main button everywhere on the site anyway.
But the form itself will not collect anything.

**So, choose:**

- Want the form to collect messages? → host on **Netlify**
- Happy with WhatsApp, phone and email? → **Cloudflare is fine**
- Want the form working on Cloudflare? → ask your developer; it is a small
  change (about 15 minutes) to point the form at a free form service

---

## Before you connect your real domain name

Open the file `src/lib/site.ts`. Near the top you will see:

```
url: "https://krushnamfire.in",
```

If your real website address is different, change it here and build again.

This is only used by Google and other search engines to know your correct
address. The website works fine either way — but search results will point to
the wrong address if this is left incorrect.

---

## Product datasheet PDFs

Some products can have a PDF datasheet to download. These PDFs are about
770 MB in total and are **not included** in the project.

Nothing looks broken without them — products that have no PDF simply do not
show a download button.

If you want them later, ask your developer to run `npm run datasheets`.

---

## Common errors and what they mean

### "pages-manifest.json ... does not exist"

```
Error: ENOENT: no such file or directory, open
  '.next/standalone/.next/server/pages-manifest.json'
```

**Meaning:** Cloudflare thinks this is a different kind of Next.js website and
is trying to build it the wrong way.

**Fix:**
- On **Pages** — set Framework preset to **None**
- On **Workers** — make sure the file `wrangler.jsonc` exists in the project

### "assets.directory ... does not exist"

```
✘ The directory specified by the "assets.directory" field in your
  configuration file does not exist: /opt/buildhome/repo/out
```

**Meaning:** the website was never built, so there was nothing to upload.

**Fix:** make sure you are using the latest version of the project from
GitHub. The current `wrangler.jsonc` builds the site automatically. If it
still happens, set the **Build command** to `npm run build`.

### The deploy says it worked, but the website did not change

**Meaning:** it was probably sent to a different Worker.

**Fix:** check that `"name"` in `wrangler.jsonc` matches your Worker name in
Cloudflare exactly.

---

## Quick summary

| | |
| --- | --- |
| Website type | Static — just files, no server |
| Build command | `npm run build` |
| Folder to upload | `out` |
| Passwords / API keys needed | None |
| Contact form works on | Netlify only |
