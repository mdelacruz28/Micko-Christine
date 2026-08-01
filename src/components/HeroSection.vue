<template>
  <section id="home" class="hero">
    <div class="hero__background" aria-hidden="true"></div>
    <div class="hero__overlay" aria-hidden="true"></div>

    <div class="hero__content">
      <p class="hero__eyebrow">Our story begins</p>

      <div class="hero__names" aria-label="Micko and Christine">
        <span class="hero__name hero__name--first">Micko</span>
        <span class="hero__ampersand">&amp;</span>
        <span class="hero__name hero__name--second">Christine</span>
      </div>

      <p class="hero__caption">are getting married</p>

      <div class="hero__divider" aria-hidden="true">
        <span></span><i></i><span></span>
      </div>

      <div class="hero__details">
        <p class="hero__date">January 17, 2027</p>
        <p class="hero__venue">Bell Amphitheater · Camp John Hay, Baguio City</p>
      </div>

      <div class="countdown" aria-label="Wedding countdown">
        <div class="countdown__item">
          <strong>{{ countdown.days }}</strong>
          <span>Days</span>
        </div>

        <div class="countdown__separator">:</div>

        <div class="countdown__item">
          <strong>{{ countdown.hours }}</strong>
          <span>Hours</span>
        </div>

        <div class="countdown__separator">:</div>

        <div class="countdown__item">
          <strong>{{ countdown.minutes }}</strong>
          <span>Minutes</span>
        </div>

        <div class="countdown__separator">:</div>

        <div class="countdown__item">
          <strong>{{ countdown.seconds }}</strong>
          <span>Seconds</span>
        </div>
      </div>

      <a class="hero__scroll" href="#story" aria-label="Scroll to our story">
        <span>Discover our story</span>
        <i aria-hidden="true"></i>
      </a>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive } from 'vue'

const weddingDate = new Date('2027-01-17T14:30:00+08:00')

const countdown = reactive({
  days: '000',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let timerId

const pad = (value, length = 2) => String(value).padStart(length, '0')

const updateCountdown = () => {
  const distance = weddingDate.getTime() - Date.now()

  if (distance <= 0) {
    countdown.days = '000'
    countdown.hours = '00'
    countdown.minutes = '00'
    countdown.seconds = '00'

    if (timerId) clearInterval(timerId)
    return
  }

  countdown.days = pad(Math.floor(distance / 86_400_000), 3)
  countdown.hours = pad(Math.floor((distance / 3_600_000) % 24))
  countdown.minutes = pad(Math.floor((distance / 60_000) % 60))
  countdown.seconds = pad(Math.floor((distance / 1_000) % 60))
}

onMounted(() => {
  updateCountdown()
  timerId = window.setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
  if (timerId) window.clearInterval(timerId)
})
</script>

<style scoped>
.countdown {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: clamp(0.45rem, 2vw, 1.25rem);
  margin-top: clamp(2rem, 5vw, 3rem);
  padding: 1.15rem clamp(1rem, 3vw, 2rem);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(10, 23, 31, 0.18);
  backdrop-filter: blur(8px);
  animation: fadeUp 1s 1.4s both;
}

.countdown__item {
  min-width: clamp(3rem, 8vw, 5.2rem);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.countdown__item strong {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.65rem, 4vw, 3rem);
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: 0.04em;
}

.countdown__item span {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.48rem, 1vw, 0.66rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 250, 246, 0.7);
}

.countdown__separator {
  padding-top: 0.2rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.5rem, 3.5vw, 2.6rem);
  color: #f3b39c;
}

.hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  padding: clamp(5rem, 10vw, 8rem) 1.5rem;
  color: #fffaf6;
  text-align: center;
}

.hero__background {
  position: absolute;
  inset: -4%;
  z-index: -4;
  background: transparent;
  /* background-image: url('/images/lafayette.png');
  background-size: cover;
  background-position: center 45%;
  animation: heroZoom 24s ease-in-out infinite alternate; */
}

.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(180deg, rgba(10,25,35,.28) 0%, rgba(10,24,34,.48) 55%, rgba(10,22,31,.70) 100%),
    radial-gradient(circle at center, rgba(36,63,84,.08) 0%, rgba(10,20,28,.45) 100%);
}

