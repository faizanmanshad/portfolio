import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:4322';
const browser = await chromium.launch({ headless: true, channel: process.env.PORTFOLIO_TEST_BROWSER || undefined });
const errors = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const panels = '[data-page-door], #pre-door-left, #pre-door-right';
  const ready = async () => {
    await page.waitForFunction(() => !document.querySelector('[data-page-door], #pre-door-left, #pre-door-right'));
    assert.equal(await page.locator('#main-content').evaluate(el => getComputedStyle(el).opacity), '1');
  };
  for (const route of ['/about/', '/projects/', '/work/', '/research/', '/recognition/', '/academic/', '/projects/retaining-wall-design/', '/contact/']) {
    await page.goto(base + route);
    await ready();
    await page.evaluate(() => {
      window.motionFrames = [];
      window.motionLongTasks = [];
      window.motionRunning = true;
      new PerformanceObserver(list => window.motionLongTasks.push(...list.getEntries().map(e => e.duration))).observe({ type: 'longtask' });
      let previous = performance.now();
      const frame = now => {
        window.motionFrames.push(now - previous);
        previous = now;
        if (window.motionRunning) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
    for (const delta of [800, 1000, -700, 1200, -1600, 900, -2000]) {
      await page.mouse.wheel(0, delta);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(900);
    const state = await page.evaluate(() => {
      window.motionRunning = false;
      const frames = window.motionFrames.slice(2).sort((a, b) => a - b);
      const hidden = [...document.querySelectorAll('.index-row, .index-title, .index-deck')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight && Number(getComputedStyle(el).opacity) < 1;
      });
      return { p95: frames[Math.floor(frames.length * .95)], longTasks: window.motionLongTasks.length, hidden: hidden.length,
        behavior: getComputedStyle(document.documentElement).scrollBehavior, lenis: document.documentElement.classList.contains('lenis') };
    });
    assert.equal(state.hidden, 0, `${route}: hidden visible content`);
    assert.equal(state.lenis, false);
    assert.equal(state.behavior, 'auto');
    console.log(route, JSON.stringify(state));
  }

  // Downward entries replay; upward entries and interrupted reveals stay settled.
  for (const [route, selector] of [['/about/', '.index-row'], ['/academic/', '[data-academic-reveal]']]) {
    await page.goto(base + route);
    await ready();
    await page.waitForTimeout(900);
    const target = page.locator(selector).last();
    const top = await target.evaluate(el => el.getBoundingClientRect().top + scrollY);
    const viewport = await page.evaluate(() => innerHeight);
    for (let pass = 0; pass < 3; pass++) {
      await page.evaluate(y => scrollTo(0, y), top - viewport - 100);
      await page.waitForTimeout(120);
      assert.equal(await target.evaluate(el => getComputedStyle(el).opacity), '1', 'Upward reset must not hide content');
      await page.evaluate(y => scrollTo(0, y), top - viewport + 100);
      await page.waitForTimeout(120);
      const opacity = await target.evaluate(el => Number(getComputedStyle(el).opacity));
      assert.ok(opacity > 0 && opacity < 0.9, `${route}: downward pass ${pass + 1} should visibly animate (${opacity})`);
      await page.waitForTimeout(850);
      assert.equal(await target.evaluate(el => getComputedStyle(el).opacity), '1');
    }
    await page.evaluate(y => scrollTo(0, y), top - viewport - 100);
    await page.waitForTimeout(120);
    await page.evaluate(y => scrollTo(0, y), top - viewport + 100);
    await page.waitForTimeout(100);
    await page.mouse.wheel(0, -30);
    await page.waitForTimeout(100);
    assert.equal(await target.evaluate(el => getComputedStyle(el).opacity), '1', 'Changing direction must settle the reveal immediately');
    console.log(`${route}: three downward replays and upward cancellation passed`);
  }

  await page.goto(base + '/about/');
  await ready();
  await page.locator('.nav-links a[href="/projects/"]').click();
  await page.waitForTimeout(100);
  assert.equal(await page.locator('[data-page-door]').count(), 2);
  const widths = await page.locator('[data-page-door]').evaluateAll(els => els.map(el => el.getBoundingClientRect().width));
  assert.ok(widths.every(width => Math.abs(width - 720) < 0.1), 'Doors should move without resizing');
  await page.evaluate(() => document.querySelector('.nav-links a[href="/work/"]').click());
  assert.equal(await page.locator('[data-page-door]').count(), 2, 'Rapid clicks must not stack panels');
  await page.waitForURL('**/projects/');
  await ready();
  await page.goBack();
  await ready();
  assert.ok(page.url().endsWith('/about/'));
  await page.goForward();
  await ready();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  assert.equal(await page.locator(panels).count(), 0);
  console.log('Navigation, rapid clicks, Back/Forward and restored-page cleanup passed');

  await page.goto(base + '/about/');
  await ready();
  await page.locator('.nav-logo').click();
  await page.waitForURL(base + '/');
  await ready();
  await page.waitForSelector('.studio-interactive:not(.is-intro)', { timeout: 30000 });
  await page.mouse.wheel(0, 1800);
  await page.waitForTimeout(500);
  assert.ok(await page.evaluate(() => scrollY > 0), 'Home must scroll after returning');
  console.log('Returning home and scrolling passed');

  const firstVisit = await browser.newPage();
  firstVisit.on('pageerror', error => errors.push(error.message));
  await firstVisit.goto(base + '/');
  await firstVisit.waitForSelector('.studio-interactive:not(.is-intro)', { timeout: 45000 });
  await firstVisit.waitForFunction(() => !document.querySelector('[data-page-door], #global-intro-loader'));
  assert.notEqual(await firstVisit.locator('body').evaluate(el => getComputedStyle(el).overflow), 'hidden');
  console.log('First-visit 3D intro unlocks and removes its doors');
  await firstVisit.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto(base + '/about/');
  await mobile.waitForFunction(() => !document.querySelector('#pre-door-left'));
  await mobile.locator('#nav-toggle').click();
  assert.equal(await mobile.locator('body').evaluate(el => getComputedStyle(el).overflow), 'hidden');
  await mobile.locator('#nav-mobile-menu a[href="/projects/"]').click();
  await mobile.waitForURL('**/projects/');
  await mobile.waitForFunction(() => !document.querySelector('#pre-door-left'));
  assert.equal(await mobile.locator('[data-page-door]').count(), 0);
  console.log('Mobile navigation and reduced motion passed');
  await mobile.goto(base + '/');
  await mobile.waitForSelector('.studio-interactive:not(.is-intro)', { timeout: 30000 });
  await mobile.waitForFunction(() => !document.querySelector('#global-intro-loader'));
  assert.notEqual(await mobile.locator('body').evaluate(el => getComputedStyle(el).overflow), 'hidden');
  console.log('Reduced-motion home hydration and scroll unlock passed');
  await mobile.close();

  const noScripts = await browser.newPage({ javaScriptEnabled: false });
  await noScripts.goto(base + '/about/');
  assert.equal(await noScripts.locator('#main-content').evaluate(el => getComputedStyle(el).opacity), '1');
  await noScripts.close();
  console.log('Content remains readable without JavaScript');

  const files = await readdir('dist', { recursive: true });
  let checked = 0;
  for (const file of files.filter(file => file.endsWith('.html') && !file.includes('404'))) {
    const response = await context.request.get(base + '/' + file.replaceAll('\\', '/'));
    assert.equal(response.status(), 200, file);
    checked++;
  }
  console.log(`${checked} generated routes responded successfully`);
  assert.deepEqual(errors, [], 'Browser runtime errors');
  console.log('PASS: no browser runtime errors');
} finally {
  await browser.close();
}
