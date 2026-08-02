<template>
  <section
    ref="introRef"
    class="intro-screen"
    aria-label="Wedding invitation introduction"
  >
    <div class="intro-screen__backdrop" aria-hidden="true"></div>
    <div class="intro-screen__vignette" aria-hidden="true"></div>

    <div class="envelope">
      <div class="envelope__base" aria-hidden="true"></div>
      <div class="envelope__grain" aria-hidden="true"></div>

      <div class="invitation-card">
        <div class="invitation-card__border" aria-hidden="true"></div>

        <div class="invitation-card__botanical invitation-card__botanical--top" aria-hidden="true">
          <svg viewBox="0 0 180 90">
            <path d="M12 74C42 56 58 28 94 18c22-6 46-2 70-9" />
            <path d="M45 54c-11-10-17-21-17-34 13 3 23 12 27 25" />
            <path d="M76 34c-8-8-11-17-9-27 11 4 18 12 19 22" />
            <path d="M112 20c8-8 17-12 28-11-4 11-12 18-23 20" />
          </svg>
        </div>

        <div class="invitation-card__botanical invitation-card__botanical--bottom" aria-hidden="true">
          <svg viewBox="0 0 180 90">
            <path d="M12 74C42 56 58 28 94 18c22-6 46-2 70-9" />
            <path d="M45 54c-11-10-17-21-17-34 13 3 23 12 27 25" />
            <path d="M76 34c-8-8-11-17-9-27 11 4 18 12 19 22" />
            <path d="M112 20c8-8 17-12 28-11-4 11-12 18-23 20" />
          </svg>
        </div>

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

          <div class="invitation-card__divider" aria-hidden="true">
            <i></i>
          </div>

          <p class="invitation-card__date">January 17, 2027</p>

          <p class="invitation-card__venue">
            Bell Amphitheater · Camp John Hay
          </p>
        </div>
      </div>

      <div class="envelope-flap envelope-flap--top" aria-hidden="true">
        <div class="envelope-flap__face"></div>
      </div>

      <div class="envelope-flap envelope-flap--left" aria-hidden="true">
        <div class="envelope-flap__face"></div>
      </div>

      <div class="envelope-flap envelope-flap--right" aria-hidden="true">
        <div class="envelope-flap__face"></div>
      </div>

      <div class="envelope-flap envelope-flap--bottom" aria-hidden="true">
        <div class="envelope-flap__face"></div>
      </div>

      <div class="wax-seal" aria-hidden="true">
        <img src="/images/intro/wax-seal.png" alt="" draggable="false"/>
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
    gsap.set('.invitation-card', {
      scale: 0.9,
      opacity: 0
    })

    gsap.set('.invitation-card__inner > *', {
      opacity: 0,
      y: 18
    })

    gsap.set('.invitation-card__botanical', {
      opacity: 0
    })

    const entrance = gsap.timeline({
      defaults: { ease: 'power3.out' }
    })

    entrance
      .from('.intro-screen__backdrop', {
        scale: 1.08,
        duration: 1.5,
        ease: 'power2.out'
      })
      .from(
        '.envelope',
        {
          opacity: 0,
          scale: 1.025,
          duration: 1
        },
        0.18
      )
      .from(
        '.wax-seal',
        {
          opacity: 0,
          scale: 0.62,
          duration: 0.72,
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
        0.84
      )

    // idleTimeline = gsap.timeline({
    //   repeat: -1,
    //   yoyo: true,
    //   defaults: { ease: 'sine.inOut' }
    // })

    // idleTimeline
    //   .to('.wax-seal', {
    //     scale: 1.035,
    //     duration: 1.7
    //   })
    //   .to(
    //     '.intro-button svg',
    //     {
    //       x: 3,
    //       duration: 1
    //     },
    //     0
    //   )
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
      duration: 0.3,
      pointerEvents: 'none'
    })
    .to(
      '.wax-seal',
      {
        opacity: 0,
        scale: 0.58,
        rotate: -8,
        duration: 0.34,
        ease: 'power2.in'
      },
      0.06
    )

    /* Top flap opens upward */
    .to(
      '.envelope-flap--top',
      {
        rotateX: -178,
        yPercent: -8,
        duration: 1.05,
        ease: 'power4.inOut'
      },
      0.28
    )

    /* Side and bottom flaps open after the top flap starts */
    .to(
      '.envelope-flap--left',
      {
        rotateY: 168,
        xPercent: -16,
        opacity: 0.82,
        duration: 0.95,
        ease: 'power4.inOut'
      },
      0.62
    )
    .to(
      '.envelope-flap--right',
      {
        rotateY: -168,
        xPercent: 16,
        opacity: 0.82,
        duration: 0.95,
        ease: 'power4.inOut'
      },
      0.62
    )
    .to(
      '.envelope-flap--bottom',
      {
        rotateX: 168,
        yPercent: 14,
        opacity: 0.82,
        duration: 0.95,
        ease: 'power4.inOut'
      },
      0.72
    )

    /* Invitation is revealed only after the flaps are open */
    .to(
      '.invitation-card',
      {
        opacity: 1,
        scale: 0.96,
        duration: 0.65,
        ease: 'power3.out'
      },
      1.22
    )
    .to(
      '.envelope-flap',
      {
        opacity: 0.12,
        duration: 0.6,
        ease: 'power2.out'
      },
      1.42
    )
    .to(
      '.invitation-card',
      {
        scale: 1,
        duration: 0.75,
        ease: 'power3.out'
      },
      1.55
    )
    .to(
      '.invitation-card__inner > *',
      {
        opacity: 1,
        y: 0,
        duration: 0.56,
        stagger: 0.08,
        ease: 'power3.out'
      },
      1.7
    )
    .to(
      '.invitation-card__botanical',
      {
        opacity: 0.46,
        duration: 0.85,
        stagger: 0.12
      },
      1.84
    )
    .to(
      '.envelope__base',
      {
        opacity: 0.12,
        duration: 0.6
      },
      1.9
    )

    /* Camera moves toward the card */
    .to(
      '.invitation-card',
      {
        scale: 1.08,
        duration: 0.7,
        ease: 'sine.inOut'
      },
      2.48
    )
    .to(
      '.invitation-card',
      {
        scale: 1.5,
        duration: 1.15,
        ease: 'power3.inOut'
      },
      2.9
    )
    .to(
      '.invitation-card__inner',
      {
        opacity: 0,
        duration: 0.42,
        ease: 'power2.in'
      },
      3.48
    )
    .to(
      introRef.value,
      {
        opacity: 0,
        duration: 0.65,
        ease: 'power2.inOut'
      },
      3.68
    )
}
</script>

