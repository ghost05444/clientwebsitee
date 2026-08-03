/** Empirical check of what motion actually runs, per device class. */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch();

async function probe(label, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(2200);

  const before = await page.evaluate(() => {
    const el = document.querySelector(".reveal");
    const parallax = document.querySelector("[data-parallax]");
    const canvas = document.querySelector("canvas");
    const h1span = document.querySelector(".hero-line > span");

    let emberPx = 0;
    if (canvas) {
      const c = canvas.getContext("2d");
      try {
        const d = c.getImageData(0, 0, Math.min(canvas.width, 300), Math.min(canvas.height, 300)).data;
        for (let i = 3; i < d.length; i += 4) if (d[i] > 0) emberPx++;
      } catch {}
    }

    return {
      lenis: document.documentElement.classList.contains("lenis"),
      revealTotal: document.querySelectorAll(".reveal").length,
      revealVisible: document.querySelectorAll(".reveal.is-visible").length,
      firstRevealOpacity: el ? getComputedStyle(el).opacity : "n/a",
      parallaxTransform: parallax ? getComputedStyle(parallax).transform : "n/a",
      heroLineTransform: h1span ? getComputedStyle(h1span).transform : "n/a",
      emberPx,
      scrollVelocityVar: getComputedStyle(document.documentElement).getPropertyValue("--scroll-velocity"),
    };
  });

  // Scroll and see whether anything responds.
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(1200);

  const after = await page.evaluate(() => {
    const parallax = document.querySelector("[data-parallax]");
    return {
      revealVisible: document.querySelectorAll(".reveal.is-visible").length,
      parallaxTransform: parallax ? getComputedStyle(parallax).transform : "n/a",
    };
  });

  console.log(`\n── ${label}`);
  console.log(`   lenis smooth-scroll : ${before.lenis}`);
  console.log(`   reveals             : ${before.revealVisible}/${before.revealTotal} visible at load -> ${after.revealVisible} after scroll`);
  console.log(`   first reveal opacity: ${before.firstRevealOpacity}`);
  console.log(`   hero line transform : ${before.heroLineTransform}`);
  console.log(`   parallax transform  : ${before.parallaxTransform}  ->  ${after.parallaxTransform}`);
  console.log(`   ember pixels drawn  : ${before.emberPx}`);
  console.log(`   --scroll-velocity   : "${before.scrollVelocityVar}"`);

  await ctx.close();
}

await probe("DESKTOP 1440 (mouse)", { viewport: { width: 1440, height: 900 } });
await probe("MOBILE 375 (touch)", {
  viewport: { width: 375, height: 812 },
  isMobile: true,
  hasTouch: true,
});
await probe("DESKTOP, reduced-motion", {
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});

await browser.close();
