# UdhaarClear — PRODUCT.md

> Consolidated product specification. Everything decided across the evaluation, feature architecture and pricing work.
> **Purpose:** a diff target. Tick what exists, flag what doesn't, argue with what's wrong.
> **Last updated:** 6 August 2026

---

## How to use this file

Put it in the repo root next to `CLAUDE.md`. Every feature is a checkbox. Go through §6 with the codebase open and mark what's actually built. The gap between the ticks and §7 (the v1 twelve) is your real backlog.

**Evidence tags used throughout:**

| Tag | Meaning |
|---|---|
| `[FACT]` | Verified against a cited public source or the repo itself |
| `[EST]` | Arithmetic derived from facts; derivation shown |
| `[ASSUME]` | Judgement, not evidence. Confidence stated. |
| `[OPEN]` | Unvalidated. Needs a customer to answer. |

---

## 1. Decision record — why this product

**UdhaarClear was chosen over Pipeline (AI receptionist) at 82% confidence.** The full comparison ran twice, across 50 and then 60 weighted criteria. Final scores: UdhaarClear 7.26/10, Pipeline 4.38/10.

The deciding argument was not market size or problem quality — Pipeline has the better problem and a higher ceiling. It was this:

> **An AI receptionist's value scales with local labour cost. Receivables recovery value scales with cost of capital and payment-delay severity. India has the cheapest relevant labour on earth and some of the most expensive SME credit. Pipeline is least valuable exactly where you can sell it. UdhaarClear is most valuable exactly where you can sell it.**

Supporting figures:

- `[FACT]` Indian receptionist salary ₹13,003–19,621/month vs US $2,897–3,088/month.
- `[EST]` At production voice-AI pricing ($0.12–0.25/min), an Indian AI receptionist costs ₹9,504–19,800/month against a human at ₹13,000–19,600. The arbitrage is 0.7–2.1x in India versus 12.9–28.6x in the US.
- `[EST]` Pipeline gross margin in India: **−375% to +34%**. UdhaarClear: **82–99%**.
- `[FACT]` Pipeline's category already has Avoca ($125M+, $1B valuation, Kleiner Perkins/YC), Assort Health (~$50M Series B at $750M), Hello Patient ($20M at $100M), Beside ($32M), plus Housecall Pro, Jobber and ServiceTitan bundling the feature free.

**Pipeline is not dead — it is deferred and repositioned.** Its voice technology belongs inside UdhaarClear as a collections caller (see §6.5). A 60–90 second outbound collections call runs at 65–90% gross margin, versus negative margin on receptionist workloads.

---

## 2. Product thesis

### 2.1 What this is

Not "dunning software." That framing caps you at ~₹60,000 ACV.

**UdhaarClear is the system of record for what Indian businesses are owed.** Owning that record means owning the communication history, the promise history, the dispute history and the eventual payment — a proprietary behavioural dataset on Indian B2B buyers that no bank, bureau or accounting package has.

`[OPINION]` The software is how you acquire the data. The data is the company.

### 2.2 The value ladder

| Layer | Does | Monetises as | ACV | When |
|---|---|---|---|---|
| **L1 Record** | Know what you're owed | Free tier | ₹0 | Now |
| **L2 Engagement** | Get it collected | Subscription | ₹18–48K | Now |
| **L3 Intelligence** | Know who pays, when, why | Higher tier | ₹1.2–2.4L | Year 2 |
| **L4 Network** | Debtors, CAs, suppliers on-platform | Seats + take rate | ₹2–5L | Year 3 |
| **L5 Capital** | Finance the receivable | Take rate on volume | ₹3–15L | Year 4+ |

`[OPINION]` Most AR startups die at L2 because they price L2 like L2 and never build L3. Growfin (`[FACT]` $8.9M raised) went upmarket and to San Francisco instead of climbing. Recordent (`[FACT]` ~$400K raised) stayed at L1/L2.

### 2.3 The three defensible assets

1. **Regulatory encoding** — 43B(h), MSMED, RBI recovery conduct and DPDP built in as product logic. A Western tool cannot ship this without rebuilding for India.
2. **Compounding behavioural data** — every reminder, reply, promise and payment improves scoring for every customer.
3. **CA and Tally-partner distribution** — relationship channels a foreign competitor cannot buy.

---

## 3. Market and regulatory facts

All `[FACT]` unless marked.

### 3.1 The demand evidence

