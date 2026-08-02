<template>
  <section id="dress-code" class="dress-section">
    <div class="dress-section__wash" aria-hidden="true"></div>

    <header class="dress-header">
      <p class="dress-header__eyebrow">Dressed for the occasion</p>
      <h2>Wedding Attire</h2>
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
      >
        <div class="dress-card__image">
          <img :src="group.image" :alt="group.imageAlt" loading="lazy" />
          <div class="dress-card__overlay" aria-hidden="true"></div>
          <span class="dress-card__label">{{ group.label }}</span>
        </div>

        <div class="dress-card__content">
          <h3>{{ group.title }}</h3>

          <div class="dress-card__columns">
            <div
              v-for="detail in group.details"
              :key="detail.heading"
              class="dress-card__column"
            >
              <p class="dress-card__heading">{{ detail.heading }}</p>
              <p class="dress-card__copy">{{ detail.copy }}</p>
            </div>
          </div>

          <div
            v-if="group.swatches?.length"
            class="dress-card__swatches"
            aria-label="Suggested colors"
          >
            <span
              v-for="swatch in group.swatches"
              :key="swatch.name"
              class="swatch"
              :title="swatch.name"
              :style="{ '--swatch-color': swatch.color }"
            >
              <i></i>
              <small>{{ swatch.name }}</small>
            </span>
          </div>
        </div>
      </article>
    </div>

    <section class="guest-guide">
      <div class="guest-guide__heading">
        <p>For our beloved guests</p>
        <h3>Garden Formal</h3>
        <span>
          Refined, romantic, and comfortable for a Baguio garden celebration
        </span>
      </div>

      <div class="guest-guide__grid">
        <article
          v-for="guide in guestGuides"
          :key="guide.title"
          class="guest-card"
        >
          <div class="guest-card__icon" v-html="guide.icon" aria-hidden="true"></div>
          <p class="guest-card__label">{{ guide.label }}</p>
          <h4>{{ guide.title }}</h4>
          <p>{{ guide.description }}</p>

          <ul>
            <li v-for="item in guide.items" :key="item">
              {{ item }}
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="palette-guide">
      <div class="palette-guide__heading">
        <p>Guest color inspiration</p>
        <h3>Warm garden shades</h3>
      </div>

      <div class="palette-guide__swatches">
        <div
          v-for="swatch in guestPalette"
          :key="swatch.name"
          class="palette-swatch"
        >
          <span :style="{ backgroundColor: swatch.color }"></span>
          <p>{{ swatch.name }}</p>
        </div>
      </div>
    </section>

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
const featuredGroups = [
  {
    label: 'Principal Sponsors',
    title: 'Formal & Distinguished',
    image: '/images/dress-code/principal-sponsors.jpg',
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
    label: 'Immediate Family',
    title: 'Coordinated in Soft Hues',
    image: '/images/dress-code/family.jpg',
    imageAlt: 'Formal attire inspiration for the couple’s immediate family',
    details: [
      {
        heading: 'Bride & Groom’s Family',
        copy:
          'Light shades of blue such as powder blue, dusty blue, and softened Van Gogh blue.'
      },
      {
        heading: 'Mothers & Fathers',
        copy:
          'Mothers may wear light melon, dusty rose, or soft pink. Fathers may wear a light Barong Tagalog.'
      }
    ],
    swatches: [
      { name: 'Dusty Blue', color: '#7899ad' },
      { name: 'Powder Blue', color: '#a8c7d7' },
      { name: 'Dusty Rose', color: '#c88f95' },
      { name: 'Light Melon', color: '#efb49f' }
    ]
  }
]

const guestGuides = [
  {
    label: 'Ladies',
    title: 'Romantic & Refined',
    description:
      'Choose a polished silhouette that moves beautifully and feels comfortable throughout the celebration.',
    items: [
      'Midi, cocktail, or floor-length dress',
      'Floral prints or elegant solid colors',
      'Flowing or structured silhouettes',
      'Semi-formal or smart-casual footwear'
    ],
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M9 4h6l1 4-2 3 3 9H7l3-9-2-3 1-4Z"/>
        <path d="M10 4c0 1.4.8 2.2 2 2.2S14 5.4 14 4"/>
      </svg>
    `
  },
  {
    label: 'Gentlemen',
    title: 'Polished & Relaxed',
    description:
      'A clean, well-fitted look is perfect for the garden setting and the cool Baguio atmosphere.',
    items: [
      'Tucked-in polo or button-down shirt',
      'Long or short sleeves are welcome',
      'Tailored trousers or polished chinos',
      'Semi-formal or smart-casual footwear'
    ],
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="m8 5 4 3 4-3 3 3-2 3v9H7v-9L5 8l3-3Z"/>
        <path d="M12 8v12"/>
        <path d="m9 4 3 4 3-4"/>
      </svg>
    `
  }
]

