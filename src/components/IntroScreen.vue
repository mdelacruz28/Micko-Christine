<template>
  <section
    ref="introRef"
    class="intro-screen"
    aria-label="Wedding invitation introduction"
  >
    <div class="intro-screen__background" aria-hidden="true"></div>
    <div class="intro-screen__overlay" aria-hidden="true"></div>

    <div class="full-envelope">
      <div class="full-envelope__back" aria-hidden="true"></div>

      <div class="full-envelope__card">
        <div class="full-envelope__card-inner">
          <div class="full-envelope__monogram">
            <img
              v-if="showMonogramImage"
              :src="monogramUrl"
              alt="Micko and Christine monogram"
              @error="showMonogramImage = false"
            />

            <div v-else class="full-envelope__fallback" aria-hidden="true">
              M<span>&amp;</span>C
            </div>
          </div>

          <p class="full-envelope__eyebrow">Together with our families</p>

          <h1>Micko <span>&amp;</span> Christine</h1>

          <div class="full-envelope__divider" aria-hidden="true"></div>

          <p class="full-envelope__date">January 17, 2027</p>

          <p class="full-envelope__venue">
            Bell Amphitheater · Camp John Hay
          </p>
        </div>
      </div>

      <div class="full-envelope__pocket" aria-hidden="true"></div>
      <div class="full-envelope__side full-envelope__side--left" aria-hidden="true"></div>
      <div class="full-envelope__side full-envelope__side--right" aria-hidden="true"></div>
      <div class="full-envelope__bottom" aria-hidden="true"></div>

      <div class="full-envelope__flap" aria-hidden="true">
        <div class="full-envelope__flap-face"></div>
      </div>

      <div class="full-envelope__seal" aria-hidden="true">
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
    gsap.set('.full-envelope__card', {
      yPercent: 34,
      scale: 0.96
    })

    gsap.set('.full-envelope__flap', {
      rotateX: 0,
      transformOrigin: 'top center'
    })

    gsap.set('.full-envelope__card-inner > *', {
      opacity: 0,
      y: 20
    })

    const introTimeline = gsap.timeline({
      defaults: { ease: 'power3.out' }
    })

    introTimeline
      .from('.intro-screen__background', {
        scale: 1.08,
        duration: 1.5,
        ease: 'power2.out'
      })
      .from(
        '.full-envelope',
        {
          opacity: 0,
          scale: 1.03,
          duration: 1,
          ease: 'power2.out'
        },
        0.2
      )
      .from(
        '.intro-actions',
        {
          opacity: 0,
          y: 18,
          duration: 0.7
        },
        0.8
      )

    idleTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'sine.inOut' }
    })

    idleTimeline.to('.full-envelope__seal', {
      scale: 1.06,
      duration: 1.5
    })
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
      y: 18,
      duration: 0.35,
      pointerEvents: 'none'
    })
    .to(
      '.full-envelope__seal',
      {
        opacity: 0,
        scale: 0.65,
        duration: 0.28,
        ease: 'power2.in'
      },
      0.08
    )
    .to(
      '.full-envelope__flap',
      {
        rotateX: -180,
        duration: 0.9,
        ease: 'power3.inOut'
      },
      0.28
    )
    .to(
      '.full-envelope__card',
      {
        yPercent: -8,
        scale: 1,
        duration: 1.05,
        ease: 'power4.out'
      },
      0.72
    )
    .to(
      '.full-envelope__pocket, .full-envelope__side, .full-envelope__bottom',
      {
        opacity: 0.35,
        y: 90,
        duration: 0.8,
        ease: 'power2.inOut'
      },
      1.12
    )
    .to(
      '.full-envelope__card-inner > *',
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.09,
        ease: 'power3.out'
      },
      1.28
    )
    .to(
      '.full-envelope__back',
      {
        opacity: 0.2,
        duration: 0.6
      },
      1.55
    )
    .to(
      '.full-envelope__card',
      {
        scale: 1.04,
        duration: 0.75,
        ease: 'sine.inOut'
      },
      2
    )
    .to(
      introRef.value,
      {
        opacity: 0,
        scale: 1.02,
        duration: 0.85,
        ease: 'power3.inOut'
      },
      2.45
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
  perspective: 1800px;
}

.intro-screen__background {
  position: absolute;
  inset: -4%;
  z-index: -5;
  background-color: #102634;
  background-image: url('/images/intro/intro_bg.png');
  background-size: cover;
  background-position: center;
}

.intro-screen__overlay {
  position: absolute;
  inset: 0;
  z-index: -4;
  background:
    linear-gradient(
      180deg,
      rgba(10, 23, 32, 0.36),
      rgba(10, 23, 32, 0.62)
    ),
    radial-gradient(
      circle at center,
      rgba(239, 180, 159, 0.08),
      rgba(8, 19, 27, 0.5)
    );
}

.full-envelope {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  overflow: hidden;
}

