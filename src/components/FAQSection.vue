<template>
  <section id="faq" ref="sectionRef" class="faq-section">
    <div class="faq-section__wash" aria-hidden="true"></div>

    <header class="faq-header">
      <p class="faq-header__eyebrow">A few helpful notes</p>
      <h2 class="section-heading">Frequently Asked Questions</h2>
      <p class="faq-header__intro">
        We gathered the details you may need so you can arrive relaxed,
        prepared, and ready to celebrate with us.
      </p>
    </header>

    <div class="faq-layout">
      <aside class="faq-aside">
        <p class="faq-aside__label">Need a quick answer?</p>
        <h3>Everything in one place</h3>
        <p>
          Tap any question to view the answer. Please check this section before
          reaching out.
        </p>

        <div class="faq-aside__ornament" aria-hidden="true">
          <span></span><i></i><span></span>
        </div>
        <p class="faq-aside__script">
          Thank you for helping us keep things simple.
        </p>
      </aside>

      <div class="faq-list" @keydown="onQuestionKeydown">
        <article
          v-for="(item, index) in faqs"
          :key="item.question"
          class="faq-item"
          :class="{ 'is-open': openIndex === index }"
        >
          <button
            class="faq-item__button"
            type="button"
            :id="'faq-question-' + (index + 1)"
            :aria-controls="'faq-answer-' + (index + 1)"
            :aria-expanded="openIndex === index"
            @click="toggleFaq(index)"
          >
            <span class="faq-item__number" aria-hidden="true">{{
              String(index + 1).padStart(2, "0")
            }}</span>
            <span class="faq-item__question">{{ item.question }}</span>
            <span class="faq-item__icon" aria-hidden="true"
              ><i></i><i></i
            ></span>
          </button>

          <div
            :id="'faq-answer-' + (index + 1)"
            class="faq-item__answer"
            role="region"
            :aria-labelledby="'faq-question-' + (index + 1)"
            :aria-hidden="openIndex !== index"
            :inert="openIndex !== index"
            @transitionend="onAnswerTransitionEnd"
          >
            <div class="faq-item__answer-clip">
              <div class="faq-item__answer-inner">
                <p>{{ item.answer }}</p>
                <ul v-if="item.points?.length">
                  <li v-for="point in item.points" :key="point">{{ point }}</li>
                </ul>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <footer class="faq-footer">
      <div class="faq-footer__ornament" aria-hidden="true">
        <span></span><i></i><span></span>
      </div>
      <p class="faq-footer__script">
        We’re grateful for your thoughtfulness and cooperation.
      </p>
    </footer>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useGsapContext } from '../composables/useGsapContext.js';
import { ScrollTrigger } from '../plugins/gsap';

const sectionRef = ref(null);
const openIndex = ref(0);

const faqs = [
  {
    question: "Can I bring a plus one?",
    answer:
      "Each invited guest has their own invitation and one reserved seat. Plus-ones and additional guests are not included.",
    points: [
      "Please submit your own individual RSVP.",
      "Please contact the couple directly with any questions.",
    ],
  },
  {
    question: "Are children invited?",
    answer:
      "As much as we love your little ones, we kindly ask that our wedding be an adults-only celebration, with the exception of children who are part of the ceremony. Thank you for your understanding.",
  },
  {
    question: "Where should we park?",
    answer:
      "Parking availability may vary by venue. We recommend arriving early and following the instructions of venue staff and coordinators.",
  },
  {
    question: "Is the ceremony unplugged?",
    answer:
      "We kindly encourage an unplugged ceremony so everyone can be fully present.",
  },
  {
    question: "What should I know about Baguio weather?",
    answer:
      "Baguio can be cool and breezy, with occasional rain, especially in the late afternoon and evening. We kindly encourage you to bring an umbrella and a jacket or shawl to stay warm and comfortable, as January can be particularly chilly.",
  },
  {
    question: "Do you have a gift preference?",
    answer:
      "Your presence at our wedding is already a wonderful gift. If you wish to give us something more, we would be grateful for a monetary gift to help us begin our new chapter together.",
  },
  {
    question: "Can I change my RSVP after submitting?",
    answer:
      "Please review your answers carefully before submission. Changes may no longer be accommodated without confirmation.",
  },
  {
    question: "Can I share the invitation link?",
    answer: "Please keep the website and event details private.",
  },
];

