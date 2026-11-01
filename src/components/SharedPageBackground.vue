<script setup>
import { ref } from 'vue'
import { useGsapContext } from '../composables/useGsapContext.js'
const layerRef = ref(null)
useGsapContext(layerRef, ({ gsap, scope }) => {
  const media = gsap.matchMedia()
  media.add('(min-width: 1024px) and (hover: hover) and (pointer: fine)', () => {
    gsap.fromTo(scope.querySelector('.page-background__image'),
      { y: () => -window.innerHeight * .24 },
      { y: () => window.innerHeight * .24, ease: 'none', force3D: true,
        scrollTrigger: { id: 'depth-page', trigger: document.querySelector('.site-shell'), start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true } })
  })
  return () => media.revert()
})
</script>

<template>
  <div ref="layerRef" class="page-background" aria-hidden="true">
    <div class="page-background__image"></div>
    <div class="page-background__veil"></div>
  </div>
</template>

<style scoped>
.page-background { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; background: #163246; }
.page-background__image { position: absolute; inset: -28vh 0; background: #163246 url('/images/hero/lafayette.png') center / cover no-repeat; }
.page-background__veil { position: absolute; inset: 0; background: rgba(14, 31, 43, .08); }
@media (min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) { .page-background__image { will-change: transform; } }
</style>
