<template>
  <section
    ref="introRef"
    class="intro-screen"
    aria-label="Wedding invitation introduction"
  >
    <div class="intro-screen__backdrop" aria-hidden="true"></div>

    <div class="life-envelope">
      <div class="life-envelope__base" aria-hidden="true"></div>

      <div class="life-envelope__card">
        <div class="life-envelope__card-inner">
          <div class="life-envelope__monogram">
            <img
              v-if="showMonogramImage"
              :src="monogramUrl"
              alt="Micko and Christine monogram"
              @error="showMonogramImage = false"
            />

            <div v-else class="life-envelope__fallback" aria-hidden="true">
              M<span>&amp;</span>C
            </div>
          </div>

          <p class="life-envelope__eyebrow">Together with our families</p>

          <h1>Micko <span>&amp;</span> Christine</h1>

          <div class="life-envelope__divider" aria-hidden="true"></div>

          <p class="life-envelope__date">January 17, 2027</p>

          <p class="life-envelope__venue">
            Bell Amphitheater · Camp John Hay
          </p>
        </div>
      </div>

      <div class="life-envelope__pocket" aria-hidden="true"></div>
      <div class="life-envelope__left" aria-hidden="true"></div>
      <div class="life-envelope__right" aria-hidden="true"></div>
      <div class="life-envelope__bottom" aria-hidden="true"></div>

      <div class="life-envelope__flap" aria-hidden="true">
        <div class="life-envelope__flap-front"></div>
        <div class="life-envelope__flap-back"></div>
      </div>

      <div class="life-envelope__seal" aria-hidden="true">
        <span>M</span>
        <i>&amp;</i>
        <span>C</span>
      </div>
    </div>

    <div class="intro-actions">
      <button
        class="intro-button"
        type="button"
        :disabled="isOpening"
        @click="openInvitation"
      >
        <span>{{ isOpening ? 'Opening Invitation' : 'Open Invitation' }}</span>

        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>

      <p class="intro-hint">Tap to begin</p>
    </div>
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
    gsap.set('.life-envelope__card', {
      yPercent: 42,
      scale: 0.94,
      rotateZ: 0
    })

    gsap.set('.life-envelope__flap', {
      rotateX: 0,
      transformOrigin: 'top center'
    })

    gsap.set('.life-envelope__card-inner > *', {
      opacity: 0,
      y: 18
    })

    const introTimeline = gsap.timeline({
      defaults: { ease: 'power3.out' }
    })

    introTimeline
      .from('.intro-screen__backdrop', {
        scale: 1.08,
        duration: 1.5,
        ease: 'power2.out'
      })
      .from(
        '.life-envelope',
        {
          opacity: 0,
          scale: 1.035,
          duration: 0.95
        },
        0.18
      )
      .from(
        '.life-envelope__seal',
        {
          opacity: 0,
          scale: 0.55,
          duration: 0.7,
          ease: 'back.out(1.9)'
        },
        0.58
      )
      .from(
        '.intro-actions',
        {
          opacity: 0,
          y: 16,
          duration: 0.65
        },
        0.85
      )

    idleTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'sine.inOut' }
    })

    idleTimeline
      .to('.life-envelope__seal', {
        scale: 1.055,
        duration: 1.5
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
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      document.documentElement.classList.remove('invitation-locked')
      emit('opened')
    }
  })
    .to('.intro-actions', {
      opacity: 0,
      y: 14,
      duration: 0.32,
      pointerEvents: 'none'
    })
    .to(
      '.life-envelope__seal',
      {
        opacity: 0,
        scale: 0.55,
        duration: 0.28,
        ease: 'power2.in'
      },
      0.06
    )
    .to(
      '.life-envelope__flap',
      {
        rotateX: -180,
        duration: 1.05,
        ease: 'power4.inOut'
      },
      0.24
    )
    .to(
      '.life-envelope__card',
      {
        yPercent: 18,
        scale: 0.97,
        duration: 0.72,
        ease: 'power3.out'
      },
      0.88
    )
    .to({}, { duration: 0.32 })
    .to(
      '.life-envelope__card',
      {
        yPercent: -24,
        scale: 1,
        rotateZ: -1.2,
        duration: 1.12,
        ease: 'power4.out'
      },
      1.5
    )
    .to(
      '.life-envelope__pocket, .life-envelope__left, .life-envelope__right, .life-envelope__bottom',
      {
        yPercent: 28,
        opacity: 0.35,
        duration: 0.9,
        ease: 'power2.inOut'
      },
      1.78
    )
    .to(
      '.life-envelope__card-inner > *',
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.085,
        ease: 'power3.out'
      },
      2.05
    )
    .to(
      '.life-envelope__base',
      {
        opacity: 0.18,
        duration: 0.55
      },
      2.15
    )
    .to(
      '.life-envelope__card',
      {
        rotateZ: 0,
        scale: 1.025,
        duration: 0.65,
        ease: 'sine.inOut'
      },
      2.65
    )
    .to(
      '.life-envelope__card',
      {
        scale: 1.52,
        yPercent: -10,
        duration: 1.15,
        ease: 'power3.inOut'
      },
      3.05
    )
    .to(
      '.life-envelope__card-inner',
      {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in'
      },
      3.62
    )
    .to(
      introRef.value,
      {
        opacity: 0,
        duration: 0.65,
        ease: 'power2.inOut'
      },
      3.82
    )
}
</script>

