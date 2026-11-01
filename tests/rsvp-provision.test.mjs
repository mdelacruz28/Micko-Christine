import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { prepareGuests, confirmedRequests, confirmationToken, invitationHeaders, guestHeaders } from '../apps-script/provision-invitations.mjs';
import { backend } from './helpers/apps-script.mjs';
import { normalizeGuestName, validGuestName } from '../src/utils/guestName.js';
const snapshot = () => {
 const b=backend();return { format:'wedding-guest-snapshot-v1',capturedAt:new Date().toISOString(),spreadsheetId:'dummy-sheet',sheetIds:{Invitations:0,GuestNames:1},invitations:b.tables.Invitations,guestNames:b.tables.GuestNames };
};
test('per-person dry run generates exactly one primary mapping and one seat per name; compatible with actual backend',()=>{
 const before=snapshot(), frozen=JSON.stringify(before);const plan=prepareGuests(['Dummy First','Dummy Second'],before);
 assert.equal(plan.rejected.length,0);assert.equal(plan.invitations.length,2);assert.equal(plan.guestNames.length,2);assert.equal(JSON.stringify(before),frozen);
 for(const [i,inv] of plan.invitations.entries()){
 assert.equal(inv.reserved_seats,1);assert.equal(inv.invitation_type,'individual');assert.equal(inv.updates_allowed,false);
 assert.equal(plan.guestNames[i].invitation_id,inv.invitation_id);assert.equal(plan.guestNames[i].display_name,inv.group_label);
 const b=backend();b.tables.Invitations.push(invitationHeaders.map(key=>inv[key]));b.tables.GuestNames.push(guestHeaders.map(key=>plan.guestNames[i][key]));
 assert.equal(b.verify(inv.group_label).data.invitation.reservedSeats,1);
 }
 const requests=confirmedRequests(plan,before,confirmationToken(plan));assert.equal(requests.length,2);
 assert.deepEqual(requests.map(r=>r.appendCells.sheetId),[0,1]);assert.equal(requests[0].appendCells.rows[0].values[3].userEnteredValue.numberValue,1);
 assert.equal(requests[0].appendCells.rows[0].values[6].userEnteredValue.boolValue,true);
});
test('dry run rejects blanks, unsafe names, normalized duplicates and disabled-sheet conflicts without partial import',()=>{
 const current=snapshot();current.guestNames[1][4]=false;
 const plan=prepareGuests(['','Single','=HYPERLINK("x")','@Dummy Person','Dummy\tPerson','Dummy\u200b Person','Dummy One','  DUMMY   ONE ','Dummy Guest','Safe Person'],current);
 assert.equal(plan.rejected.length,9);assert.equal(plan.invitations.length,1);
 assert.throws(()=>confirmedRequests(plan,current,confirmationToken(plan)),/rejected/);
 assert.equal(normalizeGuestName('  DUMMY   Guest '),'dummy guest');
 assert.equal(validGuestName('Jos\u00e9 O\u2019Brien'),true);
});
test('ID and digest collision handling retries boundedly and fails without writing',()=>{
 const current=snapshot();let n=0;const existing=current.invitations[1][0];
 const plan=prepareGuests(['Dummy New'],current,{uuid:()=>++n===1?existing:'new-'+n});
 assert.notEqual(plan.invitations[0].invitation_id,existing);assert.notEqual(plan.guestNames[0].name_id,plan.invitations[0].invitation_id);
 assert.throws(()=>prepareGuests(['Dummy New'],current,{uuid:()=>existing}),/collision/);
 assert.throws(()=>prepareGuests(['Dummy New'],current,{bytes:()=>Buffer.from(current.invitations[1][4],'hex')}),/collision/);
});
test('explicit reviewed digest and unchanged fresh snapshot required; tampered policy and wrong headers rejected',()=>{
 const current=snapshot(),plan=prepareGuests(['Dummy New'],current);
 assert.throws(()=>confirmedRequests(plan,current,''),/confirmation/);
 const changed=structuredClone(current);changed.guestNames.push(['extra','inv-dummy','Other Person','other person',true]);
 assert.throws(()=>confirmedRequests(plan,changed,confirmationToken(plan)),/changed/);
 const tampered=structuredClone(plan);tampered.invitations[0].reserved_seats=2;
 assert.throws(()=>confirmedRequests(tampered,current,confirmationToken(tampered)),/policy/);
 const wrong=structuredClone(current);wrong.invitations[0].reverse();assert.throws(()=>prepareGuests(['Dummy New'],wrong),/headers/);
});
test('CLI dry run emits private review only; explicit confirmation prepares files without network or overwriting',async()=>{
 const root=await mkdtemp(join(tmpdir(),'wedding-person-'));
 try {
 const current=snapshot(),snapshotPath=join(root,'snapshot.json'),input=join(root,'names.txt'),review=join(root,'review'),approved=join(root,'approved');
 await writeFile(snapshotPath,JSON.stringify(current));await writeFile(input,'Dummy New\n');
 const run=args=>spawnSync(process.execPath,['apps-script/provision-invitations.mjs',...args],{encoding:'utf8'});
 const dryArgs=['--input',input,'--snapshot',snapshotPath,'--out',review];const result=run(dryArgs);assert.equal(result.status,0);assert.equal(result.stdout.includes('Dummy New'),false);
 const preview=JSON.parse(await readFile(join(review,'preview.json'),'utf8'));assert.equal(preview.imported,false);assert.equal(preview.accepted.length,1);
 await assert.rejects(readFile(join(review,'Invitations.csv')));assert.equal(run(dryArgs).status,1);
 const confirmArgs=['--plan',join(review,'plan.json'),'--snapshot',snapshotPath,'--confirm',preview.confirmation,'--out',approved];assert.equal(run(confirmArgs).status,0);
 const batch=JSON.parse(await readFile(join(approved,'batch-requests.json'),'utf8'));assert.equal(batch.requests.length,2);assert.equal(batch.spreadsheetId,'dummy-sheet');
 assert.equal(run(['--dummy','--out',join(root,'fixture')]).status,1);
 assert.equal(await readFile(snapshotPath,'utf8'),JSON.stringify(current));
 } finally { await rm(root,{recursive:true,force:true}); }
});
