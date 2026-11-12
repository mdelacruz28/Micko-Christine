<template>
  <section id="home" ref="heroRef" class="hero-section" aria-labelledby="hero-title">
    <div class="hero-section__overlay" aria-hidden="true"></div>
    <div class="hero-panel">
      <div class="hero-layout">
        <div class="hero-content">
          <p class="hero-content__eyebrow"><span aria-hidden="true">✧</span> Sa wakas, ikakasal na kami!</p>
          <h1 id="hero-title" class="hero-names" aria-label="Micko at Christine" tabindex="-1">
            <span class="hero-name hero-name--first">
              <span v-for="(letter, index) in firstNameLetters" :key="`first-${index}`" class="hero-letter" aria-hidden="true">{{ letter }}</span>
            </span>
            <i class="hero-ampersand" aria-hidden="true">&amp;</i>
            <span class="hero-name hero-name--second">
              <span v-for="(letter, index) in secondNameLetters" :key="`second-${index}`" class="hero-letter" aria-hidden="true">{{ letter }}</span>
            </span>
          </h1>
          <p class="hero-message">Kasama ka sa susunod<br />naming kabanata.</p>
          <p class="hero-description">Sa isang magandang hapon sa Baguio, sabay nating ipagdiwang ang pag-ibig, pananampalataya, at bagong simula.</p>
          <div class="hero-date" aria-label="17 Enero 2027, Linggo, Baguio City">
            <span class="hero-date__day">17</span>
            <span class="hero-date__text"><strong>Enero 2027</strong><small>Linggo · Baguio City</small></span>
          </div>
        </div>
        <figure class="hero-photo">
          <div class="hero-photo__arch">
            <img src="/images/prenup/IMG_1546.webp" alt="Sina Micko at Christine na magkahawak-kamay habang naglalakad sa Baguio" fetchpriority="high" />
          </div>
          <figcaption class="hero-photo__note">sa lahat ng lakad,<br />ikaw ang kasama.</figcaption>
        </figure>
      </div>
      <div class="hero-countdown">
        <p>Kaunting tulog na lang</p>
        <div class="countdown" role="timer" aria-live="off" aria-label="Bilang ng oras bago ang kasal">
          <div v-for="item in countdownItems" :key="item.label" class="countdown__item">
            <strong>{{ item.value }}</strong><span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { gsap } from '../plugins/gsap'

const heroRef = ref(null)
const firstNameLetters = [...'Micko']
const secondNameLetters = [...'Christine']
const weddingDate = new Date('2027-01-17T14:30:00+08:00')
const countdown = reactive({ days: '000', hours: '00', minutes: '00', seconds: '00' })
const countdownItems = computed(() => [
  { label: 'Araw', value: countdown.days },
  { label: 'Oras', value: countdown.hours },
  { label: 'Minuto', value: countdown.minutes },
  { label: 'Segundo', value: countdown.seconds }
])
let timerId = null
let mediaContext
const pad = (value, length = 2) => String(value).padStart(length, '0')
function updateCountdown() {
  const distance = weddingDate.getTime() - Date.now()
  if (distance <= 0) {
    Object.assign(countdown, { days: '000', hours: '00', minutes: '00', seconds: '00' })
    return false
  }
  countdown.days = pad(Math.floor(distance / 86_400_000), 3)
  countdown.hours = pad(Math.floor((distance / 3_600_000) % 24))
  countdown.minutes = pad(Math.floor((distance / 60_000) % 60))
  countdown.seconds = pad(Math.floor((distance / 1_000) % 60))
  return true
}
function stopCountdown() {
  if (timerId !== null) window.clearInterval(timerId)
  timerId = null
}
function syncCountdown() {
  stopCountdown()
  if (!updateCountdown() || document.hidden) return
  timerId = window.setInterval(() => { if (!updateCountdown()) stopCountdown() }, 1000)
}
onMounted(() => {
  syncCountdown()
  document.addEventListener('visibilitychange', syncCountdown)
  mediaContext = gsap.matchMedia()
  mediaContext.add('(prefers-reduced-motion: no-preference)', () => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .from('.hero-content__eyebrow', { opacity: 0, y: 18, duration: .65 }, .1)
        .fromTo('.hero-name--first .hero-letter', { opacity: 0, y: 42, filter: 'blur(10px)', rotate: -7 }, { opacity: 1, y: 0, filter: 'blur(0px)', rotate: 0, duration: .8, stagger: .09 }, .3)
        .from('.hero-ampersand', { opacity: 0, scale: .5, rotate: -22, duration: .6, ease: 'back.out(1.8)' }, .68)
        .fromTo('.hero-name--second .hero-letter', { opacity: 0, y: 42, filter: 'blur(10px)', rotate: -7 }, { opacity: 1, y: 0, filter: 'blur(0px)', rotate: 0, duration: .8, stagger: .085 }, .78)
        .from(['.hero-message', '.hero-description', '.hero-date'], { opacity: 0, y: 20, duration: .65, stagger: .12 }, 1.25)
        .from('.hero-photo__arch', { opacity: 0, y: 38, duration: 1.1 }, .65)
        .from('.hero-photo__note', { opacity: 0, y: 14, duration: .65 }, 1.55)
        .from('.hero-countdown', { opacity: 0, y: 18, duration: .7 }, 1.85)
    }, heroRef.value)
    return () => context.revert()
  })
})
onBeforeUnmount(() => {
  stopCountdown()
  document.removeEventListener('visibilitychange', syncCountdown)
  mediaContext?.revert()
})
</script>

