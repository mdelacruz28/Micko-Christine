<template>
  <section id="entourage" ref="sectionRef" class="entourage-section">
    <div class="entourage-section__wash" aria-hidden="true"></div>

    <header class="entourage-header">
      <p class="entourage-header__eyebrow">Surrounded by love</p>
      <h2>Our Entourage</h2>
      <p class="entourage-header__intro">
        The people who have guided, supported, and stood beside us
        throughout the chapters that brought us here.
      </p>
    </header>

    <div class="entourage-featured">
      <article
        v-for="person in featured"
        :key="person.role"
        class="featured-card"
      >
        <div class="featured-card__image">
          <img :src="person.image" :alt="person.name" loading="lazy" />
          <div class="featured-card__overlay" aria-hidden="true"></div>
        </div>

        <div class="featured-card__content">
          <p class="featured-card__role">{{ person.role }}</p>
          <h3>{{ person.name }}</h3>
          <p>{{ person.caption }}</p>
        </div>
      </article>
    </div>

    <section class="entourage-group entourage-group--sponsors">
      <div class="entourage-group__heading">
        <p>With honor and gratitude</p>
        <h3>Principal Sponsors</h3>
        <span>Six pairs who will stand as witnesses and guides</span>
      </div>

      <div class="sponsor-grid">
        <article
          v-for="(pair, index) in principalSponsors"
          :key="index"
          class="sponsor-pair"
        >
          <span class="sponsor-pair__number">
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <div>
            <p>{{ pair.sponsorOne }}</p>
            <span>&amp;</span>
            <p>{{ pair.sponsorTwo }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="entourage-group">
      <div class="entourage-group__heading">
        <p>Our first home</p>
        <h3>Parents of the Couple</h3>
      </div>

      <div class="family-grid">
        <article
          v-for="family in parents"
          :key="family.label"
          class="family-card"
        >
          <p class="family-card__label">{{ family.label }}</p>

          <div class="family-card__names">
            <p>{{ family.father }}</p>
            <span>&amp;</span>
            <p>{{ family.mother }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="entourage-group">
      <div class="entourage-group__heading">
        <p>Little hands, meaningful roles</p>
        <h3>Bearers &amp; Flower Girls</h3>
      </div>

      <div class="role-grid">
        <article
          v-for="member in secondaryEntourage"
          :key="member.role + member.name"
          class="role-card"
        >
          <div class="role-card__icon" v-html="member.icon" aria-hidden="true"></div>

          <p class="role-card__role">{{ member.role }}</p>
          <h4>{{ member.name }}</h4>
        </article>
      </div>
    </section>

    <footer class="entourage-footer">
      <div class="entourage-footer__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>

      <p class="entourage-footer__script">
        Thank you for walking this journey with us.
      </p>
    </footer>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, ScrollTrigger } from '../plugins/gsap'

const sectionRef = ref(null)

let context
let mediaContext

const featured = [
  {
    role: 'Best Man',
    name: 'Name of Best Man',
    caption:
      'A trusted friend who has stood beside the groom through every season.',
    image: '/images/entourage/best-man.jpg'
  },
  {
    role: 'Matron of Honor',
    name: 'Name of Matron of Honor',
    caption:
      'A cherished presence who has shared in the bride’s most meaningful moments.',
    image: '/images/entourage/matron-of-honor.jpg'
  }
]

const principalSponsors = [
  { sponsorOne: 'Sponsor Name', sponsorTwo: 'Sponsor Name' },
  { sponsorOne: 'Sponsor Name', sponsorTwo: 'Sponsor Name' },
  { sponsorOne: 'Sponsor Name', sponsorTwo: 'Sponsor Name' },
  { sponsorOne: 'Sponsor Name', sponsorTwo: 'Sponsor Name' },
  { sponsorOne: 'Sponsor Name', sponsorTwo: 'Sponsor Name' },
  { sponsorOne: 'Sponsor Name', sponsorTwo: 'Sponsor Name' }
]

const parents = [
  {
    label: 'Parents of the Groom',
    father: 'Father of the Groom',
    mother: 'Mother of the Groom'
  },
  {
    label: 'Parents of the Bride',
    father: 'Father of the Bride',
    mother: 'Mother of the Bride'
  }
]

const secondaryEntourage = [
  {
    role: 'Ring Bearer',
    name: 'Name',
    icon: `
      <svg viewBox="0 0 24 24">
        <circle cx="9" cy="12" r="5"/>
        <circle cx="15" cy="12" r="5"/>
      </svg>
    `
  },
  {
    role: 'Coin Bearer',
    name: 'Name',
    icon: `
      <svg viewBox="0 0 24 24">
        <circle cx="9" cy="12" r="4.5"/>
        <circle cx="15" cy="12" r="4.5"/>
        <path d="M12 8v8"/>
      </svg>
    `
  },
  {
    role: 'Bible Bearer',
    name: 'Name',
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/>
        <path d="M8 4v16"/>
        <path d="M11 8h4"/>
      </svg>
    `
  },
  {
    role: 'Flower Girl',
    name: 'Name',
    icon: `
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="2"/>
        <path d="M12 4c2 0 3 2 3 4-2 0-3-1-3-4Z"/>
        <path d="M20 12c0 2-2 3-4 3 0-2 1-3 4-3Z"/>
        <path d="M12 20c-2 0-3-2-3-4 2 0 3 1 3 4Z"/>
        <path d="M4 12c0-2 2-3 4-3 0 2-1 3-4 3Z"/>
      </svg>
    `
  },
  {
    role: 'Flower Girl',
    name: 'Name',
    icon: `
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="2"/>
        <path d="M12 4c2 0 3 2 3 4-2 0-3-1-3-4Z"/>
        <path d="M20 12c0 2-2 3-4 3 0-2 1-3 4-3Z"/>
        <path d="M12 20c-2 0-3-2-3-4 2 0 3 1 3 4Z"/>
        <path d="M4 12c0-2 2-3 4-3 0 2-1 3-4 3Z"/>
      </svg>
    `
  }
]

onMounted(async () => {
  await nextTick()

  if (!sectionRef.value) return

  context = gsap.context(() => {
    const header = sectionRef.value.querySelector('.entourage-header')
    const featuredCards = gsap.utils.toArray(
      sectionRef.value.querySelectorAll('.featured-card')
    )
    const groups = gsap.utils.toArray(
      sectionRef.value.querySelectorAll('.entourage-group')
    )
    const footer = sectionRef.value.querySelector('.entourage-footer')

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

    mediaContext = gsap.matchMedia()

    mediaContext.add('(min-width: 761px)', () => {
      featuredCards.forEach((card, index) => {
        const image = card.querySelector('.featured-card__image')
        const imageEl = card.querySelector('.featured-card__image img')
        const content = card.querySelector('.featured-card__content')
        const contentChildren = content.children

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
            x: index === 0 ? -42 : 42,
            duration: 0.95,
            ease: 'power3.out'
          })
          .from(
            image,
            {
              clipPath: 'inset(0 0 100% 0)',
              duration: 1,
              ease: 'power4.out'
            },
            '-=0.78'
          )
          .from(
            contentChildren,
            {
              opacity: 0,
              y: 18,
              duration: 0.55,
              stagger: 0.08
            },
            '-=0.58'
          )

        gsap.to(imageEl, {
          yPercent: index === 0 ? 7 : -7,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      })
    })

    mediaContext.add('(max-width: 760px)', () => {
      featuredCards.forEach(card => {
        const image = card.querySelector('.featured-card__image')
        const contentChildren = card.querySelector('.featured-card__content').children

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
            image,
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
      })
    })

    groups.forEach(group => {
      const heading = group.querySelector('.entourage-group__heading')
      const cards = group.querySelectorAll(
        '.sponsor-pair, .family-card, .role-card'
      )

      gsap.from(heading.children, {
        scrollTrigger: {
          trigger: heading,
          start: 'top 84%',
          once: true
        },
        opacity: 0,
        y: 30,
        filter: 'blur(4px)',
        duration: 0.8,
        stagger: 0.1
      })

      gsap.from(cards, {
        scrollTrigger: {
          trigger: cards[0] || heading,
          start: 'top 82%',
          once: true
        },
        opacity: 0,
        y: 34,
        scale: 0.96,
        duration: 0.72,
        stagger: 0.1,
        ease: 'power3.out'
      })
    })

    const roleIcons = sectionRef.value.querySelectorAll('.role-card__icon')

    gsap.from(roleIcons, {
      scrollTrigger: {
        trigger: '.role-grid',
        start: 'top 80%',
        once: true
      },
      rotate: -22,
      scale: 0.7,
      duration: 0.5,
      stagger: 0.08,
      ease: 'back.out(2)'
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
  }, sectionRef.value)

  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  mediaContext?.revert()
  context?.revert()
})
</script>

<style scoped>
.entourage-section {
  --entourage-blue: #284d67;
  --entourage-melon: #efb49f;
  --entourage-pomegranate: #a64248;
  --entourage-bistre: #78614b;
  --entourage-ink: #24313a;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  background:
    linear-gradient(
      180deg,
      #fffaf6 0%,
      #f7efe7 52%,
      #fcf8f3 100%
    );
  color: var(--entourage-ink);
}

.entourage-section__wash {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(circle at 10% 15%, rgba(239, 180, 159, 0.2), transparent 24rem),
    radial-gradient(circle at 92% 78%, rgba(40, 77, 103, 0.12), transparent 28rem);
}

.entourage-header {
  width: min(100%, 760px);
  margin: 0 auto clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}

.entourage-header__eyebrow {
  margin: 0 0 0.75rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  color: var(--entourage-melon);
  transform: rotate(-3deg);
}

.entourage-header h2 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.8rem, 8vw, 7rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.045em;
  color: var(--entourage-blue);
}

.entourage-header__intro {
  width: min(100%, 590px);
  margin: 1.7rem auto 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.92rem, 1.5vw, 1.05rem);
  font-weight: 300;
  line-height: 1.9;
  color: rgba(36, 49, 58, 0.72);
}

.entourage-featured {
  width: min(100%, 1040px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
}

.featured-card {
  overflow: hidden;
  border: 1px solid rgba(40, 77, 103, 0.12);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 70px rgba(65, 56, 49, 0.1);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;
}

.featured-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 80px rgba(65, 56, 49, 0.14);
}

.featured-card__image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: #ddd5cc;
}

.featured-card__image img {
  width: 100%;
  height: 112%;
  margin-top: -6%;
  display: block;
  object-fit: cover;
  will-change: transform;
  transition: scale 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}

.featured-card:hover .featured-card__image img {
  scale: 1.04;
}

.featured-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(14, 29, 39, 0.48),
      transparent 58%
    );
}

.featured-card__content {
  padding: clamp(1.6rem, 4vw, 2.8rem);
  text-align: center;
}

.featured-card__role {
  margin: 0 0 0.65rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--entourage-pomegranate);
}

.featured-card h3 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 4vw, 3.7rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1;
  color: var(--entourage-blue);
}

.featured-card__content > p:last-child {
  margin: 1rem auto 0;
  max-width: 390px;
  font-family: 'Manrope', sans-serif;
  font-size: 0.86rem;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(36, 49, 58, 0.68);
}

.entourage-group {
  width: min(100%, 1120px);
  margin: clamp(6rem, 10vw, 9rem) auto 0;
}

.entourage-group__heading {
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
  text-align: center;
}

.entourage-group__heading > p {
  margin: 0 0 0.55rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.45rem, 2.8vw, 2.1rem);
  color: var(--entourage-melon);
}

.entourage-group__heading h3 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.8rem, 5vw, 4.7rem);
  font-style: italic;
  font-weight: 500;
  color: var(--entourage-blue);
}

.entourage-group__heading span {
  display: block;
  margin-top: 0.75rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.78rem;
  font-weight: 300;
  letter-spacing: 0.08em;
  color: rgba(36, 49, 58, 0.58);
}

.sponsor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.sponsor-pair {
  position: relative;
  min-height: 180px;
  display: grid;
  place-items: center;
  padding: 2rem 1.4rem;
  overflow: hidden;
  border: 1px solid rgba(40, 77, 103, 0.11);
  background: rgba(255, 255, 255, 0.68);
  text-align: center;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.sponsor-pair:hover {
  transform: translateY(-4px);
  border-color: rgba(166, 66, 72, 0.2);
  box-shadow: 0 18px 38px rgba(62, 56, 51, 0.08);
}

.sponsor-pair__number {
  position: absolute;
  top: 0.5rem;
  right: 0.8rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 3.8rem;
  font-style: italic;
  line-height: 1;
  color: rgba(40, 77, 103, 0.07);
}

.sponsor-pair div {
  position: relative;
}

.sponsor-pair p {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-style: italic;
  color: var(--entourage-blue);
}

.sponsor-pair div > span {
  display: block;
  margin: 0.15rem 0;
  font-family: 'Allura', cursive;
  font-size: 1.8rem;
  color: var(--entourage-melon);
}

.family-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.2rem, 3vw, 2rem);
}

.family-card {
  padding: clamp(2rem, 5vw, 3.5rem);
  border: 1px solid rgba(40, 77, 103, 0.12);
  background: rgba(255, 255, 255, 0.66);
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.family-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 44px rgba(62, 56, 51, 0.09);
}

.family-card__label {
  margin: 0 0 1.2rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--entourage-pomegranate);
}

.family-card__names p {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 3.3vw, 2.8rem);
  font-style: italic;
  line-height: 1.1;
  color: var(--entourage-blue);
}

.family-card__names span {
  display: block;
  margin: 0.25rem 0;
  font-family: 'Allura', cursive;
  font-size: 2rem;
  color: var(--entourage-melon);
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;
}

.role-card {
  min-height: 210px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  border: 1px solid rgba(40, 77, 103, 0.11);
  background: rgba(255, 255, 255, 0.66);
  text-align: center;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.role-card:hover {
  transform: translateY(-5px);
  border-color: rgba(166, 66, 72, 0.2);
  box-shadow: 0 18px 40px rgba(62, 56, 51, 0.08);
}

.role-card__icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  margin-bottom: 1rem;
  border: 1px solid rgba(40, 77, 103, 0.18);
  border-radius: 50%;
  color: var(--entourage-pomegranate);
}

.role-card__icon :deep(svg) {
  width: 25px;
  height: 25px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.35;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.role-card__role {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--entourage-bistre);
}

.role-card h4 {
  margin: 0.75rem 0 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.65rem;
  font-style: italic;
  font-weight: 500;
  color: var(--entourage-blue);
}

.entourage-footer {
  width: min(100%, 720px);
  margin: clamp(5rem, 9vw, 8rem) auto 0;
  text-align: center;
}

.entourage-footer__ornament {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.entourage-footer__ornament span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(120, 97, 75, 0.38);
}

.entourage-footer__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid var(--entourage-melon);
  transform: rotate(45deg);
}

.entourage-footer__script {
  margin: 1.15rem 0 0;
  font-family: 'Allura', cursive;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  color: var(--entourage-blue);
}

@media (max-width: 940px) {
  .sponsor-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .role-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .entourage-featured,
  .family-grid {
    grid-template-columns: 1fr;
  }

  .entourage-featured {
    max-width: 560px;
  }

  .featured-card__image {
    aspect-ratio: 4 / 4.5;
  }
}

@media (max-width: 540px) {
  .entourage-section {
    padding-inline: 1rem;
  }

  .sponsor-grid,
  .role-grid {
    grid-template-columns: 1fr;
  }

  .sponsor-pair {
    min-height: 150px;
  }

  .role-card {
    min-height: 170px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .featured-card,
  .featured-card__image img,
  .sponsor-pair,
  .family-card,
  .role-card {
    transition: none;
  }
}
</style>
