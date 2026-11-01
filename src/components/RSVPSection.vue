<template>
  <section id="rsvp" ref="sectionRef" class="rsvp-section">
    <div class="rsvp-section__overlay" aria-hidden="true"></div>

    <div class="rsvp-shell">
      <header class="rsvp-header">
        <p class="rsvp-header__eyebrow">Kindly respond</p>
        <h2 class="section-heading">RSVP</h2>
        <p class="rsvp-header__intro">
          We hope you can celebrate with us. Please confirm your attendance on
          or before {{ deadlineDate }}.
        </p>
      </header>

      <div class="rsvp-layout">
        <aside class="rsvp-info">
          <div class="rsvp-info__date">
            <span>Reply by</span>
            <strong><time :datetime="approvedDeadline">{{ deadlineDate }}</time></strong>
          </div>

          <div class="rsvp-info__divider" aria-hidden="true">
            <span></span><i></i><span></span>
          </div>

          <div class="rsvp-info__block">
            <p class="rsvp-info__label">Reserved seats</p>
            <h3>Invitation Only</h3>
            <p>
              Kindly refer to your invitation for the number of seats reserved
              in your name.
            </p>
          </div>

          <div class="rsvp-info__block">
            <p class="rsvp-info__label">For every invited guest</p>
            <h3>Your Seat</h3>
            <p>
              Each invited guest has one reserved seat and responds individually.
            </p>
          </div>

          <div class="rsvp-info__block">
            <p class="rsvp-info__label">A gentle request</p>
            <h3>Private Celebration</h3>
            <p>
              Please keep the event details private and avoid forwarding the
              invitation link.
            </p>
          </div>
        </aside>

        <div class="rsvp-card">
          <InvitationRsvpForm :flow="rsvp" />
        </div>
      </div>

      <footer class="rsvp-footer">
        <p class="rsvp-footer__script">We can’t wait to celebrate with you.</p>
        <div class="rsvp-footer__ornament" aria-hidden="true">
          <span></span><i></i><span></span>
        </div>
        <div class="rsvp-contact">
          <p>Questions about your RSVP? Please contact us.</p>
          <a href="tel:+639499857805"><span>Micko Dela Cruz</span><strong>09499857805</strong></a>
          <a href="tel:+639683238328"><span>Christine Ferrera</span><strong>09683238328</strong></a>
        </div>
      </footer>
    </div>
  </section>
</template>

<script setup>
import { RSVP_DEADLINE as approvedDeadline, formatDeadlineDate } from '../config/rsvp.js';
const deadlineDate = formatDeadlineDate();
import { onBeforeUnmount, ref } from 'vue';
import { useGsapContext } from '../composables/useGsapContext.js';
import InvitationRsvpForm from './InvitationRsvpForm.vue';
import { useInvitationRsvp } from '../composables/useInvitationRsvp.js';
const rsvp = useInvitationRsvp();
const sectionRef = ref(null);
useGsapContext(sectionRef, ({ gsap, scope: section }) => {
  const header = section.querySelector('.rsvp-header');
  const info = section.querySelector('.rsvp-info');
  const footer = section.querySelector('.rsvp-footer');
  gsap.from(header.children, { scrollTrigger: { trigger: header, start: 'top 84%', once: true }, opacity: 0, y: 38, filter: 'blur(5px)', duration: .95, stagger: .12 });
  gsap.from(info, { scrollTrigger: { trigger: info, start: 'top 80%', once: true }, opacity: 0, x: -55, y: 20, duration: .95 });
  gsap.from(info.children, { scrollTrigger: { trigger: info, start: 'top 78%', once: true }, opacity: 0, y: 18, duration: .6, stagger: .1, delay: .15 });
  gsap.from(footer.children, { scrollTrigger: { trigger: footer, start: 'top 86%', once: true }, opacity: 0, y: 28, duration: .8, stagger: .12 });
});
onBeforeUnmount(() => { rsvp.reset(); });
</script>

<style>
.rsvp-section {
  --rsvp-blue: #284d67;
  --rsvp-melon: #efb49f;
  --rsvp-pomegranate: #a64248;
  --rsvp-cream: #fffaf5;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100vh;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  color: var(--rsvp-cream);
}



.rsvp-section__overlay {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(20, 42, 57, 0.93),
    rgba(29, 55, 72, 0.82) 52%,
    rgba(74, 55, 50, 0.82)
  );
}

