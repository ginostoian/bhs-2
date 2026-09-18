import { randomBytes } from "node:crypto";
import { issueToken, FORM_COOKIE } from "../../libs/formSecurity.js";
export function memoryCollections() {
  function collection() {
    const rows = new Map();
    return {
      rows,
      async deleteOne(query) {
        rows.delete(query._id);
      },
      async insertOne(doc) {
        if (rows.has(doc._id))
          throw Object.assign(new Error("duplicate"), { code: 11000 });
        rows.set(doc._id, structuredClone(doc));
      },
      async findOne(query) {
        return rows.get(query._id);
      },
      async updateOne(query, update, { upsert } = {}) {
        let row = rows.get(query._id);
        if (row && query.state && row.state !== query.state)
          return { modifiedCount: 0 };
        if (!row && !upsert) return { modifiedCount: 0 };
        if (!row) {
          row = { _id: query._id, ...update.$setOnInsert };
          rows.set(query._id, row);
        }
        Object.assign(row, update.$set);
        return { modifiedCount: 1 };
      },
      async findOneAndUpdate(query, update, { upsert } = {}) {
        let row = rows.get(query._id);
        if (!row && upsert) {
          row = { _id: query._id, ...update.$setOnInsert };
          rows.set(query._id, row);
        }
        if (!row) return { value: null };
        for (const [k, v] of Object.entries(update.$inc || {}))
          row[k] = (row[k] || 0) + v;
        return { value: structuredClone(row) };
      },
    };
  }
  return {
    counters: collection(),
    receipts: collection(),
    reviews: collection(),
  };
}
export function formRequest(body, purpose = "contact", options = {}) {
  const session = options.session || randomBytes(24).toString("hex");
  const token = options.token ?? issueToken(purpose, session);
  return new Request("https://bhstudio.co.uk/api/" + purpose, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://bhstudio.co.uk",
      cookie: `${FORM_COOKIE}=${session}`,
      "x-form-token": token,
      ...options.headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
