# CRM & Email Automation — Audit and Improvement Plan

**Author:** Engineering review
**Date:** 2026-07-08
**Scope:** `models/Lead.js`, `models/EmailAutomation.js`, `libs/crmEmailAutomation.js`, `libs/crmEmailTemplates.js`, `libs/emailService.js`, `libs/resend.js`, `app/admin/crm/**`, `app/api/crm/**`, `app/api/cron/**`, `app/api/webhook/resend/**`, `vercel.json`.

> This is a **plan only**. No production code has been changed. It documents what exists today, what is broken or missing, and a concrete, number-based path forward for both the CRM and the Resend-based email automation.

---

## 0. Executive summary

**Verdict: do NOT do a from-scratch rebuild. Refactor and extend in place.**

The CRM is genuinely functional and already covers a lot: kanban pipeline, drag-and-drop, aging, activities/notes/tasks, versioned stage history, archiving, morning brief, reports, partner referrals, and a stage-driven email engine wired to Resend (send + inbound replies + open/click/bounce events). That is far more than a greenfield project would have on day one. A rebuild would throw all of that away and re-introduce months of risk.

However, the implementation has **three categories of problems** that justify serious, staged work:

1. **Reliability / correctness bugs** that mean the automation probably is not doing what everyone thinks it is doing (the scheduler is not even wired up; leads silently dead-end; proposal follow-ups never stop).
2. **Architecture debt** — the `Lead` document is a "god object" and the pipeline stages are hard-coded in ~4 places, which makes every change fragile.
3. **Missing "good CRM" capabilities** — lead scoring, unified activity/email timeline, saved views, bulk actions, forecasting, consent/unsubscribe, and a design pass.

The single highest-impact fix is the email cadence + stop-conditions redesign in **Part 3**, because that is the revenue engine and it currently has the most broken behaviour.

---

## 1. Current-state audit (evidence-based)

### 1.1 Critical bugs / risks found in code

