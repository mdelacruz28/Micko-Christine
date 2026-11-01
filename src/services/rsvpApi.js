import { encodeResponseMessage } from '../utils/rsvpDetails.js';
import { RSVP_DEADLINE } from '../config/rsvp.js';
import { validGuestName } from '../utils/guestName.js';
const messages = {
 ALREADY_SUBMITTED: 'Your RSVP has already been recorded. If you wish to change your response, please contact the couple directly.',
  INVALID: 'Please check the form and try again.',
  VERIFY: 'We could not find a unique active invitation for that name. Please contact the couple directly.',
  SESSION: 'Your verification has expired. Please verify your invitation again.',
  RATE_LIMIT: 'Too many attempts. Please wait a while before trying again.',
  CLOSED: 'RSVP submissions are currently closed. Please contact the couple privately.',
  UPDATES_CLOSED: 'Updates are not available for this invitation. Please contact the couple privately.',
  CONFLICT: 'This response changed elsewhere. Reload the saved response before editing again.',
  REQUEST_CONFLICT: 'Reload the saved response before continuing.',
  BUSY: 'The form is busy. Please retry shortly.',
  UNAVAILABLE: 'RSVP is temporarily unavailable. Please try later or contact the couple privately.',
  CONFIG: 'Online RSVP is not connected yet. Please contact the couple privately.',
  NETWORK: 'We could not confirm the result. Check your connection, then retry the same submission.',
  CONTRACT: 'We could not read the RSVP result. Please retry or contact the couple privately.'
};
export class RsvpError extends Error {
  constructor(code) {
    const safeCode = typeof code === 'string' && Object.hasOwn(messages, code) ? code : 'UNAVAILABLE';
    super(messages[safeCode]); this.code = safeCode;
  }
}
const record = value => value && typeof value === 'object' && !Array.isArray(value);
const integer = value => Number.isSafeInteger(value) && value >= 0;
const iso = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
const token = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);

export const alreadyRecorded = 'Your RSVP has already been recorded. If you wish to change your response, please contact the couple directly.';
const errorMap = { INVALID_INPUT: 'INVALID', VERIFICATION_FAILED: 'VERIFY', SESSION_EXPIRED: 'SESSION', RATE_LIMITED: 'RATE_LIMIT', RSVP_CLOSED: 'CLOSED', TEMPORARY_FAILURE: 'UNAVAILABLE', ALREADY_SUBMITTED: 'ALREADY_SUBMITTED', REVISION_CONFLICT: 'CONFLICT' };
export function validateContract(action, data) {
 if (!record(data)) throw new RsvpError('CONTRACT');
 if (data.alreadySubmitted === true) return { alreadySubmitted: true };
 if (action === 'submit') {
  if (data.saved !== true || data.revision < 1 || !integer(data.revision) || !iso(data.updatedAt) || data.canEdit !== false) throw new RsvpError('CONTRACT');
  return { saved: true, revision: data.revision, updated_at: data.updatedAt };
 }
 if (!record(data.invitation) || typeof data.invitation.label !== 'string' || !integer(data.invitation.reservedSeats) || !validGuestName(data.invitation.guestName) || data.invitation.reservedSeats !== 1 || data.response !== null || data.revision !== 0 || typeof data.canEdit !== 'boolean' || data.deadline !== RSVP_DEADLINE) throw new RsvpError('CONTRACT');
 if (action === 'lookup' && (!token(data.sessionToken) || !iso(data.expiresAt))) throw new RsvpError('CONTRACT');
 return { invitation: { group_label: data.invitation.label, reserved_seats: 1, guest_name: data.invitation.guestName }, deadline: data.deadline, revision: 0, can_submit: data.canEdit, session_token: data.sessionToken };
}

export function createRsvpApi({ endpoint = import.meta.env?.VITE_RSVP_API_URL || '/api/rsvp', fetchImpl = globalThis.fetch, timeoutMs = 20000 } = {}) {
  async function call(action, fields = {}) {
    let url;
    const sameOrigin = endpoint === "/api/rsvp";
    try {
      url = sameOrigin ? null : new URL(endpoint);
      if (!sameOrigin && (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) || url.search || url.hash || url.username || url.password || url.port)) throw new Error();
    } catch { throw new RsvpError('CONFIG'); }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let response;
      let envelope;
      try {
        response = await fetchImpl(sameOrigin ? endpoint : url.href, {
          method: 'POST', headers: { 'Content-Type': sameOrigin ? 'application/json' : 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ...fields, version: 2, action }), signal: controller.signal,
          credentials: 'omit', redirect: 'follow', cache: 'no-store', referrerPolicy: 'no-referrer'
        });
        if (!response.ok || response.type === 'opaque') throw new Error();
        envelope = await response.json();
      } catch { throw new RsvpError('NETWORK'); }
      if (!record(envelope) || typeof envelope.ok !== 'boolean') throw new RsvpError('CONTRACT');
      if (!envelope.ok) throw new RsvpError(errorMap[envelope.error?.code] || envelope.error?.code);
      return validateContract(action, envelope.data);
    } finally { clearTimeout(timer); }
  }
  return {
 lookup: fullName => call('lookup', { fullName }),
 submit: fields => call('submit', { sessionToken: fields.session_token, requestId: fields.request_id, expectedRevision: 0,
 response: { attendance: fields.response.attendance === 'accept' ? 'accepted' : 'declined', attendingCount: fields.response.attending_count, attendeeNames: fields.response.attendee_names, contactEmail: '', dietaryRestrictions: fields.response.attendance === 'accept' ? fields.response.dietary_notes : '', activities: fields.response.attendance === 'accept' ? fields.response.activities.filter(a => ['karaoke','photos'].includes(a)) : [], message: encodeResponseMessage(fields.response), acknowledged: true } })
 };
}
