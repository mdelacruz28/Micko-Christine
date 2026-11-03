import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { RSVP_DEADLINE } from '../src/config/rsvp.js';
import { validateResponse_, fullName_, normalizeName_, keys_, text_, fail_ } from './validation.js';

const publicCodes = new Set(['INVALID_INPUT','VERIFICATION_FAILED','SESSION_EXPIRED','RATE_LIMITED','RSVP_CLOSED','ALREADY_SUBMITTED','REVISION_CONFLICT']);
export const failure = code => ({ ok: false, error: { code, retryable: ['TEMPORARY_FAILURE','RATE_LIMITED'].includes(code) } });
export function configuration(env = process.env) {
  if (env.RSVP_DISABLED !== 'false' || typeof env.HMAC_SECRET !== 'string' || env.HMAC_SECRET.length < 43 || env.RSVP_DEADLINE !== RSVP_DEADLINE) throw new Error('Invalid server configuration');
  return { secret: env.HMAC_SECRET, deadline: RSVP_DEADLINE };
}
const digest = (cfg, purpose, value) => createHmac('sha256', cfg.secret).update(purpose + ':' + value).digest('hex');
const equal = (a,b) => typeof a === 'string' && a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const receipt = row => ({ saved: true, revision: row.revision, attendance: row.attendance, attendingCount: row.attending_count, updatedAt: row.updated_at, canEdit: false });

