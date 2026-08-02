<template>
  <section
    ref="introRef"
    class="intro-screen"
    aria-label="Wedding invitation introduction"
  >
    <div class="intro-screen__background" aria-hidden="true"></div>
    <div class="intro-screen__overlay" aria-hidden="true"></div>
    <div class="intro-screen__frame" aria-hidden="true"></div>

    <div class="intro-stage">
      <div class="envelope-scene">
        <div class="envelope-shadow" aria-hidden="true"></div>

        <div class="invitation-card">
          <div class="invitation-card__inner">
            <div class="invitation-card__monogram">
              <img
                v-if="showMonogramImage"
                :src="monogramUrl"
                alt="Micko and Christine monogram"
                @error="showMonogramImage = false"
              />

              <div v-else class="invitation-card__fallback" aria-hidden="true">
                M<span>&amp;</span>C
              </div>
            </div>

            <p class="invitation-card__eyebrow">Together with our families</p>

            <h1>Micko <span>&amp;</span> Christine</h1>

            <div class="invitation-card__divider" aria-hidden="true"></div>

            <p class="invitation-card__date">January 17, 2027</p>

            <p class="invitation-card__venue">
              Bell Amphitheater · Camp John Hay
            </p>
          </div>
        </div>

        <div class="envelope">
          <div class="envelope__back"></div>

          <div class="envelope__letter-pocket"></div>

          <div class="envelope__front envelope__front--left"></div>
          <div class="envelope__front envelope__front--right"></div>
          <div class="envelope__front envelope__front--bottom"></div>

          <div class="envelope__flap">
            <div class="envelope__flap-inner"></div>
          </div>

          <div class="envelope__seal" aria-hidden="true">
            <span>M</span>
            <i>&amp;</i>
            <span>C</span>
          </div>
        </div>
      </div>

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

const monogramUrl = '/images/monogram/white.png'

let context
let idleTimeline

onMounted(() => {
  document.documentElement.classList.add('invitation-locked')

  context = gsap.context(() => {
    gsap.set('.invitation-card', {
      yPercent: 44,
      scale: 0.94
    })

    gsap.set('.envelope__flap', {
      rotateX: 0,
      transformOrigin: 'top center'
    })

    const introTimeline = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      }
    })

    introTimeline
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
        '.envelope-scene',
        {
          opacity: 0,
          y: 42,
          scale: 0.9,
          duration: 1,
          ease: 'back.out(1.35)'
        },
        0.35
      )
      .from(
        '.intro-button',
        {
          opacity: 0,
          y: 18,
          duration: 0.65
        },
        0.85
      )
      .from(
        '.intro-hint',
        {
          opacity: 0,
          y: 10,
          duration: 0.55
        },
        1
      )

    idleTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: {
        ease: 'sine.inOut'
      }
    })

    idleTimeline
      .to('.envelope-scene', {
        y: -5,
        duration: 2.1
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

  const openTimeline = gsap.timeline({
    defaults: {
      ease: 'power3.inOut'
    },
    onComplete: () => {
      document.documentElement.classList.remove('invitation-locked')
      emit('opened')
    }
  })

  openTimeline
    .to('.intro-button, .intro-hint', {
      opacity: 0,
      y: 12,
      duration: 0.35,
      pointerEvents: 'none'
    })
    .to(
      '.envelope__seal',
      {
        opacity: 0,
        scale: 0.65,
        duration: 0.3,
        ease: 'power2.in'
      },
      0.08
    )
    .to(
      '.envelope__flap',
      {
        rotateX: -180,
        duration: 0.82,
        ease: 'power3.inOut'
      },
      0.26
    )
    .to(
      '.invitation-card',
      {
        yPercent: -28,
        scale: 1,
        duration: 1.05,
        ease: 'power4.out'
      },
      0.72
    )
    .to(
      '.envelope',
      {
        y: 85,
        opacity: 0.55,
        scale: 0.96,
        duration: 0.75,
        ease: 'power2.inOut'
      },
      1.15
    )
    .from(
      '.invitation-card__inner > *',
      {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.09,
        ease: 'power3.out'
      },
      1.34
    )
    .to(
      '.envelope-shadow',
      {
        opacity: 0,
        scaleX: 0.75,
        duration: 0.55
      },
      1.45
    )
    .to(
      '.invitation-card',
      {
        scale: 1.035,
        duration: 0.8,
        ease: 'sine.inOut'
      },
      2.05
    )
    .to(
      '.intro-screen__overlay',
      {
        opacity: 0.35,
        duration: 0.7
      },
      2.35
    )
    .to(
      introRef.value,
      {
        opacity: 0,
        scale: 1.025,
        duration: 0.85,
        ease: 'power3.inOut'
      },
      2.55
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
  perspective: 1400px;
}

.intro-screen__background {
  position: absolute;
  inset: -4%;
  z-index: -4;
  background-color: #102634;
  background-image: url('/images/intro/intro-bg.jpg');
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
      rgba(10, 23, 32, 0.42),
      rgba(11, 27, 38, 0.72)
    ),
    radial-gradient(
      circle at center,
      rgba(239, 180, 159, 0.08),
      rgba(8, 19, 27, 0.5)
    );
}

.intro-screen__frame {
  position: absolute;
  inset: clamp(0.75rem, 2vw, 1.5rem);
  z-index: -1;
  border: 1px solid rgba(255, 255, 255, 0.28);
  pointer-events: none;
}

.intro-screen__frame::after {
  content: '';
  position: absolute;
  inset: 0.45rem;
  border: 1px solid rgba(239, 180, 159, 0.14);
}

.intro-stage {
  width: min(100%, 720px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.envelope-scene {
  position: relative;
  width: min(86vw, 520px);
  height: clamp(330px, 55vw, 440px);
  display: grid;
  place-items: end center;
  transform-style: preserve-3d;
}

.envelope-shadow {
  position: absolute;
  left: 50%;
  bottom: 8px;
  width: 78%;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.32);
  filter: blur(16px);
  transform: translateX(-50%);
}

.invitation-card {
  position: absolute;
  left: 50%;
  bottom: 52px;
  z-index: 2;
  width: 76%;
  min-height: 285px;
  padding: 0.85rem;
  transform: translateX(-50%);
  background:
    linear-gradient(
      145deg,
      rgba(255, 253, 248, 0.98),
      rgba(247, 236, 225, 0.98)
    );
  color: #24313a;
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.22);
}

.invitation-card::before {
  content: '';
  position: absolute;
  inset: 0.65rem;
  border: 1px solid rgba(40, 77, 103, 0.2);
  pointer-events: none;
}

.invitation-card__inner {
  position: relative;
  min-height: 255px;
  display: grid;
  place-content: center;
  justify-items: center;
  padding: 1.3rem;
  text-align: center;
}

.invitation-card__monogram img {
  width: clamp(75px, 13vw, 120px);
  max-height: 95px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(27%) sepia(18%) saturate(1254%)
    hue-rotate(159deg) brightness(91%) contrast(91%);
}

.invitation-card__fallback {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.2rem, 8vw, 5rem);
  font-style: italic;
  line-height: 0.8;
  letter-spacing: -0.08em;
  color: #284d67;
}

