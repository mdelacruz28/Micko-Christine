<template>
  <section id="rsvp" class="rsvp-section">
    <div class="rsvp-section__background" aria-hidden="true"></div>
    <div class="rsvp-section__overlay" aria-hidden="true"></div>

    <div class="rsvp-shell">
      <header class="rsvp-header">
        <p class="rsvp-header__eyebrow">Kindly respond</p>
        <h2>RSVP</h2>
        <p class="rsvp-header__intro">
          We hope you can celebrate with us. Please confirm your attendance
          on or before the RSVP deadline.
        </p>
      </header>

      <div class="rsvp-layout">
        <aside class="rsvp-info">
          <div class="rsvp-info__date">
            <span>Reply by</span>
            <strong>October 17, 2026</strong>
          </div>

          <div class="rsvp-info__divider" aria-hidden="true">
            <span></span>
            <i></i>
            <span></span>
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
            <p class="rsvp-info__label">For guests with a +1</p>
            <h3>Companion Details</h3>
            <p>
              If only one seat is reserved for you, please answer
              “Not Applicable” in all companion fields.
            </p>
          </div>

          <div class="rsvp-info__block">
            <p class="rsvp-info__label">A gentle request</p>
            <h3>Private Celebration</h3>
            <p>
              Please keep the event details private and avoid forwarding
              the invitation link.
            </p>
          </div>
        </aside>

        <div class="rsvp-card">
          <form class="rsvp-form" @submit.prevent="openRsvpForm">
            <div class="form-section">
              <p class="form-section__label">Guest information</p>

              <label class="form-field">
                <span>Full name</span>
                <input
                  v-model="form.fullName"
                  type="text"
                  placeholder="Enter your full name"
                  autocomplete="name"
                />
              </label>

              <label class="form-field">
                <span>Email address</span>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="name@example.com"
                  autocomplete="email"
                />
              </label>
            </div>

            <div class="form-section">
              <p class="form-section__label">Will you be joining us?</p>

              <div class="attendance-options">
                <label
                  v-for="option in attendanceOptions"
                  :key="option.value"
                  class="attendance-option"
                  :class="{ 'is-selected': form.attendance === option.value }"
                >
                  <input
                    v-model="form.attendance"
                    type="radio"
                    name="attendance"
                    :value="option.value"
                  />

                  <span class="attendance-option__icon" v-html="option.icon"></span>

                  <span>
                    <strong>{{ option.title }}</strong>
                    <small>{{ option.caption }}</small>
                  </span>
                </label>
              </div>
            </div>

            <template v-if="form.attendance === 'attending'">
              <div class="form-section">
                <p class="form-section__label">Guest details</p>

                <div class="form-grid">
                  <label class="form-field">
                    <span>Number of attending guests</span>
                    <select v-model="form.guestCount">
                      <option value="1">1 guest</option>
                      <option value="2">2 guests</option>
                    </select>
                  </label>

                  <label class="form-field">
                    <span>Companion’s full name</span>
                    <input
                      v-model="form.companionName"
                      type="text"
                      placeholder="Not Applicable"
                    />
                  </label>
                </div>

                <label class="form-field">
                  <span>Food allergies or dietary restrictions</span>
                  <textarea
                    v-model="form.dietaryRestrictions"
                    rows="3"
                    placeholder="Please write None if not applicable"
                  ></textarea>
                </label>
              </div>

              <div class="form-section">
                <p class="form-section__label">Celebration preferences</p>

                <div class="preference-grid">
                  <label
                    v-for="activity in activities"
                    :key="activity.value"
                    class="preference-option"
                  >
                    <input
                      v-model="form.activities"
                      type="checkbox"
                      :value="activity.value"
                    />

                    <span>{{ activity.label }}</span>
                  </label>
                </div>
              </div>
            </template>

            <div class="form-section">
              <label class="form-field">
                <span>Message for the couple</span>
                <textarea
                  v-model="form.message"
                  rows="4"
                  placeholder="Share a short note, prayer, or wedding wish"
                ></textarea>
              </label>
            </div>

            <label class="form-consent">
              <input v-model="form.confirmed" type="checkbox" />
              <span>
                I understand that once my RSVP is submitted, changes may no
                longer be accommodated without contacting the couple directly.
              </span>
            </label>

            <button class="rsvp-submit" type="submit">
              <span>Continue to RSVP Form</span>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>

            <p class="rsvp-form__note">
              Final responses will be submitted through our official Google Form.
            </p>
          </form>
        </div>
      </div>

      <footer class="rsvp-footer">
        <p class="rsvp-footer__script">We can’t wait to celebrate with you.</p>

        <div class="rsvp-footer__ornament" aria-hidden="true">
          <span></span>
          <i></i>
          <span></span>
        </div>
      </footer>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'

