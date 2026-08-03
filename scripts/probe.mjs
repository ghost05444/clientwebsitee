/** Ad-hoc layout probe: measures specific elements at a given viewport. */
import { chromium } from "playwright";

const url = process.argv[2];
const width = Number(process.argv[3] || 375);
const height = Number(process.argv[4] || 812);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height },
  isMobile: width < 768,
  hasTouch: width < 768,
});

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);
// Force lazy images into view so we can see their real state.
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

const info = await page.evaluate(() => {
  const doc = document.documentElement;
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      sel,
      x: Math.round(r.x),
      w: Math.round(r.width),
      h: Math.round(r.height),
      right: Math.round(r.right),
    };
  };

  const thumbs = [...document.querySelectorAll("ul li button img")].map((i) => ({
    src: i.currentSrc?.split("/").pop(),
    natural: `${i.naturalWidth}x${i.naturalHeight}`,
    shown: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}`,
    complete: i.complete,
  }));

  const main = document.querySelector("article img");

  return {
    viewport: `${doc.clientWidth}x${doc.clientHeight}`,
    scrollWidth: doc.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    gallery: pick("article > div > div:first-child"),
    galleryBox: pick("article .rounded-2xl"),
    mainImg: main
      ? {
          w: Math.round(main.getBoundingClientRect().width),
          h: Math.round(main.getBoundingClientRect().height),
          natural: `${main.naturalWidth}x${main.naturalHeight}`,
          src: main.currentSrc?.split("/").pop(),
        }
      : null,
    thumbs,
    h1: pick("h1"),
    container: pick(".container-page"),
  };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
