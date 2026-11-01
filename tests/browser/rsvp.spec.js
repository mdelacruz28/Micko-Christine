import { test, expect } from '@playwright/test';
import { backend, code } from '../helpers/apps-script.mjs';

test('individual invitation and private repeat lookup fit the viewport', async ({ page }, testInfo) => {
  const app = backend();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (url.hostname === 'script.google.com' && url.pathname === '/macros/s/DUMMY_LOCAL_TEST/exec') {
      const body = JSON.parse(route.request().postData());
      return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(app.call(body)) });
    }
    return route.abort(); // Never contact Google, remote fonts, or any live API.
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click();
  const rsvp = page.locator('#rsvp');
  await rsvp.scrollIntoViewIfNeeded();
  await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dummy Guest', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dummy Guest', exact: true })).toBeFocused();
  await expect(page.getByLabel('Contact number (required)')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Submit RSVP',exact:true})).toHaveCount(0);
  await page.getByText('Joyfully Accepts', { exact: true }).click();
  await expect(page.getByLabel('Contact number (required)')).toHaveAttribute('required', '');
  await page.getByLabel('Contact number (required)').fill('abc');
  await expect(page.getByLabel('Contact number (required)')).toHaveValue('');
  await page.getByText('Joyfully Accepts', { exact: true }).click();
  await expect(page.getByText('Reserved Seats: 1',{exact:true})).toBeVisible();
  await expect(page.locator('select[name="attending-count"], input[name^="attendee-"]')).toHaveCount(0);
  // Check actual input/control boxes rather than relying on overflow-x:hidden to hide problems.
  const bounds = await page.locator('.invitation-rsvp input[type="text"], .invitation-rsvp select').evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect();
    return { left: box.left, right: box.right, viewport: innerWidth };
  }));
  for (const box of bounds) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(box.viewport); }
  if (testInfo.project.use.viewport.width <= 620) {
    const options = await page.locator('.attendance-option').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top));
    expect(options[1]).toBeGreaterThan(options[0]);
  }
  await page.locator('.rsvp-card').scrollIntoViewIfNeeded();
  if (testInfo.project.use.reducedMotion === 'reduce') {
    await expect(page.locator('.rsvp-card')).toHaveCSS('transform', 'none');
    await expect(page.locator('.attendance-option').first()).toHaveCSS('transition-duration', '0s');
  }
  await page.screenshot({ path: testInfo.outputPath('rsvp-form.png') });
  if(await page.getByLabel('Contact number (required)').count()) await page.getByLabel('Contact number (required)').fill('09123456789');await page.getByRole('button', { name: 'Submit RSVP', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your RSVP has been saved' })).toBeVisible();
  await expect(page.getByText("Thank you so much for your RSVP!",{exact:true})).toBeVisible();
  expect(app.tables.Responses.length).toBe(2);
  expect(app.tables.Responses[1][2]).toBe(1);
  expect(JSON.parse(app.tables.Responses[1][3]).message).toContain('Mobile number: 09123456789');
  await expect(page.getByRole('link', {name:'Micko Dela Cruz 09499857805'})).toHaveAttribute('href','tel:+639499857805');
  await expect(page.getByRole('link', {name:'Christine Ferrera 09683238328'})).toHaveAttribute('href','tel:+639683238328');
  expect(JSON.parse(app.tables.Responses[1][3]).attendeeNames).toEqual(['Dummy Guest']);
  await page.getByRole('button', { name: 'Finish and clear invitation details', exact: true }).click();
  await expect(page.getByLabel('Full Name (First Name and Last Name)')).toHaveValue('');
  await expect(page.getByText('Dummy Guest', { exact: true })).toHaveCount(0);
  await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');
 await page.getByRole('button', {name:'Continue',exact:true}).click();
 await expect(page.getByText('Your RSVP has already been recorded. If you wish to change your response, please contact the couple directly.',{exact:true})).toBeVisible();
 await expect(page.locator('input[name^="attendee-"]')).toHaveCount(0);
 expect(app.tables.Responses.length).toBe(2);
 expect(pageErrors).toEqual([]);
});

test('decline submits zero attendees without an edit path',async({page})=>{
 const app=backend();
 await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1')return route.continue();if(url.hostname==='script.google.com')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(app.call(JSON.parse(route.request().postData())))});return route.abort();});
 await page.goto('/');await page.getByRole('button',{name:'Open the Invitation',exact:true}).click();
 await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByText('Regretfully Declines',{exact:true}).click();await expect(page.locator('input[name^="attendee-"]')).toHaveCount(0);
 if(await page.getByLabel('Contact number (required)').count()) await page.getByLabel('Contact number (required)').fill('09123456789');await page.getByRole('button',{name:'Submit RSVP',exact:true}).click();await expect(page.getByRole('heading',{name:'Your RSVP has been saved'})).toBeVisible();
 await expect(page.getByText("We are saddened to know that you won't be able to celebrate this special day with us.",{exact:true})).toBeVisible();
 expect(app.tables.Responses[1][1]).toBe('declined');expect(app.tables.Responses[1][2]).toBe(0);expect(JSON.parse(app.tables.Responses[1][3]).attendeeNames).toEqual([]);
 await expect(page.getByRole('button',{name:/edit|Reload/i})).toHaveCount(0);
});
