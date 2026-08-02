<template>
  <section
    ref="introRef"
    class="intro-screen"
    aria-label="Wedding invitation introduction"
  >
    <div class="intro-screen__envelope" aria-hidden="true"></div>
    <div class="intro-screen__vignette" aria-hidden="true"></div>

    <button
      ref="sealRef"
      class="wax-seal"
      type="button"
      :disabled="isOpening"
      aria-label="Open wedding invitation"
      @click="openInvitation"
    >
      <img
        v-if="showSealImage"
        src="/images/intro/wax-seal.png"
        alt=""
        draggable="false"
        @error="showSealImage = false"
      />

      <span v-else class="wax-seal__fallback" aria-hidden="true">
        M<i>&amp;</i>C
      </span>
    </button>

    <div class="intro-prompt">
      <span>{{ isOpening ? 'Opening Invitation' : 'Click to Open' }}</span>
      <i aria-hidden="true"></i>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from '../plugins/gsap'

const emit = defineEmits(['opened'])

const introRef = ref(null)
const sealRef = ref(null)
const isOpening = ref(false)
const showSealImage = ref(true)

let context
let idleTimeline

onMounted(() => {
  document.documentElement.classList.add('invitation-locked')

  context = gsap.context(() => {
    const entrance = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      }
    })

    entrance
      .from('.intro-screen__envelope', {
        opacity: 0,
        scale: 1.08,
        duration: 1.4,
        ease: 'power2.out'
      })
      .from(
        '.wax-seal',
        {
          opacity: 0,
          scale: 0.72,
          duration: 0.8,
          ease: 'back.out(1.7)'
        },
        0.42
      )
      .from(
        '.intro-prompt',
        {
          opacity: 0,
          y: 14,
          duration: 0.65
        },
        0.72
      )

    idleTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: {
        ease: 'sine.inOut'
      }
    })

    idleTimeline.to('.intro-prompt > i', {
      y: 5,
      duration: 0.9
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
    defaults: {
      ease: 'power3.inOut'
    },
    onComplete: () => {
      document.documentElement.classList.remove('invitation-locked')
      emit('opened')
    }
  })
    .to('.intro-prompt', {
      opacity: 0,
      y: 12,
      duration: 0.28,
      pointerEvents: 'none'
    })
    .to(
      '.wax-seal',
      {
        scale: 1.08,
        duration: 0.16,
        ease: 'power2.out'
      },
      0.02
    )
    .to('.wax-seal', {
      opacity: 0,
      scale: 0.72,
      duration: 0.32,
      ease: 'power2.in'
    })
    .to(
      '.intro-screen__envelope',
      {
        scale: 1.16,
        filter: 'blur(2px)',
        duration: 0.9,
        ease: 'power3.inOut'
      },
      0.22
    )
    .to(
      introRef.value,
      {
        opacity: 0,
        duration: 0.55,
        ease: 'power2.inOut'
      },
      0.68
    )
}
</script>

<style scoped>
.intro-screen {
  --seal-size: clamp(150px, 14vw, 220px);

  position: fixed;
  inset: 0;
  z-index: 1000;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
  background: #f2ece3;
}

.intro-screen__envelope {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image: url('/images/intro/envelope-bg.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  will-change: transform, opacity, filter;
}

.intro-screen__vignette {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at center,
      transparent 45%,
      rgba(76, 54, 38, 0.1) 100%
    );
}

.wax-seal {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 10;

  width: var(--seal-size);
  height: var(--seal-size);
  margin-left: calc(var(--seal-size) / -2);
  margin-top: calc(var(--seal-size) / -2);

  display: grid;
  place-items: center;

  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  will-change: transform, opacity;
}

.wax-seal:disabled {
  cursor: wait;
}

.wax-seal img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  filter:
    drop-shadow(0 14px 20px rgba(18, 29, 38, 0.24));
  user-select: none;
}

.wax-seal__fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 34% 28%,
      #49637f,
      #1f3f60 55%,
      #112b48 100%
    );
  box-shadow:
    0 16px 32px rgba(18, 29, 38, 0.28),
    inset 0 0 0 4px rgba(221, 185, 111, 0.22);
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-style: italic;
  color: #d9b76a;
}

.wax-seal__fallback i {
  margin-inline: 0.12em;
  font-family: 'Allura', cursive;
  font-size: 0.8em;
}

.intro-prompt {
  position: absolute;
  left: 50%;
  top: calc(50% + (var(--seal-size) * 0.68));
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;

  transform: translateX(-50%);

  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.55rem, 1vw, 0.68rem);
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #836f55;
  white-space: nowrap;
}

.intro-prompt > i {
  width: 11px;
  height: 11px;
  border-right: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  transform: rotate(45deg);
}

@media (max-width: 900px) {
  .intro-screen {
    --seal-size: clamp(135px, 24vw, 190px);
  }

  .intro-screen__envelope {
    background-position: center center;
  }
}

@media (max-width: 560px) {
  .intro-screen {
    --seal-size: clamp(125px, 34vw, 165px);
  }

  .intro-screen__envelope {
    background-size: cover;
    background-position: center center;
  }

  .intro-prompt {
    top: calc(50% + (var(--seal-size) * 0.72));
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro-screen__envelope,
  .wax-seal,
  .intro-prompt {
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
