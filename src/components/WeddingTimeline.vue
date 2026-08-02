<template>
  <section id="timeline" class="timeline-section">
    <div class="timeline-section__wash" aria-hidden="true"></div>

    <header class="timeline-header">
      <p class="timeline-header__eyebrow">The celebration unfolds</p>
      <h2>Wedding Day Timeline</h2>
      <p class="timeline-header__intro">
        A thoughtfully planned celebration, from the first welcome
        to the final song of the evening.
      </p>
    </header>

    <div class="timeline">
      <div class="timeline__spine" aria-hidden="true"></div>

      <article
        v-for="(item, index) in timelineItems"
        :key="item.time + item.title"
        class="timeline-item"
        :class="{ 'timeline-item--reverse': index % 2 === 1 }"
      >
        <div class="timeline-item__time">
          <span>{{ item.time }}</span>
        </div>

        <div class="timeline-item__marker" aria-hidden="true">
          <span v-html="item.icon"></span>
        </div>

        <div class="timeline-card">
          <p class="timeline-card__step">
            {{ String(index + 1).padStart(2, '0') }}
          </p>

          <p class="timeline-card__label">{{ item.label }}</p>

          <h3>{{ item.title }}</h3>

          <p class="timeline-card__venue">{{ item.venue }}</p>

          <p class="timeline-card__description">
            {{ item.description }}
          </p>

          <span v-if="item.note" class="timeline-card__note">
            {{ item.note }}
          </span>
        </div>
      </article>
    </div>

    <footer class="timeline-footer">
      <div class="timeline-footer__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>

      <p class="timeline-footer__script">
        Come for the vows, stay for the celebration.
      </p>

      <p class="timeline-footer__note">
        Event schedule may be adjusted slightly on the day.
      </p>
    </footer>
  </section>
</template>

