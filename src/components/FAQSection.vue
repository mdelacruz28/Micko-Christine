<template>
  <section id="faq" class="faq-section">
    <div class="faq-section__wash" aria-hidden="true"></div>

    <header class="faq-header">
      <p class="faq-header__eyebrow">A few helpful notes</p>
      <h2>Frequently Asked Questions</h2>
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
          reaching out, as we will continue updating it when needed.
        </p>

        <div class="faq-aside__ornament" aria-hidden="true">
          <span></span>
          <i></i>
          <span></span>
        </div>

        <p class="faq-aside__script">Thank you for helping us keep things simple.</p>
      </aside>

      <div class="faq-list">
        <article
          v-for="(item, index) in faqs"
          :key="item.question"
          class="faq-item"
          :class="{ 'is-open': openIndex === index }"
        >
          <button
            class="faq-item__button"
            type="button"
            :aria-expanded="openIndex === index"
            @click="toggleFaq(index)"
          >
            <span class="faq-item__number">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <span class="faq-item__question">
              {{ item.question }}
            </span>

            <span class="faq-item__icon" aria-hidden="true">
              <i></i>
              <i></i>
            </span>
          </button>

          <div
            class="faq-item__answer"
            :style="{
              maxHeight:
                openIndex === index
                  ? `${answerRefs[index]?.scrollHeight || 0}px`
                  : '0px'
            }"
          >
            <div :ref="el => setAnswerRef(el, index)" class="faq-item__answer-inner">
              <p>{{ item.answer }}</p>

              <ul v-if="item.points?.length">
                <li v-for="point in item.points" :key="point">
                  {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </div>

    <footer class="faq-footer">
      <div class="faq-footer__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>

      <p class="faq-footer__script">
        We’re grateful for your thoughtfulness and cooperation.
      </p>
    </footer>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(0)
const answerRefs = ref([])

const faqs = [
  {
    question: 'What should I wear?',
    answer:
      'Our dress code is Garden Formal. We encourage polished, romantic, and comfortable attire suitable for a Baguio garden celebration.',
    points: [
      'Ladies may wear midi, cocktail, or floor-length dresses.',
      'Gentlemen may wear tucked-in polos or button-down shirts with tailored trousers.',
      'Please avoid blue shades, white, ivory, black, and neon colors.'
    ]
  },
  {
    question: 'Can I bring a plus one?',
    answer:
      'Please refer to the number of seats reserved in your invitation. Only guests whose invitation specifically includes an additional seat may bring a companion.',
    points: [
      'Do not add a companion unless a second seat is explicitly reserved.',
      'Companion details must match the reserved-seat allocation.',
      'Requests for additional seats cannot be guaranteed.'
    ]
  },
  {
    question: 'Are children invited?',
    answer:
      'To help us keep the celebration intimate and organized, only children whose names are included in the invitation are part of the guest list.',
    points: [
      'Please do not bring unlisted children.',
      'Children with assigned entourage roles are, of course, included.'
    ]
  },
  {
    question: 'Where should we park?',
    answer:
      'Parking availability may vary by venue. We recommend arriving early and following the instructions of venue staff and coordinators.',
    points: [
      'Allow extra time for parking at Camp John Hay.',
      'Carpooling is encouraged when possible.',
      'Please proceed directly to the reception venue after the ceremony.'
    ]
  },
  {
    question: 'How do we get from the ceremony to the reception?',
    answer:
      'Guests will travel from Bell Amphitheater to Lafaayette Luxury Suites after the ceremony. A Google Maps direction link will be available in the Wedding Details section.',
    points: [
      'Estimated travel time is approximately 10–30 minutes, depending on traffic.',
      'Please proceed promptly after the ceremony.'
    ]
  },
  {
    question: 'What time should I arrive?',
    answer:
      'Guest arrival begins at 2:00 PM. We kindly ask everyone to be seated by 2:20 PM so the ceremony may begin promptly at 2:30 PM.'
  },
  {
    question: 'Is the ceremony unplugged?',
    answer:
      'We kindly encourage an unplugged ceremony so everyone can be fully present and our photo and video team can capture the moment without obstruction.',
    points: [
      'Please keep phones on silent.',
      'Avoid standing in the aisle or using flash during the ceremony.'
    ]
  },
  {
    question: 'What should I know about Baguio weather?',
    answer:
      'Baguio can be cool, breezy, or rainy, especially later in the afternoon and evening.',
    points: [
      'Bring a light jacket, shawl, or wrap.',
      'Choose comfortable footwear suitable for garden pathways.',
      'An umbrella may be helpful.'
    ]
  },
  {
    question: 'Do you have a gift preference?',
    answer:
      'Your presence is already a meaningful gift. For those who wish to bless us further, details about our gift preference or registry will be shared in the invitation.'
  },
  {
    question: 'Can I change my RSVP after submitting?',
    answer:
      'Please review your answers carefully before submission. Changes may no longer be accommodated unless you contact the couple directly and receive confirmation.'
  },
  {
    question: 'Can I share the invitation link?',
    answer:
      'Please keep the website and event details private. The invitation is intended only for the named guest or household and should not be forwarded or posted publicly.'
  }
]

const toggleFaq = index => {
  openIndex.value = openIndex.value === index ? -1 : index
}

const setAnswerRef = (el, index) => {
  if (el) answerRefs.value[index] = el
}
</script>

<style scoped>
.faq-section {
  --faq-blue: #284d67;
  --faq-melon: #efb49f;
  --faq-pomegranate: #a64248;
  --faq-bistre: #78614b;
  --faq-ink: #24313a;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  background:
    linear-gradient(
      180deg,
      #f8f2eb 0%,
      #fffaf6 50%,
      #f5ede5 100%
    );
  color: var(--faq-ink);
}

.faq-section__wash {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% 18%, rgba(239, 180, 159, 0.2), transparent 24rem),
    radial-gradient(circle at 92% 76%, rgba(40, 77, 103, 0.12), transparent 28rem);
}

