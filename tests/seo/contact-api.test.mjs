import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import * as submissions from '../../libs/contactSubmission.js';
import * as attribution from '../../libs/marketingAttribution.js';
import * as qualification from '../../libs/enquiryFields.js';
const require=createRequire(import.meta.url);
const {transform}=require('next/dist/build/swc');
const {code}=await transform(await fs.readFile(new URL('../../app/api/contact/route.js',import.meta.url),'utf8'),{filename:'route.js',jsc:{parser:{syntax:'ecmascript'}},module:{type:'commonjs'}});
function harness({failSave=false,failLeadOnce=false}={}) {
 const contacts=new Map(),leads=new Map();let emails=0,notifications=0;
 const Contact={async create(data){
   if(failSave)throw new Error('isolated database failure');
   if(contacts.has(data._id))throw Object.assign(new Error('duplicate'),{code:11000});
   const c={...data,createdAt:new Date(),save:async()=>{}};contacts.set(c._id,c);return c;
 },findById(id){return {select:async()=>contacts.get(id)}}};
 const Lead={findOne(query){return {select:async()=>[...leads.values()].find(x=>x.email===query.email)}},async findOneAndUpdate(query,update){if(failLeadOnce){failLeadOnce=false;throw new Error("isolated CRM failure")};if(!leads.has(query._id))leads.set(query._id,{_id:query._id,...update.$setOnInsert});return leads.get(query._id)}};
 const dependencies={
  'next/server':require('next/server'), '@/libs/mongoose':async()=>{}, '@/models/Contact':Contact,'@/models/Lead':Lead,
  '@/libs/contactSubmission':submissions,'@/libs/marketingAttribution':attribution,'@/libs/enquiryFields':qualification,
  '@/libs/emailService':{sendEmailWithRetry:async()=>{emails++;return {success:true}}},
  '@/libs/notificationService':{notifyAdminFormSubmission:async()=>{notifications++}},
  '@/libs/rateLimiter':{rateLimitMiddleware:handler=>handler},
  '@/libs/referrals':{findPartnerByReferralCode:async()=>null,syncPartnerReferralFromLead:async()=>{}},
 };
 const exports={};vm.runInNewContext(code,{exports,require:name=>{if(!(name in dependencies))throw new Error('Unexpected dependency '+name);return dependencies[name]},console:{error(){},warn(){}}});
 return {contacts,leads,counts:()=>({emails,notifications}),post:body=>exports.POST({json:async()=>body,headers:new Headers(),cookies:{get:()=>undefined}})};
}
const data={firstName:'Test',lastName:'Homeowner',email:'test@example.test',topic:'New Project',message:'Isolated test enquiry',submissionEventId:'28c7261e-5c42-4f4c-988c-e6ded5ed5bf7',qualification:{service:'Extension',stage:'Early idea',budget:'Not sure yet'}};
test('real API handler accepts one persisted enquiry and links its organic source to a CRM lead',async()=>{
 const h=harness();const body={...data,attribution:attribution.mergeAttribution(null,attribution.readTouchpoint('https://bhstudio.co.uk/blog/home-renovation-cost-london-2026','https://www.google.com/search?q=private'))};
 const a=await h.post(body),b=await h.post(body);
 assert.equal(a.status,200);assert.equal(b.status,200);assert.equal((await a.json()).accepted,true);
 assert.equal((await b.json()).eventId,body.submissionEventId);
 assert.equal(h.contacts.size,1);assert.equal(h.leads.size,1);
 const contact=[...h.contacts.values()][0],lead=[...h.leads.values()][0];
 assert.equal(String(contact.leadId),String(lead._id));assert.equal(lead.source,'Google');assert.equal(lead.qualification.service,'Extension');
 assert.equal(lead.attribution.firstLandingPath,'/blog/home-renovation-cost-london-2026');
 assert.deepEqual(h.counts(),{emails:2,notifications:1});
});
test('invalid and spam requests never persist or send an accepted success',async()=>{
 for(const changes of [{website:'spam'}, {firstName:''},{email:''},{message:''},{firstName:{invalid:true}},{submissionEventId:'bad'}]){
  const h=harness();const response=await h.post({...data,...changes});
  assert.equal(response.status,400);assert.notEqual((await response.json()).accepted,true);assert.equal(h.contacts.size,0);assert.equal(h.counts().emails,0);
 }
});
test('database failure returns 500 without a success event or notification',async()=>{
 const h=harness({failSave:true}),response=await h.post(data);
 assert.equal(response.status,500);assert.notEqual((await response.json()).accepted,true);assert.deepEqual(h.counts(),{emails:0,notifications:0});
});
test('direct enquiry is Other, not Google, and declined analytics attribution is discarded',async()=>{
 const h=harness();await h.post({...data,attribution:{consent:'rejected',source:'google',medium:'organic'}});
 const lead=[...h.leads.values()][0];assert.equal(lead.source,'Other');assert.equal(lead.attribution,undefined);
});

test('CRM failure can recover on retry without losing or duplicating enquiry notifications',async()=>{
 const h=harness({failLeadOnce:true});
 assert.equal((await h.post(data)).status,500);
 assert.deepEqual(h.counts(),{emails:2,notifications:1});
 const retry=await h.post(data);assert.equal(retry.status,200);assert.equal((await retry.json()).accepted,true);
 assert.equal(h.contacts.size,1);assert.equal(h.leads.size,1);
 assert.deepEqual(h.counts(),{emails:2,notifications:1});
});
