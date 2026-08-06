<template>
  <section ref="introRef" class="intro-screen" aria-label="Wedding invitation introduction">
    <div class="intro-screen__background" aria-hidden="true"></div>
    <div class="intro-screen__overlay" aria-hidden="true"></div>
    <div class="intro-screen__frame" aria-hidden="true"></div>

    <div class="intro-content">
      <h1>You are invited</h1>

      <div class="intro-content__ornament" aria-hidden="true">
        <span></span><i></i><span></span>
      </div>

      <p class="intro-content__date">January 17, 2027</p>

      <button class="intro-button" type="button" :disabled="isOpening" @click="openInvitation">
        <span>{{ isOpening ? 'Opening Invitation' : 'Open Invitation' }}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from '../plugins/gsap'

const emit = defineEmits(['opened'])
const introRef = ref(null)
const isOpening = ref(false)

let context
let idleTimeline

onMounted(() => {
  document.documentElement.classList.add('invitation-locked')

  context = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

    timeline
      .from('.intro-screen__background', {
        scale: 1.1,
        duration: 1.7,
        ease: 'power2.out'
      })
      .from('.intro-screen__frame', {
        opacity: 0,
        scale: 0.97,
        duration: 0.85
      }, 0.22)
      .from('.intro-content h1', {
        opacity: 0,
        y: 34,
        filter: 'blur(8px)',
        duration: 0.95
      }, 0.45)
      .from('.intro-content__ornament span', {
        scaleX: 0,
        transformOrigin: 'center',
        duration: 0.55,
        stagger: 0.08
      }, 0.75)
      .from('.intro-content__ornament i', {
        opacity: 0,
        scale: 0,
        duration: 0.4,
        ease: 'back.out(2)'
      }, 0.9)
      .from('.intro-content__date', {
        opacity: 0,
        y: 18,
        duration: 0.65
      }, 0.98)
      .from('.intro-button', {
        opacity: 0,
        y: 18,
        scale: 0.96,
        duration: 0.65
      }, 1.14)

    idleTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'sine.inOut' }
    })

    idleTimeline.to('.intro-button svg', { x: 4, duration: 0.9 })
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
    .to('.intro-content', {
      opacity: 0,
      y: -18,
      duration: 0.48,
      ease: 'power2.in'
    })
    .to('.intro-screen__frame', {
      opacity: 0,
      scale: 0.98,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 0.08)
    .to('.intro-screen__background', {
      scale: 1.06,
      duration: 0.8,
      ease: 'power3.inOut'
    }, 0.18)
    .to(introRef.value, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut'
    }, 0.52)
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
  inset: -5%;
  z-index: -4;
  background-color: #102634;
  background-image: url('/images/intro/background.png');
  background-size: cover;
  background-position: center;
  will-change: transform;
}

.intro-screen__overlay {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(180deg, rgba(10,24,34,.34), rgba(10,25,35,.58) 58%, rgba(8,21,30,.76)),
    radial-gradient(circle at center, rgba(239,180,159,.06), rgba(8,20,28,.34));
}

.intro-screen__frame {
  position: absolute;
  inset: clamp(.75rem, 2vw, 1.5rem);
  z-index: -1;
  border: 1px solid rgba(255,255,255,.3);
  pointer-events: none;
}

.intro-screen__frame::after {
  content: '';
  position: absolute;
  inset: .45rem;
  border: 1px solid rgba(239,180,159,.14);
}

.intro-content {
  width: min(100%, 820px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.intro-content h1 {
  margin: 0;
  font-family: 'Imperial Script', serif;
  font-size: clamp(4rem, 10vw, 8.5rem);
  font-style: italic;
  font-weight: 500;
  line-height: .9;
  letter-spacing: -.045em;
  text-wrap: balance;
}

.intro-content__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .8rem;
  margin: clamp(1.6rem, 4vw, 2.5rem) 0 1.2rem;
}

.intro-content__ornament span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(255,255,255,.7);
}

.intro-content__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid #efb49f;
  transform: rotate(45deg);
}

.intro-content__date {
  margin: 0;
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(.75rem, 1.4vw, .95rem);
  font-weight: 500;
  letter-spacing: .32em;
  text-transform: uppercase;
  color: rgba(255,250,245,.9);
}

.intro-button {
  min-width: 230px;
  min-height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  margin-top: clamp(2rem, 5vw, 3rem);
  border: 1px solid rgba(255,255,255,.65);
  border-radius: 999px;
  padding: .95rem 1.55rem;
  background: rgba(255,250,245,.95);
  color: #183447;
  font-family: 'Manrope', sans-serif;
  font-size: .68rem;
  font-weight: 500;
  letter-spacing: .18em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 18px 46px rgba(4,16,24,.22);
  transition: transform .25s ease, background .25s ease;
}

.intro-button:hover {
  transform: translateY(-2px);
  background: #fff;
}

.intro-button:disabled { cursor: wait; }

.intro-button svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 620px) {
  .intro-screen { padding-inline: 1rem; }
  .intro-content h1 { max-width: 360px; }
  .intro-button { min-width: 210px; }
}

@media (prefers-reduced-motion: reduce) {
  .intro-button { transition: none; }
}
</style>

<style>
html.invitation-locked,
html.invitation-locked body {
  overflow: hidden;
}
</style>
