<template>
  <section id="dress-code" ref="sectionRef" class="dress-section">
    <div class="dress-section__wash" aria-hidden="true"></div>

    <header class="dress-header">
      <p class="dress-header__eyebrow">Dressed for the occasion</p>
      <h2 class="section-heading">Wedding Attire</h2>
      <p class="dress-header__intro">
        We would love for everyone to feel comfortable, polished, and beautifully
        part of our garden celebration.
      </p>
    </header>

    <div class="dress-featured">
      <article
        v-for="group in featuredGroups"
        :key="group.title"
        class="dress-card"
        :aria-labelledby="group.id"
      >
        <div class="dress-card__image">
          <img v-show="!failedImages.has(group.image)" :src="group.image" :alt="group.imageAlt" loading="lazy" decoding="async" @error="failedImages.add(group.image)" />
          <p v-if="failedImages.has(group.image)" class="dress-card__image-fallback" role="img" :aria-label="group.imageAlt">{{ group.imageAlt }}</p>
          <div class="dress-card__overlay" aria-hidden="true"></div>
          <span class="dress-card__label">{{ group.label }}</span>
        </div>

        <div class="dress-card__content">
          <h3 :id="group.id">{{ group.title }}</h3>

          <div class="dress-card__columns">
            <div
              v-for="detail in group.details"
              :key="detail.heading"
              class="dress-card__column"
            >
              <h4 class="dress-card__heading">{{ detail.heading }}</h4>
              <p class="dress-card__copy">{{ detail.copy }}</p>
              <ul v-if="detail.items" class="dress-card__list">
                <li v-for="item in detail.items" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>

          <p v-if="group.note" class="dress-card__note">{{ group.note }}</p>

          <div
            v-if="group.swatches?.length"
            class="dress-card__swatches"
            role="group"
            aria-label="Suggested colors"
          >
            <span
              v-for="swatch in group.swatches"
              :key="swatch.name"
              class="swatch"
              :title="swatch.name"
              :style="{ '--swatch-color': swatch.color }"
            >
              <i aria-hidden="true"></i>
              <small>{{ swatch.name }}</small>
            </span>
          </div>
        </div>
      </article>
    </div>

    <section class="avoid-guide">
      <div class="avoid-guide__heading">
        <p>A gentle request</p>
        <h3>Please avoid</h3>
      </div>

      <div class="avoid-guide__items">
        <div
          v-for="item in avoidColors"
          :key="item.name"
          class="avoid-item"
        >
          <span
            class="avoid-item__color"
            aria-hidden="true"
            :style="{
              background: item.background,
              borderColor: item.border || 'transparent'
            }"
          ></span>

          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.reason }}</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="dress-footer">
      <div class="dress-footer__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>

      <p class="dress-footer__script">
        Come as your most elegant and comfortable self.
      </p>

      <p class="dress-footer__note">
        Please consider bringing a light layer for the cool Baguio weather.
      </p>
    </footer>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useGsapContext } from '../composables/useGsapContext.js'

const sectionRef = ref(null)
const failedImages = reactive(new Set())

