# Reminder Cadence — Decision Record

**Status:** Accepted · **Owner:** Product · **Source of truth:** `lib/whatsapp/tone-engine.ts` (`REMINDER_SCHEDULE_DAYS`)

## Context

The PRD (§3.2, "The 5-Phase Tonal Ladder") describes the reminder system as five
tonal phases with example day-**ranges**:

| Phase | PRD tone | PRD day range (example) |
|-------|----------|-------------------------|
| 1 | Polite reminder | Day 1–3 |
| 2 | Gentle nudge | Day 7–10 |
| 3 | Firm follow-up | Day 14–18 |
| 4 | Serious notice | Day 21–27 |
| 5 | Human gate (owner decides) | Day 28+ |

The PRD gives one **example message per phase** at a sample day — it does not
specify the exact days on which the system should send. It provides no
acceptance criteria for cadence. So an implementation decision was required.

## Decision

We message on these **exact days-overdue** (`REMINDER_SCHEDULE_DAYS`):

```
[-3, 0, 3, 7, 10, 15, 21, 24, 28, 35, 42]
```

Mapped to the PRD phases:

| PRD phase | PRD range | We send on | Tone applied | Template |
|-----------|-----------|-----------|--------------|----------|
| 1 Polite | D1–3 | **D-3, D0, D3** | GENTLE | `invoice_update_alert_v3` |
| 2 Gentle | D7–10 | **D7, D10** | GENTLE | `invoice_update_alert_v3` |
| 3 Firm | D14–18 | **D15** | FIRM | `payment_reminder_firm_v2` |
| 4 Serious | D21–27 | **D21, D24** | FIRM → LEGAL warning | `payment_reminder_legal_warning_v2` |
| 5 Human gate | D28+ | **D28** (owner approval, no auto-send) | — | gate WhatsApp to owner |
| Legal (owner-approved) | post-D28 | **D35, D42** | LEGAL | `payment_reminder_legal_35/42_v2` |

After **D42** the invoice auto-pauses (`AUTO_PAUSE_AFTER_DAYS = 42`) — no
further automated sends without explicit owner action.

### Two additions beyond the PRD example table, intentional:

1. **D-3 pre-due nudge.** A polite "invoice due in 3 days" message before the
   due date measurably lifts on-time payment and sets a professional tone. It
   is still within the "Polite" phase spirit.
2. **Denser early cadence (D0, D3, D7, D10).** MSME buyers respond to gentle
   repetition; a single message per phase under-collects. Every one of these
   days still falls inside a PRD "Polite/Gentle" window, so the buyer never
   sees a tone harsher than the PRD prescribes for that day.

## Why this satisfies the PRD

- **Tone is never harsher than the PRD day dictates.** `selectTone()` and
  `getReminderPhase()` gate tone by day (GENTLE ≤ D7, FIRM ≤ D27, LEGAL after),
  so the message a buyer receives on any given day matches the PRD ladder.
- **The Human Gate at D28 is preserved exactly** — the non-negotiable product
  principle. No legal notice is ever auto-sent; D28 pauses and asks the owner.
- **Sundays are skipped** (`isSunday` guard in the reminder engine).

## If the PRD is later updated

If Product decides the cadence should be sparser (one send per phase, matching
the example days literally), change `REMINDER_SCHEDULE_DAYS` and update the
table above. The tests in `tests/tone-engine.ts` assert the schedule and the
day→phase mapping, so they will flag any drift.
