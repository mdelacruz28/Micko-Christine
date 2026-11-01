/* Local source for the EXISTING private Apps Script project. Never bundle into Vue. */
const APPROVED_RSVP_DEADLINE_ = '2026-11-15T23:59:59+08:00';
const HEADERS_ = {
  Invitations: ['invitation_id', 'group_label', 'invitation_type', 'reserved_seats', 'code_digest', 'code_version', 'active', 'updates_allowed', 'created_at', 'updated_at'],
  GuestNames: ['name_id', 'invitation_id', 'display_name', 'normalized_name', 'lookup_enabled'],
  Responses: ['invitation_id', 'attendance', 'attending_count', 'response_json', 'revision', 'last_request_id', 'last_payload_digest', 'submitted_at', 'updated_at'],
  SecurityState: ['key', 'value_json', 'expires_at'],
};
const MESSAGES_ = {
  INVALID_INPUT: 'Please check your answers.',
  VERIFICATION_FAILED: 'We could not find a unique active invitation for that name. Please contact the couple directly.',
  SESSION_EXPIRED: 'Please enter your invitation name again.',
  RATE_LIMITED: 'Please wait a few minutes before trying again.',
  RSVP_CLOSED: 'Online RSVP is closed. Please contact the couple privately.',
  ALREADY_SUBMITTED: 'Your RSVP has already been recorded. If you wish to change your response, please contact the couple directly.',
  REVISION_CONFLICT: 'Load the latest saved response before making changes.',
  TEMPORARY_FAILURE: 'Please try again shortly.',
};

function doPost(e) {
  let lock;
  try {
    const cfg = config_();
    lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) fail_('TEMPORARY_FAILURE');
    const book = SpreadsheetApp.openById(cfg.spreadsheetId);
    const state = securityState_(book);
    rate_(state, 'global', 150, 10 * 60 * 1000);
    const raw = e && e.postData && e.postData.contents;
    // Allow up to 100 names of 120 characters plus JSON escaping and other fields.
    if (typeof raw !== 'string' || raw.length > 100000) fail_('INVALID_INPUT');
    let request;
    try { request = JSON.parse(raw); } catch (_) { fail_('INVALID_INPUT'); }
    if (!isObject_(request) || request.version !== 2) fail_('INVALID_INPUT');
    let data;
    switch (request.action) {
      case 'lookup': data = lookup_(request, cfg, book, state); break;
      case 'status': data = status_(request, cfg, book, state); break;
      case 'submit': data = submit_(request, cfg, book, state); break;
      default: fail_('INVALID_INPUT');
    }
    return json_({ ok: true, data: data });
  } catch (error) {
    // Never expose exception details, sheet IDs, names, tokens, or submitted data.
    const code = error && error.publicCode || 'TEMPORARY_FAILURE';
    return json_({ ok: false, error: { code: code, message: MESSAGES_[code], retryable: ['TEMPORARY_FAILURE', 'RATE_LIMITED'].indexOf(code) !== -1 } });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: false, error: { code: 'INVALID_INPUT', message: MESSAGES_.INVALID_INPUT, retryable: false } });
}

function config_() {
  const p = PropertiesService.getScriptProperties();
  const cfg = { spreadsheetId: p.getProperty('SPREADSHEET_ID'), secret: p.getProperty('HMAC_SECRET'), deadline: p.getProperty('RSVP_DEADLINE') || APPROVED_RSVP_DEADLINE_ };
  if (p.getProperty('RSVP_DISABLED') === 'true' || !cfg.spreadsheetId || !cfg.secret || cfg.secret.length < 43 || !cfg.deadline || !/(Z|[+-]\d{2}:\d{2})$/.test(cfg.deadline) || !Number.isFinite(Date.parse(cfg.deadline))) fail_('TEMPORARY_FAILURE');
  // Fail closed on stale/mismatched production configuration; never extend the approved cutoff.
  if (cfg.deadline !== APPROVED_RSVP_DEADLINE_) fail_('TEMPORARY_FAILURE');
  return cfg;
}

