import { test, expect } from '@playwright/test';
import { backend, code } from '../helpers/apps-script.mjs';

async function open(page, handleApi) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (/GSAP target/.test(message.text())) errors.push(message.text()); });
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (url.hostname === 'script.google.com' && url.pathname === '/macros/s/DUMMY_LOCAL_TEST/exec') return handleApi(route);
    return route.abort();
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click();
  await expect(page.locator('#hero-title')).toBeFocused();
  return errors;
}
function fulfill(route, value) {
  return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(value) });
}
async function layout(page) {
  const boxes = await page.locator('#rsvp h2, #rsvp h3, #rsvp p, #rsvp strong, #rsvp button, #rsvp .form-field, #rsvp input:not([type="radio"]):not([type="checkbox"]), #rsvp select, #rsvp textarea, #rsvp .attendance-option, #rsvp .preference-option, #rsvp dt, #rsvp dd').evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect();
    return { label: element.textContent.trim().slice(0, 50) || element.name, nativeControl: element.matches('input, select, textarea'), left: box.left, right: box.right, viewport: innerWidth, client: element.clientWidth, scroll: element.scrollWidth };
  }));
  for (const box of boxes) {
    expect(box.left, box.label).toBeGreaterThanOrEqual(-1);
    expect(box.right, box.label).toBeLessThanOrEqual(box.viewport + 1);
    // Native fields scroll their editable values; their boxes must still fit.
    if (!box.nativeControl) expect(box.scroll, box.label).toBeLessThanOrEqual(box.client + 2);
  }
}

test('RSVP keeps keyboard focus, visible busy/error states and live reduced-motion cleanup', async ({ page }, testInfo) => {
  let release;
  const responseGate = new Promise(resolve => { release = resolve; });
  const errors = await open(page, async route => {
    await responseGate;
    return fulfill(route, { ok: false, error: { code: 'UNAVAILABLE', message: 'Please contact the couple privately.' } });
  });
  const name = page.getByLabel('Full Name (First Name and Last Name)');
  await name.focus();
  await expect(name).toBeFocused();
  await expect(name).toHaveCSS('outline-style', 'solid');
  await expect(name).toHaveCSS('font-size', '16px');
  await expect(page.locator('.rsvp-card')).toHaveCSS('opacity', '1');
  await expect(page.locator('.rsvp-card')).toHaveCSS('transform', 'none');
  await name.fill('Dummy Guest');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.invitation-rsvp')).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeDisabled();
  await expect(page.locator('.rsvp-status')).toBeVisible();
  await page.locator('.rsvp-card').screenshot({ path: testInfo.outputPath('busy.png') });
  release();
  await expect(page.getByRole('alert')).toBeFocused();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeEnabled();
  await layout(page);
  await page.locator('.rsvp-card').screenshot({ path: testInfo.outputPath('error.png') });
  const triggers = () => page.evaluate(async () => {
    const { ScrollTrigger } = await import('/src/plugins/gsap.js');
    return ScrollTrigger.getAll().filter(trigger => trigger.trigger?.closest('#rsvp')).length;
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(triggers).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(triggers).toBe(0);
  await expect(page.locator('.rsvp-info')).toHaveCSS('transform', 'none');
  await expect(page.locator('.rsvp-info')).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(triggers).toBeGreaterThan(0);
  await page.evaluate(() => document.getElementById('app').__vue_app__.unmount());
  await expect.poll(triggers).toBe(0);
  expect(errors).toEqual([]);
});

test('RSVP verified fields and receipt wrap at phone/tablet sizes and 200% text', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One sweep covers all widths; the existing flow runs on every project');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const app = backend();
  const errors = await open(page, route => fulfill(route, app.call(JSON.parse(route.request().postData()))));
  await sweep('lookup');
  await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  const accept = page.getByRole('radio', { name: /Joyfully Accepts/ });
  await accept.focus();
  await page.keyboard.press('Space');
  await expect(accept).toBeChecked();
  await expect(page.locator('.attendance-option').first()).toHaveCSS('outline-style', 'solid');
  await expect(page.locator('select[name="attending-count"], input[name^="attendee-"]')).toHaveCount(0);
  const activity = page.getByRole('checkbox', { name: /karaoke/ });
  await activity.focus();
  await page.keyboard.press('Space');
  await expect(activity).toBeChecked();
  await expect(page.locator('.preference-option').first()).toHaveCSS('outline-style', 'solid');
  async function sweep(stage) {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const size of ['100%', '200%']) {
        await page.evaluate(value => { document.documentElement.style.fontSize = value; }, size);
        await layout(page);
        if (width === 390 && size === '100%') await page.locator('.rsvp-card').screenshot({ path: testInfo.outputPath(stage + '-phone.png') });
      }
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = '100%'; });
  }
  await sweep('verified');
  if(await page.getByLabel('Contact number (required)').count()) await page.getByLabel('Contact number (required)').fill('09123456789');await page.getByRole('button', { name: 'Submit RSVP', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your RSVP has been saved' })).toBeFocused();
  await sweep('receipt');
  expect(app.tables.Responses.length).toBe(2);
  expect(errors).toEqual([]);
});
