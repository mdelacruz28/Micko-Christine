import test,{after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import { localBackend,dummySnapshot } from './helpers/neon.mjs';
import { accepted,submission } from './helpers/apps-script.mjs';
import { createRsvpApi } from '../src/services/rsvpApi.js';
import { createHandler } from '../api/rsvp.js';
import { configuration } from '../server/rsvp.js';
import { validateSnapshot,importSnapshot } from '../server/migration.js';
const b=await localBackend();
after(()=>b.db.close());
beforeEach(()=>b.reset());
const submit=(token,fields={})=>b.call({version:2,...submission(token),...fields});

test('SQL acceptance, canonical name, private repeat and idempotent retries',async()=>{
 const lookup=await b.verify('  DUMMY  Guest ');assert.equal(lookup.ok,true);
 const req={version:2,...submission(lookup.data.sessionToken)};
 const saved=await b.call(req);assert.equal(saved.ok,true);
 assert.deepEqual(await b.call(req),saved);
 assert.equal((await b.call({...req,response:{...accepted(),message:'changed'}})).error.code,'INVALID_INPUT');
 assert.equal((await submit(req.sessionToken)).error.code,'ALREADY_SUBMITTED');
 assert.deepEqual((await b.verify()).data,{alreadySubmitted:true});
 assert.deepEqual((await b.call({version:2,action:'status',sessionToken:req.sessionToken})).data,{alreadySubmitted:true});
 const rows=(await b.db.query('SELECT * FROM responses')).rows;assert.equal(rows.length,1);
 assert.deepEqual(JSON.parse(rows[0].response_json).attendeeNames,['Dummy Guest']);
});
test('parallel calls return one first write and stable receipts for identical retries',async()=>{
 const token=(await b.verify()).data.sessionToken;
 const req={version:2,...submission(token)};
 const results=await Promise.all(Array.from({length:8},()=>b.call(req)));
 assert.ok(results.every(r=>r.ok));assert.ok(results.every(r=>JSON.stringify(r)===JSON.stringify(results[0])));
 assert.equal((await b.db.query('SELECT count(*)::int AS n FROM responses')).rows[0].n,1);
 await assert.rejects(()=>b.db.query('INSERT INTO responses SELECT * FROM responses'));
});
test('decline, immutable response, seat/name tampering, revision conflicts',async()=>{
 const token=(await b.verify()).data.sessionToken;
 for(const response of [{...accepted(),attendingCount:2},{...accepted(),attendeeNames:['Other Person']},{...accepted(),acknowledged:false}]) assert.equal((await submit(token,{response})).error.code,'INVALID_INPUT');
 assert.equal((await submit(token,{expectedRevision:1})).error.code,'REVISION_CONFLICT');
 assert.equal((await submit(token,{response:{...accepted(0),attendance:'declined'}})).ok,true);
 const row=(await b.db.query('SELECT * FROM responses')).rows[0];assert.equal(row.attending_count,0);assert.equal(row.attendance,'declined');
});
test('unknown/ambiguous names, disabled invitation and expired session fail closed',async()=>{
 assert.equal((await b.verify('Single')).error.code,'INVALID_INPUT');
 assert.equal((await b.verify('Unknown Guest')).error.code,'VERIFICATION_FAILED');
 const token=(await b.verify()).data.sessionToken;b.advance(1800001);
 assert.equal((await submit(token)).error.code,'SESSION_EXPIRED');
 await b.db.query('UPDATE invitations SET active=false');assert.equal((await b.verify()).error.code,'VERIFICATION_FAILED');
});
test('persistent failed lookup rate limits survive new requests',async()=>{
 for(let i=0;i<10;i++) assert.equal((await b.verify('Unknown Guest')).error.code,'VERIFICATION_FAILED');
 assert.equal((await b.verify('Unknown Guest')).error.code,'RATE_LIMITED');
 b.advance(600001);assert.equal((await b.verify('Unknown Guest')).error.code,'VERIFICATION_FAILED');
});
test('exact approved deadline and receipt retry after cutoff',async()=>{
 b.setNow('2026-11-15T23:59:59+08:00');
 const token=(await b.verify()).data.sessionToken;const req={version:2,...submission(token)};
 const saved=await b.call(req);assert.equal(saved.ok,true);b.advance(1);assert.deepEqual(await b.call(req),saved);
 await b.reset();b.setNow('2026-11-16T00:00:00+08:00');
 const lookup=await b.verify();assert.equal(lookup.data.canEdit,false);assert.equal((await submit(lookup.data.sessionToken)).error.code,'RSVP_CLOSED');
});
test('SQL error rolls back inserted response and returns no sensitive details',async()=>{
 const token=(await b.verify()).data.sessionToken;
 await b.db.exec("CREATE FUNCTION reject_response() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'private database detail'; END $$; CREATE TRIGGER reject_response BEFORE INSERT ON responses FOR EACH ROW EXECUTE FUNCTION reject_response();");
 const result=await submit(token);assert.equal(result.error.code,'TEMPORARY_FAILURE');assert.ok(!JSON.stringify(result).includes('private database'));
 assert.equal((await b.db.query('SELECT count(*)::int AS n FROM responses')).rows[0].n,0);
 await b.db.exec('DROP TRIGGER reject_response ON responses; DROP FUNCTION reject_response()');
});
test('legacy responses imported byte-for-byte and hidden from name lookup',async()=>{
 const snapshot=dummySnapshot();snapshot.invitations[1][2]='family';snapshot.invitations[1][3]=4;
 const row=['inv-dummy','accepted',4,'{ "private": "historical answers" }',3,'legacy-request','d'.repeat(64),'original time','original updated time'];
 snapshot.responses.push(row);await b.reset(snapshot);
 assert.deepEqual((await b.verify()).data,{alreadySubmitted:true});
 const saved=(await b.db.query('SELECT * FROM responses')).rows[0];assert.equal(saved.response_json,row[3]);assert.equal(saved.revision,3);assert.equal(saved.updated_at,row[8]);
});
test('snapshot rejects duplicates, invalid mappings, orphan data and nonempty import',async()=>{
 for(const mutate of [s=>s.invitations.push([...s.invitations[1]]),s=>s.guest_names[1][1]='orphan',s=>s.guest_names[1][3]='wrong',s=>s.invitations[1][6]='true',s=>s.invitations[1][3]=4]) {
  const snapshot=dummySnapshot();mutate(snapshot);assert.throws(()=>validateSnapshot(snapshot));
 }
 await assert.rejects(()=>importSnapshot(b.db,dummySnapshot()));
 await b.db.exec('UPDATE rsvp_control SET enabled=false');
 await assert.rejects(()=>importSnapshot(b.db,dummySnapshot()));
 assert.equal((await b.db.query('SELECT count(*)::int AS n FROM invitations')).rows[0].n,1);
});
test('same-origin frontend adapter handles lost receipt and rejects arbitrary URLs',async()=>{
 let lost=true;
 const api=createRsvpApi({endpoint:'/api/rsvp',fetchImpl:async(url,options)=>{
  assert.equal(url,'/api/rsvp');assert.equal(options.headers['Content-Type'],'application/json');
  const req=JSON.parse(options.body);const result=await b.call(req);
  if(req.action==='submit'&&lost){lost=false;throw new Error('lost connection');}
  return {ok:true,json:async()=>result};
 }});
 const s=await api.lookup('Dummy Guest');
 const fields={session_token:s.session_token,request_id:'retry-id-12345678901234567890',response:{attendance:'accept',attending_count:1,attendee_names:['Dummy Guest'],dietary_notes:'',activities:[],message:'',mobile:'09123456789'}};
 await assert.rejects(()=>api.submit(fields),e=>e.code==='NETWORK');assert.equal((await api.submit(fields)).saved,true);
 assert.deepEqual(await api.lookup('Dummy Guest'),{alreadySubmitted:true});
 for(const endpoint of ['//evil.example/api/rsvp','https://evil.example/api/rsvp','/api/rsvp?other=1']) await assert.rejects(()=>createRsvpApi({endpoint}).lookup('Dummy Guest'),e=>e.code==='CONFIG');
});
test('HTTP method, content type, cross-site, malformed input, size and private errors',async()=>{
 const handler=createHandler({service:b.call});
 const send=async overrides=>{
  const req={method:'POST',headers:{'content-type':'application/json'},body:{version:2,action:'lookup',fullName:'Dummy Guest'},...overrides};
  const res={statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;},end(s){this.body=JSON.parse(s);}};
  await handler(req,res);return res;
 };
 assert.equal((await send({})).body.ok,true);
 assert.equal((await send({method:'GET'})).statusCode,405);
 assert.equal((await send({headers:{'content-type':'text/plain'}})).statusCode,403);
 assert.equal((await send({headers:{'content-type':'application/json','sec-fetch-site':'cross-site'}})).statusCode,403);
 assert.equal((await send({body:'x'.repeat(16385)})).statusCode,413);
 assert.equal((await send({body:'{'})).body.error.code,'INVALID_INPUT');
 const res=await send({body:{version:2,action:'admin'}});assert.equal(res.body.error.code,'INVALID_INPUT');assert.equal(res.headers['Cache-Control'],'no-store');
});
test('server configuration and database launch gate default closed',async()=>{
 assert.throws(()=>configuration({}));
 assert.throws(()=>configuration({RSVP_DISABLED:'false',HMAC_SECRET:'x'.repeat(48),RSVP_DEADLINE:'2030-01-01T00:00:00Z'}));
 await b.db.exec('UPDATE rsvp_control SET enabled=false');assert.equal((await b.verify()).error.code,'TEMPORARY_FAILURE');
});

