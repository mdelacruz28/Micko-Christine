import { test, expect } from '@playwright/test'

async function open(page, motion = 'reduce') {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (/GSAP target/.test(message.text())) errors.push(message.text()) })
  await page.emulateMedia({ reducedMotion: motion })
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  await page.goto('/')
  await expect(page.locator('main')).toHaveCount(0)
  expect(await depthCount(page)).toBe(0)
  await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click()
  await expect(page.locator('#hero-title')).toBeFocused()
  return errors
}
async function depthCount(page) {
  return page.evaluate(async () => {
    const { ScrollTrigger } = await import('/src/plugins/gsap.js')
    return ScrollTrigger.getAll().filter(trigger => String(trigger.vars.id).startsWith('depth-')).length
  })
}

test('autoplay loops every two seconds, resets and pauses for interactions, visibility and reduced motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Deterministic scheduler test; existing mobile suite covers real touch navigation')
  test.setTimeout(90000)
  await page.clock.install()
  await page.addInitScript(() => {
    const set = window.setTimeout, clear = window.clearTimeout
    window.__autoplayTimers = new Set()
    window.setTimeout = (callback, delay, ...args) => {
      let id
      id = set(() => { window.__autoplayTimers.delete(id); callback(...args) }, delay)
      if (delay === 2000) window.__autoplayTimers.add(id)
      return id
    }
    window.clearTimeout = id => { window.__autoplayTimers.delete(id); clear(id) }
  })
  const errors = await open(page)
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.runFor(100)
  await page.evaluate(() => document.getElementById('story').scrollIntoView({ behavior: 'instant' }))
  await page.mouse.move(0, 0)
  await page.clock.runFor(100)
  const current = () => page.locator('.story-chapter.is-active').getAttribute('aria-label')
  const expectChapter = index => expect(page.locator('.story-chapter.is-active')).toHaveAttribute('aria-label', new RegExp('^' + index + ' of 3:'))
  await expect.poll(async () => { await page.clock.runFor(50); return page.locator('.story-status').getAttribute('aria-live') }).toBe('off')
  for (const index of [2, 3, 1]) { await page.clock.runFor(2000); await expectChapter(index) }
  expect(await page.evaluate(() => window.__autoplayTimers.size)).toBe(1)
  const carousel = page.locator('.story-carousel')
  await carousel.dispatchEvent('pointerenter', { pointerType: 'mouse' })
  const beforeHover = await current()
  await page.clock.runFor(4500)
  expect(await current()).toBe(beforeHover)
  await carousel.dispatchEvent('pointerleave', { pointerType: 'mouse' })
  await page.clock.runFor(1500)
  await page.getByRole('button', { name: 'Next story chapter', exact: true }).dispatchEvent('click')
  const manual = await current()
  await page.clock.runFor(1000)
  expect(await current()).toBe(manual)
  await page.clock.runFor(1100)
  expect(await current()).not.toBe(manual)
  await carousel.evaluate(element => element.focus({ preventScroll: true }))
  const focused = await current()
  await page.clock.runFor(4000)
  expect(await current()).toBe(focused)
  await page.evaluate(() => document.getElementById('hero-title').focus({ preventScroll: true }))
  await page.clock.runFor(2100)
  expect(await current()).not.toBe(focused)
  await carousel.dispatchEvent('touchstart')
  const touched = await current()
  await page.clock.runFor(4000)
  expect(await current()).toBe(touched)
  await carousel.dispatchEvent('touchcancel')
  await page.clock.runFor(2100)
  expect(await current()).not.toBe(touched)
  await page.getByRole('button', { name: 'Pause story autoplay', exact: true }).dispatchEvent('click')
  const paused = await current()
  await page.clock.runFor(4000)
  expect(await current()).toBe(paused)
  await page.getByRole('button', { name: 'Resume story autoplay', exact: true }).dispatchEvent('click')
  await page.clock.runFor(2100)
  expect(await current()).not.toBe(paused)
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')) })
  const hidden = await current()
  await page.clock.runFor(4000)
  expect(await current()).toBe(hidden)
  expect(await page.evaluate(() => window.__autoplayTimers.size)).toBe(0)
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')) })
  await page.clock.runFor(2100)
  expect(await current()).not.toBe(hidden)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.clock.runFor(100)
  await expect.poll(async () => { await page.clock.runFor(50); return page.evaluate(() => window.__autoplayTimers.size) }).toBe(0)
  const outside = await current()
  await page.clock.runFor(4000)
  expect(await current()).toBe(outside)
  await page.evaluate(() => document.getElementById('story').scrollIntoView({ behavior: 'instant' }))
  await page.clock.runFor(100)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const reduced = await current()
  await page.clock.runFor(4000)
  expect(await current()).toBe(reduced)
  await expect(page.locator('.story-autoplay')).toHaveCount(0)
  await page.getByRole('button', { name: 'Next story chapter', exact: true }).dispatchEvent('click')
  expect(await current()).not.toBe(reduced)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.runFor(100)
  await page.evaluate(() => document.getElementById('app').__vue_app__.unmount())
  await page.clock.runFor(4000)
  expect(await page.evaluate(() => window.__autoplayTimers.size)).toBe(0)
  expect(errors).toEqual([])
})

