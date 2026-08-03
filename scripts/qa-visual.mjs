/**
 * Visual confirmation that the Phase 3 effects actually engage — "no console
 * errors" does not prove a transform ever ran.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "scripts/qa-shots/phase3";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const results = [];

/* ---- 1. Lenis active on desktop ------------------------------------- */
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
results.push(["lenis mounted", await page.evaluate(() => document.documentElement.classList.contains("lenis"))]);

/* ---- 2. Parallax writes a transform --------------------------------- */
await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(500);
const parallax = await page.evaluate(() => {
  const el = document.querySelector("[data-parallax]");
  return el ? getComputedStyle(el).transform : "NONE";
});
results.push(["parallax transform applied", parallax !== "NONE" && parallax !== "none"]);

/* ---- 3. Scroll velocity published ----------------------------------- */
const velSeen = await page.evaluate(async () => {
  let seen = 0;
  for (let i = 0; i < 40; i++) {
    window.scrollBy(0, 60);
    const v = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--scroll-velocity"),
    );
    if (Math.abs(v) > Math.abs(seen)) seen = v;
    await new Promise((r) => requestAnimationFrame(r));
  }
  return seen;
});
results.push([`--scroll-velocity moved (peak ${velSeen})`, Math.abs(velSeen) > 0.001]);

/* ---- 4. Word cascade split ------------------------------------------ */
await page.goto(BASE + "/about/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
const words = await page.evaluate(() => {
  const el = document.querySelector("[data-words]");
  return { split: el?.dataset.split, spans: el?.querySelectorAll(".w").length ?? 0 };
});
results.push([`data-words split into ${words.spans} spans`, words.split === "true" && words.spans > 5]);
await page.screenshot({ path: `${OUT}/about-hero.png` });

/* ---- 5. Kinetic marquee renders ------------------------------------- */
const marquee = await page.evaluate(() => {
  const band = document.querySelector(".kinetic-band");
  if (!band) return null;
  const track = band.querySelector(".marquee-track");
  return {
    animation: track ? getComputedStyle(track).animationName : "none",
    stroke: getComputedStyle(band.querySelector(".text-outline")).webkitTextStrokeWidth,
    fill: getComputedStyle(band.querySelector(".text-outline")).webkitTextFillColor,
  };
});
results.push(["marquee animating", marquee?.animation === "marquee"]);
results.push([`outline stroke ${marquee?.stroke}, fill ${marquee?.fill}`, marquee?.stroke === "1.5px"]);

/* ---- 6. Horizontal showcase engages on desktop ---------------------- */
await page.goto(BASE + "/solutions/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
const beforeX = await page.evaluate(() => {
  const t = document.querySelector(".will-change-transform");
  return t ? getComputedStyle(t).transform : "NO TRACK";
});
await page.evaluate(() => window.scrollTo(0, 2200));
await page.waitForTimeout(600);
const afterX = await page.evaluate(() => {
  const t = document.querySelector(".will-change-transform");
  return t ? getComputedStyle(t).transform : "NO TRACK";
});
results.push([`showcase track moved (${beforeX} -> ${afterX})`, beforeX !== afterX && afterX !== "NO TRACK"]);
await page.screenshot({ path: `${OUT}/solutions-showcase.png` });

/* ---- 7. ScrollSteps activates --------------------------------------- */
await page.goto(BASE + "/services/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, 3000));
await page.waitForTimeout(700);
const railFilled = await page.evaluate(() => {
  const bars = [...document.querySelectorAll("ol.flex.gap-1\\.5 li")];
  return bars.filter((b) => getComputedStyle(b).backgroundColor.includes("220, 31, 31")).length;
});
results.push([`scrollsteps progress bars filled: ${railFilled}`, railFilled > 0]);
await page.screenshot({ path: `${OUT}/services-scrollsteps.png` });

/* ---- 8. Footer reveal ------------------------------------------------ */
const footerStyles = await page.evaluate(() => {
  const f = document.querySelector(".footer-reveal-footer");
  const m = document.querySelector(".footer-reveal-main");
  return {
    footerPos: getComputedStyle(f).position,
    mainPos: getComputedStyle(m).position,
    mainBg: getComputedStyle(m).backgroundColor,
  };
});
results.push([
  `footer sticky=${footerStyles.footerPos}, main=${footerStyles.mainPos}/${footerStyles.mainBg}`,
  footerStyles.footerPos === "sticky" && footerStyles.mainBg === "rgb(255, 255, 255)",
]);

/* ---- 9. Rotating word does not shift layout -------------------------- */
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
const w1 = await page.evaluate(() => {
  const el = document.querySelector("h1");
  return el.getBoundingClientRect().width + "x" + el.getBoundingClientRect().height;
});
await page.waitForTimeout(5200); // two rotations
const w2 = await page.evaluate(() => {
  const el = document.querySelector("h1");
  return el.getBoundingClientRect().width + "x" + el.getBoundingClientRect().height;
});
results.push([`h1 stable across rotation (${w1} -> ${w2})`, w1 === w2]);
await page.screenshot({ path: `${OUT}/home-hero.png` });

/* ---- 10. Mobile showcase fallback ----------------------------------- */
const mob = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const mp = await mob.newPage();
await mp.goto(BASE + "/solutions/", { waitUntil: "networkidle" });
await mp.waitForTimeout(600);
const mobileMode = await mp.evaluate(() => ({
  track: !!document.querySelector(".will-change-transform"),
  grid: !!document.querySelector("ul.grid"),
}));
results.push(["mobile falls back to grid", !mobileMode.track && mobileMode.grid]);
await mp.screenshot({ path: `${OUT}/solutions-mobile.png`, fullPage: false });

await browser.close();

console.log("\n=========== PHASE 3 EFFECTS ===========");
let bad = 0;
for (const [label, ok] of results) {
  console.log(`${ok ? "  ok " : "  FAIL"}  ${label}`);
  if (!ok) bad++;
}
console.log(bad ? `\n${bad} effect(s) not working` : "\nAll effects confirmed working.");
console.log(`Screenshots: ${OUT}`);
process.exit(bad ? 1 : 0);
