import {test,expect} from '@playwright/test';
import {backend} from '../helpers/apps-script.mjs';
import {decodeResponseMessage} from '../../src/utils/rsvpDetails.js';
test('conditional choices, four activity values, distinct notes and server-confirmed acceptance',async({page},info)=>{
 const b=backend();let release;const gate=new Promise(r=>release=r);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1')return route.continue();if(url.hostname==='script.google.com'){const req=JSON.parse(route.request().postData());const result=b.call(req);if(req.action==='submit')await gate;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)})}return route.abort()});
 await page.goto('/');await page.getByRole('button',{name:'Open the Invitation',exact:true}).click();
 await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.locator('.rsvp-conditional')).toHaveCount(0);await expect(page.getByRole('button',{name:'Submit RSVP',exact:true})).toHaveCount(0);
 await page.getByText('Joyfully Accepts',{exact:true}).click();
 await page.getByRole('button',{name:'Submit RSVP',exact:true}).click();await expect(page.getByLabel('Contact number (required)')).toBeFocused();expect(b.tables.Responses.length).toBe(1);
 await page.getByLabel('Contact number (required)').fill('09123456789');
 await page.getByLabel('Food allergies or dietary restrictions (optional)').fill('Peanuts');
 for(const name of ['Dance','Karaoke','Games','Group Photos'])await page.getByText(name,{exact:true}).click();
 await page.getByLabel('Any special requests or concerns? (optional)').fill('Transport: "pickup"\nAt hotel 🩵');
 await page.getByLabel('Leave a message for the couple (optional)').fill('See you!\nCongratulations!');
 await page.screenshot({path:info.outputPath('conditional-accept.png'),fullPage:false});
 await page.getByRole('button',{name:'Submit RSVP',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Your RSVP has been saved'})).toHaveCount(0);await expect(page.getByLabel('Contact number (required)')).toBeDisabled();
 release();await expect(page.getByText('Thank you so much for your RSVP!',{exact:true})).toBeVisible();
 await expect(page.locator('.rsvp-thank-you')).toContainText('Your presence means the world to us');await expect(page.locator('.rsvp-thank-you')).toContainText('With love,Micko & Christine 🩵');
 const saved=JSON.parse(b.tables.Responses[1][3]),details=decodeResponseMessage(saved.message);
 expect(details.activities).toEqual(['dance','games','karaoke','photos']);expect(details.specialRequests).toBe('Transport: "pickup"\nAt hotel 🩵');expect(details.message).toBe('See you!\nCongratulations!');expect(saved.dietaryRestrictions).toBe('Peanuts');expect(details.mobile).toBe('09123456789');expect(errors).toEqual([]);
});
test('switching to decline removes acceptance fields and submits only optional note',async({page})=>{
 const b=backend();await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='127.0.0.1')return r.continue();if(u.hostname==='script.google.com')return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(b.call(JSON.parse(r.request().postData())))});return r.abort()});
 await page.goto('/');await page.getByRole('button',{name:'Open the Invitation',exact:true}).click();await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByText('Joyfully Accepts',{exact:true}).click();await page.getByLabel('Contact number (required)').fill('09123456789');await page.getByText('Dance',{exact:true}).click();
 await page.getByText('Regretfully Declines',{exact:true}).click();await expect(page.getByLabel('Contact number (required)')).toHaveCount(0);await expect(page.getByRole('checkbox')).toHaveCount(0);await expect(page.getByLabel('Any special requests or concerns? (optional)')).toHaveCount(0);
 await expect(page.locator('.rsvp-final-note')).toContainText('strict RSVP policy');await page.getByLabel('A little note for us (optional)').fill('Unable to travel.');await page.getByRole('button',{name:'Submit RSVP',exact:true}).click();
 await expect(page.getByText("We are saddened to know that you won't be able to celebrate this special day with us.",{exact:true})).toBeVisible();
 const saved=JSON.parse(b.tables.Responses[1][3]);expect(saved.attendingCount).toBe(0);expect(saved.activities).toEqual([]);expect(saved.dietaryRestrictions).toBe('');expect(decodeResponseMessage(saved.message)).toEqual({mobile:'',declineNote:'Unable to travel.'});
});