useGsapContext(sectionRef, ({ gsap, ScrollTrigger, scope }) => {
  const header = scope.querySelector(".faq-header");
  const aside = scope.querySelector(".faq-aside");
  const items = gsap.utils.toArray(".faq-item");
  const footer = scope.querySelector(".faq-footer");

  gsap.from(header.children, {
    scrollTrigger: { trigger: header, start: "top 84%", once: true },
    opacity: 0,
    y: 38,
    filter: "blur(5px)",
    duration: 0.95,
    stagger: 0.12,
  });

  gsap.from(aside, {
    scrollTrigger: { trigger: aside, start: "top 80%", once: true },
    opacity: 0,
    x: -48,
    y: 20,
    duration: 0.9,
  });

  gsap.from(items, {
    scrollTrigger: { trigger: ".faq-list", start: "top 82%", once: true },
    opacity: 0,
    y: 26,
    duration: 0.65,
    stagger: 0.07,
  });

  gsap.from(footer.children, {
    scrollTrigger: { trigger: footer, start: "top 86%", once: true },
    opacity: 0,
    y: 28,
    duration: 0.8,
    stagger: 0.12,
  });
});

let refreshFrame;
let disposed = false;
function scheduleRefresh() {
  if (disposed) return;
  cancelAnimationFrame(refreshFrame);
  refreshFrame = requestAnimationFrame(() => {
    if (!disposed) ScrollTrigger.refresh();
  });
}
function toggleFaq(index) {
  openIndex.value = openIndex.value === index ? -1 : index;
  nextTick(scheduleRefresh);
}
function onAnswerTransitionEnd(event) {
  if (event.target === event.currentTarget && event.propertyName === 'grid-template-rows') scheduleRefresh();
}
function onQuestionKeydown(event) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const buttons = [...sectionRef.value.querySelectorAll('.faq-item__button')];
  const current = buttons.indexOf(event.target);
  if (current < 0) return;
  const positions = { ArrowDown: (current + 1) % buttons.length, ArrowUp: (current - 1 + buttons.length) % buttons.length, Home: 0, End: buttons.length - 1 };
  if (Object.hasOwn(positions, event.key)) {
    event.preventDefault();
    buttons[positions[event.key]].focus();
  }
}
onBeforeUnmount(() => {
  disposed = true;
  cancelAnimationFrame(refreshFrame);
});
onMounted(() => {
  document.fonts?.ready?.then(scheduleRefresh);
});
</script>

<style scoped>
.faq-section {
  --faq-blue: #284d67;
  --faq-melon: #efb49f;
  --faq-pomegranate: #a64248;
  --faq-ink: #24313a;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  background: linear-gradient(180deg, #f8f2eb, #fffaf6 50%, #f5ede5);
  color: var(--faq-ink);
}

.faq-section__wash {
  position: absolute;
  inset: -48px 0;
  z-index: -1;
  background:
    radial-gradient(
      circle at 12% 18%,
      rgba(239, 180, 159, 0.2),
      transparent 24rem
    ),
    radial-gradient(
      circle at 92% 76%,
      rgba(40, 77, 103, 0.12),
      transparent 28rem
    );
}
.faq-header {
  width: min(100%, 820px);
  margin: 0 auto clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}
.faq-header__eyebrow {
  margin: 0 0 0.75rem;
  font-family: "Allura", cursive;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  color: var(--faq-melon);
  transform: rotate(-3deg);
}
.faq-header h2 {
  margin: 0;
  font-size: clamp(3.5rem, 7.5vw, 6.6rem);
  color: var(--faq-blue);
}
.faq-header__intro {
  width: min(100%, 620px);
  margin: 1.7rem auto 0;
  font-family: "Manrope", sans-serif;
  font-size: clamp(0.92rem, 1.5vw, 1.05rem);
  font-weight: 300;
  line-height: 1.9;
  color: rgba(36, 49, 58, 0.72);
}

