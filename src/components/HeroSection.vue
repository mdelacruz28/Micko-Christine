<template>
  <section id="home" ref="heroRef" class="hero-section" aria-labelledby="hero-title">
    <div class="hero-section__overlay" aria-hidden="true"></div>

    <div class="hero-content">
      <p class="hero-content__eyebrow">Sa wakas! Ikakasal na sila</p>
      <h1 id="hero-title" class="hero-names" aria-label="Micko and Christine" tabindex="-1">
        <span class="hero-name hero-name--first">
          <span
            v-for="(letter, index) in firstNameLetters"
            :key="`first-${index}`"
            class="hero-letter"
            aria-hidden="true"
            >{{ letter }}</span
          >
        </span>

        <i class="hero-ampersand" aria-hidden="true">&amp;</i>

        <span class="hero-name hero-name--second">
          <span
            v-for="(letter, index) in secondNameLetters"
            :key="`second-${index}`"
            class="hero-letter"
            aria-hidden="true"
            >{{ letter }}</span
          >
        </span>
      </h1>


      <div class="hero-content__ornament" aria-hidden="true">
        <span></span><i></i><span></span>
      </div>

      <div class="hero-details">
        <p class="hero-details__date">17 Enero 2027</p>
        <p class="hero-details__venue">Baguio City</p>
      </div>

      <div class="countdown" role="timer" aria-live="off" aria-label="Wedding countdown">
        <div
          v-for="item in countdownItems"
          :key="item.label"
          class="countdown__item"
        >
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { gsap } from "../plugins/gsap";

const heroRef = ref(null);
const firstNameLetters = [..."Micko"];
const secondNameLetters = [..."Christine"];
const weddingDate = new Date("2027-01-17T14:30:00+08:00");

const countdown = reactive({
  days: "000",
  hours: "00",
  minutes: "00",
  seconds: "00",
});
let timerId = null;
let mediaContext;
let animateEntrance;

const pad = (value, length = 2) => String(value).padStart(length, "0");

const updateCountdown = () => {
  const distance = weddingDate.getTime() - Date.now();
  if (distance <= 0) {
    Object.assign(countdown, {
      days: "000",
      hours: "00",
      minutes: "00",
      seconds: "00",
    });
    return false;
  }
  countdown.days = pad(Math.floor(distance / 86_400_000), 3);
  countdown.hours = pad(Math.floor((distance / 3_600_000) % 24));
  countdown.minutes = pad(Math.floor((distance / 60_000) % 60));
  countdown.seconds = pad(Math.floor((distance / 1_000) % 60));
  return true;
};

const countdownItems = computed(() => [
  { label: "Days", value: countdown.days },
  { label: "Hours", value: countdown.hours },
  { label: "Minutes", value: countdown.minutes },
  { label: "Seconds", value: countdown.seconds },
]);

function stopCountdown() {
  if (timerId !== null) window.clearInterval(timerId);
  timerId = null;
}
function syncCountdown() {
  stopCountdown();
  if (!updateCountdown() || document.hidden) return;
  timerId = window.setInterval(() => {
    if (!updateCountdown()) stopCountdown();
  }, 1000);
}

onMounted(() => {
  syncCountdown();
  document.addEventListener("visibilitychange", syncCountdown);
  animateEntrance = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  mediaContext = gsap.matchMedia();
  mediaContext.add("(prefers-reduced-motion: no-preference)", () => {
    const context = gsap.context(() => {
    const firstLetters = gsap.utils.toArray(".hero-name--first .hero-letter");
    const secondLetters = gsap.utils.toArray(".hero-name--second .hero-letter");

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (animateEntrance) timeline
      .fromTo(
        firstLetters,
        { opacity: 0, y: 42, filter: "blur(10px)", rotate: -7 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          rotate: 0,
          duration: 0.8,
          stagger: 0.09,
        },
        0.3,
      )
      .from(
        ".hero-ampersand",
        {
          opacity: 0,
          scale: 0.5,
          rotate: -22,
          duration: 0.6,
          ease: "back.out(1.8)",
        },
        0.68,
      )
      .fromTo(
        secondLetters,
        { opacity: 0, y: 42, filter: "blur(10px)", rotate: -7 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          rotate: 0,
          duration: 0.8,
          stagger: 0.085,
        },
        0.78,
      )
      .from(
        ".hero-content__eyebrow",
        { opacity: 0, y: 18, duration: 0.65 },
        1.35,
      )
      .from(
        ".hero-content__ornament span",
        { scaleX: 0, transformOrigin: "center", duration: 0.55, stagger: 0.08 },
        1.45,
      )
      .from(
        ".hero-content__ornament > i",
        { opacity: 0, scale: 0, rotate: 0, duration: 0.4, ease: "back.out(2)" },
        1.58,
      )
      .from(
        ".hero-details > *",
        { opacity: 0, y: 15, duration: 0.6, stagger: 0.1 },
        1.65,
      )
      .from(
        ".countdown__item",
        { opacity: 0, y: 20, scale: 0.94, duration: 0.6, stagger: 0.09 },
        1.82,
      );

    animateEntrance = false;

    }, heroRef.value);
    return () => context.revert();
  });

});