| # | Severity | Finding | Evidence |
|---|----------|---------|----------|
| C1 | 🔴 Critical | **The email-automation cron is not scheduled.** `vercel.json` only registers `/api/cron/update-aging` and `/api/cron/check-overdue-activities`. The `/api/cron/email-automation` route exists but nothing calls it on a schedule. In practice the whole sequence only runs when an admin clicks "Process due emails" in `/admin/email-automation`. | `vercel.json` (2 crons); `app/api/cron/email-automation/route.js` exists but unreferenced by any schedule. |
| C2 | 🔴 Critical | **Leads dead-end in the "Lead" stage.** `EmailAutomation.shouldMoveToNeverReplied()` is called in `processDueEmails()` but the result is only `console.log`-ged with a comment "This should trigger a stage update" — it is never actually moved. After 5 emails the lead stops receiving anything **and stays in "Lead" forever**. | `libs/crmEmailAutomation.js` ~L646-652. |
| C3 | 🔴 Critical | **Clicking the booking / CTA link does NOT stop the sequence.** `handleEmailClicked()` logs an activity and resets aging but does **not** pause the automation. The stated goal ("keep following up until they click through / book") is not implemented — they keep getting follow-ups after clicking. | `app/api/webhook/resend/events/route.js` L151-182 (no `automation.isActive = false`). |
| C4 | 🟠 High | **Proposal follow-ups never stop.** The Lead stage caps at `maxEmails: 5`, but `proposalSent` has no cap. `findDueEmails()` returns Proposal-Sent automations with `nextEmailDue <= now` and no upper bound, so a lead who was quoted receives a follow-up **every 2 days indefinitely** until someone manually changes their stage. | `models/EmailAutomation.js` L71-83, L214-219 (no `emailsSent` cap for proposal). |
| C5 | 🟠 High | **No unsubscribe / consent enforcement on marketing emails.** `crmEmailAutomation.js` calls `sendEmailWithRetry` directly and never checks `EmailPreference` or adds a `List-Unsubscribe` header / unsubscribe link. These are cold-ish nurture emails to UK consumers → PECR/GDPR and CAN-SPAM exposure, plus deliverability damage. | `libs/crmEmailAutomation.js` (all send calls); `models/EmailPreference.js` unused by CRM. |
| C6 | 🟠 High | **The cron/process endpoint has no authentication.** `app/api/cron/email-automation/route.js` `POST` runs `processDueEmails()` with no `CRON_SECRET`/bearer check. Anyone who finds the URL can trigger a full send. | `app/api/cron/email-automation/route.js` (no auth guard). |
| C7 | 🟡 Medium | **Reply detection is brittle.** Inbound matching is `Lead.findOne({ email: from })` — an exact, case-normalised match on the From address only. A reply from a secondary address, a forwarded thread, or `+alias` misses, and the sequence keeps firing. No Message-ID / thread correlation. | `app/api/webhook/resend/inbound/route.js` L41-48. |
| C8 | 🟡 Medium | **Plain-text template bug.** The intro email's `text` version ends with a literal `Kind regards,<br>` — HTML markup leaking into plain text. | `libs/crmEmailTemplates.js` L124. |
| C9 | 🟡 Medium | **Hard-coded BCC to `contact@celli.co.uk`.** Every automated lead email BCCs a third-party domain, hard-coded in five places instead of `config`. | `libs/crmEmailAutomation.js` L185, L235, L297, L348, L410. |
| C10 | 🟡 Medium | **Noisy, O(n) debug logging every run.** `processDueEmails()` loads **all** active automations and `console.log`s 5 lines each on every execution, regardless of whether anything is due. | `libs/crmEmailAutomation.js` L566-585. |
| C11 | 🟠 High | **Task due dates can't be entered, so due-date reminders can't exist.** The New Task UI renders only title + priority; `dueDate`/`assignedTo`/`description` are never captured (and `handleAddTask` drops `dueDate`). No cron watches lead `tasks` (the `check-overdue-activities` cron only covers the separate `activities` array). See §2.5. | `LeadDetailModal.js` L855-886; `vercel.json`. |
| C12 | 🟡 Medium | **Notes silently discard data and can't be edited.** The notes `POST` accepts `tags`/`customTag`/`attachments` but the schema/handler save none of them; there is no `PUT`/`DELETE`; the UI is a single-line `<input>` with a hard-coded title. See §2.6. | `app/api/crm/leads/[id]/notes/route.js`; `LeadDetailModal.js` L832-851. |
| C13 | 🟡 Medium | **Reports metrics are misleading.** "Win rate" = won ÷ all leads *created* (not closed); funnel emits only total/qualified/won with an unfinished `qualified` condition; forecast weights are hard-coded in the frontend against old stage names. See §2.7. | `app/api/crm/reports/route.js` L123-155; `reports/page.js` L59-74. |

### 1.2 Architecture debt

- **`Lead` is a god document.** Activities, notes, tasks, and full versionHistory are all embedded arrays on the lead (`models/Lead.js` L175-332). Every note/activity write re-saves the entire document; the doc grows unbounded (16 MB Mongo ceiling for a busy lead), you cannot paginate or query activities independently, and concurrent edits race on the whole object.
- **Stage list is duplicated in ≥4 places** — `models/Lead.js` enum, `models/EmailAutomation.js` enum, `app/admin/crm/page.js` `CRM_STAGES`, and the automation `switch` statements. Adding/renaming a stage means editing all of them; they will drift.
- **Two parallel representations of deal value** — `value: Number` and `budget: enum(£..££££)` with no single source of truth, and the intro email maps `budget` to hard-coded GBP bands.
- **Email uniqueness is enforced only in the create handler**, not by a unique index — a race or a second entry point (public forms in `app/api/lead`, `app/api/contact`, calculators) can create duplicate leads.
- **Frontend state is hand-synced.** `app/admin/crm/page.js` manually splices leads between stage arrays on every action, with self-doubting inline comments ("No, filters might change", "Ideally fetchAllStages should…"). It works but is fragile and hard to reason about; there is no data-fetching library.
- **`LeadDetailModal.js` is ~1,000 lines** — one monolith handling every tab, form, and mutation.

### 1.3 What is already good (keep it)

- Kanban with optimistic drag-and-drop and per-stage pagination.
- Aging system with pause/resume and a daily recompute cron.
- Versioned stage-change history (`versionHistory`).
- Resend integration on **three** channels: outbound send, inbound reply webhook, and event webhook (open/click/bounce/complaint/fail).
- Email stats collection, morning brief, loss-prevention bar, partner-referral sync.