.rsvp-shell {
  width: min(100%, 1180px);
  margin: 0 auto;
  overflow-wrap: anywhere;
}
.rsvp-header {
  width: min(100%, 760px);
  margin: 0 auto clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}
.rsvp-header__eyebrow {
  margin: 0 0 0.7rem;
  font-family: "Allura", cursive;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  color: var(--rsvp-melon);
  transform: rotate(-3deg);
}
.rsvp-header h2 {
  margin: 0;
  font-size: clamp(4.5rem, 10vw, 8rem);
  }
.rsvp-header__intro {
  width: min(100%, 590px);
  margin: 1.7rem auto 0;
  font-family: "Manrope", sans-serif;
  font-size: clamp(0.92rem, 1.5vw, 1.05rem);
  font-weight: 300;
  line-height: 1.9;
  color: rgba(255, 250, 245, 0.76);
}

.rsvp-layout {
  display: grid;
  grid-template-columns: minmax(250px, 0.75fr) minmax(0, 1.45fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: start;
}
.rsvp-info {
  position: relative;
  min-width: 0;
  padding: clamp(1.7rem, 4vw, 2.8rem);
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(14, 34, 47, 0.32);
  backdrop-filter: blur(12px);
}
.rsvp-info__date {
  text-align: center;
}
.rsvp-info__date span,
.rsvp-info__label {
  font-family: "Manrope", sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--rsvp-melon);
}
.rsvp-info__date strong {
  display: block;
  margin-top: 0.55rem;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-style: italic;
  font-weight: 500;
}
.rsvp-info__divider,
.rsvp-footer__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
}
.rsvp-info__divider {
  margin: 2rem 0;
}
.rsvp-info__divider span,
.rsvp-footer__ornament span {
  width: clamp(2rem, 6vw, 4rem);
  height: 1px;
  background: rgba(255, 255, 255, 0.28);
}
.rsvp-info__divider i,
.rsvp-footer__ornament i {
  width: 6px;
  height: 6px;
  border: 1px solid var(--rsvp-melon);
  transform: rotate(45deg);
}
.rsvp-info__block + .rsvp-info__block {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.rsvp-info__block h3 {
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.9rem;
  font-style: italic;
  font-weight: 500;
}
.rsvp-info__block > p:last-child {
  margin: 0.65rem 0 0;
  font-family: "Manrope", sans-serif;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255, 250, 245, 0.85);
}

.rsvp-card {
  min-width: 0;
  padding: clamp(1.4rem, 4vw, 3rem);
  background: rgba(255, 250, 245, 0.96);
  color: #24313a;
  box-shadow: 0 30px 90px rgba(4, 16, 24, 0.28);
}
.rsvp-section .rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
}
.rsvp-section .form-section {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.rsvp-section .form-section + .form-section {
  padding-top: 2rem;
  border-top: 1px solid rgba(40, 77, 103, 0.12);
}
.rsvp-section .form-section__label {
  margin: 0;
  font-family: "Manrope", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--rsvp-pomegranate);
}
.rsvp-section .form-field {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.rsvp-section .form-field > span {
  font-family: "Manrope", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #284d67;
}
.rsvp-section .form-field input,
.rsvp-section .form-field textarea {
  box-sizing: border-box;
  min-width: 0;
  min-height: 48px;
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgba(40, 77, 103, 0.26);
  border-radius: 0;
  outline: none;
  padding: 0.8rem 0;
  background: transparent;
  font-family: "Manrope", sans-serif;
  font-size: 1rem;
  color: #24313a;
}
.rsvp-section .form-field textarea {
  resize: vertical;
}

.rsvp-section .attendance-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  opacity: 1;
  visibility: visible;
}

.rsvp-section .attendance-option {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  min-height: 110px;
  padding: 1.2rem;
  border: 1px solid rgba(40, 77, 103, 0.14);
  opacity: 1;
  visibility: visible;
  cursor: pointer;
  transition: border-color 0.25s ease, background-color 0.25s ease;
}
.rsvp-section .attendance-option:hover,
.rsvp-section .attendance-option.is-selected {
  border-color: rgba(166, 66, 72, 0.46);
  background: rgba(239, 180, 159, 0.12);
}
.rsvp-section .attendance-option input,
.rsvp-section .preference-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.rsvp-section .attendance-option__icon {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(40, 77, 103, 0.18);
  border-radius: 50%;
  color: var(--rsvp-pomegranate);
}
.rsvp-section .attendance-option__icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.35;
}
.rsvp-section .attendance-option strong {
  display: block;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.35rem;
  font-style: italic;
  font-weight: 500;
  color: var(--rsvp-blue);
}
.rsvp-section .attendance-option small {
  display: block;
  margin-top: 0.2rem;
  font-family: "Manrope", sans-serif;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #51616c;
}

