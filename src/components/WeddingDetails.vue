<template>
  <section id="details" ref="sectionRef" class="details-section" :class="{ 'has-reveals': revealsEnabled }" @focusin="revealFocused">
    <div class="details-section__wash" aria-hidden="true"></div>
    <header class="details-header reveal-item">
      <p class="details-header__eyebrow">Save the moment</p>
      <h2 class="section-heading">Wedding Details</h2>
      <p class="details-header__intro">
        We would be honored to celebrate this meaningful day with you.
        Here are the details for our ceremony and reception.
      </p>
    </header>

    <div class="details-grid">
      <article v-for="event in events" :key="event.type" class="event-card reveal-item">
        <div class="event-card__image">
          <img :src="event.image" :alt="event.imageAlt" loading="lazy" />
          <div class="event-card__image-overlay" aria-hidden="true"></div>

        </div>

        <div class="event-card__content">
          <p class="event-card__occasion">{{ event.type }}</p>
          <p v-if="event.date" class="event-card__date">{{ event.date }}</p>
          <h3>{{ event.venue }}</h3>
          <p class="event-card__location">{{ event.location }}</p>

          <div class="event-card__meta">
            <div class="event-card__meta-item">
              <span>Time</span>
              <strong>{{ event.time }}</strong>
            </div>
            <div class="event-card__meta-item">
              <span>Guest arrival</span>
              <strong>{{ event.arrival }}</strong>
            </div>
          </div>

          <a
  class="event-card__button"
  :href="event.mapUrl"
  target="_blank"
  rel="noopener noreferrer"
>
  <span>{{ event.button }}</span>


</a>
        </div>
      </article>
    </div>

    <div class="details-note reveal-item">
      <p class="details-note__script">A gentle reminder</p>
      <p>
        As our ceremony will begin promptly, we kindly ask our guests to arrive
        ahead of the indicated time.
      </p>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const sectionRef = ref(null)
const revealsEnabled = ref(false)
let observer
let motionQuery

const events = [
  {
    type: 'Ceremony',
    // date: 'Sunday · January 17, 2027',
    venue: 'Bell Amphitheater',
    location: 'Camp John Hay, Baguio City',
    time: '2:30 PM',
    arrival: '2:00 PM',
    note: 'Please be seated before the processional begins. The ceremony will be held in an open-air garden setting.',
    image: '/images/details/bellamp.png',
    imageAlt: 'Bell Amphitheater wedding ceremony venue',
    button: 'View Ceremony Location',
    mapUrl: 'https://maps.google.com/?q=Bell+Amphitheater+Camp+John+Hay'
  },
  {
    type: 'Reception',
    // date: 'Sunday · January 17, 2027',
    venue: 'Lafaayette Luxury Suites',
    location: 'Baguio City',
    time: '5:00 PM',
    arrival: '4:30 PM',
    note: 'Cocktails and light refreshments will be served before the reception program begins.',
    image: '/images/details/lafaayetteee.png',
    imageAlt: 'Lafaayette Luxury Suites wedding reception venue',
    button: 'Get Direction to Reception',
    mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Bell+Amphitheater+Camp+John+Hay+Baguio&destination=Lafaayette+Luxury+Suites+Baguio&travelmode=driving'
  }
]

function setupReveals() {
  observer?.disconnect()
  const elements = sectionRef.value?.querySelectorAll('.reveal-item')
  if (!elements?.length) return
  if (motionQuery.matches || !('IntersectionObserver' in window)) {
    revealsEnabled.value = false
    elements.forEach(element => element.classList.add('is-visible'))
    return
  }
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, { threshold: .16, rootMargin: '0px 0px -8% 0px' })
  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', index * 100 + 'ms')
    if (!element.classList.contains('is-visible')) observer.observe(element)
  })
  revealsEnabled.value = true
}
function revealFocused(event) {
  const item = event.target.closest('.reveal-item')
  if (!item) return
  item.classList.add('is-visible')
  observer?.unobserve(item)
}
onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  setupReveals()
  motionQuery.addEventListener('change', setupReveals)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  motionQuery?.removeEventListener('change', setupReveals)
})
</script>

