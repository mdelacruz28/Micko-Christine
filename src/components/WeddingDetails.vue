<template>
  <section id="details" ref="sectionRef" class="details-section">
    <header class="details-header reveal-item">
      <p class="details-header__eyebrow">Save the moment</p>
      <h2>Wedding Details</h2>
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
          <span class="event-card__label">{{ event.type }}</span>
        </div>

        <div class="event-card__content">
          <p class="event-card__date">{{ event.date }}</p>
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

          <p class="event-card__note">{{ event.note }}</p>

          <a class="event-card__button" :href="event.mapUrl" target="_blank" rel="noopener noreferrer">
            View location
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
let observer

const events = [
  {
    type: 'Ceremony',
    date: 'Sunday · January 17, 2027',
    venue: 'Bell Amphitheater',
    location: 'Camp John Hay, Baguio City',
    time: '2:30 PM',
    arrival: '2:00 PM',
    note: 'Please be seated before the processional begins. The ceremony will be held in an open-air garden setting.',
    image: '/images/details/bellamp.png',
    imageAlt: 'Bell Amphitheater wedding ceremony venue',
    mapUrl: 'https://maps.google.com/?q=Bell+Amphitheater+Camp+John+Hay'
  },
  {
    type: 'Reception',
    date: 'Sunday · January 17, 2027',
    venue: 'Lafaayette Luxury Suites',
    location: 'Baguio City',
    time: '5:00 PM',
    arrival: '4:30 PM',
    note: 'Cocktails and light refreshments will be served before the reception program begins.',
    image: '/images/details/lafaayetteee.png',
    imageAlt: 'Lafaayette Luxury Suites wedding reception venue',
    mapUrl: 'https://maps.google.com/?q=Lafaayette+Luxury+Suites+Baguio'
  }
]

onMounted(() => {
  const elements = sectionRef.value?.querySelectorAll('.reveal-item')
  if (!elements?.length) return

  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
  )

  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${index * 100}ms`)
    observer.observe(element)
  })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.details-section {
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
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.8rem, 8vw, 7rem);
  font-style: italic;
  font-weight: 500;
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

.reveal-item { opacity: 0; transform: translateY(34px); transition: opacity .9s ease var(--reveal-delay, 0ms), transform .9s ease var(--reveal-delay, 0ms); }
.reveal-item.is-visible { opacity: 1; transform: translateY(0); }

@media (max-width: 820px) { .details-grid { grid-template-columns: 1fr; max-width: 620px; } }
@media (max-width: 480px) { .details-section { padding-inline: 1rem; } .event-card__content { padding: 1.5rem; } }
@media (prefers-reduced-motion: reduce) { .reveal-item { opacity: 1; transform: none; transition: none; } }
</style>
