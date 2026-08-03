<template>
  <section id="gallery" ref="sectionRef" class="gallery-section">
    <div class="gallery-section__wash" aria-hidden="true"></div>

    <header class="gallery-header">
      <p class="gallery-header__eyebrow">A glimpse of us</p>
      <h2>Captured Moments</h2>
      <p class="gallery-header__intro">
        A collection of memories, quiet glances, and joyful moments that brought
        us closer to this day.
      </p>
    </header>

    <div class="gallery-grid">
      <figure
        v-for="(photo, index) in photos"
        :key="photo.src"
        class="gallery-item"
        :class="photo.className"
        @click="openLightbox(index)"
      >
        <div class="gallery-item__frame">
          <img :src="photo.src" :alt="photo.alt" loading="lazy" />
          <div class="gallery-item__overlay" aria-hidden="true"></div>

          <figcaption>
            <span class="gallery-item__number">
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <div>
              <p>{{ photo.label }}</p>
              <h3>{{ photo.caption }}</h3>
            </div>
          </figcaption>
        </div>
      </figure>
    </div>

    <div class="gallery-quote">
      <p class="gallery-quote__script">
        Every frame holds a piece of our story.
      </p>

      <div class="gallery-quote__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        ref="lightboxRef"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Wedding gallery image"
        @click.self="closeLightbox"
      >
        <button class="lightbox__close" type="button" @click="closeLightbox">
          <span></span><span></span>
        </button>

        <button
          class="lightbox__nav lightbox__nav--prev"
          type="button"
          @click="previousPhoto"
        >
          ‹
        </button>

        <figure class="lightbox__figure">
          <img :src="activePhoto.src" :alt="activePhoto.alt" />
          <figcaption>
            <p>{{ activePhoto.label }}</p>
            <h3>{{ activePhoto.caption }}</h3>
          </figcaption>
        </figure>

        <button
          class="lightbox__nav lightbox__nav--next"
          type="button"
          @click="nextPhoto"
        >
          ›
        </button>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap, ScrollTrigger } from "../plugins/gsap";

const sectionRef = ref(null);
const lightboxRef = ref(null);
const lightboxOpen = ref(false);
const activeIndex = ref(0);

let context;
let lightboxContext;

const photos = [
  {
    src: "/images/gallery/gallery-01.jpg",
    alt: "Micko and Christine sharing a quiet moment",
    label: "The Beginning",
    caption: "Where everything felt beautifully simple",
    className: "gallery-item--featured",
  },
  {
    src: "/images/gallery/gallery-02.jpg",
    alt: "Micko and Christine laughing together",
    label: "Joy",
    caption: "The kind of laughter that feels like home",
    className: "gallery-item--portrait",
  },
  {
    src: "/images/gallery/gallery-03.jpg",
    alt: "Romantic portrait of Micko and Christine",
    label: "Stillness",
    caption: "A quiet pause in the middle of everything",
    className: "gallery-item--landscape",
  },
  {
    src: "/images/gallery/gallery-04.jpg",
    alt: "Micko and Christine walking together",
    label: "Journey",
    caption: "Side by side through every season",
    className: "gallery-item--portrait",
  },
  {
    src: "/images/gallery/gallery-05.jpg",
    alt: "Close-up detail from the couple’s photoshoot",
    label: "Details",
    caption: "Little things that make the memory whole",
    className: "gallery-item--square",
  },
  {
    src: "/images/gallery/gallery-06.jpg",
    alt: "Micko and Christine outdoors in Baguio",
    label: "Adventure",
    caption: "A love that keeps moving forward",
    className: "gallery-item--landscape",
  },
  {
    src: "/images/gallery/gallery-07.jpg",
    alt: "Micko and Christine in a tender embrace",
    label: "Forever",
    caption: "The promise hidden in every embrace",
    className: "gallery-item--portrait",
  },
];

const activePhoto = computed(() => photos[activeIndex.value]);