.full-envelope__back {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(
      145deg,
      #e8c9b9 0%,
      #d9aa95 52%,
      #c88f77 100%
    );
}

.full-envelope__card {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  width: min(78vw, 760px);
  min-height: min(66vh, 610px);
  padding: clamp(0.8rem, 2vw, 1.2rem);
  transform: translate(-20%, -50%);
  background:
    linear-gradient(
      145deg,
      rgba(255, 253, 248, 0.99),
      rgba(246, 235, 224, 0.99)
    );
  color: #24313a;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.26);
}

.full-envelope__card::before {
  content: '';
  position: absolute;
  inset: clamp(0.6rem, 1.6vw, 1rem);
  border: 1px solid rgba(40, 77, 103, 0.2);
}

.full-envelope__card-inner {
  position: relative;
  min-height: calc(min(66vh, 610px) - 2.4rem);
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
  padding: clamp(1.5rem, 4vw, 3rem);
}

.full-envelope__monogram img {
  width: clamp(110px, 15vw, 180px);
  max-height: 150px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(28%) sepia(16%)
    saturate(1200%) hue-rotate(158deg) brightness(88%) contrast(90%);
}

.full-envelope__fallback {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(5rem, 12vw, 8rem);
  font-style: italic;
  line-height: 0.8;
  letter-spacing: -0.1em;
  color: #284d67;
}

.full-envelope__fallback span {
  margin: 0 0.12em;
  font-family: 'Allura', cursive;
  font-size: 0.6em;
  color: #a64248;
}

.full-envelope__eyebrow {
  margin: 1.2rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.55rem, 1.2vw, 0.72rem);
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #78614b;
}

.full-envelope__card h1 {
  margin: 1rem 0 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 7vw, 5.8rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
  color: #284d67;
}

.full-envelope__card h1 span {
  color: #a64248;
}

.full-envelope__divider {
  width: 72px;
  height: 1px;
  margin: 1.5rem 0 1rem;
  background: rgba(40, 77, 103, 0.36);
}

.full-envelope__date {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.65rem, 1.3vw, 0.82rem);
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #24313a;
}

.full-envelope__venue {
  margin: 0.55rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.58rem, 1.2vw, 0.74rem);
  letter-spacing: 0.08em;
  color: rgba(36, 49, 58, 0.68);
}

.full-envelope__pocket {
  position: absolute;
  inset: 0;
  z-index: 4;
  background:
    linear-gradient(
      145deg,
      rgba(243, 211, 196, 0.98),
      rgba(218, 172, 150, 0.98)
    );
  clip-path: polygon(0 42%, 50% 72%, 100% 42%, 100% 100%, 0 100%);
}

.full-envelope__side {
  position: absolute;
  inset: 0;
  z-index: 5;
}

.full-envelope__side--left {
  background: linear-gradient(145deg, #edcbb9, #d8a58d);
  clip-path: polygon(0 32%, 52% 72%, 0 100%);
}

.full-envelope__side--right {
  background: linear-gradient(215deg, #e4b9a4, #cf9479);
  clip-path: polygon(100% 32%, 48% 72%, 100% 100%);
}

.full-envelope__bottom {
  position: absolute;
  inset: 0;
  z-index: 6;
  background: linear-gradient(180deg, #e6bca8, #d49a7f);
  clip-path: polygon(0 100%, 50% 62%, 100% 100%);
}

.full-envelope__flap {
  position: absolute;
  inset: 0;
  z-index: 8;
  transform-style: preserve-3d;
  backface-visibility: visible;
}

.full-envelope__flap-face {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      180deg,
      #f0cfbf,
      #dba58d
    );
  clip-path: polygon(0 0, 50% 58%, 100% 0);
  backface-visibility: hidden;
}

.full-envelope__seal {
  position: absolute;
  left: 50%;
  top: 57%;
  z-index: 10;
  width: clamp(70px, 9vw, 100px);
  height: clamp(70px, 9vw, 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.08rem;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, #c2676c, #9e343b 72%);
  box-shadow:
    0 12px 26px rgba(92, 30, 35, 0.34),
    inset 0 0 0 4px rgba(255, 255, 255, 0.08);
  transform: translate(-50%, -50%);
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.2rem, 2.6vw, 1.8rem);
  font-style: italic;
  color: #fbe9df;
}

.full-envelope__seal i {
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
  color: rgba(255, 250, 245, 0.62);
}

@media (max-width: 760px) {
  .full-envelope__card {
    width: 84vw;
    min-height: 58vh;
  }

  .full-envelope__card-inner {
    min-height: calc(58vh - 2rem);
  }

  .full-envelope__seal {
    top: 59%;
  }
}

@media (max-width: 520px) {
  .full-envelope__card {
    width: 88vw;
    min-height: 54vh;
  }

  .full-envelope__card-inner {
    min-height: calc(54vh - 1.8rem);
    padding-inline: 1.2rem;
  }

  .full-envelope__seal {
    top: 60%;
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
