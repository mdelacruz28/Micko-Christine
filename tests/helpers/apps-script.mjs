import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { createHmac, randomUUID } from 'node:crypto';

export const secret = 'dummy-only-secret-for-local-tests-0123456789abcdef';
export const code = '1234567890ABCDEF1234567890ABCDEF12345678';
export const digest = (value) => createHmac('sha256', secret).update(value).digest('hex');

export function backend() {
  let now = Date.parse('2026-10-21T12:00:00+08:00');
  const properties = { SPREADSHEET_ID: 'dummy-sheet', HMAC_SECRET: secret, RSVP_DEADLINE: '2026-11-15T23:59:59+08:00' };
  const headers = {
    Invitations: 'invitation_id,group_label,invitation_type,reserved_seats,code_digest,code_version,active,updates_allowed,created_at,updated_at',
    GuestNames: 'name_id,invitation_id,display_name,normalized_name,lookup_enabled',
    Responses: 'invitation_id,attendance,attending_count,response_json,revision,last_request_id,last_payload_digest,submitted_at,updated_at',
    SecurityState: 'key,value_json,expires_at'
  };
  const tables = Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, [value.split(',')]]));
  tables.Invitations.push(['inv-dummy', 'Dummy Guest', 'individual', 1, digest(JSON.stringify(['code-v1', 'inv-dummy', '1', code])), 1, true, true, '', '']);
  tables.GuestNames.push(['name_dummy', 'inv-dummy', 'Dummy Guest', 'dummy guest', true]);
  let locked = false;
  let lockAvailable = true;
  let flushes = 0;
  const sheet = name => ({
    getSheetId: () => Object.keys(headers).indexOf(name),
    getDataRange: () => ({ getValues: () => tables[name].map(row => [...row]) }),
    getLastRow: () => tables[name].length,
    getRange: (r, c, height = 1, width = 1) => ({
 getValues: () => Array.from({ length: height }, (_, i) => Array.from({ length: width }, (_, j) => tables[name][r-1+i]?.[c-1+j] ?? '')),
 setValues: values => { if (!locked) throw new Error('Write outside script lock'); values.forEach((row,i) => { tables[name][r-1+i] ||= []; row.forEach((v,j)=>tables[name][r-1+i][c-1+j]=v); }); },
 clearContent: () => { if (!locked) throw new Error('Write outside lock'); for(let i=0;i<height;i++) for(let j=0;j<width;j++) tables[name][r-1+i][c-1+j]=''; },
 setValue: value => { tables[name][r-1][c-1]=value; }
 }),
    deleteRow: r => { if (!locked) throw new Error('Delete outside lock'); tables[name].splice(r - 1, 1); }
  });
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const context = vm.createContext({
    Date: Clock,
    LockService: { getScriptLock: () => ({ tryLock: () => { if (!lockAvailable) return false; locked = true; return true; }, hasLock: () => locked, releaseLock: () => { locked = false; } }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => properties[key] ?? null }) },
    SpreadsheetApp: { openById: () => ({ getSheets: () => Object.keys(tables), getSheetByName: name => tables[name] && sheet(name) }), flush: () => { flushes++; } },
    Utilities: { Charset: { UTF_8: 'UTF_8' }, getUuid: randomUUID, computeHmacSha256Signature: (value, key) => [...createHmac('sha256', key).update(value).digest()].map(b => b > 127 ? b - 256 : b) },
    ContentService: { MimeType: { JSON: 'JSON' }, createTextOutput: text => ({ setMimeType: () => text }) }
  });
  vm.runInContext(readFileSync(new URL('../../apps-script/Code.gs', import.meta.url), 'utf8'), context);
  const call = body => JSON.parse(context.doPost({ postData: { contents: JSON.stringify({ version: 2, ...body }) } }));
  const verify = (name = 'Dummy Guest') => call({ action: 'lookup', fullName: name });
  return { tables, properties, context, call, verify, advance: ms => { now += ms; }, setNow: value => { now = Date.parse(value); }, setLock: value => { lockAvailable = value; }, get locked() { return locked; }, get flushes() { return flushes; } };
}

export const accepted = (count = 1) => ({ attendance: 'accepted', attendingCount: count, attendeeNames: ['Dummy Guest', 'Dummy Two', 'Dummy Three', 'Dummy Four'].slice(0, count), contactEmail: '', dietaryRestrictions: '', activities: [], message: '', acknowledged: true });
export const submission = (session, response = accepted(), revision = 0, requestId = randomUUID()) => ({ action: 'submit', sessionToken: session, expectedRevision: revision, requestId, response });
