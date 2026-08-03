/**
 * Exercises the interactive surfaces that static page loads never touch:
 * mobile drawer, search dialog, category filters and form validation.
 *
 * Usage: node scripts/interaction-test.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || "http://localhost:3000";
const SHOTS = join(__dirname, "qa-shots");
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();
const results = [];
const shot = (page, name) => page.screenshot({ path: join(SHOTS, `ix-${name}.png`) });

function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

/* ---------------- Mobile drawer ---------------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });

  await page.getByLabel("Open menu").tap();
  await page.waitForTimeout(450);

  const drawer = page.getByRole("dialog", { name: "Menu" });
  check("drawer opens", await drawer.isVisible());

  const box = await drawer.boundingBox();
  check(
    "drawer sits inside viewport",
    !!box && box.x >= 0 && box.x + box.width <= 376,
    box ? `x=${Math.round(box.x)} w=${Math.round(box.width)}` : "no box",
  );

  // Expand a category accordion.
  await page.getByLabel(/Expand Head Protection/i).tap();
  await page.waitForTimeout(300);
  const sub = page.getByRole("link", { name: /^Helmet/ }).first();
  check("category expands to subcategories", await sub.isVisible());

  await shot(page, "drawer-open");

  // Body must not scroll behind the drawer.
  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  check("body scroll locked while drawer open", bodyOverflow === "hidden", bodyOverflow);

  await page.getByLabel("Close menu").tap();
  await page.waitForTimeout(550);

  // The panel stays mounted (so it can animate) but must be parked off-screen
  // and inert — that, not display:none, is what "closed" means here.
  const closed = await page.evaluate(() => {
    const el = document.querySelector('[role="dialog"][aria-label="Menu"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), inert: el.hasAttribute("inert") };
  });
  check(
    "drawer closes (off-screen + inert)",
    !!closed && closed.x >= 375 && closed.inert,
    closed ? `x=${closed.x} inert=${closed.inert}` : "not found",
  );

  const afterClose = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  check(
    "no horizontal overflow after close",
    afterClose.body <= afterClose.client,
    `body=${afterClose.body} client=${afterClose.client}`,
  );

  await ctx.close();
}

/* ---------------- Search ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });

  await page.getByLabel("Search products").first().tap();
  await page.waitForTimeout(400);

  const input = page.getByPlaceholder(/Search helmets/i);
  check("search dialog opens", await input.isVisible());

  await input.fill("helmet");
  await page.waitForTimeout(700);

  const hits = await page.locator("a[href^='/product/']").count();
  check("search returns results", hits > 0, `${hits} hits for "helmet"`);
  await shot(page, "search-results");

  await input.fill("zzzznotathing");
  await page.waitForTimeout(600);
  const empty = await page.getByText(/No products match/i).isVisible();
  check("search shows empty state", empty);

  await input.fill("vista");
  await page.waitForTimeout(700);
  const first = page.locator("a[href^='/product/']").first();
  const href = await first.getAttribute("href");
  await first.tap();
  await page.waitForURL(/\/product\//, { timeout: 10000 });
  check("search result navigates", page.url().includes("/product/"), href ?? "");

  await ctx.close();
}

/* ---------------- Category filters ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/products/head-protection`, { waitUntil: "load" });
  await page.waitForTimeout(400);

  const countText = () => page.getByText(/Showing \d+ of \d+ products/).textContent();
  const before = await countText();

  await page.getByRole("button", { name: /^Filters/ }).tap();
  await page.waitForTimeout(300);

  const chip = page.getByRole("button", { name: /^Bump Cap/ }).first();
  await chip.tap();
  await page.waitForTimeout(400);

  const after = await countText();
  check("subcategory filter narrows results", before !== after, `${before} -> ${after}`);
  await shot(page, "filter-applied");

  await page.getByRole("button", { name: /Clear filters/ }).first().tap();
  await page.waitForTimeout(400);
  check("clear filters restores list", (await countText()) === before);

  // Text filter
  await page.getByPlaceholder(/Filter in this category/i).fill("bump");
  await page.waitForTimeout(500);
  const filtered = await countText();
  check("text filter works", filtered !== before, filtered ?? "");

  await ctx.close();
}

/* ---------------- Enquiry form validation ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/contact`, { waitUntil: "load" });
  await page.waitForTimeout(500);

  await page.getByRole("button", { name: /Send on WhatsApp/i }).tap();
  await page.waitForTimeout(400);

  const nameErr = await page.getByText(/Please enter your name/i).isVisible();
  const phoneErr = await page.getByText(/We need a phone number/i).isVisible();
  const msgErr = await page.getByText(/Tell us what you need\./i).isVisible();
  check("empty submit blocked with errors", nameErr && phoneErr && msgErr);
  await shot(page, "form-errors");

  await page.getByLabel(/Your name/i).fill("Test Buyer");
  await page.getByLabel(/Phone \/ WhatsApp/i).fill("12345");
  await page.getByLabel(/What do you need/i).click();
  await page.waitForTimeout(300);
  check("invalid phone rejected", await page.getByText(/valid 10-digit/i).isVisible());

  await page.getByLabel(/Phone \/ WhatsApp/i).fill("9876543210");
  await page.getByLabel(/^Email$/i).fill("not-an-email");
  await page.getByLabel(/What do you need/i).click();
  await page.waitForTimeout(300);
  check("invalid email rejected", await page.getByText(/doesn't look right/i).isVisible());

  await page.getByLabel(/^Email$/i).fill("buyer@example.com");
  await page.getByLabel(/What do you need/i).fill("Need 50 helmets to EN 397 for our plant.");
  await page.waitForTimeout(300);

  // Scope to the form — Next renders its own route announcer with role=alert.
  const errorsLeft = await page.locator("form [role='alert']").count();
  check("valid input clears all errors", errorsLeft === 0, `${errorsLeft} remaining`);

  // Product deep-link prefills the form.
  await page.goto(`${BASE}/contact?product=Vista%208000%20Series`, { waitUntil: "load" });
  await page.waitForTimeout(600);
  const prefilled = await page.getByLabel(/Product of interest/i).inputValue();
  check("product deep-link prefills form", prefilled === "Vista 8000 Series", prefilled);

  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} interaction checks passed`);
process.exit(failed.length ? 1 : 0);