- **216,221** delayed-payment applications worth **₹47,677.28 crore (~$5.4B)** filed on MSME Samadhaan through December 2025.
- **Section 43B(h)** (Finance Act 2023) disallows a buyer's tax deduction on purchases from registered micro/small enterprises unless paid within **15 days** (no written agreement) or **45 days** (with one).
- **MSMED Act** mandates compound interest at **3× the RBI bank rate** on delayed payments.
- `[EST]` A ₹20 crore supplier cutting DSO by 15 days releases **₹82 lakh** of working capital, saving ~**₹12.3 lakh/year** in interest at 15%.

**Why this matters more than TAM:** 43B(h) creates a legally-anchored, calendar-driven buying trigger that fires every fiscal year. Compliance workflows sell; productivity tools don't.

### 3.2 RBI recovery conduct framework — effective 1 July 2026

Provisions: contact only **8 AM–7 PM**; no holidays without permission; avoid bereavement, marriage functions and festivals; "reasonable" contact frequency (10 calls/day characterised as harassment); mandatory call recording; limits on sharing borrower data; **vicarious liability** making the principal fully responsible for its agents.

`[ASSUME — Medium-High confidence]` **These bind lenders and NBFCs, not trade creditors chasing their own invoices.** Do not overstate this in sales material. But: they set the norm counterparties will reason from, they bind you directly at L5, and building to them costs almost nothing while making you the only vendor who can say "compliant by construction."

### 3.3 DPDP Act enforcement timeline

- Phase 1 (Nov 2025) — Data Protection Board constituted. In force.
- Phase 2 — **13 November 2026**: Consent Manager integration mandatory.
- Full substantive compliance — **13 May 2027**.
- Penalties up to **₹250 crore per violation**.

### 3.4 WhatsApp economics — the margin lever

India rates, 2026: utility **₹0.1150**, marketing **₹0.8631**, authentication ₹0.1150 per message, +18% GST. Meta moved to per-message pricing in 2025 and raised marketing ~10% in 2026.

`[EST]` Including GST: utility **₹0.1357**, marketing **₹1.0185** — a **7.5x** difference.

| Message mix (500 reminders/mo) | COGS/customer/mo | GM at ₹3,999 |
|---|---|---|
| 100% utility | **₹67.85** | **98.3%** |
| 80/20 utility/marketing | ₹156.13 | 96.1% |
| 100% marketing | ₹509.23 | 87.3% |

**Template classification is a gross-margin feature, not a compliance chore.** A product engineered so reminders legitimately qualify as *utility* messages carries a 7.5x cost advantage. At 10,000 customers that is ₹0.07 crore/month versus ₹0.51 crore/month.

⚠️ **Utility messages are free inside the 24-hour customer service window only until 1 October 2026.** Build reply-triggered sending to exploit it while it lasts, and model COGS for the post-October world.

### 3.5 Market sizing

| Layer | Figure | Basis |
|---|---|---|
| Global AR automation TAM | $4.1–4.6B (2026), 13–16% CAGR | `[FACT]` Enterprise-weighted |
| India TAM | `[EST]` $150–300M | India ~3–6% of global enterprise software spend |
| SAM | `[EST]` $72–145M | 200–400K Indian B2B suppliers at ₹5–50 cr revenue selling on credit |
| SOM 3yr | `[EST]` ₹7–11 cr ARR | 900–1,200 customers |

---

## 4. Customer

### 4.1 Primary ICP `[ASSUME — Medium confidence, needs validation]`

- Indian B2B supplier, **₹5–50 crore** annual revenue
- Sells on 30–90 day credit to 50–500 recurring business buyers
- Sectors: auto components, pharma distribution, textiles, industrial supplies, packaging, chemicals, electrical goods, building materials, IT/staffing
- 1–3 people in accounts, runs Tally or Zoho Books
- DSO 60–120 days and knows it

**Not smaller:** below ₹5 crore the owner *is* the AR function; ARPU collapses; churn is brutal.
**Not larger:** above ₹100 crore you fight HighRadius and enterprise procurement with no reference customers.

### 4.2 Secondary ICP

Chartered accountancy firms and outsourced CFO practices managing 10–40 SMB clients. `[ASSUME — Medium confidence]` Possibly the *right* primary channel. One CA relationship can seed a dozen accounts.

### 4.3 Buying roles

User = accounts executive. Decision maker = finance head or promoter. **Economic buyer = the promoter** (in Indian SMBs of this size, the promoter signs everything). **Blocker = the CA**, unless you convert them into the channel.

### 4.4 The objection that kills deals

