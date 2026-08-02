import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { gsap, ScrollTrigger } from '../plugins/gsap'

/**
 * Creates a GSAP context scoped to one Vue component.
 *
 * @param {import('vue').Ref<HTMLElement | null>} scopeRef
 * @param {(helpers: {
 *   gsap: typeof gsap,
 *   ScrollTrigger: typeof ScrollTrigger,
 *   scope: HTMLElement
 * }) => void | (() => void)} setup
 */
export function useGsapContext(scopeRef, setup) {
  let context
  let customCleanup

  onMounted(async () => {
    await nextTick()

    const scope = scopeRef.value
    if (!scope) return

    context = gsap.context(() => {
      customCleanup = setup({
        gsap,
        ScrollTrigger,
        scope
      })
    }, scope)

    ScrollTrigger.refresh()
  })

  onBeforeUnmount(() => {
    if (typeof customCleanup === 'function') {
      customCleanup()
    }

    context?.revert()
  })
}
