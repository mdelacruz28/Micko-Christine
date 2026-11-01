<template>
  <section ref="introRef" class="intro-screen" aria-label="Wedding invitation introduction">
    <div class="intro-screen__background" aria-hidden="true">
      <svg class="intro-paper" viewBox="420 300 696 424" preserveAspectRatio="none">
        <image :href="backgroundUrl" width="1536" height="1024" />
      </svg>
      <div class="intro-frame"></div>
      <svg v-for="corner in backgroundCorners" :key="corner.name" :class="['intro-corner', 'intro-corner--' + corner.name]" :viewBox="corner.viewBox">
        <image :href="backgroundUrl" width="1536" height="1024" />
      </svg>
      <svg class="intro-flourish intro-flourish--top" viewBox="640 0 256 120">
        <image :href="backgroundUrl" width="1536" height="1024" />
      </svg>
      <svg class="intro-flourish intro-flourish--bottom" viewBox="640 904 256 120">
        <image :href="backgroundUrl" width="1536" height="1024" />
      </svg>
    </div>
    <div class="intro-scroll">
      <div class="intro-content">
        <h1 class="intro-names intro-sr-only">Micko &amp; Christine — January 17, 2027</h1>
        <div ref="artRef" class="intro-art" data-wedding-intro data-intro-viewbox="400 160 736 680">
          <img
            :src="artworkUrl"
            width="1536"
            height="1024"
            fetchpriority="high"
            decoding="async"
            alt="Gold M and C monogram, Micko and Christine, January 17, 2027, surrounded by cream and blue flowers."
          />
        </div>
        <button class="intro-button" type="button" :disabled="isOpening" @click="openInvitation">
          <span>{{ isOpening ? 'Opening Invitation' : 'Open the Invitation' }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { mountWeddingIntro } from '../utils/weddingIntro'

const emit = defineEmits(['opened'])
const introRef = ref(null)
const artRef = ref(null)
const isOpening = ref(false)
const artworkUrl = import.meta.env.BASE_URL + 'images/intro/invitation-gold-original.png'
const backgroundUrl = import.meta.env.BASE_URL + 'images/intro/Elegant Gold-Framed Floral Invitation Background.png'
const backgroundCorners = [{ name: 'tl', viewBox: '0 0 512 512' }, { name: 'tr', viewBox: '1024 0 512 512' }, { name: 'bl', viewBox: '0 512 512 512' }, { name: 'br', viewBox: '1024 512 512 512' }]
let entrance
let motionQuery
let openingAnimation
let restoreScroll
let opened = false
let disposed = false

function lockScroll() {
  const root = document.documentElement
  const body = document.body
  const alreadyLocked = root.classList.contains('invitation-locked')
  const position = { x: window.scrollX, y: window.scrollY }
  const previous = {}
  for (const key of ['position', 'top', 'left', 'right', 'width']) previous[key] = body.style[key]
  root.classList.add('invitation-locked')
  Object.assign(body.style, { position: 'fixed', top: -position.y + 'px', left: '0', right: '0', width: '100%' })
  restoreScroll = () => {
    if (!alreadyLocked) root.classList.remove('invitation-locked')
    Object.assign(body.style, previous)
    window.scrollTo({ left: position.x, top: position.y, behavior: 'instant' })
    restoreScroll = null
  }
}
function finishOpening() {
  if (opened || disposed) return
  opened = true
  restoreScroll?.()
  emit('opened')
}
function onMotionChange(event) {
  if (event.matches && isOpening.value) {
    openingAnimation?.cancel()
    finishOpening()
  }
}
function openInvitation() {
  if (isOpening.value || disposed) return
  isOpening.value = true
  entrance?.finish()
  if (motionQuery?.matches || !introRef.value?.animate) {
    finishOpening()
    return
  }
  openingAnimation = introRef.value.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 450, easing: 'ease-in-out', fill: 'forwards', iterations: 1
  })
  openingAnimation.finished.then(finishOpening).catch(() => {
    if (!disposed) finishOpening()
  })
}
onMounted(() => {
  lockScroll()
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener('change', onMotionChange)
  entrance = mountWeddingIntro(artRef.value)
})
onBeforeUnmount(() => {
  disposed = true
  entrance?.destroy()
  openingAnimation?.cancel()
  motionQuery?.removeEventListener('change', onMotionChange)
  restoreScroll?.()
})
</script>