const featuredGroups = [
  {
    id: 'sponsor-attire-title',
    label: 'Main Sponsors',
    title: 'Ninong & Ninang',
    image: '/images/main%20sponsor.png',
    imageAlt: 'Formal attire inspiration for principal sponsors',
    details: [
      {
        heading: 'Ladies',
        copy:
          'Long gown or Filipiniana-inspired attire in any lighter shade of the wedding palette.'
      },
      {
        heading: 'Gentlemen',
        copy:
          'Classic Barong Tagalog in a light or traditional cream tone, paired with formal trousers.'
      }
    ],
    swatches: [
      { name: 'Powder Blue', color: '#9fbfd1' },
      { name: 'Light Melon', color: '#efb49f' },
      { name: 'Glazed Apricot', color: '#e8a078' },
      { name: 'Soft Bistre', color: '#b49b7a' }
    ]
  },
  {
    id: 'guest-attire-title',
    label: 'Guest Attire',
    title: 'Ladies & Gentlemen',
    image: '/images/guest%20attire.png',
    imageAlt: 'Garden wedding attire inspiration for ladies and gentlemen in dresses, shirts, and trousers',
    details: [
      {
        heading: 'Ladies',
        copy: 'Choose a polished silhouette that moves beautifully and feels comfortable throughout the celebration.',
        items: ['Midi, cocktail, or floor-length dress', 'Floral prints or elegant solid colors', 'Flowing or structured silhouettes']
      },
      {
        heading: 'Gentlemen',
        copy: 'A clean, well-fitted look is perfect for the garden setting and the cool Baguio atmosphere.',
        items: ['Tucked-in polo or button-down shirt', 'Long or short sleeves are welcome', 'Tailored trousers or polished chinos']
      }
    ],
    note: 'For all guests: semi-formal or smart-casual footwear.'
  }
]

const avoidColors = [
  {
    name: 'Blue shades',
    reason: 'Please choose warm, muted wedding colors instead.',
    background: 'linear-gradient(135deg, #9fbfd1, #284d67)'
  },
  {
    name: 'White & ivory',
    reason: 'Reserved for the bride and bridal details.',
    background: '#fffdf8',
    border: '#d9d1c7'
  },
  {
    name: 'Black',
    reason: 'We encourage warm, celebratory garden shades.',
    background: '#1c1c1c'
  },
  {
    name: 'Neon colors',
    reason: 'Please choose soft, muted, or elegant tones instead.',
    background: 'linear-gradient(135deg, #dfff00, #ff4fd8)'
  }
]

useGsapContext(sectionRef, ({ gsap, ScrollTrigger, scope }) => {
  const header = scope.querySelector('.dress-header')
  const attireCards = gsap.utils.toArray(
    scope.querySelectorAll('.dress-featured > article')
  )
  const avoidHeading = scope.querySelector('.avoid-guide__heading')
  const avoidItems = gsap.utils.toArray(
    scope.querySelectorAll('.avoid-item')
  )
  const footer = scope.querySelector('.dress-footer')

  gsap.from(header.children, {
    scrollTrigger: {
      trigger: header,
      start: 'top 84%',
      once: true
    },
    opacity: 0,
    y: 38,
    filter: 'blur(5px)',
    duration: 0.95,
    stagger: 0.12,
    ease: 'power3.out'
  })

  const mediaContext = gsap.matchMedia()

  mediaContext.add('(min-width: 761px)', () => {
    attireCards.forEach(card => {
      const imageWrap = card.querySelector('.dress-card__image')
      const label = card.querySelector('.dress-card__label')
      const content = card.querySelector('.dress-card__content')
      const contentChildren = content.children
      const swatches = card.querySelectorAll('.swatch')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 78%',
          once: true
        }
      })

      tl
        .from(card, {
          opacity: 0,
          y: 48,
          duration: 0.95,
          ease: 'power3.out'
        })
        .from(
          imageWrap,
          {
            clipPath: 'inset(0 0 100% 0)',
            duration: 1,
            ease: 'power4.out'
          },
          '-=0.78'
        )
        .from(
          label,
          {
            opacity: 0,
            y: 12,
            duration: 0.45
          },
          '-=0.48'
        )
        .from(
          contentChildren,
          {
            opacity: 0,
            y: 18,
            duration: 0.55,
            stagger: 0.08
          },
          '-=0.52'
        )
      if (swatches.length) {
        tl.from(swatches, {
          opacity: 0,
          scale: 0.96,
          y: 10,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out'
        }, '-=0.38')
      }

      // Keep the full attire illustration in frame; card entrance remains animated.
    })
  })

  mediaContext.add('(max-width: 760px)', () => {
    attireCards.forEach(card => {
      const imageWrap = card.querySelector('.dress-card__image')
      const contentChildren = card.querySelector('.dress-card__content').children
      const swatches = card.querySelectorAll('.swatch')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 82%',
          once: true
        }
      })

      tl
        .from(card, {
          opacity: 0,
          y: 42,
          duration: 0.85
        })
        .from(
          imageWrap,
          {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.85
          },
          '-=0.65'
        )
        .from(
          contentChildren,
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
            stagger: 0.07
          },
          '-=0.45'
        )
      if (swatches.length) {
        tl.from(swatches, {
          opacity: 0,
          scale: 0.96,
          duration: 0.4,
          stagger: 0.06
        }, '-=0.32')
      }
    })
  })

  gsap.from(avoidHeading.children, {
    scrollTrigger: {
      trigger: avoidHeading,
      start: 'top 84%',
      once: true
    },
    opacity: 0,
    y: 28,
    duration: 0.8,
    stagger: 0.1
  })

  gsap.from(avoidItems, {
    scrollTrigger: {
      trigger: '.avoid-guide__items',
      start: 'top 82%',
      once: true
    },
    opacity: 0,
    y: 30,
    scale: 0.96,
    duration: 0.68,
    stagger: 0.1,
    ease: 'power3.out'
  })

  gsap.from('.avoid-item__color', {
    scrollTrigger: {
      trigger: '.avoid-guide__items',
      start: 'top 80%',
      once: true
    },
    rotate: -18,
    scale: 0.96,
    duration: 0.5,
    stagger: 0.09,
    ease: 'power2.out'
  })

  gsap.from(footer.children, {
    scrollTrigger: {
      trigger: footer,
      start: 'top 86%',
      once: true
    },
    opacity: 0,
    y: 28,
    duration: 0.8,
    stagger: 0.12
  })

  return () => mediaContext.revert()
})

