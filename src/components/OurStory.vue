<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, ScrollTrigger } from '../plugins/gsap'
import { useSectionParallax } from '../composables/useSectionParallax.js'
import StoryPhotoCarousel from './StoryPhotoCarousel.vue'
import { useCarouselAutoplay } from '../composables/useCarouselAutoplay.js'

const chapters = [
  {
    year: 'The Beginning',
    title: 'When our paths first crossed',
    description: 'What began as an ordinary moment slowly became something neither of us expected—a friendship filled with laughter, comfort, and a growing sense of home.',
    accent: 'A quiet hello became the start of everything.',
    images: ["/images/story/Paths%20first%20cross/IMG_1546.webp","/images/story/Paths%20first%20cross/IMG_1573.webp","/images/story/Paths%20first%20cross/IMG_1720.webp","/images/story/Paths%20first%20cross/IMG_E0466.webp"],
    alt: 'Micko and Christine at the beginning of their story'
  },
  {
    year: 'The Journey',
    title: 'Growing side by side',
    description: 'Through changing seasons, long conversations, adventures, and everyday moments, we learned that love is not only found in grand gestures, but in choosing one another again and again.',
    accent: 'Together, even the ordinary became meaningful.',
    images: ["/images/story/Growing%20SidebySide/IMG_1552.webp","/images/story/Growing%20SidebySide/IMG_1563.webp","/images/story/Growing%20SidebySide/IMG_1602.webp","/images/story/Growing%20SidebySide/IMG_E1589.webp","/images/story/Growing%20SidebySide/story2.png"],
    alt: 'Micko and Christine sharing a meaningful moment together'
  },
  {
    year: 'The Promise',
    title: 'Choosing forever',
    description: 'With grateful hearts and faith in the life ahead, we said yes to a new chapter—one built on love, commitment, growth, and the promise to walk through every season together.',
    accent: 'This is where forever begins.',
    images: ["/images/story/Choosing%20Forever/DCJN2842.JPG","/images/story/Choosing%20Forever/story3.jpg"],
    alt: 'Micko and Christine celebrating their engagement'
  }
]

const sectionRef = ref(null)
useSectionParallax(sectionRef, {
  foregroundSelector: '.story-depth'
})
const carouselRef = ref(null)
const activeIndex = ref(0)
const leavingIndex = ref(-1)
const transitioning = ref(false)
const reducedMotion = ref(false)
const autoplay = useCarouselAutoplay({ sectionRef, carouselRef, activeIndex, transitioning, reducedMotion, advance: () => goTo(activeIndex.value + 1, 1) })
const { paused: autoplayPaused, running: autoplayRunning } = autoplay
const announcement = computed(() => (activeIndex.value + 1) + ' of ' + chapters.length + ': ' + chapters[activeIndex.value].year + ' — ' + chapters[activeIndex.value].title)
let mediaContext
let motionQuery
let transition
let disposed = false

function finishTransition() {
  leavingIndex.value = -1
  transitioning.value = false
  if (carouselRef.value) gsap.set(carouselRef.value.querySelectorAll('.story-chapter'), { clearProps: 'opacity,transform' })
  transition = null
}

async function goTo(index, direction = index > activeIndex.value ? 1 : -1) {
  autoplay.restart()
  if (transitioning.value || disposed) return
  const next = (index + chapters.length) % chapters.length
  if (next === activeIndex.value) return
  const previous = activeIndex.value
  activeIndex.value = next
  if (reducedMotion.value) return
  leavingIndex.value = previous
  transitioning.value = true
  await nextTick()
  if (disposed || reducedMotion.value) { finishTransition(); return }
  const slides = carouselRef.value.querySelectorAll('.story-chapter')
  transition = gsap.timeline({ onComplete: finishTransition })
    .fromTo(slides[previous], { opacity: 1, x: 0 }, { opacity: 0, x: -16 * direction, duration: .3, ease: 'power2.inOut' }, 0)
    .fromTo(slides[next], { opacity: 0, x: 20 * direction }, { opacity: 1, x: 0, duration: .5, ease: 'power2.out' }, .05)
}

function onKeydown(event) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return
  const actions = {
    ArrowLeft: () => goTo(activeIndex.value - 1, -1),
    ArrowRight: () => goTo(activeIndex.value + 1, 1),
    Home: () => goTo(0),
    End: () => goTo(chapters.length - 1)
  }
  if (Object.hasOwn(actions, event.key)) { event.preventDefault(); actions[event.key]() }
}