function lookup_(r, cfg, book, state) {
  keys_(r, ['version', 'action', 'fullName']);
  const rawName = text_(r.fullName, 120, true);
  if (/[\p{Cc}\p{Cf}]/u.test(rawName)) fail_('INVALID_INPUT');
  const name = normalizeName_(rawName);
  if (!fullName_(name)) fail_('INVALID_INPUT');
  rate_(state, 'lookup:' + digest_(cfg, 'name', name), 10, 10 * 60 * 1000);
  const names = table_(book, 'GuestNames').rows;
  const ids = new Set(names.filter(row => row.lookup_enabled === true && normalizeName_(String(row.display_name)) === name).map(row => row.invitation_id));
  const matches = invitations_(book).filter(row => ids.has(row.invitation_id) && row.active === true);
  // Ambiguous registered names require organizer help; never select the first match.
  if (matches.length !== 1) fail_('VERIFICATION_FAILED');
  const invitation = matches[0];
  const response = responseRow_(book, invitation.invitation_id);
  if (response) return { alreadySubmitted: true };
  const person = individualGuest_(book, invitation);
  const token = newToken_(cfg, 'session');
  const expiry = Date.now() + 30 * 60 * 1000;
  state.put('session:' + digest_(cfg, 'token', token), { invitationId: invitation.invitation_id, codeVersion: invitation.code_version }, expiry);
  return Object.assign(view_(invitation, null, cfg, person), { sessionToken: token, expiresAt: new Date(expiry).toISOString() });
}

function authenticate_(token, cfg, book, state) {
  const key = tokenKey_(cfg, 'session', token, 'SESSION_EXPIRED');
  const session = state.get(key);
  if (!session) fail_('SESSION_EXPIRED');
  rate_(state, 'session-rate:' + key, 30, 10 * 60 * 1000);
  const invitation = invitations_(book).find(row => row.invitation_id === session.invitationId);
  if (!invitation || invitation.active !== true || invitation.code_version !== session.codeVersion) fail_('SESSION_EXPIRED');
  return invitation;
}

function status_(r, cfg, book, state) {
  keys_(r, ['version', 'action', 'sessionToken']);
  const invitation = authenticate_(r.sessionToken, cfg, book, state);
  const response = responseRow_(book, invitation.invitation_id);
  return view_(invitation, response, cfg, response ? null : individualGuest_(book, invitation));
}

function submit_(r, cfg, book, state) {
  keys_(r, ['version', 'action', 'sessionToken', 'requestId', 'expectedRevision', 'response']);
  const invitation = authenticate_(r.sessionToken, cfg, book, state);
  if (typeof r.requestId !== 'string' || !/^[a-zA-Z0-9-]{20,80}$/.test(r.requestId) || !Number.isSafeInteger(r.expectedRevision) || r.expectedRevision < 0) fail_('INVALID_INPUT');
  const person = individualGuest_(book, invitation);
  const response = validateResponse_(r.response, 1);
  if (response.attendance === 'accepted') {
    if (response.attendingCount !== 1 || normalizeName_(response.attendeeNames[0]) !== normalizeName_(person)) fail_('INVALID_INPUT');
    response.attendeeNames = [person];
  }
  const hash = digest_(cfg, 'payload', JSON.stringify(response));
  const table = table_(book, 'Responses');
  const existing = uniqueResponse_(table.rows, invitation.invitation_id);
  if (existing && existing.last_request_id === r.requestId) {
    if (!equal_(existing.last_payload_digest, hash)) fail_('INVALID_INPUT');
    return receipt_(existing, invitation, cfg);
  }
  if (existing) fail_('ALREADY_SUBMITTED');
  if (!canEdit_(invitation, cfg)) fail_('RSVP_CLOSED');
  const revision = 0;
  if (!Number.isSafeInteger(revision) || revision < 0) fail_('TEMPORARY_FAILURE');
  if (r.expectedRevision !== revision) fail_('REVISION_CONFLICT');
  const now = new Date().toISOString();
  const values = [invitation.invitation_id, response.attendance, response.attendingCount,
    JSON.stringify(response), revision + 1, r.requestId, hash, now, now];
  // The script lock makes first-save checking and row creation atomic for this writer.
  table.sheet.getRange(table.sheet.getLastRow() + 1, 1, 1, values.length).setValues([values]);
  SpreadsheetApp.flush();
  return { saved: true, revision: revision + 1, attendance: response.attendance, attendingCount: response.attendingCount, updatedAt: now, canEdit: false };
}

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

