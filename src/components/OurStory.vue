<template>
  <section id="story" ref="sectionRef" class="story-section">
    <div class="story-section__wash" aria-hidden="true"></div>

    <header class="story-header">
      <p class="story-header__eyebrow">A journey written in grace</p>
      <h2>Our Story</h2>
      <p class="story-header__intro">
        From simple beginnings to a lifetime we now choose to share,
        every chapter has led us here.
      </p>
    </header>

    <div class="story-timeline">
      <div ref="timelineLineRef" class="story-timeline__line" aria-hidden="true">
        <span class="story-timeline__progress"></span>
      </div>

      <article
        v-for="(chapter, index) in chapters"
        :key="chapter.title"
        class="story-chapter"
        :class="{ 'story-chapter--reverse': index % 2 === 1 }"
      >
        <figure class="story-chapter__media">
          <div class="story-chapter__image-frame">
            <img :src="chapter.image" :alt="chapter.alt" loading="lazy" />
          </div>
          <figcaption class="story-chapter__number">
            {{ String(index + 1).padStart(2, '0') }}
          </figcaption>
        </figure>

        <div class="story-chapter__content">
          <div class="story-chapter__marker" aria-hidden="true"></div>
          <p class="story-chapter__year">{{ chapter.year }}</p>
          <h3>{{ chapter.title }}</h3>
          <p>{{ chapter.description }}</p>
          <span class="story-chapter__accent">{{ chapter.accent }}</span>
        </div>
      </article>
    </div>

    <footer class="story-ending">
      <p class="story-ending__script">And the best is yet to come.</p>
      <div class="story-ending__ornament" aria-hidden="true">
        <span></span><i></i><span></span>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const timelineLineRef = ref(null)
let gsapContext
let mediaQueryContext

const chapters = [
  {
    year: 'The Beginning',
    title: 'When our paths first crossed',
    description: 'What began as an ordinary moment slowly became something neither of us expected—a friendship filled with laughter, comfort, and a growing sense of home.',
    accent: 'A quiet hello became the start of everything.',
    image: '/images/story/story-01.jpg',
    alt: 'Micko and Christine at the beginning of their story'
  },
  {
    year: 'The Journey',
    title: 'Growing side by side',
    description: 'Through changing seasons, long conversations, adventures, and everyday moments, we learned that love is not only found in grand gestures, but in choosing one another again and again.',
    accent: 'Together, even the ordinary became meaningful.',
    image: '/images/story/story2.png',
    alt: 'Micko and Christine sharing a meaningful moment together'
  },
  {
    year: 'The Promise',
    title: 'Choosing forever',
    description: 'With grateful hearts and faith in the life ahead, we said yes to a new chapter—one built on love, commitment, growth, and the promise to walk through every season together.',
    accent: 'This is where forever begins.',
    image: '/images/story/story3.jpg',
    alt: 'Micko and Christine celebrating their engagement'
  }
]

