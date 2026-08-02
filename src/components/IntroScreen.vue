<template>
  <section
    ref="introRef"
    class="intro-screen"
    aria-label="Wedding invitation introduction"
  >
    <div class="intro-screen__backdrop" aria-hidden="true"></div>
    <div class="intro-screen__vignette" aria-hidden="true"></div>

    <div class="life-envelope">
      <div class="life-envelope__base" aria-hidden="true"></div>
      <div class="life-envelope__paper-grain" aria-hidden="true"></div>

      <div class="life-envelope__card">
        <div class="life-envelope__card-border" aria-hidden="true"></div>

        <div class="life-envelope__botanical life-envelope__botanical--top" aria-hidden="true">
          <svg viewBox="0 0 180 90">
            <path d="M12 74C42 56 58 28 94 18c22-6 46-2 70-9"/>
            <path d="M45 54c-11-10-17-21-17-34 13 3 23 12 27 25"/>
            <path d="M76 34c-8-8-11-17-9-27 11 4 18 12 19 22"/>
            <path d="M112 20c8-8 17-12 28-11-4 11-12 18-23 20"/>
          </svg>
        </div>

        <div class="life-envelope__botanical life-envelope__botanical--bottom" aria-hidden="true">
          <svg viewBox="0 0 180 90">
            <path d="M12 74C42 56 58 28 94 18c22-6 46-2 70-9"/>
            <path d="M45 54c-11-10-17-21-17-34 13 3 23 12 27 25"/>
            <path d="M76 34c-8-8-11-17-9-27 11 4 18 12 19 22"/>
            <path d="M112 20c8-8 17-12 28-11-4 11-12 18-23 20"/>
          </svg>
        </div>

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

          <div class="life-envelope__divider" aria-hidden="true">
            <i></i>
          </div>

          <p class="life-envelope__date">January 17, 2027</p>

          <p class="life-envelope__venue">
            Bell Amphitheater · Camp John Hay
          </p>
        </div>
      </div>

      <div class="life-envelope__lining" aria-hidden="true">
        <div class="life-envelope__lining-pattern"></div>
      </div>

      <div class="life-envelope__pocket" aria-hidden="true"></div>
      <div class="life-envelope__left" aria-hidden="true"></div>
      <div class="life-envelope__right" aria-hidden="true"></div>
      <div class="life-envelope__bottom" aria-hidden="true"></div>

      <div class="life-envelope__flap" aria-hidden="true">
        <div class="life-envelope__flap-front">
          <div class="life-envelope__flap-border"></div>
        </div>

        <div class="life-envelope__flap-back">
          <div class="life-envelope__flap-lining"></div>
        </div>
      </div>

      <div class="life-envelope__seal" aria-hidden="true">
        <span class="life-envelope__seal-ring"></span>

        <span class="life-envelope__seal-text">
          <b>M</b>
          <i>&amp;</i>
          <b>C</b>
        </span>
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
      scale: 0.945,
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

    gsap.set('.life-envelope__botanical', {
      opacity: 0
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
          scale: 1.025,
          duration: 1
        },
        0.18
      )
      .from(
        '.life-envelope__seal',
        {
          opacity: 0,
          scale: 0.62,
          duration: 0.75,
          ease: 'back.out(1.7)'
        },
        0.55
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
        scale: 1.035,
        duration: 1.7
      })
      .to(
        '.intro-button svg',
        {
          x: 3,
          duration: 1
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
        scale: 0.58,
        rotate: -8,
        duration: 0.34,
        ease: 'power2.in'
      },
      0.07
    )
    .to(
      '.life-envelope__flap',
      {
        rotateX: -180,
        duration: 1.1,
        ease: 'power4.inOut'
      },
      0.26
    )
    .to(
      '.life-envelope__card',
      {
        yPercent: 18,
        scale: 0.97,
        duration: 0.72,
        ease: 'power3.out'
      },
      0.92
    )
    .to({}, { duration: 0.28 })
    .to(
      '.life-envelope__card',
      {
        yPercent: -26,
        scale: 1,
        rotateZ: -0.8,
        duration: 1.14,
        ease: 'power4.out'
      },
      1.5
    )
    .to(
      '.life-envelope__pocket, .life-envelope__left, .life-envelope__right, .life-envelope__bottom',
      {
        yPercent: 30,
        opacity: 0.3,
        duration: 0.92,
        ease: 'power2.inOut'
      },
      1.82
    )
    .to(
      '.life-envelope__card-inner > *',
      {
        opacity: 1,
        y: 0,
        duration: 0.58,
        stagger: 0.085,
        ease: 'power3.out'
      },
      2.05
    )
    .to(
      '.life-envelope__botanical',
      {
        opacity: 0.48,
        duration: 0.9,
        stagger: 0.12
      },
      2.15
    )
    .to(
      '.life-envelope__base, .life-envelope__lining',
      {
        opacity: 0.16,
        duration: 0.6
      },
      2.25
    )
    .to(
      '.life-envelope__card',
      {
        rotateZ: 0,
        scale: 1.022,
        duration: 0.65,
        ease: 'sine.inOut'
      },
      2.72
    )
    .to(
      '.life-envelope__card',
      {
        scale: 1.5,
        yPercent: -10,
        duration: 1.18,
        ease: 'power3.inOut'
      },
      3.08
    )
    .to(
      '.life-envelope__card-inner',
      {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in'
      },
      3.67
    )
    .to(
      introRef.value,
      {
        opacity: 0,
        duration: 0.65,
        ease: 'power2.inOut'
      },
      3.87
    )
}
</script>