</script>

<style scoped>
.dress-section {
  --dress-blue: #284d67;
  --dress-melon: #efb49f;
  --dress-pomegranate: #a64248;
  --dress-bistre: #78614b;
  --dress-ink: #24313a;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  background:
    linear-gradient(
      180deg,
      #f8f2eb 0%,
      #fffaf6 48%,
      #f5ede5 100%
    );
  color: var(--dress-ink);
}

.dress-section__wash {
  position: absolute;
  inset: -48px 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(circle at 8% 14%, rgba(239, 180, 159, 0.2), transparent 24rem),
    radial-gradient(circle at 94% 76%, rgba(40, 77, 103, 0.12), transparent 28rem);
}

.dress-header {
  width: min(100%, 780px);
  margin: 0 auto clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}

.dress-header__eyebrow {
  margin: 0 0 0.75rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  color: var(--dress-melon);
  transform: rotate(-3deg);
}

.dress-header h2 {
  margin: 0;
  font-size: clamp(3.8rem, 8vw, 7rem);
  letter-spacing: -0.045em;
  color: var(--dress-blue);
}

.dress-header__intro {
  width: min(100%, 610px);
  margin: 1.7rem auto 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.92rem, 1.5vw, 1.05rem);
  font-weight: 300;
  line-height: 1.9;
  color: rgba(36, 49, 58, 0.72);
}

.dress-featured {
  width: min(100%, 1120px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: stretch;
}

.dress-featured > article { display: grid; grid-template-rows: auto 1fr; }
.dress-featured .dress-card__image { width: 100%; aspect-ratio: 3 / 2; margin: 0; }
.dress-featured .dress-card__content {
  padding: clamp(1.25rem, 2vw, 2rem);
}
.dress-featured .dress-card__columns { grid-template-columns: 1fr; gap: 1rem; }
.dress-featured .dress-card__column + .dress-card__column {
  padding: 1rem 0 0;
  border-left: 0;
  border-top: 1px solid rgba(40, 77, 103, 0.13);
}

.dress-card {
  overflow: hidden;
  border: 1px solid rgba(40, 77, 103, 0.12);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 70px rgba(65, 56, 49, 0.1);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;
}

.dress-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 80px rgba(65, 56, 49, 0.14);
}

