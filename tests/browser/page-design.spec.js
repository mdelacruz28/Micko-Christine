import { test,expect } from '@playwright/test';
async function open(page,motion='reduce'){
 const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(/GSAP target/.test(message.text()))errors.push(message.text());});
 await page.emulateMedia({reducedMotion:motion});await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 await page.goto('/');await page.getByRole('button',{name:'Open the Invitation',exact:true}).click();await expect(page.locator('#hero-title')).toBeFocused();return errors;
}
const backgroundState=page=>page.evaluate(async()=>{const {gsap,ScrollTrigger}=await import('/src/plugins/gsap.js');const trigger=ScrollTrigger.getById('depth-page');const image=document.querySelector('.page-background__image'),box=image.getBoundingClientRect();return {count:ScrollTrigger.getAll().filter(t=>t.vars.id==='depth-page').length,y:Number(gsap.getProperty(image,'y')),progress:trigger?.progress,coverage:box.top<=0&&box.bottom>=innerHeight};});
test('refined headings fit seven widths and enlarged text while preserving typography and hierarchy',async({page},info)=>{
 test.skip(info.project.name!=='desktop','One complete typography sweep');const errors=await open(page);
 for(const width of [320,375,390,430,768,1024,1440]){
  await page.setViewportSize({width,height:1000});
  for(const size of ['100%','200%']){
   await page.evaluate(size=>{document.documentElement.style.fontSize=size;},size);
   const headings=await page.locator('.section-heading').evaluateAll(elements=>elements.map(el=>{const b=el.getBoundingClientRect(),s=getComputedStyle(el);return {text:el.textContent,left:b.left,right:b.right,client:el.clientWidth,scroll:el.scrollWidth,size:parseFloat(s.fontSize),family:s.fontFamily,weight:s.fontWeight};}));
   expect(headings).toHaveLength(8);
   for(const h of headings){expect(h.left,h.text).toBeGreaterThanOrEqual(-1);expect(h.right,h.text).toBeLessThanOrEqual(width+1);expect(h.scroll,h.text).toBeLessThanOrEqual(h.client+1);expect(h.family).toBe('"Cinzel Decorative", serif');expect(h.weight).toBe('700');if(size==='100%')expect(h.size).toBeLessThanOrEqual(width<=430?36:60);}
  }
  await page.evaluate(()=>{document.documentElement.style.fontSize='100%';});
 }
 expect(errors).toEqual([]);
});
test('one continuous Hero background stays behind readable sections and uses desktop-only parallax',async({page},info)=>{
 const errors=await open(page,'no-preference'),desktop=info.project.name==='desktop';
 await expect(page.locator('.page-background')).toHaveCount(1);await expect(page.locator('.page-background')).toHaveCSS('position','fixed');await expect(page.locator('.page-background')).toHaveCSS('pointer-events','none');
 await expect(page.locator('.page-background__image')).toHaveCSS('background-image',/\/images\/hero\/lafayette\.png/);
 await expect(page.locator('.hero-section__background,.rsvp-section__background,.closing-section__background')).toHaveCount(0);
 await expect.poll(async()=>(await backgroundState(page)).count).toBe(desktop?1:0);
 let first,last;
 for(const id of ['home','story','timeline','entourage','rsvp','faq','closing']){
  await page.locator('#'+id).evaluate(element=>element.scrollIntoView({behavior:'instant',block:'start'}));
  if(desktop)await expect.poll(async()=>page.evaluate(async()=>{const {ScrollTrigger}=await import('/src/plugins/gsap.js');const t=ScrollTrigger.getById('depth-page');return Math.abs(t.animation.progress()-t.progress);})).toBeLessThan(.01);
  const state=await backgroundState(page);expect(state.coverage,id).toBe(true);if(!first)first=state;last=state;
  if(['home','story','timeline','rsvp','closing'].includes(id)){
   await expect.poll(()=>page.locator('#'+id).evaluate(section=>[...section.querySelectorAll('h1,h2,h3,p,.hero-letter')].filter(el=>{const b=el.getBoundingClientRect();return b.height>0&&b.bottom>0&&b.top<innerHeight&&!el.closest('.story-chapter:not(.is-active)')&&!el.closest('.timeline-item:not(.is-active)');}).every(el=>{for(let node=el;node&&node!==section.parentElement;node=node.parentElement){const css=getComputedStyle(node);if(Number(css.opacity)<.99||css.visibility==='hidden')return false;}return true;})),{timeout:10000}).toBe(true);
   await page.screenshot({path:info.outputPath(id+'-shared-background.png')});
  }
 }
 if(desktop)expect(last.y-first.y).toBeGreaterThan(200);else expect(last.y).toBe(0);
 await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy Layout');await expect(page.getByLabel('Full Name (First Name and Last Name)')).toHaveValue('Dummy Layout');
 await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(async()=>(await backgroundState(page)).count).toBe(0);await expect(page.locator('.page-background__image')).toHaveCSS('transform','none');
 await page.evaluate(()=>document.getElementById('app').__vue_app__.unmount());
 expect(errors).toEqual([]);
});

test('Intro focal names and Hero heading fit the complete responsive width set',async({page},info)=>{
 test.skip(info.project.name!=='desktop','One complete focal-heading sweep');
 await page.emulateMedia({reducedMotion:'reduce'});await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());await page.goto('/');
 async function bounds(selector){const boxes=await page.locator(selector).evaluateAll(elements=>elements.map(el=>{const b=el.getBoundingClientRect();return {left:b.left,right:b.right,width:innerWidth};}));for(const b of boxes){expect(b.left).toBeGreaterThanOrEqual(-1);expect(b.right).toBeLessThanOrEqual(b.width+1);}}
 for(const width of [320,375,390,430,768,1024,1440]){await page.setViewportSize({width,height:1000});await bounds('.intro-content h1,.intro-name-part');}
 await page.getByRole('button',{name:'Open the Invitation',exact:true}).click();await expect(page.locator('#hero-title')).toBeFocused();
 for(const width of [320,375,390,430,768,1024,1440]){await page.setViewportSize({width,height:1000});await bounds('#hero-title,.hero-name,.hero-letter');}
});