---

## 2. CRM improvement plan

### 2.1 Pipeline stages — analysis and proposal

**Current stages:** `Lead → Never replied → Qualified → Proposal Sent → Negotiations → Won → Lost`.

Problems:
- "Never replied" is a **dead-end mixed into the main flow** (and, per bug C2, nothing moves leads there). It is really a *status*, not a pipeline position.
- There is no explicit stage for the two "ball-in-our-court" states — **awaiting quote** (Qualified) and **awaiting decision after we've responded** — which is exactly the distinction this project cares about for who should be chased.
- No "Contacted / In conversation" stage between a raw lead and a qualified one, so the board can't show where speed-to-lead is failing.

**Proposed pipeline (rename + reorder):**

| Order | Stage | Meaning | Who is being chased | Automated lead emails? |
|------|-------|---------|---------------------|------------------------|
| 1 | **New Enquiry** | Just arrived (form/calculator/manual) | The lead | ✅ Nurture sequence |
| 2 | **In Conversation** | Two-way contact started, not yet qualified | The lead (lighter) | ✅ Light |
| 3 | **Qualified — Awaiting Quote** | We owe them a quote | **Us** | ❌ Admin reminders only |
| 4 | **Proposal Sent** | Quote delivered, awaiting decision | The lead | ✅ Decision-chase sequence |
| 5 | **Negotiation — Awaiting Us** | We owe a revised number / answer | **Us** | ❌ Admin reminders only |
| 6 | **Won** | Converted to project | — | ❌ |
| 7 | **Lost** | Dead, with reason | — | ❌ (optional win-back later) |

Plus a **status flag, not a stage**: `Never Replied / Cold` (set automatically when a nurture sequence exhausts), so the lead can still be reported on and re-engaged without leaving the funnel semantics broken.

> This directly supports the brief: **stages where the client is awaiting next steps *from us* (Qualified, Negotiation) do not send follow-ups to the lead** — only internal reminders. Every other lead-facing stage runs a follow-up sequence until the lead engages.

Implementation: extract the stage list + per-stage config (colour, whether it emails leads, SLA target, order) into **one** module (`libs/crmStages.js`) and import everywhere. This removes the ≥4-way duplication.

### 2.2 Data model / architecture

**Why:** to stop the god-document problem and make the CRM extensible.

1. **Split embedded arrays into their own collections** — `LeadActivity`, `LeadNote`, `LeadTask`, referencing `leadId`. Keep a denormalised `lastActivityAt` / `activityCount` on the lead for board display. Benefits: independent pagination, no whole-doc rewrites, no size ceiling, cleaner concurrency. Migrate with a one-off script (there is already a `scripts/` pattern for this).
2. **Single stage config module** (`libs/crmStages.js`) as above.
3. **Unique index on `email`** (partial: `isActive` leads) + a **duplicate-detection + merge** flow, since leads now enter from 5+ endpoints.
4. **First-class deal fields:** `estimatedValue` (number, single source of truth), `probability` (derived from stage), `expectedCloseDate`, `owner`. Keep `budget` band only as an intake hint.
5. **Consent + suppression:** add `marketingConsent`, `unsubscribedAt`, and a global suppression check shared with `EmailPreference`, enforced centrally in the send path (see Part 3).
6. **Capture attribution:** UTM/referrer fields on intake so source reporting is real, not a manual enum.

### 2.3 Feature gap analysis (vs. a "good CRM")