export function createRsvpService({ database, config, now = Date.now }) {
  return async function call(request) {
    try {
      return await database.transaction(async db => {
        // Serialize this small wedding workload across every serverless instance.
        // Import tooling also locks this row. PK constraints independently prevent duplicates.
        const control = (await db.query('SELECT enabled FROM rsvp_control WHERE id=1 FOR UPDATE')).rows[0];
        if (!control?.enabled) return failure('TEMPORARY_FAILURE');
        const timestamp = now();
        await db.query('DELETE FROM security_state WHERE expires_at <= $1', [timestamp]);
        const get = async key => (await db.query('SELECT value_json FROM security_state WHERE key=$1 AND expires_at>$2', [key, now()])).rows[0]?.value_json;
        const put = async (key, value, expiry) => {
          const count = (await db.query('SELECT count(*)::int AS n FROM security_state')).rows[0].n;
          if (count >= 2000 && !await get(key)) fail_('RATE_LIMITED');
          await db.query('INSERT INTO security_state(key,value_json,expires_at) VALUES($1,$2,$3) ON CONFLICT(key) DO UPDATE SET value_json=EXCLUDED.value_json, expires_at=EXCLUDED.expires_at', [key, JSON.stringify(value), expiry]);
        };
        const rate = async (key, limit) => {
          key = 'rate:' + key;
          const current = await get(key) || { count: 0, until: now() + 600000 };
          if (current.count >= limit) fail_('RATE_LIMITED');
          current.count++;
          await put(key,current,current.until);
        };
        const existing = async id => (await db.query('SELECT * FROM responses WHERE invitation_id=$1',[id])).rows[0];
        const individual = async invitation => {
          if (invitation.invitation_type !== 'individual' || invitation.reserved_seats !== 1) fail_('VERIFICATION_FAILED');
          const mappings = (await db.query('SELECT * FROM guest_names WHERE invitation_id=$1',[invitation.invitation_id])).rows;
          if (mappings.length !== 1 || !mappings[0].lookup_enabled) fail_('VERIFICATION_FAILED');
          const person = mappings[0].display_name.normalize('NFKC').trim().replace(/\s+/g,' ');
          if (!fullName_(person) || person.length > 120 || normalizeName_(person) !== mappings[0].normalized_name || normalizeName_(person) !== normalizeName_(invitation.group_label)) fail_('VERIFICATION_FAILED');
          return person;
        };
        const view = person => ({ invitation: { label: person, guestName: person, reservedSeats: 1 }, response: null, revision: 0, deadline: config.deadline, canEdit: now() <= Date.parse(config.deadline) });
        try {
          // Commit throttles even when validation/authentication fails.
          await rate('global',150);
          if (!request || request.version !== 2) fail_('INVALID_INPUT');
          if (request.action === 'lookup') {
            keys_(request,['version','action','fullName']);
            const raw = text_(request.fullName,120,true);
            if (/[\p{Cc}\p{Cf}]/u.test(raw)) fail_('INVALID_INPUT');
            const name = normalizeName_(raw);
            if (!fullName_(name)) fail_('INVALID_INPUT');
            await rate('lookup:' + digest(config,'name',name),10);
            const matches = (await db.query('SELECT DISTINCT i.* FROM invitations i JOIN guest_names g USING(invitation_id) WHERE g.lookup_enabled AND g.normalized_name=$1 AND i.active',[name])).rows;
            if (matches.length !== 1) fail_('VERIFICATION_FAILED');
            const invitation = matches[0];
            if (await existing(invitation.invitation_id)) return { ok: true, data: { alreadySubmitted: true } };
            const person = await individual(invitation);
            const token = randomBytes(32).toString('hex');
            const expiry = now() + 1800000;
            await put('session:' + digest(config,'token',token), { invitationId: invitation.invitation_id, codeVersion: invitation.code_version }, expiry);
            return { ok: true, data: { ...view(person), sessionToken: token, expiresAt: new Date(expiry).toISOString() } };
          }
          if (!['submit','status'].includes(request.action)) fail_('INVALID_INPUT');
          keys_(request,request.action === 'status' ? ['version','action','sessionToken'] : ['version','action','sessionToken','requestId','expectedRevision','response']);
          if (typeof request.sessionToken !== 'string' || !/^[a-f0-9]{64}$/.test(request.sessionToken)) fail_('SESSION_EXPIRED');
          const key = 'session:' + digest(config,'token',request.sessionToken);
          const session = await get(key);
          if (!session) fail_('SESSION_EXPIRED');
          await rate('session-rate:' + key,30);
          const invitation = (await db.query('SELECT * FROM invitations WHERE invitation_id=$1',[session.invitationId])).rows[0];
          if (!invitation?.active || invitation.code_version !== session.codeVersion) fail_('SESSION_EXPIRED');
          const saved = await existing(invitation.invitation_id);
          if (request.action === 'status') return { ok: true, data: saved ? { alreadySubmitted: true } : view(await individual(invitation)) };
          if (typeof request.requestId !== 'string' || !/^[a-zA-Z0-9-]{20,80}$/.test(request.requestId) || !Number.isSafeInteger(request.expectedRevision) || request.expectedRevision < 0) fail_('INVALID_INPUT');
          const person = await individual(invitation);
          const response = validateResponse_(request.response,1);
          if (response.attendance === 'accepted') {
            if (normalizeName_(response.attendeeNames[0]) !== normalizeName_(person)) fail_('INVALID_INPUT');
            response.attendeeNames = [person];
          }
          const hash = digest(config,'payload',JSON.stringify(response));
          if (saved?.last_request_id === request.requestId) {
            if (!equal(saved.last_payload_digest,hash)) fail_('INVALID_INPUT');
            return { ok: true, data: receipt(saved) };
          }
          if (saved) fail_('ALREADY_SUBMITTED');
          if (now() > Date.parse(config.deadline)) fail_('RSVP_CLOSED');
          if (request.expectedRevision !== 0) fail_('REVISION_CONFLICT');
          const iso = new Date(now()).toISOString();
          const row = (await db.query('INSERT INTO responses(invitation_id,attendance,attending_count,response_json,revision,last_request_id,last_payload_digest,submitted_at,updated_at) VALUES($1,$2,$3,$4,1,$5,$6,$7,$7) RETURNING *', [invitation.invitation_id,response.attendance,response.attendingCount,JSON.stringify(response),request.requestId,hash,iso])).rows[0];
          return { ok: true, data: receipt(row) };
        } catch (error) {
          if (publicCodes.has(error.publicCode)) return failure(error.publicCode);
          throw error; // Roll back SQL failures; do not commit partial work.
        }
      });
    } catch (error) {
      const safeCodes = new Set(['28P01','3D000','42P01','42501','53300','57P01','ECONNREFUSED','ENOTFOUND','ETIMEDOUT','ECONNRESET','SELF_SIGNED_CERT_IN_CHAIN','UNABLE_TO_VERIFY_LEAF_SIGNATURE','CERT_HAS_EXPIRED']);
      console.error('RSVP_DATABASE_FAILURE', safeCodes.has(error.code) ? error.code : 'INTERNAL');
      return failure('TEMPORARY_FAILURE');
    }
  };
}
