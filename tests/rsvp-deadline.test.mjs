import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { backend, submission } from './helpers/apps-script.mjs';
import { RSVP_DEADLINE, formatDeadline } from '../src/config/rsvp.js';
const cutoff=Date.parse(RSVP_DEADLINE);
test('approved cutoff accepts immediately before and at cutoff, rejects immediately after in absolute time',()=>{
 for(const [offset,expected]of [[-1,true],[0,true],[1,false]]){
  const b=backend();b.setNow(new Date(cutoff+offset).toISOString());const view=b.verify();assert.equal(view.ok,true);assert.equal(view.data.deadline,RSVP_DEADLINE);assert.equal(view.data.canEdit,expected);
  const result=b.call(submission(view.data.sessionToken));assert.equal(result.ok,expected);if(!expected)assert.equal(result.error.code,'RSVP_CLOSED');assert.equal(b.tables.Responses.length,expected?2:1);
 }
 assert.equal(cutoff,Date.parse('2026-11-15T15:59:59Z'));
});
test('in-flight invitation is rechecked after the cutoff and existing response stays immutable',()=>{
 let b=backend();b.setNow(new Date(cutoff-1000).toISOString());let token=b.verify().data.sessionToken;b.advance(1001);assert.equal(b.call(submission(token)).error.code,'RSVP_CLOSED');assert.equal(b.tables.Responses.length,1);
 b=backend();b.setNow(new Date(cutoff-1000).toISOString());token=b.verify().data.sessionToken;const req=submission(token),saved=b.call(req);assert.equal(saved.ok,true);const before=JSON.stringify(b.tables.Responses);
 b.advance(1001);assert.deepEqual(b.call(req),saved);assert.equal(b.call(submission(token)).error.code,'ALREADY_SUBMITTED');assert.deepEqual(b.verify().data,{alreadySubmitted:true});assert.equal(JSON.stringify(b.tables.Responses),before);
});
test('source default is approved; mismatched Script Property cannot extend the deadline',()=>{
 const b=backend();delete b.properties.RSVP_DEADLINE;assert.equal(b.verify().data.deadline,RSVP_DEADLINE);
 b.properties.RSVP_DEADLINE='2026-12-01T23:59:59+08:00';assert.equal(b.verify().error.code,'TEMPORARY_FAILURE');assert.equal(b.tables.Responses.length,1);
});
test('Philippine display and backend deadline are independent of host timezone',()=>{
 const code="import {formatDeadline} from './src/config/rsvp.js'; import {backend,submission} from './tests/helpers/apps-script.mjs'; const b=backend();b.setNow('2026-11-15T16:00:00Z');const token=b.verify().data.sessionToken;console.log(JSON.stringify({label:formatDeadline(),code:b.call(submission(token)).error.code}));";
 for(const zone of ['UTC','America/Los_Angeles','Asia/Tokyo']){
  const result=spawnSync(process.execPath,['--input-type=module','-e',code],{encoding:'utf8',env:{...process.env,TZ:zone}});assert.equal(result.status,0);const value=JSON.parse(result.stdout);assert.equal(value.label,formatDeadline());assert.match(value.label,/November 15, 2026/);assert.match(value.label,/11:59 PM Philippine Time/);assert.equal(value.code,'RSVP_CLOSED');
 }
});