| Capability | Have today | Gap / plan |
|-----------|-----------|-----------|
| Kanban pipeline | ✅ | Add per-column **total value** + count, WIP, and SLA/aging colour. |
| Lead scoring | ❌ | Add a simple score (source × budget × engagement: opens/clicks/replies). Drives prioritisation + "hot lead" morning brief. |
| Unified activity timeline | Partial (per-type) | One chronological timeline merging emails (sent/opened/clicked/replied), calls, notes, tasks, stage changes. |
| Email thread view in-CRM | ❌ | Show the actual Resend inbound reply content on the lead (already stored in `replyContent`) + let admin reply from the modal. |
| Tasks & reminders | ⚠️ broken (see §2.5) | UI can't set due dates/assignee; no reminder cron for lead tasks. Rebuild per §2.5. |
| Rich notes | ⚠️ minimal (see §2.6) | Single-line plaintext input; tags/attachments silently dropped. Rich editor per §2.6. |
| Saved views / filters | ❌ (4 fixed filters) | Saved filter presets, "my leads", "hot", "aging > N", "no owner". |
| Bulk actions | ❌ | Multi-select → reassign, tag, change stage, add to sequence, archive. |
| Assignment rules | ❌ (manual) | Round-robin / by-source auto-assignment on intake. |
| Duplicate detection & merge | ❌ | On intake and a manual "merge leads" tool. |
| Forecasting / analytics | ⚠️ thin/flawed (see §2.7) | Misleading win rate, broken funnel, no velocity/trends/loss analysis. Enrich per §2.7. |
| Consent / unsubscribe | ❌ | See C5 / Part 3.5. |
| Import / export | ❌ | CSV import for bulk lead loads, export for reporting. |
| Audit log | Partial (stage only) | Extend versionHistory to all key field changes. |
| Notifications | ✅ (some) | Add "lead replied", "hot lead", "SLA breached". |
| Mobile | Partial | The board is horizontally scrollable but the detail modal is heavy — see design. |

### 2.4 Frontend, UX & design

**Why:** the board works but reads as generic Tailwind grey; the code is hard to maintain; the detail modal is a 1,000-line monolith.

1. **Adopt a data-fetching layer** (SWR or React Query). Replace the hand-rolled cross-stage state splicing in `app/admin/crm/page.js` with cache + mutation + optimistic updates. Removes an entire class of "which array is this lead in" bugs.
2. **Break up `LeadDetailModal`** into tabbed sub-components: Overview, Timeline, Notes, Tasks, Emails/Automation, History. Lazy-load tabs.
3. **Design system pass:**
   - A defined palette per stage (semantic, colour-blind-safe) instead of ad-hoc `bg-*-50` string-splitting (`page.js` L491-493 literally does `.replace('bg-', 'bg-')`).
   - Card redesign: name, value, owner avatar, source chip, **aging pill** (green/amber/red), next-action, and automation status (▶ active / ⏸ paused / ✅ replied) at a glance.
   - Column header shows **count + total value**.
   - Consistent spacing, typography scale, and a proper empty/loading/skeleton state per column.
   - Dark-mode-aware and mobile: a single-column "list" fallback under `sm`.
4. **Lead detail hero:** score, stage, owner, value, expected close, and a big "Next best action" with the current sequence status and the ability to pause/resume/skip a step inline.
5. **Accessibility:** drag-and-drop needs keyboard alternatives; add ARIA and focus management to the modal.

### 2.5 Tasks system — deep dive and rebuild

**Current state (from code):**
- Model: `tasks` is an embedded array on `Lead` with `title, description, status (pending/in_progress/completed/overdue), priority, dueDate, assignedTo, createdBy, completedAt` — a decent schema.
- API (`app/api/crm/leads/[id]/tasks/route.js` + `/[taskId]`): `GET`/`POST`/`PATCH`/`DELETE` all exist and **already accept `dueDate`, `assignedTo`, `description`**.
- **UI (`LeadDetailModal.js` L855-886) is the problem.** The "New Task" form only renders **two inputs: title + priority**. There is no field for **due date**, **assignee**, or **description** — even though the state object is initialised with `dueDate: ""` (L46) and the API would store them. `handleAddTask` then resets to `{ title, description, priority }`, dropping `dueDate` entirely.
- You can only tick a task **complete**; there is no edit, reschedule, reassign, or delete in the UI (despite `PATCH`/`DELETE` existing).

**Why it "doesn't work as intended":**
1. **No due dates can be entered → due-date notifications are impossible.** There is nothing to fire on.
2. **No notification pipeline for lead tasks.** The `check-overdue-activities` cron operates on the lead **`activities`** array (which has its own `dueDate`), **not** on the **`tasks`** array. Lead tasks have *zero* reminder coverage. Tasks also have a redundant `status: "overdue"` enum value that nothing ever sets.
3. **Embedded-array design** means there is no way to see "all my tasks across all leads" — a basic CRM need. Every task query must load whole lead documents.
4. **Difficult to input:** two fields, a toggle-open panel, no keyboard submit, no validation feedback.

