import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export function useCarouselAutoplay({ sectionRef, carouselRef, activeIndex, transitioning, reducedMotion, advance }) {
  const paused = ref(false)
  const hovered = ref(false)
  const focused = ref(false)
  const touching = ref(false)
  const visible = ref(false)
  const tabVisible = ref(true)
  const running = computed(() => !paused.value && !hovered.value && !focused.value && !touching.value && visible.value && tabVisible.value && !reducedMotion.value)
  let timer, observer, disposed = false
  function stop() { clearTimeout(timer); timer = undefined }
  function restart() {
    stop()
    if (disposed || !running.value) return
    timer = setTimeout(() => {
      timer = undefined
      if (disposed || !running.value) return
      if (!transitioning.value) advance()
      // Active-index watching normally starts the next countdown. This also
      // handles an in-flight transition without creating a second scheduler.
      restart()
    }, 10000)
  }
  function visibilityChanged() { tabVisible.value = !document.hidden }
  function pointerEnter(event) { if (event.pointerType === 'mouse') hovered.value = true }
  function pointerLeave() { hovered.value = false }
  function focusIn() { focused.value = true }
  function focusOut(event) { if (!carouselRef.value?.contains(event.relatedTarget)) focused.value = false }
  function touchStart() { touching.value = true }
  function touchEnd() { touching.value = false }
  watch([running, activeIndex], restart, { flush: 'post' })
  onMounted(() => {
    visibilityChanged()
    document.addEventListener('visibilitychange', visibilityChanged)
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        const entry = entries[0]
        visible.value = entry.isIntersecting && entry.intersectionRatio > 0
      }, { threshold: [0, .01] })
      observer.observe(sectionRef.value)
    }
  })
  onBeforeUnmount(() => {
    disposed = true
    stop()
    observer?.disconnect()
    document.removeEventListener('visibilitychange', visibilityChanged)
  })
  return { paused, running, restart, pointerEnter, pointerLeave, focusIn, focusOut, touchStart, touchEnd }
}
