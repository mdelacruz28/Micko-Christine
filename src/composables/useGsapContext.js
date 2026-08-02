import { onBeforeUnmount, onMounted } from 'vue'
import { gsap } from '../plugins/gsap'

export function useGsapContext(scope, animationCallback) {
  let context

  onMounted(() => {
    context = gsap.context(() => {
      animationCallback()
    }, scope.value)
  })

  onBeforeUnmount(() => {
    context?.revert()
  })
}