**Plan — how it should be rebuilt:**

- **Data:** promote tasks to a first-class **`LeadTask` collection** (`leadId`, `title`, `description`, `status`, `priority`, `dueDate`, `remindAt`, `assignedTo`, `createdBy`, `completedAt`, `completedBy`). Index `{ assignedTo, dueDate, status }` so "my open tasks" and "due today" are cheap. Drop the meaningless `overdue` status — derive overdue from `dueDate < now && status != completed`.
- **Input UX (fix the core complaint):** redesign the task composer to include **title, description, assignee (defaults to lead owner), due date + time, priority, and an optional reminder offset** ("remind me 1 day before"). Support quick presets ("Today", "Tomorrow", "Next week"), Enter-to-save, inline validation, and an **inline edit / reschedule / reassign / delete** row menu.
- **Notifications (the missing piece):**
  - A **`check-due-tasks` cron** (hourly) that finds `dueDate`/`remindAt` crossing now and creates a `Notification` + email to `assignedTo` ("Task due: {title} for {lead name}"), plus an overdue escalation the next morning.
  - Surface due/overdue tasks in the **morning brief** and as a **badge** in the CRM header.
  - Real-time in-app notification when a task is assigned to you.
- **Global task views:** a "My Tasks" / "Team Tasks" list (filter by assignee, due window, priority, overdue) and a calendar view — only possible once tasks are their own collection.
- **Board signal:** show an "⏰ overdue task" indicator on the `LeadCard` so nothing is silently missed.

### 2.6 Notes system — deep dive and rich-notes plan

**Current state (from code):**
- Model: `notes` embedded array with `title, content, createdBy, createdAt, isImportant`.
- API (`app/api/crm/leads/[id]/notes/route.js`): `POST` accepts `title, content, tags, customTag, isImportant, attachments` — but **only persists `title, content, createdBy, isImportant`.** `tags`, `customTag`, and `attachments` are **silently discarded** (the schema has no such fields). There is **no `PUT`/`DELETE`** — notes cannot be edited or removed.
- **UI (`LeadDetailModal.js` L832-851):** a single-line **`<input>`** (not even a textarea) that hard-codes `title: "Note"`. No multiline, no formatting, no tags, no importance toggle, no attachments, no edit/delete. This is the weakest possible note-taking surface.

**Why it's poor:** notes are where the real sales context lives (call summaries, site-visit findings, client preferences, objections). A one-line plaintext box that can't wrap, can't be edited, and throws away tags/attachments actively discourages good record-keeping.

**Plan — rich notes:**

- **Data:** promote to a **`LeadNote` collection** (`leadId`, `body` rich content, `contentText` for search, `tags[]`, `pinned`, `createdBy`, `updatedBy`, `updatedAt`, `attachments[]`). Add a text index on `contentText` + `tags` for search.
- **Rich editor:** a proper multiline rich-text editor (Tiptap/ProseMirror or a lightweight markdown editor) supporting **bold/italic/lists/headings/links, checklists, @mentions of teammates, and pasted images/file attachments** (there is already a `bunnyStorage` lib + `File` model for uploads). Store as sanitised HTML or portable JSON, plus a plain-text projection for search.
- **Organisation:** **note types/tags** (Call, Site visit, Requirement, Objection, Internal), **pin important notes** to the top (wire up the existing `isImportant`), full **edit history** and **delete** (add `PUT`/`DELETE` endpoints).
- **@mention → notification:** mentioning a teammate creates a `Notification` and optional email.
- **Search & timeline:** notes searchable across all leads and merged into the unified activity timeline (§2.3).
- **Quick vs full:** keep a one-line "quick note" affordance for speed, but expand into the full editor on focus/click.

### 2.7 Reports & analytics — deep dive and enrichment

**Current state (from `app/api/crm/reports/route.js` + `reports/page.js`):** the page *looks* polished (KPI cards, tables, bars) but the analytics underneath are thin and partly incorrect:

- **"Win Rate" is misleading.** It's `won ÷ all leads *created* in range`. Leads created today can't be won yet, so the denominator is inflated and the number is meaningless as a conversion rate.
- **Funnel is broken/ambiguous.** The aggregation only emits `total / qualified / won`, and the `qualified` condition is a half-finished lump (`$in` a mixed list with commented-out uncertainty). There is **no stage-by-stage conversion or drop-off**.
- **No velocity / time-in-stage / time-to-win** — even though `versionHistory` already records every stage transition with timestamps. The data to compute this exists and is unused.
- **`avgAging` isn't stage age.** It uses `agingDays`, which resets on every contact, so "Avg. Age" per stage is really "days since last contact", not "days in this stage".
- **No trends.** Every figure is a single snapshot number; there are **no time-series/charts** and no comparison vs the previous period.
- **No activity/effort metrics** — calls made, tasks completed/overdue, emails sent, **speed-to-lead** (time to first contact), response times. None surfaced despite the data existing.
- **No loss analysis** — `winLossReason` is captured on the model but never reported. "Why are we losing?" is unanswerable.
- **No source ROI** (cost-per-lead / cost-per-win), and the **forecast weighting is hard-coded in the frontend** (`reports/page.js` L65-74) against the *old* stage names, so it silently breaks when stages change.
- Relies on `value`, which defaults to `0` at creation and is often never set → most value-based charts under-report.

**Plan — make reports actually useful:**

1. **Fix the core metrics first:**
   - **True conversion funnel:** stage-by-stage counts and **conversion % between adjacent stages** (New → In Conversation → Qualified → Proposal → Negotiation → Won), computed from the **cohort of leads that entered the funnel in the period**, plus overall lead→won rate.
   - **Real win rate:** `won ÷ (won + lost)` for **closed** deals in the period, not open leads.
   - **Stage velocity:** average **days in each stage** and **total time-to-win/time-to-lose**, computed from `versionHistory` transitions (build this into a dedicated aggregation or a nightly rollup).
2. **Add the missing dimensions:**
   - **Trends over time** — weekly/monthly line charts for new leads, wins, pipeline value, win rate; each KPI card shows **Δ vs previous period**.
   - **Loss-reason breakdown** (from `winLossReason`) — the single most actionable chart for a sales team.
   - **Source ROI** — leads, wins, win-rate, avg deal size and (if cost is entered) cost-per-win per source; fixes the current source chart that only counts volume.
   - **Effort & SLA metrics** — speed-to-lead (median time to first activity), tasks completed vs overdue, emails sent/opened/clicked/replied per sequence step (ties into the email plan §3), and per-agent activity, not just per-agent lead count.
   - **Forecast** — move weighting server-side, key it off the stage-config module (§2.2), and expose the probabilities so they can be tuned.
3. **Delivery & polish:**
   - Replace hand-rolled bars with a proper chart library for time-series; keep the existing card aesthetic.
   - **Date-range compare** (this period vs last), **per-agent / per-source filters**, and **CSV/PDF export**.
   - Consider a nightly **metrics rollup collection** so the dashboard doesn't run 8 aggregations on every load.
   - Reuse the numbers in the **morning brief** so insights are pushed, not just pulled.

### 2.8 Phased roadmap

- **Phase 0 — Stop the bleeding (days):** wire the cron (C1), cap proposal emails (C4), move exhausted leads to "Never Replied/Cold" (C2), pause on click/book (C3), add cron auth (C6), fix the text-template bug (C8), move BCC to config (C9), quiet the logging (C10). *These are the fixes behind Part 3.*
- **Phase 1 — Compliance & cadence (1–2 weeks):** unsubscribe + consent + suppression (C5), the new number-based sequences (Part 3), business-hours + frequency caps.
- **Phase 2 — Architecture (2–4 weeks):** stage-config module, split collections, unique index + dedupe, data-fetching layer.
- **Phase 3 — Features & design (ongoing):** scoring, unified timeline, saved views, bulk actions, forecasting dashboards, design system pass.

---

## 3. Email automation plan (Resend)

### 3.1 How often are emails sent to leads today?

Reconstructed from `models/EmailAutomation.js` + `libs/crmEmailAutomation.js`:

