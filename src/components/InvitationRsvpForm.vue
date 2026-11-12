<script setup>
import { nextTick, ref, watch } from 'vue';
const props = defineProps({ flow: { type: Object, required: true } });
const { stage, lookupName, busy, error, invitation, revision, deadlineLabel, canSubmit, conflict, receipt, pending, form, frozen, startLookup, submit, reset } = props.flow;
const focusTarget = ref(null);
watch([stage, error], async () => {
  await nextTick();
  if (error.value) document.getElementById('rsvp-error')?.focus();
  else focusTarget.value?.focus();
});
const activities = [
  { value: 'dance', label: 'Dance' },
  { value: 'karaoke', label: 'Karaoke' },
  { value: 'games', label: 'Games' },
  { value: 'photos', label: 'Group Photos' }
];
const options = [
  { value: 'accept', title: 'Joyfully Accepts', caption: 'I will celebrate with you' },
  { value: 'decline', title: 'Regretfully Declines', caption: 'I will be celebrating from afar' }
];
</script>

<template>
  <div class="invitation-rsvp" :aria-busy="busy">
    <p v-if="error" id="rsvp-error" class="rsvp-alert" role="alert" tabindex="-1">{{ error }}</p>
    <p v-if="busy" class="rsvp-status" role="status">Please wait…</p>

    <form v-if="stage === 'lookup'" class="rsvp-form" @submit.prevent="startLookup">
      <div class="form-section">
        <p class="form-section__label">Find your invitation</p>
        <p class="rsvp-help">Please enter your complete first and last name.</p>
        <label class="form-field">
          <span>Full Name (First Name and Last Name)</span>
          <input ref="focusTarget" v-model="lookupName" name="lookup-name" type="text" autocomplete="name" maxlength="120" required :disabled="busy" />
        </label>
      </div>
      <button class="rsvp-submit" type="submit" :disabled="busy">Mag-RSVP sa imbitasyon</button>
    </form>

    <div v-else-if="stage === 'recorded'" class="rsvp-form">
 <p ref="focusTarget" tabindex="-1" role="status">Your RSVP has already been recorded. If you wish to change your response, please contact the couple directly.</p>
 <button class="rsvp-secondary" type="button" @click="reset">Finish and clear invitation details</button>
 </div>
    <div v-else-if="stage === 'receipt'" class="rsvp-form">
      <h3 ref="focusTarget" class="rsvp-verified-title" tabindex="-1">Your RSVP has been saved</h3>
      <div v-if="form.attendance === 'accept'" class="rsvp-thank-you" role="status">
        <p>Thank you so much for your RSVP!</p>
        <p>We are truly grateful that you're taking the time to celebrate this special day with us. Your presence means the world to us, and we can't wait to celebrate this unforgettable milestone together.</p>
        <p>As a small favor, we kindly ask that you keep the details of our wedding (such as the venue, schedule, and other event information) private and refrain from sharing them publicly. This helps us preserve the intimacy and security of our celebration.</p>
        <p>Thank you for your understanding, love, and support. See you on our special day!</p>
        <p>With love,<br />Micko &amp; Christine 🩵</p>
      </div>
      <div v-else class="rsvp-thank-you" role="status">
        <p>We are saddened to know that you won't be able to celebrate this special day with us.</p>
        <p>Thank you for taking the time to respond. We truly appreciate your thoughtfulness and wish you all the best.</p>
        <p>With love,<br />Micko &amp; Christine 🩵</p>
      </div>
      <dl class="rsvp-receipt">
        <dt>Response</dt><dd>{{ form.attendance === 'accept' ? 'Joyfully Accepts' : 'Regretfully Declines' }}</dd>
        <dt>Attending</dt><dd>{{ form.attending_count }}</dd>
      </dl>
      <ul v-if="form.attendee_names.length" class="rsvp-names"><li v-for="(name, i) in form.attendee_names" :key="i">{{ name }}</li></ul>
      <button class="rsvp-secondary" type="button" :disabled="busy" @click="reset">Finish and clear invitation details</button>
    </div>

    <form v-else class="rsvp-form rsvp-form--invitation" @submit.prevent="submit">
      <header class="rsvp-verified">
        <div class="rsvp-verified__topline">
          <p class="form-section__label">Your invitation</p>
          <span class="rsvp-verified__badge"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3.2 3.2L15 6.5" /></svg>Invitation found</span>
        </div>
        <div class="rsvp-verified__crest" aria-hidden="true"><svg viewBox="0 0 32 32"><rect x="5" y="9" width="22" height="15" rx="2"/><path d="m6 10 10 8 10-8M6 23l7-7m13 7-7-7"/></svg></div>
        <p class="rsvp-verified__welcome">We saved a seat for you.</p>
        <h3 ref="focusTarget" class="rsvp-verified-title" tabindex="-1">{{ invitation.group_label }}</h3>
        <div class="rsvp-verified__ornament" aria-hidden="true"><span></span><i></i><span></span></div>
        <p class="rsvp-verified__seat">Reserved Seats: 1</p>
        <p class="rsvp-verified__note">An intimate celebration, made more special with you.</p>
      </header>

      <p v-if="!canSubmit" class="rsvp-alert" role="status">Submissions are currently closed. Please contact the couple directly.</p>
      <p v-if="pending" class="rsvp-help">Your submission is awaiting confirmation. Retry the same submission to confirm it safely.</p>

      <fieldset :disabled="frozen" class="rsvp-fields">
        <div class="form-section attendance-section">
          <p id="rsvp-attendance-label" class="form-section__label">Will you be joining us?</p>
          <div class="attendance-options" role="radiogroup" aria-labelledby="rsvp-attendance-label">
            <label v-for="option in options" :key="option.value" class="attendance-option" :class="{ 'is-selected': form.attendance === option.value }">
              <input v-model="form.attendance" type="radio" name="attendance" :value="option.value" required />
              <span class="attendance-option__choice" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 10 3.2 3.2L15 6.5" /></svg></span>
              <span class="attendance-option__copy"><strong>{{ option.title }}</strong><small>{{ option.caption }}</small></span>
            </label>
          </div>
        </div>

        <div v-if="form.attendance === 'accept'" class="rsvp-conditional" key="accept">
          <div class="form-section">
            <label class="form-field"><span>Contact number (required)</span><input v-model="form.mobile" name="mobile" type="tel" inputmode="numeric" autocomplete="tel-national" pattern="[0-9]{11}" minlength="11" maxlength="11" required aria-describedby="rsvp-mobile-help" @input="form.mobile = $event.target.value = $event.target.value.replace(/[^0-9]/g, '')" /></label>
            <p id="rsvp-mobile-help" class="rsvp-help">Please enter your 11-digit mobile number using numbers only.</p>
          </div>
          <div class="form-section">
            <p class="form-section__label">Meal preference</p>
            <label class="form-field"><span>Food allergies or dietary restrictions (optional)</span><textarea v-model="form.dietary_notes" name="dietary-notes" rows="3" maxlength="1000"></textarea></label>
          </div>
          <div class="form-section">
            <p id="rsvp-activities-label" class="form-section__label">Celebration preferences (optional)</p>
            <div class="preference-grid" role="group" aria-labelledby="rsvp-activities-label">
              <label v-for="activity in activities" :key="activity.value" class="preference-option"><input v-model="form.activities" type="checkbox" :value="activity.value" name="activities" /><span>{{ activity.label }}</span></label>
            </div>
          </div>
          <div class="form-section">
            <p class="form-section__label">A little note for us</p>
            <label class="form-field"><span>Any special requests or concerns? (optional)</span><textarea v-model="form.special_requests" name="special-requests" rows="3" maxlength="500" aria-describedby="rsvp-request-help"></textarea></label>
            <p id="rsvp-request-help" class="rsvp-help">For example: accommodation, transportation, or other arrangements.</p>
            <label class="form-field"><span>Leave a message for the couple (optional)</span><textarea v-model="form.message" name="message" rows="4" maxlength="1000"></textarea></label>
          </div>
        </div>
        <div v-else-if="form.attendance === 'decline'" class="form-section rsvp-conditional" key="decline">
          <label class="form-field"><span>A little note for us (optional)</span><textarea v-model="form.decline_note" name="decline-note" rows="4" maxlength="1000"></textarea></label>
        </div>
      </fieldset>
      <div v-if="form.attendance" class="rsvp-help rsvp-final-note">
        <template v-if="form.attendance === 'decline'"><strong>Final confirmation</strong><p>Please note that once you submit your RSVP, your response will be considered final and can no longer be changed, as we are implementing a strict RSVP policy to help us finalize our guest list and wedding arrangements.</p></template>
        <p v-else>Please review your response. Your first successful response is final. Contact the couple directly for changes.</p>
      </div>
      <button v-if="form.attendance && canSubmit && !conflict" class="rsvp-submit" type="submit" :disabled="busy">{{ pending ? 'Retry same submission' : 'Submit RSVP' }}</button>
      <button class="rsvp-secondary" type="button" :disabled="busy" @click="reset">Clear invitation details</button>
    </form>
  </div>