> *"I can't send automated escalating reminders to the buyer who is 60% of my revenue."*

`[OPEN]` **This is the single most important thing to test in customer conversation one.** If 80% of prospects say they'd never automate their largest accounts, the product works best on the receivables that matter least — a serious structural problem requiring redesign around mid-tail debtors.

Current answer: per-debtor policy override with a **hard manual gate** on strategic accounts, plus relationship value (% of your revenue) displayed next to every escalation decision.

---

## 5. Competition

| Competitor | Funding `[FACT]` | Published price | Threat |
|---|---|---|---|
| **Excel + the owner's memory** | ₹0 | Free | **Highest — this is who you lose to** |
| Zoho Books / Tally | Enormous installed base | ₹1,499/mo · ₹26,550 one-time | **High — bundling risk** |
| HighRadius | Multi-billion valuation | $50–500K/yr | Low direct (enterprise), high if they move down |
| Growfin | $8.9M ($7.5M Series A, SWC Global + 3one4) | Not published | Medium — vacated Indian mid-market |
| Recordent | ~$400K over 2 rounds | Not published | Medium — closest rival, underfunded |
| Chaser | — | £199/mo (~₹22,288) | Low in India |
| Upflow | — | Not published (~$440/mo) | Low. **No credit control at all** `[FACT]` |
| Kolleno | — | £650/**user**/mo (~₹72,800) | Low |
| Gaviti | — | $500–2,000/user/mo | Low |
| Kapittx, CredFlow | — | Not published | Medium |
| CredAble, KredX, Invoicemart, TReDS | Well-funded | Take rate | Partners or acquirers, not rivals |
| Collection agencies | — | **10–25% of recovered** | Reveals true WTP |

**Nine of ten competitors require a demo before quoting a price.** `[OPINION]` Publishing your pricing is free, immediately differentiating, and structurally hard for them to copy because their sales model depends on anchoring you in a call.

### Documented competitor weaknesses `[FACT]`

- **HighRadius** — complex setup, limited customisation, high technical complexity requiring significant training, support quality varies between executive and front-line users.
- **Upflow** — no credit checking, credit limits or credit monitoring; complaints on invoicing delays and payment configuration complexity.
- **Stripe Invoicing** — overwhelming interface, reporting lacks depth on unpaid invoices, limited template customisation.
- **Podium** (adjacent category) — 95 G2 mentions of missing promised features, 71 of excessive pricing, 65 of poor support; 63 BBB complaints in three years, mostly billing disputes and auto-renewal traps.

---

## 6. Feature inventory — the diff target

307 features, five layers. **Tick what exists in the repo today.**

### 6.1 L1 — System of Record

**Ingestion**
- [ ] CSV / Excel import with drag-and-drop
- [ ] Column auto-mapping with fallback
- [ ] Import preview with row-level error highlighting
- [ ] Partial import (accept good rows, quarantine bad)
- [ ] Duplicate invoice detection
- [ ] Import history and rollback
- [ ] Manual invoice entry
- [ ] Invoice attachments (PDF, JPG)
- [ ] Tally XML over HTTP import — `[FACT]` Tally exposes an HTTP endpoint on port 9000 accepting XML envelopes
- [ ] Tally ODBC read path — `[FACT]` SQL over ODBC on port 9000, read-heavy
- [ ] TallyConnector-based sync service — `[FACT]` open-source library available
- [ ] Cloud-Tally via Virtual Computer Connection Client
- [ ] Zoho Books API sync
- [ ] Busy / Marg / Vyapar / QuickBooks India
- [ ] GST e-invoice (IRP) ingestion
- [ ] GSTR-1 reconciliation for unbilled revenue
- [ ] Email-to-invoice (forward a PDF, AI extracts)
- [ ] WhatsApp-to-invoice (photograph paper invoice)
- [ ] Scheduled sync + conflict resolution UI
- [ ] Sync failure alerting and health dashboard

**Ledger**
- [ ] Invoice record (number, date, due date, amount, tax, terms, PO ref, status)
- [ ] Debtor master with multiple contacts and roles
- [ ] Ageing buckets (0-30/31-60/61-90/90+/180+), configurable
- [ ] Outstanding summary, DSO, DSO trend
- [ ] Multi-entity (one owner, several GSTINs)
- [ ] Partial payment allocation, overpayment, credit notes
- [ ] Invoice status machine (raised→sent→acknowledged→disputed→promised→part-paid→paid→written off)
- [ ] **Debtor timeline** — every invoice, message, reply, promise, dispute, payment in one chronological view ★ MOAT
- [ ] Internal notes with @mentions