| Stage | Recipient | Trigger | Cadence | Cap | Reality |
|-------|-----------|---------|---------|-----|---------|
| **Lead** | The lead | On create | Intro immediately, then a follow-up **every 2 days** | 5 total (1 intro + 4 follow-ups) → ~Day 0,2,4,6,8 | After #5 the lead **dead-ends in "Lead"** (bug C2). |
| **Qualified** | Assigned admin | Stage change | Reminder **every 2 days** | none | Internal only (correct — client awaits *us*). |
| **Proposal Sent** | The lead | Stage change | First after **1 day**, then **every 2 days** | **none** | Follow-ups **forever** until stage manually changes (bug C4). |
| **Negotiations** | Assigned admin | Stage change | Reminder **every 2 days** | none | Internal only. |

So a lead's real experience today: **5 emails in 8 days**, a dead stop, and — if they were ever quoted — an **unbounded email every 2 days** thereafter. And **none of it runs automatically** because the cron isn't scheduled (C1); it fires only when an admin presses the button.

Cadence problems, independent of the bugs:
- **Flat 2-day spacing** is aggressive and unnatural. Best practice escalates the gap over time (persistent early, patient later).
- **No stop-on-engagement for clicks/bookings** (C3) — the core "chase until they book" idea isn't wired.
- **No frequency cap** across sequences and **no business-hours window** — emails go out whenever the cron happens to run.

### 3.2 Design principles for the new plan

1. **Only chase the lead when the ball is in *their* court.** Sequences run in **New Enquiry**, **In Conversation**, **Proposal Sent**, and the **Never Replied/Cold** long-tail. They do **not** run in **Qualified — Awaiting Quote** or **Negotiation — Awaiting Us** (those send *internal* admin reminders only). This is the brief's core rule.
2. **Persistent, then patient.** Gaps widen over time (1, 2, 3, 4, 6, 8 days…), so we're helpful early and not annoying later.
3. **Every email has one job: get them to click the primary CTA — book a discovery call** (`libs/booking.js` → `https://cal.com/bhstudio/discovery`). "Click b" = book/CTA. When they do, the sequence **stops** and a human takes over.
4. **One automated email per lead per 24h, max**, sent only in business hours (e.g. 08:00–18:00 UK, skip Sundays/holidays).
5. **Every marketing email honours unsubscribe** (link + `List-Unsubscribe` header) and the suppression list.

### 3.3 The number-based cadences

Day offsets are **from stage entry** (or lead creation for New Enquiry). Each send is skipped if a stop condition (3.4) has fired.

#### A. New Enquiry — nurture sequence ("get a reply or a booked call")
Goal: first meaningful engagement. **7 touches over ~24 days.**

| # | Day | Gap | Purpose / angle | Primary CTA |
|---|-----|-----|-----------------|-------------|
| 1 | 0 (send within minutes) | — | Warm intro, what to expect, ask for scope + photos | Book a discovery call |
| 2 | 1 | +1 | Social proof: recent similar project + review | Book a call |
| 3 | 3 | +2 | Portfolio / case study relevant to their project type | Book a call |
| 4 | 6 | +3 | Objection handling / FAQ (price, timeline, guarantee) | Book a call |
| 5 | 10 | +4 | Short, human check-in ("still thinking about it?") | Reply or book |
| 6 | 16 | +6 | "Anything holding you back?" — remove friction | Book a call |
| 7 | 24 | +8 | **Break-up** ("I'll close your file unless…") | Book a call |

After #7 with no engagement → set status **Never Replied / Cold**, hand to sequence D.

#### B. In Conversation — light nurture ("keep momentum")
Used when contact started but not yet qualified and the lead goes quiet. **3 touches, gentler.** Day 2, Day 5, Day 10 (then → Cold). One-to-one tone, no heavy marketing.

#### C. Proposal Sent — decision-chase ("get a yes/no or a call")
Goal: a decision. **6 touches over ~28 days, then hard stop** (fixes the infinite loop).

| # | Day | Gap | Purpose / angle | Primary CTA |
|---|-----|-----|-----------------|-------------|
| 1 | 1 | — | "Did the quote land? Happy to walk you through it." | Book a call |
| 2 | 3 | +2 | Clarify what's included / answer common questions | Book a call |
| 3 | 7 | +4 | Objection handling — price/timeline flexibility | Book a call |
| 4 | 12 | +5 | Reassurance: guarantee, process, testimonial | Book a call |
| 5 | 18 | +6 | "Is this still on your radar? Shall I hold your slot?" | Reply / book |
| 6 | 28 | +10 | **Break-up** ("closing this quote unless I hear back") | Book a call |

