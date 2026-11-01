import { useGsapContext } from './useGsapContext.js'

/**
 * Small, section-local depth effect. Background overscan in CSS must exceed
 * backgroundTravel. Keep foreground targets separate from entrance/slide targets
 * so scroll and interaction animations never write the same transform.
 * Touch/narrow screens and reduced motion retain the ordinary document flow.
 */
export function useSectionParallax(scopeRef, {
  backgroundSelector,
  foregroundSelector,
  backgroundTravel = 32,
  foregroundTravel = 12
}) {
  useGsapContext(scopeRef, ({ gsap, scope }) => {
    const background = backgroundSelector ? scope.querySelector(backgroundSelector) : null
    const foreground = foregroundSelector ? scope.querySelector(foregroundSelector) : null
    if (!background && !foreground) return

    const media = gsap.matchMedia()
    media.add('(min-width: 1024px) and (pointer: fine)', () => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none', duration: 1, force3D: false },
        scrollTrigger: {
          id: 'depth-' + scope.id,
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true
        }
      })
      if (background) timeline.fromTo(background, { y: -backgroundTravel }, { y: backgroundTravel }, 0)
      if (foreground) timeline.fromTo(foreground, { y: foregroundTravel }, { y: -foregroundTravel }, 0)
    })
    return () => media.revert()
  })
}
