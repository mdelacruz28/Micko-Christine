import { test, expect } from '@playwright/test'

const scopedSections = ['#details', '#dress-code', '#timeline', '#entourage', '#faq', '#closing']
async function openInvitation(page, motion = 'reduce') {
  await page.emulateMedia({ reducedMotion: motion })
  const errors = [], missingTargets = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'warning' && /GSAP target/.test(message.text())) missingTargets.push(message.text()) })
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: 'Open the Invitation', exact: true }).click()
  await expect(page.locator('#hero-title')).toBeFocused()
  return { errors, missingTargets }
}
async function scopedTriggers(page) {
  return page.evaluate(async () => {
    const { ScrollTrigger } = await import('/src/plugins/gsap.js')
    return ScrollTrigger.getAll().filter(trigger => trigger.trigger?.closest('#dress-code, #timeline, #entourage, #faq, #closing')).length
  })
}

test('wedding content, original links, labeled colors and back-to-top survive the UI recovery', async ({ page }, testInfo) => {
  const { errors, missingTargets } = await openInvitation(page)
  await expect(page.locator('#details .event-card h3')).toHaveText(['Bell Amphitheater', 'Lafaayette Luxury Suites'])
  await expect(page.locator('#details .event-card__meta-item strong')).toHaveText(['2:30 PM', '2:00 PM', '5:00 PM', '4:30 PM'])
  const links = page.locator('#details .event-card__button')
  await expect(links.nth(0)).toHaveAttribute('href', 'https://maps.google.com/?q=Bell+Amphitheater+Camp+John+Hay')
  await expect(links.nth(1)).toHaveAttribute('href', 'https://www.google.com/maps/dir/?api=1&origin=Bell+Amphitheater+Camp+John+Hay+Baguio&destination=Lafaayette+Luxury+Suites+Baguio&travelmode=driving')
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    await link.focus()
    await page.keyboard.press('Shift')
  }
  await expect(page.locator('#timeline [role="listitem"]')).toHaveCount(7)
  await expect(page.locator('#timeline .timeline-item__time span')).toHaveText(['2:00 PM', '2:30 PM', '4:00 PM', '5:00 PM', '6:45 PM', '7:45 PM', '9:00 PM'])
  await expect(page.locator('#timeline .timeline-card h3')).toHaveText(['Guest Arrival', 'Wedding Ceremony', 'Cocktail Hour', 'Grand Reception', 'Wine, Cake & Speeches', 'Music & After Party', 'A Grateful Farewell'])
  await expect(page.locator('#entourage .credit-group')).toHaveCount(6)
  await expect(page.locator('#entourage .paired-headings h3')).toHaveText(['Parents of the Groom', 'Parents of the Bride', 'Best Man', 'Matron of Honor'])
  await expect(page.locator('#dress-code .palette-swatch p')).toHaveText(['Pomegranate', 'Glazed Apricot', 'Spanish Bistre', 'Muted Sage', 'Dusty Rose', 'Warm Taupe'])
  await expect(page.getByRole('list', { name: 'Guest color inspiration' }).getByRole('listitem')).toHaveCount(6)
  for (const image of await page.locator('.dress-card__image').all()) await image.scrollIntoViewIfNeeded()
  await expect(page.locator('.dress-card__image-fallback')).toHaveText(['Formal attire inspiration for principal sponsors', 'Formal attire inspiration for the couple’s immediate family'])
  await expect(page.locator('.dress-card img').nth(0)).toHaveAttribute('src', '/images/dress-code/principal-sponsors.jpg')
  await expect(page.locator('.dress-card img').nth(1)).toHaveAttribute('src', '/images/dress-code/family.jpg')
  await expect(page.locator('.closing-content__message')).toContainText('Your love, prayers, and presence mean more to us than words can say.')
  await expect(page.locator('.closing-content__date')).toHaveText('January 17, 2027')
  await expect(page.locator('.page-background__image')).toHaveCSS('background-image', /\/images\/hero\/lafayette\.png/)
  for (const [name, selector] of [['details', '.details-grid'], ['dress', '.dress-featured'], ['timeline', '.timeline-item'], ['entourage', '.entourage-credits'], ['faq', '.faq-layout'], ['closing', '.closing-content']]) {
    await page.locator(selector).first().screenshot({ path: testInfo.outputPath(name + '.png') })
  }
  const top = page.getByRole('link', { name: 'Back to the beginning', exact: true })
  await top.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#hero-title')).toBeFocused()
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  expect(new URL(page.url()).hash).toBe('#home')
  expect(errors).toEqual([])
  expect(missingTargets).toEqual([])
})