<script setup>
const timelineItems = [
  {
    time: '2:00 PM',
    label: 'Welcome',
    title: 'Guest Arrival',
    venue: 'Bell Amphitheater · Camp John Hay',
    description:
      'Guests are invited to arrive early, settle into their seats, and enjoy the garden atmosphere before the ceremony begins.',
    note: 'Please be seated by 2:20 PM.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-4.4 7-11A7 7 0 1 0 5 10c0 6.6 7 11 7 11Z"/>
        <circle cx="12" cy="10" r="2.2"/>
      </svg>
    `
  },
  {
    time: '2:30 PM',
    label: 'Ceremony',
    title: 'Wedding Ceremony',
    venue: 'Bell Amphitheater',
    description:
      'Join us as we exchange vows, celebrate our faith, and begin our life together in the presence of the people we love.',
    note: 'An unplugged ceremony is kindly encouraged.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 6.5 12 3l3.5 3.5L12 10 8.5 6.5Z"/>
        <path d="M6.5 8.5 3 12l3.5 3.5L10 12 6.5 8.5Z"/>
        <path d="m15.5 8.5 3.5 3.5-3.5 3.5L12 12l3.5-3.5Z"/>
        <path d="M8.5 15.5 12 12l3.5 3.5L12 19l-3.5-3.5Z"/>
      </svg>
    `
  },
  {
    time: '4:00 PM',
    label: 'Interlude',
    title: 'Cocktail Hour',
    venue: 'Reception Venue',
    description:
      'Enjoy light refreshments, coffee, taho, and interactive guest activities while the newlyweds complete their portraits.',
    note: 'Travel time from Camp John Hay is approximately 10–30 minutes.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h14l-3 6.5a4.4 4.4 0 0 1-8 0L5 4Z"/>
        <path d="M12 14.5V20"/>
        <path d="M8.5 20h7"/>
      </svg>
    `
  },
  {
    time: '5:00 PM',
    label: 'Reception',
    title: 'Grand Reception',
    venue: 'Lafaayette Luxury Suites',
    description:
      'The celebration continues with our entrance, first dance, prayer, group photos, dinner, and a warm visit to every table.',
    note: 'Group photographs will be taken before dinner.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11h16"/>
        <path d="M6 11v8"/>
        <path d="M18 11v8"/>
        <path d="M8 7h8a2 2 0 0 1 2 2v2H6V9a2 2 0 0 1 2-2Z"/>
        <path d="M9 7V5h6v2"/>
      </svg>
    `
  },
  {
    time: '6:45 PM',
    label: 'Traditions',
    title: 'Wine, Cake & Speeches',
    venue: 'Lafaayette Ballroom',
    description:
      'We raise a glass, cut the wedding cake, and hear meaningful words from our closest family and friends.',
    note: 'MOH, Best Man, guest, and parent speeches.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h10l-1 6a4 4 0 0 1-8 0L7 3Z"/>
        <path d="M12 13v6"/>
        <path d="M9 21h6"/>
        <path d="M5 15h3v5H5z"/>
      </svg>
    `
  },
  {
    time: '7:45 PM',
    label: 'Celebration',
    title: 'Music & After Party',
    venue: 'Lafaayette Luxury Suites',
    description:
      'An intimate after-party filled with karaoke favorites, timeless love songs, and music for every generation.',
    note: 'The final song will be “Ride Home” by Ben&Ben.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 18V5l10-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="16" cy="16" r="3"/>
      </svg>
    `
  },
  {
    time: '9:00 PM',
    label: 'Closing',
    title: 'A Grateful Farewell',
    venue: 'With love, Micko & Christine',
    description:
      'Before the evening ends, we will share our final words of thanks and send everyone home with full hearts.',
    note: 'Thank you for being part of our beginning.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
      </svg>
    `
  }
]
</script>

<style scoped>
.timeline-section {
  --timeline-blue: #284d67;
  --timeline-melon: #efb49f;
  --timeline-pomegranate: #a64248;
  --timeline-bistre: #78614b;
  --timeline-ink: #26323a;
  --timeline-paper: #f8f2eb;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  color: var(--timeline-ink);
  background:
    linear-gradient(
      180deg,
      #f8f2eb 0%,
      #fdf9f5 50%,
      #f5ede5 100%
    );
}

.timeline-section__wash {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(circle at 8% 18%, rgba(239, 180, 159, 0.2), transparent 24rem),
    radial-gradient(circle at 94% 72%, rgba(40, 77, 103, 0.12), transparent 28rem);
}

.timeline-header {
  width: min(100%, 790px);
  margin: 0 auto clamp(5rem, 9vw, 8rem);
  text-align: center;
}

.timeline-header__eyebrow {
  margin: 0 0 0.75rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  color: var(--timeline-melon);
  transform: rotate(-3deg);
}

.timeline-header h2 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.6rem, 8vw, 7rem);
  font-weight: 500;
  font-style: italic;
  line-height: 0.95;
  letter-spacing: -0.045em;
  color: var(--timeline-blue);
}

.timeline-header__intro {
  width: min(100%, 600px);
  margin: 1.7rem auto 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.92rem, 1.5vw, 1.05rem);
  font-weight: 300;
  line-height: 1.9;
  color: rgba(38, 50, 58, 0.72);
}

.timeline {
  position: relative;
  width: min(100%, 1180px);
  margin: 0 auto;
}

.timeline__spine {
  position: absolute;
  top: 1rem;
  bottom: 1rem;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background:
    linear-gradient(
      to bottom,
      transparent,
      rgba(40, 77, 103, 0.26) 5%,
      rgba(40, 77, 103, 0.26) 95%,
      transparent
    );
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 92px 1fr;
  align-items: center;
  min-height: 390px;
}

.timeline-item__time {
  grid-column: 1;
  justify-self: end;
  padding-right: clamp(2rem, 5vw, 4.5rem);
}

.timeline-item--reverse .timeline-item__time {
  grid-column: 3;
  justify-self: start;
  padding-right: 0;
  padding-left: clamp(2rem, 5vw, 4.5rem);
}

.timeline-item__time span {
  display: inline-block;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 4.8vw, 4.5rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1;
  color: var(--timeline-blue);
  white-space: nowrap;
}

.timeline-item__marker {
  grid-column: 2;
  grid-row: 1;
  justify-self: center;
  position: relative;
  z-index: 2;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(40, 77, 103, 0.22);
  border-radius: 50%;
  background: rgba(255, 250, 246, 0.94);
  box-shadow:
    0 10px 30px rgba(50, 55, 58, 0.1),
    0 0 0 8px rgba(248, 242, 235, 0.95);
  color: var(--timeline-pomegranate);
}

.timeline-item__marker :deep(svg) {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.35;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.timeline-card {
  grid-column: 3;
  position: relative;
  width: min(100%, 470px);
  padding: clamp(1.7rem, 4vw, 3rem);
  border: 1px solid rgba(40, 77, 103, 0.12);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 65px rgba(62, 56, 51, 0.09);
  backdrop-filter: blur(10px);
}

.timeline-item--reverse .timeline-card {
  grid-column: 1;
  grid-row: 1;
  justify-self: end;
  text-align: right;
}

.timeline-card::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -9px;
  width: 16px;
  height: 16px;
  border-left: 1px solid rgba(40, 77, 103, 0.12);
  border-bottom: 1px solid rgba(40, 77, 103, 0.12);
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-50%) rotate(45deg);
}

.timeline-item--reverse .timeline-card::before {
  right: -9px;
  left: auto;
  border: 0;
  border-top: 1px solid rgba(40, 77, 103, 0.12);
  border-right: 1px solid rgba(40, 77, 103, 0.12);
}

.timeline-card__step {
  position: absolute;
  top: 0.7rem;
  right: 1.1rem;
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.5rem, 6vw, 5.5rem);
  font-style: italic;
  line-height: 1;
  color: rgba(40, 77, 103, 0.08);
}

.timeline-item--reverse .timeline-card__step {
  right: auto;
  left: 1.1rem;
}

.timeline-card__label {
  position: relative;
  margin: 0 0 0.75rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--timeline-melon);
}

.timeline-card h3 {
  position: relative;
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.25rem, 4vw, 3.7rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1;
  color: var(--timeline-blue);
}

.timeline-card__venue {
  position: relative;
  margin: 0.8rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.09em;
  color: var(--timeline-bistre);
}

.timeline-card__description {
  position: relative;
  margin: 1.3rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.88rem;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(38, 50, 58, 0.72);
}

.timeline-card__note {
  position: relative;
  display: inline-block;
  margin-top: 1.3rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(40, 77, 103, 0.13);
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-style: italic;
  color: var(--timeline-pomegranate);
}

.timeline-footer {
  width: min(100%, 720px);
  margin: clamp(5rem, 10vw, 8rem) auto 0;
  text-align: center;
}

.timeline-footer__ornament {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.timeline-footer__ornament span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(120, 97, 75, 0.38);
}

.timeline-footer__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid var(--timeline-melon);
  transform: rotate(45deg);
}

.timeline-footer__script {
  margin: 1.2rem 0 0;
  font-family: 'Allura', cursive;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  color: var(--timeline-blue);
}

.timeline-footer__note {
  margin: 0.5rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.76rem;
  font-weight: 300;
  letter-spacing: 0.08em;
  color: rgba(38, 50, 58, 0.58);
}

@media (max-width: 860px) {
  .timeline__spine {
    left: 1.8rem;
    transform: none;
  }

  .timeline-item,
  .timeline-item--reverse {
    grid-template-columns: 72px minmax(0, 1fr);
    min-height: auto;
    margin-bottom: 3.5rem;
  }

  .timeline-item__marker,
  .timeline-item--reverse .timeline-item__marker {
    grid-column: 1;
    grid-row: 1;
    width: 48px;
    height: 48px;
  }

  .timeline-item__time,
  .timeline-item--reverse .timeline-item__time {
    grid-column: 2;
    grid-row: 1;
    justify-self: start;
    align-self: start;
    padding: 0;
    margin-bottom: 1rem;
  }

  .timeline-item__time span {
    font-size: 2.2rem;
  }

  .timeline-card,
  .timeline-item--reverse .timeline-card {
    grid-column: 2;
    grid-row: 1;
    justify-self: stretch;
    width: 100%;
    margin-top: 3.5rem;
    text-align: left;
  }

  .timeline-card::before,
  .timeline-item--reverse .timeline-card::before {
    top: 1.2rem;
    left: -9px;
    right: auto;
    border: 0;
    border-left: 1px solid rgba(40, 77, 103, 0.12);
    border-bottom: 1px solid rgba(40, 77, 103, 0.12);
  }

  .timeline-card__step,
  .timeline-item--reverse .timeline-card__step {
    right: 1rem;
    left: auto;
  }
}

@media (max-width: 520px) {
  .timeline-section {
    padding-inline: 1rem;
  }

  .timeline__spine {
    left: 1.25rem;
  }

  .timeline-item,
  .timeline-item--reverse {
    grid-template-columns: 52px minmax(0, 1fr);
  }

  .timeline-item__marker,
  .timeline-item--reverse .timeline-item__marker {
    width: 42px;
    height: 42px;
  }

  .timeline-item__marker :deep(svg) {
    width: 20px;
    height: 20px;
  }

  .timeline-card {
    padding: 1.45rem;
  }
}
</style>