onMounted(async () => {
  await nextTick();

  context = gsap.context(() => {
    const header = sectionRef.value.querySelector(".gallery-header");
    const items = gsap.utils.toArray(".gallery-item");
    const quote = sectionRef.value.querySelector(".gallery-quote");

    gsap.from(header.children, {
      scrollTrigger: { trigger: header, start: "top 84%", once: true },
      opacity: 0,
      y: 38,
      filter: "blur(5px)",
      duration: 0.95,
      stagger: 0.12,
    });

    items.forEach((item, index) => {
      const frame = item.querySelector(".gallery-item__frame");
      const image = item.querySelector("img");
      const caption = item.querySelector("figcaption");

      const tl = gsap.timeline({
        scrollTrigger: { trigger: item, start: "top 84%", once: true },
      });

      tl.from(item, {
        opacity: 0,
        y: 45,
        scale: 0.97,
        duration: 0.85,
        delay: (index % 3) * 0.04,
      })
        .from(
          frame,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.95,
            ease: "power4.out",
          },
          "-=0.66",
        )
        .from(
          caption,
          {
            opacity: 0,
            y: 18,
            duration: 0.55,
          },
          "-=0.35",
        );

      gsap.to(image, {
        yPercent: index % 2 === 0 ? 7 : -7,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    gsap.from(quote.children, {
      scrollTrigger: { trigger: quote, start: "top 86%", once: true },
      opacity: 0,
      y: 28,
      duration: 0.8,
      stagger: 0.12,
    });
  }, sectionRef.value);

  ScrollTrigger.refresh();
});

const openLightbox = async (index) => {
  activeIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = "hidden";
  await nextTick();

  lightboxContext = gsap.context(() => {
    gsap.from(".lightbox", { opacity: 0, duration: 0.3 });
    gsap.from(".lightbox__figure", {
      opacity: 0,
      scale: 0.92,
      y: 25,
      duration: 0.55,
      ease: "power3.out",
    });
  }, lightboxRef.value);
};

const closeLightbox = () => {
  gsap.to(lightboxRef.value, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      lightboxOpen.value = false;
      document.body.style.overflow = "";
      lightboxContext?.revert();
    },
  });
};

const previousPhoto = () => {
  activeIndex.value = (activeIndex.value - 1 + photos.length) % photos.length;
};

const nextPhoto = () => {
  activeIndex.value = (activeIndex.value + 1) % photos.length;
};

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  lightboxContext?.revert();
  context?.revert();
});
</script>

<style scoped>
.gallery-section {
  --gallery-blue: #284d67;
  --gallery-melon: #efb49f;
  --gallery-pomegranate: #a64248;
  --gallery-ink: #24313a;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  background: linear-gradient(180deg, #fffaf6, #f7efe7 48%, #fbf7f2);
  color: var(--gallery-ink);
}

.gallery-section__wash {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(
      circle at 12% 20%,
      rgba(239, 180, 159, 0.2),
      transparent 24rem
    ),
    radial-gradient(
      circle at 90% 74%,
      rgba(40, 77, 103, 0.12),
      transparent 28rem
    );
}

.gallery-header {
  width: min(100%, 780px);
  margin: 0 auto clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}

.gallery-header__eyebrow {
  margin: 0 0 0.75rem;
  font-family: "Allura", cursive;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  color: var(--gallery-melon);
  transform: rotate(-3deg);
}