.invitation-card__fallback span {
  margin: 0 0.12em;
  font-family: 'Allura', cursive;
  font-size: 0.62em;
  color: #a64248;
}

.invitation-card__eyebrow {
  margin: 0.8rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.54rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #78614b;
}

.invitation-card h1 {
  margin: 0.65rem 0 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.1rem, 6vw, 3.5rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
  color: #284d67;
}

.invitation-card h1 span {
  color: #a64248;
}

.invitation-card__divider {
  width: 58px;
  height: 1px;
  margin: 1rem 0 0.8rem;
  background: rgba(40, 77, 103, 0.36);
}

.invitation-card__date {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #24313a;
}

.invitation-card__venue {
  margin: 0.45rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.56rem;
  letter-spacing: 0.08em;
  color: rgba(36, 49, 58, 0.68);
}

.envelope {
  position: relative;
  z-index: 4;
  width: 100%;
  height: 250px;
  transform-style: preserve-3d;
}

.envelope__back {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      145deg,
      #e7c8b8,
      #d9aa95
    );
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.24);
}

.envelope__letter-pocket {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(
      145deg,
      rgba(243, 211, 196, 0.95),
      rgba(218, 172, 150, 0.95)
    );
  clip-path: polygon(0 0, 50% 53%, 100% 0, 100% 100%, 0 100%);
}

.envelope__front {
  position: absolute;
  inset: 0;
  z-index: 5;
}

.envelope__front--left {
  background: linear-gradient(145deg, #edcbb9, #d8a58d);
  clip-path: polygon(0 0, 53% 55%, 0 100%);
}

.envelope__front--right {
  background: linear-gradient(215deg, #e4b9a4, #cf9479);
  clip-path: polygon(100% 0, 47% 55%, 100% 100%);
}

.envelope__front--bottom {
  background: linear-gradient(180deg, #e6bca8, #d49a7f);
  clip-path: polygon(0 100%, 50% 44%, 100% 100%);
}

.envelope__flap {
  position: absolute;
  inset: 0;
  z-index: 7;
  transform-style: preserve-3d;
  backface-visibility: visible;
}

.envelope__flap-inner {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      180deg,
      #f0cfbf,
      #dba58d
    );
  clip-path: polygon(0 0, 50% 62%, 100% 0);
  backface-visibility: hidden;
}

.envelope__seal {
  position: absolute;
  left: 50%;
  top: 47%;
  z-index: 9;
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, #c2676c, #9e343b 72%);
  box-shadow:
    0 8px 18px rgba(92, 30, 35, 0.32),
    inset 0 0 0 3px rgba(255, 255, 255, 0.08);
  transform: translate(-50%, -50%);
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-style: italic;
  color: #fbe9df;
}

.envelope__seal i {
  font-family: 'Allura', cursive;
  font-size: 0.9em;
  color: #f3c2ad;
}

.intro-button {
  min-width: 225px;
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.6rem;
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
  color: rgba(255, 250, 245, 0.52);
}

@media (max-width: 620px) {
  .intro-screen {
    padding-inline: 0.9rem;
  }

  .envelope-scene {
    width: min(92vw, 430px);
    height: 370px;
  }

  .envelope {
    height: 215px;
  }

  .invitation-card {
    width: 80%;
    min-height: 250px;
    bottom: 45px;
  }

  .invitation-card__inner {
    min-height: 220px;
  }

  .envelope__seal {
    width: 54px;
    height: 54px;
  }
}

@media (max-width: 390px) {
  .envelope-scene {
    height: 340px;
  }

  .envelope {
    height: 195px;
  }

  .invitation-card {
    min-height: 225px;
  }

  .invitation-card__inner {
    min-height: 195px;
    padding-inline: 0.9rem;
  }
}
</style>

<style>
html.invitation-locked,
html.invitation-locked body {
  overflow: hidden;
}
</style>
