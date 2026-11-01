import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { gsap, ScrollTrigger } from '../plugins/gsap'

/**
 * Creates a scoped GSAP context only when motion is allowed. A live preference
 * change reverts animations; component teardown also disposes custom resources.
 *
 * @param {import('vue').Ref<HTMLElement | null>} scopeRef
 * @param {(helpers: {
 *   gsap: typeof gsap,
 *   ScrollTrigger: typeof ScrollTrigger,
 *   scope: HTMLElement
 * }) => void | (() => void)} setup
 */
export function useGsapContext(scopeRef, setup) {
  let mediaContext
  let disposed = false

  onMounted(async () => {
    await nextTick()

    const scope = scopeRef.value
    if (disposed || !scope) return

    mediaContext = gsap.matchMedia()
    mediaContext.add('(prefers-reduced-motion: no-preference)', () => {
      let customCleanup
      const context = gsap.context(() => {
        customCleanup = setup({ gsap, ScrollTrigger, scope })
      }, scope)
      ScrollTrigger.refresh()
      return () => {
        if (typeof customCleanup === 'function') customCleanup()
        context.revert()
      }
    })
  })

  onBeforeUnmount(() => {
    disposed = true
    mediaContext?.revert()
  })
}
