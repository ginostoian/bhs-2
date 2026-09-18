import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import vm from "node:vm";
import { withPublicForm } from "../../libs/publicForm.js";
import { issueToken, FORM_COOKIE } from "../../libs/formSecurity.js";
import { memoryCollections } from "./form-harness.mjs";
const require = createRequire(import.meta.url);
const transform = require("next/dist/build/swc").transform;
async function compiled(path) {
  return (
    await transform(await fs.readFile(new URL(path, import.meta.url), "utf8"), {
      filename: "module.js",
      jsc: { parser: { syntax: "ecmascript" } },
      module: { type: "commonjs" },
    })
  ).code;
}
const authCode = await compiled("../../libs/next-auth.js");
const publicCode = await compiled("../../libs/publicForm.js");
const security = await import("../../libs/formSecurity.js");
const storeMethods = await import("../../libs/formStore.js");
process.env.NEXTAUTH_SECRET = "test-secret";
function authHarness({ user = null, session = null } = {}) {
  const store = memoryCollections();
  let connections = 0,
    creates = 0,
    hashes = 0,
    notifications = 0,
    updates = 0;
  const common = {
    console: { error() {}, info() {} },
    process: {
      env: {
        NEXTAUTH_SECRET: "test-secret",
        NEXTAUTH_URL: "https://bhstudio.co.uk",
      },
    },
    Response,
    Request,
    Headers,
    Proxy,
    Date,
  };
  const guard = {};
  vm.runInNewContext(publicCode, {
    ...common,
    exports: guard,
    require: (n) =>
      n === "./formSecurity.js"
        ? security
        : { ...storeMethods, formCollections: async () => store },
  });
  const deps = {
    "./formSecurity.js": security,
    "./publicForm.js": guard,
    "next-auth/jwt": { getToken: async () => session },
    "next-auth/providers/google": (opts) => opts,
    "next-auth/providers/credentials": (opts) => opts,
    "@auth/mongodb-adapter": { MongoDBAdapter: () => ({}) },
    bcryptjs: {
      hash: async () => {
        hashes++;
        return "hash";
      },
      compare: async () => true,
    },
    "../config.js": { auth: {}, colors: {} },
    "./mongo.js": undefined,
    "./mongoose.js": async () => {
      connections++;
    },
    "../models/User.js": {
      findOne: () => ({ select: async () => user }),
      create: async (d) => {
        creates++;
        return { ...d, _id: "new-user" };
      },
      updateOne: async () => {
        updates++;
      },
    },
    "./referrals.js": {
      ensurePartnerForReferrerUser: async () => ({ _id: "partner" }),
    },
    "./notificationService.js": {
      notifyReferrerSignup: async () => {
        notifications++;
      },
    },
    "./emailService.js": {
      sendAdminReferrerSignupNotifications: async () => {
        notifications++;
      },
    },
  };
  const exports = {};
  vm.runInNewContext(authCode, {
    ...common,
    exports,
    require: (n) => {
      if (!(n in deps)) throw Error("Unexpected " + n);
      return deps[n];
    },
  });
  const authorize = exports.authOptions.providers[1].authorize;
  const sid = "a".repeat(48);
  const credentials = {
    email: "genuine@example.test",
    name: "Genuine Referrer",
    password: "safe-password",
    isSignUp: "true",
    signUpRole: "referrer",
  };
  return {
    counts: () => ({ connections, creates, hashes, notifications, updates }),
    authorize: (changes = {}, token = issueToken("auth", sid)) =>
      authorize(
        { ...credentials, ...changes, formToken: token },
        {
          headers: {
            origin: "https://bhstudio.co.uk",
            cookie: `${FORM_COOKIE}=${sid}`,
          },
          cookies: { [FORM_COOKIE]: sid },
        },
      ),
  };
}
test("actual referrer authorize refuses missing token before user lookup, bcrypt, creation or email", async () => {
  const h = authHarness();
  await assert.rejects(h.authorize({}, ""));
  assert.deepEqual(h.counts(), {
    connections: 0,
    creates: 0,
    hashes: 0,
    notifications: 0,
    updates: 0,
  });
});
test("actual referrer authorize preserves genuine account creation and pending partner notifications", async () => {
  const h = authHarness();
  const user = await h.authorize();
  assert.equal(user.role, "referrer");
  assert.equal(h.counts().creates, 1);
  assert.equal(h.counts().notifications, 2);
});
test("passwordless-account ownership is required before assigning password", async () => {
  const user = { _id: "existing-id", email: "genuine@example.test" };
  const h = authHarness({ user });
  await assert.rejects(
    h.authorize({ isSignUp: "false", isSetPassword: "true" }),
    /sign in with your existing/,
  );
  assert.equal(h.counts().updates, 0);
  assert.equal(h.counts().hashes, 0);
  const allowed = authHarness({ user, session: { sub: "existing-id" } });
  assert.equal(
    (await allowed.authorize({ isSignUp: "false", isSetPassword: "true" })).id,
    "existing-id",
  );
  assert.equal(allowed.counts().updates, 1);
});
test("existing user login remains usable with protected form and password", async () => {
  const h = authHarness({
    user: {
      _id: "user-id",
      email: "genuine@example.test",
      password: "hash",
      role: "user",
    },
  });
  assert.equal((await h.authorize({ isSignUp: "false" })).id, "user-id");
  assert.equal(h.counts().creates, 0);
});
test("Mongoose shares in-flight connection and Auth awaits same lazy client", async () => {
  const code = await compiled("../../libs/mongoose.js"),
    mongoCode = await compiled("../../libs/mongo.js");
  let opened = 0;
  const client = { tag: "shared" };
  const mongoose = {
    set() {},
    connection: { readyState: 0, getClient: () => client },
    connect: async (uri, options) => {
      opened++;
      assert.equal(options.maxPoolSize, 5);
      await new Promise((r) => setTimeout(r, 5));
      mongoose.connection.readyState = 1;
      return mongoose;
    },
  };
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: () => mongoose,
    globalThis: {},
    process: { env: { MONGODB_URI: "test-only" } },
  });
  const native = {};
  vm.runInNewContext(mongoCode, {
    exports: native,
    require: () => ({ default: exports.default, __esModule: true }),
    process: { env: { MONGODB_URI: "test-only" } },
  });
  assert.equal(opened, 0);
  const results = await Promise.all([
    exports.default(),
    exports.default(),
    Promise.resolve(native.default),
  ]);
  assert.equal(opened, 1);
  assert.equal(results[2], client);
  mongoose.connection.readyState = 0;
  await exports.default();
  assert.equal(opened, 2);
});
test("failed connection can be retried instead of caching rejection forever", async () => {
  const code = await compiled("../../libs/mongoose.js");
  let n = 0;
  const mongoose = {
    set() {},
    connection: { readyState: 0 },
    connect: async () => {
      if (!n++) throw Error("temporary");
      mongoose.connection.readyState = 1;
      return mongoose;
    },
  };
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: () => mongoose,
    globalThis: {},
    process: { env: { MONGODB_URI: "test-only" } },
  });
  await assert.rejects(exports.default());
  assert.equal(await exports.default(), mongoose);
  assert.equal(n, 2);
});

