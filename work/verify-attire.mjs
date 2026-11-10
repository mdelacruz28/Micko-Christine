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

const out = new URL('../review-artifacts/attire-verification/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const [target, url] of [[process.env.VERIFY_LIVE ? 'live' : 'local', process.env.VERIFY_LIVE ? 'https://micko-christine.vercel.app' : 'http://127.0.0.1:1016']]) {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.route('**/*', route => {
        const req = route.request();
        if (!['GET', 'HEAD'].includes(req.method()) || /script.google.com|\/api\/rsvp/.test(req.url())) return route.abort();
        return route.continue();
      });
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click();
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
