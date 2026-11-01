import {test,expect} from '@playwright/test';
test.beforeEach(async({request,page})=>{
 await request.post('/__test/reset');
 await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
});
for(const attendance of ['Joyfully Accepts','Regretfully Declines']) test(`new local SQL API: ${attendance} and repeat privacy`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.getByRole('button',{name:'Open the Invitation',exact:true}).click();
 await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Dummy Guest',exact:true})).toBeVisible();
 await page.getByText(attendance,{exact:true}).click();
 if(await page.getByLabel('Contact number (required)').count()) await page.getByLabel('Contact number (required)').fill('09123456789');
 const result=page.waitForResponse(r=>r.url().endsWith('/api/rsvp') && r.request().postDataJSON().action==='submit');
 await page.getByRole('button',{name:'Submit RSVP',exact:true}).click();
 expect((await (await result).json()).ok).toBe(true);
 await expect(page.getByRole('heading',{name:'Your RSVP has been saved'})).toBeVisible();
 await page.getByRole('button',{name:'Finish and clear invitation details',exact:true}).click();
 await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Guest');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.getByText('Your RSVP has already been recorded. If you wish to change your response, please contact the couple directly.',{exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});
