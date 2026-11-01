import { test, expect } from '@playwright/test'

async function load(page) {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  await page.goto('/')
  return errors
}

test('gold drawing plays once, advances smoothly and settles on the original artwork', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const errors = await load(page)
  const art = page.locator('.intro-art')
  await expect(art.locator('svg')).toHaveCount(1)
  await expect.poll(() => art.locator('svg [data-delay]').first().evaluate(path => path.getAnimations().length)).toBe(1)
  const offsets = await art.locator('svg [data-delay]').first().evaluate(path => {
    const animation = path.getAnimations()[0]
    animation.pause()
    animation.currentTime = 250
    const early = parseFloat(getComputedStyle(path).strokeDashoffset)
    animation.currentTime = 1250
    const later = parseFloat(getComputedStyle(path).strokeDashoffset)
    animation.play()
    return { early, later, iterations: animation.effect.getTiming().iterations }
  })
  expect(offsets.later).toBeLessThan(offsets.early)
  expect(offsets.iterations).toBe(1)
  await page.screenshot({ path: info.outputPath('intro-gold-drawing.png') })
  await expect(art).toHaveAttribute('data-complete', 'true', { timeout: 12000 })
  await expect(art.locator('svg')).toHaveCount(0)
  await expect(art.locator('img')).toHaveAttribute('src', /invitation-gold-original\.png$/)
  expect(await art.locator('img').evaluate(img => img.complete && img.naturalWidth === 1536)).toBe(true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(art.locator('svg')).toHaveCount(0)
  await page.screenshot({ path: info.outputPath('intro-gold-final.png') })
  expect(errors).toEqual([])
})

test('reduced motion shows final artwork immediately and can finish an active drawing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const errors = await load(page)
  await expect(page.locator('.intro-art')).toHaveAttribute('data-complete', 'true')
  await expect(page.locator('.intro-art svg')).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('.intro-art svg')).toHaveCount(0)
  await page.reload()
  await expect(page.locator('.intro-art svg')).toHaveCount(1)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.intro-art svg')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Open the Invitation', exact: true })).toBeEnabled()
  expect(errors).toEqual([])
})

test('missing Web Animations support preserves artwork and the opening flow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => { Element.prototype.animate = undefined })
  const errors = await load(page)
  await expect(page.locator('.intro-art')).toHaveAttribute('data-complete', 'true')
  await expect(page.locator('.intro-art svg')).toHaveCount(0)
  await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click()
  await expect(page.locator('.intro-screen')).toHaveCount(0)
  await expect(page.locator('#hero-title')).toBeFocused()
  await expect(page.locator('html')).not.toHaveClass(/invitation-locked/)
  expect(errors).toEqual([])
})

test('intro teardown cancels drawing and opening animations and restores scrolling', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'One lifecycle sweep')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const errors = await load(page)
  await expect.poll(() => page.locator('.intro-art svg [data-delay]').first().evaluate(path => path.getAnimations().length)).toBe(1)
  await page.evaluate(async () => {
    const vueUrl = performance.getEntriesByType('resource').map(entry => entry.name).find(url => url.includes('/deps/vue.js?'))
    const { createApp, nextTick } = await import(vueUrl)
    const { default: Intro } = await import('/src/components/IntroScreen.vue')
    const activeIn = host => document.getAnimations().filter(a => host.contains(a.effect?.target))
    const root = document.getElementById('app')
    const oldAnimations = activeIn(root)
    root.__vue_app__.unmount()
    if (oldAnimations.some(a => a.playState !== 'idle')) throw Error('Drawing leaked on teardown')
    const host = document.createElement('div')
    document.body.append(host)
    for (let i = 0; i < 3; i++) {
      const app = createApp(Intro)
      app.mount(host)
      await nextTick()
      await host.querySelector('img').decode()
      await new Promise(resolve => requestAnimationFrame(resolve))
      await new Promise(resolve => requestAnimationFrame(resolve))
      const animations = activeIn(host)
      if (!animations.length) throw Error('Remounted entrance did not start')
      if (i === 1) host.querySelector('button').click()
      const opening = activeIn(host)
      app.unmount()
      if ([...animations, ...opening].some(a => a.playState !== 'idle')) throw Error('Animation leaked on teardown')
      if (document.documentElement.classList.contains('invitation-locked')) throw Error('Scroll lock leaked')
      if (document.body.style.position === 'fixed') throw Error('Body lock leaked')
    }
    host.remove()
  })
  expect(errors).toEqual([])
})

test('full-screen floral frame and monogram fit portrait, landscape and enlarged text', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'One complete responsive sweep')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const errors = await load(page)
  await page.locator('.intro-art img').evaluate(img => img.decode())
  for (const [width, height] of [[1861,949],[390,844],[320,740],[768,1024],[667,320],[2560,1080],[1366,768],[375,667]]) {
    await page.setViewportSize({ width, height })
    for (const fontSize of ['100%', '200%']) {
      await page.evaluate(value => { document.documentElement.style.fontSize = value }, fontSize)
      const layout = await page.evaluate(() => {
        const bg = document.querySelector('.intro-screen__background').getBoundingClientRect()
        const bounds = [...document.querySelectorAll('.intro-art,.intro-button')].map(el => {
          const b = el.getBoundingClientRect()
          return { left:b.left, top:b.top, right:b.right, bottom:b.bottom }
        })
        const image = document.querySelector('.intro-art > img').getBoundingClientRect()
        return { backgroundWidth:bg.width, backgroundHeight:bg.height, bounds, imageRatio:image.width/image.height, scroll:document.documentElement.scrollWidth }
      })
      expect(layout.backgroundWidth).toBe(width)
      expect(layout.backgroundHeight).toBe(height)
      expect(layout.scroll).toBeLessThanOrEqual(width)
      expect(layout.imageRatio).toBeCloseTo(1.5, 2)
      for (const b of layout.bounds) {
        expect(b.left).toBeGreaterThanOrEqual(-1)
        expect(b.top).toBeGreaterThanOrEqual(-1)
        expect(b.right).toBeLessThanOrEqual(width + 1)
        expect(b.bottom).toBeLessThanOrEqual(height + 1)
      }
    }
  }
  expect(errors).toEqual([])
})

