import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {backend, accepted, submission} from './helpers/apps-script.mjs';
test('unique normalized name, seats, first save, private repeat lookup and safe retry',()=>{
 const b=backend(); const session=b.verify('  DUMMY   Guest ').data; assert.equal(session.invitation.reservedSeats,1);
 const req=submission(session.sessionToken); const saved=b.call(req); assert.equal(saved.ok,true); const before=JSON.stringify(b.tables.Responses);
 assert.deepEqual(b.call(req),saved); assert.equal(JSON.stringify(b.tables.Responses),before);
 assert.equal(b.call({...req,response:{...accepted(),message:'changed'}}).error.code,'INVALID_INPUT');
 assert.equal(b.call(submission(session.sessionToken)).error.code,'ALREADY_SUBMITTED');
 assert.deepEqual(b.verify().data,{alreadySubmitted:true});
 assert.deepEqual(b.call({action:'status',sessionToken:session.sessionToken}).data,{alreadySubmitted:true});
 assert.equal(b.tables.Responses.length,2); assert.equal(b.locked,false);
});
test('decline saves zero; legacy updates flag does not forbid first response',()=>{
 const b=backend();b.tables.Invitations[1][7]=false;
 const token=b.verify().data.sessionToken;
 assert.equal(b.call(submission(token,{...accepted(0),attendance:'declined'})).ok,true);
 assert.equal(b.tables.Responses[1][2],0);
});
test('invalid names, count, duplicates, unknown and ambiguous names fail safely',()=>{
 const b=backend(); assert.equal(b.verify('Single').error.code,'INVALID_INPUT');assert.equal(b.verify('Unknown Person').error.code,'VERIFICATION_FAILED');
 const token=b.verify().data.sessionToken;
 for(const response of [{...accepted(),attendingCount:5},{...accepted(1),attendeeNames:['Single']},{...accepted(2),attendeeNames:['Dummy One',' dummy one ']}]) assert.equal(b.call(submission(token,response)).error.code,'INVALID_INPUT');
 b.tables.Invitations.push([...b.tables.Invitations[1]]);b.tables.Invitations[2][0]='other';b.tables.Invitations[2][4]='a'.repeat(64);
 b.tables.GuestNames.push(['other-name','other','Dummy Guest','dummy guest',true]);
 assert.equal(b.verify().error.code,'VERIFICATION_FAILED');assert.equal(b.tables.Responses.length,1);
});
test('duplicate response rows, expiry, lock contention, closed deadline and persistent limits',()=>{
 let b=backend();let t=b.verify().data.sessionToken;b.call(submission(t));b.tables.Responses.push([...b.tables.Responses[1]]);assert.equal(b.verify().error.code,'TEMPORARY_FAILURE');
 b=backend();t=b.verify().data.sessionToken;b.advance(31*60*1000);assert.equal(b.call(submission(t)).error.code,'SESSION_EXPIRED');
 b=backend();b.setLock(false);assert.equal(b.verify().error.code,'TEMPORARY_FAILURE');b.setLock(true);b.setNow('2026-11-16T00:00:00+08:00');t=b.verify().data.sessionToken;assert.equal(b.call(submission(t)).error.code,'RSVP_CLOSED');
 b=backend();for(let i=0;i<10;i++) b.verify();assert.equal(b.verify().error.code,'RATE_LIMITED');b.advance(11*60*1000);assert.equal(b.verify().ok,true);
});

test('expired state reuse preserves active sessions and rate rows',()=>{
 const b=backend();const t=b.verify().data.sessionToken;
 b.tables.SecurityState.push(['expired',JSON.stringify({old:true}),1]);
 const before=b.tables.SecurityState.length;
 assert.equal(b.verify('Unknown Person').error.code,'VERIFICATION_FAILED');
 assert.equal(b.tables.SecurityState.length,before);
 assert.equal(b.call(submission(t)).ok,true);
 assert.ok(b.tables.SecurityState.some(row=>String(row[0]).startsWith('session:')));
});

test('backend rejects extra attendees, substituted names and seat tampering',()=>{
 const b=backend();const token=b.verify().data.sessionToken;
 for(const response of [accepted(2),{...accepted(),attendeeNames:['Other Person']},{...accepted(),attendingCount:0}]) assert.equal(b.call(submission(token,response)).error.code,'INVALID_INPUT');
 b.tables.Invitations[1][3]=2;
 assert.equal(b.call(submission(token)).error.code,'VERIFICATION_FAILED');
 assert.equal(b.tables.Responses.length,1);
});
test('all four legacy responded invitations retain their records and private lookup compatibility',()=>{
 const b=backend();b.tables.Invitations.length=1;b.tables.GuestNames.length=1;
 for(const [i,seats] of [1,2,4,2].entries()){
 const id='legacy-'+i, name='Legacy Guest '+String.fromCharCode(65+i);
 b.tables.Invitations.push([id,name,seats===1?'individual':seats===2?'couple':'family',seats,String(i+1).repeat(64),1,true,true,'','']);
 b.tables.GuestNames.push(['legacy-name-'+i,id,name,name.toLowerCase(),true]);
 b.tables.Responses.push([id,'accepted',seats,JSON.stringify({private:'existing answers'}),3,'old-request','d'.repeat(64),'old','old']);
 }
 const before=JSON.stringify([b.tables.Invitations,b.tables.GuestNames,b.tables.Responses]);
 for(let i=0;i<4;i++) assert.deepEqual(b.verify('Legacy Guest '+String.fromCharCode(65+i)).data,{alreadySubmitted:true});
 assert.equal(JSON.stringify([b.tables.Invitations,b.tables.GuestNames,b.tables.Responses]),before);
});
test('unanswered group invitations and multiple primary mappings require owner help',()=>{
 const b=backend();b.tables.Invitations[1][2]='family';b.tables.Invitations[1][3]=4;
 assert.equal(b.verify().error.code,'VERIFICATION_FAILED');
 b.tables.Invitations[1][2]='individual';b.tables.Invitations[1][3]=1;
 b.tables.GuestNames.push(['another','inv-dummy','Different Person','different person',true]);
 assert.equal(b.verify().error.code,'VERIFICATION_FAILED');
});

test('owner snapshot helper is read-only and absent from public API dispatch',()=>{
 const b=backend();vm.runInContext(readFileSync(new URL('../apps-script/GuestImport.gs',import.meta.url),'utf8'),b.context);
 const before=JSON.stringify(b.tables);const snapshot=b.context.getGuestImportSnapshot_();assert.equal(snapshot.format,'wedding-guest-snapshot-v1');
 assert.equal(snapshot.invitations[1][3],1);assert.equal(Object.hasOwn(snapshot,'responses'),false);assert.equal(Object.hasOwn(snapshot,'secret'),false);assert.equal(JSON.stringify(b.tables),before);assert.equal(b.locked,false);
 assert.equal(b.call({action:'import'}).error.code,'INVALID_INPUT');
});