test('ambiguous active names and changed invitation version reject access',async()=>{
 const token=(await b.verify()).data.sessionToken;
 await b.db.query('UPDATE invitations SET code_version=2');
 assert.equal((await submit(token)).error.code,'SESSION_EXPIRED');
 await b.db.query("INSERT INTO invitations SELECT 'other',group_label,invitation_type,reserved_seats,$1,code_version,active,updates_allowed,created_at,updated_at FROM invitations",['a'.repeat(64)]);
 await b.db.query("INSERT INTO guest_names SELECT 'other-name','other',display_name,normalized_name,lookup_enabled FROM guest_names");
 assert.equal((await b.verify()).error.code,'VERIFICATION_FAILED');
});
test('different simultaneous request IDs save exactly one response',async()=>{
 const token=(await b.verify()).data.sessionToken;
 const results=await Promise.all(Array.from({length:6},()=>submit(token)));
 assert.equal(results.filter(r=>r.ok).length,1);
 assert.equal(results.filter(r=>r.error?.code==='ALREADY_SUBMITTED').length,5);
});
test('node-postgres adapter uses one checked-out client and always releases/rolls back',async()=>{
 const {postgresDatabase}=await import('../server/database.js');
 const calls=[];const client={query:async sql=>{calls.push(sql);},release:()=>calls.push('release')};
 const database=postgresDatabase({connect:async()=>client});
 assert.equal(await database.transaction(async db=>{assert.equal(db,client);return 42;}),42);
 assert.deepEqual(calls,['BEGIN',"SET LOCAL lock_timeout = '5s'",'COMMIT','release']);
 calls.length=0;await assert.rejects(()=>database.transaction(async()=>{throw new Error('failure');}));
 assert.deepEqual(calls,['BEGIN',"SET LOCAL lock_timeout = '5s'",'ROLLBACK','release']);
});