test('shared headings, compact complete timeline and paired parents survive narrow screens and longer names', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One responsive sweep covers phones, tablet and desktop')
  const errors = await open(page)
  await expect(page.locator('.section-heading')).toHaveCount(8)
  for (const heading of await page.locator('.section-heading').all()) {
    await expect(heading).toHaveCSS('font-family', '"Cinzel Decorative", serif')
    await expect(heading).toHaveCSS('font-weight', '700')
  }
  await expect(page.locator('.timeline-item')).toHaveCount(7)
  await expect(page.locator('.timeline-item__time span')).toHaveText(['2:00 PM', '2:30 PM', '4:00 PM', '5:00 PM', '6:45 PM', '7:45 PM', '9:00 PM'])
  const baseline = { 1440: 3911, 768: 3303, 390: 3779, 320: 4274 }
  for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    if (baseline[width]) expect((await page.locator('#timeline').boundingBox()).height).toBeLessThan(baseline[width] * .85)
    for (const size of ['100%', '200%']) {
      await page.evaluate(value => { document.documentElement.style.fontSize = value }, size)
      for (const names of [false, true]) {
        await page.locator('.credit-group--parents p').evaluateAll((elements, long) => elements.forEach((element, index) => { element.textContent = long ? ['A Very Long Fictional Father Name For Layout Only', 'Dummy Mother', 'Dummy Father', 'A Longer Fictional Mother Name For Layout Only'][index] : ['Name of Father', 'Name of Mother', 'Name of Father', 'Name of Mother'][index] }), names)
        const boxes = await page.locator('.credit-group--parents p').evaluateAll(elements => elements.map(element => { const box = element.getBoundingClientRect(); return { top: box.top, left: box.left, right: box.right, width: element.clientWidth, scroll: element.scrollWidth } }))
        expect(Math.abs(boxes[0].top - boxes[2].top)).toBeLessThan(1)
        expect(Math.abs(boxes[1].top - boxes[3].top)).toBeLessThan(1)
        for (const box of boxes) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(width); expect(box.scroll).toBeLessThanOrEqual(box.width + 1) }
      }
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = '100%' })
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('.credit-group--parents').screenshot({ path: testInfo.outputPath('parents-phone.png') })
  await page.locator('#timeline').screenshot({ path: testInfo.outputPath('timeline-phone.png') })
  expect(errors).toEqual([])
})

test('section depth is scoped, static on touch/reduced motion and leaves RSVP fields stationary', async ({ page }, testInfo) => {
  const errors = await open(page, 'no-preference')
  const count = testInfo.project.name === 'desktop' ? 2 : 0
  await expect.poll(() => depthCount(page)).toBe(count)
  if (count) {
    const ids = await page.evaluate(async () => {
      const { ScrollTrigger } = await import('/src/plugins/gsap.js')
      return ScrollTrigger.getAll().filter(trigger => String(trigger.vars.id).startsWith('depth-')).map(trigger => trigger.vars.id)
    })
    expect(new Set(ids)).toEqual(new Set(['depth-page','depth-story']))
    await expect(page.locator('.page-background')).toHaveCount(1)
    const coverage=await page.locator('.page-background').evaluate(layer=>{const box=layer.getBoundingClientRect();return box.top===0&&box.bottom===innerHeight})
    expect(coverage).toBe(true)
  }
  await page.getByLabel('Full Name (First Name and Last Name)').fill('Dummy layout check')
  await expect(page.getByLabel('Full Name (First Name and Last Name)')).toHaveValue('Dummy layout check')
  await expect(page.locator('.rsvp-card')).toHaveCSS('transform', 'none')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(() => depthCount(page)).toBe(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect.poll(() => depthCount(page)).toBe(count)
  await page.evaluate(() => document.getElementById('app').__vue_app__.unmount())
  await expect.poll(() => depthCount(page)).toBe(0)
  expect(errors).toEqual([])
})