.faq-layout {
  width: min(100%, 1160px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(240px, 0.72fr) minmax(0, 1.5fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}
.faq-aside {
  position: sticky;
  top: 2rem;
  padding: clamp(1.8rem, 4vw, 3rem);
  border: 1px solid rgba(40, 77, 103, 0.12);
  background: rgba(255, 255, 255, 0.66);
  box-shadow: 0 24px 65px rgba(62, 56, 51, 0.08);
}
.faq-aside__label {
  margin: 0 0 0.55rem;
  font-family: "Manrope", sans-serif;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--faq-pomegranate);
}
.faq-aside h3 {
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2.3rem, 4vw, 3.6rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1;
  color: var(--faq-blue);
}
.faq-aside > p:not(.faq-aside__label):not(.faq-aside__script) {
  margin: 1rem 0 0;
  font-family: "Manrope", sans-serif;
  font-size: 0.84rem;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(36, 49, 58, 0.68);
}
.faq-aside__ornament,
.faq-footer__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
}
.faq-aside__ornament {
  margin: 2rem 0 1.2rem;
}
.faq-aside__ornament span,
.faq-footer__ornament span {
  width: clamp(2rem, 6vw, 4rem);
  height: 1px;
  background: rgba(120, 97, 75, 0.32);
}
.faq-aside__ornament i,
.faq-footer__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid var(--faq-melon);
  transform: rotate(45deg);
}
.faq-aside__script {
  margin: 0;
  text-align: center;
  font-family: "Allura", cursive;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  color: var(--faq-blue);
}

.faq-list {
  border-top: 1px solid rgba(40, 77, 103, 0.16);
}
.faq-item {
  border-bottom: 1px solid rgba(40, 77, 103, 0.16);
}
.faq-item__button {
  width: 100%;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1.25rem;
  border: 0;
  padding: 1.55rem 0;
  background: transparent;
  text-align: left;
  color: inherit;
  cursor: pointer;
}
.faq-item__number {
  font-family: "Cormorant Garamond", serif;
  font-size: 1.35rem;
  font-style: italic;
  color: rgba(40, 77, 103, 0.4);
}
.faq-item__question {
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(1.6rem, 3vw, 2.35rem);
  font-style: italic;
  font-weight: 500;
  color: var(--faq-blue);
}
.faq-item__icon {
  position: relative;
  width: 22px;
  height: 22px;
}
.faq-item__icon i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 1px;
  background: var(--faq-pomegranate);
  transition: transform 0.3s ease;
}
.faq-item__icon i:first-child {
  transform: translate(-50%, -50%);
}
.faq-item__icon i:last-child {
  transform: translate(-50%, -50%) rotate(90deg);
}
.faq-item.is-open .faq-item__icon i:last-child {
  transform: translate(-50%, -50%) rotate(0deg);
}
.faq-item__answer {
  overflow: hidden;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.faq-item__answer-inner {
  padding: 0 3.2rem 1.7rem 3.7rem;
}
.faq-item__answer-inner p {
  margin: 0;
  font-family: "Manrope", sans-serif;
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.85;
  color: rgba(36, 49, 58, 0.72);
}
.faq-item__answer-inner ul {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}
.faq-item__answer-inner li {
  position: relative;
  padding-left: 1.2rem;
  font-family: "Manrope", sans-serif;
  font-size: 0.82rem;
  line-height: 1.8;
  color: rgba(36, 49, 58, 0.66);
}
.faq-item__answer-inner li::before {
  content: "·";
  position: absolute;
  left: 0;
  color: var(--faq-pomegranate);
}

.faq-footer {
  width: min(100%, 760px);
  margin: clamp(5rem, 9vw, 8rem) auto 0;
  text-align: center;
}
.faq-footer__script {
  margin: 1.1rem 0 0;
  font-family: "Allura", cursive;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  color: var(--faq-blue);
}

@media (max-width: 900px) {
  .faq-layout {
    grid-template-columns: 1fr;
  }
  .faq-aside {
    position: relative;
    top: auto;
  }
}
@media (max-width: 620px) {
  .faq-section {
    padding-inline: 1rem;
  }
  .faq-item__answer-inner {
    padding-right: 0;
    padding-left: 2.6rem;
  }
}
.faq-item.is-open .faq-item__answer { grid-template-rows: 1fr; }
.faq-item__answer-clip { min-height: 0; overflow: hidden; }
.faq-header, .faq-aside, .faq-list, .faq-item, .faq-item__question { min-width: 0; overflow-wrap: anywhere; }
.faq-header h2 { font-size: clamp(2.6rem, 7.5vw, 6.6rem); }
.faq-aside h3 { font-size: clamp(2rem, 3.2vw, 3.1rem); }
.faq-header__eyebrow { color: var(--faq-pomegranate); }
.faq-item__button { min-height: 44px; }
.faq-item__button:focus-visible { outline: 2px solid var(--faq-blue); outline-offset: 4px; }
.faq-item:focus-within { opacity: 1 !important; transform: none !important; }
@media (max-width: 620px) {
  .faq-item__button { gap: .65rem; }
  .faq-item__answer-inner { padding-left: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .faq-item__answer, .faq-item__icon i { transition: none; }
}
</style>
