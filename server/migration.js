import { createHash } from 'node:crypto';
import { fullName_, normalizeName_ } from './validation.js';
export const layouts = {
  invitations: ['invitation_id','group_label','invitation_type','reserved_seats','code_digest','code_version','active','updates_allowed','created_at','updated_at'],
  guest_names: ['name_id','invitation_id','display_name','normalized_name','lookup_enabled'],
  responses: ['invitation_id','attendance','attending_count','response_json','revision','last_request_id','last_payload_digest','submitted_at','updated_at']
};
const bad = () => { throw new Error('Invalid migration snapshot; check headers, types, unique IDs, mappings and responses.'); };
export function validateSnapshot(snapshot) {
  if (snapshot?.format !== 'wedding-rsvp-migration-v1' || !Number.isFinite(Date.parse(snapshot.capturedAt))) bad();
  const result={};
  for (const [table,headers] of Object.entries(layouts)) {
    const values=snapshot[table];
    if (!Array.isArray(values) || JSON.stringify(values[0]) !== JSON.stringify(headers)) bad();
    const ids=new Set();
    result[table]=values.slice(1).map(values => {
      if (!Array.isArray(values) || values.length !== headers.length) bad();
      const row=Object.fromEntries(headers.map((key,i)=>[key,values[i]]));
      if (typeof values[0] !== 'string' || !values[0] || ids.has(values[0])) bad();
      ids.add(values[0]);
      return row;
    });
  }
  const invitations=new Map(result.invitations.map(row=>[row.invitation_id,row]));
  const digests=new Set();
  for(const row of result.invitations) {
    if (!/^[a-zA-Z0-9-]{1,80}$/.test(row.invitation_id) || typeof row.group_label !== 'string' || !row.group_label.trim() || !['individual','couple','family'].includes(row.invitation_type) || !Number.isSafeInteger(row.reserved_seats) || row.reserved_seats<1 || row.reserved_seats>100 || typeof row.code_digest !== 'string' || !/^[a-f0-9]{64}$/.test(row.code_digest) || digests.has(row.code_digest) || !Number.isSafeInteger(row.code_version) || row.code_version<1 || typeof row.active!=='boolean' || typeof row.updates_allowed!=='boolean' || typeof row.created_at!=='string' || typeof row.updated_at!=='string') bad();
    digests.add(row.code_digest);
  }
  for(const row of result.guest_names) {
    if (!invitations.has(row.invitation_id) || typeof row.display_name !== 'string' || row.display_name.length>120 || !fullName_(row.display_name.normalize('NFKC').trim().replace(/\s+/g,' ')) || row.normalized_name!==normalizeName_(row.display_name) || typeof row.lookup_enabled!=='boolean') bad();
  }
  for(const row of result.responses) {
    if (!invitations.has(row.invitation_id) || !['accepted','declined'].includes(row.attendance) || !Number.isSafeInteger(row.attending_count) || row.attending_count<0 || row.attending_count>invitations.get(row.invitation_id).reserved_seats || (row.attendance==='declined')!==(row.attending_count===0) || !Number.isSafeInteger(row.revision) || row.revision<1 || ['response_json','last_request_id','last_payload_digest','submitted_at','updated_at'].some(k=>typeof row[k]!=='string')) bad();
    let payload; try { payload=JSON.parse(row.response_json); } catch { bad(); }
    if (!payload || typeof payload!=='object' || Array.isArray(payload)) bad();
  }
  const responded=new Set(result.responses.map(r=>r.invitation_id));
  const lookupNames=new Set();
  for (const row of result.guest_names.filter(r=>r.lookup_enabled && invitations.get(r.invitation_id).active)) {
    if (lookupNames.has(row.normalized_name)) bad();
    lookupNames.add(row.normalized_name);
  }
  for(const row of result.invitations.filter(r=>r.active && !responded.has(r.invitation_id))) {
    const names=result.guest_names.filter(r=>r.invitation_id===row.invitation_id);
    if (row.invitation_type!=='individual' || row.reserved_seats!==1 || names.length!==1 || !names[0].lookup_enabled || names[0].normalized_name!==normalizeName_(row.group_label)) bad();
  }
  return { rows:result, digest:createHash('sha256').update(JSON.stringify(snapshot)).digest('hex'), counts:Object.fromEntries(Object.entries(result).map(([k,v])=>[k,v.length])) };
}
export async function importSnapshot(database,snapshot) {
  const plan=validateSnapshot(snapshot);
  await database.transaction(async db=> {
    const control=(await db.query('SELECT enabled FROM rsvp_control WHERE id=1 FOR UPDATE')).rows[0];
    if (!control || control.enabled) throw new Error('Import requires a disabled database.');
    // Prevent concurrent table-editor writes as well as API writes during import.
    await db.query('LOCK TABLE invitations, guest_names, responses, security_state IN ACCESS EXCLUSIVE MODE');
    for(const table of [...Object.keys(layouts),'security_state']) {
      if ((await db.query(`SELECT count(*)::int AS n FROM ${table}`)).rows[0].n) throw new Error('Import requires empty tables; existing records were not changed.');
    }
    for (const [table,headers] of Object.entries(layouts)) {
      for(const row of plan.rows[table]) await db.query(`INSERT INTO ${table}(${headers.join(',')}) VALUES(${headers.map((_,i)=>'$'+(i+1)).join(',')})`,headers.map(key=>row[key]));
      const actual=(await db.query(`SELECT ${headers.join(',')} FROM ${table}`)).rows;
      const canonical=rows=>JSON.stringify(rows.map(r=>headers.map(k=>r[k])).sort((a,b)=>a[0].localeCompare(b[0])));
      if(canonical(actual)!==canonical(plan.rows[table])) throw new Error('Import verification failed.');
    }
  });
  return {digest:plan.digest,counts:plan.counts};
}