**Debtor profile**
- [ ] Segment tags (strategic / standard / at-risk / write-off candidate)
- [ ] **Strategic-account flag with hard automation gate** ★ closes deals
- [ ] Payment terms per debtor
- [ ] Credit limit, utilisation, breach alerts ★ DIFF — Upflow lacks this entirely
- [ ] Udyam / MSME registration status (drives 43B(h) applicability) ★ DIFF
- [ ] Preferred channel, language, contact time
- [ ] Relationship value (% of your revenue) shown at escalation decisions
- [ ] Promise reliability score ★ MOAT
- [ ] Average days-to-pay ★ MOAT

### 6.2 L2 — Engagement Engine

**Escalation ladders**
- [ ] Ladder builder — ordered steps with day offsets
- [ ] Step 1: pre-due courtesy reminder
- [ ] Step 2: due-date reminder
- [ ] Step 3: polite overdue reminder
- [ ] Step 4: firm reminder with statement attached
- [ ] Step 5: **MSMED interest notice with computed interest** ★ DIFF
- [ ] Step 6: **43B(h) tax-disallowance advisory to buyer's finance team** ★ DIFF
- [ ] Step 7: formal legal-language notice
- [ ] Step 8: advocate notice (lawyer-reviewed)
- [ ] Step 9: **Samadhaan filing pack** ★ DIFF MOAT
- [ ] Step 10: Section 138 cheque-bounce notice
- [ ] Per-debtor policy override
- [ ] Pause / resume / skip mid-ladder
- [ ] Send preview and batch dry-run
- [ ] Visible undo window after batch dispatch
- [ ] **Escalation temperature** — one slider, gentle to firm ★ DIFF
- [ ] Sector ladder templates
- [ ] Conditional branching (promise → hold; dispute → route; silent → escalate)
- [ ] Auto-resume at paused step after dispute resolves
- [ ] Bulk actions (pause all, escalate bucket, exclude list)
- [ ] Ladder A/B testing measured on **recovery rate** ★ MOAT

**Messaging**
- [ ] WhatsApp Business API via BSP, template approval tracking
- [ ] **Utility-template classifier** — warns when wording pushes a template into the 7.5x marketing category ★ MARGIN
- [ ] **Service-window optimiser** — queue follow-ups inside the free 24-hour window ★ MARGIN
- [ ] SMS with DLT-registered sender IDs
- [ ] Email with SPF/DKIM/DMARC
- [ ] Channel cost display before batch send ★ MARGIN
- [ ] Multi-BSP failover (a restricted sender is business-ending)
- [ ] **Unified inbox** across all channels ★ MOAT
- [ ] Reply assignment with SLA timers
- [ ] Opt-out handling, suppression list, consent audit trail
- [ ] Multilingual templates — Hindi, Tamil, Telugu, Marathi, Gujarati, Kannada, Bengali, Malayalam ★ DIFF
- [ ] Template library with versioning
- [ ] Branded reminder footer (every reminder is read by another supplier — viral surface)

**Promise-to-pay and disputes**
- [ ] Promise capture (date, amount, who committed)
- [ ] Auto follow-up on promise date
- [ ] Broken-promise flag and re-escalation
- [ ] Dispute logging with Indian reason codes (quality, quantity, rate difference, GST mismatch, missing e-way bill, documentation, PO mismatch, damaged goods, service SLA)
- [ ] Dispute assignment with resolution SLA
- [ ] Auto-pause ladder on dispute
- [ ] **Revenue-leak report** — "₹14 lakh stuck on documentation, not unwillingness to pay" ★ DIFF
- [ ] Payment plan / instalment scheduler
- [ ] Write-off request and approval chain

**Payments**
- [ ] Razorpay / Cashfree payment links in every message
- [ ] UPI intent deep link and dynamic QR
- [ ] Payment landing page, mobile-first, in debtor's language
- [ ] Partial payment capture and allocation
- [ ] Auto-reconciliation by amount, UTR, reference, debtor
- [ ] Confidence-scored matches with human review queue
- [ ] Ladder auto-stop on payment
- [ ] Relationship-repair message after hard escalation resolves
- [ ] eNACH / auto-debit mandate setup ★ DIFF
- [ ] Early-payment discount engine
- [ ] Payment write-back to Tally/Zoho ★ MOAT — makes integration two-way and sticky

### 6.3 L3 — Intelligence