.gallery-header h2 {
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(3.8rem, 8vw, 7rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.045em;
  color: var(--gallery-blue);
}

.gallery-header__intro {
  width: min(100%, 610px);
  margin: 1.7rem auto 0;
  font-family: "Manrope", sans-serif;
  font-size: clamp(0.92rem, 1.5vw, 1.05rem);
  font-weight: 300;
  line-height: 1.9;
  color: rgba(36, 49, 58, 0.72);
}

.gallery-grid {
  width: min(100%, 1180px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: 70px;
  gap: clamp(0.8rem, 2vw, 1.4rem);
}

.gallery-item {
  margin: 0;
  min-height: 0;
  cursor: pointer;
}
.gallery-item--featured {
  grid-column: span 7;
  grid-row: span 8;
}
.gallery-item--portrait {
  grid-column: span 5;
  grid-row: span 6;
}
.gallery-item--landscape {
  grid-column: span 7;
  grid-row: span 5;
}
.gallery-item--square {
  grid-column: span 5;
  grid-row: span 5;
}

.gallery-item__frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ddd5cc;
  box-shadow: 0 20px 55px rgba(57, 53, 50, 0.1);
}

.gallery-item__frame::after {
  content: "";
  position: absolute;
  inset: 0.65rem;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.gallery-item img {
  width: 100%;
  height: 112%;
  margin-top: -6%;
  display: block;
  object-fit: cover;
  will-change: transform;
  transition: scale 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-item:hover img {
  scale: 1.045;
}

.gallery-item__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to top,
    rgba(13, 26, 35, 0.68),
    rgba(13, 26, 35, 0.2) 42%,
    transparent 70%
  );
}

.gallery-item figcaption {
  position: absolute;
  left: 1.4rem;
  right: 1.4rem;
  bottom: 1.3rem;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  color: #fffaf6;
}

.gallery-item__number {
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2.2rem, 4vw, 4rem);
  font-style: italic;
  line-height: 1;
  color: rgba(255, 250, 246, 0.72);
}

.gallery-item figcaption > div {
  max-width: 74%;
  text-align: right;
}
.gallery-item figcaption p {
  margin: 0 0 0.35rem;
  font-family: "Manrope", sans-serif;
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 0.23em;
  text-transform: uppercase;
  color: var(--gallery-melon);
}

.gallery-item figcaption h3 {
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(1.4rem, 2.8vw, 2.45rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1.05;
}

.gallery-quote {
  width: min(100%, 740px);
  margin: clamp(5rem, 9vw, 8rem) auto 0;
  text-align: center;
}

.gallery-quote__script {
  margin: 0;
  font-family: "Allura", cursive;
  font-size: clamp(2.1rem, 4.7vw, 3.7rem);
  color: var(--gallery-blue);
}

.gallery-quote__ornament {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.15rem;
}

.gallery-quote__ornament span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(120, 97, 75, 0.38);
}

.gallery-quote__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid var(--gallery-melon);
  transform: rotate(45deg);
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  background: rgba(7, 18, 25, 0.94);
  padding: 2rem;
}

.lightbox__figure {
  width: min(90vw, 1050px);
  max-height: 86vh;
  margin: 0;
  text-align: center;
  color: #fffaf6;
}

.lightbox__figure img {
  max-width: 100%;
  max-height: 72vh;
  object-fit: contain;
}

.lightbox__figure figcaption p {
  margin: 1rem 0 0.25rem;
  font-family: "Manrope", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #efb49f;
}

.lightbox__figure figcaption h3 {
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-style: italic;
  font-weight: 500;
}

.lightbox__close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  cursor: pointer;
}

.lightbox__close span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20px;
  height: 1px;
  background: #fff;
}
.lightbox__close span:first-child {
  transform: translate(-50%, -50%) rotate(45deg);
}
.lightbox__close span:last-child {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 3rem;
  cursor: pointer;
}
.lightbox__nav--prev {
  left: 1.5rem;
}
.lightbox__nav--next {
  right: 1.5rem;
}

@media (max-width: 920px) {
  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: auto;
  }
  .gallery-item--featured,
  .gallery-item--portrait,
  .gallery-item--landscape,
  .gallery-item--square {
    grid-column: auto;
    grid-row: auto;
  }
  .gallery-item--featured {
    grid-column: 1 / -1;
  }
  .gallery-item__frame {
    aspect-ratio: 4 / 5;
  }
  .gallery-item--featured .gallery-item__frame,
  .gallery-item--landscape .gallery-item__frame {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 620px) {
  .gallery-section {
    padding-inline: 1rem;
  }
  .gallery-grid {
    grid-template-columns: 1fr;
  }
  .gallery-item--featured {
    grid-column: auto;
  }
  .gallery-item__frame,
  .gallery-item--featured .gallery-item__frame,
  .gallery-item--landscape .gallery-item__frame {
    aspect-ratio: 4 / 5;
  }
  .lightbox__nav {
    display: none;
  }
}
</style>