onBeforeUnmount(() => {
  stopCountdown();
  document.removeEventListener("visibilitychange", syncCountdown);
  mediaContext?.revert();
});
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
  background-color: #163246;
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
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-names {
  margin: 0;
  font-weight: 400;
  padding-block: .2em;
  display: grid;
  grid-template-columns: minmax(0, .7fr) auto minmax(0, 1fr);
  align-items: center;
  width: 100%;
  font-family: "Parisienne", cursive;
  font-size: clamp(4rem, 10vw, 8.8rem);
  font-style: normal;
  line-height: 0.82;
  letter-spacing: normal;
}
.hero-name {
  display: inline-flex;
  max-width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  white-space: normal;
}
.hero-name--first {
  justify-self: end;
  transform: translateY(-0.18em) rotate(-7deg);
}
.hero-name--second {
  justify-self: start;
  transform: translateY(0.18em) rotate(-7deg);
}
.hero-letter {
  flex: 0 0 auto;
  display: inline-block;
  will-change: transform, opacity, filter;
}
.hero-ampersand {
  margin: 0 clamp(0.35rem, 2vw, 1.25rem);
  font-family: "Allura", cursive;
  font-size: 0.56em;
  font-style: normal;
  color: #efb49f;
  transform: rotate(-8deg);
}
.hero-content__eyebrow {
  margin: 0 0 clamp(1.2rem, 3vw, 2rem);
  font-family: "Parisienne", cursive;
  font-size: clamp(1.5rem, 3vw, 2.3rem);
  line-height: 1.4;
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
  transform: rotate(45deg);
}
.hero-details__date {
  margin: 0;
}
.hero-details__date {
  font-family: "Manrope", sans-serif;
  font-size: clamp(0.78rem, 1.4vw, 0.96rem);
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}
.hero-details__venue {
  margin: .65rem 0 0;
  font-family: "Manrope", sans-serif;
  font-size: clamp(.78rem, 1.4vw, .96rem);
  letter-spacing: .12em;
}
.countdown {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(100%, 620px);
  margin-top: clamp(2rem, 5vw, 3rem);
}

.countdown__item {
  position: relative;
  min-width: 0;
  min-height: 92px;

  display: grid;
  place-content: center;
  gap: 0.35rem;

  padding-inline: clamp(0.6rem, 2vw, 1.2rem);

  background: transparent;
  border: 0;
  backdrop-filter: none;
}

.countdown__item:not(:last-child)::after {
  content: "";

  position: absolute;
  top: 18%;
  right: 0;
  bottom: 18%;

  width: 1px;

  background: rgba(255, 255, 255, 0.28);
}

.countdown__item strong {
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1;
}

.countdown__item span {
  font-family: "Manrope", sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 250, 245, 0.85);
}
@media (max-width: 760px) {
  .hero-section {
    padding-inline: 1rem;
  }
  .hero-names {
    font-size: clamp(3rem, 14vw, 5.5rem);
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.1rem;
  }
  .hero-name--first,
  .hero-name--second {
    justify-self: center;
    transform: rotate(-4deg);
  }
  .hero-ampersand {
    margin: -0.15rem 0;
  }
  .countdown {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(100%, 420px);
    max-width: 100%;
  }

  .countdown__item {
    min-height: 76px;
    padding-inline: 0.35rem;
  }

  .countdown__item strong {
    font-size: clamp(1.55rem, 7vw, 2.15rem);
  }

  .countdown__item span {
    font-size: 0.7rem;
    letter-spacing: 0.12em;
  }

  .countdown__item:not(:last-child)::after {
    top: 22%;
    bottom: 22%;
  }
  .countdown__item:nth-child(2)::after { display: none; }
}
.hero-section__background, .hero-section__overlay { pointer-events: none; }
.hero-names:focus-visible { outline: 2px solid #efb49f; outline-offset: 6px; }
@media (prefers-reduced-motion: reduce) {
  .hero-section__background, .hero-letter { will-change: auto; }
  .hero-section__background, .hero-letter { transform: none !important; }
  .hero-letter { opacity: 1 !important; filter: none !important; }
}
</style>