.dress-card__image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 11;
  background: #ddd5cc;
}

.dress-card__image img {
  width: 100%;
  height: 112%;
  margin-top: -6%;
  display: block;
  object-fit: cover;
  will-change: transform;
  transition: scale 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}

.dress-card:hover .dress-card__image img {
  scale: 1.04;
}

.dress-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(14, 29, 39, 0.55),
      transparent 58%
    );
}

.dress-card__label {
  position: absolute;
  left: 1.5rem;
  bottom: 1.25rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.66rem;
  font-weight: 500;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: #fffaf6;
}

.dress-card__content {
  padding: clamp(1.7rem, 4vw, 3rem);
}

.dress-card h3 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1;
  color: var(--dress-blue);
}

.dress-card__columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 1.8rem;
}

.dress-card__column + .dress-card__column {
  padding-left: 1.5rem;
  border-left: 1px solid rgba(40, 77, 103, 0.13);
}

.dress-card__heading {
  margin: 0 0 0.55rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--dress-pomegranate);
}

.dress-card__copy {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.84rem;
  font-weight: 300;
  line-height: 1.75;
  color: rgba(36, 49, 58, 0.7);
}

.dress-card__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.8rem;
  padding-top: 1.4rem;
  border-top: 1px solid rgba(40, 77, 103, 0.12);
}

.swatch {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.swatch i {
  width: 18px;
  height: 18px;
  display: block;
  border: 1px solid rgba(36, 49, 58, 0.1);
  border-radius: 50%;
  background: var(--swatch-color);
}

.swatch small {
  font-family: 'Manrope', sans-serif;
  font-size: 0.63rem;
  color: rgba(36, 49, 58, 0.62);
}

.avoid-guide {
  width: min(100%, 1120px);
  margin: clamp(6rem, 10vw, 9rem) auto 0;
}

.avoid-guide__heading {
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
  text-align: center;
}

.avoid-guide__heading > p {
  margin: 0 0 0.55rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.45rem, 2.8vw, 2.1rem);
  color: var(--dress-melon);
}

.avoid-guide__heading h3 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.8rem, 5vw, 4.8rem);
  font-style: italic;
  font-weight: 500;
  color: var(--dress-blue);
}

.avoid-guide__items {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: min(100%, 780px);
  margin-inline: auto;
  padding: clamp(.65rem, 2vw, 1.5rem);
  border: 1px solid rgba(120, 97, 75, .22);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 250, 245, .62), rgba(248, 239, 231, .59));
  box-shadow: 0 16px 42px rgba(47, 48, 46, .09);
}

.avoid-item {
  display: flex;
  align-items: flex-start;
  gap: clamp(.65rem, 2vw, 1.1rem);
  padding: clamp(.8rem, 2.6vw, 1.55rem);
}

.avoid-item:nth-child(odd) {
  border-inline-end: 1px solid rgba(120, 97, 75, .16);
}

.avoid-item:nth-child(-n+2) {
  border-bottom: 1px solid rgba(120, 97, 75, .16);
}

.avoid-item__color {
  flex: 0 0 auto;
  width: clamp(28px, 5vw, 42px);
  aspect-ratio: 1;
  border: 1px solid;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #fffaf5, 0 0 0 4px rgba(120, 97, 75, .16);
}

.avoid-item strong {
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.25rem, 2.5vw, 1.65rem);
  font-style: italic;
  font-weight: 600;
  line-height: 1.12;
  color: var(--dress-blue);
}

.avoid-item p {
  margin: .4rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(.78rem, 1.4vw, .88rem);
  line-height: 1.55;
  color: #37454d;
}

.dress-footer {
  width: min(100%, 720px);
  margin: clamp(5rem, 9vw, 8rem) auto 0;
  text-align: center;
}