<style scoped>
.details-section__wash { position: absolute; inset: -48px 0; z-index: -1; pointer-events: none; background: radial-gradient(circle at 12% 20%, rgba(239,180,159,.18), transparent 26rem), radial-gradient(circle at 90% 75%, rgba(40,77,103,.08), transparent 28rem); }
.details-section {
  isolation: isolate;
  --blue: #284d67;
  --melon: #efb49f;
  --pomegranate: #a64248;
  --ink: #24313a;
  position: relative;
  overflow: hidden;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  background: linear-gradient(180deg, #fffaf5 0%, #f8f1e9 52%, #fffaf6 100%);
  color: var(--ink);
}

.details-header {
  width: min(100%, 760px);
  margin: 0 auto clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}

.details-header__eyebrow,
.details-note__script {
  margin: 0;
  font-family: 'Allura', cursive;
  color: var(--melon);
}

.details-header__eyebrow { font-size: clamp(1.7rem, 3vw, 2.5rem); }

.details-header h2 {
  margin: 0;
  font-size: clamp(3.8rem, 8vw, 7rem);
  color: var(--blue);
}

.details-header__intro,
.event-card__note,
.details-note > p:last-child {
  font-family: 'Manrope', sans-serif;
  font-weight: 300;
  line-height: 1.9;
  color: rgba(36, 49, 58, 0.72);
}

.details-header__intro { width: min(100%, 590px); margin: 1.7rem auto 0; }

.details-grid {
  width: min(100%, 1160px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
}

.event-card {
  overflow: hidden;
  border: 1px solid rgba(40, 77, 103, 0.12);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 24px 70px rgba(65, 56, 49, 0.1);
}

.event-card__image { 
  position: relative; 
  overflow: hidden; 
  aspect-ratio: 16 / 11; 
}

.event-card__image img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  transition: transform 1s ease; 
}

.event-card:hover .event-card__image img { 
  transform: scale(1.04); 
}

.event-card__image-overlay { 
  position: absolute; 
  inset: 0; 
  background: linear-gradient(to top, rgba(15,30,40,.58), transparent 55%); 
}

.event-card__label { 
  position: absolute; 
  left: 1.5rem; 
  bottom: 1.25rem; 
  font-family: 'Manrope', sans-serif; 
  font-size: .68rem; 
  letter-spacing: .28em; 
  text-transform: uppercase; 
  color: #fff; 
}


.event-card__content { 
  padding: clamp(1.7rem, 4vw, 3rem); 
}

.event-card__date { 
  margin: 0 0 .8rem; 
  font-family: 'Manrope', sans-serif; 
  font-size: .7rem; 
  letter-spacing: .2em; 
  text-transform: uppercase; 
  color: var(--pomegranate); 
}

.event-card h3 {
  margin: 0; 
  font-family: 'Cormorant Garamond', serif; 
  font-size: clamp(2.4rem, 4.2vw, 4rem); 
  font-style: italic; 
  font-weight: 500; 
  color: var(--blue); 
}

.event-card__location { 
  margin: .7rem 0 0; 
  font-family: 'Manrope', sans-serif; color: rgba(36,49,58,.66); 
}

.event-card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 2rem;
  padding: 1.2rem 0;
  border-top: 1px solid rgba(40,77,103,.14);
  border-bottom: 1px solid rgba(40,77,103,.14);
}

.event-card__meta-item { display: flex; flex-direction: column; gap: .3rem; }
.event-card__meta-item + .event-card__meta-item { padding-left: 1rem; border-left: 1px solid rgba(40,77,103,.14); }
.event-card__meta-item span { font-family: 'Manrope', sans-serif; font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(36,49,58,.54); }
.event-card__meta-item strong { font-family: 'Cormorant Garamond', serif; font-size: 1.45rem; font-weight: 500; }