const guestPalette = [
  { name: 'Pomegranate', color: '#a64248' },
  { name: 'Glazed Apricot', color: '#e29a72' },
  { name: 'Spanish Bistre', color: '#78614b' },
  { name: 'Muted Sage', color: '#86927e' },
  { name: 'Dusty Rose', color: '#c88f95' },
  { name: 'Warm Taupe', color: '#a89583' }
]

const avoidColors = [
  {
    name: 'Blue shades',
    reason: 'Reserved for the couple’s immediate family.',
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
  inset: 0;
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
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.8rem, 8vw, 7rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
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
  gap: clamp(1.5rem, 4vw, 3rem);
}

.dress-card {
  overflow: hidden;
  border: 1px solid rgba(40, 77, 103, 0.12);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 70px rgba(65, 56, 49, 0.1);
}

.dress-card__image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 11;
  background: #ddd5cc;
}

.dress-card__image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}

.dress-card:hover .dress-card__image img {
  transform: scale(1.04);
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

.guest-guide,
.palette-guide,
.avoid-guide {
  width: min(100%, 1120px);
  margin: clamp(6rem, 10vw, 9rem) auto 0;
}

.guest-guide__heading,
.palette-guide__heading,
.avoid-guide__heading {
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
  text-align: center;
}

.guest-guide__heading > p,
.palette-guide__heading > p,
.avoid-guide__heading > p {
  margin: 0 0 0.55rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.45rem, 2.8vw, 2.1rem);
  color: var(--dress-melon);
}

.guest-guide__heading h3,
.palette-guide__heading h3,
.avoid-guide__heading h3 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.8rem, 5vw, 4.8rem);
  font-style: italic;
  font-weight: 500;
  color: var(--dress-blue);
}

.guest-guide__heading span {
  display: block;
  margin-top: 0.7rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.78rem;
  font-weight: 300;
  letter-spacing: 0.07em;
  color: rgba(36, 49, 58, 0.58);
}

.guest-guide__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.2rem, 3vw, 2rem);
}

.guest-card {
  padding: clamp(2rem, 5vw, 3.5rem);
  border: 1px solid rgba(40, 77, 103, 0.12);
  background: rgba(255, 255, 255, 0.68);
}

.guest-card__icon {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  margin-bottom: 1.3rem;
  border: 1px solid rgba(40, 77, 103, 0.18);
  border-radius: 50%;
  color: var(--dress-pomegranate);
}

.guest-card__icon :deep(svg) {
  width: 27px;
  height: 27px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.guest-card__label {
  margin: 0 0 0.55rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--dress-melon);
}

.guest-card h4 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  font-style: italic;
  font-weight: 500;
  color: var(--dress-blue);
}

.guest-card > p:not(.guest-card__label) {
  margin: 1rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.86rem;
  font-weight: 300;
  line-height: 1.75;
  color: rgba(36, 49, 58, 0.68);
}

.guest-card ul {
  margin: 1.3rem 0 0;
  padding: 1.2rem 0 0;
  border-top: 1px solid rgba(40, 77, 103, 0.12);
  list-style: none;
}

.guest-card li {
  position: relative;
  padding-left: 1.2rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.82rem;
  line-height: 1.8;
  color: rgba(36, 49, 58, 0.72);
}

.guest-card li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--dress-pomegranate);
}

.palette-guide__swatches {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1rem;
}

.palette-swatch {
  text-align: center;
}

.palette-swatch span {
  display: block;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 6px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 12px 30px rgba(55, 53, 51, 0.12);
}

.palette-swatch p {
  margin: 0.8rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: rgba(36, 49, 58, 0.68);
}

.avoid-guide__items {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.avoid-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 120px;
  padding: 1.3rem;
  border: 1px solid rgba(40, 77, 103, 0.11);
  background: rgba(255, 255, 255, 0.64);
}

.avoid-item__color {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  border: 1px solid;
  border-radius: 50%;
}

.avoid-item strong {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-style: italic;
  font-weight: 500;
  color: var(--dress-blue);
}

.avoid-item p {
  margin: 0.25rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.72rem;
  font-weight: 300;
  line-height: 1.55;
  color: rgba(36, 49, 58, 0.62);
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
  .palette-guide__swatches {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .avoid-guide__items {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .dress-featured,
  .guest-guide__grid {
    grid-template-columns: 1fr;
  }

  .dress-featured {
    max-width: 620px;
  }
}

@media (max-width: 520px) {
  .dress-section {
    padding-inline: 1rem;
  }

  .dress-card__columns {
    grid-template-columns: 1fr;
  }

  .dress-card__column + .dress-card__column {
    padding-top: 1.2rem;
    padding-left: 0;
    border-top: 1px solid rgba(40, 77, 103, 0.13);
    border-left: 0;
  }

  .palette-guide__swatches,
  .avoid-guide__items {
    grid-template-columns: 1fr 1fr;
  }

  .avoid-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