.dress-footer__ornament {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.dress-footer__ornament span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(120, 97, 75, 0.38);
}

.dress-footer__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid var(--dress-melon);
  transform: rotate(45deg);
}

.dress-footer__script {
  margin: 1.15rem 0 0;
  font-family: 'Allura', cursive;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  color: var(--dress-blue);
}

.dress-footer__note {
  margin: 0.45rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.76rem;
  font-weight: 300;
  letter-spacing: 0.06em;
  color: rgba(36, 49, 58, 0.58);
}

@media (max-width: 940px) {
  .avoid-guide__items {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .dress-featured {
    grid-template-columns: 1fr;
  }

  .dress-featured {
    max-width: 620px;
  }
}

@media (max-width: 520px) {
  .dress-section {
    padding: 4rem 1rem;
  }
  .dress-featured { gap: 1.5rem; }
  .dress-card__content { padding: 1.4rem; }
  .avoid-guide { margin-top: 3.5rem; }
  .avoid-guide__heading { margin-bottom: 2rem; }
  .dress-footer { margin-top: 3.5rem; }

  .dress-card__columns {
    grid-template-columns: 1fr;
  }

  .dress-card__column + .dress-card__column {
    padding-top: 1.2rem;
    padding-left: 0;
    border-top: 1px solid rgba(40, 77, 103, 0.13);
    border-left: 0;
  }

  .avoid-guide__items {
    grid-template-columns: 1fr 1fr;
  }

  .avoid-item {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dress-card,
  .dress-card__image img,
  .avoid-item {
    transition: none;
  }
}
.dress-header, .dress-card, .dress-card__content, .dress-card__column, .avoid-item { min-width: 0; overflow-wrap: anywhere; }
.dress-header__eyebrow { color: var(--dress-bistre); }
.dress-section h2, .dress-section h3 { min-width: 0; overflow-wrap: anywhere; }
.dress-card__image-fallback { position: absolute; inset: 0; display: grid; place-content: center; margin: 0; padding: 1.5rem 1.5rem 4rem; text-align: center; color: var(--dress-blue); font-family: 'Cormorant Garamond', serif; font-size: clamp(1.2rem, 3vw, 1.7rem); line-height: 1.4; }
.dress-card__overlay { pointer-events: none; }
@media (prefers-reduced-motion: reduce) {
  .dress-card:hover, .avoid-item:hover { transform: none; }
  .dress-card:hover .dress-card__image img { scale: 1; }
  .dress-card__image img { will-change: auto; }
}

/* Full illustrations stay visible rather than cropping outfits. */
.dress-card__image { aspect-ratio: 3 / 2; background: transparent; }
.dress-card__image img { height: 100%; margin: 0; object-fit: contain; padding: .5rem .5rem 1.75rem; will-change: auto; }
.dress-card:hover .dress-card__image img { scale: 1; }
.dress-card__overlay { display: none; }
.dress-card__label { left: .5rem; right: .5rem; bottom: .4rem; color: var(--dress-blue); text-align: center; }

/* Sponsor illustrations float above the readable cream information panel. */
.dress-card { background: transparent; border: 0; box-shadow: none; }
.dress-card:hover { box-shadow: none; }
.dress-card__content { background: rgba(255,250,245,.94); border: 1px solid rgba(40,77,103,.12); box-shadow: 0 16px 40px rgba(65,56,49,.07); }

@media (max-width: 520px) {
  .dress-featured .dress-card__content { padding: 1.4rem; }
}

.dress-card__list,
.dress-card__note {
  font-family: 'Manrope', sans-serif;
  font-size: 0.84rem;
  line-height: 1.8;
  color: var(--dress-ink);
}
.dress-card__list { margin: 0.75rem 0 0; padding-left: 1.2rem; }
.dress-card__note { margin: 1.5rem 0 0; padding-top: 1rem; border-top: 1px solid rgba(40, 77, 103, 0.13); }
</style>
