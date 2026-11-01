import test from 'node:test';
import assert from 'node:assert/strict';
import { backend } from './helpers/apps-script.mjs';
import { reviewGuestList,guestListHeaders } from '../apps-script/guest-list-workflow.mjs';
import { confirmedRequests,confirmationToken,invitationHeaders,guestHeaders } from '../apps-script/provision-invitations.mjs';
const snapshot=()=>{const b=backend();return {format:'wedding-guest-snapshot-v1',capturedAt:new Date().toISOString(),spreadsheetId:'dummy-sheet',sheetIds:{Invitations:0,GuestNames:1},invitations:b.tables.Invitations,guestNames:b.tables.GuestNames,guestList:{sheetId:9,formulaRows:[],rows:[guestListHeaders,[1,'Dummy First','Needs Review','Not Imported','Owner note'],[2,'Dummy Second','','','']]}};};
test('Guest List uses canonical validation, preserves notes/names, and generates one-seat private preview only',()=>{
 const current=snapshot(),before=JSON.stringify(current),review=reviewGuestList(current);
 assert.equal(JSON.stringify(current),before);assert.deepEqual(review.statuses.map(r=>r.validation),['Valid','Valid']);assert.deepEqual(review.statuses.map(r=>r.importStatus),['Ready','Ready']);
 assert.equal(review.imported,false);assert.equal(review.plan.invitations.length,2);assert.ok(review.plan.invitations.every(r=>r.reserved_seats===1));
 for(const request of review.statusRequests){assert.equal(request.updateCells.range.sheetId,9);assert.equal(request.updateCells.range.startColumnIndex,2);assert.equal(request.updateCells.range.endColumnIndex,4);}
 assert.equal(confirmedRequests(review.plan,current,review.confirmation).length,2);
 const changed=structuredClone(current);changed.guestList.rows[1][1]='Changed Person';assert.throws(()=>confirmedRequests(review.plan,changed,review.confirmation),/Guest List names changed/);
});
test('duplicates, invalid names and disabled-mapping conflicts are never labelled Valid or Imported',()=>{
 const current=snapshot();current.guestNames[1][4]=false;current.guestList.rows=[guestListHeaders,[1,'Dummy Guest'],[2,'New Person'],[3,' NEW   PERSON '],[4,'=formula'],[5,'']];
 const review=reviewGuestList(current);assert.deepEqual(review.statuses.map(r=>r.validation),['Needs Review','Duplicate','Duplicate','Invalid','Needs Review']);
 assert.ok(review.statuses.every(r=>r.importStatus!=='Imported'));assert.equal(review.plan,null);
});
test('Imported requires both exact approved IDs verified in actual snapshot; partial and changed records fail',()=>{
 const current=snapshot(),review=reviewGuestList(current),plan=review.plan;
 assert.ok(reviewGuestList(current,plan).statuses.every(r=>r.importStatus==='Error'));
 current.invitations.push(...plan.invitations.map(record=>invitationHeaders.map(key=>record[key])));
 assert.ok(reviewGuestList(current,plan).statuses.every(r=>r.importStatus==='Error'));
 current.guestNames.push(...plan.guestNames.map(record=>guestHeaders.map(key=>record[key])));
 assert.deepEqual(reviewGuestList(current,plan).statuses.map(r=>r.importStatus),['Imported','Imported']);
 current.invitations.at(-1)[3]=2;
 assert.equal(reviewGuestList(current,plan).statuses.at(-1).importStatus,'Error');
});

test('formula-backed displayed names are invalid and cannot be confirmed as literal names',()=>{
 const current=snapshot();current.guestList.formulaRows=[2];const review=reviewGuestList(current);assert.equal(review.statuses[0].validation,'Invalid');assert.equal(review.statuses[0].importStatus,'Error');
 assert.throws(()=>confirmedRequests(review.plan,current,review.confirmation),/rejected/);
});
