<template>
  <section ref="sectionRef" class="motion-demo">
    <p class="motion-demo__eyebrow">Experience Sprint 1</p>
    <h2 class="motion-demo__title">Global motion foundation</h2>

    <div class="motion-demo__cards">
      <article class="motion-demo__card">Consistent reveals</article>
      <article class="motion-demo__card">Responsive motion</article>
      <article class="motion-demo__card">Automatic cleanup</article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useGsapContext } from '../composables/useGsapContext'
import { createScrollReveal } from '../composables/useScrollReveal'

const sectionRef = ref(null)

useGsapContext(sectionRef, ({ gsap }) => {
  const media = gsap.matchMedia()

  media.add('(prefers-reduced-motion: no-preference)', () => {
    createScrollReveal('.motion-demo__eyebrow', {
      trigger: sectionRef.value,
      y: 24
    })

    createScrollReveal('.motion-demo__title', {
      trigger: sectionRef.value,
      y: 42,
      delay: 0.08
    })

    createScrollReveal('.motion-demo__card', {
      trigger: '.motion-demo__cards',
      y: 32,
      stagger: 0.14
    })
  })

  return () => media.revert()
})
</script>

<style scoped>
.motion-demo {
  min-height: 80vh;
  display: grid;
  place-content: center;
  gap: 2rem;
  padding: 4rem 1.5rem;
  text-align: center;
}

.motion-demo__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.motion-demo__card {
  padding: 2rem;
  border: 1px solid rgba(40, 77, 103, 0.15);
  background: #fffaf6;
}

@media (max-width: 720px) {
  .motion-demo__cards {
    grid-template-columns: 1fr;
  }
}
</style>