After #6 with no decision → move to **Lost** with reason `no_decision` (eligible for win-back sequence E later), or, if there was *some* engagement, back to Negotiation for a human.

#### D. Never Replied / Cold — long-tail drip ("stay on the radar")
Low frequency, high patience. **Monthly, max 3–4**, then archive/suppress.
Day 30, Day 60, Day 90 (then quarterly if kept warm): seasonal angle, new portfolio, limited offer. 1 email/month ceiling.

#### E. (Optional, later) Win-back for Lost — quarterly, max 2/year, only for `marketingConsent = true`.

**Stages that send NO lead emails (internal admin reminders only):** Qualified — Awaiting Quote, Negotiation — Awaiting Us. Keep the existing every-2-days admin nudge but **cap it** (e.g. 3 reminders then escalate to the morning brief) so admins aren't spammed forever either.

### 3.4 Stop conditions (the "click b" logic) — applies to every lead sequence

A sequence is **paused/stopped** the moment any of these happen:

| Signal | Source | Action |
|--------|--------|--------|
| Lead **books a call** | cal.com click / booking confirmation | **Stop sequence**, notify owner, log activity, move toward Qualified. *(This is the primary "click b".)* |
| Lead **clicks the primary CTA** | Resend `email.clicked` | **Pause** sequence + create a "hot lead — reach out" task (fixes C3). |
| Lead **replies** | Resend inbound webhook / manual mark | Stop + reset aging (already implemented). |
| **Bounce / complaint** | Resend events | Stop + suppress (already implemented). |
| **Unsubscribe** | List-Unsubscribe / link | Stop + suppress globally (new). |
| Stage → **Won/Lost** | CRM | Stop. |
| Sequence **exhausted** | internal | Move to Cold (A/B) or Lost (C). |

### 3.5 Deliverability & compliance (required before scaling sends)

- **Unsubscribe:** add a footer link + `List-Unsubscribe` and `List-Unsubscribe-Post` headers to every automated lead email; write to a suppression list checked centrally in the send path.
- **Consent:** capture `marketingConsent` at intake; for purely cold sources, lean on legitimate-interest transactional framing and always offer opt-out (UK PECR/GDPR).
- **Central guard:** a single `canSendMarketingEmail(lead)` gate in `crmEmailAutomation` that checks suppression, consent, bounce/complaint history, and the 1-per-24h cap **before** calling Resend.
- **Sending hygiene:** keep BCC configurable (C9), send in business hours, throttle to respect Resend rate limits (batch rather than tight loop), and use Resend tags/metadata (already partly present) for per-sequence analytics.

### 3.6 What "good" looks like after this (targets to measure)

- Reply/booking rate per sequence step (find the drop-off).
- % of leads reaching a booked call before sequence exhaustion.
- Unsubscribe & complaint rate < 0.1%.
- Zero "infinite" senders; zero dead-ended leads.
- Time-to-first-email < 5 min (speed-to-lead).

---

## 4. Summary of concrete changes (for when you decide to implement)

**Phase 0 (bug fixes, no behaviour redesign):** C1 schedule the cron · C2 auto-move exhausted leads · C3 pause on click/book · C4 cap proposal emails · C6 auth the cron · C8 text-template fix · C9 config the BCC · C10 quiet logging.

**Phase 1 (cadence + compliance):** implement sequences A–D with the day-offset tables · stop-condition matrix (3.4) · unsubscribe/consent/suppression + 1-per-24h + business-hours (3.5).

**Phase 2 (architecture):** `libs/crmStages.js` single stage config · split activities/notes/tasks into collections · unique email index + dedupe/merge · SWR/React-Query on the board.

**Phase 2b (tasks + notes — §2.5, §2.6):** promote `LeadTask`/`LeadNote` collections · full task composer (due date, assignee, reminder) + `check-due-tasks` cron + notifications + "My Tasks" view · rich-text notes editor with tags/attachments/@mentions + edit/delete.

**Phase 3 (features + design):** scoring · unified timeline · saved views · bulk actions · **enriched reports (§2.7: true funnel, real win rate, stage velocity, trends, loss analysis, source ROI, effort/SLA metrics, export)** · design-system pass on board + modal.

*No code in this repository was modified to produce this plan.*
