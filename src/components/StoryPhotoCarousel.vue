<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
const props = defineProps({ images: { type: Array, required: true }, alt: { type: String, required: true }, playing: { type: Boolean, default: false } })
const emit = defineEmits(['photo-touch-start', 'photo-touch-end'])
const index = ref(0)
const failed = ref(false)
function move(step) { index.value = (index.value + step + props.images.length) % props.images.length; failed.value = false }
let timer
watch([() => props.playing, index], () => {
  clearTimeout(timer)
  if (props.playing && props.images.length > 1) timer = setTimeout(() => move(1), 3000)
}, { immediate: true })
onBeforeUnmount(() => clearTimeout(timer))
let touch
function start(e) { emit('photo-touch-start'); touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null }
function end(e) {
  emit('photo-touch-end')
  if (!touch || e.changedTouches.length !== 1) return
  const dx = e.changedTouches[0].clientX - touch.x
  const dy = e.changedTouches[0].clientY - touch.y
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1)
  touch = null
}
function keyboard(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.stopPropagation(); e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1) }
}
</script>
<template>
  <div class="story-photos" role="group" :aria-label="alt + ' photos'" @keydown="keyboard" @touchstart.stop.passive="start" @touchmove.stop.passive="($event.touches.length !== 1) && (touch = null)" @touchend.stop.passive="end" @touchcancel.stop.passive="touch = null; emit('photo-touch-end')">
    <div class="story-photo-frame">
      <Transition name="story-photo" mode="out-in">
        <img v-if="!failed" :key="images[index]" :src="images[index]" :alt="alt + ' — photo ' + (index + 1) + ' of ' + images.length" width="800" height="1000" loading="lazy" decoding="async" @error="failed = true" />
        <p v-else class="story-photo-fallback">{{ alt }}</p>
      </Transition>
    </div>
    <div class="story-photo-controls">
      <button type="button" aria-label="Previous photo" @click.stop="move(-1)">←</button>
      <span :aria-live="playing ? 'off' : 'polite'" aria-atomic="true">{{ index + 1 }} / {{ images.length }}</span>
      <button type="button" aria-label="Next photo" @click.stop="move(1)">→</button>
    </div>
  </div>
</template>
<style scoped>
.story-photos { min-width: 0; }
.story-photo-frame { aspect-ratio: 4 / 5; overflow: hidden; position: relative; background: #e5ded5; box-shadow: 0 16px 40px rgba(47,48,46,.12); }
.story-photo-frame img { display: block; width: 100%; height: 100%; object-fit: cover; }
.story-photo-fallback { position: absolute; inset: 0; display: grid; place-content: center; padding: 1rem; text-align: center; }
.story-photo-controls { display: flex; align-items: center; justify-content: center; gap: 1rem; padding-top: .65rem; color: #284d67; }
.story-photo-controls button { width: 44px; height: 44px; border: 1px solid rgba(40,77,103,.25); border-radius: 50%; background: rgba(255,250,245,.85); color: inherit; font-size: 1.2rem; }
.story-photo-controls span { font-size: .75rem; min-width: 3rem; text-align: center; }
.story-photo-controls button:focus-visible { outline: 2px solid #284d67; outline-offset: 3px; }
.story-photo-enter-active,.story-photo-leave-active { transition: opacity .25s ease; }
.story-photo-enter-from,.story-photo-leave-to { opacity: 0; }
@media(prefers-reduced-motion:reduce) { .story-photo-enter-active,.story-photo-leave-active { transition: none; } }
</style>
