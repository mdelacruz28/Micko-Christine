<template>
  <section
    ref="introRef"
    class="intro-screen"
    aria-label="Wedding invitation introduction"
  >
    <div class="intro-screen__background" aria-hidden="true"></div>
    <div class="intro-screen__overlay" aria-hidden="true"></div>
    <div class="intro-screen__frame" aria-hidden="true"></div>

    <div class="intro-content">
      <div class="intro-monogram" aria-label="Micko and Christine">
        <img
          v-if="showMonogramImage"
          :src="monogramUrl"
          alt="Micko and Christine monogram"
          @error="showMonogramImage = false"
        />

        <div v-else class="intro-monogram__fallback" aria-hidden="true">
          M<span>&amp;</span>C
        </div>
      </div>

      <p class="intro-copy">
        Together with our families, we invite you to celebrate our love story.
      </p>

      <div class="intro-divider" aria-hidden="true"></div>

      <button
        class="intro-button"
        type="button"
        :disabled="isOpening"
        @click="openInvitation"
      >
        <span>Open Invitation</span>

        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>

    <p class="intro-hint">Tap to begin</p>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from '../plugins/gsap'

const emit = defineEmits(['opened'])

const introRef = ref(null)
const isOpening = ref(false)
const showMonogramImage = ref(true)

const monogramUrl = '/images/intro/Monogram.png'

let context
let idleTimeline

onMounted(() => {
  document.documentElement.classList.add('invitation-locked')

  context = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' }
    })

    timeline
      .from('.intro-screen__background', {
        scale: 1.12,
        duration: 1.6,
        ease: 'power2.out'
      })
      .from(
        '.intro-screen__frame',
        {
          opacity: 0,
          scale: 0.97,
          duration: 0.8
        },
        0.2
      )
      .from(
        '.intro-monogram',
        {
          opacity: 0,
          y: 26,
          scale: 0.88,
          filter: 'blur(8px)',
          duration: 0.95
        },
        0.4
      )
      .from(
        '.intro-copy',
        {
          opacity: 0,
          y: 20,
          duration: 0.8
        },
        0.68
      )
      .from(
        '.intro-divider',
        {
          scaleX: 0,
          transformOrigin: 'center',
          duration: 0.6
        },
        0.86
      )
      .from(
        '.intro-button',
        {
          opacity: 0,
          y: 18,
          scale: 0.96,
          duration: 0.65
        },
        0.98
      )
      .from(
        '.intro-hint',
        {
          opacity: 0,
          y: 10,
          duration: 0.55
        },
        1.18
      )

    idleTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'sine.inOut' }
    })

    idleTimeline
      .to('.intro-monogram', {
        y: -5,
        duration: 2.2
      })
      .to(
        '.intro-button svg',
        {
          x: 4,
          duration: 0.9
        },
        0
      )
  }, introRef.value)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('invitation-locked')
  idleTimeline?.kill()
  context?.revert()
})

const openInvitation = () => {
  if (isOpening.value || !introRef.value) return

  isOpening.value = true
  idleTimeline?.pause()

  gsap.timeline({
    onComplete: () => {
      document.documentElement.classList.remove('invitation-locked')
      emit('opened')
    }
  })
    .to('.intro-content, .intro-hint', {
      opacity: 0,
      y: -18,
      duration: 0.45,
      ease: 'power2.in'
    })
    .to(
      introRef.value,
      {
        opacity: 0,
        scale: 1.025,
        duration: 0.75,
        ease: 'power3.inOut'
      },
      0.2
    )
}
</script>

<style scoped>
.intro-screen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  min-height: 100svh;
  display: grid;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  padding: 1.25rem;
  color: #fffaf5;
  background: #102634;
}

.intro-screen__background {
  position: absolute;
  inset: -4%;
  z-index: -4;
  background-color: #102634;
  background-image: url('/images/intro/intro_bg.png');
  background-size: cover;
  background-position: center;
}

.intro-screen__overlay {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(
      180deg,
      rgba(10, 23, 32, 0.38),
      rgba(11, 27, 38, 0.66)
    ),
    radial-gradient(
      circle at center,
      rgba(239, 180, 159, 0.08),
      rgba(8, 19, 27, 0.42)
    );
}

.intro-screen__frame {
  position: absolute;
  inset: clamp(0.75rem, 2vw, 1.5rem);
  z-index: -1;
  border: 1px solid rgba(255, 255, 255, 0.32);
  pointer-events: none;
}

.intro-screen__frame::after {
  content: '';
  position: absolute;
  inset: 0.45rem;
  border: 1px solid rgba(239, 180, 159, 0.14);
}

.intro-content {
  width: min(100%, 720px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.intro-monogram {
  min-height: 150px;
  display: grid;
  place-items: center;
  margin-bottom: 1.4rem;
}

.intro-monogram img {
  width: clamp(150px, 22vw, 250px);
  max-height: 210px;
  object-fit: contain;
}

.intro-monogram__fallback {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(5rem, 14vw, 9rem);
  font-style: italic;
  line-height: 0.8;
  letter-spacing: -0.1em;
}

.intro-monogram__fallback span {
  margin: 0 0.15em;
  font-family: 'Allura', cursive;
  font-size: 0.6em;
  color: #efb49f;
}

.intro-copy {
  width: min(100%, 620px);
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.7rem, 1.35vw, 0.88rem);
  font-weight: 400;
  line-height: 1.8;
  letter-spacing: clamp(0.12em, 0.35vw, 0.28em);
  text-transform: uppercase;
  color: rgba(255, 250, 245, 0.9);
}

.intro-divider {
  width: 82px;
  height: 1px;
  margin: 1.8rem 0;
  background: rgba(255, 255, 255, 0.7);
}

.intro-button {
  min-width: 225px;
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 0;
  border-radius: 999px;
  padding: 0.9rem 1.5rem;
  background: rgba(255, 250, 245, 0.96);
  color: #182f40;
  font-family: 'Manrope', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
}

.intro-button:disabled {
  cursor: wait;
}

.intro-button svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.intro-hint {
  position: absolute;
  bottom: clamp(2rem, 5vw, 3rem);
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.55rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255, 250, 245, 0.52);
}
</style>

<style>
html.invitation-locked,
html.invitation-locked body {
  overflow: hidden;
}
</style>