<style scoped>
.intro-screen {
  --ivory: #f8f0e7;
  --warm-ivory: #ead7c8;
  --paper-shadow: #caa58f;
  --deep-blue: #183447;
  --van-gogh-blue: #284d67;
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
      rgba(13, 34, 47, 0.38),
      rgba(10, 26, 37, 0.68)
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
      transparent 34%,
      rgba(4, 16, 24, 0.38) 100%
    );
}

.envelope {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transform-style: preserve-3d;
  filter: drop-shadow(0 28px 48px rgba(4, 17, 25, 0.2));
}

.envelope__base {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(
      145deg,
      #f8ede5 0%,
      #ead5c6 50%,
      #d8b39c 100%
    );
}

.envelope__grain {
  position: absolute;
  inset: 0;
  z-index: 20;
  opacity: 0.08;
  pointer-events: none;
  mix-blend-mode: multiply;
  background-image:
    repeating-radial-gradient(
      circle at 20% 30%,
      rgba(85, 60, 44, 0.25) 0 0.45px,
      transparent 0.55px 3px
    );
}

.invitation-card {
  position: absolute;
  left: 10%;
  right: 10%;
  top: 10%;
  bottom: 10%;
  z-index: 2;
  padding: clamp(0.9rem, 2vw, 1.3rem);
  background:
    linear-gradient(
      145deg,
      rgba(255, 253, 248, 0.995),
      rgba(246, 238, 230, 0.995)
    );
  color: #24313a;
  box-shadow:
    0 38px 95px rgba(22, 35, 42, 0.2),
    0 0 0 1px rgba(98, 73, 57, 0.05);
  will-change: transform, opacity;
}

.invitation-card__border {
  position: absolute;
  inset: clamp(0.65rem, 1.6vw, 1.05rem);
  border: 1px solid rgba(40, 77, 103, 0.22);
  pointer-events: none;
}

.invitation-card__border::after {
  content: '';
  position: absolute;
  inset: 0.38rem;
  border: 1px solid rgba(166, 66, 72, 0.1);
}

.invitation-card__botanical {
  position: absolute;
  width: clamp(110px, 18vw, 190px);
  color: var(--van-gogh-blue);
  pointer-events: none;
}

.invitation-card__botanical svg {
  width: 100%;
  height: auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.15;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.invitation-card__botanical--top {
  top: 1.3rem;
  right: 1.4rem;
}

.invitation-card__botanical--bottom {
  left: 1.4rem;
  bottom: 1.3rem;
  transform: rotate(180deg);
}

.invitation-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc(80svh - 2.6rem);
  display: grid;
  place-content: center;
  justify-items: center;
  padding: clamp(1.7rem, 4vw, 3.4rem);
  text-align: center;
}