// Keep vertical scrolling and pinch zoom native; only deliberate horizontal
// single-finger gestures change chapters. Desktop text selection is unaffected.
let gesture = null
function onTouchStart(event) {
  gesture = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null
}
function onTouchMove(event) { if (event.touches.length !== 1) gesture = null }
function onTouchEnd(event) {
  const start = gesture
  gesture = null
  if (!start || event.touches.length || event.changedTouches.length !== 1) return
  const dx = event.changedTouches[0].clientX - start.x
  const dy = event.changedTouches[0].clientY - start.y
  if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.5) goTo(activeIndex.value + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
}
function cancelGesture() { gesture = null }
function onMotionChange(event) {
  reducedMotion.value = event.matches
  if (event.matches) {
    transition?.kill()
    finishTransition()
  }
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', onMotionChange)
  mediaContext = gsap.matchMedia()
  mediaContext.add('(prefers-reduced-motion: no-preference)', () => {
    const context = gsap.context(() => {
      const header = sectionRef.value.querySelector('.story-header')
      gsap.from(header.children, {
        scrollTrigger: { trigger: header, start: 'top 85%', once: true },
        opacity: 0, y: 24, duration: .8, stagger: .1, ease: 'power2.out'
      })
    }, sectionRef.value)
    return () => context.revert()
  })
  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  disposed = true
  gesture = null
  transition?.kill()
  mediaContext?.revert()
  motionQuery?.removeEventListener('change', onMotionChange)
})
</script>

<template>
  <section id="story" ref="sectionRef" class="story-section">
    <div class="story-section__wash" aria-hidden="true"></div>
    <header class="story-header">
      <p class="story-header__eyebrow">A journey written in grace</p>
      <h2 class="section-heading" id="story-title">Our Story</h2>
      <p class="story-header__intro">From simple beginnings to a lifetime we now choose to share, every chapter has led us here.</p>
    </header>

    <div class="story-depth">
    <div ref="carouselRef" class="story-carousel" role="region" aria-roledescription="carousel" aria-labelledby="story-title" aria-describedby="story-instructions" tabindex="0" @keydown="onKeydown" @pointerenter="autoplay.pointerEnter" @pointerleave="autoplay.pointerLeave" @focusin="autoplay.focusIn" @focusout="autoplay.focusOut" @touchstart.passive="autoplay.touchStart" @touchend.passive="autoplay.touchEnd" @touchcancel.passive="autoplay.touchEnd">
      <p id="story-instructions" class="story-sr-only">Use the previous and next buttons, swipe left or right, or use the left and right arrow keys while this carousel is focused. Home goes to the first chapter; End goes to the last.</p>
      <div id="story-slides" class="story-slides" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove" @touchend.passive="onTouchEnd" @touchcancel.passive="cancelGesture">
        <article v-for="(chapter, index) in chapters" :key="chapter.title" class="story-chapter" :class="{ 'is-active': index === activeIndex, 'is-leaving': index === leavingIndex }" role="group" aria-roledescription="slide" :aria-label="(index + 1) + ' of ' + chapters.length + ': ' + chapter.year" :aria-hidden="index !== activeIndex" :inert="index !== activeIndex">
          <figure class="story-chapter__media">
            <StoryPhotoCarousel :images="chapter.images" :alt="chapter.alt" :playing="index === activeIndex && autoplayRunning && !transitioning" @photo-touch-start="autoplay.touchStart" @photo-touch-end="autoplay.touchEnd" />
            <figcaption class="story-chapter__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</figcaption>
          </figure>
          <div class="story-chapter__content">
            <p class="story-chapter__year">{{ chapter.year }}</p>
            <h3>{{ chapter.title }}</h3>
            <p class="story-chapter__description">{{ chapter.description }}</p>
            <span class="story-chapter__accent">{{ chapter.accent }}</span>
          </div>
        </article>
      </div>

      <div class="story-controls">
        <button type="button" class="story-arrow" aria-label="Previous story chapter" aria-controls="story-slides" :aria-disabled="transitioning" @click="goTo(activeIndex - 1, -1)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6 6-6-6 6-6" /></svg><span>Previous</span>
        </button>
        <div class="story-pagination" role="group" aria-label="Choose a story chapter">
          <button v-for="(chapter, index) in chapters" :key="chapter.title" type="button" class="story-dot" :aria-label="'Go to chapter ' + (index + 1) + ': ' + chapter.year" :aria-current="index === activeIndex ? 'true' : undefined" :aria-disabled="transitioning" aria-controls="story-slides" @click="goTo(index)"><span aria-hidden="true"></span></button>
        </div>
        <button type="button" class="story-arrow" aria-label="Next story chapter" aria-controls="story-slides" :aria-disabled="transitioning" @click="goTo(activeIndex + 1, 1)">
          <span>Next</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </button>
      </div>
      <button v-if="!reducedMotion" class="story-autoplay" type="button" :aria-pressed="autoplayPaused" @click="autoplayPaused = !autoplayPaused">{{ autoplayPaused ? 'Resume story autoplay' : 'Pause story autoplay' }}</button>
      <p class="story-status" role="status" :aria-live="autoplayRunning ? 'off' : 'polite'" aria-atomic="true">{{ announcement }}</p>
    </div>
    </div>

    <footer class="story-ending">
      <p class="story-ending__script">And the best is yet to come.</p>
      <div class="story-ending__ornament" aria-hidden="true"><span></span><i></i><span></span></div>
    </footer>
  </section>
