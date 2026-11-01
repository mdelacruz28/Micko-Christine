import {test,expect} from '@playwright/test';
import {backend} from '../helpers/apps-script.mjs';
test.use({timezoneId:'America/Los_Angeles'});
test('approved Philippine deadline displays before lookup; cutoff and final response survive a different browser timezone',async({page})=>{
 const app=backend();app.setNow('2026-11-15T23:59:58+08:00');
 await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1')return route.continue();if(url.hostname==='script.google.com')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(app.call(JSON.parse(route.request().postData())))});return route.abort();});
 await page.goto('/');await page.getByRole('button',{name:'Open the Invitation',exact:true}).click();
 await expect(page.locator('.rsvp-info__date time')).toHaveText('November 15, 2026');await expect(page.locator('.rsvp-info__date time')).toHaveAttribute('datetime','2026-11-15T23:59:59+08:00');await expect(page.locator('.rsvp-deadline-zone')).toHaveCount(0);await expect(page.locator('.rsvp-header__intro')).not.toContainText('11:59');
 await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByText('Joyfully Accepts',{exact:true}).click();
 // Cross the cutoff with an already issued session: the server must still reject.
 app.setNow('2026-11-16T00:00:00+08:00');if(await page.getByLabel('Contact number (required)').count()) await page.getByLabel('Contact number (required)').fill('09123456789');await page.getByRole('button',{name:'Submit RSVP',exact:true}).click();await expect(page.getByRole('alert')).toContainText('closed');expect(app.tables.Responses.length).toBe(1);
 // Rewind only the simulated clock to verify a successful first response then finality.
 app.setNow('2026-11-15T23:59:58+08:00');await page.getByRole('button',{name:'Retry same submission',exact:true}).click();await expect(page.getByRole('heading',{name:'Your RSVP has been saved'})).toBeVisible();expect(app.tables.Responses.length).toBe(2);
 app.setNow('2026-11-16T00:00:00+08:00');await page.getByRole('button',{name:'Finish and clear invitation details',exact:true}).click();await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByText('Your RSVP has already been recorded. If you wish to change your response, please contact the couple directly.',{exact:true})).toBeVisible();expect(app.tables.Responses.length).toBe(2);
});
