import { encodeResponseMessage } from '../utils/rsvpDetails.js';
import { RSVP_DEADLINE, formatDeadline } from '../config/rsvp.js';
import { computed, reactive, ref, watch } from 'vue';
import { createRsvpApi, RsvpError } from '../services/rsvpApi.js';

import { cleanGuestName as clean, validGuestName as fullName } from '../utils/guestName.js';
const blankResponse = () => ({ attendance: '', attending_count: 1, attendee_names: [], mobile: '', dietary_notes: '', activities: [], special_requests: '', decline_note: '', message: '' });

export function validateDraft(form, seats) {
  if (!['accept', 'decline'].includes(form.attendance)) return 'Please choose Accept or Decline.';
  if (form.attendance === 'accept') {
    if (!Number.isSafeInteger(form.attending_count) || form.attending_count !== 1 || seats !== 1 || form.attendee_names.length !== form.attending_count) return 'Please choose a valid number of attending guests.';
    if (form.attendee_names.some(name => typeof name !== 'string' || !fullName(name) || name.length > 120)) return 'Please enter a full name for every attending guest.';
    const names = form.attendee_names.map(name => clean(name).toLowerCase());
    if (new Set(names).size !== names.length) return 'Please enter a different full name for each attending guest.';
  } else if (form.attending_count !== 0 || form.attendee_names.length !== 0) return 'Declined invitations cannot include attending guests.';
  if (form.attendance === 'accept' && (typeof form.mobile !== 'string' || !/^[0-9]{11}$/.test(form.mobile))) return 'Please enter your 11-digit mobile number using numbers only.';
  if (form.attendance === 'accept' && (!Array.isArray(form.activities) || form.activities.length > 4 || new Set(form.activities).size !== form.activities.length || form.activities.some(a => !['dance','karaoke','games','photos'].includes(a)))) return 'Please choose valid celebration preferences.';
  if ((form.attendance === 'accept' && (form.dietary_notes.length > 1000 || (form.special_requests || '').length > 500 || form.message.length > 1000)) || (form.attendance === 'decline' && (form.decline_note || '').length > 1000)) return 'Please shorten your dietary notes or message.';
  if (encodeResponseMessage(form).length > 2000) return 'Please shorten your notes or message so we can save all your details.';
  return '';
}

export function createRequestId(cryptoImpl = globalThis.crypto) {
  if (typeof cryptoImpl?.randomUUID === 'function') return cryptoImpl.randomUUID();
  if (typeof cryptoImpl?.getRandomValues !== 'function') throw new Error('Secure randomness unavailable');
  const bytes = cryptoImpl.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20) + '-' + hex.slice(20);
}

export function useInvitationRsvp(api = createRsvpApi(), makeRequestId = createRequestId) {
  const stage = ref('lookup');
  const lookupName = ref('');
  const busy = ref(false);
  const error = ref('');
  const invitation = ref(null);
  const revision = ref(0);
  const deadline = ref(RSVP_DEADLINE);
  const canSubmit = ref(false);
  const conflict = ref(false);
  const receipt = ref(null);
  const pending = ref(null);
  const form = reactive(blankResponse());
  // Tokens intentionally live only in this composable; never URL, storage, analytics or logs.
  let sessionToken = '';
  let generation = 0;
  const frozen = computed(() => busy.value || !!pending.value || conflict.value || !canSubmit.value);
  const deadlineLabel = computed(() => formatDeadline(deadline.value));

  watch(() => form.attendance, () => {
    form.attending_count = form.attendance === 'accept' ? 1 : 0;
    form.attendee_names = form.attendance === 'accept' ? [invitation.value?.guest_name] : [];
    error.value = '';
    if (form.attendance !== 'accept') {
      form.mobile = ''; form.dietary_notes = ''; form.activities = []; form.special_requests = ''; form.message = '';
    } else { form.decline_note = ''; }
  }, { flush: 'sync' });

  function applyView(data) {
    invitation.value = data.invitation;
    revision.value = data.revision;
    deadline.value = data.deadline;
    canSubmit.value = data.can_submit;
    Object.assign(form, blankResponse());
    conflict.value = false;
    pending.value = null;
    stage.value = 'response';
  }
  async function run(operation) {
    if (busy.value) return;
    const current = generation;
    busy.value = true;
    error.value = '';
    try { await operation(() => current === generation); }
    catch (failure) {
      if (current !== generation) return;
      error.value = failure instanceof RsvpError ? failure.message : 'We could not complete this step. Please retry or contact the couple privately.';
      if (failure.code === 'ALREADY_SUBMITTED') recorded();
      if (['CONFLICT', 'REQUEST_CONFLICT'].includes(failure.code)) conflict.value = true;
      if (failure.code === 'SESSION') {
        sessionToken = ''; stage.value = 'lookup';
        pending.value = null; invitation.value = null; receipt.value = null;
        revision.value = 0; deadline.value = RSVP_DEADLINE; canSubmit.value = false;
        Object.assign(form, blankResponse());
      }
    } finally { if (current === generation) busy.value = false; }
  }
  function recorded() {
 sessionToken = ''; pending.value = null; invitation.value = null; receipt.value = null; canSubmit.value = false;
 Object.assign(form, blankResponse()); stage.value = 'recorded'; error.value = '';
 }
 function startLookup() {
 if (!fullName(lookupName.value) || lookupName.value.length > 120) { error.value = 'Please enter your complete first and last name.'; return; }
 return run(async current => {
 const data = await api.lookup(clean(lookupName.value)); if (!current()) return;
 if (data.alreadySubmitted) { recorded(); return; }
 sessionToken = data.session_token; applyView(data);
 });
 }
  function submit() {
    if (conflict.value || !canSubmit.value) return;
    if (!pending.value) {
      form.attending_count = form.attendance === 'accept' ? 1 : 0;
      form.attendee_names = form.attendance === 'accept' ? [invitation.value.guest_name] : [];
      if (form.attendance === 'decline') { form.mobile = ''; form.dietary_notes = ''; form.activities = []; form.special_requests = ''; form.message = ''; }
      const validation = validateDraft(form, invitation.value.reserved_seats);
      if (validation) { error.value = validation; return; }
      const response = JSON.parse(JSON.stringify(form));
      response.attendee_names = response.attendee_names.map(clean);
      try { pending.value = { request_id: makeRequestId(), expected_revision: revision.value, response }; }
      catch { error.value = 'A secure browser connection is required to submit. Please use HTTPS or contact the couple privately.'; return; }
    }
    return run(async current => {
      const result = await api.submit({ session_token: sessionToken, ...JSON.parse(JSON.stringify(pending.value)) });
      if (!current()) return;
      if (result.alreadySubmitted) { recorded(); return; }
      Object.assign(form, JSON.parse(JSON.stringify(pending.value.response)));
      receipt.value = result;
      sessionToken = ''; canSubmit.value = false;
      revision.value = result.revision;
      pending.value = null;
      stage.value = 'receipt';
    });
  }
  function reset() {
    generation++;
    sessionToken = '';
    lookupName.value = '';
    invitation.value = null; pending.value = null; receipt.value = null;
    conflict.value = false; error.value = ''; busy.value = false;
    revision.value = 0; deadline.value = RSVP_DEADLINE; canSubmit.value = false;
    Object.assign(form, blankResponse());
    stage.value = 'lookup';
  }
  return { stage, lookupName, busy, error, invitation, revision, deadlineLabel, canSubmit, conflict, receipt, pending, form, frozen, startLookup, submit, reset };
}
