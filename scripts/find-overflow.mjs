/** Finds elements wider than the viewport, innermost first. */
import { chromium } from "playwright";

const url = process.argv[2];
const width = Number(process.argv[3] || 375);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 812 },
  isMobile: width < 768,
  hasTouch: width < 768,
});
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(900);

const out = await page.evaluate((vw) => {
  const hits = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    if (r.right > vw + 1 || r.width > vw + 1) {
      const cs = getComputedStyle(el);
      hits.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 90),
        w: Math.round(r.width),
        right: Math.round(r.right),
        x: Math.round(r.x),
        childCount: el.children.length,
        overflowX: cs.overflowX,
        position: cs.position,
        minWidth: cs.minWidth,
        text: (el.textContent || "").trim().slice(0, 40),
      });
    }
  }
  // Innermost (fewest children) first — usually the actual cause.
  return hits.sort((a, b) => a.childCount - b.childCount).slice(0, 18);
}, width);

console.log(`viewport ${width}px — ${out.length} overflowing elements (innermost first)\n`);
for (const h of out) {
  console.log(
    `${h.tag}.${h.cls}\n   w=${h.w} x=${h.x} right=${h.right} pos=${h.position} ovf-x=${h.overflowX} minW=${h.minWidth} kids=${h.childCount}\n   "${h.text}"\n`,
  );
}
await browser.close();