test("actual JWT verifier accepts chunked browser cookies from the real authorize request shape", async () => {
  const { encode, getToken } = require("next-auth/jwt");
  const token = await encode({
    secret: "cookie-test-secret",
    token: { sub: "existing-id" },
  });
  const split = Math.floor(token.length / 2);
  const req = {
    headers: {
      cookie: `next-auth.session-token.0=${token.slice(0, split)}; next-auth.session-token.1=${token.slice(split)}`,
    },
  };
  const decoded = await getToken({
    req: security.authRequestWithCookies(req),
    secret: "cookie-test-secret",
    secureCookie: false,
  });
  assert.equal(decoded.sub, "existing-id");
});

test('approved referral dashboard submissions use a persistent account budget; pending accounts stay blocked',async()=>{
 const code=await compiled('../../app/api/referrer/referrals/route.js');
 for(const approved of [false,true]){
  let quotaCalls=0,leadWrites=0;
  const deps={
   'next/server':require('next/server'),'next-auth/next':{getServerSession:async()=>({user:{id:'referrer-id',role:'referrer'}})},
   '@/libs/next-auth':{authOptions:{}},'@/libs/mongoose':async()=>{},'@/libs/formStore':{formCollections:async()=>({counters:{}}),consumeCounter:async(c,key)=>{assert.equal(key,'referral-account:referrer-id');quotaCalls++;return false}},'@/libs/formSecurity':security,
   '@/models/Lead':class {constructor(){leadWrites++}},'@/models/User':{findById:async()=>({_id:'referrer-id'})},'@/models/Partner':{findById:()=>({lean:async()=>({_id:'partner-id'})})},
   '@/libs/referrals':{ensurePartnerForReferrerUser:async()=>({_id:'partner-id'}),isPartnerAccountApproved:()=>approved},
  };
  const exports={};vm.runInNewContext(code,{exports,require:n=>{if(!(n in deps))throw Error(n);return deps[n]},console});
  const response=await exports.POST(new Request('https://bhstudio.co.uk/api/referrer/referrals',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Client Name',email:'client@example.test',phone:'07700900000',postcode:'E2',projectType:'Extension'})}));
  assert.equal(response.status,approved?429:403);assert.equal(quotaCalls,approved?1:0);assert.equal(leadWrites,0);
 }
});


test('installed Auth adapter is not constructed until an actual adapter operation',async()=>{
 const {MongoDBAdapter}=await import('@auth/mongodb-adapter');
 const {lazyMongoAdapter}=await import('../../libs/mongo.js');
 let awaited=0,opened=0;
 const client={then(resolve){awaited++;resolve({db(){opened++;return {collection:()=>({findOne:async()=>null})}}})}};
 const adapter=lazyMongoAdapter(MongoDBAdapter,client);
 await new Promise(r=>setImmediate(r));assert.equal(awaited,0);assert.equal(opened,0);
 assert.equal(await adapter.getUserByEmail('real@example.test'),null);assert.equal(opened,1);
});
