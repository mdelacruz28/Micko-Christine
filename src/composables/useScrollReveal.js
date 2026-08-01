import { onBeforeUnmount, onMounted } from 'vue'

export function useScrollReveal(selector = '[data-reveal]') {
  let observer
  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'))
    }, { threshold: 0.15 })
    document.querySelectorAll(selector).forEach((element) => observer.observe(element))
  })
  onBeforeUnmount(() => observer?.disconnect())
}
