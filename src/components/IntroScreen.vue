<template>
  <section
    ref="introRef"
    class="intro-screen"
    :class="{ 'is-leaving': isLeaving }"
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

      <button class="intro-button" type="button" @click="openInvitation">
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
import { ref } from 'vue'
import { useGsapContext } from '../composables/useGsapContext'

const emit = defineEmits(['opened'])

const introRef = ref(null)
const isLeaving = ref(false)
const showMonogramImage = ref(true)

const monogramUrl = '/images/intro/Monogram.png'

let openingTimeline
let idleTimeline

useGsapContext(introRef, ({ gsap }) => {
  const media = gsap.matchMedia()

  media.add('(prefers-reduced-motion: no-preference)', () => {
    openingTimeline = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      }
    })

    openingTimeline
      .from('.intro-screen__background', {
        scale: 1.12,
        duration: 1.8,
        ease: 'power2.out'
      })
      .from(
        '.intro-screen__frame',
        {
          opacity: 0,
          scale: 0.97,
          duration: 0.9
        },
        0.25
      )
      .from(
        '.intro-monogram',
        {
          opacity: 0,
          y: 26,
          scale: 0.88,
          filter: 'blur(8px)',
          duration: 1.05
        },
        0.45
      )
      .from(
        '.intro-copy',
        {
          opacity: 0,
          y: 20,
          filter: 'blur(5px)',
          duration: 0.9
        },
        0.75
      )
      .from(
        '.intro-divider',
        {
          scaleX: 0,
          transformOrigin: 'center',
          duration: 0.7
        },
        0.95
      )
      .from(
        '.intro-button',
        {
          opacity: 0,
          y: 18,
          scale: 0.96,
          duration: 0.75
        },
        1.08
      )
      .from(
        '.intro-hint',
        {
          opacity: 0,
          y: 10,
          duration: 0.65
        },
        1.35
      )

    idleTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: {
        ease: 'sine.inOut'
      }
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
  })

  return () => media.revert()
})

const openInvitation = () => {
  if (isLeaving.value) return

  isLeaving.value = true
  idleTimeline?.pause()

  const gsap = openingTimeline?.constructor?.prototype
    ? openingTimeline.vars?.parent?.data
    : null

  // Use the globally registered GSAP instance from the active timeline.
  const timeline = openingTimeline?.timeline
    ? openingTimeline.timeline()
    : null

  const root = introRef.value
  if (!root) {
    emit('opened')
    document.querySelector('#home')?.scrollIntoView()
    return
  }

  import('../plugins/gsap').then(({ gsap }) => {
    gsap.timeline({
      onComplete: () => {
        emit('opened')
        document.querySelector('#home')?.scrollIntoView({
          behavior: 'auto',
          block: 'start'
        })
      }
    })
      .to('.intro-content, .intro-hint', {
        opacity: 0,
        y: -18,
        duration: 0.55,
        ease: 'power2.in'
      })
      .to(
        '.intro-screen__overlay',
        {
          opacity: 0.28,
          duration: 0.65,
          ease: 'power2.inOut'
        },
        0.05
      )
      .to(
        root,
        {
          yPercent: -100,
          duration: 1.05,
          ease: 'power4.inOut'
        },
        0.32
      )
  })
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
}

.intro-screen.is-leaving {
  pointer-events: none;
}

.intro-screen__background {
  position: absolute;
  inset: -4%;
  z-index: -4;
  background-image: url('/images/intro/intro-bg.png');
  background-size: cover;
  background-position: center;
  will-change: transform;
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
  will-change: transform, opacity, filter;
}

.intro-monogram img {
  width: clamp(150px, 22vw, 250px);
  max-height: 210px;
  object-fit: contain;
  filter: drop-shadow(0 14px 34px rgba(0, 0, 0, 0.32));
}

.intro-monogram__fallback {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(5rem, 14vw, 9rem);
  font-style: italic;
  line-height: 0.8;
  letter-spacing: -0.1em;
  text-shadow: 0 14px 34px rgba(0, 0, 0, 0.32);
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
  text-wrap: balance;
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
  box-shadow: 0 18px 46px rgba(4, 16, 24, 0.22);
  transition:
    background 0.25s ease,
    transform 0.25s ease;
}

.intro-button:hover {
  background: #fff;
  transform: translateY(-2px);
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

@media (max-width: 620px) {
  .intro-screen {
    padding-inline: 1rem;
  }

  .intro-copy {
    max-width: 330px;
    line-height: 1.9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro-button {
    transition: none;
  }
}
</style>
