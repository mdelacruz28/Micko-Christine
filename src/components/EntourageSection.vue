
<template>
  <section id="entourage" ref="sectionRef" class="entourage">
    <div class="entourage__background" aria-hidden="true"></div>

    <header class="entourage__header">
      <p class="entourage__eyebrow">Together with our loved ones</p>
      <h2>Wedding Entourage</h2>
      <div class="entourage__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>
    </header>

    <div class="credits">
      <div class="credits__section">
        <h3>Parents</h3>

        <div
          v-for="item in parents"
          :key="item.role"
          class="credit-row"
        >
          <p class="credit-row__role">{{ item.role }}</p>

          <div class="credit-row__names">
            <p v-for="name in item.names" :key="name">{{ name }}</p>
          </div>
        </div>
      </div>

      <div class="credits__section">
        <h3>Principal Sponsors</h3>

        <div
          v-for="(pair, index) in principalSponsors"
          :key="index"
          class="credit-row"
        >
          <p class="credit-row__role">
            Pair {{ String(index + 1).padStart(2, '0') }}
          </p>

          <div class="credit-row__names credit-row__names--pair">
            <p>{{ pair.left }}</p>
            <p>{{ pair.right }}</p>
          </div>
        </div>
      </div>

      <div class="credits__section">
        <h3>Secondary Sponsors</h3>

        <div
          v-for="item in secondarySponsors"
          :key="item.role"
          class="credit-row"
        >
          <p class="credit-row__role">{{ item.role }}</p>

          <div class="credit-row__names credit-row__names--pair">
            <p>{{ item.left }}</p>
            <p>{{ item.right }}</p>
          </div>
        </div>
      </div>

      <div class="credits__section">
        <h3>Honor Attendants</h3>

        <div class="credit-row">
          <p class="credit-row__role">Best Man</p>
          <div class="credit-row__names">
            <p>{{ bestMan }}</p>
          </div>
        </div>

        <div class="credit-row">
          <p class="credit-row__role">Matron of Honor</p>
          <div class="credit-row__names">
            <p>{{ matronOfHonor }}</p>
          </div>
        </div>
      </div>

      <div class="credits__section">
        <h3>Wedding Bearers</h3>

        <div
          v-for="item in bearers"
          :key="item.role"
          class="credit-row"
        >
          <p class="credit-row__role">{{ item.role }}</p>

          <div class="credit-row__names">
            <p v-for="name in item.names" :key="name">{{ name }}</p>
          </div>
        </div>
      </div>
    </div>

    <footer class="entourage__footer">
      <p>With love and gratitude</p>
    </footer>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, ScrollTrigger } from '../plugins/gsap'

const sectionRef = ref(null)
let context

const parents = [
  {
    role: 'Parents of the Groom',
    names: ['Name of Father', 'Name of Mother']
  },
  {
    role: 'Parents of the Bride',
    names: ['Name of Father', 'Name of Mother']
  }
]

const principalSponsors = [
  { left: 'Sponsor Name', right: 'Sponsor Name' },
  { left: 'Sponsor Name', right: 'Sponsor Name' },
  { left: 'Sponsor Name', right: 'Sponsor Name' },
  { left: 'Sponsor Name', right: 'Sponsor Name' },
  { left: 'Sponsor Name', right: 'Sponsor Name' },
  { left: 'Sponsor Name', right: 'Sponsor Name' }
]

const secondarySponsors = [
  { role: 'Candle Sponsors', left: 'Name', right: 'Name' },
  { role: 'Veil Sponsors', left: 'Name', right: 'Name' },
  { role: 'Cord Sponsors', left: 'Name', right: 'Name' }
]

const bestMan = 'Name'
const matronOfHonor = 'Name'

const bearers = [
  { role: 'Ring Bearer', names: ['Name'] },
  { role: 'Bible Bearer', names: ['Name'] },
  { role: 'Coin Bearer', names: ['Name'] },
  { role: 'Flower Girls', names: ['Name', 'Name'] }
]

