/**
 * Responsive + quality QA pass.
 *
 * Loads each route at the four required breakpoints and reports:
 *   - horizontal overflow (page must never scroll sideways)
 *   - console errors
 *   - images missing alt text
 *   - tap targets under 44px
 *   - broken internal links (checked once, not per breakpoint)
 *
 * Screenshots land in scripts/qa-shots/.
 *
 * Usage: node scripts/qa.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || "http://localhost:3000";
const SHOTS = join(__dirname, "qa-shots");
mkdirSync(SHOTS, { recursive: true });

const BREAKPOINTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
];

const ROUTES = process.env.QA_ROUTES
  ? process.env.QA_ROUTES.split(",")
  : [
      "/",
      "/products",
      "/products/head-protection",
      "/products/head-protection/helmet",
      "/product/vista-8000-series",
      "/about",
      "/contact",
    ];

const browser = await chromium.launch();
const report = [];
let failures = 0;

for (const route of ROUTES) {
  for (const bp of BREAKPOINTS) {
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      deviceScaleFactor: 1,
      isMobile: bp.width < 768,
      hasTouch: bp.width < 768,
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

    const failedRequests = [];
    page.on("requestfailed", (r) =>
      failedRequests.push(`${r.url()} — ${r.failure()?.errorText}`),
    );

    let status = 0;
    try {
      // `networkidle` never settles here — Next keeps RSC prefetches in flight.
      const res = await page.goto(`${BASE}${route}`, {
        waitUntil: "load",
        timeout: 45000,
      });
      status = res?.status() ?? 0;
    } catch (err) {
      report.push({ route, bp: bp.name, error: `navigation failed: ${err.message}` });
      failures++;
      await context.close();
      continue;
    }

    // Walk the page so every scroll-reveal fires, then return to the top.
    // Without this, un-revealed sections are still held at `scale(0.95)` by
    // `.reveal.zoom`, and every measurement inside them comes back ~5% short —
    // which shows up as phantom sub-44px tap targets.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });

    // Give lazy images + reveal transitions a beat to settle.
    await page.waitForTimeout(900);

    const audit = await page.evaluate((minTap) => {
      const doc = document.documentElement;

      // Check body too: an overflow-x guard on <html> hides the symptom on
      // documentElement while the layout is still genuinely too wide.
      const overflowBy = Math.max(
        doc.scrollWidth - doc.clientWidth,
        document.body.scrollWidth - doc.clientWidth,
      );

      // Elements actually sticking out past the viewport.
      const offenders = [];
      if (overflowBy > 0) {
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > doc.clientWidth + 1 || r.left < -1) {
            offenders.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`,
            );
            if (offenders.length >= 5) break;
          }
        }
      }

      const imgs = [...document.images];
      const noAlt = imgs
        .filter((i) => !i.hasAttribute("alt"))
        .map((i) => i.currentSrc || i.src)
        .slice(0, 5);
      const brokenImgs = imgs
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src)
        .slice(0, 5);

      // Interactive targets that are too small to hit reliably on touch.
      const smallTargets = [];
      for (const el of document.querySelectorAll(
        'a[href], button, input:not([type="hidden"]), select, textarea',
      )) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const style = getComputedStyle(el);
        if (style.visibility === "hidden" || style.display === "none") continue;
        // Skip-links and other visually-hidden affordances.
        if (el.classList.contains("sr-only") || r.width <= 2 || r.height <= 2) continue;
        // Inline links inside prose are exempt — they're text, not controls.
        if (el.tagName === "A" && el.closest("p, li, address")) continue;
        if (r.height < minTap - 0.5 || r.width < minTap - 0.5) {
          smallTargets.push(
            `${el.tagName.toLowerCase()}[${(el.textContent || "").trim().slice(0, 24)}] ${Math.round(r.width)}x${Math.round(r.height)}`,
          );
          if (smallTargets.length >= 6) break;
        }
      }

      const h1s = document.querySelectorAll("h1").length;

      return {
        overflowBy,
        offenders,
        noAlt,
        brokenImgs,
        smallTargets,
        h1s,
        title: document.title,
        imgCount: imgs.length,
      };
    }, 44);

    await page.screenshot({
      path: join(SHOTS, `${route.replace(/\//g, "_") || "_home"}--${bp.name}.png`),
      fullPage: false,
    });

    const issues = [];
    if (status !== 200) issues.push(`HTTP ${status}`);
    if (audit.overflowBy > 0)
      issues.push(`H-OVERFLOW +${audit.overflowBy}px → ${audit.offenders.join(" | ")}`);
    if (audit.noAlt.length) issues.push(`MISSING ALT: ${audit.noAlt.join(", ")}`);
    if (audit.brokenImgs.length) issues.push(`BROKEN IMG: ${audit.brokenImgs.join(", ")}`);
    if (bp.width < 768 && audit.smallTargets.length)
      issues.push(`SMALL TAP: ${audit.smallTargets.join(" | ")}`);
    if (audit.h1s !== 1) issues.push(`H1 count = ${audit.h1s}`);
    if (consoleErrors.length) issues.push(`CONSOLE: ${consoleErrors.slice(0, 3).join(" | ")}`);
    if (failedRequests.length)
      issues.push(`REQ FAILED: ${failedRequests.slice(0, 3).join(" | ")}`);

    if (issues.length) failures++;
    report.push({ route, bp: bp.name, status, title: audit.title, imgCount: audit.imgCount, issues });

    await context.close();
  }
}

/* ---- internal link check (single viewport) ---- */
const linkCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const linkPage = await linkCtx.newPage();
const brokenLinks = [];
const checked = new Set();

for (const route of ROUTES) {
  await linkPage.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
  const hrefs = await linkPage.$$eval("a[href^='/']", (as) =>
    [...new Set(as.map((a) => a.getAttribute("href")))],
  );

  for (const href of hrefs) {
    if (checked.has(href)) continue;
    checked.add(href);
    const res = await linkPage.request.get(`${BASE}${href}`);
    if (res.status() >= 400) brokenLinks.push(`${href} → ${res.status()} (from ${route})`);
  }
}
await linkCtx.close();
await browser.close();

/* ---- output ---- */
let out = `QA REPORT — ${BASE}\n${"=".repeat(70)}\n\n`;
let clean = 0;

for (const r of report) {
  if (r.error) {
    out += `✗ ${r.route} @ ${r.bp}\n    ${r.error}\n`;
    continue;
  }
  if (r.issues.length === 0) {
    clean++;
    continue;
  }
  out += `✗ ${r.route} @ ${r.bp} (${r.status})\n`;
  for (const i of r.issues) out += `    ${i}\n`;
  out += "\n";
}

out += `\n${"=".repeat(70)}\n`;
out += `clean: ${clean}/${report.length} route×breakpoint combinations\n`;
out += `internal links checked: ${checked.size}, broken: ${brokenLinks.length}\n`;
for (const b of brokenLinks) out += `  ✗ ${b}\n`;
out += `\ntitles:\n`;
for (const r of report.filter((x) => x.bp === "desktop")) {
  out += `  ${r.route.padEnd(42)} ${r.title} (${r.imgCount} imgs)\n`;
}

writeFileSync(join(__dirname, "qa-report.txt"), out);
console.log(out);
process.exit(failures || brokenLinks.length ? 1 : 0);
