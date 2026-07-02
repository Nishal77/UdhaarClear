# WhatsApp Business template submission checklist

Meta reviews every WhatsApp message template before it can be sent to
customers — typically 3-7 days. This can't be done from code; it requires a
human with access to the Meta Business Manager for this WhatsApp Business
Account. This doc has everything needed to paste into that submission form
so nothing gets rejected and cost a review cycle.

Do this as early as possible — it's the slowest step in getting to launch,
and every other Phase 0 task can run in parallel with the review.

## Where to submit

Meta Business Manager → WhatsApp Manager → your WABA → Message Templates → Create Template.

## Category — use UTILITY for all six templates

These are transactional messages about an existing invoice a customer
already owes (a payment notice), not promotional content. Registering them
under MARKETING instead of UTILITY has two real costs:
- Marketing messages are billed at a higher per-conversation rate.
- Customers can globally opt out of marketing messages in WhatsApp, which
  would silently break the entire reminder engine for opted-out customers.

Pick **Utility** for every template below.

## Language

English (`en`) — matches what the code currently sends. Add regional
languages as separate templates later (Month 3-4 per the roadmap), each
needs its own review cycle.

## Placeholder format — numbered, not named

Every template body below uses `{{1}}`, `{{2}}`, etc. Do **not** register
these as named variables (`{{customer_name}}` style) — the code
(`lib/whatsapp/templates.ts`) sends a plain ordered array of values with no
`parameter_name` field, which only works against numbered placeholders. A
named-variable template will get every message rejected by the API at
send-time even after Meta approves the template.

---

## 1. `invoice_update_alert` (GENTLE — day -3 to +7)

**Body:**
```
Hi {{1}}, this is a payment notification from {{2}} regarding invoice #{{3}}.
Amount Due: {{4}}
Due Date: {{5}}
```

**Sample values for review** (Meta requires an example per variable):
`{{1}}` Ramesh · `{{2}}` Sharma Textiles · `{{3}}` INV-2026-0042 · `{{4}}` ₹15,000 · `{{5}}` 15 Jul 2026

**Button:** type = Visit Website (dynamic), label = "Pay Now", URL = `https://udhaarclear.in/pay/{{1}}`, sample suffix = `abc123`

---

## 2. `payment_reminder_firm` (FIRM — day +8 to +27)

**Body:**
```
Dear {{1}}, invoice {{2}} from {{3}} for {{4}} is {{5}} days overdue. Please pay by {{6}}: {{7}}
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` INV-2026-0042 · `{{3}}` Sharma Textiles · `{{4}}` ₹15,000 · `{{5}}` 10 · `{{6}}` 25 Jul 2026 · `{{7}}` https://udhaarclear.in/pay/abc123

---

## 3. `payment_reminder_legal_28` (LEGAL — day 28, after human-gate approval)

**Body:**
```
⚠️ Dear {{1}}, a formal legal demand notice has been sent to your email.

Invoice {{2}} from {{3}} for {{4}} is now 28 days overdue.

You have 7 days to pay before we file with the MSME Facilitation Council.
Consequences: permanent non-payment record, CIBIL credit impact, compound
interest at 3× RBI rate.

Pay now: {{5}}
Ref: {{6}}
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` INV-2026-0042 · `{{3}}` Sharma Textiles · `{{4}}` ₹15,000 · `{{5}}` https://udhaarclear.in/pay/abc123 · `{{6}}` LGL-2026-0091

---

## 4. `payment_reminder_legal_35` (LEGAL — day 35, 48hr ultimatum)

**Body:**
```
🚨 Dear {{1}}, your 48-hour window is now running.

Invoice {{2}} for {{3}} is 35 days overdue. Once we file with the MSME
Facilitation Council, this cannot be reversed — CIBIL impact and legal
costs will be added to your outstanding liability.

This is your last chance to avoid legal action.

Pay immediately: {{4}}
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` INV-2026-0042 · `{{3}}` ₹15,000 · `{{4}}` https://udhaarclear.in/pay/abc123

---

## 5. `payment_reminder_legal_42` (LEGAL — day 42, proceedings initiated, final auto message)

**Body:**
```
🔴 Dear {{1}}, formal legal proceedings have been initiated for non-payment
of {{2}} (Invoice {{3}}).

You will not receive further automated reminders. The matter is now with
our legal team.

To halt proceedings, pay immediately and share your UTR with {{4}}.
Ref: {{5}}
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` ₹15,000 · `{{3}}` INV-2026-0042 · `{{4}}` +91 98765 43210 · `{{5}}` LGL-2026-0091

---

## 6. `payment_confirmed` (sent to customer immediately on successful payment)

**Body:**
```
✅ Payment received! Thank you {{1}}, we've confirmed your payment of {{2}} for invoice #{{3}} to {{4}}. This invoice is now fully settled.
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` ₹15,000 · `{{3}}` INV-2026-0042 · `{{4}}` Sharma Textiles

---

## After submission

- Track approval status in Meta Business Manager (Pending → Approved/Rejected).
- If rejected, Meta gives a reason — usually wording that reads as
  aggressive/threatening. The LEGAL templates use strong language
  deliberately (matches the product's escalation ladder) — if Meta rejects
  on tone, soften "compound interest" / "CIBIL impact" phrasing first before
  resubmitting, since those are the most likely flags.
- Once approved, confirm the template names in Meta exactly match
  `TEMPLATE_NAMES` in `lib/whatsapp/templates.ts` — a mismatched name fails
  silently at send time with a Meta API error, not a build error.
