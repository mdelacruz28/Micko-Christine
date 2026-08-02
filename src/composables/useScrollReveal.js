import { gsap } from '../plugins/gsap'

/**
 * Reusable scroll reveal animation.
 *
 * @param {Element | Element[] | NodeList | string} targets
 * @param {Object} options
 */
export function createScrollReveal(targets, options = {}) {
  const {
    trigger,
    start = 'top 84%',
    y = 36,
    x = 0,
    duration = 0.9,
    stagger = 0.12,
    once = true,
    delay = 0,
    ease = 'power3.out'
  } = options

  return gsap.from(targets, {
    opacity: 0,
    y,
    x,
    duration,
    stagger,
    delay,
    ease,
    scrollTrigger: {
      trigger: trigger || targets,
      start,
      once
    }
  })
}

/**
 * Splits text into span-wrapped characters for per-letter animations.
 * Use only on plain text elements.
 *
 * @param {HTMLElement} element
 */
export function splitTextIntoLetters(element) {
  if (!element) return []

  const text = element.textContent || ''
  const fragment = document.createDocumentFragment()
  const letters = []

  element.textContent = ''
  element.setAttribute('aria-label', text.trim())

  Array.from(text).forEach(character => {
    const span = document.createElement('span')
    span.className = 'motion-letter'
    span.setAttribute('aria-hidden', 'true')
    span.textContent = character === ' ' ? '\u00A0' : character

    letters.push(span)
    fragment.appendChild(span)
  })

  element.appendChild(fragment)

  return letters
}