<style scoped>
.hero-section { position: relative; isolation: isolate; min-height: 100svh; display: grid; place-items: center; padding: clamp(1rem, 3vw, 3rem); overflow: clip; color: #fffaf5; }
.hero-section__overlay { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(12, 29, 40, .58), rgba(10, 24, 34, .78)); pointer-events: none; }
.hero-panel { width: min(100%, 1190px); padding: clamp(1.5rem, 4vw, 3.5rem) clamp(1.25rem, 4vw, 3.5rem) 1.35rem; background: transparent; }
.hero-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, .95fr); gap: clamp(2rem, 5vw, 5rem); align-items: center; }
.hero-content { min-width: 0; text-align: left; }
.hero-content__eyebrow { margin: 0 0 clamp(1.4rem, 3vw, 2.7rem); font-family: 'Manrope', sans-serif; font-size: .68rem; font-weight: 500; letter-spacing: .22em; text-transform: uppercase; color: #efb49f; }
.hero-content__eyebrow span { font-size: 1.4rem; vertical-align: -.15em; padding-right: .65rem; }
.hero-names { display: grid; grid-template-columns: max-content auto; justify-content: start; align-items: baseline; width: max-content; max-width: 100%; margin: 0; font-family: 'Parisienne', cursive; font-size: clamp(4.25rem, 6.5vw, 7rem); font-weight: 400; line-height: 1; letter-spacing: 0; }
.hero-name { display: inline-flex; white-space: nowrap; }
.hero-name--first { grid-column: 1; grid-row: 1; }
.hero-name--second { grid-column: 1 / -1; grid-row: 2; font-style: italic; }
.hero-letter { display: inline-block; will-change: transform, opacity, filter; }
.hero-ampersand { grid-column: 2; grid-row: 1; padding-left: .3em; color: #efb49f; font-family: 'Parisienne', cursive; font-size: .52em; font-style: normal; font-weight: 400; }
.hero-message { margin: clamp(1.7rem, 3vw, 2.5rem) 0 .8rem; font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.65rem, 2.8vw, 2.25rem); line-height: 1.1; }
.hero-description { max-width: 34ch; margin: 0; font-family: 'Manrope', sans-serif; font-size: .88rem; line-height: 1.8; color: rgba(255, 250, 245, .86); }
.hero-date { display: flex; align-items: center; gap: 1rem; margin-top: clamp(1.5rem, 3vw, 2.5rem); }
.hero-date__day { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 4.6rem; line-height: .8; }
.hero-date__text { display: grid; gap: .2rem; padding-left: 1rem; border-left: 1px solid rgba(255, 250, 245, .55); }
.hero-date__text strong { font: 400 1.65rem/1 'Cormorant Garamond', Georgia, serif; }
.hero-date__text small { font: 500 .6rem/1.5 'Manrope', sans-serif; letter-spacing: .13em; text-transform: uppercase; }
.hero-photo { position: relative; width: 100%; max-width: 510px; margin: 0 auto 1rem; padding: 1rem 0 0 1rem; }
.hero-photo__arch { position: relative; aspect-ratio: .88; padding: .75rem 0 0 .75rem; border-top: 1px solid #efb49f; border-left: 1px solid #efb49f; border-radius: 50% 50% 0 0 / 34% 34% 0 0; }
.hero-photo__arch img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center center; border-radius: 50% 50% 0 0 / 34% 34% 0 0; }
.hero-photo__note { position: absolute; left: -3%; bottom: 4%; padding: .65rem 1.4rem; background: rgba(255, 253, 248, .72); color: #48594f; font: 400 clamp(1.45rem, 2.5vw, 2rem)/.95 'Parisienne', cursive; transform: rotate(-5deg); box-shadow: 0 8px 24px rgba(30, 40, 35, .09); }
.hero-countdown { display: flex; align-items: center; justify-content: space-between; gap: 2rem; margin-top: 2.4rem; padding: 1.1rem 0 .4rem;  }
.hero-countdown > p { flex: 1; margin: 0; font: 500 .65rem/1.5 'Manrope', sans-serif; letter-spacing: .18em; text-transform: uppercase; color: rgba(255, 250, 245, .72); }
.countdown { flex: 1; display: flex; justify-content: space-around; align-items: center; gap: 1rem; }
.countdown__item { min-width: 3rem; display: grid; gap: .2rem; text-align: center; }
.countdown__item strong { font: 400 2.2rem/1 'Cormorant Garamond', Georgia, serif; }
.countdown__item span { font: 500 .6rem/1.4 'Manrope', sans-serif; letter-spacing: .12em; text-transform: uppercase; color: rgba(255, 250, 245, .72); }
.hero-names:focus-visible { outline: 2px solid #efb49f; outline-offset: 5px; }
@media (max-width: 900px) {
  .hero-layout { gap: 2rem; }
  .hero-names { font-size: clamp(3.5rem, 7.8vw, 6rem); }
}
@media (max-width: 700px) {
  .hero-section { padding: 0; }
  .hero-panel { padding: 2rem 1.4rem; }
  .hero-layout { grid-template-columns: 1fr; }
  .hero-content { text-align: center; }
  .hero-names { margin-inline: auto; text-align: left; font-size: clamp(4rem, 15vw, 6rem); }
  .hero-description { margin-inline: auto; }
  .hero-date { justify-content: center; }
  .hero-photo { width: min(92%, 430px); margin-top: 1rem; }
  .hero-countdown { display: grid; gap: 1rem; justify-items: center; margin-top: 1rem; }
  .hero-countdown > p { text-align: center; }
  .countdown { width: 100%; }
}
@media (max-width: 360px) {
  .hero-panel { padding-inline: 1rem; }
  .hero-names { font-size: 3.6rem; }
  .hero-photo__note { left: -7%; font-size: 1.3rem; }
  .countdown { gap: .3rem; }
}
@media (prefers-reduced-motion: reduce) { .hero-letter { will-change: auto; } }
</style>
