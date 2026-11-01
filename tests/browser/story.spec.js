import { test, expect } from '@playwright/test'

const titles = ['When our paths first crossed', 'Growing side by side', 'Choosing forever']

async function openStory(page) {
  const errors = []
  const warnings = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()) })
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click()
  const carousel = page.getByRole('region', { name: 'Our Story', exact: true })
  await carousel.scrollIntoViewIfNeeded()
  await expect(carousel).toBeVisible()
  return { carousel, errors, warnings }
}

async function settled(page, chapter) {
  await expect(page.locator('.story-status')).toContainText(titles[chapter])
  await expect(page.getByRole('button', { name: 'Next story chapter', exact: true })).toHaveAttribute('aria-disabled', 'false')
  await expect(page.locator('.story-chapter.is-leaving')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 3, name: titles[chapter], exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: new RegExp('Go to chapter ' + (chapter + 1) + ':') })).toHaveAttribute('aria-current', 'true')
}

test('story preserves chapters, stable layout, accessible controls and focused keyboard navigation', async ({ page }, testInfo) => {
  const { carousel, errors, warnings } = await openStory(page)
  await settled(page, 0)
  await expect(page.locator('.story-chapter')).toHaveCount(3)
  await expect(page.locator('.story-chapter[inert][aria-hidden="true"]')).toHaveCount(2)
  await expect(carousel.getByRole('heading', { level: 3 })).toHaveCount(1)
  // The missing first photo must retain its original path and existing alternative text.
  await expect(page.locator('.story-chapter').first().locator('img')).toHaveAttribute('src', '/images/story/story-01.jpg')
  await expect(page.locator('.story-chapter__image-fallback')).toHaveText('Micko and Christine at the beginning of their story')
  const height = (await page.locator('.story-slides').boundingBox()).height

  const next = page.getByRole('button', { name: 'Next story chapter', exact: true })
  await next.click()
  await settled(page, 1)
  await expect(next).toBeFocused()
  expect(Math.abs((await page.locator('.story-slides').boundingBox()).height - height)).toBeLessThan(1)
  const image = page.locator('.story-chapter.is-active img')
  await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true)
  await expect(image).toHaveCSS('object-fit', 'cover')
  await expect(page.locator('.story-chapter.is-active .story-chapter__description')).toHaveText('Through changing seasons, long conversations, adventures, and everyday moments, we learned that love is not only found in grand gestures, but in choosing one another again and again.')
  await carousel.focus()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Previous story chapter', exact: true })).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Shift+Tab')
  await expect(carousel).toBeFocused()
  await expect(carousel).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('End')
  await settled(page, 2)
  await page.keyboard.press('ArrowRight')
  await settled(page, 0)
  await page.keyboard.press('ArrowLeft')
  await settled(page, 2)
  await page.keyboard.press('Home')
  await settled(page, 0)
  await page.getByRole('button', { name: 'Go to chapter 2: The Journey', exact: true }).click()
  await settled(page, 1)
  await page.getByRole('button', { name: 'Previous story chapter', exact: true }).click()
  await settled(page, 0)
  // Arrow keys outside the carousel must not change its chapter.
  await page.getByLabel('Full Name (First Name and Last Name)').focus()
  await page.keyboard.press('ArrowRight')
  await settled(page, 0)
  await page.getByRole('button', { name: 'Go to chapter 2: The Journey', exact: true }).click()
  await settled(page, 1)
  expect(Math.abs((await page.locator('.story-slides').boundingBox()).height - height)).toBeLessThan(1)
  const boxes = await carousel.locator('button, .story-chapter.is-active, .story-chapter.is-active img').evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect()
    return { left: rect.left, right: rect.right, viewport: innerWidth }
  }))
  for (const box of boxes) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(box.viewport) }
  await page.locator('.story-chapter.is-active').screenshot({ path: testInfo.outputPath('story-chapter.png') })
  expect(errors).toEqual([])
  expect(warnings.filter(message => /story|carousel/i.test(message))).toEqual([])
})

test('story honors live reduced-motion changes and does not autoplay', async ({ page }) => {
  const { carousel, errors } = await openStory(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await carousel.focus()
  await page.keyboard.press('ArrowRight')
  await settled(page, 1)
  await expect(page.locator('.story-chapter.is-active')).toHaveCSS('transform', 'none')
  await expect(page.locator('.story-chapter.is-active')).toHaveCSS('opacity', '1')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByRole('button', { name: 'Next story chapter', exact: true }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await settled(page, 2)
  await page.waitForTimeout(1000)
  await settled(page, 2)
  expect(errors).toEqual([])
})

test('horizontal touch swipes navigate while vertical and cancelled gestures do not', async ({ page, context }, testInfo) => {
  test.skip(!testInfo.project.use.hasTouch, 'Touch gesture check uses a mobile project')
  await openStory(page)
  // CDP dispatches actual browser touch input, exercising touch-action and listeners.
  const client = await context.newCDPSession(page)
  async function swipe(dx, dy, cancel = false) {
    await page.locator('.story-slides').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
    const box = await page.locator('.story-slides').boundingBox()
    const x = box.x + box.width * .65
    const y = Math.max(40, box.y + 100)
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    for (let i = 1; i <= 5; i++) await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 5, y: y + dy * i / 5 }] })
    await client.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] })
  }
  await swipe(-110, 3)
  await settled(page, 1)
  await swipe(100, 0)
  await settled(page, 0)
  await swipe(4, -100)
  await settled(page, 0)
  await swipe(-100, 0, true)
  await settled(page, 0)
  await client.detach()
})

