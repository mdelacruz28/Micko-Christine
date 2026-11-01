// Versioned, lossless details inside the existing backend message contract.
export const DETAILS_MARKER = 'RSVP_DETAILS_V1\n';
export function encodeResponseMessage(r) {
  const accepted = r.attendance === 'accept';
  const details = accepted
    ? { activities: [...r.activities].sort(), specialRequests: r.special_requests || '', message: r.message || '' }
    : { declineNote: r.decline_note || '' };
  return (accepted ? 'Mobile number: ' + r.mobile + '\n\n' : '') + DETAILS_MARKER + JSON.stringify(details);
}
export function decodeResponseMessage(message) {
  const prefix = message.match(/^Mobile number: ([0-9]{11})\n\n/);
  const body = prefix ? message.slice(prefix[0].length) : message;
  if (!body.startsWith(DETAILS_MARKER)) return { mobile: prefix?.[1] || '', legacyMessage: body };
  return { mobile: prefix?.[1] || '', ...JSON.parse(body.slice(DETAILS_MARKER.length)) };
}
