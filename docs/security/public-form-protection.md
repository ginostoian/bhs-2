# Public forms and MongoDB connection safeguards

Implemented in the application; publishing/deployment is a separate step.

## Coverage

| Entry point | Browser caller | Enforcement |
| --- | --- | --- |
| `/api/contact` | Current enquiry and legacy contact forms | Token, schema, real brief validation, quotas, duplicate detection, review, email budgets |
| `/api/leads` | Extension calculator | Shared admission plus existing consent, timing and recalculation |
| `/api/kitchen-calculator-leads` | Kitchen calculator | Shared admission plus existing calculator checks |
| `/api/renovation-calculator-leads` | Renovation calculator | Shared admission plus existing calculator checks |
| `/api/bathroom-renovation` | Simple and detailed bathroom forms | Shared admission plus existing required fields |
| `/api/kitchen-renovation` | Kitchen form | Shared admission plus existing required fields |
| `/api/general-renovation` | Renovation form | Shared admission plus existing required fields |
| `/api/lead` | Legacy newsletter and lead-capture components | Token, email validation, persistent quotas, duplicate detection |
| `/api/catalogue/shares` | Catalogue saved-product share | Token, quotas, bounded JSON; no mandatory email |
| NextAuth credentials | Sign-in, user/referrer signup, password assignment | Token/honeypot, quotas before lookup/bcrypt/account creation; new referrers remain pending approval |
| `/api/referrer/referrals` | Approved referrer dashboard | Existing authentication and approval plus persistent account quota and bounded JSON |

The commission calculator and legacy partner CTA now link to the protected referral signup instead of the old external Tally form; its unused embed script is removed.

Authenticated administrative/client tools retain their authorization. OAuth callbacks and signed provider webhooks are not forced through browser tokens. Token-authorized unsubscribe remains email-client compatible. The hosted Cal booking flow is outside this application's form transport.

## Configuration and operations

- Uses `FORM_SECURITY_SECRET`, or existing `NEXTAUTH_SECRET` as fallback. Missing both fails closed. Never expose these in browser variables. Keep the secret identical across instances.
- `NEXTAUTH_URL` must match the deployed authentication origin.
- On Vercel, the trusted IP is its overwritten `x-forwarded-for`. Elsewhere, set `TRUSTED_CLIENT_IP_HEADER` only to a header the trusted reverse proxy overwrites. Without one, quotas still use sessions, recipients and global admission; do not claim IP enforcement.
- No new vendor, browser SDK, or database client is required. `form_counters`, `form_receipts` and `form_reviews` use the existing Mongoose connection. TTL indexes initialize once per warm module and must be allowed by the database user's privileges. Index/counter failure returns a retryable error instead of allowing unchecked business work.
- Counters use atomic increments in fixed time buckets. Limits are deliberately conservative: normal forms 8/session/hour, 20/session/day, 20/IP/hour, 100/IP/day and 5/recipient/day. Signups additionally have 3/session/day, 5/IP/hour and 30 site-wide/day. Login has separate hourly and recipient budgets. Ordinary requests rejected by narrower limits do not consume the global admission budget.
- Form confirmation/admin pairs are limited to 3/customer/day and 100 pairs/day; signups have their separate admission budget before admin notifications. This does not rate-limit unrelated CRM/transactional email. Budgets reserve before side effects, so some unsuccessful submissions conservatively consume allowance.
- `/admin/form-review` lists held details for manual follow-up, accessible through Forms → Form Review. Link-bearing names, multiple-link enquiries and email-budget overflow are held without lead/account creation, email or automation. Entries expire after 30 days; passwords and tokens are not stored there. This screen does not automatically release or create accounts. Genuine signup users can resubmit after review or be handled through the existing admin workflows.
- `/api/admin/security-stats` reports retained decision states and review counts; cheap pre-database rejections appear as structured server logs (`Public form rejected`) without submitted personal details. No continuously running monitor is configured.
- Form-token issuance does not connect to MongoDB. Its bounded process-local admission limit is only a low-cost safeguard; submission limits are persistent. Tokens expire after 30 minutes, bind to an HttpOnly same-site cookie and route, and cannot be repurposed for another payload. Tokens raise the cost of blind posts; they do not prove humanity.
- Completed receipt responses make exact network retries safe. Contact's existing event-ID idempotency supports retries after downstream failures. Uncertain non-contact operations are not automatically replayed, avoiding duplicate emails/writes. A process crash can leave a submission processing; inspect before asking the visitor to submit again. Content duplicates with changed event IDs are rejected within the same 10-minute bucket.
- Passwordless accounts can no longer set a password based on an email address alone: the verified session must belong to that account. People without an existing sign-in method need support/admin assistance; no unauthenticated password-reset flow was added.

## MongoDB connection alert

`libs/mongo.js` previously opened a separate native client eagerly when auth configuration was imported. It now defers both the Auth adapter constructor and its client acquisition, reusing Mongoose's driver. Deferring only the client would not be sufficient: the installed adapter eagerly awaits it in its constructor. Mongoose caches the in-flight connection, resets failed attempts and avoids request-specific connection event listeners. The pool stays at max 5, min 0, with one concurrent connection establishment and a 30-second idle setting.

Pool limits apply per runtime and server, not across the deployment. Monitoring sockets add to counts. Atlas telemetry was not inspected, so this code finding is a likely contributor, not a proved sole cause of the alert. After deployment compare Atlas connections, request concurrency and errors; retire unused preview/dev processes that connect to production and check whether other jobs still use the same cluster. A restart alone is temporary relief. If legitimate instance counts still approach the free cluster's 500-connection limit, adjust deployment concurrency or move to a suitable Atlas tier. Never close the shared client after individual requests.

Sources: [Atlas connection alerts](https://www.mongodb.com/docs/atlas/reference/alert-resolutions/connection-alerts/), [Vercel forwarding headers](https://vercel.com/docs/headers/request-headers), [MongoDB TTL indexes](https://www.mongodb.com/docs/manual/core/index-ttl/).

## Validation and rollout

Run `node --test tests/security/*.test.mjs tests/seo/*.test.mjs`, `npm run lint` and `npm run build`. Browser QA uses a local server with the production database disabled: numeric briefs must reject, drafts must survive a database outage, and referral signup must supply a token and fail safely. Backend tests isolate databases and mail and exercise real route/provider code plus injected stores. They do not claim an Atlas load test or successful real email delivery.

Deploy clients and server together so old clients cannot omit tokens. Reload already-open tabs if prompted. Confirm normal enquiries, calculator delivery and a genuine signup in staging before watching live counters. Roll back overly strict quotas/content heuristics independently; do not restore unauthenticated password assignment or silently bypass failed security storage. Keep production data and existing spam records unchanged unless separately authorized for cleanup.