function view_(invitation, response, cfg, person) {
  // Name-only callers must never receive a previous responder's personal answers.
  if (response) return { alreadySubmitted: true };
  return { invitation: { label: person, guestName: person, reservedSeats: 1 },
    response: null, revision: 0, deadline: cfg.deadline, canEdit: canEdit_(invitation, cfg) };
}
function individualGuest_(book, invitation) {
  // Existing group responses remain private and immutable. No new group replies.
  if (invitation.invitation_type !== 'individual' || invitation.reserved_seats !== 1) fail_('VERIFICATION_FAILED');
  const mappings = table_(book, 'GuestNames').rows.filter(row => row.invitation_id === invitation.invitation_id);
  if (mappings.length !== 1 || mappings[0].lookup_enabled !== true) fail_('VERIFICATION_FAILED');
  const person = String(mappings[0].display_name).normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (!fullName_(person) || person.length > 120 || normalizeName_(person) !== mappings[0].normalized_name || normalizeName_(person) !== normalizeName_(invitation.group_label)) fail_('VERIFICATION_FAILED');
  return person;
}
function receipt_(row, invitation, cfg) {
  return { saved: true, revision: row.revision, attendance: row.attendance, attendingCount: row.attending_count, updatedAt: row.updated_at, canEdit: false };
}
function canEdit_(invitation, cfg) {
  return Date.now() <= Date.parse(cfg.deadline);
}
function responseRow_(book, id) { return uniqueResponse_(table_(book, 'Responses').rows, id); }
function uniqueResponse_(rows, id) {
  const found = rows.filter(row => row.invitation_id === id);
  if (found.length > 1) fail_('TEMPORARY_FAILURE');
  return found[0] || null;
}
function invitations_(book) {
  const rows = table_(book, 'Invitations').rows;
  const ids = new Set();
  const codes = new Set();
  rows.forEach(row => {
    if (!/^[a-zA-Z0-9-]{1,80}$/.test(row.invitation_id) || ids.has(row.invitation_id) || codes.has(row.code_digest) || !/^[a-f0-9]{64}$/.test(row.code_digest) || !Number.isSafeInteger(row.reserved_seats) || row.reserved_seats < 1 || row.reserved_seats > 100 || !Number.isSafeInteger(row.code_version) || row.code_version < 1 || typeof row.group_label !== 'string' || !row.group_label.trim() || !['individual', 'couple', 'family'].includes(row.invitation_type) || typeof row.active !== 'boolean' || typeof row.updates_allowed !== 'boolean') fail_('TEMPORARY_FAILURE');
    ids.add(row.invitation_id); codes.add(row.code_digest);
  });
  return rows;
}

function table_(book, name) {
  const sheet = book.getSheetByName(name);
  if (!sheet || sheet.getLastRow() < 1) fail_('TEMPORARY_FAILURE');
  const values = sheet.getRange(1, 1, sheet.getLastRow(), HEADERS_[name].length).getValues();
  if (JSON.stringify(values[0]) !== JSON.stringify(HEADERS_[name])) fail_('TEMPORARY_FAILURE');
  return { sheet: sheet, rows: values.slice(1).map((values, i) => {
    const row = { _row: i + 2 };
    HEADERS_[name].forEach((key, index) => row[key] = values[index]);
    return row;
  }).filter(row => row[HEADERS_[name][0]] !== '') };
}