.rsvp-section .preference-grid {
  display: grid;
  gap: 0.75rem;
}
.rsvp-section .preference-option {
  position: relative;
  min-height: 50px;
  display: flex;
  align-items: center;
  padding: 0.9rem 1rem 0.9rem 2.8rem;
  border: 1px solid rgba(40, 77, 103, 0.13);
  font-family: "Manrope", sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
}
.rsvp-section .preference-option::before {
  content: "";
  position: absolute;
  left: 1rem;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(40, 77, 103, 0.4);
}
.rsvp-section .preference-option:has(input:checked)::before {
  border-color: var(--rsvp-pomegranate);
  background: var(--rsvp-pomegranate);
  box-shadow: inset 0 0 0 3px #fffaf5;
}

.rsvp-section .form-consent {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-family: "Manrope", sans-serif;
  font-size: 0.7rem;
  line-height: 1.6;
  color: rgba(36, 49, 58, 0.63);
}
.rsvp-section .form-consent input {
  margin-top: 0.22rem;
  accent-color: var(--rsvp-pomegranate);
}

.rsvp-section .rsvp-submit {
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  border: 1px solid transparent;
  padding: 1rem 1.5rem;
  background: var(--rsvp-pomegranate);
  color: #fffaf5;
  font-family: "Manrope", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
}
.rsvp-section .rsvp-submit,
.rsvp-section .rsvp-secondary {
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.6;
}
.rsvp-section .rsvp-submit:hover:not(:disabled) {
  background: var(--rsvp-blue);
}
.rsvp-section .rsvp-secondary:hover:not(:disabled) {
  background: rgba(239, 180, 159, 0.18);
}
.rsvp-section .form-field input:focus-visible,
.rsvp-section .form-field textarea:focus-visible,
.rsvp-section .form-field select:focus-visible,
.rsvp-section button:focus-visible,
.rsvp-section [tabindex]:focus-visible {
  outline: 2px solid var(--rsvp-pomegranate);
  outline-offset: 4px;
}
.rsvp-section .attendance-option:has(input:disabled),
.rsvp-section .preference-option:has(input:disabled) {
  cursor: default;
}
.rsvp-section .rsvp-submit svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}
.rsvp-section .rsvp-form__note {
  margin: -1rem 0 0;
  text-align: center;
  font-family: "Manrope", sans-serif;
  font-size: 0.66rem;
  color: rgba(36, 49, 58, 0.5);
}

.rsvp-footer {
  margin-top: clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}
.rsvp-footer__script {
  margin: 0 0 1.1rem;
  font-family: "Allura", cursive;
  font-size: clamp(2.1rem, 4.7vw, 3.8rem);
  color: var(--rsvp-melon);
}

@media (max-width: 900px) {
  .rsvp-layout {
    grid-template-columns: 1fr;
  }
  .rsvp-info {
    position: relative;
    top: auto;
  }
}
@media (max-width: 620px) {
  .rsvp-section {
    padding-inline: 1rem;
  }
  .rsvp-section .attendance-options {
    grid-template-columns: 1fr;
  }
  .rsvp-card,
  .rsvp-info {
    padding: 1.25rem;
  }
  .rsvp-header h2 {
    font-size: clamp(3rem, 16vw, 6rem);
  }
}
@media (prefers-reduced-motion: reduce) {
  .rsvp-header__eyebrow {
    transform: none;
  }
  .rsvp-section .attendance-option {
    transition: none;
  }
}

.rsvp-contact { margin: 2rem auto 0; max-width: 36rem; padding-top: 1.5rem; border-top: 1px solid #efb49f55; color: #fffaf5; }
.rsvp-contact p { font-size: .85rem; line-height: 1.7; }
.rsvp-contact a { display: inline-flex; flex-direction: column; align-items: center; gap: .25rem; margin: .4rem .8rem; padding: .5rem; text-decoration: none; font-size: .8rem; }
.rsvp-contact strong { color: #efc4ad; font-weight: 500; letter-spacing: .08em; text-decoration: underline; text-underline-offset: .25em; }
.rsvp-contact a:focus-visible { outline: 2px solid #efc4ad; outline-offset: 3px; }
</style>