<style scoped>
.intro-screen {
  --ivory: #f8f0e7;
  --warm-ivory: #efe0d3;
  --paper-shadow: #caa58f;
  --van-gogh-blue: #284d67;
  --deep-blue: #183447;
  --light-melon: #efb49f;
  --pomegranate: #a64248;
  --bistre: #78614b;

  position: fixed;
  inset: 0;
  z-index: 1000;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
  color: #fffaf5;
  background: var(--deep-blue);
  perspective: 2200px;
}

.intro-screen__backdrop {
  position: absolute;
  inset: -5%;
  z-index: -6;
  background-color: var(--deep-blue);
  background-image:
    linear-gradient(
      180deg,
      rgba(13, 34, 47, 0.36),
      rgba(10, 26, 37, 0.62)
    ),
    url('/images/intro/intro_bg.png');
  background-size: cover;
  background-position: center;
}

.intro-screen__vignette {
  position: absolute;
  inset: 0;
  z-index: -5;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at center,
      transparent 35%,
      rgba(4, 16, 24, 0.34) 100%
    );
}

.life-envelope {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transform-style: preserve-3d;
  filter: drop-shadow(0 26px 45px rgba(4, 17, 25, 0.2));
}

.life-envelope__base {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(
      145deg,
      #f6e9df 0%,
      #ead4c5 46%,
      #d9b7a1 100%
    );
}

.life-envelope__paper-grain {
  position: absolute;
  inset: 0;
  z-index: 12;
  opacity: 0.09;
  pointer-events: none;
  mix-blend-mode: multiply;
  background-image:
    repeating-radial-gradient(
      circle at 20% 30%,
      rgba(85, 60, 44, 0.25) 0 0.45px,
      transparent 0.55px 3px
    );
}

.life-envelope__card {
  position: absolute;
  left: 50%;
  top: 49%;
  z-index: 2;
  width: min(80vw, 820px);
  min-height: min(70vh, 660px);
  padding: clamp(0.9rem, 2vw, 1.3rem);
  transform: translate(-50%, -50%);
  background:
    linear-gradient(
      145deg,
      rgba(255, 253, 248, 0.995),
      rgba(246, 238, 230, 0.995)
    );
  color: #24313a;
  box-shadow:
    0 38px 95px rgba(22, 35, 42, 0.22),
    0 0 0 1px rgba(98, 73, 57, 0.05);
  will-change: transform;
}