test('FAQ exposes only expanded answers and supports keyboard navigation without clipped answers', async ({ page }) => {
  const { errors } = await openInvitation(page)
  const faq = page.locator('#faq')
  const first = faq.getByRole('button', { name: 'What should I wear?', exact: true })
  const second = faq.getByRole('button', { name: 'Can I bring a plus one?', exact: true })
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await expect(first).toHaveAttribute('aria-controls', 'faq-answer-1')
  await expect(faq.locator('#faq-answer-1')).toHaveAttribute('aria-labelledby', 'faq-question-1')
  await expect(faq.getByRole('region')).toHaveCount(1)
  await expect(faq.locator('#faq-answer-2')).toHaveAttribute('inert', '')
  await first.focus()
  await page.keyboard.press('ArrowDown')
  await expect(second).toBeFocused()
  await expect(second).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Space')
  await expect(second).toHaveAttribute('aria-expanded', 'true')
  await expect(first).toHaveAttribute('aria-expanded', 'false')
  await expect(faq.locator('#faq-answer-1')).toHaveAttribute('aria-hidden', 'true')
  expect((await faq.locator('#faq-answer-1').boundingBox()).height).toBe(0)
  await expect(faq.getByRole('region', { name: 'Can I bring a plus one?', exact: true })).toBeVisible()
  await expect(faq.getByRole('region', { name: 'What should I wear?', exact: true })).toHaveCount(0)
  await page.keyboard.press('Space')
  await expect(second).toHaveAttribute('aria-expanded', 'false')
  await expect(faq.getByRole('region')).toHaveCount(0)
  await page.keyboard.press('End')
  await expect(faq.getByRole('button', { name: 'Can I share the invitation link?', exact: true })).toBeFocused()
  await page.keyboard.press('Home')
  await expect(first).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
    await expect.poll(() => faq.locator('#faq-answer-1').evaluate(panel => panel.querySelector('.faq-item__answer-inner').scrollHeight - panel.querySelector('.faq-item__answer-clip').clientHeight)).toBeLessThanOrEqual(1)
  }
  expect(errors).toEqual([])
})

test('content motion respects initial and live preferences and cleans up its ScrollTriggers', async ({ page }) => {
  const { errors, missingTargets } = await openInvitation(page, 'no-preference')
  await expect.poll(() => scopedTriggers(page)).toBeGreaterThan(0)
  for (let i = 0; i < 2; i++) {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect.poll(() => scopedTriggers(page)).toBe(0)
    for (const selector of ['.details-header', '.dress-header h2', '.timeline-header h2', '.credit-group p', '.faq-header h2', '.closing-content h2']) {
      await expect(page.locator(selector).first()).toHaveCSS('opacity', '1')
      await expect(page.locator(selector).first()).toHaveCSS('transform', 'none')
    }
    await expect(page.locator('.dress-card__image').first()).toHaveCSS('clip-path', 'none')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect.poll(() => scopedTriggers(page)).toBeGreaterThan(0)
  }
  const second = page.locator('#faq-question-2')
  await second.click()
  await expect(second).toHaveAttribute('aria-expanded', 'true')
  await expect.poll(() => page.locator('#faq-answer-2').evaluate(panel => panel.querySelector('.faq-item__answer-inner').scrollHeight - panel.querySelector('.faq-item__answer-clip').clientHeight)).toBeLessThanOrEqual(1)
  await second.click()
  await expect.poll(async () => (await page.locator('#faq-answer-2').boundingBox()).height).toBe(0)
  await page.getByRole('link', { name: 'Back to the beginning', exact: true }).click()
  await expect(page.locator('#hero-title')).toBeFocused()
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  await page.evaluate(() => document.getElementById('app').__vue_app__.unmount())
  await expect.poll(() => scopedTriggers(page)).toBe(0)
  expect(errors).toEqual([])
  expect(missingTargets).toEqual([])
})

test('content layouts fit phones, tablets and enlarged text without timeline/footer overlaps', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One sweep covers additional widths and enlarged text')
  await openInvitation(page)
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const size of ['100%', '200%']) {
      await page.evaluate(value => { document.documentElement.style.fontSize = value }, size)
      const bounds = await page.locator(scopedSections.join(', ')).evaluateAll(sections => sections.flatMap(section => [...section.querySelectorAll('h2, h3, .event-card__button, .event-card__meta-item, .dress-card__column, .palette-swatch, .timeline-item__time, .timeline-card, .timeline-card__label, .timeline-card__venue, .timeline-card__description, .timeline-card__note, .credit-group p, .faq-item__question, .faq-item__answer-inner, .closing-content__names, .closing-content__top, .closing-footer')].map(element => {
        if (element.closest('[aria-hidden="true"]')) return null
        const box = element.getBoundingClientRect()
        return { name: element.tagName + '.' + element.className + ': ' + element.textContent.trim().slice(0, 60), decoratedCard: element.classList.contains('timeline-card'), left: box.left, right: box.right, viewport: innerWidth, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }
      }).filter(Boolean)))
      for (const box of bounds) {
        expect(box.left, box.name + ' left at ' + width + '/' + size).toBeGreaterThanOrEqual(-1)
        expect(box.right, box.name + ' right at ' + width + '/' + size).toBeLessThanOrEqual(box.viewport + 1)
        // The card's original pointer intentionally extends into the spine gap.
        // Check its actual text descendants for clipping, and its box for viewport bounds.
        if (!box.decoratedCard) expect(box.scrollWidth, box.name + ' text at ' + width + '/' + size).toBeLessThanOrEqual(box.clientWidth + 2)
      }
      if (size === '100%') {
        expect(await page.locator('.faq-aside h3').evaluate(heading => {
          const text = heading.firstChild
          const range = document.createRange()
          range.setStart(text, 0)
          range.setEnd(text, text.textContent.indexOf(' '))
          return range.getClientRects().length
        })).toBe(1)
      }
      if (width <= 860) {
        for (const item of await page.locator('.timeline-item').all()) {
          const time = await item.locator('.timeline-item__time').boundingBox()
          const card = await item.locator('.timeline-card').boundingBox()
          expect(card.y).toBeGreaterThanOrEqual(time.y + time.height)
        }
      }
      const closing = await page.locator('.closing-content').boundingBox()
      const footer = await page.locator('.closing-footer').boundingBox()
      expect(footer.y).toBeGreaterThanOrEqual(closing.y + closing.height)
      if (width <= 420) await expect(page.locator('.credit-group p').first()).toHaveCSS('font-size', size === '100%' ? '14px' : '28px')
    }
  }
})