<style scoped>
.intro-screen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
  color: #fffaf5;
  background: #102634;
  perspective: 2000px;
}

.intro-screen__backdrop {
  position: absolute;
  inset: -4%;
  z-index: -5;
  background-color: #102634;
  background-image:
    linear-gradient(
      180deg,
      rgba(10, 23, 32, 0.28),
      rgba(10, 23, 32, 0.5)
    ),
    url('/images/intro/intro_bg.png');
  background-size: cover;
  background-position: center;
}

.life-envelope {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transform-style: preserve-3d;
}

.life-envelope__base {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(
      145deg,
      #ecd2c5 0%,
      #d9aa95 50%,
      #c98d73 100%
    );
}

.life-envelope__card {
  position: absolute;
  left: 50%;
  top: 49%;
  z-index: 2;
  width: min(80vw, 820px);
  min-height: min(70vh, 660px);
  padding: clamp(0.8rem, 2vw, 1.2rem);
  transform: translate(-50%, -50%);
  background:
    linear-gradient(
      145deg,
      rgba(255, 253, 248, 0.995),
      rgba(246, 235, 224, 0.995)
    );
  color: #24313a;
  box-shadow: 0 36px 90px rgba(0, 0, 0, 0.28);
  will-change: transform;
}

.life-envelope__card::before {
  content: '';
  position: absolute;
  inset: clamp(0.65rem, 1.7vw, 1.1rem);
  border: 1px solid rgba(40, 77, 103, 0.2);
}

.life-envelope__card-inner {
  position: relative;
  min-height: calc(min(70vh, 660px) - 2.4rem);
  display: grid;
  place-content: center;
  justify-items: center;
  padding: clamp(1.5rem, 4vw, 3.2rem);
  text-align: center;
}

.life-envelope__monogram img {
  width: clamp(115px, 16vw, 190px);
  max-height: 160px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(28%) sepia(16%)
    saturate(1200%) hue-rotate(158deg) brightness(88%) contrast(90%);
}

.life-envelope__fallback {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(5rem, 12vw, 8rem);
  font-style: italic;
  line-height: 0.8;
  letter-spacing: -0.1em;
  color: #284d67;
}

.life-envelope__fallback span {
  margin: 0 0.12em;
  font-family: 'Allura', cursive;
  font-size: 0.6em;
  color: #a64248;
}

.life-envelope__eyebrow {
  margin: 1.2rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.55rem, 1.2vw, 0.72rem);
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #78614b;
}

.life-envelope__card h1 {
  margin: 1rem 0 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 7vw, 5.9rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
  color: #284d67;
}

