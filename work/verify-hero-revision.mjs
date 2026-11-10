import { chromium } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '1016', '--strictPort'], { stdio: ['ignore', 'pipe', 'inherit'], windowsHide: true });
await new Promise((resolve, reject) => {
  server.stdout.on('data', data => { if (data.toString().includes('Local:')) resolve(); });
  server.on('error', reject);
  server.on('exit', code => reject(new Error('Preview exited: ' + code)));
});

const out = new URL('../review-artifacts/hero-revision/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const [target, url] of [[process.env.VERIFY_LIVE ? 'live' : 'local', process.env.VERIFY_LIVE ? 'https://micko-christine.vercel.app' : 'http://127.0.0.1:1016']]) {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: width === 320 ? 'reduce' : 'no-preference' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (/GSAP target.*not found/.test(m.text())) errors.push(m.text()); });
      await page.route('**/*', route => {
        const req = route.request();
        if (!['GET', 'HEAD'].includes(req.method()) || /script.google.com|\/api\/rsvp/.test(req.url())) return route.abort();
        return route.continue();
      });
      await page.goto(url, { waitUntil: 'networkidle' });
      const button = page.getByRole('button', { name: 'BUKSAN AND IMBITASYON', exact: true });
      await button.waitFor({state:'visible'});
      await page.waitForTimeout(8000);
      await page.screenshot({path: fileURLToPath(new URL(target+'-'+width+'-intro.png',out))});
      await button.click();
      await page.locator('#hero-title').waitFor({state:'visible'});
      await page.waitForTimeout(3500);
      assert.equal(await page.locator('.hero-content__eyebrow').innerText(), 'Sa wakas! Ikakasal na sila');
      assert.equal(await page.locator('.hero-details__date').textContent(), '17 Enero 2027');
      assert.equal(await page.locator('.hero-details__venue').textContent(), 'Baguio City');
      assert.equal(await page.locator('.hero-content__caption, .hero-scroll').count(), 0);
      const dateBox = await page.locator('.hero-details__date').boundingBox();
      const venueBox = await page.locator('.hero-details__venue').boundingBox();
      assert(venueBox.y >= dateBox.y+dateBox.height);
      assert(await page.locator('#hero-title').evaluate(el => el === document.activeElement));
      await page.locator('#home').screenshot({path: fileURLToPath(new URL(target+'-'+width+'-hero.png',out))});
      const section = page.locator('#dress-code');
      await section.scrollIntoViewIfNeeded();
      const cards = section.locator('.dress-card');
      assert.equal(await cards.count(), 2);
      assert.deepEqual(await cards.locator('h3').allTextContents(), ['Ninong & Ninang', 'Ladies & Gentlemen']);
      assert.deepEqual(await cards.locator('h4').allTextContents(), ['Ladies', 'Gentlemen', 'Ladies', 'Gentlemen']);
      assert(!/Formal and Distinguished|Romantic and Refined|Polished and Relaxed/.test(await section.innerText()));
      const images = [];
      for (const [i, file] of ['main sponsor.png', 'guest attire.png'].entries()) {
        const img = cards.nth(i).locator('img');
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(el => el.decode());
        const src = await img.getAttribute('src');
        assert.equal(decodeURIComponent(src), '/images/' + file);
        const response = await page.request.get(new URL(src, url).href);
        assert(response.ok());
        const hash = bytes => createHash('sha256').update(bytes).digest('hex');
        const sameAsLocal = hash(await response.body()) === hash(await readFile(new URL('../public/images/' + file, import.meta.url)));
        assert(sameAsLocal);
        images.push({ file, sameAsLocal });
      }
      await page.evaluate(() => document.fonts.ready);
      const layout = await section.evaluate(el => ({
        columns: getComputedStyle(el.querySelector('.dress-featured')).gridTemplateColumns,
        eyebrowFont: getComputedStyle(el.querySelector('.dress-header__eyebrow')).fontFamily,
        headingFont: getComputedStyle(el.querySelector('h2')).fontFamily,
        overflow: document.documentElement.scrollWidth > innerWidth,
        timelineItems: document.querySelectorAll('#timeline [role="listitem"]').length
      }));
      assert.match(layout.eyebrowFont, /Parisienne/);
      assert.equal(layout.overflow, false);
      assert.equal(layout.timelineItems, 7);
      assert.deepEqual(errors, []);
      await section.screenshot({ path: fileURLToPath(new URL(`${target}-${width}.png`, out)) });
      results.push({ target, width, images, ...layout, errors });
      console.log(JSON.stringify(results.at(-1)));
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
  await writeFile(new URL('results.json', out), JSON.stringify(results, null, 2));
}