.life-envelope__card-border {
  position: absolute;
  inset: clamp(0.65rem, 1.6vw, 1.05rem);
  border: 1px solid rgba(40, 77, 103, 0.22);
  pointer-events: none;
}

.life-envelope__card-border::after {
  content: '';
  position: absolute;
  inset: 0.38rem;
  border: 1px solid rgba(166, 66, 72, 0.1);
}

.life-envelope__botanical {
  position: absolute;
  width: clamp(115px, 18vw, 190px);
  color: var(--van-gogh-blue);
  pointer-events: none;
}

.life-envelope__botanical svg {
  width: 100%;
  height: auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.15;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.life-envelope__botanical--top {
  top: 1.35rem;
  right: 1.45rem;
}

.life-envelope__botanical--bottom {
  left: 1.45rem;
  bottom: 1.35rem;
  transform: rotate(180deg);
}

.life-envelope__card-inner {
  position: relative;
  min-height: calc(min(70vh, 660px) - 2.6rem);
  display: grid;
  place-content: center;
  justify-items: center;
  padding: clamp(1.7rem, 4vw, 3.4rem);
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
  color: var(--van-gogh-blue);
}

.life-envelope__fallback span {
  margin: 0 0.12em;
  font-family: 'Allura', cursive;
  font-size: 0.6em;
  color: var(--pomegranate);
}

.life-envelope__eyebrow {
  margin: 1.25rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.54rem, 1.2vw, 0.72rem);
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--bistre);
}

.life-envelope__card h1 {
  margin: 1rem 0 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 7vw, 5.9rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.035em;
  color: var(--van-gogh-blue);
}

.life-envelope__card h1 span {
  color: var(--pomegranate);
}

.life-envelope__divider {
  position: relative;
  width: 88px;
  height: 1px;
  margin: 1.55rem 0 1.05rem;
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(40, 77, 103, 0.46),
      transparent
    );
}

.life-envelope__divider i {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6px;
  height: 6px;
  border: 1px solid var(--light-melon);
  background: #fffaf5;
  transform: translate(-50%, -50%) rotate(45deg);
}

.life-envelope__date {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.65rem, 1.3vw, 0.82rem);
  font-weight: 500;
  letter-spacing: 0.23em;
  text-transform: uppercase;
  color: #24313a;
}

.life-envelope__venue {
  margin: 0.58rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.58rem, 1.2vw, 0.74rem);
  letter-spacing: 0.08em;
  color: rgba(36, 49, 58, 0.66);
}

.life-envelope__lining {
  position: absolute;
  inset: 0;
  z-index: 3;
  overflow: hidden;
  clip-path: polygon(0 0, 50% 60%, 100% 0, 100% 50%, 50% 78%, 0 50%);
  background:
    linear-gradient(
      180deg,
      #315b76,
      #1f425a
    );
}

.life-envelope__lining-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.17;
  background-image:
    radial-gradient(circle at 25% 32%, transparent 0 13px, rgba(255,255,255,.6) 14px 15px, transparent 16px),
    radial-gradient(circle at 75% 30%, transparent 0 11px, rgba(255,255,255,.45) 12px 13px, transparent 14px),
    repeating-linear-gradient(45deg, transparent 0 28px, rgba(255,255,255,.08) 29px 30px);
  background-size: 120px 120px, 150px 150px, 46px 46px;
}

.life-envelope__pocket {
  position: absolute;
  inset: 0;
  z-index: 4;
  background:
    linear-gradient(
      145deg,
      #f3e3d7,
      #dfc2ae
    );
  clip-path: polygon(0 39%, 50% 72%, 100% 39%, 100% 100%, 0 100%);
}

.life-envelope__left {
  position: absolute;
  inset: 0;
  z-index: 5;
  background:
    linear-gradient(
      145deg,
      #f8ece4,
      #dec0ac
    );
  clip-path: polygon(0 28%, 54% 72%, 0 100%);
}

.life-envelope__right {
  position: absolute;
  inset: 0;
  z-index: 5;
  background:
    linear-gradient(
      215deg,
      #f0ddcf,
      #d4af98
    );
  clip-path: polygon(100% 28%, 46% 72%, 100% 100%);
}

