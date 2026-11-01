import test from 'node:test';
import assert from 'node:assert/strict';
import {backend} from './helpers/apps-script.mjs';
import {createRsvpApi} from '../src/services/rsvpApi.js';
import {useInvitationRsvp,validateDraft} from '../src/composables/useInvitationRsvp.js';
import {encodeResponseMessage,decodeResponseMessage} from '../src/utils/rsvpDetails.js';
function fixture(lose=false){
 const b=backend();const requests=[];let lost=false;
 const api=createRsvpApi({endpoint:'https://script.google.com/macros/s/TEST/exec',fetchImpl:async(_,o)=>{
  const request=JSON.parse(o.body);requests.push(request);const result=b.call(request);
  if(lose&&!lost&&request.action==='submit'){lost=true;throw Error('lost receipt')}
  return {ok:true,json:async()=>result};
 }});
 return {b,requests,flow:useInvitationRsvp(api)};
}
async function lookup(flow){flow.lookupName.value='Dummy Guest';await flow.startLookup()}
test('all four activities and distinct notes survive actual backend validation, readback, and lost-receipt retry',async()=>{
 const {b,requests,flow:f}=fixture(true);await lookup(f);
 Object.assign(f.form,{attendance:'accept',mobile:'09123456789',dietary_notes:'Peanuts & seafood',activities:['dance','karaoke','games','photos'],special_requests:'Accommodation: "garden room"\nTransport C:\\hotel\\pickup 🩵',message:'See you!\nLiteral \\n and "quotes"'});
 const expected=decodeResponseMessage(encodeResponseMessage(f.form));
 await f.submit();assert.ok(f.pending.value);assert.notEqual(f.stage.value,'receipt');
 const frozen=structuredClone(JSON.parse(JSON.stringify(f.pending.value)));
 f.form.special_requests='Changed after send';f.form.activities=[];f.form.mobile='09999999999';
 await f.submit();assert.equal(f.stage.value,'receipt');assert.equal(b.tables.Responses.length,2);
 const submits=requests.filter(r=>r.action==='submit');assert.deepEqual(submits[0],submits[1]);
 assert.equal(submits[1].requestId,frozen.request_id);
 const saved=JSON.parse(b.tables.Responses[1][3]);assert.equal(saved.dietaryRestrictions,'Peanuts & seafood');
 assert.deepEqual(saved.activities,['karaoke','photos']);assert.deepEqual(decodeResponseMessage(saved.message),expected);
 assert.deepEqual(expected.activities,['dance','games','karaoke','photos']);assert.equal(f.form.mobile,'09123456789');
 assert.notEqual(expected.specialRequests,expected.message);
});
test('decline needs no mobile, saves only decline note, and clears hidden acceptance fields',async()=>{
 const {b,flow:f}=fixture();await lookup(f);f.form.attendance='accept';
 Object.assign(f.form,{mobile:'09123456789',dietary_notes:'nuts',activities:['dance','games'],special_requests:'transport',message:'accepted message'});
 f.form.attendance='decline';f.form.decline_note='Sorry, out of town.\nWith love.';
 assert.equal(f.form.mobile,'');assert.deepEqual(f.form.activities,[]);assert.equal(f.form.special_requests,'');assert.equal(f.form.message,'');
 assert.equal(validateDraft(f.form,1),'');await f.submit();assert.equal(f.stage.value,'receipt');
 const saved=JSON.parse(b.tables.Responses[1][3]);assert.equal(saved.attendingCount,0);assert.equal(saved.dietaryRestrictions,'');assert.deepEqual(saved.activities,[]);
 assert.deepEqual(decodeResponseMessage(saved.message),{mobile:'',declineNote:'Sorry, out of town.\nWith love.'});
});
test('switching back to accept clears decline note and requires contact; escaped payload size is enforced',async()=>{
 const {flow:f}=fixture();await lookup(f);assert.match(validateDraft(f.form,1),/choose/);
 f.form.attendance='decline';f.form.decline_note='private decline';f.form.attendance='accept';
 assert.equal(f.form.decline_note,'');assert.match(validateDraft(f.form,1),/mobile/);
 f.form.mobile='09123456789';f.form.special_requests='"'.repeat(500);f.form.message='"'.repeat(1000);
 assert.match(validateDraft(f.form,1),/shorten/);
 f.form.special_requests='';f.form.message='';f.form.activities=['dance','dance'];assert.match(validateDraft(f.form,1),/preferences/);
});
test('legacy message parsing remains readable',()=>{
 assert.deepEqual(decodeResponseMessage('Mobile number: 09123456789\n\nLegacy message'),{mobile:'09123456789',legacyMessage:'Legacy message'});
 assert.deepEqual(decodeResponseMessage('Old note with "quotes"\nNext line'),{mobile:'',legacyMessage:'Old note with "quotes"\nNext line'});
});