const googleFormUrl = 'https://forms.google.com/your-rsvp-form-link'

const form = reactive({
  fullName: '',
  email: '',
  attendance: '',
  guestCount: '1',
  companionName: '',
  dietaryRestrictions: '',
  activities: [],
  message: '',
  confirmed: false
})

const attendanceOptions = [
  {
    value: 'attending',
    title: 'Joyfully accepts',
    caption: 'I will celebrate with you',
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
      </svg>
    `
  },
  {
    value: 'declining',
    title: 'Regretfully declines',
    caption: 'I will be celebrating from afar',
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M12 21s7-4.4 7-11A7 7 0 1 0 5 10c0 6.6 7 11 7 11Z"/>
        <path d="M9 10h6"/>
      </svg>
    `
  }
]

const activities = [
  { value: 'karaoke', label: 'I’m willing to join the karaoke' },
  { value: 'activities', label: 'I’m willing to join wedding activities' },
  { value: 'photos', label: 'I’m happy to join group photos' }
]

const openRsvpForm = () => {
  window.open(googleFormUrl, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.rsvp-section {
  --rsvp-blue: #284d67;
  --rsvp-melon: #efb49f;
  --rsvp-pomegranate: #a64248;
  --rsvp-bistre: #78614b;
  --rsvp-cream: #fffaf5;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100vh;
  padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 5rem);
  color: var(--rsvp-cream);
}

.rsvp-section__background {
  position: absolute;
  inset: 0;
  z-index: -3;
  background-image: url('/images/rsvp/rsvp-bg.jpg');
  background-size: cover;
  background-position: center;
}

.rsvp-section__overlay {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(
      135deg,
      rgba(20, 42, 57, 0.93),
      rgba(29, 55, 72, 0.82) 52%,
      rgba(74, 55, 50, 0.82)
    ),
    radial-gradient(
      circle at 85% 18%,
      rgba(239, 180, 159, 0.19),
      transparent 24rem
    );
}

.rsvp-shell {
  width: min(100%, 1180px);
  margin: 0 auto;
}

.rsvp-header {
  width: min(100%, 760px);
  margin: 0 auto clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}

.rsvp-header__eyebrow {
  margin: 0 0 0.7rem;
  font-family: 'Allura', cursive;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  color: var(--rsvp-melon);
  transform: rotate(-3deg);
}

.rsvp-header h2 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(4.5rem, 10vw, 8rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: -0.04em;
}

.rsvp-header__intro {
  width: min(100%, 590px);
  margin: 1.7rem auto 0;
  font-family: 'Manrope', sans-serif;
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
  position: sticky;
  top: 2rem;
  padding: clamp(1.7rem, 4vw, 2.8rem);
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(14, 34, 47, 0.32);
  backdrop-filter: blur(12px);
}

.rsvp-info__date {
  text-align: center;
}

.rsvp-info__date span {
  display: block;
  font-family: 'Manrope', sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--rsvp-melon);
}

.rsvp-info__date strong {
  display: block;
  margin-top: 0.55rem;
  font-family: 'Cormorant Garamond', serif;
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

.rsvp-info__label {
  margin: 0 0 0.45rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--rsvp-melon);
}

.rsvp-info__block h3 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.9rem;
  font-style: italic;
  font-weight: 500;
}

.rsvp-info__block > p:last-child {
  margin: 0.65rem 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.78rem;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255, 250, 245, 0.68);
}

