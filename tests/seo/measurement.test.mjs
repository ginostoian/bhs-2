import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { persistContact, acceptedSubmission } from '../../libs/contactSubmission.js';
import { readTouchpoint, mergeAttribution, sanitizeAttribution } from '../../libs/marketingAttribution.js';
import { verifyCalSignature, confirmedBooking } from '../../libs/calWebhook.js';
import { buildOrganicReport } from '../../libs/organicReport.js';
const id = '2d38ce2d-0d0e-44dc-8f03-bcc4bb83c732';
function store() {
 const rows=new Map();
 return {rows, async create(data){ if(rows.has(data._id)) throw Object.assign(new Error('duplicate'),{code:11000}); rows.set(data._id,data);return data; }, findById(key){return {select:async()=>rows.get(key)}}};
}
test('simultaneous retries persist one contact and share the accepted event ID',async()=>{
 const model=store(), data={email:'test@example.test', message:'Test brief'};
 const results=await Promise.all([persistContact(model,data,id),persistContact(model,data,id)]);
 assert.equal(model.rows.size,1); assert.equal(results.filter(r=>r.duplicate).length,1);
 for(const result of results) assert.equal(acceptedSubmission(result.contact).eventId,id);
});
test('retry metadata changes do not duplicate a lead; changed content conflicts',async()=>{
 const model=store();await persistContact(model,{message:'A',ipAddress:'one'},id);
 assert.equal((await persistContact(model,{message:'A',ipAddress:'two'},id)).duplicate,true);
 await assert.rejects(persistContact(model,{message:'B'},id),e=>e.status===409);
 await assert.rejects(persistContact(model,{},'bad-id'),e=>e.status===400);
});
test('persistence failure cannot produce an accepted response',async()=>{
 await assert.rejects(persistContact({create:async()=>{throw new Error('database unavailable')}},{},id));
});
test('organic landing survives internal/direct visits without retaining queries or referrer',()=>{
 const initial=readTouchpoint('https://bhstudio.co.uk/blog/home-renovation-cost-london-2026?email=private@example.test','https://www.google.co.uk/search?q=private');
 assert.deepEqual(initial,{path:'/blog/home-renovation-cost-london-2026',source:'google',medium:'organic'});
 const first=mergeAttribution(null,initial);
 assert.deepEqual(mergeAttribution(first,readTouchpoint('https://bhstudio.co.uk/contact')),first);
 assert.equal(sanitizeAttribution({...first,email:'private@example.test'}).email,undefined);
 assert.equal(sanitizeAttribution({...first,consent:'rejected'}),undefined);
 assert.equal(readTouchpoint('https://bhstudio.co.uk/quotes/private-token'),null);
});
test('direct and unknown acquisition are never inferred to be organic',()=>{
 assert.equal(readTouchpoint('https://bhstudio.co.uk/').medium,'none');
 assert.equal(readTouchpoint('https://bhstudio.co.uk/?utm_source=private@example.test&utm_medium=cpc').medium,'unknown');
 assert.equal(readTouchpoint('https://bhstudio.co.uk/?utm_source=google&utm_medium=cpc&utm_campaign=private@example.test').campaign,undefined);
 assert.equal(sanitizeAttribution({consent:'accepted',firstLandingPath:'/contact?email=private@example.test'}),undefined);
});
test('Cal accepts only a signed confirmed discovery booking, not clicks/requests/reschedules',()=>{
 const payload={triggerEvent:'BOOKING_CREATED',payload:{type:'discovery',uid:'booking-one',startTime:'2026-10-01T12:00:00Z'}};
 const body=JSON.stringify(payload),signature=createHmac('sha256','test-secret').update(body).digest('hex');
 assert.equal(verifyCalSignature(body,signature,'test-secret'),true);
 assert.equal(verifyCalSignature(body+' ',signature,'test-secret'),false);
 assert.equal(verifyCalSignature(body,'bad','test-secret'),false);
 assert.equal(confirmedBooking(payload)._id,confirmedBooking(payload)._id);
 assert.equal(confirmedBooking({...payload,triggerEvent:'BOOKING_REQUESTED'}),null);
 assert.equal(confirmedBooking({...payload,payload:{...payload.payload,rescheduleUid:'previous'}}),null);
});
test('cohort report deduplicates outcomes and keeps sessions unavailable',()=>{
 const attribution={medium:'organic',firstLandingPath:'/blog/home-renovation-cost-london-2026'};
 const contacts=[{attribution,leadId:'one'},{attribution,leadId:'one'},{}];
 const report=buildOrganicReport(contacts,[{_id:'one',attribution,stage:'Won',value:100000}],[{leadId:'one'}]);
 assert.equal(report.acceptedEnquiries,3);assert.equal(report.rows[0].enquiries,2);
 assert.equal(report.rows[0].qualifiedLeads,1);assert.equal(report.rows[0].wonValue,100000);
 assert.equal(report.rows[0].confirmedBookings,1);assert.equal(report.organicLandingSessions,null);
 assert.equal(report.qualifiedEnquiryRate,null);
});