.life-envelope__card h1 span {
  color: #a64248;
}

.life-envelope__divider {
  width: 74px;
  height: 1px;
  margin: 1.5rem 0 1rem;
  background: rgba(40, 77, 103, 0.36);
}

.life-envelope__date {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.65rem, 1.3vw, 0.82rem);
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #24313a;
}

.life-envelope__venue {
  margin: 0.55rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.58rem, 1.2vw, 0.74rem);
  letter-spacing: 0.08em;
  color: rgba(36, 49, 58, 0.68);
}

.life-envelope__pocket {
  position: absolute;
  inset: 0;
  z-index: 4;
  background:
    linear-gradient(
      145deg,
      rgba(244, 215, 201, 0.99),
      rgba(219, 174, 151, 0.99)
    );
  clip-path: polygon(0 39%, 50% 72%, 100% 39%, 100% 100%, 0 100%);
}

.life-envelope__left {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: linear-gradient(145deg, #efd1c0, #d7a289);
  clip-path: polygon(0 28%, 54% 72%, 0 100%);
}

.life-envelope__right {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: linear-gradient(215deg, #e8bea9, #ce9277);
  clip-path: polygon(100% 28%, 46% 72%, 100% 100%);
}

.life-envelope__bottom {
  position: absolute;
  inset: 0;
  z-index: 6;
  background: linear-gradient(180deg, #e8bea9, #d3997d);
  clip-path: polygon(0 100%, 50% 60%, 100% 100%);
}

.life-envelope__flap {
  position: absolute;
  inset: 0;
  z-index: 8;
  transform-style: preserve-3d;
  backface-visibility: visible;
}

.life-envelope__flap-front,
.life-envelope__flap-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  clip-path: polygon(0 0, 50% 60%, 100% 0);
}

.life-envelope__flap-front {
  background: linear-gradient(180deg, #f2d5c8, #dba58d);
}

.life-envelope__flap-back {
  background: linear-gradient(180deg, #c98f76, #e4b8a4);
  transform: rotateX(180deg);
}

.life-envelope__seal {
  position: absolute;
  left: 50%;
  top: 58%;
  z-index: 10;
  width: clamp(78px, 9vw, 110px);
  height: clamp(78px, 9vw, 110px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.08rem;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, #c2676c, #9e343b 72%);
  box-shadow:
    0 14px 30px rgba(92, 30, 35, 0.34),
    inset 0 0 0 4px rgba(255, 255, 255, 0.08);
  transform: translate(-50%, -50%);
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.2rem, 2.6vw, 1.8rem);
  font-style: italic;
  color: #fbe9df;
}

.life-envelope__seal i {
  font-family: 'Allura', cursive;
  font-size: 0.9em;
  color: #f3c2ad;
}

.intro-actions {
  position: absolute;
  left: 50%;
  bottom: clamp(1.5rem, 4vw, 2.8rem);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.intro-button {
  min-width: 230px;
  min-height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 0;
  border-radius: 999px;
  padding: 0.95rem 1.55rem;
  background: rgba(255, 250, 245, 0.97);
  color: #182f40;
  font-family: 'Manrope', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 18px 46px rgba(4, 16, 24, 0.22);
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
  margin: 0.8rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.52rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(255, 250, 245, 0.64);
}

@media (max-width: 760px) {
  .life-envelope__card {
    width: 86vw;
    min-height: 60vh;
  }

  .life-envelope__card-inner {
    min-height: calc(60vh - 2rem);
  }

  .life-envelope__seal {
    top: 60%;
  }
}

@media (max-width: 520px) {
  .life-envelope__card {
    width: 90vw;
    min-height: 55vh;
  }

  .life-envelope__card-inner {
    min-height: calc(55vh - 1.8rem);
    padding-inline: 1.2rem;
  }

  .life-envelope__seal {
    top: 61%;
  }

  .intro-button {
    min-width: 205px;
  }
}
</style>

<style>
html.invitation-locked,
html.invitation-locked body {
  overflow: hidden;
}
</style>