.rsvp-card {
  padding: clamp(1.4rem, 4vw, 3rem);
  background: rgba(255, 250, 245, 0.96);
  color: #24313a;
  box-shadow: 0 30px 90px rgba(4, 16, 24, 0.28);
}

.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-section + .form-section {
  padding-top: 2rem;
  border-top: 1px solid rgba(40, 77, 103, 0.12);
}

.form-section__label {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--rsvp-pomegranate);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.form-field > span {
  font-family: 'Manrope', sans-serif;
  font-size: 0.76rem;
  font-weight: 500;
  color: rgba(36, 49, 58, 0.75);
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgba(40, 77, 103, 0.26);
  border-radius: 0;
  outline: none;
  padding: 0.8rem 0;
  background: transparent;
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  color: #24313a;
  transition: border-color 0.25s ease;
}

.form-field textarea {
  resize: vertical;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: var(--rsvp-pomegranate);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;
}

.attendance-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.attendance-option {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  min-height: 110px;
  padding: 1.2rem;
  border: 1px solid rgba(40, 77, 103, 0.14);
  cursor: pointer;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

.attendance-option:hover,
.attendance-option.is-selected {
  border-color: rgba(166, 66, 72, 0.46);
  background: rgba(239, 180, 159, 0.12);
  transform: translateY(-2px);
}

.attendance-option input,
.preference-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.attendance-option__icon {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(40, 77, 103, 0.18);
  border-radius: 50%;
  color: var(--rsvp-pomegranate);
}

.attendance-option__icon :deep(svg) {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.35;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.attendance-option strong {
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-style: italic;
  font-weight: 500;
  color: var(--rsvp-blue);
}

.attendance-option small {
  display: block;
  margin-top: 0.2rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.67rem;
  line-height: 1.5;
  color: rgba(36, 49, 58, 0.58);
}

.preference-grid {
  display: grid;
  gap: 0.75rem;
}

.preference-option {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.9rem 1rem 0.9rem 2.8rem;
  border: 1px solid rgba(40, 77, 103, 0.13);
  font-family: 'Manrope', sans-serif;
  font-size: 0.78rem;
  cursor: pointer;
}

.preference-option::before {
  content: '';
  position: absolute;
  left: 1rem;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(40, 77, 103, 0.4);
}

.preference-option:has(input:checked)::before {
  border-color: var(--rsvp-pomegranate);
  background: var(--rsvp-pomegranate);
  box-shadow: inset 0 0 0 3px #fffaf5;
}

.form-consent {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.7rem;
  line-height: 1.6;
  color: rgba(36, 49, 58, 0.63);
}

.form-consent input {
  margin-top: 0.22rem;
  accent-color: var(--rsvp-pomegranate);
}

.rsvp-submit {
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  border: 0;
  padding: 1rem 1.5rem;
  background: var(--rsvp-pomegranate);
  color: #fffaf5;
  font-family: 'Manrope', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.25s ease,
    transform 0.25s ease;
}

.rsvp-submit:hover {
  background: #b94b51;
  transform: translateY(-2px);
}

.rsvp-submit svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.rsvp-form__note {
  margin: -1rem 0 0;
  text-align: center;
  font-family: 'Manrope', sans-serif;
  font-size: 0.66rem;
  color: rgba(36, 49, 58, 0.5);
}

.rsvp-footer {
  margin-top: clamp(4.5rem, 8vw, 7rem);
  text-align: center;
}

.rsvp-footer__script {
  margin: 0 0 1.1rem;
  font-family: 'Allura', cursive;
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

  .rsvp-info {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }

  .rsvp-info__date,
  .rsvp-info__divider {
    grid-column: 1 / -1;
  }

  .rsvp-info__block + .rsvp-info__block {
    margin-top: 0;
    padding-top: 0;
    border-top: 0;
  }
}

@media (max-width: 620px) {
  .rsvp-section {
    padding-inline: 1rem;
  }

  .rsvp-info,
  .attendance-options,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .rsvp-info__block + .rsvp-info__block {
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .rsvp-card {
    padding: 1.3rem;
  }
}
</style>