**AI in the loop**
- [ ] Reply classification (promise / dispute / partial / wrong-contact / abusive / ignore)
- [ ] Promise extraction from free text ("we'll clear it after Diwali" → date + amount, ambiguity surfaced not guessed)
- [ ] Message generation with tone control, in debtor's language and script (including Romanised Hindi)
- [ ] Dispute reason classification and routing
- [ ] Contact-person extraction from replies
- [ ] Sentiment / escalation-risk detection
- [ ] Invoice data extraction from PDFs and photographs
- [ ] Thread summarisation before you call

**Scoring**
- [ ] Recovery likelihood per invoice, **with reasoning shown** ★ MOAT
- [ ] Predicted days-to-payment ★ MOAT
- [ ] Next-best-action ranking ★ MOAT
- [ ] Payment-behaviour fingerprint per debtor ★ MOAT
- [ ] Anomaly detection (prompt debtor goes quiet = distress signal) ★ DIFF
- [ ] Portfolio risk concentration
- [ ] Cross-customer buyer scoring ★ MOAT — the private credit bureau begins here

**Analytics**
- [ ] Single-screen dashboard (outstanding, overdue, DSO, collected this month)
- [ ] **Rupees recovered, attributed** ★ NORTH STAR — instrument day one, painful to retrofit
- [ ] Collection Effectiveness Index, roll-rate, bucket migration waterfall
- [ ] Cash-flow forecast with scenario toggle
- [ ] Team performance (recovery by collector, promise-keep rate)
- [ ] Channel effectiveness — recovery rate and cost per recovery ★ MARGIN
- [ ] **CA-ready client report** — one PDF a CA forwards unedited ★ DIFF, distribution disguised as a feature
- [ ] **43B(h) exposure report** ★ DIFF, timed to year-end
- [ ] Owner voice-note summary ★ DIFF

### 6.4 Compliance Engine ★ most defensible module

- [ ] **Contact-window enforcement 8 AM–7 PM**, override requires written reason ★ COMPLY
- [ ] **Indian festival and holiday suppression** with state-level variation ★ COMPLY
- [ ] **Contact frequency caps** with warning before breach ★ COMPLY
- [ ] Occasion suppression flag (bereavement, unavailable)
- [ ] Prohibited-language filter (abusive, coercive, threatening)
- [ ] Immutable communication audit trail, exportable as evidence ★ MOAT
- [ ] Escalation approval gate — legal notices require a named human approver
- [ ] "Compliance-safe mode" — one switch enforcing everything above
- [ ] DPDP: consent capture and notice at collection
- [ ] DPDP: purpose limitation tagging
- [ ] DPDP: retention policies with automated deletion
- [ ] DPDP: erasure and correction workflows
- [ ] DPDP: breach detection and 72-hour reporting
- [ ] DPDP: Consent Manager integration (**mandatory 13 Nov 2026**)
- [ ] MSMED interest calculator (3× RBI bank rate, compounded)
- [ ] 43B(h) applicability engine driven by Udyam status
- [ ] Samadhaan filing pack generation
- [ ] Limitation Act tracking (3-year alerts before claims time-bar) ★ DIFF

### 6.5 L4 Network / L5 Capital — Year 3+

- [ ] **Debtor portal** — your customer's customer logs in, disputes, pays ★ MOAT, converts to two-sided network
- [ ] **CA multi-client portal** — one login, forty client ledgers ★ MOAT, best channel and stickiest accounts
- [ ] Cross-supplier buyer reputation graph ★ MOAT
- [ ] **Collections voice agent in Indian languages** ★ MOAT — Pipeline's technology in its correct home; 60–90s outbound calls at 65–90% GM
- [ ] Financeable-invoice surfacing
- [ ] NBFC partner marketplace with competing offers
- [ ] **Underwriting data API** ★ MOAT — the ₹100 crore line item
- [ ] Buyer credit rating — the private bureau play
- [ ] TReDS integration, co-lending workflow

### 6.6 Platform infrastructure

- [ ] Multi-tenant with row-level isolation (**architectural — not retrofittable**)
- [ ] Auth: email, Google, **phone OTP** (Indian SMBs prefer phone)
- [ ] Organisation / workspace model
- [ ] Roles: owner, finance head, collector, view-only
- [ ] Immutable audit log per user and object
- [ ] Notification service with retry and suppression
- [ ] **Background job queue with retries, dead-letter and idempotency** — reminder delivery reliability is the core promise; a cron loop is not acceptable
- [ ] AI provider abstraction (swap models without touching product code)
- [ ] Feature flags
- [ ] Global search across debtors, invoices, conversations
- [ ] Rate limiting and idempotency keys on mutating endpoints
- [ ] SSO/SAML, SCIM, IP allowlisting, data residency *(Enterprise, Year 2+)*
- [ ] Public REST API, signed webhooks, SDKs *(Year 2+)*

