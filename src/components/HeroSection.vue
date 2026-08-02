<template>
  <section id="home" ref="heroRef" class="hero-section">
    <div class="hero-section__background" aria-hidden="true"></div>
    <div class="hero-section__overlay" aria-hidden="true"></div>

    <div class="hero-content">
      <p class="hero-content__eyebrow">Our story begins</p>

      <div class="hero-names" aria-label="Micko and Christine">
        <span class="hero-names__first">Micko</span>
        <i>&amp;</i>
        <span class="hero-names__second">Christine</span>
      </div>

      <p class="hero-content__caption">are getting married</p>

      <div class="hero-content__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>

      <div class="hero-details">
        <p class="hero-details__date">January 17, 2027</p>
        <p class="hero-details__venue">
          Bell Amphitheater · Camp John Hay, Baguio City
        </p>
      </div>

      <div class="countdown" aria-label="Wedding countdown">
        <div
          v-for="item in countdownItems"
          :key="item.label"
          class="countdown__item"
        >
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </div>
      </div>

      <a class="hero-scroll" href="#story">
        <span>Discover our story</span>
        <i aria-hidden="true"></i>
      </a>
    </div>
  </section>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref
} from 'vue'
import { gsap } from '../plugins/gsap'
import { splitTextIntoLetters } from '../composables/useScrollReveal'

const heroRef = ref(null)

const weddingDate = new Date('2027-01-17T14:30:00+08:00')

const countdown = reactive({
  days: '000',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let timerId
let animationContext
let hasAnimated = false

const pad = (value, length = 2) => String(value).padStart(length, '0')

const updateCountdown = () => {
  const distance = weddingDate.getTime() - Date.now()

  if (distance <= 0) {
    countdown.days = '000'
    countdown.hours = '00'
    countdown.minutes = '00'
    countdown.seconds = '00'
    return
  }

  countdown.days = pad(Math.floor(distance / 86_400_000), 3)
  countdown.hours = pad(Math.floor((distance / 3_600_000) % 24))
  countdown.minutes = pad(Math.floor((distance / 60_000) % 60))
  countdown.seconds = pad(Math.floor((distance / 1_000) % 60))
}

const countdownItems = computed(() => [
  { label: 'Days', value: countdown.days },
  { label: 'Hours', value: countdown.hours },
  { label: 'Minutes', value: countdown.minutes },
  { label: 'Seconds', value: countdown.seconds }
])

const prepareHero = () => {
  if (!heroRef.value) return

  gsap.set(
    [
      '.hero-content__eyebrow',
      '.hero-content__caption',
      '.hero-details > *',
      '.countdown__item',
      '.hero-scroll'
    ],
    { opacity: 0 }
  )

  gsap.set('.hero-content__ornament span', {
    scaleX: 0,
    transformOrigin: 'center'
  })

  gsap.set('.hero-content__ornament > i', {
    opacity: 0,
    scale: 0
  })
}

const animateHero = async () => {
  if (hasAnimated || !heroRef.value) return
  hasAnimated = true

  await nextTick()

  animationContext = gsap.context(() => {
    const firstName = heroRef.value.querySelector('.hero-names__first')
    const secondName = heroRef.value.querySelector('.hero-names__second')

    const firstLetters = splitTextIntoLetters(firstName)
    const secondLetters = splitTextIntoLetters(secondName)

    gsap.set(firstLetters, { opacity: 0 })
    gsap.set(secondLetters, { opacity: 0 })
    gsap.set('.hero-names > i', { opacity: 0 })

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' }
    })

    timeline
      .fromTo(
        '.hero-section__background',
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.45,
          ease: 'power2.out'
        }
      )
      .to(
        '.hero-content__eyebrow',
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.75
        },
        0.15
      )
      .fromTo(
        firstLetters,
        {
          opacity: 0,
          x: -28,
          y: 18,
          rotate: -8,
          filter: 'blur(5px)'
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          filter: 'blur(0px)',
          duration: 0.72,
          stagger: 0.055
        },
        0.28
      )
      .to(
        '.hero-names > i',
        {
          opacity: 1,
          scale: 1,
          rotate: -8,
          duration: 0.6,
          ease: 'back.out(1.8)'
        },
        0.66
      )
      .fromTo(
        secondLetters,
        {
          opacity: 0,
          x: 28,
          y: 18,
          rotate: -8,
          filter: 'blur(5px)'
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          filter: 'blur(0px)',
          duration: 0.72,
          stagger: 0.055
        },
        0.7
      )
      .to(
        '.hero-content__caption',
        {
          opacity: 1,
          y: 0,
          duration: 0.65
        },
        1.02
      )
      .to(
        '.hero-content__ornament span',
        {
          scaleX: 1,
          duration: 0.6,
          stagger: 0.08
        },
        1.12
      )
      .to(
        '.hero-content__ornament > i',
        {
          opacity: 1,
          scale: 1,
          rotate: 45,
          duration: 0.4,
          ease: 'back.out(2)'
        },
        1.22
      )
      .to(
        '.hero-details > *',
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1
        },
        1.3
      )
      .to(
        '.countdown__item',
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.09
        },
        1.45
      )
      .to(
        '.hero-scroll',
        {
          opacity: 1,
          y: 0,
          duration: 0.6
        },
        1.72
      )

    gsap.to('.hero-section__background', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    })

    gsap.to('.hero-scroll i', {
      scaleY: 0.55,
      opacity: 0.25,
      transformOrigin: 'top',
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }, heroRef.value)
}

