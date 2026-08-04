
<template>
  <section id="entourage" ref="sectionRef" class="entourage-section">
    <div class="entourage-section__wash" aria-hidden="true"></div>

    <header class="entourage-header">
      <h2>Wedding Entourage</h2>

      <div class="entourage-header__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>
    </header>

    <div class="entourage-list">
      <section class="entourage-block entourage-block--parents">
        <div class="two-column-group">
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

      <section class="entourage-block">
        <h3>Primary Sponsors</h3>

        <div class="two-column-list">
          <template
            v-for="(pair, index) in primarySponsors"
            :key="`primary-${index}`"
          >
            <p>{{ pair.left }}</p>
            <p>{{ pair.right }}</p>
          </template>
        </div>
      </section>

      <section class="entourage-block">
        <h3>Secondary Sponsor</h3>

        <div class="two-column-list">
          <template
            v-for="(pair, index) in secondarySponsors"
            :key="`secondary-${index}`"
          >
            <p>{{ pair.left }}</p>
            <p>{{ pair.right }}</p>
          </template>
        </div>
      </section>

      <section class="entourage-block entourage-block--honor">
        <div class="two-column-group">
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

      <section class="entourage-block">
        <h3>Bearers</h3>

        <div class="bearers-list">
          <template
            v-for="(bearer, index) in bearers"
            :key="`bearer-${index}`"
          >
            <p>{{ bearer.name }}</p>
            <p>{{ bearer.role }}</p>
          </template>
        </div>
      </section>

      <section class="entourage-block">
        <h3>Flower Girls</h3>

        <div class="two-column-list">
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
        start: 'top 86%',
        once: true
      },
      opacity: 0,
      y: 24,
      filter: 'blur(4px)',
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    })

    gsap.utils.toArray('.entourage-block').forEach(block => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: 'top 88%',
          once: true
        },
        opacity: 0,
        y: 18,
        duration: 0.62,
        ease: 'power3.out'
      })
    })

    gsap.from('.entourage-footer', {
      scrollTrigger: {
        trigger: '.entourage-footer',
        start: 'top 90%',
        once: true
      },
      opacity: 0,
      y: 16,
      duration: 0.65
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
  --entourage-ink: #203342;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  min-height: 100vh;
  padding:
    clamp(4.5rem, 7vw, 6.5rem)
    1rem
    clamp(4rem, 7vw, 6rem);

  color: var(--entourage-ink);

  background:
    linear-gradient(
      180deg,
      #fbf7f2 0%,
      #f6efe8 52%,
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
      circle at 15% 10%,
      rgba(239, 180, 159, 0.12),
      transparent 26rem
    ),
    radial-gradient(
      circle at 85% 88%,
      rgba(40, 77, 103, 0.06),
      transparent 30rem
    );
}

.entourage-header {
  width: min(100%, 900px);
  margin: 0 auto clamp(4.2rem, 7vw, 6rem);
  text-align: center;
}

.entourage-header h2 {
  margin: 0;

  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4rem, 7vw, 6rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.92;
  letter-spacing: -0.045em;

  color: var(--entourage-blue);
}

.entourage-header__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;

  margin-top: 1rem;
}

.entourage-header__ornament span {
  width: 52px;
  height: 1px;

  background: rgba(120, 97, 75, 0.33);
}

.entourage-header__ornament i {
  width: 5px;
  height: 5px;

  border: 1px solid var(--entourage-melon);

  transform: rotate(45deg);
}

.entourage-list {
  width: min(100%, 540px);
  margin: 0 auto;

  text-align: center;
}

.entourage-block + .entourage-block {
  margin-top: clamp(2.8rem, 4.5vw, 4rem);
}

.entourage-block h3 {
  margin: 0 0 0.5rem;

  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.68rem, 0.85vw, 0.82rem);
  font-weight: 600;
  line-height: 1.3;

  color: var(--entourage-ink);
}

.entourage-block p {
  margin: 0;

  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.64rem, 0.82vw, 0.76rem);
  font-weight: 400;
  line-height: 1.55;

  color: var(--entourage-ink);
}

.two-column-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 2.2rem);
}

.two-column-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(1.5rem, 3vw, 2.2rem);
  row-gap: 0;
}

.bearers-list {
  width: min(100%, 310px);
  margin: 0 auto;

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 1.2rem;
}

.bearers-list p:nth-child(odd) {
  text-align: right;
}

.bearers-list p:nth-child(even) {
  text-align: left;
}

.entourage-footer {
  width: min(100%, 680px);
  margin: clamp(4rem, 7vw, 6rem) auto 0;

  text-align: center;
}

.entourage-footer p {
  margin: 0;

  font-family: 'Allura', cursive;
  font-size: clamp(1.9rem, 3vw, 2.7rem);

  color: var(--entourage-blue);
}

@media (max-width: 700px) {
  .entourage-section {
    padding-inline: 0.8rem;
  }

  .entourage-header {
    margin-bottom: 4rem;
  }

  .entourage-list {
    width: min(100%, 480px);
  }
}

@media (max-width: 480px) {
  .entourage-header h2 {
    font-size: clamp(3.2rem, 13vw, 4.5rem);
  }

  .entourage-list {
    width: 100%;
  }

  .two-column-group,
  .two-column-list {
    column-gap: 0.8rem;
  }

  .entourage-block h3 {
    font-size: 0.66rem;
  }

  .entourage-block p {
    font-size: 0.62rem;
  }

  .bearers-list {
    width: min(100%, 270px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .entourage-block {
    will-change: auto;
  }
}
</style>
