
<template>
  <section id="entourage" ref="sectionRef" class="entourage-section">
    <div class="entourage-section__wash" aria-hidden="true"></div>

    <header class="entourage-header">
      <p class="entourage-header__eyebrow">Together with our loved ones</p>
      <h2>Wedding Entourage</h2>

      <div class="entourage-header__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>
    </header>

    <div class="entourage-credits">
      <section class="credit-group credit-group--parents">
        <div class="paired-headings">
          <div>
            <h3>Parents of the Groom</h3>
            <p>{{ parents.groom.father }}</p>
            <p>{{ parents.groom.mother }}</p>
          </div>

          <div>
            <h3>Parents of the Bride</h3>
            <p>{{ parents.bride.father }}</p>
            <p>{{ parents.bride.mother }}</p>
          </div>
        </div>
      </section>

      <section class="credit-group">
        <h3>Primary Sponsors</h3>

        <div class="name-grid">
          <template
            v-for="(pair, index) in primarySponsors"
            :key="`primary-${index}`"
          >
            <p>{{ pair.left }}</p>
            <p>{{ pair.right }}</p>
          </template>
        </div>
      </section>

      <section class="credit-group">
        <h3>Secondary Sponsor</h3>

        <div class="name-grid">
          <template
            v-for="(pair, index) in secondarySponsors"
            :key="`secondary-${index}`"
          >
            <p>{{ pair.left }}</p>
            <p>{{ pair.right }}</p>
          </template>
        </div>
      </section>

      <section class="credit-group credit-group--honor">
        <div class="paired-headings">
          <div>
            <h3>Best Man</h3>
            <p>{{ bestMan }}</p>
          </div>

          <div>
            <h3>Matron of Honor</h3>
            <p>{{ matronOfHonor }}</p>
          </div>
        </div>
      </section>

      <section class="credit-group">
        <h3>Bearers</h3>

        <div class="name-grid name-grid--roles">
          <template
            v-for="(bearer, index) in bearers"
            :key="`bearer-${index}`"
          >
            <p>{{ bearer.name }}</p>
            <p>{{ bearer.role }}</p>
          </template>
        </div>
      </section>

      <section class="credit-group">
        <h3>Flower Girls</h3>

        <div class="name-grid">
          <template
            v-for="(pair, index) in flowerGirls"
            :key="`flower-${index}`"
          >
            <p>{{ pair.left }}</p>
            <p>{{ pair.right }}</p>
          </template>
        </div>
      </section>
    </div>

    <footer class="entourage-footer">
      <p>With love and gratitude</p>
    </footer>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, ScrollTrigger } from '../plugins/gsap'

const sectionRef = ref(null)
let context

const parents = {
  groom: {
    father: 'Name of Father',
    mother: 'Name of Mother'
  },
  bride: {
    father: 'Name of Father',
    mother: 'Name of Mother'
  }
}

const primarySponsors = [
  { left: 'Name of Sponsor', right: 'Name of Sponsor' },
  { left: 'Name of Sponsor', right: 'Name of Sponsor' },
  { left: 'Name of Sponsor', right: 'Name of Sponsor' },
  { left: 'Name of Sponsor', right: 'Name of Sponsor' },
  { left: 'Name of Sponsor', right: 'Name of Sponsor' },
  { left: 'Name of Sponsor', right: 'Name of Sponsor' }
]

const secondarySponsors = [
  {
    left: 'Name of Secondary Sponsor',
    right: 'Name of Secondary Sponsor'
  }
]

const bestMan = 'Name of Best Man'
const matronOfHonor = 'Name of Matron of Honor'

const bearers = [
  { name: 'Name of Bearer', role: 'Ring Bearer' },
  { name: 'Name of Bearer', role: 'Coin Bearer' },
  { name: 'Name of Bearer', role: 'Bible Bearer' }
]

const flowerGirls = [
  {
    left: 'Name of Flower Girl',
    right: 'Name of Flower Girl'
  }
]