.faq-header {
  width: min(100%, 820px);
  margin: 0 auto clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}

.faq-header__eyebrow {
  margin: 0 0 0.75rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  color: var(--faq-melon);
  transform: rotate(-3deg);
}

.faq-header h2 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.5rem, 7.5vw, 6.6rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.045em;
  color: var(--faq-blue);
}

.faq-header__intro {
  width: min(100%, 620px);
  margin: 1.7rem auto 0;
  font-family: 'Manrope', sans-serif;
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
  font-family: 'Manrope', sans-serif;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--faq-pomegranate);
}

.faq-aside h3 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.3rem, 4vw, 3.6rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1;
  color: var(--faq-blue);
}

.faq-aside > p:not(.faq-aside__label):not(.faq-aside__script) {
  margin: 1rem 0 0;
  font-family: 'Manrope', sans-serif;
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
  font-family: 'Allura', cursive;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  line-height: 1.2;
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
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-style: italic;
  color: rgba(40, 77, 103, 0.4);
}

.faq-item__question {
  font-family: 'Cormorant Garamond', serif;
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
  transition: max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.faq-item__answer-inner {
  padding: 0 3.2rem 1.7rem 3.7rem;
}

.faq-item__answer-inner p {
  margin: 0;
  font-family: 'Manrope', sans-serif;
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
  font-family: 'Manrope', sans-serif;
  font-size: 0.82rem;
  line-height: 1.8;
  color: rgba(36, 49, 58, 0.66);
}

.faq-item__answer-inner li::before {
  content: '·';
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
  font-family: 'Allura', cursive;
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

  .faq-item__button {
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.8rem;
  }

  .faq-item__answer-inner {
    padding-right: 0;
    padding-left: 2.6rem;
  }
}
</style>