const handleInvitationOpened = () => {
  animateHero()
}

onMounted(() => {
  updateCountdown()
  timerId = window.setInterval(updateCountdown, 1000)

  prepareHero()
  window.addEventListener('invitation-opened', handleInvitationOpened)

  // Fallback for direct navigation or if IntroScreen is temporarily removed.
  window.setTimeout(() => {
    const introExists = document.querySelector('.intro-screen')
    if (!introExists) animateHero()
  }, 250)
})

onBeforeUnmount(() => {
  if (timerId) window.clearInterval(timerId)
  window.removeEventListener('invitation-opened', handleInvitationOpened)
  animationContext?.revert()
})
</script>

<style scoped>
.hero-section {
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: clamp(5rem, 9vw, 8rem) 1.25rem;
  color: #fffaf5;
  text-align: center;
  background: #163246;
}

.hero-section__background {
  position: absolute;
  inset: -8% -4%;
  z-index: -4;
  background:
    linear-gradient(rgba(22, 50, 70, 0.15), rgba(22, 50, 70, 0.15)),
    url('/images/hero/lafayettte.png') center / cover no-repeat;
  will-change: transform;
}

.hero-section__overlay {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(
      180deg,
      rgba(10, 25, 35, 0.34),
      rgba(10, 24, 34, 0.58) 58%,
      rgba(9, 22, 31, 0.78)
    ),
    radial-gradient(
      circle at center,
      rgba(239, 180, 159, 0.06),
      rgba(8, 20, 28, 0.4)
    );
}

.hero-content {
  width: min(100%, 1000px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-content__eyebrow {
  margin: 0 0 clamp(1.3rem, 3vw, 2rem);
  font-family: 'Allura', cursive;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  color: #efb49f;
  transform: translateY(24px) rotate(-3deg);
  filter: blur(4px);
}

.hero-names {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4rem, 10vw, 8.8rem);
  font-style: italic;
  line-height: 0.82;
  letter-spacing: -0.05em;
}

.hero-names__first {
  justify-self: end;
  transform: translateY(-0.18em) rotate(-7deg);
}

.hero-names__second {
  justify-self: start;
  transform: translateY(0.18em) rotate(-7deg);
}

.hero-names > i {
  margin: 0 clamp(0.35rem, 2vw, 1.25rem);
  font-family: 'Allura', cursive;
  font-size: 0.56em;
  font-style: normal;
  color: #efb49f;
}

.hero-content__caption {
  margin: clamp(1rem, 3vw, 1.7rem) 0 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.3rem, 2.5vw, 2rem);
  font-style: italic;
  letter-spacing: 0.08em;
  transform: translateY(18px);
}

.hero-content__ornament {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: clamp(1.7rem, 4vw, 2.5rem) 0 1.3rem;
}

.hero-content__ornament span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(255, 255, 255, 0.7);
}

.hero-content__ornament > i {
  width: 6px;
  height: 6px;
  border: 1px solid #efb49f;
}

.hero-details__date,
.hero-details__venue {
  margin: 0;
  transform: translateY(16px);
}

.hero-details__date {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.78rem, 1.4vw, 0.96rem);
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.hero-details__venue {
  margin-top: 0.7rem;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.7rem, 1.2vw, 0.86rem);
  font-weight: 300;
  letter-spacing: 0.11em;
  color: rgba(255, 250, 245, 0.74);
}

.countdown {
  display: grid;
  grid-template-columns: repeat(4, minmax(70px, 1fr));
  gap: clamp(0.5rem, 2vw, 1rem);
  width: min(100%, 620px);
  margin-top: clamp(2rem, 5vw, 3rem);
}

.countdown__item {
  min-height: 105px;
  display: grid;
  place-content: center;
  gap: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(10, 24, 34, 0.2);
  backdrop-filter: blur(8px);
  transform: translateY(22px) scale(0.94);
}

.countdown__item strong {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1;
}

.countdown__item span {
  font-family: 'Manrope', sans-serif;
  font-size: 0.54rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 250, 245, 0.68);
}

.hero-scroll {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: clamp(2.5rem, 6vw, 4rem);
  color: rgba(255, 250, 245, 0.82);
  text-decoration: none;
  font-family: 'Manrope', sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  transform: translateY(14px);
}

.hero-scroll i {
  width: 1px;
  height: 42px;
  display: block;
  background: linear-gradient(to bottom, rgba(255,255,255,0.85), transparent);
}

@media (max-width: 760px) {
  .hero-section {
    padding-inline: 1rem;
  }

  .hero-names {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.1rem;
  }

  .hero-names__first,
  .hero-names__second {
    justify-self: center;
    transform: rotate(-7deg);
  }

  .hero-names > i {
    margin: -0.15rem 0;
  }

  .countdown {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 360px;
  }
}
</style>