---

## 7. The v1 — what ships first

**Twelve features. Four to six weeks from the existing 91 commits.** Everything else waits.

| # | Feature | Why it's in v1 |
|---|---|---|
| 1 | CSV/Excel import handling messy Tally exports | The entire funnel. If import fails nothing else matters |
| 2 | Ageing dashboard — one number, large | The "oh god" moment that closes the demo |
| 3 | Debtor list with contacts | Minimum viable record |
| 4 | 3-step WhatsApp escalation ladder | The core loop |
| 5 | **Utility-template classifier** | 7.5x cost lever; cheap now, painful later ★ MARGIN |
| 6 | UPI/Razorpay link in every message | Removes the last step between reminder and cash |
| 7 | **Strategic-account manual gate** | Answers the objection that kills demos |
| 8 | Promise-to-pay capture + auto follow-up | Highest-ROI workflow in collections |
| 9 | **Rupees-recovered attribution** | North Star; basis of any outcome pricing later |
| 10 | **Contact window + festival suppression** | Trivial now, differentiating immediately ★ COMPLY |
| 11 | MSMED interest notice generator | Differentiation, in v1, deliberately |
| 12 | Reply classification (promise/dispute/ignore) | First genuinely useful AI, not AI theatre |

**Explicitly not in v1:** Tally two-way sync, multilingual, scoring, forecasting, disputes module, team roles, API, debtor portal, voice, financing.

---

## 8. Pricing — final

### 8.1 The model

**Priced on receivables under management, not seats.** A supplier with ₹2 crore outstanding pays more than one with ₹40 lakh, because you're doing more work and they're getting more back. No competitor prices this way.

| Tier | Monthly | Annual | Band | Cost framing |
|---|---|---|---|---|
| **Free** | ₹0 | ₹0 | Any | Read-only. See it, can't send it |
| **Starter** | ₹1,499 | ₹14,990 | ≤ ₹50 L outstanding | ~₹18,000/yr to chase ₹25 lakh |
| **Growth** ★ | ₹3,999 | ₹39,990 | ₹50 L – ₹2 cr | ~₹48,000/yr to chase ₹1.25 crore |
| **Scale** | ₹9,999 | ₹99,990 | ₹2 – 10 cr | ~₹1.2 lakh/yr to chase ₹6 crore |
| **Enterprise** | Custom | — | ₹10 cr+ | — |

Annual = ten months charged for twelve. All prices exclude 18% GST.

`[EST]` Blended ACV **₹59,988**. ₹10 crore ARR needs **1,667 customers**; ₹100 crore needs **16,670**.

### 8.2 Why free is read-only

Import your ledger, see the ageing dashboard, see ₹47 lakh overdue — then click Send and hit the paywall. The upgrade trigger lives inside the product at the moment of maximum motivation, not on the pricing page.

It also costs nothing: no messages sent means no WhatsApp COGS, and nobody files a support ticket about reading a dashboard. `[EST]` A sending free tier at 500 users would consume ~167 hours/month of support time against ~160 available working hours.

### 8.3 Why ₹1,499 and not ₹2,499

`[FACT]` Zoho Books Professional is ₹1,499/month for a complete accounting system. At ₹2,499 the first objection is *"Zoho does my entire accounting for ₹1,500 — why is your reminder tool more?"* You lose that argument in ninety seconds regardless of your ROI slide.

**You do not control the price. You control which comparison fires first.** A high fixed fee forces the Zoho anchor. Receivables-based pricing forces the agency anchor, where you're 3–8x cheaper.

### 8.4 The success fee — deliberately not on the page

`[EST]` Adding a success fee (low flat + 1–3% of recovery) lifts blended ACV from ₹60K to ~₹1.5L — 2.5x. But it costs **4–5 weeks** of engineering: attribution logic, monthly reconciliation, fee invoicing, dispute handling. And you end up chasing your own fee, becoming a debtor of your own product.

**Decision: sell it manually to the first 10–20 customers as a negotiated alternative** (₹999/mo + 2% on invoices already 90+ days overdue). Compute attribution in a spreadsheet. Invoice by hand. You get the strongest cold-sales line available ("we only get paid when you get paid"), real attribution data, and evidence on whether customers prefer contingent or predictable pricing — which is genuinely unknown. Build the billing system in year two for whichever won.