test('story resizes through phone, tablet and desktop widths without shifting controls between chapters', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One responsive sweep covers all breakpoints')
  await openStory(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.getByRole('button', { name: 'Go to chapter 1: The Beginning', exact: true }).click()
    await settled(page, 0)
    const height = (await page.locator('.story-slides').boundingBox()).height
    for (const index of [1, 2]) {
      await page.getByRole('button', { name: 'Go to chapter ' + (index + 1) + ':', exact: false }).click()
      await settled(page, index)
      expect(Math.abs((await page.locator('.story-slides').boundingBox()).height - height)).toBeLessThan(1)
      const box = await page.locator('.story-chapter.is-active').boundingBox()
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
    }
  }
  await page.setViewportSize({ width: 320, height: 1000 })
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  const content = await page.locator('.story-chapter.is-active .story-chapter__content').evaluate(element => ({ height: element.clientHeight, scrollHeight: element.scrollHeight, width: element.clientWidth, scrollWidth: element.scrollWidth }))
  expect(content.scrollHeight).toBeLessThanOrEqual(content.height)
  expect(content.scrollWidth).toBeLessThanOrEqual(content.width)
})

async function storyDepth(page) {
  return page.evaluate(async () => {
    const { gsap, ScrollTrigger } = await import('/src/plugins/gsap.js')
    const section = document.getElementById('story')
    const wash = section.querySelector('.story-section__wash')
    const foreground = section.querySelector('.story-depth')
    const trigger = ScrollTrigger.getAll().find(item => item.trigger === section && item.vars.scrub === true)
    return {
      count: ScrollTrigger.getAll().filter(item => item.trigger === section && item.vars.scrub === true).length,
      progress: trigger?.progress,
      start: trigger?.start,
      end: trigger?.end,
      backgroundY: Number(gsap.getProperty(wash, 'y')),
      foregroundY: Number(gsap.getProperty(foreground, 'y')),
      backgroundTransform: getComputedStyle(wash).transform,
      foregroundTransform: getComputedStyle(foreground).transform
    }
  })
}

test('story depth moves independently from slides and cleans up across breakpoints and preferences', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Fine-pointer desktop-only scroll effect')
  const { carousel, errors, warnings } = await openStory(page)
  await expect.poll(async () => (await storyDepth(page)).count).toBe(1)
  async function scrollToProgress(progress) {
    const { start, end } = await storyDepth(page)
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), start + (end - start) * progress)
    await expect.poll(async () => Math.abs((await storyDepth(page)).progress - progress)).toBeLessThan(.01)
    return storyDepth(page)
  }
  const first = await scrollToProgress(.25)
  const second = await scrollToProgress(.65)
  expect(second.backgroundY).toBe(0) // One continuous page image replaces section background motion.
  expect(second.foregroundY).toBeLessThan(first.foregroundY - 8)
  expect(first.backgroundY).toBe(0)
  expect(Math.abs(second.foregroundY)).toBeLessThanOrEqual(12)
  const coverage = await page.locator('#story').evaluate(section => {
    const bounds = section.getBoundingClientRect()
    const wash = section.querySelector('.story-section__wash').getBoundingClientRect()
    return { top: wash.top <= bounds.top, bottom: wash.bottom >= bounds.bottom }
  })
  expect(coverage).toEqual({ top: true, bottom: true })
  await page.getByRole('button', { name: 'Next story chapter', exact: true }).click()
  await settled(page, 1)
  await expect(page.locator('.story-chapter.is-active')).toHaveCSS('transform', 'none')
  await carousel.focus()
  await page.keyboard.press('End')
  await settled(page, 2)
  await page.locator('#story').screenshot({ path: testInfo.outputPath('story-depth-desktop.png') })
  for (let i = 0; i < 2; i++) {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect.poll(async () => (await storyDepth(page)).count).toBe(0)
    await expect(page.locator('.story-depth')).toHaveCSS('transform', 'none')
    await expect(page.locator('.story-section__wash')).toHaveCSS('transform', 'none')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect.poll(async () => (await storyDepth(page)).count).toBe(1)
  }
  await page.setViewportSize({ width: 768, height: 1000 })
  await expect.poll(async () => (await storyDepth(page)).count).toBe(0)
  await expect(page.locator('.story-depth')).toHaveCSS('transform', 'none')
  await expect(page.locator('.story-section__wash')).toHaveCSS('transform', 'none')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect.poll(async () => (await storyDepth(page)).count).toBe(1)
  await page.evaluate(() => document.getElementById('app').__vue_app__.unmount())
  const remaining = await page.evaluate(async () => {
    const { ScrollTrigger } = await import('/src/plugins/gsap.js')
    return ScrollTrigger.getAll().filter(trigger => trigger.trigger?.closest('#story')).length
  })
  expect(remaining).toBe(0)
  expect(errors).toEqual([])
  expect(warnings.filter(message => /GSAP target/.test(message))).toEqual([])
})

test('story depth stays static on touch screens and under reduced motion', async ({ page }, testInfo) => {
  const { errors } = await openStory(page)
  if (testInfo.project.name === 'desktop') await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(async () => (await storyDepth(page)).count).toBe(0)
  await expect(page.locator('.story-depth')).toHaveCSS('transform', 'none')
  await expect(page.locator('.story-section__wash')).toHaveCSS('transform', 'none')
  await page.getByRole('button', { name: 'Go to chapter 2: The Journey', exact: true }).click()
  await settled(page, 1)
  await page.locator('#story').screenshot({ path: testInfo.outputPath('story-depth-static.png') })
  expect(errors).toEqual([])
})
