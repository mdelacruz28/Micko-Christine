import { test, expect } from '@playwright/test'

async function openSite(page) {
  const errors = [], warnings = [], failedAssets = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()) })
  page.on('response', response => {
    if (response.url().includes('/images/') && response.status() >= 400) failedAssets.push(new URL(response.url()).pathname)
  })
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click()
  await expect(page.locator('#hero-title')).toBeFocused()
  return { errors, warnings, failedAssets }
}

test('site keyboard path reaches every section with visible focus and preserves inactive features', async ({ page }, testInfo) => {
  const { errors, warnings, failedAssets } = await openSite(page)
  const sections = ['home', 'story', 'details', 'timeline', 'entourage', 'dress-code', 'rsvp', 'faq', 'closing']
  expect(await page.locator('main > section, main > footer').evaluateAll(elements => elements.map(element => element.id))).toEqual(sections)
  await expect(page.locator('#gallery, .background-canvas')).toHaveCount(0)
  const icon = page.locator('link[rel="icon"]')
  const iconResponse = await page.request.get(await icon.getAttribute('href'))
  expect(iconResponse.ok()).toBe(true)
  expect(iconResponse.headers()['content-type']).toContain('image/png')
  const fonts = await page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com"]').evaluateAll(elements => elements.map(element => element.href))
  expect(fonts).toHaveLength(2)
  let reachedClosing = false, visited = 0
  for (let index = 0; index < 40; index++) {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
    await expect(focused).toBeInViewport()
    await expect(focused).toHaveCSS('outline-style', 'solid')
    expect(await focused.evaluate(element => element.closest('[inert], [aria-hidden="true"]') === null)).toBe(true)
    visited++
    if (await focused.evaluate(element => element.classList.contains('closing-content__top'))) { reachedClosing = true; break }
  }
  expect(reachedClosing).toBe(true)
  expect(visited).toBeGreaterThan(20)
  await page.keyboard.press('Enter')
  await expect(page.locator('#hero-title')).toBeFocused()
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const id of ['home', 'story', 'closing']) await page.locator('#' + id).screenshot({ path: testInfo.outputPath(id + '.png') })
  const expectedMissing = new Set(['/images/story/story-01.jpg', '/images/dress-code/principal-sponsors.jpg', '/images/dress-code/family.jpg', '/images/rsvp/rsvp-bg.jpg', '/images/closing/closing-bg.jpg'])
  expect(failedAssets.filter(path => !expectedMissing.has(path))).toEqual([])
  expect(warnings).toEqual([])
  expect(errors).toEqual([])
})

test('site text and controls fit common widths at normal and enlarged text sizes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One complete responsive sweep')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const { errors } = await openSite(page)
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const size of ['100%', '200%']) {
      await page.evaluate(value => { document.documentElement.style.fontSize = value }, size)
      const boxes = await page.locator('main h1, main h2, main h3, main p, main strong, main li, main button, main a[href], main .form-field').evaluateAll(elements => elements.filter(element => !element.closest('[inert], [aria-hidden="true"]') && !element.classList.contains('story-sr-only') && getComputedStyle(element).visibility === 'visible').map(element => {
        const box = element.getBoundingClientRect()
        return { label: element.className + ': ' + element.textContent.trim().slice(0, 45), lettering: element.id === 'hero-title', left: box.left, right: box.right, viewport: innerWidth, client: element.clientWidth, scroll: element.scrollWidth }
      }))
      for (const box of boxes) {
        expect(box.left, box.label + ' at ' + width + '/' + size).toBeGreaterThanOrEqual(-1)
        expect(box.right, box.label + ' at ' + width + '/' + size).toBeLessThanOrEqual(box.viewport + 1)
        // Hero's rotated lettering has intentional ink overhang. Its individual
        // letter boxes are checked by the existing Intro/Hero responsive suite.
        if (!box.lettering) expect(box.scroll, box.label + ' at ' + width + '/' + size).toBeLessThanOrEqual(box.client + 2)
      }
      await expect(page.locator('.countdown__item span').first()).toHaveCSS('font-size', size === '100%' ? '11.2px' : '22.4px')
    }
  }
  expect(errors).toEqual([])
})