</template>

<style scoped>
.invitation-rsvp { min-width: 0; overflow-wrap: anywhere; font-family: Manrope, sans-serif; font-size: .9rem; line-height: 1.8; }
.rsvp-fields { display: flex; flex-direction: column; gap: 2.2rem; border: 0; margin: 0; padding: 0; min-width: 0; }
.rsvp-help, .rsvp-status { font-size: .875rem; line-height: 1.8; margin: 0; color: #51616c; }
.rsvp-alert { border-left: 3px solid #a64248; background: #f8e8df; color: #6c2831; padding: 1rem; font-size: .85rem; line-height: 1.7; }
.rsvp-verified-title { margin: .75rem 0; font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 5vw, 2.8rem); color: #284d67; }
.rsvp-secondary { min-height: 48px; padding: .75rem; background: transparent; border: 1px solid #284d6755; color: #284d67; font-family: inherit; font-size: .875rem; line-height: 1.5; cursor: pointer; }
.form-field select { box-sizing: border-box; min-width: 0; width: 100%; min-height: 48px; border: 1px solid #284d6755; background: #fffaf5; padding: .6rem; color: #24313a; font: inherit; }
.form-field input, .form-field textarea { font-size: 1rem; }
button:disabled { opacity: .65; cursor: default; }
.attendance-option:focus-within, .preference-option:focus-within { outline: 2px solid #a64248; outline-offset: 4px; }
input:focus-visible, textarea:focus-visible, select:focus-visible, button:focus-visible, [tabindex]:focus-visible { outline: 2px solid #a64248; outline-offset: 4px; }
.rsvp-receipt { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .6rem 1rem; font-size: .85rem; line-height: 1.6; margin: 0; }
.rsvp-receipt dd { margin: 0; }
.rsvp-receipt dt { font-weight: 600; color: #284d67; }
.rsvp-verified > p { margin: .5rem 0 0; }
.rsvp-verified {
  position: relative;
  padding: clamp(1.25rem, 4vw, 2.25rem);
  border: 1px solid #284d6720;
  border-radius: 1.25rem;
  background: radial-gradient(ellipse at 100% 0%, #efb49f30, transparent 65%), #fffaf5b3;
  box-shadow: 0 12px 36px #284d6706;
  text-align: center;
}
.rsvp-verified__topline { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .75rem; }
.rsvp-verified__badge { display: inline-flex; align-items: center; gap: .35rem; padding: .3rem .65rem; border: 1px solid #284d6720; border-radius: 999px; font-size: .65rem; letter-spacing: .02em; line-height: 1.5; color: #284d67; background: #fffaf5b3; }
.rsvp-verified__badge svg, .attendance-option__choice svg { width: 1rem; height: 1rem; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.rsvp-verified > .rsvp-verified__welcome { margin-top: 1.65rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.3rem; color: #677580; }
.rsvp-verified .rsvp-verified-title { margin: .4rem 0 1rem; font-size: clamp(2.05rem, 4.5vw, 3rem); font-weight: 500; line-height: 1.12; letter-spacing: -.02em; overflow-wrap: anywhere; }
.rsvp-verified__ornament { display: flex; align-items: center; justify-content: center; gap: .7rem; margin: 1.15rem auto; }
.rsvp-verified__ornament span { width: 3rem; height: 1px; background: #a6424830; }
.rsvp-verified__ornament i { width: .35rem; height: .35rem; background: #a6424870; rotate: 45deg; }
.rsvp-verified > .rsvp-verified__seat { display: inline-block; margin: 0; padding: .35rem .85rem; border-radius: 999px; background: #284d670a; color: #284d67; font-size: .76rem; font-weight: 500; letter-spacing: .025em; }
.rsvp-verified > .rsvp-verified__note { margin: .85rem auto 0; max-width: 28rem; color: #677580; font-size: .78rem; line-height: 1.65; }
.rsvp-section .attendance-options { gap: .85rem; }
.rsvp-section .attendance-option { position: relative; align-items: flex-start; min-height: 120px; padding: 1.2rem 1rem; border-radius: .9rem; background: #fffaf570; gap: .65rem; }
.attendance-option__choice { flex: 0 0 1.25rem; display: grid; place-items: center; width: 1.25rem; height: 1.25rem; margin-top: .25rem; border: 1px solid #284d6750; border-radius: 50%; color: transparent; transition: background-color .2s, border-color .2s, color .2s; }
.attendance-option__copy { min-width: 0; }
.rsvp-section .attendance-option strong { font-size: clamp(1.25rem, 2vw, 1.45rem); line-height: 1.25; }
.rsvp-section .attendance-option small { margin-top: .45rem; font-size: .75rem; line-height: 1.6; }
.rsvp-section .attendance-option.is-selected { border-color: #a6424880; background: #efb49f24; box-shadow: inset 0 0 0 1px #a6424825; }
.attendance-option.is-selected .attendance-option__choice { background: #a64248; border-color: #a64248; color: #fffaf5; }
@media (max-width: 620px) {
  .rsvp-verified__topline { justify-content: center; gap: .65rem 1rem; }
  .rsvp-verified > .rsvp-verified__welcome { margin-top: 1.25rem; }
  .rsvp-section .attendance-option { min-height: 100px; padding: 1.1rem; }
}
.rsvp-status { margin-bottom: 1rem; }
.rsvp-alert { margin: 0 0 1.25rem; }
.rsvp-names { padding-left: 1.2rem; line-height: 1.8; }
@media (max-width: 620px) { .rsvp-receipt { grid-template-columns: minmax(0, 1fr); gap: .2rem; } .rsvp-receipt dd + dt { margin-top: .6rem; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; transform: none !important; } }

/* A personal invitation, with a quiet stationery finish. */
.rsvp-form--invitation .rsvp-verified {
  border: 1px solid #cdbb976b; border-radius: 5rem 5rem 1rem 1rem;
  padding: clamp(1.5rem,4vw,2.5rem) clamp(1rem,3vw,2rem);
  background: radial-gradient(ellipse at 50% 0%,#efb49f24,transparent 70%),linear-gradient(140deg,#fffcf8,#f7f0e7);
  box-shadow: 0 16px 45px #52493609;
}
.rsvp-verified::before { content: ''; position: absolute; inset: .55rem; border: 1px solid #cdbb973d; border-radius: 4.5rem 4.5rem .65rem .65rem; pointer-events: none; }
.rsvp-form--invitation .rsvp-verified__topline { position: relative; justify-content: center; flex-direction: column; gap: .6rem; }
.rsvp-form--invitation .rsvp-verified__topline .form-section__label { font-size: .62rem; letter-spacing: .3em; color: #78614b; }
.rsvp-form--invitation .rsvp-verified__badge { border: 0; background: transparent; padding: 0; color: #526950; font-size: .68rem; }
.rsvp-verified__crest { width: 48px; height: 48px; display: grid; place-items: center; margin: 1.1rem auto .5rem; border: 1px solid #cdbb9780; border-radius: 50%; color: #78614b; }
.rsvp-verified__crest svg { width: 27px; fill: none; stroke: currentColor; stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; }
.rsvp-form--invitation .rsvp-verified__welcome { margin-top: .65rem; font-size: 1.2rem; color: #786b5c; }
.rsvp-form--invitation .rsvp-verified-title { font-size: clamp(2.15rem,4.7vw,3.3rem); font-style: italic; font-weight: 500; line-height: 1.18; margin: .5rem 0 .75rem; }
.rsvp-form--invitation .rsvp-verified__seat { background: #284d6708; border: 1px solid #284d6714; padding: .4rem 1rem; font-size: .72rem; }
.rsvp-form--invitation .rsvp-verified__note { max-width: 23rem; font-size: .75rem; }
.rsvp-form--invitation .attendance-section { gap: 1rem; }
.rsvp-form--invitation .attendance-section > .form-section__label { text-align: center; font-size: .68rem; letter-spacing: .2em; }
.rsvp-form--invitation .attendance-option { border-radius: 1rem; padding: 1.25rem 1rem; background: #fffcf7; min-height: 124px; border-color: #cdbb9760; box-shadow: 0 6px 18px #284d6704; }
.rsvp-form--invitation .attendance-option strong { font-family: 'Cormorant Garamond',serif; font-weight: 500; font-style: italic; font-size: clamp(1.4rem,2vw,1.6rem); }
.rsvp-form--invitation .attendance-option.is-selected { border-color: #a6424899; background: linear-gradient(145deg,#fcf2e9,#f5e6df); box-shadow: inset 0 0 0 1px #a6424820; }
.rsvp-form--invitation .form-field input,.rsvp-form--invitation .form-field textarea { padding: .9rem 1rem; border: 1px solid #cdbb9770; border-radius: .65rem; background: #fffdf9; box-shadow: inset 0 2px 5px #78614b03; }
.rsvp-form--invitation .form-field > span { font-size: .8rem; line-height: 1.6; }
.rsvp-form--invitation .form-field input:focus-visible,.rsvp-form--invitation .form-field textarea:focus-visible { border-color: #a64248; outline-offset: 3px; }
.rsvp-form--invitation .preference-option { border-radius: .65rem; background: #fffdf970; font-size: .8rem; line-height: 1.7; }
.rsvp-form--invitation .preference-option:has(input:checked) { background: #efb49f20; border-color: #a6424855; }
.rsvp-form--invitation .rsvp-final-note { padding: 1rem 1.1rem; border-left: 2px solid #cdbb97; background: #ede6db40; font-size: .75rem; line-height: 1.8; }
.rsvp-form--invitation .rsvp-submit { border-radius: 999px; min-height: 56px; background: #527260; color: #fffaf5; box-shadow: 0 8px 22px #52726018; letter-spacing: .16em; }
.rsvp-form--invitation .rsvp-submit:hover:not(:disabled) { background: #405b4c; }
.rsvp-form--invitation .rsvp-secondary { border: 0; background: transparent; font-size: .75rem; text-decoration: underline; text-underline-offset: .3em; }
@media(max-width:620px) {
 .rsvp-form--invitation .rsvp-verified { border-radius: 3rem 3rem .8rem .8rem; }
 .rsvp-verified::before { border-radius: 2.6rem 2.6rem .5rem .5rem; }
 .rsvp-form--invitation .attendance-option { min-height: 102px; padding: 1.1rem; }
}

.rsvp-conditional { display: flex; flex-direction: column; gap: 2rem; animation: rsvp-reveal .3s ease both; }
.rsvp-thank-you p { margin: 0 0 1.2rem; line-height: 1.9; }
.rsvp-thank-you p:last-child { color: #284d67; font-family: 'Cormorant Garamond',serif; font-size: 1.4rem; }
.rsvp-final-note p { margin: 0; }
.rsvp-final-note strong { display: block; margin-bottom: .5rem; }
@keyframes rsvp-reveal { from { opacity: 0; translate: 0 8px; } to { opacity: 1; translate: 0 0; } }
@media(prefers-reduced-motion:reduce) { .rsvp-conditional { animation: none; } }
</style>
