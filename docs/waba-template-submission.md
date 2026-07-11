# WhatsApp Business template submission checklist

Meta reviews every WhatsApp message template before it can be sent to
customers — typically 3-7 days. This can't be done from code; it requires a
human with access to the Meta Business Manager for this WhatsApp Business
Account. This doc has everything needed to paste into that submission form
so nothing gets rejected and cost a review cycle.

**Status (2026-07-05): templates 1-7 submitted to Meta**, several under
new `_v2`/`_v3` names (see the name table at the bottom) after Meta's
~4-week cooldown on reusing a name+language combo following an earlier
deleted attempt. `ca_partner_otp` (#8, Authentication category) — confirm
whether this one has been submitted yet.

## Where to submit

Meta Business Manager → WhatsApp Manager → your WABA → Message Templates → Create Template.

## Category — use UTILITY for templates 1-7

Templates 1-6 (Gentle → Firm → Legal Warning → 3× Legal Action) plus
`payment_confirmed` (#7) are transactional messages about an existing
invoice a customer already owes, not promotional content. `ca_partner_otp`
(#8) is the one exception — register it under **Authentication**, see its
own section below. Registering the reminder ladder under MARKETING instead
of UTILITY has two real costs:
- Marketing messages are billed at a higher per-conversation rate.
- Customers can globally opt out of marketing messages in WhatsApp, which
  would silently break the entire reminder engine for opted-out customers.

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

## Header, footer, and button — applied consistently across 1-7

- **Header** (text, own independent `{{1}}` — separate parameter space from
  the body's numbering): puts the real business name at the top of the
  message before the recipient even opens it, so it reads as coming from
  the actual business they owe money to, not spam. Tier-appropriate label:
  `Payment Reminder — {{1}}` (Gentle/Firm), `Important: Payment Notice —
  {{1}}` (Legal Warning), `Formal Notice — {{1}}` (Legal 28/35/42),
  `Payment Confirmed — {{1}}` (#7).
- **Footer** (static text, ≤60 chars, no variables): `Powered by
  udhaarclear.in` on every template.
- **Button** on 2-7: Website → **Dynamic**, label "Pay Now" (or "View
  Receipt" on #7), base URL `https://udhaarclear.in/pay/`, sample suffix
  `abc123`. A tappable button gets better click-through than a raw URL
  sitting in the body text, and moving the link out of the body also helps
  with the variable-count fix below.
- **Button on #1 (Gentle) is different** — 2 **Quick Reply** buttons
  ("Pay Full Amount" / "Pay Half Amount"), not a website link. See its own
  section below for why.
- Since the header already carries the business name, it's **dropped from
  every body** below to avoid saying it twice and to reduce variable count
  — except Legal_42, where `{{4}}` is a *phone number* for UTR sharing, not
  the business name, so it stays.

## Real Meta validation errors hit while submitting — and the fixes

1. **"Variables can't be at the start or end of the template."** Body text
   can never start or end with `{{n}}` — there must be literal words before
   the first variable and after the last one. Every body below opens with
   a real word and closes with a real sentence, never a bare variable.
2. **"This template has too many variables for its length."** Fixed by
   (a) dropping the redundant business-name variable now that it's in the
   header, (b) turning one-off descriptive lines that are always the same
   string today (like the late-fee note) into **static text** instead of a
   variable — when the real late-fee feature exists later, that one line
   gets edited and resubmitted once, a normal and expected cost — and
   (c) writing a bit more surrounding prose where useful.
3. **"Message template language is being deleted."** Happens when you
   delete a template and immediately try to reuse the same name+language —
   Meta enforces a ~4-week cooldown. Fix: use a new name (`_v2`, `_v3`)
   instead of waiting. This is why several names below have version
   suffixes.

The late-fee line itself: the MSMED Act's real formula is **3× the RBI
bank rate, compounded monthly** — not a flat 3%/month (that would be
~36% p.a., almost double the statutory ~19-21% p.a. this formula produces
at recent RBI rates, and would contradict Legal_28's own "3× RBI rate"
language). Kept as a static, MSMED-referencing sentence for exactly that
reason — accurate today, swappable for a real computed ₹ figure once the
late-fee schema field and calculation exist. Framing note: "may [now]
apply" is used deliberately instead of "now applies" — no lateFee
calculation exists in the product yet, so stating it as an active,
computed charge would be a false operational claim even though the
underlying legal entitlement is real.

---

## 1. `invoice_update_alert_v3` (GENTLE — day -3 to +7)

**Header:** `Payment Reminder — {{1}}` · sample: `Sharma Textiles`

**Body:**
```
Hi {{1}}, this is a payment notification regarding invoice #*{{2}}*.

Amount Due: *{{3}}*
Due Date: *{{4}}*

You can pay in full, or split it into two easier payments — your choice.
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` INV-2026-0042 · `{{3}}` ₹15,000 · `{{4}}` 15 Jul 2026

**Footer:** `Powered by udhaarclear.in`

**Buttons:** Quick Reply × 2 (type: Custom) — `Pay Full Amount` · `Pay Half Amount`

**Why Quick Reply here, Website everywhere else:** this is the one
template offering the negotiable full/half choice discussed at length —
see [[negotiable-half-payment-gentle]] memory. A Website button never
reports back which one was tapped (no webhook fires), so there's no way
for the backend to know "buyer chose half" and react. Quick Reply posts
the tap back through the inbound webhook instead. **Important gap:** no
backend handler for this exists yet — tapping either button today sends
the payload to `app/api/webhooks/whatsapp/route.ts` but nothing reads or
responds to it, so the buyer sees no follow-up message. Build that handler
before relying on this in production; the template can be approved in the
meantime, it just won't do anything useful until the handler exists. Also
note: this basic Meta builder doesn't expose a custom payload/ID field —
Meta auto-assigns one (likely the button index or title text). Once
approved, send a real test tap and log the actual webhook payload to see
what value arrives before writing the matching logic — don't assume it's
a string you chose.

---

## 2. `payment_reminder_firm_v2` (FIRM — day +8 to +21)

**Header:** `Payment Reminder — {{1}}` · sample: `Sharma Textiles`

**Body:**
```
Dear {{1}}, invoice {{2}} for *{{3}}* is now {{4}} days overdue.

A late fee may apply as per our payment terms — please clear this at the earliest.

Kindly complete payment by {{5}} to avoid further follow-up action from our team.
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` INV-2026-0042 · `{{3}}` ₹15,000 · `{{4}}` 10 · `{{5}}` 25 Jul 2026

**Footer:** `Powered by udhaarclear.in`

**Button:** Website → Dynamic · "Pay Now" · URL `https://udhaarclear.in/pay/` · sample suffix `abc123`

---

## 3. `payment_reminder_legal_warning_v2` (LEGAL WARNING — day +22 to +27, NEW)

Added to close a real gap: the PRD's tonal ladder (section 6.1.2) has a
distinct "Legal warning" phase at day 22-27 — stern tone, references the
MSMED Act 45-day rule, signals formal action is coming — that the code
previously skipped, jumping straight from Firm to the Day-28 human gate.
Still fully automated; the human gate still only starts at Day 28.

**Header:** `Important: Payment Notice — {{1}}` · sample: `Sharma Textiles`

**Body:**
```
⚠️ Dear {{1}}, invoice {{2}} for *{{3}}* is now {{4}} days overdue.

A late fee (as per MSMED Act guidelines — 3× RBI bank rate, compounding monthly) may now apply to this invoice.

Under the MSMED Act, payment is due within 45 days — please clear this immediately to avoid formal action.
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` INV-2026-0042 · `{{3}}` ₹15,000 · `{{4}}` 24

**Footer:** `Powered by udhaarclear.in`

**Button:** Website → Dynamic · "Pay Now" · URL `https://udhaarclear.in/pay/` · sample suffix `abc123`

---

## 4. `payment_reminder_legal_28_v2` (LEGAL — day 28, after human-gate approval)

Only sent after the business owner replies "Yes [Customer]" to the Day-28
human-gate message (see `lib/cron/reminder-engine.ts` and Command 7 in
`lib/whatsapp/bot.ts`) — never fires automatically.

**Header:** `Formal Notice — {{1}}` · sample: `Sharma Textiles`

**Body:**
```
⚠️ Dear {{1}}, a formal legal demand notice has been sent to your email.

Invoice {{2}} for *{{3}}* is now 28 days overdue.

You have 7 days to pay before we file a case with the MSME Facilitation Council. Once filed, the Council's award is legally enforceable exactly like a court decree — recoverable through attachment of your business assets, bank accounts, or property. This will also affect your credit history and standing with future suppliers. Compound interest at 3× the RBI bank rate continues to accrue until settled.

Ref: {{4}} — resolve this today to avoid escalation.
```

The stronger wording here (decree enforceability, asset attachment) is
deliberate and factually accurate — Section 18(3) of the MSMED Act really
does make a Facilitation Council award executable like a court decree.
Kept truthful rather than inventing scarier-but-false consequences (no
criminal/arrest language — this is a civil recovery mechanism), both
because false threats are legally risky for the business and because Meta
rejects templates that read as aggressive/threatening beyond what's true.

**Sample values:**
`{{1}}` Ramesh · `{{2}}` INV-2026-0042 · `{{3}}` ₹15,000 · `{{4}}` LGL-2026-0091

**Footer:** `Powered by udhaarclear.in`

**Button:** Website → Dynamic · "Pay Now" · URL `https://udhaarclear.in/pay/` · sample suffix `abc123`

---

## 5. `payment_reminder_legal_35_v2` (LEGAL — day 35, 48hr ultimatum)

**Header:** `Formal Notice — {{1}}` · sample: `Sharma Textiles`

**Body:**
```
🚨 Dear {{1}}, your 48-hour window is now running.

Invoice {{2}} for *{{3}}* is 35 days overdue. Once we file with the MSME Facilitation Council, this cannot be reversed — the award becomes enforceable like a court decree, and legal costs will be added to your outstanding liability. Your credit history and standing with future suppliers will also be affected.

This is your last chance to avoid legal action — act now.
```

Rewritten from an earlier draft that garbled "CIBIL impact ... added to
your outstanding liability" — credit impact isn't a monetary amount that
gets "added," that phrasing only makes sense for legal costs. Split into
two accurate clauses, and made consistent with Legal_28's decree/
attachment language so the ladder escalates coherently instead of
introducing a vaguer claim at a supposedly worse stage.

**Sample values:**
`{{1}}` Ramesh · `{{2}}` INV-2026-0042 · `{{3}}` ₹15,000

**Footer:** `Powered by udhaarclear.in`

**Button:** Website → Dynamic · "Pay Now" · URL `https://udhaarclear.in/pay/` · sample suffix `abc123`

---

## 6. `payment_reminder_legal_42_v2` (LEGAL — day 42, proceedings initiated, final auto message)

**Header:** `Formal Notice — {{1}}` · sample: `Sharma Textiles`

**Body:**
```
🔴 Dear {{1}}, formal legal proceedings have been initiated for non-payment of *{{2}}* (Invoice {{3}}).

You will not receive further automated reminders. The matter is now with our legal team.

To halt proceedings, pay immediately using the button below and share your UTR with {{4}} for confirmation.
Ref: {{5}} — this is your final opportunity to resolve this matter.
```

`{{4}}` here is the business's own phone number (for UTR sharing), kept in
the body since it's different information from the business name already
in the header. The button and the UTR-share instruction are both kept —
not redundant: the button + Razorpay webhook auto-confirms payment on our
side, but halting an actual legal filing plausibly needs a conscious human
action from the owner too, so a manual UTR notification alongside the
button makes sense at this final stage. Earlier draft mentioned the UTR
step without ever referencing the button, reading like manual bank
transfer was the only option — fixed by explicitly connecting the two.

Large-payment note: buyers preferring a direct bank/UPI transfer over
Razorpay already see full bank details (account number, IFSC, UPI ID) on
the `/pay/[id]` page itself (`app/pay/[id]/PaymentClient.tsx`) once they
tap the button — no need to put bank details directly in the WhatsApp
template text.

**Sample values:**
`{{1}}` Ramesh · `{{2}}` ₹15,000 · `{{3}}` INV-2026-0042 · `{{4}}` +91 98765 43210 · `{{5}}` LGL-2026-0091

**Footer:** `Powered by udhaarclear.in`

**Button:** Website → Dynamic · "Pay Now" · URL `https://udhaarclear.in/pay/` · sample suffix `abc123`

---

## 7. `payment_confirmed` (sent to customer immediately on successful payment)

**Header:** `Payment Confirmed — {{1}}` · sample: `Sharma Textiles`

**Body:**
```
✅ Payment received! Thank you {{1}}, we've confirmed your payment of *{{2}}* for invoice #{{3}}. This invoice is now fully settled.
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` ₹15,000 · `{{3}}` INV-2026-0042

**Footer:** `Powered by udhaarclear.in`

**Button:** Website → Dynamic · "View Receipt" · URL `https://udhaarclear.in/pay/` · sample suffix `abc123/confirm`

Links to the existing `/pay/[id]/confirm` page (`app/pay/[id]/confirm/page.tsx`)
which already shows payment status, amount, and invoice number — no new
backend work needed for this button. A true downloadable PDF receipt
(following the same pattern as the legal-notice PDF, `@react-pdf/renderer`)
would be a separate, bigger feature if a more formal document is ever wanted.

---

## 8. `payment_pending_approval` (owner-facing payment verification — Utility category, NEW)

**Header:** `Payment Pending — {{1}}` · sample: `Sharma Textiles`

**Body:**
```
Customer {{1}} has submitted a payment of {{2}} for Invoice {{3}} (UTR: {{4}}).

Please verify this against your bank statement and approve or reject below.
```

**Sample values:**
`{{1}}` Ramesh · `{{2}}` ₹15,000 · `{{3}}` INV-2026-0042 · `{{4}}` UTR12345678

**Footer:** `Powered by udhaarclear.in`

**Buttons:** Quick Reply × 2 (type: Custom) — `✅ Approve` · `❌ Reject`

---

## 9. `ca_partner_otp` (CA partner phone verification — register under AUTHENTICATION category, not Utility)

**Body:**
```
Your UdhaarClear CA partner verification code is {{1}}. Valid for 10 minutes. Do not share this code with anyone.
```

Fixed from an earlier draft that started with `{{1}}` — hit the same
"variables can't be at the start" error as the Utility templates, so the
variable was moved to the middle.

**Sample values:**
`{{1}}` 482913

Meta's Authentication category has its own submission flow separate from
Utility/Marketing — when creating this template, pick "Authentication" as
the category in Meta Business Manager, not Utility. That builder is more
restricted (often no custom header/footer/button, sometimes auto-filled
wording) — check what's actually editable in your account's Authentication
template flow. This is the CA's first message from the business's WABA
number, so — same reasoning as the other templates — it must be
pre-approved; a free-form `sendTextMessage` call would be rejected outside
an existing 24-hour conversation window.

---

## Template names — exact values submitted to Meta (2026-07-05)

| # | Name field in Meta | Category | Status |
|---|---|---|---|
| 1 | `invoice_update_alert_v3` | Utility | Submitted |
| 2 | `payment_reminder_firm_v2` | Utility | Submitted |
| 3 | `payment_reminder_legal_warning_v2` | Utility | Submitted |
| 4 | `payment_reminder_legal_28_v2` | Utility | Submitted |
| 5 | `payment_reminder_legal_35_v2` | Utility | Submitted |
| 6 | `payment_reminder_legal_42_v2` | Utility | Submitted |
| 7 | `payment_confirmed` | Utility | Submitted |
| 8 | `payment_pending_approval` | Utility | New |
| 9 | `ca_partner_otp` | Authentication | Confirm status |

These match `TEMPLATE_NAMES` in `lib/whatsapp/templates.ts` as of
2026-07-05 — a mismatch fails silently at send time with a Meta API
error, not a build error. If any of these get deleted and resubmitted
again later, expect another `_v2`/`_v3`-style bump and update the code
again to match.

## After submission

- Track approval status in Meta Business Manager (Pending → Approved/Rejected).
- If rejected, Meta gives a reason — usually wording that reads as
  aggressive/threatening. The LEGAL templates use strong but factually
  accurate language deliberately (matches the product's escalation
  ladder, backed by real MSMED Act mechanics) — if Meta rejects on tone,
  soften the decree/attachment or credit-history phrasing first before
  resubmitting.
- **Code changes still needed, not done yet:**
  1. `lib/whatsapp/templates.ts` builder functions (`buildGentleComponents`,
     `buildFirmComponents`, etc.) still send the old parameter shapes —
     need updating to match the actual approved bodies above: fewer body
     params (business name dropped in most), a header parameter, and
     button parameters instead of inline link text.
  2. `lib/services/reminder-service.ts` needs the same sync for whichever
     template it calls.
  3. Gentle's Quick Reply webhook handler (see template #1's notes above)
     — entirely new, doesn't exist yet.
  4. `payment_confirmed`'s new "View Receipt" button param (invoice ID +
     `/confirm` suffix).