</template>

<style scoped>
.story-section {
  --story-blue: #284d67;
  --story-melon: #efb49f;
  --story-bistre: #78614b;
  --story-ink: #24313a;
  --story-paper: #f8f3ec;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  color: var(--story-ink);
  background: linear-gradient(180deg, #f9f5ef 0%, #f5eee6 50%, #faf7f2 100%);
}
.story-section__wash { position: absolute; inset: -48px 0; z-index: -2; opacity: .38; pointer-events: none; background: radial-gradient(circle at 12% 18%, rgba(239,180,159,.28), transparent 25rem), radial-gradient(circle at 88% 62%, rgba(40,77,103,.15), transparent 28rem); }
.story-depth { position: relative; min-width: 0; }
.story-header { width: min(100%, 760px); margin: 0 auto clamp(2.5rem, 5vw, 4rem); text-align: center; }
.story-header__eyebrow { margin: 0 0 .75rem; font-family: 'Allura', cursive; font-size: clamp(1.7rem, 3vw, 2.5rem); color: var(--story-bistre); transform: rotate(-3deg); }
.story-header h2 { margin: 0; font-size: clamp(4rem, 8vw, 7rem); letter-spacing: -.04em; color: var(--story-blue); }
.story-header__intro { width: min(100%, 590px); margin: 1.75rem auto 0; font-family: 'Manrope', sans-serif; font-size: clamp(.92rem, 1.5vw, 1.05rem); font-weight: 300; line-height: 1.9; color: rgba(36,49,58,.75); }
.story-carousel { width: min(100%, 1080px); margin: 0 auto; min-width: 0; }
/* Shared grid cells reserve the tallest chapter's natural height, including
   inactive chapters. Enlarged text can grow without fixed heights or clipping. */
.story-slides { display: grid; touch-action: pan-y pinch-zoom; }
.story-chapter { grid-area: 1 / 1; display: grid; grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr); align-items: center; gap: clamp(2rem, 5vw, 5rem); min-width: 0; padding: clamp(1.25rem, 3vw, 2.5rem); border: 1px solid rgba(40,77,103,.14); background: rgba(255,250,245,.8); box-shadow: 0 24px 65px rgba(47,48,46,.07); visibility: hidden; pointer-events: none; }
.story-chapter.is-active, .story-chapter.is-leaving { visibility: visible; }
.story-chapter.is-active { pointer-events: auto; z-index: 1; }
.story-chapter__media { position: relative; width: 100%; margin: 0; min-width: 0; }
.story-chapter:first-child :deep(.story-photo-frame) { border: 8px solid #fff8f0; box-shadow: 0 18px 42px rgba(34, 42, 45, .16); }
.story-chapter:first-child :deep(.story-photo-frame::after) { content: ''; position: absolute; inset: .55rem; border: 1px solid rgba(255, 250, 245, .72); pointer-events: none; }
.story-chapter:first-child :deep(.story-photo-frame img) { filter: brightness(1.08) contrast(.97) saturate(.88) sepia(.04); }
.story-chapter__image-frame { position: relative; overflow: hidden; aspect-ratio: 4 / 5; background: #ddd4ca; box-shadow: 0 16px 40px rgba(47,48,46,.12); }
.story-chapter__image-frame::after { content: ''; position: absolute; inset: .75rem; border: 1px solid rgba(255,255,255,.52); pointer-events: none; }
.story-chapter__image-frame img { width: 100%; height: 100%; display: block; object-fit: cover; }
.story-chapter__image-fallback { position: absolute; inset: 0; display: grid; place-content: center; margin: 0; padding: 2rem; color: var(--story-blue); font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(1.3rem, 3vw, 2rem); text-align: center; line-height: 1.4; }
.story-chapter__number { position: absolute; right: -.4rem; bottom: -.8rem; padding: .2rem; font-family: 'Cormorant Garamond', serif; font-size: clamp(3.5rem, 7vw, 6rem); font-style: italic; line-height: 1; color: var(--story-blue); background: var(--story-paper); }
.story-chapter__content { min-width: 0; overflow-wrap: break-word; padding-block: .5rem; }
.story-chapter__year { margin: 0 0 .8rem; font-family: 'Manrope', sans-serif; font-size: .75rem; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: var(--story-bistre); }
.story-chapter h3 { margin: 0; font-family: 'Cormorant Garamond', serif; font-size: clamp(2.3rem, 4.8vw, 4rem); font-weight: 500; font-style: italic; line-height: 1.05; letter-spacing: -.025em; color: var(--story-blue); }
.story-chapter__description { margin: 1.5rem 0 0; font-family: 'Manrope', sans-serif; font-size: clamp(.9rem, 1.4vw, 1rem); font-weight: 300; line-height: 1.9; color: rgba(36,49,58,.76); }
.story-chapter__accent { display: inline-block; margin-top: 1.5rem; font-family: 'Allura', cursive; font-size: clamp(1.5rem, 2.5vw, 2rem); line-height: 1.3; color: var(--story-bistre); transform: rotate(-2deg); }
.story-controls { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-top: 1.5rem; }
.story-arrow { display: inline-flex; align-items: center; justify-content: center; gap: .6rem; min-height: 44px; padding: .6rem .8rem; border: 1px solid rgba(40,77,103,.25); background: transparent; color: var(--story-blue); font-family: 'Manrope', sans-serif; font-size: .8rem; }
.story-arrow svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.4; }
.story-arrow:hover { background: rgba(239,180,159,.18); }
.story-pagination { display: flex; flex-wrap: wrap; justify-content: center; }
.story-autoplay { display: block; min-height: 44px; margin: .75rem auto 0; padding: .5rem .8rem; border: 1px solid rgba(40,77,103,.25); background: transparent; color: var(--story-blue); font-family: 'Manrope', sans-serif; font-size: .8rem; }
.story-autoplay:focus-visible { outline: 2px solid var(--story-blue); outline-offset: 5px; }
.story-dot { display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; }
.story-dot span { width: .65rem; height: .65rem; border: 1px solid var(--story-blue); border-radius: 50%; }
.story-dot[aria-current='true'] span { background: var(--story-blue); box-shadow: 0 0 0 4px var(--story-paper), 0 0 0 5px rgba(40,77,103,.35); }
.story-status { margin: .8rem 0 0; color: var(--story-bistre); text-align: center; font-family: 'Manrope', sans-serif; font-size: .75rem; line-height: 1.7; }
.story-carousel:focus-visible, .story-arrow:focus-visible, .story-dot:focus-visible { outline: 2px solid var(--story-blue); outline-offset: 5px; }
.story-ending { margin-top: clamp(3rem, 6vw, 5rem); text-align: center; }
.story-ending__script { margin: 0; font-family: 'Allura', cursive; font-size: clamp(2.2rem, 5vw, 4rem); color: var(--story-blue); }
.story-ending__ornament { display: flex; justify-content: center; align-items: center; gap: .75rem; margin-top: 1.2rem; }
.story-ending__ornament span { width: clamp(2rem, 7vw, 5rem); height: 1px; background: rgba(120,97,75,.42); }
.story-ending__ornament i { width: 6px; height: 6px; border: 1px solid var(--story-melon); transform: rotate(45deg); }
.story-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
@media (max-width: 760px) {
  .story-chapter { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
  .story-chapter__image-frame { aspect-ratio: 4 / 3; }
}
@media (max-width: 520px) {
  .story-section { padding-inline: 1rem; }
  .story-arrow { width: 44px; padding: .5rem; flex: 0 0 44px; }
  .story-arrow span { display: none; }
  .story-status { font-size: .8rem; }
}
@media (prefers-reduced-motion: reduce) {
  .story-chapter { transform: none !important; }
  .story-chapter__accent { transform: none; }
  .story-header__eyebrow { transform: none; }
}
</style>

