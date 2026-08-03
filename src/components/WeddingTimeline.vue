<template>
  <section id="timeline" ref="sectionRef" class="timeline-section">
    <div class="timeline-section__wash" aria-hidden="true"></div>

    <header class="timeline-header">
      <p class="timeline-header__eyebrow">The celebration unfolds</p>
      <h2>Wedding Day Timeline</h2>
      <p class="timeline-header__intro">
        A thoughtfully planned celebration, from the first welcome
        to the final song of the evening.
      </p>
    </header>

    <div ref="timelineRef" class="timeline">
      <div class="timeline__spine" aria-hidden="true">
        <span class="timeline__progress"></span>
      </div>

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
          <span class="timeline-item__marker-ring"></span>
          <span class="timeline-item__icon" v-html="item.icon"></span>
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
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, ScrollTrigger } from '../plugins/gsap'

const sectionRef = ref(null)
const timelineRef = ref(null)

let context
let mediaContext

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
        <circle cx="9" cy="12" r="5"/>
        <circle cx="15" cy="12" r="5"/>
      </svg>
    `
  },
  {
    time: '4:00 PM',
    label: 'Interlude',
    title: 'Cocktail Hour',
    venue: 'Lafaayette Luxury Suites',
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

onMounted(async () => {
  await nextTick()

  if (!sectionRef.value || !timelineRef.value) return

  context = gsap.context(() => {
    const header = sectionRef.value.querySelector('.timeline-header')
    const footer = sectionRef.value.querySelector('.timeline-footer')
    const progress = sectionRef.value.querySelector('.timeline__progress')
    const items = gsap.utils.toArray(
      sectionRef.value.querySelectorAll('.timeline-item')
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

    gsap.fromTo(
      progress,
      {
        scaleY: 0,
        transformOrigin: 'top center'
      },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.value,
          start: 'top 68%',
          end: 'bottom 58%',
          scrub: 0.75
        }
      }
    )

    mediaContext = gsap.matchMedia()

    mediaContext.add('(min-width: 861px)', () => {
      items.forEach(item => {
        const isReverse = item.classList.contains('timeline-item--reverse')
        const time = item.querySelector('.timeline-item__time')
        const marker = item.querySelector('.timeline-item__marker')
        const icon = item.querySelector('.timeline-item__icon')
        const card = item.querySelector('.timeline-card')
        const cardChildren = card.querySelectorAll(
          '.timeline-card__label, .timeline-card h3, .timeline-card__venue, .timeline-card__description, .timeline-card__note'
        )

        const itemTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 76%',
            once: true,
            onEnter: () => item.classList.add('is-active')
          }
        })

        itemTimeline
          .from(time, {
            opacity: 0,
            x: isReverse ? 55 : -55,
            filter: 'blur(5px)',
            duration: 0.85
          })
          .from(
            marker,
            {
              opacity: 0,
              scale: 0.2,
              duration: 0.55,
              ease: 'back.out(2.1)'
            },
            '-=0.55'
          )
          .from(
            card,
            {
              opacity: 0,
              x: isReverse ? -72 : 72,
              y: 18,
              duration: 0.95,
              ease: 'power3.out'
            },
            '-=0.62'
          )
          .from(
            cardChildren,
            {
              opacity: 0,
              y: 18,
              duration: 0.55,
              stagger: 0.07
            },
            '-=0.55'
          )
          .from(
            icon,
            {
              rotate: -28,
              scale: 0.65,
              duration: 0.5,
              ease: 'back.out(2)'
            },
            '-=0.5'
          )

        ScrollTrigger.create({
          trigger: item,
          start: 'top 58%',
          end: 'bottom 42%',
          toggleClass: {
            targets: item,
            className: 'is-current'
          }
        })
      })
    })

    mediaContext.add('(max-width: 860px)', () => {
      items.forEach(item => {
        const time = item.querySelector('.timeline-item__time')
        const marker = item.querySelector('.timeline-item__marker')
        const card = item.querySelector('.timeline-card')
        const cardChildren = card.querySelectorAll(
          '.timeline-card__label, .timeline-card h3, .timeline-card__venue, .timeline-card__description, .timeline-card__note'
        )

        const itemTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
            once: true,
            onEnter: () => item.classList.add('is-active')
          }
        })

        itemTimeline
          .from(time, {
            opacity: 0,
            y: 24,
            duration: 0.7
          })
          .from(
            marker,
            {
              opacity: 0,
              scale: 0.25,
              duration: 0.5,
              ease: 'back.out(2)'
            },
            '-=0.42'
          )
          .from(
            card,
            {
              opacity: 0,
              y: 42,
              duration: 0.85
            },
            '-=0.36'
          )
          .from(
            cardChildren,
            {
              opacity: 0,
              y: 14,
              duration: 0.5,
              stagger: 0.06
            },
            '-=0.5'
          )

        ScrollTrigger.create({
          trigger: item,
          start: 'top 60%',
          end: 'bottom 45%',
          toggleClass: {
            targets: item,
            className: 'is-current'
          }
        })
      })
    })

    gsap.from(footer.children, {
      scrollTrigger: {
        trigger: footer,
        start: 'top 86%',
        once: true
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    })
  }, sectionRef.value)

  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  mediaContext?.revert()
  context?.revert()
})
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
  width: 2px;
  transform: translateX(-50%);
  background:
    linear-gradient(
      to bottom,
      transparent,
      rgba(40, 77, 103, 0.18) 5%,
      rgba(40, 77, 103, 0.18) 95%,
      transparent
    );
}

.timeline__progress {
  position: absolute;
  inset: 0;
  display: block;
  background:
    linear-gradient(
      to bottom,
      transparent,
      var(--timeline-melon) 7%,
      var(--timeline-pomegranate) 50%,
      var(--timeline-blue) 93%,
      transparent
    );
  box-shadow: 0 0 16px rgba(166, 66, 72, 0.2);
  transform-origin: top center;
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
  transition:
    color 0.35s ease,
    text-shadow 0.35s ease;
}

.timeline-item__marker {
  grid-column: 2;
  grid-row: 1;
  justify-self: center;
  position: relative;
  z-index: 3;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(40, 77, 103, 0.22);
  border-radius: 50%;
  background: rgba(255, 250, 246, 0.96);
  box-shadow:
    0 10px 30px rgba(50, 55, 58, 0.1),
    0 0 0 8px rgba(248, 242, 235, 0.95);
  color: var(--timeline-pomegranate);
  transition:
    color 0.35s ease,
    border-color 0.35s ease,
    background 0.35s ease,
    box-shadow 0.35s ease;
}

.timeline-item__marker-ring {
  position: absolute;
  inset: -7px;
  border: 1px solid transparent;
  border-radius: 50%;
  transition:
    border-color 0.35s ease,
    transform 0.35s ease;
}

.timeline-item__icon {
  display: grid;
  place-items: center;
}

.timeline-item__icon :deep(svg) {
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
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
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

.timeline-item.is-current .timeline-item__marker {
  color: #fffaf6;
  border-color: var(--timeline-pomegranate);
  background: var(--timeline-pomegranate);
  box-shadow:
    0 12px 34px rgba(166, 66, 72, 0.25),
    0 0 0 8px rgba(248, 242, 235, 0.96);
}

.timeline-item.is-current .timeline-item__marker-ring {
  border-color: rgba(166, 66, 72, 0.32);
  transform: scale(1.16);
}

.timeline-item.is-current .timeline-item__time span {
  color: var(--timeline-pomegranate);
  text-shadow: 0 8px 24px rgba(166, 66, 72, 0.15);
}

.timeline-item.is-current .timeline-card {
  border-color: rgba(166, 66, 72, 0.22);
  box-shadow: 0 30px 75px rgba(62, 56, 51, 0.13);
  transform: translateY(-4px);
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

  .timeline-item__icon :deep(svg) {
    width: 20px;
    height: 20px;
  }

  .timeline-card {
    padding: 1.45rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-item__marker,
  .timeline-item__marker-ring,
  .timeline-item__time span,
  .timeline-card {
    transition: none;
  }
}
</style>