.life-envelope__bottom {
  position: absolute;
  inset: 0;
  z-index: 6;
  background:
    linear-gradient(
      180deg,
      #ecd5c5,
      #d5ad95
    );
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
  background:
    linear-gradient(
      180deg,
      #fbf1ea,
      #e2c5b2
    );
}

.life-envelope__flap-front::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image:
    repeating-radial-gradient(
      circle at 35% 35%,
      rgba(92, 65, 49, 0.2) 0 0.4px,
      transparent 0.5px 3px
    );
}

.life-envelope__flap-border {
  position: absolute;
  inset: 1.1rem 1.2rem auto;
  height: 48%;
  border-top: 1px solid rgba(40, 77, 103, 0.18);
  border-left: 1px solid rgba(40, 77, 103, 0.12);
  border-right: 1px solid rgba(40, 77, 103, 0.12);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
}

.life-envelope__flap-back {
  background:
    linear-gradient(
      180deg,
      #274f69,
      #183a50
    );
  transform: rotateX(180deg);
}

.life-envelope__flap-lining {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image:
    radial-gradient(circle at 30% 35%, transparent 0 14px, rgba(255,255,255,.6) 15px 16px, transparent 17px),
    repeating-linear-gradient(45deg, transparent 0 28px, rgba(255,255,255,.08) 29px 30px);
  background-size: 130px 130px, 46px 46px;
}

.life-envelope__seal {
  position: absolute;
  left: 50%;
  top: 58%;
  z-index: 10;
  width: clamp(80px, 9vw, 112px);
  height: clamp(80px, 9vw, 112px);
  display: grid;
  place-items: center;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 34% 28%,
      #c96b72,
      #a64248 54%,
      #813138 100%
    );
  box-shadow:
    0 16px 34px rgba(92, 30, 35, 0.32),
    inset 0 0 0 3px rgba(255, 244, 235, 0.08),
    inset 0 -8px 14px rgba(72, 19, 25, 0.18);
  transform: translate(-50%, -50%);
}

.life-envelope__seal-ring {
  position: absolute;
  inset: 9px;
  border: 1px solid rgba(255, 230, 218, 0.35);
  border-radius: 50%;
}

.life-envelope__seal-ring::before,
.life-envelope__seal-ring::after {
  content: '';
  position: absolute;
  inset: 5px;
  border: 1px solid rgba(255, 230, 218, 0.12);
  border-radius: 50%;
}

.life-envelope__seal-text {
  display: flex;
  align-items: center;
  gap: 0.06rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.25rem, 2.7vw, 1.85rem);
  font-style: italic;
  color: #fbe9df;
  text-shadow: 0 1px 0 rgba(80, 19, 25, 0.4);
}

.life-envelope__seal-text b {
  font-weight: 500;
}

.life-envelope__seal-text i {
  font-family: 'Allura', cursive;
  font-size: 0.88em;
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
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  padding: 0.95rem 1.55rem;
  background: rgba(255, 250, 245, 0.94);
  color: var(--deep-blue);
  font-family: 'Manrope', sans-serif;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:
    0 18px 46px rgba(4, 16, 24, 0.2),
    inset 0 0 0 1px rgba(40, 77, 103, 0.08);
  backdrop-filter: blur(8px);
  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.intro-button:hover {
  transform: translateY(-2px);
  background: #fffdf9;
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
  margin: 0.85rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.5rem;
  letter-spacing: 0.27em;
  text-transform: uppercase;
  color: rgba(255, 250, 245, 0.68);
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

  .life-envelope__botanical {
    width: 110px;
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

  .life-envelope__botanical {
    width: 88px;
  }

  .life-envelope__botanical--top {
    top: 1rem;
    right: 1rem;
  }

  .life-envelope__botanical--bottom {
    left: 1rem;
    bottom: 1rem;
  }

  .intro-button {
    min-width: 205px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro-button {
    transition: none;
  }
}
</style>

<style>
html.invitation-locked,
html.invitation-locked body {
  overflow: hidden;
}
</style>
