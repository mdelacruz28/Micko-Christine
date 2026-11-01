import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { backend, secret } from './apps-script.mjs';
import { importSnapshot } from '../../server/migration.js';
import { createRsvpService } from '../../server/rsvp.js';
import { RSVP_DEADLINE } from '../../src/config/rsvp.js';
export function dummySnapshot() {
 const b=backend();
 return {format:'wedding-rsvp-migration-v1',capturedAt:'2026-10-27T00:00:00Z',invitations:b.tables.Invitations,guest_names:b.tables.GuestNames,responses:b.tables.Responses};
}
export async function localBackend() {
 const db=new PGlite();
 await db.exec(await readFile(new URL('../../db/001-rsvp.sql',import.meta.url),'utf8'));
 let now=Date.parse('2026-10-27T12:00:00+08:00');
 const config={secret,deadline:RSVP_DEADLINE};
 const call=createRsvpService({database:db,config,now:()=>now});
 const reset=async(snapshot=dummySnapshot())=>{
  await db.exec('TRUNCATE security_state,responses,guest_names,invitations; UPDATE rsvp_control SET enabled=false');
  await importSnapshot(db,snapshot);
  await db.exec('UPDATE rsvp_control SET enabled=true');
  now=Date.parse('2026-10-27T12:00:00+08:00');
 };
 await reset();
 return {db,call,reset,config,setNow:value=>{now=Date.parse(value);},advance:ms=>{now+=ms;},verify:fullName=>call({version:2,action:'lookup',fullName:fullName||'Dummy Guest'})};
}
