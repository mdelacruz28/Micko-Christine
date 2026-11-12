<template>
  <section id="faq" ref="sectionRef" class="faq-section">
    <div class="faq-layout">
      <aside class="faq-aside">
        <h2>May tanong?<br /><em>Heto ang sagot.</em></h2>
        <p class="faq-aside__intro">
          Para relaxed at handa ka sa pagpunta, pinagsama-sama na namin dito ang mga detalyeng maaaring kailanganin mo.
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
                <p v-if="item.followUp">{{ item.followUp }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useGsapContext } from '../composables/useGsapContext.js';
import { ScrollTrigger } from '../plugins/gsap';

const sectionRef = ref(null);
const openIndex = ref(-1);

const faqs = [
  {
    question: "Puwede ba akong magsama ng plus-one?",
    answer:
      "Bawat inimbitahang bisita ay may sariling paanyaya at isang nakalaang upuan. Hindi kasama ang plus-one o dagdag na bisita.",
    followUp: "Pakikumpleto ang sarili mong RSVP. Kung may tanong tungkol sa imbitasyon, kausapin lang kami.",
  },
  {
    question: "Kasama ba sa imbitasyon ang mga bata?",
    answer:
      "Mahal namin ang inyong mga chikiting, pero adults-only muna ang ating selebrasyon, maliban sa mga batang bahagi ng seremonya. Salamat sa pag-unawa.",
  },
  {
    question: "Saan puwedeng mag-park?",
    answer:
      "Depende sa venue ang availability ng parking. Mas mabuting dumating nang maaga at sundin ang gabay ng venue staff at coordinators pagdating ninyo.",
  },
  {
    question: "Unplugged ba ang ceremony?",
    answer:
      "Oo, pakiusap naming itabi muna ang inyong phones at cameras habang ginaganap ang seremonya. Gusto naming lubos nating maramdaman at mapagsaluhan ang espesyal naming araw.",
  },
  {
    question: "Ano ang dapat dalhin para sa panahon sa Baguio?",
    answer:
      "Maaaring malamig at mahangin, lalo na sa hapon at gabi, at posible rin ang ulan. Magdala ng payong at jacket o shawl para komportable kayo. Asahan ang mababang temperature sa Baguio sa buwan ng Enero.",
  },
  {
    question: "May gusto ba kayong matanggap na regalo?",
    answer:
      "Regalo na sa amin ang pagpunta at pakikisaya ninyo. Kung nais pa ninyong magbigay, buong pasasalamat naming tatanggapin ang monetary gift bilang tulong sa pagsisimula ng aming buhay bilang mag asawa.",
  },
  {
    question: "Puwede ko bang baguhin ang aking RSVP?",
    answer:
      "Pakisuri muna ang inyong mga sagot bago i-submit. Kung may kailangang baguhin, makipag-ugnayan muna sa amin para makumpirma kung maaari pa itong ma-adjust.",
  },
  {
    question: "Puwede bang i-share ang invitation link?",
    answer: "Para sa mga inimbitahan lamang ang ating selebrasyon. Kami ay lubos na nakikiusap na panatilihing pribado ang website at mga detalye ng kasal, at huwag ipasa ang link. Salamat sa pag-iingat nito kasama namin.",
  },
];

useGsapContext(sectionRef, ({ gsap, ScrollTrigger, scope }) => {
  const aside = scope.querySelector(".faq-aside");
  const items = gsap.utils.toArray(".faq-item");

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
  --faq-gold: #987853;
  --faq-ink: #24313a;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(5rem, 8vw, 8rem) clamp(1.25rem, 5vw, 5rem);
  background: rgba(255, 250, 245, .76);
  color: var(--faq-ink);
}
:global(#app .site-shell #faq.faq-section) { background: rgba(255, 250, 245, .76); }

.faq-layout {
  width: min(100%, 1110px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(240px, 0.95fr) minmax(0, 1.4fr);
  gap: clamp(3rem, 7vw, 6rem);
  align-items: start;
}
.faq-aside {
  position: sticky;
  top: 0;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  border: 1px solid rgba(40, 77, 103, .12);
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(65, 56, 49, .07);
}
:global(#app .site-shell #faq .faq-aside) { background: rgba(255, 250, 245, .94); }
.faq-aside h2 {
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(3rem, 4vw, 4rem);
  font-style: normal;
  font-weight: 400;
  line-height: 0.98;
  color: var(--faq-blue);
}
.faq-aside h2 em { color: var(--faq-gold); font-weight: 400; }
@media (min-width: 901px) {
  #faq .faq-aside h2 { font-size: 3.5rem; }
  .faq-aside h2 em { font-size: .82em; white-space: nowrap; }
}
.faq-aside__intro {
  max-width: 330px;
  margin: 1.8rem 0 0;
  font-family: "Manrope", sans-serif;
  font-size: 0.82rem;
  font-weight: 300;
  line-height: 1.75;
  color: rgba(36, 49, 58, 0.7);
}

.faq-list {
  padding: clamp(0.75rem, 2vw, 1.25rem) clamp(1rem, 2.5vw, 2rem);
  background: rgba(255, 250, 245, .94);
  border: 1px solid rgba(40, 77, 103, .12);
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(65, 56, 49, .07);
}
.faq-item {
  border-bottom: 1px solid rgba(40, 77, 103, 0.16);
}
.faq-item__button {
  width: 100%;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1.4rem;
  border: 0;
  padding: 1.35rem 0;
  background: transparent;
  text-align: left;
  color: inherit;
  cursor: pointer;
}
.faq-item__number {
  font-family: "Manrope", sans-serif;
  font-size: 0.7rem;
  color: var(--faq-gold);
}
.faq-item__question {
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(1.45rem, 2vw, 1.85rem);
  font-style: normal;
  font-weight: 400;
  line-height: 1.2;
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
  background: var(--faq-gold);
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
  padding: 0 2rem 1.5rem 2.6rem;
}
.faq-item__answer-inner p {
  margin: 0;
  font-family: "Manrope", sans-serif;
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.85;
  color: #39454d;
}
.faq-item__answer-inner p + p { margin-top: 1rem; }

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
    padding: 4.5rem 1rem;
  }
  .faq-item__answer-inner {
    padding-right: 0;
    padding-left: 1.8rem;
  }
}
.faq-item.is-open .faq-item__answer { grid-template-rows: 1fr; }
.faq-item__answer-clip { min-height: 0; overflow: hidden; }
.faq-aside, .faq-list, .faq-item, .faq-item__question { min-width: 0; overflow-wrap: anywhere; }
.faq-aside h2 { font-size: clamp(3rem, 7vw, 4.25rem); }
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

