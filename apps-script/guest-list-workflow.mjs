import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validGuestName, normalizeGuestName } from '../src/utils/guestName.js';
import { inspectSnapshot, prepareGuests, confirmationToken, invitationHeaders, guestHeaders, guestListFingerprint } from './provision-invitations.mjs';
export const guestListHeaders = ['No.', 'Full Name', 'Validation Status', 'Import Status', 'Notes'];
const assert = (ok,message) => { if (!ok) throw Error(message); };
const same = (actual,expected) => typeof expected === 'boolean' ? String(actual).toLowerCase() === String(expected) : String(actual) === String(expected);
export function reviewGuestList(snapshot, reconciledPlan = null) {
 const existing=inspectSnapshot(snapshot), list=snapshot.guestList;
 assert(list && Number.isSafeInteger(list.sheetId) && Array.isArray(list.rows) && Array.isArray(list.formulaRows) && JSON.stringify(list.rows[0])===JSON.stringify(guestListHeaders),'Read the exact Guest List tab and headers into the private snapshot.');
 const entries=list.rows.slice(1).map((row,i)=>({row:i+2,name:String(row[1]??'')}));
 const counts=new Map();for(const entry of entries)if(validGuestName(entry.name)){const key=normalizeGuestName(entry.name);counts.set(key,(counts.get(key)||0)+1);}
 const ready=[],rejected=[],statuses=[];
 for(const entry of entries){
  let validation='Needs Review', importStatus='Not Imported', reason='Enter a full name, then run owner validation.';
  const name=entry.name, normalized=normalizeGuestName(name);
  if(name.trim()){
   if((list.formulaRows || []).includes(entry.row) || !validGuestName(name)){validation='Invalid';importStatus='Error';reason='Enter a complete valid first and last name; control and formula-like values are not allowed.';}
   else if(counts.get(normalized)>1){validation='Duplicate';importStatus='Error';reason='Duplicate normalized name within Guest List; resolve both rows.';}
   else {
    const index=reconciledPlan?.guestNames?.findIndex(record=>record.normalized_name===normalized)??-1;
    if(index>=0){
     const inv=reconciledPlan.invitations[index],guest=reconciledPlan.guestNames[index];
     const invitations=existing.invitations.filter(row=>row[0]===inv.invitation_id), mappings=existing.guestNames.filter(row=>row[0]===guest.name_id);
     const sameInv=invitations.length===1 && invitationHeaders.every((key,i)=>same(invitations[0][i],inv[key]));
     const sameGuest=mappings.length===1 && guestHeaders.every((key,i)=>same(mappings[0][i],guest[key]));
     const primaryCount=existing.guestNames.filter(row=>row[1]===inv.invitation_id).length;
     const normalizedCount=existing.guestNames.filter(row=>normalizeGuestName(String(row[2]))===normalized).length;
     if(sameInv&&sameGuest&&primaryCount===1&&normalizedCount===1&&inv.invitation_type==='individual'&&inv.reserved_seats===1&&guest.lookup_enabled===true&&inv.active===true){validation='Valid';importStatus='Imported';reason='Both exact approved IDs and canonical one-seat records verified in a fresh live snapshot.';}
     else {validation='Needs Review';importStatus='Error';reason='Approved records are absent, partial, changed or ambiguous. Reconcile before any retry.';}
    }else if(existing.names.has(normalized)){validation='Needs Review';importStatus='Error';reason='Conflicts with an existing invitation or GuestNames mapping, including disabled records.';}
    else {validation='Valid';importStatus='Ready';reason='Canonical validation and existing-name conflict checks passed. Not imported; separate owner approval required.';ready.push(entry);}
   }
   if(importStatus==='Error')rejected.push({row:entry.row,reason});
  }
  statuses.push({...entry,validation,importStatus,reason});
 }
 let plan=null;
 if(ready.length){
  plan=prepareGuests(ready.map(entry=>entry.name),snapshot);
  plan.sourceGuestList={sheetId:list.sheetId,fingerprint:guestListFingerprint(list),rows:ready.map(entry=>entry.row)};
  plan.rejected=rejected;plan.inputCount=plan.invitations.length+rejected.length;
 }
 const statusRequests=statuses.map(entry=>({updateCells:{range:{sheetId:list.sheetId,startRowIndex:entry.row-1,endRowIndex:entry.row,startColumnIndex:2,endColumnIndex:4},rows:[{values:[{userEnteredValue:{stringValue:entry.validation},note:entry.reason},{userEnteredValue:{stringValue:entry.importStatus},note:entry.reason}]}],fields:'userEnteredValue,note'}}));
 return {statuses,plan,confirmation:plan?confirmationToken(plan):null,statusRequests,imported:false};
}
async function main(args){
 if(args.length===1&&args[0]==='--help'){console.log('node apps-script/guest-list-workflow.mjs --snapshot private-rsvp/current-snapshot.json --out private-rsvp/guest-list-review-001 [--reconcile private-rsvp/approved-plan.json]\nReads local snapshots only. Produces private validation/status requests and an import plan; performs no live writes.');return;}
 const options={};for(let i=0;i<args.length;i+=2){assert(['--snapshot','--out','--reconcile'].includes(args[i])&&!options[args[i]]&&args[i+1],'Invalid arguments.');options[args[i]]=args[i+1];}
 assert(options['--snapshot']&&options['--out'],'Supply a fresh private snapshot and a new output directory.');
 const snapshot=JSON.parse(await readFile(resolve(options['--snapshot']),'utf8'));
 const previous=options['--reconcile']?JSON.parse(await readFile(resolve(options['--reconcile']),'utf8')):null;
 const review=reviewGuestList(snapshot,previous);const output=resolve(options['--out']);await mkdir(output,{recursive:false,mode:0o700});
 for(const [name,value]of [['preview.json',{statuses:review.statuses,confirmation:review.confirmation,imported:false}],['status-requests.json',{spreadsheetId:snapshot.spreadsheetId,sourceGuestListFingerprint:guestListFingerprint(snapshot.guestList),requests:review.statusRequests}],...(review.plan?[['plan.json',review.plan]]:[])]) await writeFile(resolve(output,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log('Private Guest List review prepared. No Google status or guest record was written.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main(process.argv.slice(2)).catch(()=>{console.error('Guest List review failed. Check snapshot, plan and a new private output directory. No Google data changed.');process.exitCode=1;});
