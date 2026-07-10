# CRM and email automation implementation

The roadmap in `CRM_AND_EMAIL_AUTOMATION_IMPROVEMENT_PLAN.md` is implemented in-place. Existing lead data must be migrated before the new board is enabled in production.

## Required environment variables

- `CRON_SECRET`: bearer secret used by scheduled CRM jobs.
- `UNSUBSCRIBE_SECRET`: HMAC secret used for one-click unsubscribe links. If omitted, the app falls back to `CRON_SECRET`, then `NEXTAUTH_SECRET`.
- `NEXT_PUBLIC_APP_URL` or `NEXTAUTH_URL`: public origin used in unsubscribe links.
- `CRM_EMAIL_BCC`: optional audit BCC. Leave empty to disable BCC.

## Data migration

The migration copies embedded activities, notes, and tasks into their new collections, normalises legacy stages, upgrades automation state, and removes the embedded arrays. It is idempotent and dry-run by default.

```bash
npm run migrate-crm
npm run migrate-crm -- --apply
```

The dry run reports duplicate active email addresses. Merge those leads through `POST /api/crm/leads/merge` before applying the unique active-email index.

## Scheduled jobs

- `/api/cron/email-automation`: daily at 10:00 UTC; the send policy restricts lead email to UK business hours and one automated message per 24 hours.
- `/api/cron/check-due-tasks`: daily at 09:00 UTC.
- `/api/cron/check-overdue-payments`: daily at 11:00 UTC, with per-payment/due-date deduplication.
- `/api/cron/check-overdue-activities`: daily at 09:00.
- `/api/cron/morning-brief`: weekdays at 08:00.
- `/api/cron/update-aging`: daily at 02:00.

All cron routes accept `Authorization: Bearer $CRON_SECRET`; the email/task routes also permit an authenticated admin for manual runs.

## Operational checks

1. Apply the migration in a staging database and verify collection counts.
2. Confirm Resend event and inbound webhooks point at the production routes.
3. Trigger the email cron as an admin and confirm no message is sent outside the policy window.
4. Test one-click unsubscribe and verify the lead and automation are suppressed.
5. Create a due task and confirm in-app and email reminders.