<style scoped>
.intro-screen { position: fixed; inset: 0; z-index: 1000; height: 100dvh; overflow: hidden; isolation: isolate; background: #fbf1df; color: #76501f; }
.intro-screen__background { --corner-size: clamp(130px, 27vmin, 340px); position: absolute; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
.intro-paper { position: absolute; inset: 0; width: 100%; height: 100%; }
.intro-frame { position: absolute; inset: calc(var(--corner-size) * .13) calc(var(--corner-size) * .055); border: 3px double #aa7c31; border-radius: 4px; opacity: .85; }
.intro-corner { position: absolute; width: var(--corner-size); height: var(--corner-size); mask-composite: intersect; -webkit-mask-composite: source-in; }
.intro-corner--tl { top: 0; left: 0; mask-image: linear-gradient(to right, #000 78%, transparent), linear-gradient(to bottom, #000 78%, transparent); }
.intro-corner--tr { top: 0; right: 0; mask-image: linear-gradient(to left, #000 78%, transparent), linear-gradient(to bottom, #000 78%, transparent); }
.intro-corner--bl { bottom: 0; left: 0; mask-image: linear-gradient(to right, #000 78%, transparent), linear-gradient(to top, #000 78%, transparent); }
.intro-corner--br { bottom: 0; right: 0; mask-image: linear-gradient(to left, #000 78%, transparent), linear-gradient(to top, #000 78%, transparent); }
.intro-flourish { position: absolute; left: 50%; translate: -50% 0; width: calc(var(--corner-size) * .5); height: auto; aspect-ratio: 256 / 120; mask-image: linear-gradient(to right, transparent, #000 25%, #000 75%, transparent); }
.intro-flourish--top { top: 0; }
.intro-flourish--bottom { bottom: 0; }

.intro-scroll { height: 100%; width: 100%; display: grid; place-items: safe center; overflow: auto; overscroll-behavior: contain; padding: max(24px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left)); box-sizing: border-box; }
.intro-content { width: 100%; margin: auto; display: flex; flex-direction: column; align-items: center; text-align: center; }
.intro-art { position: relative; flex: 0 0 auto; width: min(96vw, calc((100svh - 150px) * 736 / 680), 740px); max-width: 100%; aspect-ratio: 736 / 680; overflow: hidden; mask-image: radial-gradient(ellipse closest-side at center, #000 90%, transparent 100%); -webkit-mask-image: radial-gradient(ellipse closest-side at center, #000 90%, transparent 100%); }
.intro-art > img { position: absolute; display: block; max-width: none; width: 208.695652%; height: 150.588235%; left: -54.347826%; top: -23.529412%; }
.intro-art :deep(> svg) { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
.intro-button { display: inline-flex; align-items: center; justify-content: center; gap: .8rem; min-height: 48px; max-width: 100%; margin-top: 12px; padding: 12px 24px; border: 1px solid #ac803c; background: #fff8e9ed; color: #78501e; font: 500 .7rem/1.5 Georgia, serif; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; }
.intro-button:hover:not(:disabled) { background: #f4e5c8; }
.intro-button:focus-visible { outline: 2px solid #78501e; outline-offset: 5px; }
.intro-button:disabled { cursor: wait; }
.intro-button svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; flex: 0 0 auto; }
.intro-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
@media (max-width: 620px) { .intro-button { letter-spacing: .08em; padding-inline: 18px; } }
@media (max-height: 500px) and (min-aspect-ratio: 1/1) {
  .intro-content { flex-direction: row; justify-content: center; gap: clamp(12px, 4vw, 48px); }
  .intro-art { width: min(50vw, calc((100svh - 52px) * 736 / 680)); }
  .intro-button { margin-top: 0; max-width: 42vw; }
}
</style>

<style>
html.invitation-locked, html.invitation-locked body { overflow: hidden; }
</style>
