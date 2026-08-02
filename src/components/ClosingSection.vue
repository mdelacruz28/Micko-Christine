<template>
  <footer id="closing" class="closing-section">
    <div class="closing-section__background" aria-hidden="true"></div>
    <div class="closing-section__overlay" aria-hidden="true"></div>

    <div class="closing-section__frame" aria-hidden="true"></div>

    <div class="closing-content">
      <img
        class="closing-content__monogram"
        src="/images/Monogram.png"
        alt="Micko and Christine monogram"
      />

      <p class="closing-content__eyebrow">With grateful hearts</p>

      <h2>Thank you for being part of our story.</h2>

      <p class="closing-content__message">
        Your love, prayers, and presence mean more to us than words can say.
        We cannot wait to celebrate this beautiful beginning with you.
      </p>

      <div class="closing-content__names" aria-label="Micko and Christine">
        <span>Micko</span>
        <i>&amp;</i>
        <span>Christine</span>
      </div>

      <p class="closing-content__date">January 17, 2027</p>

      <div class="closing-content__ornament" aria-hidden="true">
        <span></span>
        <i></i>
        <span></span>
      </div>

      <p class="closing-content__privacy">
        Kindly keep our wedding details and invitation link private.
      </p>

      <a class="closing-content__top" href="#home">
        <span>Back to the beginning</span>

        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </a>
    </div>

    <div class="closing-footer">
      <p>Made with love for Micko &amp; Christine</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.closing-section {
  --closing-melon: #efb49f;
  --closing-cream: #fffaf5;

  position: relative;
  isolation: isolate;
  min-height: 100svh;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: clamp(5rem, 9vw, 8rem) 1.25rem 3rem;
  color: var(--closing-cream);
  text-align: center;
}

.closing-section__background {
  position: absolute;
  inset: -4%;
  z-index: -4;
  background-image: url('/images/closing/closing-bg.jpg');
  background-size: cover;
  background-position: center;
}

.closing-section__overlay {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(
      180deg,
      rgba(11, 26, 36, 0.5) 0%,
      rgba(10, 25, 35, 0.72) 56%,
      rgba(8, 20, 28, 0.9) 100%
    ),
    radial-gradient(
      circle at center,
      rgba(239, 180, 159, 0.08),
      rgba(8, 19, 27, 0.45) 72%
    );
}

.closing-section__frame {
  position: absolute;
  inset: clamp(0.75rem, 2vw, 1.5rem);
  z-index: -1;
  border: 1px solid rgba(255, 255, 255, 0.28);
  pointer-events: none;
}

.closing-section__frame::after {
  content: '';
  position: absolute;
  inset: 0.45rem;
  border: 1px solid rgba(239, 180, 159, 0.14);
}

.closing-content {
  width: min(100%, 860px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.closing-content__monogram {
  width: clamp(110px, 15vw, 180px);
  height: auto;
  object-fit: contain;
  margin-bottom: 1.7rem;
  filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.3));
}

.closing-content__eyebrow {
  margin: 0 0 0.7rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  color: var(--closing-melon);
  transform: rotate(-3deg);
}

.closing-content h2 {
  width: min(100%, 760px);
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.2rem, 7.5vw, 6.5rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.04em;
  text-wrap: balance;
}

.closing-content__message {
  width: min(100%, 610px);
  margin: 1.8rem auto 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.9rem, 1.5vw, 1.02rem);
  font-weight: 300;
  line-height: 1.9;
  color: rgba(255, 250, 245, 0.76);
}

.closing-content__names {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 1.25rem);
  margin-top: clamp(2.6rem, 6vw, 4rem);
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-style: italic;
  line-height: 1;
}

.closing-content__names span:first-child {
  transform: rotate(-6deg);
}

.closing-content__names span:last-child {
  transform: rotate(-6deg);
}

.closing-content__names i {
  font-family: 'Allura', cursive;
  font-size: 0.72em;
  font-style: normal;
  color: var(--closing-melon);
}

.closing-content__date {
  margin: 1.15rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.72rem, 1.2vw, 0.9rem);
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 250, 245, 0.82);
}

.closing-content__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 2rem;
}

.closing-content__ornament span {
  width: clamp(2rem, 7vw, 5rem);
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.closing-content__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid var(--closing-melon);
  transform: rotate(45deg);
}

.closing-content__privacy {
  margin: 1.4rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.7rem;
  font-weight: 300;
  letter-spacing: 0.08em;
  color: rgba(255, 250, 245, 0.56);
}

.closing-content__top {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 52px;
  margin-top: 2rem;
  padding: 0.9rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.32);
  color: var(--closing-cream);
  text-decoration: none;
  font-family: 'Manrope', sans-serif;
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

.closing-content__top:hover {
  color: #173246;
  background: var(--closing-cream);
  transform: translateY(-2px);
}

.closing-content__top svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.closing-footer {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
}

.closing-footer p {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.56rem;
  font-weight: 300;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 250, 245, 0.4);
}

@media (max-width: 620px) {
  .closing-section {
    padding-inline: 1rem;
  }

  .closing-content__names {
    flex-direction: column;
    gap: 0.2rem;
  }

  .closing-content__names i {
    margin: -0.15rem 0;
  }

  .closing-content__privacy {
    max-width: 280px;
    line-height: 1.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .closing-content__top {
    transition: none;
  }
}
</style>