onMounted(async () => {
  await nextTick()
  if (!sectionRef.value) return

  gsapContext = gsap.context(() => {
    const header = sectionRef.value.querySelector('.story-header')
    const chapterElements = gsap.utils.toArray(sectionRef.value.querySelectorAll('.story-chapter'))
    const ending = sectionRef.value.querySelector('.story-ending')
    const progressLine = timelineLineRef.value?.querySelector('.story-timeline__progress')

    gsap.from(header.children, {
      scrollTrigger: { trigger: header, start: 'top 82%', once: true },
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.14,
      ease: 'power3.out'
    })

    if (progressLine) {
      gsap.fromTo(progressLine,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.story-timeline',
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 0.7
          }
        }
      )
    }

    mediaQueryContext = gsap.matchMedia()

    mediaQueryContext.add('(min-width: 861px)', () => {
      chapterElements.forEach((chapter, index) => {
        const media = chapter.querySelector('.story-chapter__media')
        const content = chapter.querySelector('.story-chapter__content')
        const marker = chapter.querySelector('.story-chapter__marker')
        const image = chapter.querySelector('.story-chapter__image-frame img')
        const isReverse = chapter.classList.contains('story-chapter--reverse')

        const tl = gsap.timeline({
          scrollTrigger: { trigger: chapter, start: 'top 76%', once: true }
        })

        tl.from(media, {
          opacity: 0,
          x: isReverse ? 80 : -80,
          duration: 1.15,
          ease: 'power3.out'
        })
          .from(content, {
            opacity: 0,
            x: isReverse ? -65 : 65,
            duration: 1.05,
            ease: 'power3.out'
          }, '-=0.78')
          .from(marker, {
            scale: 0,
            duration: 0.45,
            ease: 'back.out(2)'
          }, '-=0.55')

        gsap.to(image, {
          yPercent: index % 2 === 0 ? 7 : -7,
          ease: 'none',
          scrollTrigger: {
            trigger: chapter,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      })
    })

    mediaQueryContext.add('(max-width: 860px)', () => {
      chapterElements.forEach(chapter => {
        const media = chapter.querySelector('.story-chapter__media')
        const content = chapter.querySelector('.story-chapter__content')
        const marker = chapter.querySelector('.story-chapter__marker')

        const tl = gsap.timeline({
          scrollTrigger: { trigger: chapter, start: 'top 82%', once: true }
        })

        tl.from(media, {
          opacity: 0,
          y: 45,
          duration: 0.95,
          ease: 'power3.out'
        })
          .from(content, {
            opacity: 0,
            y: 35,
            duration: 0.9,
            ease: 'power3.out'
          }, '-=0.62')
          .from(marker, {
            scale: 0,
            duration: 0.4,
            ease: 'back.out(2)'
          }, '-=0.5')
      })
    })

    gsap.from(ending.children, {
      scrollTrigger: { trigger: ending, start: 'top 86%', once: true },
      opacity: 0,
      y: 28,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out'
    })
  }, sectionRef.value)

  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  mediaQueryContext?.revert()
  gsapContext?.revert()
})
</script>

<style scoped>
.story-section {
  --story-blue: #284d67;
  --story-melon: #efb49f;
  --story-bistre: #78614b;
  --story-ink: #24313a;
  --story-paper: #f8f3ec;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  color: var(--story-ink);
  background: linear-gradient(180deg, #f9f5ef 0%, #f5eee6 50%, #faf7f2 100%);
}
.story-section__wash {
  position: absolute;
  inset: 0;
  z-index: -2;
  opacity: .38;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% 18%, rgba(239,180,159,.28), transparent 25rem),
    radial-gradient(circle at 88% 62%, rgba(40,77,103,.15), transparent 28rem);
}
.story-header { width: min(100%,760px); margin: 0 auto clamp(5rem,9vw,8rem); text-align:center; }
.story-header__eyebrow { margin:0 0 .75rem; font-family:'Allura',cursive; font-size:clamp(1.7rem,3vw,2.5rem); color:var(--story-melon); transform:rotate(-3deg); }
.story-header h2 { margin:0; font-family:'Cormorant Garamond',serif; font-size:clamp(4rem,8vw,7rem); font-weight:500; font-style:italic; line-height:.95; letter-spacing:-.04em; color:var(--story-blue); }
.story-header__intro { width:min(100%,590px); margin:1.75rem auto 0; font-family:'Manrope',sans-serif; font-size:clamp(.92rem,1.5vw,1.05rem); font-weight:300; line-height:1.9; color:rgba(36,49,58,.75); }
.story-timeline { position:relative; width:min(100%,1180px); margin:0 auto; }
.story-timeline__line { position:absolute; top:2%; bottom:2%; left:50%; width:1px; transform:translateX(-50%); background:linear-gradient(to bottom,transparent,rgba(40,77,103,.18) 8%,rgba(40,77,103,.18) 92%,transparent); }
.story-timeline__progress { position:absolute; inset:0; display:block; background:linear-gradient(to bottom,transparent,var(--story-melon) 8%,var(--story-blue) 92%,transparent); transform-origin:top center; }
.story-chapter { position:relative; display:grid; grid-template-columns:minmax(0,1fr) minmax(260px,.8fr); align-items:center; gap:clamp(3rem,8vw,8rem); min-height:620px; margin-bottom:clamp(5rem,10vw,10rem); }
.story-chapter:last-child { margin-bottom:0; }
.story-chapter--reverse { grid-template-columns:minmax(260px,.8fr) minmax(0,1fr); }
.story-chapter--reverse .story-chapter__media { grid-column:2; }
.story-chapter--reverse .story-chapter__content { grid-column:1; grid-row:1; text-align:right; }
.story-chapter__media { position:relative; width:min(100%,580px); }
.story-chapter__image-frame { position:relative; overflow:hidden; aspect-ratio:4/5; background:#ddd4ca; box-shadow:0 28px 70px rgba(47,48,46,.16); }
.story-chapter__image-frame::after { content:''; position:absolute; inset:0; border:1px solid rgba(255,255,255,.52); margin:.75rem; pointer-events:none; }
.story-chapter__image-frame img { width:100%; height:112%; margin-top:-6%; display:block; object-fit:cover; will-change:transform; transition:scale 1.1s cubic-bezier(.22,1,.36,1); }
.story-chapter:hover .story-chapter__image-frame img { scale:1.035; }
.story-chapter__number { position:absolute; right:-1rem; bottom:-2rem; font-family:'Cormorant Garamond',serif; font-size:clamp(5rem,9vw,8rem); font-style:italic; line-height:1; color:rgba(40,77,103,.12); }
.story-chapter--reverse .story-chapter__number { right:auto; left:-1rem; }
.story-chapter__content { position:relative; max-width:470px; }
.story-chapter__marker { position:absolute; top:1.2rem; left:calc(-1 * clamp(3rem,8vw,8rem) / 2 - 6px); width:12px; height:12px; border:3px solid var(--story-paper); border-radius:50%; background:var(--story-melon); box-shadow:0 0 0 1px rgba(40,77,103,.28),0 0 18px rgba(239,180,159,.55); }
.story-chapter--reverse .story-chapter__marker { left:auto; right:calc(-1 * clamp(3rem,8vw,8rem) / 2 - 6px); }
.story-chapter__year { margin:0 0 .8rem; font-family:'Manrope',sans-serif; font-size:.68rem; font-weight:500; letter-spacing:.3em; text-transform:uppercase; color:var(--story-melon); }
.story-chapter h3 { margin:0; font-family:'Cormorant Garamond',serif; font-size:clamp(2.5rem,4.8vw,4.5rem); font-weight:500; font-style:italic; line-height:1; letter-spacing:-.025em; color:var(--story-blue); }
.story-chapter__content > p:not(.story-chapter__year) { margin:1.5rem 0 0; font-family:'Manrope',sans-serif; font-size:clamp(.9rem,1.4vw,1rem); font-weight:300; line-height:1.9; color:rgba(36,49,58,.76); }
.story-chapter__accent { display:inline-block; margin-top:1.5rem; font-family:'Allura',cursive; font-size:clamp(1.5rem,2.5vw,2rem); line-height:1.2; color:var(--story-bistre); transform:rotate(-2deg); }
.story-ending { margin-top:clamp(6rem,11vw,10rem); text-align:center; }
.story-ending__script { margin:0; font-family:'Allura',cursive; font-size:clamp(2.2rem,5vw,4rem); color:var(--story-blue); }
.story-ending__ornament { display:flex; justify-content:center; align-items:center; gap:.75rem; margin-top:1.2rem; }
.story-ending__ornament span { width:clamp(2rem,7vw,5rem); height:1px; background:rgba(120,97,75,.42); }
.story-ending__ornament i { width:6px; height:6px; border:1px solid var(--story-melon); transform:rotate(45deg); }
@media (max-width:860px) {
  .story-timeline__line { left:1rem; transform:none; }
  .story-chapter,.story-chapter--reverse { grid-template-columns:1fr; gap:2.5rem; min-height:auto; padding-left:3rem; }
  .story-chapter--reverse .story-chapter__media,.story-chapter--reverse .story-chapter__content { grid-column:auto; grid-row:auto; }
  .story-chapter--reverse .story-chapter__content { text-align:left; }
  .story-chapter__media { width:min(100%,520px); }
  .story-chapter__content { max-width:620px; }
  .story-chapter__marker,.story-chapter--reverse .story-chapter__marker { top:.9rem; left:-2.35rem; right:auto; }
  .story-chapter--reverse .story-chapter__number { left:auto; right:-1rem; }
}
@media (max-width:520px) {
  .story-section { padding-inline:1rem; }
  .story-header { margin-bottom:4rem; }
  .story-chapter,.story-chapter--reverse { padding-left:2rem; }
  .story-timeline__line { left:.35rem; }
  .story-chapter__marker,.story-chapter--reverse .story-chapter__marker { left:-2rem; }
  .story-chapter__number { right:-.25rem; bottom:-1.4rem; }
}
@media (prefers-reduced-motion: reduce) {
  .story-chapter__image-frame img { transition:none; }
}
</style>
