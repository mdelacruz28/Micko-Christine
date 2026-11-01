import { randomUUID, randomBytes, createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanGuestName, normalizeGuestName, validGuestName } from '../src/utils/guestName.js';

export const invitationHeaders = 'invitation_id,group_label,invitation_type,reserved_seats,code_digest,code_version,active,updates_allowed,created_at,updated_at'.split(',');
export const guestHeaders = 'name_id,invitation_id,display_name,normalized_name,lookup_enabled'.split(',');
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const rows = (table, headers) => {
  assert(Array.isArray(table) && JSON.stringify(table[0]) === JSON.stringify(headers), 'Snapshot headers do not match the existing schema.');
  return table.slice(1).filter(row => row[0] !== '');
};
export function inspectSnapshot(snapshot) {
  assert(snapshot?.format === 'wedding-guest-snapshot-v1' && typeof snapshot.spreadsheetId === 'string' && snapshot.spreadsheetId.length > 0, 'Use a fresh private snapshot of the existing spreadsheet.');
  assert(Number.isFinite(Date.parse(snapshot.capturedAt)), 'Snapshot capture time is required.');
  assert(Number.isSafeInteger(snapshot.sheetIds?.Invitations) && Number.isSafeInteger(snapshot.sheetIds?.GuestNames) && snapshot.sheetIds.Invitations !== snapshot.sheetIds.GuestNames, 'Existing tab IDs are required.');
  const invitations = rows(snapshot.invitations, invitationHeaders);
  const guestNames = rows(snapshot.guestNames, guestHeaders);
  assert(new Set(invitations.map(r => r[0])).size === invitations.length, 'Existing invitation IDs are duplicated.');
  assert(new Set(guestNames.map(r => r[0])).size === guestNames.length, 'Existing name IDs are duplicated.');
  const ids = new Set([...invitations.map(r => r[0]), ...guestNames.map(r => r[0])]);
  const names = new Set([...guestNames.flatMap(r => [normalizeGuestName(String(r[2])), normalizeGuestName(String(r[3]))]), ...invitations.map(r => normalizeGuestName(String(r[1])))]);
  const digests = new Set(invitations.map(r => r[4]));
  const fingerprint = hash([snapshot.spreadsheetId, snapshot.sheetIds, snapshot.invitations, snapshot.guestNames]);
  return { invitations, guestNames, ids, names, digests, fingerprint };
}
function uniqueValue(generate, used, pattern) {
  for (let attempt = 0; attempt < 16; attempt++) {
    const value = generate();
    if (typeof value === 'string' && pattern.test(value) && !used.has(value)) { used.add(value); return value; }
  }
  throw new Error('Unable to generate collision-free identifiers. No import was prepared.');
}
export function prepareGuests(input, snapshot, { uuid = randomUUID, bytes = randomBytes, now = new Date().toISOString() } = {}) {
  const existing = inspectSnapshot(snapshot);
  assert(Array.isArray(input) && input.length > 0 && input.length <= 1000, 'Provide 1 to 1000 full names, one person per row.');
  const counts = new Map();
  input.forEach(name => { if (validGuestName(name)) { const key = normalizeGuestName(name); counts.set(key, (counts.get(key) || 0) + 1); } });
  const invitations = [], guestNames = [], rejected = [];
  input.forEach((raw, index) => {
    const normalized = typeof raw === 'string' ? normalizeGuestName(raw) : '';
    const reason = !validGuestName(raw) ? 'Enter a valid complete first and last name; blank, control and formula-like values are rejected.' : counts.get(normalized) > 1 ? 'Duplicate normalized name in this list.' : existing.names.has(normalized) ? 'Name conflicts with an existing invitation or name mapping, including disabled records.' : '';
    if (reason) { rejected.push({ row: index + 1, reason }); return; }
    const name = cleanGuestName(raw);
    const invitationId = uniqueValue(uuid, existing.ids, /^[a-zA-Z0-9][a-zA-Z0-9-]{0,79}$/);
    const nameId = uniqueValue(uuid, existing.ids, /^[a-zA-Z0-9][a-zA-Z0-9-]{0,79}$/);
    // Required legacy field is a unique random digest-shaped placeholder. No guest code is issued or used.
    const digest = uniqueValue(() => bytes(32).toString('hex'), existing.digests, /^[a-f0-9]{64}$/);
    invitations.push({ invitation_id: invitationId, group_label: name, invitation_type: 'individual', reserved_seats: 1, code_digest: digest, code_version: 1, active: true, updates_allowed: false, created_at: now, updated_at: now });
    guestNames.push({ name_id: nameId, invitation_id: invitationId, display_name: name, normalized_name: normalized, lookup_enabled: true });
  });
  return { format: 'wedding-person-plan-v1', spreadsheetId: snapshot.spreadsheetId, sheetIds: snapshot.sheetIds, snapshotFingerprint: existing.fingerprint, preparedAt: now, inputCount: input.length, invitations, guestNames, rejected };
}
export const guestListFingerprint = list => hash([list.sheetId, list.rows.map((row,index) => [index, row[1] ?? '']), list.formulaRows || []]);
export const confirmationToken = plan => hash(plan);
export function confirmedRequests(plan, snapshot, confirmation) {
  const existing = inspectSnapshot(snapshot);
  if (plan?.sourceGuestList) assert(snapshot.guestList && guestListFingerprint(snapshot.guestList) === plan.sourceGuestList.fingerprint, 'Guest List names changed. Prepare a new review.');
  assert(plan?.format === 'wedding-person-plan-v1' && confirmation === confirmationToken(plan), 'Explicit confirmation must exactly match the reviewed plan digest.');
  assert(existing.fingerprint === plan.snapshotFingerprint && snapshot.spreadsheetId === plan.spreadsheetId, 'The spreadsheet changed. Prepare and review a new dry run.');
  assert(plan.rejected.length === 0 && plan.invitations.length > 0 && plan.invitations.length === plan.guestNames.length && plan.inputCount === plan.invitations.length, 'Fix rejected rows and prepare a new plan; partial imports are disabled.');
  const names = new Set(), ids = new Set(existing.ids), digests = new Set(existing.digests);
  plan.invitations.forEach((inv, i) => {
    const guest = plan.guestNames[i];
    assert(JSON.stringify(Object.keys(inv)) === JSON.stringify(invitationHeaders) && JSON.stringify(Object.keys(guest)) === JSON.stringify(guestHeaders), 'Invalid planned columns.');
    assert(validGuestName(inv.group_label) && cleanGuestName(inv.group_label) === inv.group_label && inv.invitation_type === 'individual' && inv.reserved_seats === 1 && inv.active === true && inv.updates_allowed === false && inv.code_version === 1, 'Invalid individual invitation policy.');
    assert(guest.invitation_id === inv.invitation_id && guest.display_name === inv.group_label && guest.normalized_name === normalizeGuestName(inv.group_label) && guest.lookup_enabled === true, 'Invalid primary name mapping.');
    assert(!existing.names.has(guest.normalized_name) && !names.has(guest.normalized_name), 'Name collision.'); names.add(guest.normalized_name);
    for (const id of [inv.invitation_id, guest.name_id]) { assert(typeof id === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9-]{0,79}$/.test(id) && !ids.has(id), 'ID collision.'); ids.add(id); }
    assert(/^[a-f0-9]{64}$/.test(inv.code_digest) && !digests.has(inv.code_digest), 'Digest collision.'); digests.add(inv.code_digest);
    assert(Number.isFinite(Date.parse(inv.created_at)) && inv.created_at === inv.updated_at, 'Invalid timestamps.');
  });
  const cell = value => ({ userEnteredValue: typeof value === 'boolean' ? { boolValue: value } : typeof value === 'number' ? { numberValue: value } : { stringValue: value } });
  return [ ['Invitations', invitationHeaders, plan.invitations], ['GuestNames', guestHeaders, plan.guestNames] ].map(([tab, headers, records]) => ({ appendCells: { sheetId: snapshot.sheetIds[tab], rows: records.map(record => ({ values: headers.map(key => cell(record[key])) })), fields: 'userEnteredValue' } }));
}
const csv = (headers, records) => [headers, ...records.map(record => headers.map(key => record[key]))].map(row => row.map(value => '"' + String(value).replaceAll('"', '""') + '"').join(',')).join('\r\n') + '\r\n';
async function main(args) {
  if (args.length === 1 && args[0] === '--help') { console.log('Dry run: node apps-script/provision-invitations.mjs --input private-rsvp/guests.txt --snapshot private-rsvp/current-snapshot.json --out private-rsvp/review-001\nConfirm local artifacts only: --plan private-rsvp/review-001/plan.json --snapshot private-rsvp/fresh-snapshot.json --confirm <reviewed-digest> --out private-rsvp/approved-001\nNever contacts Google or imports records. No fictional fixture mode.'); return; }
  const options = {};
  for(let i=0;i<args.length;i+=2) { const key=args[i]; assert(['--input','--snapshot','--out','--plan','--confirm'].includes(key) && !options[key] && args[i+1] && !args[i+1].startsWith('--'), 'Unknown, duplicate or missing argument.'); options[key]=args[i+1]; }
  assert(options['--snapshot'] && options['--out'] && Boolean(options['--input']) !== Boolean(options['--plan']), 'Choose input dry run or plan confirmation, plus snapshot and a new output directory.');
  const snapshot = JSON.parse(await readFile(resolve(options['--snapshot']), 'utf8'));
  const files = [];
  if (options['--input']) {
    assert(!options['--confirm'], 'Confirmation uses an existing reviewed plan.');
    const text = (await readFile(resolve(options['--input']), 'utf8')).replace(/^\uFEFF/, '').replace(/\r?\n$/, '');
    const plan = prepareGuests(text.split(/\r?\n/), snapshot);
    files.push(['plan.json',JSON.stringify(plan,null,2)],['preview.json',JSON.stringify({ accepted: plan.invitations.map((record,i)=>({name:record.group_label,reservedSeats:1,invitationId:record.invitation_id,nameId:plan.guestNames[i].name_id})), rejected:plan.rejected, confirmation:confirmationToken(plan), imported:false },null,2)]);
    console.log('Dry run prepared. Review private preview.json and plan.json. No records imported.');
  } else {
    const plan = JSON.parse(await readFile(resolve(options['--plan']), 'utf8'));
    const requests = confirmedRequests(plan,snapshot,options['--confirm']);
    files.push(['Invitations.csv',csv(invitationHeaders,plan.invitations)],['GuestNames.csv',csv(guestHeaders,plan.guestNames)],['batch-requests.json',JSON.stringify({spreadsheetId:plan.spreadsheetId,requests},null,2)]);
    console.log('Confirmed local import artifacts prepared. No records imported. Reverify the live sheet before any separately approved write.');
  }
  const output=resolve(options['--out']); await mkdir(dirname(output),{recursive:true}); await mkdir(output,{mode:0o700});
  for(const [name,text] of files) await writeFile(resolve(output,name),text+'\n',{flag:'wx',mode:0o600});
}
if(process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2)).catch(()=>{console.error('Preparation failed. Check input, snapshot, confirmation and a new output folder. No Google records were changed.');process.exitCode=1;});
