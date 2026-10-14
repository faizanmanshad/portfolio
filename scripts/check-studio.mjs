import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4322/", { waitUntil: "domcontentloaded" });
  assert.equal(
    await page
      .locator("#global-intro-loader, .is-intro, #pre-door-left")
      .count(),
    0,
  );
  assert.notEqual(
    await page.locator("body").evaluate((el) => getComputedStyle(el).overflow),
    "hidden",
  );
  await page.waitForSelector('.studio-interactive[data-ready="true"]', {
    timeout: 30000,
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: "scratch/observatory-desktop.png" });
  await page.getByRole("button", { name: "Look inside", exact: true }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: "scratch/observatory-exploded.png" });
  await page.getByRole("button", { name: "Observatory", exact: true }).click();
  await page.getByRole("button", { name: "Sail boat", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Return boat", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.getByRole("button", { name: "Reset model view" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Sail boat", exact: true })
      .getAttribute("aria-pressed"),
    "false",
  );
  await page.locator("#explore-model").click();
  await page.waitForSelector('[role="dialog"]');
  assert.equal(
    await page
      .locator('select[aria-label="Choose journey milestone"] option')
      .count(),
    6,
  );
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next →", exact: true }).click();
  await page.getByRole("button", { name: "Finish ↗", exact: true }).click();
  assert.equal(await page.locator('[role="dialog"]').count(), 0);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(100);
  assert.ok(await page.evaluate(() => scrollY > 0));
  assert.deepEqual(errors, []);
  console.log(
    "Desktop: instant entry, exploded view, all six milestones, exit and scrolling passed",
  );
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto("http://127.0.0.1:4322/");
  await mobile.locator(".studio-model").scrollIntoViewIfNeeded();
  await mobile.waitForSelector('.studio-interactive[data-ready="true"]');
  await mobile.waitForTimeout(800);
  await mobile.screenshot({ path: "scratch/observatory-mobile.png" });
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  console.log("Mobile: model ready, no horizontal overflow");
  const blocked = await browser.newPage();
  await blocked.route("**/*.js", (route) => route.abort());
  await blocked.goto("http://127.0.0.1:4322/", {
    waitUntil: "domcontentloaded",
  });
  assert.equal(
    await blocked.locator("#global-intro-loader, #pre-door-left").count(),
    0,
  );
  assert.equal(await blocked.locator("h1").isVisible(), true);
  await blocked.mouse.wheel(0, 1000);
  await blocked.waitForTimeout(100);
  assert.ok(await blocked.evaluate(() => scrollY > 0));
  assert.equal(
    await blocked.locator("#explore-model").getAttribute("href"),
    "/academic/",
  );
  console.log(
    "Blocked 3D/JS: name visible, page scrolls, Academic fallback link remains usable",
  );
} finally {
  await browser.close();
}
