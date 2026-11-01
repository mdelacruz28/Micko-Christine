import { test, expect } from '@playwright/test'

async function localPage(page) {
  const errors = []
  const missingTargets = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'warning' && /GSAP target/.test(message.text())) missingTargets.push(message.text())
  })
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  await page.goto('/')
  return { errors, missingTargets }
}
async function opened(page) {
  await expect(page.locator('.intro-screen')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1, name: 'Micko and Christine', exact: true })).toBeFocused()
  await expect(page.locator('html')).not.toHaveClass(/invitation-locked/)
  await expect(page.locator('body')).not.toHaveCSS('position', 'fixed')
  await expect(page.locator('main')).toHaveCount(1)
}

test('intro preserves artwork and wording, locks scrolling and hands keyboard focus to Hero', async ({ page }, testInfo) => {
  const { errors, missingTargets } = await localPage(page)
  await expect(page.locator('html')).toHaveClass(/invitation-locked/)
  await expect(page.locator('body')).toHaveCSS('position', 'fixed')
  await expect(page.locator('main')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Micko & Christine — January 17, 2027')
  await expect(page.locator('.intro-art > img')).toBeVisible()
  await expect(page.locator('.intro-art > img')).toHaveAttribute('src', /invitation-gold-original\.png$/)
  const button = page.getByRole('button', { name: 'Open the Invitation', exact: true })
  await expect(button).toHaveCSS('opacity', '1')
  await page.mouse.wheel(0, 500)
  expect(await page.evaluate(() => scrollY)).toBe(0)
  expect(await page.locator('.intro-scroll').evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)
  expect(await page.locator('.intro-scroll').evaluate(element => element.scrollTop)).toBe(0)
  await page.keyboard.press('Tab')
  await expect(button).toBeFocused()
  await expect(button).toHaveCSS('outline-style', 'solid')
  if (!testInfo.project.use.hasTouch) {
    await button.hover()
    await expect(button).toHaveCSS('color', 'rgb(120, 80, 30)')
    await expect(button).toHaveCSS('background-color', 'rgb(244, 229, 200)')
  }
  await page.screenshot({ path: testInfo.outputPath('intro.png') })
  await page.keyboard.press('Enter')
  await page.keyboard.press('Enter')
  await opened(page)
  expect(await page.evaluate(() => scrollY)).toBe(0)
  await expect(page.locator('.hero-details__date')).toHaveText('January 17, 2027')
  await expect(page.locator('.hero-details__venue')).toHaveText('Baguio City')
  await expect(page.locator('.page-background__image')).toHaveCSS('background-image', /\/images\/hero\/lafayette\.png/)
  await expect(page.getByRole('timer', { name: 'Wedding countdown' })).toHaveAttribute('aria-live', 'off')
  await expect(page.locator('.hero-letter').last()).toHaveCSS('opacity', '1')
  for (const name of await page.locator('.hero-name').all()) {
    expect(await name.evaluate(element => new Set([...element.children].map(letter => letter.offsetTop)).size)).toBe(1)
  }
  await page.locator('#home').screenshot({ path: testInfo.outputPath('hero.png') })
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Discover our story' })).toBeFocused()
  await expect(page.getByRole('link', { name: 'Discover our story' })).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100)
  expect(errors).toEqual([])
  expect(missingTargets).toEqual([])
})

test('reduced motion can interrupt Intro opening and keeps Hero motion static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const { errors, missingTargets } = await localPage(page)
  await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await opened(page)
  await expect(page.locator('.page-background__image')).toHaveCSS('transform', 'none')
  await expect(page.locator('.hero-letter').first()).toHaveCSS('transform', 'none')
  await expect(page.locator('.hero-letter').last()).toHaveCSS('opacity', '1')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.hero-letter').last()).toHaveCSS('opacity', '1')
  expect(errors).toEqual([])
  expect(missingTargets).toEqual([])
})

test('Intro remains reachable in short landscapes and Hero text fits phone/tablet widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One responsive sweep covers the extra widths')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 667, height: 320 })
  const { errors } = await localPage(page)
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  const button = page.getByRole('button', { name: 'Open the Invitation', exact: true })
  await button.scrollIntoViewIfNeeded()
  await expect(button).toBeInViewport()
  await button.click()
  await opened(page)
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const fontSize of ['100%', '200%']) {
      await page.evaluate(size => { document.documentElement.style.fontSize = size }, fontSize)
      const bounds = await page.locator('.hero-name, .hero-letter, .hero-details, .countdown, .hero-scroll').evaluateAll(elements => elements.map(element => {
        const box = element.getBoundingClientRect()
        return { left: box.left, right: box.right, viewport: innerWidth }
      }))
      for (const box of bounds) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(box.viewport) }
      if (fontSize === '100%') {
        for (const name of await page.locator('.hero-name').all()) {
          expect(await name.evaluate(element => new Set([...element.children].map(letter => letter.offsetTop)).size)).toBe(1)
        }
      }
    }
  }
  expect(errors).toEqual([])
})

test('countdown uses one timer, resumes accurately and stops at the wedding time and on unmount', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    window.__testNow = Date.parse('2027-01-16T14:29:58+08:00')
    Date.now = () => window.__testNow
    window.__countdownIntervals = new Set()
    window.__hiddenForTest = false
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => window.__hiddenForTest })
    const set = window.setInterval.bind(window)
    const clear = window.clearInterval.bind(window)
    window.setInterval = (callback, delay, ...args) => {
      const id = set(callback, delay, ...args)
      if (delay === 1000) window.__countdownIntervals.add(id)
      return id
    }
    window.clearInterval = id => { window.__countdownIntervals.delete(id); clear(id) }
  })
  const { errors } = await localPage(page)
  await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click()
  await opened(page)
  await expect(page.locator('.countdown__item strong')).toHaveText(['001', '00', '00', '02'])
  expect(await page.evaluate(() => window.__countdownIntervals.size)).toBe(1)
  await page.evaluate(() => { window.__testNow += 2000 })
  await expect(page.locator('.countdown__item strong')).toHaveText(['001', '00', '00', '00'])
  await page.evaluate(() => { window.__hiddenForTest = true; document.dispatchEvent(new Event('visibilitychange')) })
  expect(await page.evaluate(() => window.__countdownIntervals.size)).toBe(0)
  await page.evaluate(() => { window.__testNow += 7000; window.__hiddenForTest = false; document.dispatchEvent(new Event('visibilitychange')); document.dispatchEvent(new Event('visibilitychange')) })
  await expect(page.locator('.countdown__item strong')).toHaveText(['000', '23', '59', '53'])
  expect(await page.evaluate(() => window.__countdownIntervals.size)).toBe(1)
  await page.evaluate(() => { window.__testNow = Date.parse('2027-01-17T14:30:00+08:00') })
  await expect(page.locator('.countdown__item strong')).toHaveText(['000', '00', '00', '00'])
  expect(await page.evaluate(() => window.__countdownIntervals.size)).toBe(0)
  // Rewind only this local clock to check teardown while a timer is running.
  await page.evaluate(() => { window.__testNow -= 10000; document.dispatchEvent(new Event('visibilitychange')) })
  expect(await page.evaluate(() => window.__countdownIntervals.size)).toBe(1)
  await page.evaluate(() => {
    document.getElementById('app').__vue_app__.unmount()
    document.dispatchEvent(new Event('visibilitychange'))
  })
  expect(await page.evaluate(() => window.__countdownIntervals.size)).toBe(0)
  expect(errors).toEqual([])
})
