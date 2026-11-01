import test from 'node:test';
import assert from 'node:assert/strict';
import {nextTick} from 'vue';
import {backend} from './helpers/apps-script.mjs';
import {createRsvpApi} from '../src/services/rsvpApi.js';
import {useInvitationRsvp, validateDraft} from '../src/composables/useInvitationRsvp.js';
test('real API adapter and composable: lost receipt retry is frozen, first response final',async()=>{
 const b=backend();let lose=true;
 const api=createRsvpApi({endpoint:'https://script.google.com/macros/s/TEST/exec',fetchImpl:async(_,options)=>{const req=JSON.parse(options.body);const result=b.call(req);if(req.action==='submit'&&lose){lose=false;throw Error('lost');}return {ok:true,json:async()=>result};}});
 const f=useInvitationRsvp(api);f.lookupName.value='Dummy Guest';await f.startLookup();assert.equal(f.stage.value,'response');
 f.form.mobile='09123456789';f.form.attendance='accept';await nextTick();assert.equal(f.form.attending_count,1);assert.deepEqual(f.form.attendee_names,['Dummy Guest']);await f.submit();assert.ok(f.pending.value);assert.equal(f.frozen.value,true);
 const id=f.pending.value.request_id;f.form.mobile='09999999999';await f.submit();assert.equal(f.stage.value,'receipt');assert.equal(b.tables.Responses.length,2);assert.ok(id);assert.match(JSON.parse(b.tables.Responses[1][3]).message,/^Mobile number: 09123456789/);
 f.reset();f.lookupName.value='Dummy Guest';await f.startLookup();assert.equal(f.stage.value,'recorded');assert.equal(f.invitation.value,null);assert.deepEqual(f.form.attendee_names,[]);
});

test('individual frontend decline clears names and accepted name comes from the invitation',async()=>{
 const b=backend();const api=createRsvpApi({endpoint:'https://script.google.com/macros/s/TEST/exec',fetchImpl:async(_,o)=>({ok:true,json:async()=>b.call(JSON.parse(o.body))})});
 const f=useInvitationRsvp(api);f.lookupName.value='dummy guest';await f.startLookup();
 f.form.mobile='09123456789';f.form.attendance='accept';assert.deepEqual(f.form.attendee_names,['Dummy Guest']);
 f.form.attendance='decline';assert.equal(f.form.attending_count,0);assert.deepEqual(f.form.attendee_names,[]);
 await f.submit();assert.equal(b.tables.Responses[1][2],0);assert.deepEqual(JSON.parse(b.tables.Responses[1][3]).attendeeNames,[]);
});

test('mobile is required, digits-only and preserved as a string',()=>{
 const draft={attendance:'accept',attending_count:1,attendee_names:['Dummy Guest'],mobile:'',dietary_notes:'',activities:[],message:''};
 for(const mobile of ['', '09123abc789', '0912345678', '091234567890']) assert.match(validateDraft({...draft,mobile},1),/mobile number/);
 assert.equal(validateDraft({...draft,mobile:'09123456789'},1),'');
 assert.match(validateDraft({...draft,mobile:'09123456789',message:'x'.repeat(1961)},1),/shorten/);
});
