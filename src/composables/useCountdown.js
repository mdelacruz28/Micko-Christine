import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export function useCountdown(targetDate) {
  const now = ref(Date.now())
  let timer
  onMounted(() => { timer = window.setInterval(() => { now.value = Date.now() }, 1000) })
  onBeforeUnmount(() => window.clearInterval(timer))

  const difference = computed(() => Math.max(new Date(targetDate).getTime() - now.value, 0))
  const parts = computed(() => {
    const total = difference.value
    return {
      days: Math.floor(total / 86400000),
      hours: Math.floor((total / 3600000) % 24),
      minutes: Math.floor((total / 60000) % 60),
      seconds: Math.floor((total / 1000) % 60),
    }
  })
  return { parts, difference }
}
