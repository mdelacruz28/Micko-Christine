<template>
  <section id="dress-code" ref="sectionRef" class="dress-section">
    <div class="dress-section__wash" aria-hidden="true"></div>

    <header class="dress-header">
      <p class="dress-header__eyebrow">Para sa ating pagdiriwang</p>
      <h2 class="section-heading">Kasuotan sa Kasal</h2>
      <p class="dress-header__intro">
        Magsuot ng damit na maayos, komportable, at bagay sa ating pagdiriwang sa Baguio.
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
              <p class="dress-card__detail-title">{{ detail.title }}</p>
              <p class="dress-card__copy">{{ detail.copy }}</p>
            </div>
          </div>

          <div
            v-if="group.swatches?.length"
            class="dress-card__swatches"
            role="group"
            :aria-label="`Mga kulay para sa ${group.title}`"
          >
            <p class="dress-card__swatches-title">Mga mungkahing kulay</p>
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

    <section class="avoid-guide" aria-label="Mga paalala sa kasuotan">
      <div class="avoid-guide__items">
        <div class="avoid-item">
          <h3>Kaunting pakiusap para sa mga bisita</h3>
          <p>Iwasan muna ang blue, puti at ivory, itim, at neon. Piliin ang warm at eleganteng garden shades. Ang puti at ivory ay nakalaan para sa bride at bridal details.</p>
        </div>
        <div class="avoid-item">
          <h3>Komportableng lakad, komportableng gabi</h3>
          <p>Semi-formal o smart-casual na sapatos ang bagay sa selebrasyon. Magdala rin ng jacket o shawl para sa lamig ng Baguio.</p>
        </div>
      </div>
    </section>
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
    label: 'Ninong at Ninang',
    title: 'Ninong at Ninang',
    image: '/images/main%20sponsor.png',
    imageAlt: 'Mga Ninong na nakabarong at mga Ninang na nakasuot ng makukulay na gown',
    details: [
      {
        heading: 'Para sa mga babae',
        title: 'Para sa aming mga Ninang.',
        copy:
          'Mahabang gown o Filipiniana-inspired na kasuotan sa mas mapusyaw na kulay ng wedding palette. Puwedeng gawing inspirasyon ang mga kulay sa ibaba.'
      },
      {
        heading: 'Para sa mga lalaki',
        title: 'Para sa aming mga Ninong.',
        copy:
          'Klasikong Barong Tagalog sa light o tradisyonal na cream na kulay, na ipinares sa formal na pantalon.'
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
    label: 'Para sa mga bisita',
    title: 'Mga Bisita',
    image: '/images/guest%20attire.png',
    imageAlt: 'Mga bisitang nakasuot ng pastel na damit, floral na gown, polo, at pantalon',
    details: [
      {
        heading: 'Para sa mga babae',
        title: 'Damit na bagay sa iyo.',
        copy: 'Puwedeng midi, cocktail, o mahabang dress. Welcome ang floral prints at eleganteng solid colors, sa flowing o structured na silhouette na komportable ka.'
      },
      {
        heading: 'Para sa mga lalaki',
        title: 'Simple at pulidong porma.',
        copy: 'Tucked-in polo o button-down, long o short sleeves, na may maayos na slacks o chinos. Bagay ang malinis at sakto sa sukat na damit sa ating garden setting.'
      }
    ],
    swatches: [
      { name: 'Light Melon', color: '#efb49f' },
      { name: 'Glazed Apricot', color: '#e8a078' },
      { name: 'Soft Bistre', color: '#b49b7a' }
    ]
  }
]

useGsapContext(sectionRef, ({ gsap, ScrollTrigger, scope }) => {
  const header = scope.querySelector('.dress-header')
  const attireCards = gsap.utils.toArray(
    scope.querySelectorAll('.dress-featured > article')
  )
  const avoidItems = gsap.utils.toArray(
    scope.querySelectorAll('.avoid-item')
  )

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
  display: flex;
  flex-direction: column;
  padding: clamp(1.25rem, 2vw, 2rem);
}
.dress-featured .dress-card__columns { grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.8rem; }
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

.dress-card__detail-title {
  margin: 0 0 0.55rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.5rem, 2.5vw, 1.9rem);
  line-height: 1.15;
  color: var(--dress-blue);
}

.dress-card__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin-top: auto;
  padding-top: 1.4rem;
  border-top: 1px solid rgba(40, 77, 103, 0.12);
}

.dress-card__swatches-title {
  flex-basis: 100%;
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--dress-bistre);
}

.swatch {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.swatch i {
  width: 21px;
  height: 21px;
  flex: 0 0 auto;
  display: block;
  border: 1px solid rgba(36, 49, 58, 0.1);
  border-radius: 50%;
  background: var(--swatch-color);
}

.swatch small {
  font-family: 'Manrope', sans-serif;
  font-size: 0.72rem;
  color: rgba(36, 49, 58, 0.62);
}

.avoid-guide {
  width: min(100%, 1120px);
  margin: clamp(3.5rem, 6vw, 5rem) auto 0;
}

.avoid-guide__items {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  padding-top: 1.5rem;
  border-top: 1px solid rgba(120, 97, 75, .25);
}

.avoid-item {
  min-width: 0;
}

.avoid-item h3 {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  line-height: 1.5;
  text-transform: uppercase;
  color: var(--dress-bistre);
}
.avoid-item p {
  margin: .7rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.84rem;
  line-height: 1.7;
  color: #37454d;
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
    grid-template-columns: 1fr;
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

</style>