onMounted(async () => {
  await nextTick()

  context = gsap.context(() => {
    gsap.from('.entourage__header > *', {
      scrollTrigger: {
        trigger: '.entourage__header',
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

    gsap.utils.toArray('.credits__section').forEach(section => {
      const heading = section.querySelector('h3')
      const rows = section.querySelectorAll('.credit-row')

      gsap.from(heading, {
        scrollTrigger: {
          trigger: section,
          start: 'top 84%',
          once: true
        },
        opacity: 0,
        y: 20,
        duration: 0.65,
        ease: 'power3.out'
      })

      gsap.from(rows, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true
        },
        opacity: 0,
        y: 18,
        duration: 0.58,
        stagger: 0.075,
        ease: 'power3.out'
      })
    })

    gsap.from('.entourage__footer', {
      scrollTrigger: {
        trigger: '.entourage__footer',
        start: 'top 88%',
        once: true
      },
      opacity: 0,
      y: 20,
      duration: 0.75
    })
  }, sectionRef.value)

  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  context?.revert()
})
</script>

<style scoped>
.entourage {
  --credit-blue: #284d67;
  --credit-melon: #efb49f;
  --credit-pomegranate: #a64248;
  --credit-ink: #27333a;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100vh;
  padding: clamp(6rem, 10vw, 10rem) 1.25rem;
  color: var(--credit-ink);
  background: #f8f3ed;
}

.entourage__background {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 15% 10%, rgba(239, 180, 159, 0.16), transparent 24rem),
    radial-gradient(circle at 85% 90%, rgba(40, 77, 103, 0.08), transparent 26rem),
    linear-gradient(180deg, #fbf7f2, #f5eee7);
}

.entourage__header {
  width: min(100%, 760px);
  margin: 0 auto clamp(4rem, 8vw, 6.5rem);
  text-align: center;
}

.entourage__eyebrow {
  margin: 0 0 0.65rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  color: var(--credit-melon);
  transform: rotate(-3deg);
}

.entourage__header h2 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.5rem, 8vw, 6.5rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.045em;
  color: var(--credit-blue);
}

.entourage__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.entourage__ornament span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(120, 97, 75, 0.34);
}

.entourage__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid var(--credit-melon);
  transform: rotate(45deg);
}

.credits {
  width: min(100%, 760px);
  margin: 0 auto;
}

.credits__section + .credits__section {
  margin-top: clamp(4.5rem, 8vw, 7rem);
}

.credits__section h3 {
  margin: 0 0 2.2rem;
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 4vw, 3.1rem);
  font-style: italic;
  font-weight: 500;
  color: var(--credit-blue);
}

.credit-row {
  display: grid;
  grid-template-columns: minmax(150px, 0.72fr) minmax(0, 1.28fr);
  align-items: start;
  column-gap: clamp(1.5rem, 4vw, 3.5rem);
  margin-bottom: 1.15rem;
}

.credit-row__role {
  margin: 0;
  text-align: right;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.58rem, 1.2vw, 0.7rem);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  color: var(--credit-pomegranate);
}

.credit-row__names {
  min-width: 0;
}

.credit-row__names p {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.72rem, 1.45vw, 0.88rem);
  font-weight: 400;
  line-height: 1.65;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--credit-ink);
}

.credit-row__names--pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.entourage__footer {
  width: min(100%, 680px);
  margin: clamp(5rem, 9vw, 8rem) auto 0;
  text-align: center;
}

.entourage__footer p {
  margin: 0;
  font-family: 'Allura', cursive;
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--credit-blue);
}

@media (max-width: 640px) {
  .entourage {
    padding-inline: 1rem;
  }

  .credits {
    max-width: 430px;
  }

  .credit-row {
    grid-template-columns: minmax(110px, 0.78fr) minmax(0, 1.22fr);
    column-gap: 1rem;
    margin-bottom: 1.35rem;
  }

  .credit-row__names--pair {
    grid-template-columns: 1fr;
    gap: 0.1rem;
  }
}

@media (max-width: 420px) {
  .credit-row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
    text-align: center;
  }

  .credit-row__role {
    text-align: center;
  }

  .credit-row__names p {
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .credit-row {
    will-change: auto;
  }
}
</style>