.event-card__button {
  display: inline-flex;
  margin-top: 1.5rem;
  padding: .85rem 1.2rem;
  border: 1px solid rgba(40,77,103,.36);
  color: var(--blue);
  text-decoration: none;
  font-family: 'Manrope', sans-serif;
  font-size: .68rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  transition: .3s ease;
}
.event-card__button:hover { color: #fff; background: var(--blue); transform: translateY(-2px); }

.details-note { width: min(100%, 720px); margin: clamp(4.5rem, 8vw, 7rem) auto 0; text-align: center; }
.details-note__script { font-size: clamp(1.8rem, 3.6vw, 2.7rem); color: var(--blue); }
.details-note > p:last-child { margin-top: .5rem; }

.reveal-item { transition: opacity .9s ease var(--reveal-delay, 0ms), transform .9s ease var(--reveal-delay, 0ms); }
.has-reveals .reveal-item:not(.is-visible) { opacity: 0; transform: translateY(24px); }
.reveal-item:focus-within { opacity: 1; transform: none; transition: none; }
.reveal-item.is-visible { opacity: 1; transform: none; }

@media (max-width: 820px) { .details-grid { grid-template-columns: 1fr; max-width: 620px; } }
@media (max-width: 480px) { .details-section { padding-inline: 1rem; } .event-card__content { padding: 1.5rem; } }
@media (prefers-reduced-motion: reduce) { .reveal-item { opacity: 1; transform: none; transition: none; } }
.details-header, .event-card, .event-card__content, .event-card__meta-item { min-width: 0; overflow-wrap: anywhere; }
.details-header__eyebrow { color: var(--pomegranate); }
.event-card__button { max-width: 100%; min-height: 44px; align-items: center; justify-content: center; text-align: center; }
.event-card__button span { min-width: 0; }
.event-card__meta-item span { color: var(--blue); font-size: .7rem; }
.event-card__button:focus-visible { outline: 2px solid var(--blue); outline-offset: 4px; }
@media (max-width: 480px) {
  .event-card__meta { grid-template-columns: minmax(0, 1fr); gap: 1rem; }
  .event-card__meta-item + .event-card__meta-item { padding: 1rem 0 0; border-left: 0; border-top: 1px solid rgba(40,77,103,.14); }
}
@media (prefers-reduced-motion: reduce) {
  .event-card:hover .event-card__image img, .event-card__button:hover { transform: none; }
  .event-card__image img, .event-card__button { transition: none; }
}

/* Paired keepsake cards, with an arched venue photograph. */
.details-grid { max-width: 1040px; gap: clamp(1.5rem,4vw,3rem); align-items: stretch; }
.event-card { padding: clamp(.8rem,2vw,1.25rem); border-radius: 180px 180px 12px 12px; border-color: rgba(120,97,75,.25); box-shadow: 0 14px 40px rgba(40,77,103,.07); display: flex; flex-direction: column; }
.event-card__image { aspect-ratio: 1.65; border-radius: 160px 160px 6px 6px; }
.event-card__image-overlay { background: linear-gradient(to top,rgba(40,77,103,.12),transparent); }
.event-card__content { text-align: center; padding: 1.5rem clamp(.5rem,2vw,1.5rem) .75rem; display: flex; flex-direction: column; flex: 1; align-items: center; }
.event-card__occasion { margin: 0 0 .9rem; color: var(--pomegranate); text-transform: uppercase; font: 500 .72rem 'Manrope',sans-serif; letter-spacing: .24em; }
.event-card__content h3 { margin: 0; }
.event-card__location { margin: .7rem 0 0; }
.event-card__meta { width: 100%; margin: 1.3rem 0; padding: 1rem 0; border-block: 1px solid rgba(120,97,75,.2); }
.event-card__button { margin-top: auto; border-radius: 40px; padding: .9rem 1.2rem; }
@media(max-width:820px) { .details-grid { max-width: 520px; } }
@media(max-width:480px) { .event-card__content { padding: 1.25rem .5rem .5rem; } }

</style>