onMounted(async () => {
  await nextTick()

  if (!sectionRef.value) return

  context = gsap.context(() => {
    gsap.from('.entourage-header > *', {
      scrollTrigger: {
        trigger: '.entourage-header',
        start: 'top 84%',
        once: true
      },
      opacity: 0,
      y: 28,
      filter: 'blur(4px)',
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    })

    gsap.utils.toArray('.credit-group').forEach(group => {
      const headings = group.querySelectorAll('h3')
      const names = group.querySelectorAll('p')

      gsap.from(headings, {
        scrollTrigger: {
          trigger: group,
          start: 'top 86%',
          once: true
        },
        opacity: 0,
        y: 18,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out'
      })

      gsap.from(names, {
        scrollTrigger: {
          trigger: group,
          start: 'top 82%',
          once: true
        },
        opacity: 0,
        y: 14,
        duration: 0.55,
        stagger: 0.055,
        delay: 0.08,
        ease: 'power3.out'
      })
    })

    gsap.from('.entourage-footer', {
      scrollTrigger: {
        trigger: '.entourage-footer',
        start: 'top 88%',
        once: true
      },
      opacity: 0,
      y: 18,
      duration: 0.7
    })
  }, sectionRef.value)

  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  context?.revert()
})
</script>

<style scoped>
.entourage-section {
  --entourage-blue: #284d67;
  --entourage-melon: #efb49f;
  --entourage-pomegranate: #a64248;
  --entourage-ink: #27333a;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100vh;
  padding: clamp(6rem, 10vw, 10rem) 1.25rem;
  color: var(--entourage-ink);
  background:
    linear-gradient(
      180deg,
      #fbf7f2 0%,
      #f6efe8 50%,
      #fbf8f4 100%
    );
}

.entourage-section__wash {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(
      circle at 12% 15%,
      rgba(239, 180, 159, 0.15),
      transparent 24rem
    ),
    radial-gradient(
      circle at 88% 85%,
      rgba(40, 77, 103, 0.08),
      transparent 28rem
    );
}

.entourage-header {
  width: min(100%, 760px);
  margin: 0 auto clamp(4rem, 8vw, 6.5rem);
  text-align: center;
}

.entourage-header__eyebrow {
  margin: 0 0 0.65rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  color: var(--entourage-melon);
  transform: rotate(-3deg);
}

.entourage-header h2 {
  margin: 0;
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(3.6rem, 8vw, 6.6rem);
  font-style: italic;
  font-weight: bold;
  line-height: 0.95;
  letter-spacing: -0.045em;
  color: var(--entourage-blue);
}

.entourage-header__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.entourage-header__ornament span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(120, 97, 75, 0.34);
}

.entourage-header__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid var(--entourage-melon);
  transform: rotate(45deg);
}

.entourage-credits {
  width: min(100%, 680px);
  margin: 0 auto;
  text-align: center;
}

.credit-group + .credit-group {
  margin-top: clamp(2.8rem, 5vw, 4.5rem);
}

.credit-group h3 {
  margin: 0 0 0.55rem;
  font-family: 'Cormorant Garamond', cursive;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  font-weight: 700;
  line-height: 1.25;
  color: var(--entourage-ink);
}

.credit-group p {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.82rem, 1.55vw, 1rem);
  font-weight: 400;
  line-height: 1.42;
  color: var(--entourage-ink);
}

.paired-headings {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 2.5rem);
  align-items: start;
}

.name-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(1.5rem, 4vw, 2.5rem);
  row-gap: 0.08rem;
}

.name-grid--roles {
  width: min(100%, 470px);
  margin: 0 auto;
}

.entourage-footer {
  width: min(100%, 680px);
  margin: clamp(4.5rem, 8vw, 7rem) auto 0;
  text-align: center;
}

.entourage-footer p {
  margin: 0;
  font-family: 'Allura', cursive;
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--entourage-blue);
}

@media (max-width: 620px) {
  .entourage-section {
    padding-inline: 1rem;
  }

  .entourage-credits {
    width: min(100%, 470px);
  }

  .paired-headings,
  .name-grid {
    column-gap: 1rem;
  }

  .credit-group h3 {
    font-size: 1.5rem;
  }

  .credit-group p {
    font-size: 0.78rem;
  }
}

@media (max-width: 420px) {
  .entourage-credits {
    width: 100%;
  }

  .paired-headings,
  .name-grid {
    column-gap: 0.65rem;
  }

  .credit-group h3 {
    font-size: 0.72rem;
  }

  .credit-group p {
    font-size: 0.7rem;
    line-height: 1.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .credit-group {
    will-change: auto;
  }
}
</style>
