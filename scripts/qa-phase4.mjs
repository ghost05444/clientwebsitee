/**
 * Phase 4 QA gate.
 *
 * Drives the installed Chrome (Playwright's own browser download is blocked
 * on this machine) across every route, checking:
 *   4 — reduced motion: nothing stuck at opacity 0, no Lenis, marquees static
 *   5 — 390px: no horizontal scroll, showcase falls back, tap targets >= 44px
 *   6 — keyboard: Solutions dropdown opens on focus, details toggle
 *   7 — unique title + description, Article JSON-LD on articles
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";

const ROUTES = [
  "/",
  "/solutions",
  "/solutions/confined-space-entry-rescue",
  "/solutions/heat-protection",
  "/services",
  "/blog",
  "/blog/reading-en-388-glove-markings",
  "/about",
  "/standards",
  "/products",
  "/products/head-protection",
  "/products/head-protection/helmet",
  "/product/vista-8000-series",
  "/contact",
  "/this-route-does-not-exist",
];

const browser = await chromium.launch({ channel: "chrome" });
const problems = [];
const meta = new Map();

const note = (route, mode, msg) => {
  problems.push(`${route} [${mode}] ${msg}`);
  console.log(`  ✗ ${mode}: ${msg}`);
};

/* ------------------------------------------------------------------ */
/* 5 — 390px mobile pass                                               */
/* ------------------------------------------------------------------ */
console.log("\n=== 390px viewport ===");
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });

  for (const route of ROUTES) {
    console.log(route);
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return { scrollW: de.scrollWidth, clientW: de.clientWidth };
    });
    if (overflow.scrollW > overflow.clientW + 1) {
      note(route, "390", `horizontal scroll ${overflow.scrollW} > ${overflow.clientW}`);
      const culprits = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.right > document.documentElement.clientWidth + 1 && r.width > 0) {
            out.push(`${el.tagName}.${(el.className || "").toString().slice(0, 70)} right=${Math.round(r.right)}`);
          }
        }
        return out.slice(0, 6);
      });
      culprits.forEach((c) => console.log(`      -> ${c}`));
    }

    // Horizontal showcase must not be in horizontal mode on touch.
    if (route === "/solutions") {
      const gridFallback = await page.evaluate(
        () => !!document.querySelector("ul.grid"),
      );
      if (!gridFallback) note(route, "390", "showcase did not fall back to grid");
    }

    // Tap targets.
    const small = await page.evaluate(() => {
      const out = [];
      const sel = "a[href], button, summary, input, select, textarea";
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const style = getComputedStyle(el);
        if (style.visibility === "hidden" || style.display === "none") continue;
        // Screen-reader-only affordances (the skip link) are deliberately
        // 1x1 until focused — they are not touch targets.
        if (el.closest(".sr-only") || (r.width <= 2 && r.height <= 2)) continue;
        if (r.height < 44 && r.width < 44) {
          out.push(`${el.tagName} "${(el.textContent || "").trim().slice(0, 28)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return out.slice(0, 8);
    });
    if (small.length) note(route, "390", `tap targets < 44px: ${small.join(" | ")}`);

    // The deliberately-missing route is *expected* to log a 404; that is the
    // behaviour under test, not a defect.
    const unexpected =
      route === "/this-route-does-not-exist"
        ? errors.filter((e) => !e.includes("404"))
        : errors;
    if (unexpected.length) {
      note(route, "390", `console errors: ${unexpected.slice(0, 3).join(" | ")}`);
    }

    // Metadata (collected once, here).
    const m = await page.evaluate(() => ({
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? "",
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((s) => {
          try {
            return JSON.parse(s.textContent)["@type"];
          } catch {
            return "INVALID";
          }
        }),
    }));
    meta.set(route, m);

    await page.close();
  }
  await ctx.close();
}

/* ------------------------------------------------------------------ */
/* 4 — reduced motion                                                  */
/* ------------------------------------------------------------------ */
console.log("\n=== reduced motion (1440px) ===");
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });

  for (const route of ROUTES) {
    console.log(route);
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Nothing meaningful may sit invisible.
    const hidden = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll(".reveal, [data-words], .w, .hero-line > span, .hero-fade")) {
        const s = getComputedStyle(el);
        const text = (el.textContent || "").trim();
        if (!text) continue;
        if (parseFloat(s.opacity) < 0.99) {
          out.push(`${el.tagName}.${(el.className || "").toString().slice(0, 40)} opacity=${s.opacity} "${text.slice(0, 30)}"`);
        }
      }
      return out.slice(0, 8);
    });
    if (hidden.length) note(route, "reduced", `invisible content: ${hidden.join(" | ")}`);

    // Lenis must not be running.
    const lenis = await page.evaluate(() =>
      document.documentElement.classList.contains("lenis"),
    );
    if (lenis) note(route, "reduced", "Lenis active under reduced motion");

    // Marquee tracks must be static.
    const animating = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll(".marquee-track")) {
        if (getComputedStyle(el).animationName !== "none") out.push("marquee running");
      }
      return out;
    });
    if (animating.length) note(route, "reduced", animating.join(" | "));

    await page.close();
  }
  await ctx.close();
}

/* ------------------------------------------------------------------ */
/* 6 — keyboard                                                        */
/* ------------------------------------------------------------------ */
console.log("\n=== keyboard (1440px) ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  // Skip link should be the first stop.
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
  if (!/skip to content/i.test(first || "")) {
    note("/", "keyboard", `first tab stop was "${first}", expected skip link`);
  }

  // Focus the Solutions row and confirm the panel opens.
  // `trailingSlash: true` means every rendered href ends in "/".
  const solutionsLink = page.locator('header nav a[href="/solutions/"]').first();
  await solutionsLink.focus();
  await page.waitForTimeout(250);
  // A panel link is deeper than the nav row's own "/solutions/".
  const panelOpen = await page.evaluate(
    () =>
      [...document.querySelectorAll('header a[href^="/solutions/"]')].some(
        (a) => a.getAttribute("href").length > "/solutions/".length,
      ),
  );
  if (!panelOpen) note("/", "keyboard", "Solutions dropdown did not open on focus");
  const expanded = await solutionsLink.getAttribute("aria-expanded");
  if (expanded !== "true") note("/", "keyboard", `aria-expanded=${expanded} after focus`);

  await page.close();

  // FAQ <details> toggles by keyboard.
  const faq = await ctx.newPage();
  await faq.goto(BASE + "/solutions/heat-protection", { waitUntil: "networkidle" });
  const summary = faq.locator("summary").first();
  await summary.focus();
  await faq.keyboard.press("Enter");
  await faq.waitForTimeout(150);
  const open = await faq.evaluate(() => document.querySelector("details")?.open);
  if (!open) note("/solutions/heat-protection", "keyboard", "FAQ details did not open on Enter");
  await faq.close();

  await ctx.close();
}

/* ------------------------------------------------------------------ */
/* 7 — metadata uniqueness + JSON-LD                                   */
/* ------------------------------------------------------------------ */
console.log("\n=== metadata ===");
{
  const titles = new Map();
  const descs = new Map();
  for (const [route, m] of meta) {
    if (!m.title) problems.push(`${route} [meta] missing title`);
    if (!m.desc) problems.push(`${route} [meta] missing description`);
    if (titles.has(m.title)) problems.push(`${route} [meta] duplicate title with ${titles.get(m.title)}: "${m.title}"`);
    else titles.set(m.title, route);
    if (m.desc && descs.has(m.desc)) problems.push(`${route} [meta] duplicate description with ${descs.get(m.desc)}`);
    else if (m.desc) descs.set(m.desc, route);
  }

  const article = meta.get("/blog/reading-en-388-glove-markings");
  if (!article?.ld.includes("Article")) {
    problems.push("/blog/[slug] [meta] missing Article JSON-LD");
  }
  const solution = meta.get("/solutions/heat-protection");
  if (!solution?.ld.includes("FAQPage")) {
    problems.push("/solutions/[slug] [meta] missing FAQPage JSON-LD");
  }
  for (const [route, m] of meta) {
    if (m.ld.includes("INVALID")) problems.push(`${route} [meta] invalid JSON-LD`);
  }
  console.log(`  checked ${meta.size} routes`);
}

await browser.close();

console.log("\n================ RESULT ================");
if (problems.length === 0) {
  console.log("PASS — no problems found.");
} else {
  console.log(`${problems.length} problem(s):`);
  for (const p of problems) console.log(" - " + p);
}
process.exit(problems.length ? 1 : 0);
