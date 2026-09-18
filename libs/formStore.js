import connectMongo from "./mongoose.js";
import { hash, failure } from "./formSecurity.js";
let indexes;
export async function formCollections() {
  const mongoose = await connectMongo();
  const db = mongoose.connection.db;
  const counters = db.collection("form_counters");
  const receipts = db.collection("form_receipts");
  const reviews = db.collection("form_reviews");
  if (!indexes)
    indexes = Promise.all(
      [counters, receipts, reviews].map((c) =>
        c.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      ),
    ).catch((e) => {
      indexes = null;
      throw e;
    });
  await indexes;
  return { counters, receipts, reviews };
}
export async function consumeCounter(
  collection,
  key,
  limit,
  windowMs,
  now = Date.now(),
) {
  const bucket = Math.floor(now / windowMs);
  // _id is unique and $inc atomic: concurrent instances cannot each consume
  // the same remaining slot. TTL is cleanup only, never the expiry decision.
  let result;
  try {
    result = await collection.findOneAndUpdate(
      { _id: hash(`${key}:${bucket}`) },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((bucket + 2) * windowMs) },
      },
      { upsert: true, returnDocument: "after" },
    );
  } catch (e) {
    if (e.code !== 11000) throw e;
    result = await collection.findOneAndUpdate(
      { _id: hash(`${key}:${bucket}`) },
      { $inc: { count: 1 } },
      { returnDocument: "after" },
    );
  }
  return result.value.count <= limit;
}
export async function enforceQuotas(
  collection,
  { purpose, ip, session, email, signup },
) {
  const login = purpose === "auth" && !signup;
  const rules = [
    [
      `session:${session}:${login ? "login" : "forms"}`,
      login ? 20 : 8,
      3600000,
    ],
    [`session-day:${session}`, login ? 100 : 20, 86400000],
  ];
  if (ip)
    rules.push(
      [`ip:${ip}:${login ? "login" : "forms"}`, login ? 40 : 20, 3600000],
      [`ip-day:${ip}`, 100, 86400000],
    );
  if (signup)
    rules.push(
      [`signup:${session}`, 3, 86400000],
      ...(ip ? [[`signup-ip:${ip}`, 5, 3600000]] : []),
    );
  if (email)
    rules.push([
      `recipient:${email}:${login ? "login" : "forms"}`,
      login ? 15 : 5,
      login ? 900000 : 86400000,
    ]);
  rules.push([
    `global:${login ? "login" : "forms"}`,
    login ? 500 : 200,
    3600000,
  ]);
  for (const [key, limit, window] of rules)
    if (!(await consumeCounter(collection, key, limit, window)))
      throw failure(
        "Too many attempts. Please try again later or contact us by phone.",
        429,
        "FORM_RATE_LIMIT",
      );
}
export async function quarantine(collections, body, purpose, reason) {
  if (
    !(await consumeCounter(
      collections.counters,
      "review-storage",
      100,
      86400000,
    ))
  )
    throw failure(
      "Please contact us by phone about your enquiry.",
      429,
      "FORM_RATE_LIMIT",
    );
  const payload = {};
  for (const field of [
    "name",
    "firstName",
    "lastName",
    "email",
    "phone",
    "brief",
    "message",
    "topic",
    "address",
    "additionalRequests",
    "signUpRole",
  ])
    if (typeof body[field] === "string") payload[field] = body[field];
  const id = hash(JSON.stringify({ purpose, payload }));
  await collections.reviews.updateOne(
    { _id: id },
    {
      $setOnInsert: {
        purpose,
        reason,
        payload,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 86400000),
      },
    },
    { upsert: true },
  );
}
