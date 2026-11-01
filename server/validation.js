// Ported from the existing Apps Script contract; no Google runtime dependencies.
function validateResponse_(value, maximum) {
  keys_(value, ['attendance', 'attendingCount', 'attendeeNames', 'contactEmail', 'dietaryRestrictions', 'activities', 'message', 'acknowledged']);
  if (!['accepted', 'declined'].includes(value.attendance) || !Number.isSafeInteger(value.attendingCount) || value.attendingCount < 0 || value.attendingCount > maximum || value.acknowledged !== true) fail_('INVALID_INPUT');
  if ((value.attendance === 'declined') !== (value.attendingCount === 0)) fail_('INVALID_INPUT');
  if (!Array.isArray(value.attendeeNames) || value.attendeeNames.length !== value.attendingCount) fail_('INVALID_INPUT');
  const attendeeNames = value.attendeeNames.map(name => {
    if (typeof name !== 'string' || name.length > 120 || /\p{Cc}/u.test(name)) fail_('INVALID_INPUT');
    const clean = name.normalize('NFKC').trim().replace(/\s+/g, ' ');
    if (!fullName_(clean) || clean.length > 120) fail_('INVALID_INPUT');
    return clean;
  });
  if (new Set(attendeeNames.map(normalizeName_)).size !== attendeeNames.length) fail_('INVALID_INPUT');
  const email = text_(value.contactEmail, 254, false);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail_('INVALID_INPUT');
  if (!Array.isArray(value.activities) || value.activities.length > 3 || new Set(value.activities).size !== value.activities.length || value.activities.some(item => !['karaoke', 'activities', 'photos'].includes(item))) fail_('INVALID_INPUT');
  const dietary = text_(value.dietaryRestrictions, 1000, false);
  const message = text_(value.message, 2000, false);
  return { attendance: value.attendance, attendingCount: value.attendingCount, attendeeNames: attendeeNames, contactEmail: email,
    dietaryRestrictions: value.attendance === 'accepted' ? dietary : '',
    activities: value.attendance === 'accepted' ? value.activities.slice().sort() : [], message: message, acknowledged: true };
}

function fullName_(name) { return /^[\p{L}][\p{L}\p{M} .'\u2019-]*$/u.test(name) && name.split(' ').filter(part => /\p{L}/u.test(part)).length >= 2; }

function normalizeName_(name) { return name.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US'); }

function isObject_(value) { return !!value && typeof value === 'object' && !Array.isArray(value); }

function keys_(value, allowed) {
  if (!isObject_(value) || Object.keys(value).some(key => !allowed.includes(key)) || allowed.some(key => !Object.prototype.hasOwnProperty.call(value, key))) fail_('INVALID_INPUT');
}

function text_(value, limit, required) {
  if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)) fail_('INVALID_INPUT');
  value = value.trim();
  if (required && !value) fail_('INVALID_INPUT');
  return value;
}

function fail_(code) { const error = new Error(code); error.publicCode = code; throw error; }
export { validateResponse_, fullName_, normalizeName_, isObject_, keys_, text_, fail_ };