.hero__content {
  width: min(100%, 980px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero__eyebrow {
  margin: 0 0 clamp(1.5rem, 4vw, 2.5rem);
  font-family: 'Cormorant Garamond', cursive;
  font-size: clamp(1.65rem, 3vw, 2.45rem);
  font-style: oblique;
  color: #fcc586;
  transform: rotate(-4deg);
  animation: fadeUp .9s .15s both;
}

.hero__names {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  line-height: .82;
  letter-spacing: -.04em;
}

.hero__name {
  display: block;
  font-family: "Imperial Script", cursive;
  font-size: clamp(4rem, 10vw, 8.5rem);
  font-weight: 500;
  text-shadow: 0 12px 34px rgba(0,0,0,.24);
  white-space: nowrap;
}

.hero__name--first {
  justify-self: end;
  transform: translateY(-.2em) rotate(-7deg);
  animation: slideFromLeft 1.15s .3s both;
}

.hero__name--second {
  justify-self: start;
  transform: translateY(.2em) rotate(-7deg);
  animation: slideFromRight 1.15s .45s both;
}

.hero__ampersand {
  margin: 0 clamp(.35rem, 2vw, 1.2rem);
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.8rem, 5vw, 5rem);
  font-style: italic;
  color: #f3b39c;
  transform: rotate(-8deg);
  animation: fadeIn 1s .8s both;
}

.hero__caption {
  margin: clamp(1rem, 3vw, 1.8rem) 0 0;
  padding-top: 25px;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.25rem, 2.4vw, 2rem);
  font-style: italic;
  letter-spacing: .08em;
  animation: fadeUp 1s .9s both;
}

.hero__divider {
  display: flex;
  align-items: center;
  gap: .8rem;
  margin: clamp(2rem, 5vw, 3rem) 0 1.5rem;
  animation: fadeIn 1s 1.05s both;
}

.hero__divider span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(255,255,255,.7);
}

.hero__divider i {
  width: 5px;
  height: 5px;
  border: 1px solid #f8c7b5;
  transform: rotate(45deg);
}

.hero__details { animation: fadeUp 1s 1.15s both; }
.hero__date, .hero__venue { margin: 0; }

.hero__date {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(.82rem, 1.5vw, 1rem);
  font-weight: 500;
  letter-spacing: .32em;
  text-transform: uppercase;
}

.hero__venue {
  margin-top: .75rem;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(.72rem, 1.3vw, .9rem);
  font-weight: 300;
  letter-spacing: .12em;
  color: rgba(255,250,246,.78);
}

.hero__scroll {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: .8rem;
  margin-top: clamp(3rem, 7vw, 4.5rem);
  color: rgba(255,250,246,.86);
  text-decoration: none;
  font-family: 'Manrope', sans-serif;
  font-size: .68rem;
  letter-spacing: .28em;
  text-transform: uppercase;
  animation: fadeIn 1s 1.4s both;
}

.hero__scroll i {
  width: 1px;
  height: 44px;
  background: linear-gradient(to bottom, rgba(255,255,255,.9), transparent);
  animation: scrollLine 1.8s ease-in-out infinite;
}

@keyframes heroZoom { from { transform: scale(1); } to { transform: scale(1.08); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideFromLeft { from { opacity: 0; transform: translate(-45px,-.2em) rotate(-7deg); } to { opacity: 1; transform: translate(0,-.2em) rotate(-7deg); } }
@keyframes slideFromRight { from { opacity: 0; transform: translate(45px,.2em) rotate(-7deg); } to { opacity: 1; transform: translate(0,.2em) rotate(-7deg); } }
@keyframes scrollLine { 0%,100% { opacity:.25; transform:scaleY(.65); transform-origin:top; } 50% { opacity:1; transform:scaleY(1); transform-origin:top; } }

@media (max-width: 760px) {
  .hero { padding-inline: 1rem; }
  .hero__names { grid-template-columns: 1fr; justify-items: center; row-gap: .1rem; }
  .hero__name { white-space: normal; }
  .hero__name--first, .hero__name--second { justify-self: center; transform: rotate(-7deg); }
  .hero__ampersand { margin: -.1rem 0; }

  @keyframes slideFromLeft {
    from { opacity: 0; transform: translateX(-35px) rotate(-7deg); }
    to { opacity: 1; transform: translateX(0) rotate(-7deg); }
  }

  @keyframes slideFromRight {
    from { opacity: 0; transform: translateX(35px) rotate(-7deg); }
    to { opacity: 1; transform: translateX(0) rotate(-7deg); }
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__background, .hero__eyebrow, .hero__name, .hero__ampersand,
  .hero__caption, .hero__divider, .hero__details, .hero__scroll, .hero__scroll i {
    animation: none;
  }
}
</style>