.invitation-card__monogram img {
  width: clamp(115px, 16vw, 190px);
  max-height: 160px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(28%) sepia(16%)
    saturate(1200%) hue-rotate(158deg) brightness(88%) contrast(90%);
}

.invitation-card__fallback {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(5rem, 12vw, 8rem);
  font-style: italic;
  line-height: 0.8;
  letter-spacing: -0.1em;
  color: var(--van-gogh-blue);
}

.invitation-card__fallback span {
  margin: 0 0.12em;
  font-family: 'Allura', cursive;
  font-size: 0.6em;
  color: var(--pomegranate);
}

.invitation-card__eyebrow {
  margin: 1.25rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.54rem, 1.2vw, 0.72rem);
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--bistre);
}

.invitation-card h1 {
  margin: 1rem 0 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 7vw, 5.9rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.035em;
  color: var(--van-gogh-blue);
}

.invitation-card h1 span {
  color: var(--pomegranate);
}

.invitation-card__divider {
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

.invitation-card__divider i {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6px;
  height: 6px;
  border: 1px solid var(--light-melon);
  background: #fffaf5;
  transform: translate(-50%, -50%) rotate(45deg);
}

.invitation-card__date {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.65rem, 1.3vw, 0.82rem);
  font-weight: 500;
  letter-spacing: 0.23em;
  text-transform: uppercase;
}

.invitation-card__venue {
  margin: 0.58rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.58rem, 1.2vw, 0.74rem);
  letter-spacing: 0.08em;
  color: rgba(36, 49, 58, 0.66);
}

.envelope-flap {
  position: absolute;
  z-index: 8;
  transform-style: preserve-3d;
  backface-visibility: visible;
  will-change: transform, opacity;
}

.envelope-flap__face {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      145deg,
      #fbf1ea,
      #e3c7b5
    );
  box-shadow: inset 0 0 0 1px rgba(92, 65, 49, 0.08);
  backface-visibility: hidden;
}

/* Full-size top flap */
.envelope-flap--top {
  inset: 0;
  transform-origin: top center;
}

.envelope-flap--top .envelope-flap__face {
  clip-path: polygon(0 0, 100% 0, 50% 62%);
}

/* Full-size left flap */
.envelope-flap--left {
  inset: 0;
  transform-origin: left center;
}

.envelope-flap--left .envelope-flap__face {
  background: linear-gradient(145deg, #f7e9df, #dfc0ac);
  clip-path: polygon(0 0, 54% 50%, 0 100%);
}

/* Full-size right flap */
.envelope-flap--right {
  inset: 0;
  transform-origin: right center;
}

.envelope-flap--right .envelope-flap__face {
  background: linear-gradient(215deg, #f2e0d3, #d7b19a);
  clip-path: polygon(100% 0, 46% 50%, 100% 100%);
}

/* Full-size bottom flap */
.envelope-flap--bottom {
  inset: 0;
  transform-origin: bottom center;
}

.envelope-flap--bottom .envelope-flap__face {
  background: linear-gradient(180deg, #eed9ca, #d8b199);
  clip-path: polygon(0 100%, 50% 38%, 100% 100%);
}

/* .wax-seal {
  --seal-size: clamp(80px, 9vw, 112px);

  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 12;
  width: var(--seal-size);
  height: var(--seal-size);
  margin-left: calc(var(--seal-size) / -2);
  margin-top: calc(var(--seal-size) / -2);
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
  transform-origin: center;
} */

.wax-seal {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 12;

  width: clamp(90px, 9vw, 130px);
  aspect-ratio: 1;

  margin-left: calc(clamp(90px, 9vw, 130px) / -2);
  margin-top: calc(clamp(90px, 9vw, 130px) / -2);

  pointer-events: none;
}

.wax-seal img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;

  filter:
    drop-shadow(0 10px 18px rgba(0,0,0,.22));
}

.intro-actions {
  position: absolute;
  left: 50%;
  bottom: clamp(1.4rem, 4vw, 2.6rem);
  z-index: 30;
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
  background: rgba(255, 250, 245, 0.95);
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
  .invitation-card {
    left: 7%;
    right: 7%;
    top: 9%;
    bottom: 12%;
  }

  .invitation-card__inner {
    min-height: calc(79svh - 2.6rem);
  }

  .invitation-card__botanical {
    width: 105px;
  }
}

@media (max-width: 520px) {
  .invitation-card {
    left: 5%;
    right: 5%;
    top: 8%;
    bottom: 14%;
  }

  .invitation-card__inner {
    min-height: calc(78svh - 2.6rem);
    padding-inline: 1.15rem;
  }

  .invitation-card__botanical {
    width: 82px;
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