### 8.5 Pricing integrity — build these as features

- [ ] Published pricing on the website (nine of ten competitors don't)
- [ ] Month-to-month, no annual lock-in
- [ ] One-click self-serve cancellation
- [ ] Automatic full data export on cancellation
- [ ] No price increase without 60 days' notice
- [ ] **Automatic downgrade when outstanding drops and a cheaper tier fits** ★ DIFF
- [ ] Guarantee: *no ₹1 lakh recovered in 60 days, no payment*

---

## 9. Go-to-market

**First 10 (Days 1–30), cost ≈ ₹0.** Walk into industrial estates and trade associations in your own city — Peenya, MIDC, Okhla, Ambattur. Your own network almost certainly contains three or four ₹5–50 crore B2B suppliers. Visit CA firms. Offer a free 60-day pilot for weekly feedback plus a commitment to pay on ₹5 lakh recovered.

**First 100 (Months 2–6).** CA referral programme with revenue share. Industry associations (ACMA for auto components, sector bodies). WhatsApp/Telegram trade groups. SEO on high-intent long-tail: *"customer payment nahi de raha kya kare"*, *"MSME Samadhaan complaint kaise kare"*, *"43B(h) compliance"* — `[ASSUME — High confidence]` real volume, near-zero competition from software vendors, screaming purchase intent.

**First 1,000 (Months 6–18).** Tally partner/reseller network — thousands of local partners already sell to your exact ICP, and it is the highest-leverage underused channel in Indian SMB software. Zoho Marketplace. Paid search on high-intent terms.

`[EST]` CAC by channel: founder-led ₹8–15K · CA referral ₹5–12K · SEO ₹3–8K at scale · Tally partner ₹10–20K + margin · paid search ₹25–50K.

---

## 10. Financial model `[EST]`

Revenue rows are **recognised revenue**, not exit ARR — customers land through the year.

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Customers (EOY) | 40 | 250 | 900 |
| Blended ACV | ₹60,000 | ₹65,000 | ₹75,000 |
| *Exit ARR* | *₹24 L* | *₹1.63 cr* | *₹6.75 cr* |
| **Recognised revenue** | **₹14 L** | **₹1.1 cr** | **₹4.7 cr** |
| Total cost | ₹11 L | ₹95 L | ₹3.6 cr |
| **Net** | **+₹3 L** | **+₹15 L** | **+₹1.1 cr** |
| Capital needed | **₹8–12 L** | Optional seed | — |

`[EST]` Plausibly cash-flow positive in year one on ₹8–12 lakh. Gross margin 93–99% at every tier.

---

## 11. Never build

| Feature | Why |
|---|---|
| Lending off your own balance sheet | NBFC licence, RBI supervision, credit risk, capital. Partner instead |
| Full accounting / general ledger | Tally and Zoho own it. You lose slowly and expensively |
| Your own CRM | Every vertical SaaS builds one; every one regrets it |
| A collections call centre | Different business, margins and management problem |
| AI outbound cold calling (US) | `[FACT]` TCPA: $500–1,500/call, trebled, **uncapped** |
| Aggressive or threatening templates | Prohibited conduct under the RBI framework; reputationally fatal |
| Debtor data resale | `[FACT]` DPDP penalties reach ₹250 crore; destroys the network layer's trust |
| Automated legal filing without human approval | Legal exposure, no upside |
| Blockchain / tokenised invoices | No Indian SMB has ever asked |
| Mobile app before the web product retains | Doubles surface area, halves iteration speed |
| Marketing-category WhatsApp templates as default | 7.5x the cost for no additional recovery |

---

## 12. Roadmap

**30 days** — the v1 twelve, plus twenty customer conversations.
**90 days** — Tally CSV import · CA-ready report · dispute logging · unified reply inbox · team roles · 43B(h) exposure report · payment reconciliation. **Target: 10 paying customers.**
**6 months** — Tally two-way sync ★ · multilingual ★ · credit limits ★ · escalation temperature ★ · payment plans · cash-flow forecast · recovery scoring · full compliance engine. **Target: 40–60 customers, ₹25–40 L exit ARR.**
**12 months** — Debtor portal ★ · Samadhaan pack ★ · CA portal ★ · eNACH · approvals · public API · anomaly detection · financing referral pilot. **Target: 250–350 customers, ₹2–2.5 cr exit ARR.**
**24 months** — Collections voice agent ★ · cross-customer buyer scoring ★ · financing marketplace · SSO/audit · sector playbooks · first international market (UAE or Indonesia).
**5 years** — Underwriting data API ★ · buyer credit rating ★ · developer platform · co-lending. The pitch stops being "collections software" and becomes **"the payment-behaviour and working-capital layer for Indian B2B trade."**

---

## 13. What is still unvalidated `[OPEN]`

This is the most important section in the file. Everything above is analysis; none of it is evidence.

- [ ] **Will Indian SMBs pay anything at all for this?** Zero paying customers exist today.
- [ ] **The strategic-account objection.** If prospects won't automate their biggest debtors, the product serves the receivables that matter least.
- [ ] **Is ₹1,499–3,999 the right price?** Test all three tiers; ask for a ₹5,000 deposit. The deposit is the only pricing research that counts.
- [ ] **Does receivables-under-management read as fair?** Or does it feel like being taxed for having a problem?
- [ ] **Can recovery be attributed credibly?** If not, outcome pricing is permanently closed.
- [ ] **Is the CA channel real?** Everything in §9 assumes it is.
- [ ] **Will Tally integration work in the field?** Version fragmentation, on-premise installs, cloud variants.
- [ ] **Does 43B(h) actually drive purchase**, or do buyers shrug at it?

### The gate

**Three paying pilots by day 30. Ten by day 90.** Write this rule down now, while you're still objective about it. If it isn't met, the problem is not the feature list.

---

## Sources

**Tax and receivables:** [Section 43B(h) (ClearTax)](https://cleartax.in/s/section-43bh-of-income-tax-act) · [MSME Samadhaan & 45-day rule](https://www.bullit.in/blogs/msme-samadhaan-portal-section-43b-h-45-days-rule-explained) · [MSME delayed payment filings 2026](https://taxclue.in/blog/msme-delayed-payment-samadhaan-portal) · [KPMG India on 43B(h)](https://assets.kpmg.com/content/dam/kpmg/in/pdf/2024/06/boards-imperative-in-implementing-clause-h-under-section-43b-for-msmes.pdf)

**Regulation:** [RBI recovery agent rules 2026](https://solvlegal.com/blogs/rbi-loan-recovery-agent-rules-2026-india/) · [RBI framework effective July 2026](https://www.caalley.com/news-updates/indian-news/no-more-harassment-calls-for-loan-recovery-rbi-to-bring-tough-framework-from-july-1-2026) · [DPDP Rules 2026 guide](https://certpro.com/dpdp-act-business-guide/) · [DPDP timeline](https://www.techprescient.com/blogs/dpdp-act-rules/)

**Messaging economics:** [WhatsApp API pricing India 2026](https://myoperator.com/blog/whatsapp-business-api-pricing-india-2026) · [Per-message rates](https://chatmaxima.com/whatsapp-api-pricing/india/)

**Integration:** [Tally integration methods](https://help.tallysolutions.com/integration-methods-and-technologies/) · [Tally API guide](https://www.aiaccountant.com/blog/tally-api-integration-guide)

**Competition:** [Growfin Series A (Inc42)](https://inc42.com/buzz/growfin-7-5-mn-funding-b2b-enterprises-automate-accounts-receivable/) · [Recordent (Tracxn)](https://tracxn.com/d/companies/recordent/__NH18vYy9mQVBd-7EV-M3q4UlIlf5mIMhn9Ve9UjZ_bo) · [Upflow credit-control gap (Chaser)](https://www.chaserhq.com/blog/upflow-alternatives) · [Credit control pricing compared (Trove)](https://trove.works/credit-control-software-pricing/) · [HighRadius (Capterra)](https://www.capterra.com/p/127948/ReceivablesRadius/) · [Zoho Books India pricing](https://www.patronaccounting.com/blog/zoho-books-pricing-india-2026)

**Comparison basis:** [Avoca $1B round](https://www.prnewswire.com/news-releases/avoca-raises-125m-at-1b-valuation-to-power-americas-services-economy-with-ai-302753962.html) · [Indian receptionist salary](https://in.indeed.com/career/receptionist/salaries) · [US receptionist salary](https://www.indeed.com/career/front-desk-receptionist/salaries) · [Voice agent cost per minute](https://inworld.ai/resources/voice-agent-cost-per-minute-2026)

**Repo:** [UdhaarClear](https://github.com/Nishal77/UdhaarClear)