function securityState_(book) {
  const table = table_(book, 'SecurityState');
  const now = Date.now();
  const records = table.rows.filter(row => Number(row.expires_at) > now);
  const reusableRows = table.rows.filter(row => Number(row.expires_at) <= now).map(row => row._row);
  const entries = new Map();
  records.forEach((row, index) => {
    if (entries.has(row.key)) fail_('TEMPORARY_FAILURE');
    entries.set(row.key, { value: JSON.parse(row.value_json), expires: Number(row.expires_at), row: row._row });
  });
  return {
    get: function(key) { const entry = entries.get(key); return entry && entry.expires > Date.now() ? entry.value : null; },
    put: function(key, value, expires) {
      const old = entries.get(key);
      if (!old && entries.size >= 2000) fail_('RATE_LIMITED');
      const row = old ? old.row : (reusableRows.shift() || table.sheet.getLastRow() + 1);
      table.sheet.getRange(row, 1, 1, 3).setValues([[key, JSON.stringify(value), expires]]);
      entries.set(key, { value: value, expires: expires, row: row });
    },
    remove: function(key) {
      const old = entries.get(key);
      if (old) {
        // Tombstone expires immediately; reused by a later request.
        table.sheet.getRange(old.row, 3).setValue(0);
        entries.delete(key);
      }
    },
  };
}
function rate_(state, key, limit, windowMs) {
  const name = 'rate:' + key;
  const current = state.get(name) || { count: 0, until: Date.now() + windowMs };
  if (current.count >= limit) fail_('RATE_LIMITED');
  current.count++;
  state.put(name, current, current.until);
}

function fullName_(name) { return /^[\p{L}][\p{L}\p{M} .'\u2019-]*$/u.test(name) && name.split(' ').filter(part => /\p{L}/u.test(part)).length >= 2; }
function normalizeName_(name) { return name.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US'); }
function normalizeCode_(code) { return code.toUpperCase().replace(/[\s-]/g, ''); }
function digest_(cfg, purpose, value) {
  return Utilities.computeHmacSha256Signature(purpose + ':' + value, cfg.secret, Utilities.Charset.UTF_8).map(byte => ('0' + (byte & 255).toString(16)).slice(-2)).join('');
}
function newToken_(cfg, purpose) {
  // UUID is a nonce; unpredictability comes from the server's high-entropy HMAC key.
  return digest_(cfg, purpose, Utilities.getUuid() + ':' + Utilities.getUuid() + ':' + Date.now());
}
function tokenKey_(cfg, type, token, error) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) fail_(error);
  return type + ':' + digest_(cfg, 'token', token);
}
function equal_(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
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
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }

// Organizer-only editor helpers. Trailing underscores keep these out of
// google.script.run; doPost dispatch never exposes administrative operations.
function initializeSheets_() {
  const book = SpreadsheetApp.openById(config_().spreadsheetId);
  Object.keys(HEADERS_).forEach(name => {
    let sheet = book.getSheetByName(name);
    if (!sheet) sheet = book.insertSheet(name);
    if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, HEADERS_[name].length).setValues([HEADERS_[name]]);
    else table_(book, name); // Never overwrite an existing schema or records.
    sheet.setFrozenRows(1);
  });
}

// Supply a securely generated 26-character Base32 code privately from an
// organizer workflow. This helper returns a digest, never a stored raw code.
function invitationCodeDigest_(privateCode) {
  const code = normalizeCode_(privateCode);
  if (!/^[A-Z2-7]{26}$/.test(code)) fail_('INVALID_INPUT');
  return digest_(config_(), 'code', code);
}
