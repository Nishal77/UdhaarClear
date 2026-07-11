<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/readme/udhaarclear-white.png">
  <source media="(prefers-color-scheme: light)" srcset="public/readme/udhaarclear-dark.png">
  <img alt="UdhaarClear" src="public/readme/udhaarclear-dark.png">
</picture>

UdhaarClear is a debt recovery automation platform for Indian businesses. It tracks unpaid invoices, sends escalating WhatsApp reminders (gentle → firm → legal), generates payment links via Razorpay, and includes a CA referral program where chartered accountants earn commission on referred clients. The system runs automated reminder cadences, handles payment webhooks, and provides WhatsApp bot commands for sellers to manage invoices without logging in.

## Architecture

**Request Flow:**

1. **Web Dashboard** (`app/`): Next.js App Router serves the React UI. Sellers create invoices, manage customers, and view analytics from `app/(dashboard)/`. Authentication uses Supabase (`lib/auth/` + `lib/supabase/`) with OTP-based login.

2. **WhatsApp Bot** (`lib/whatsapp/bot.ts`): Inbound messages from sellers hit the webhook at `app/api/webhooks/whatsapp/route.ts`, which routes to `handleInboundMessage()`. Commands like "New invoice Ramesh 15000 9876543210" create customers and invoices directly via Prisma without touching the web UI.

3. **Reminder Engine** (`lib/cron/reminder-engine.ts`): A Vercel Cron job runs daily, querying unpaid invoices from Prisma and sending reminders via `ReminderService` (`lib/services/reminder-service.ts`). The tone escalates based on days overdue (GENTLE → FIRM → LEGAL), with a human gate at day 28 requiring seller approval before legal notices.

4. **Payment Processing** (`lib/razorpay/`): Razorpay payment links are generated per invoice. Webhooks at `app/api/webhooks/razorpay/route.ts` verify signatures using HMAC-SHA256, deduplicate via the `WebhookEvent` table (unique constraint on provider + eventId), then mark invoices paid and stop reminders.

5. **CA Referral System** (`lib/ca/`): CAs register with ICAI verification (OTP to their registered phone). Each referred business is permanently attributed via `Business.caId`. Monthly cron (`lib/cron/ca-monthly-payout.ts`) calculates commissions per (CA, client, month), aggregates into `CAPayout` with TDS deduction, and triggers RazorpayX payouts (`lib/ca/payouts.ts`).

**Data Layer:** PostgreSQL via Prisma (`prisma/schema.prisma`). Core models: `User`, `Business`, `Customer`, `Invoice`, `Reminder`, `CAProfile`, `CAEarning`, `CAPayout`, `Subscription`. Supabase handles auth and storage (invoice documents).

## Setup

**Prerequisites:** Node.js 20+, pnpm, PostgreSQL (Supabase recommended), Razorpay account, WhatsApp Business Cloud API credentials.

```bash
# Clone and install
git clone <repo-url>
cd UdhaarClear
pnpm install

# Environment setup
cp .env.example .env.local
# Fill in: SUPABASE_URL, SUPABASE_ANON_KEY, DATABASE_URL, DIRECT_URL,
# WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_APP_SECRET,
# RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET,
# RESEND_API_KEY, SENTRY_DSN (optional), CRON_SECRET

# Database setup
npx prisma migrate deploy
npx prisma generate

# Run development server
pnpm dev
```

**Database:** Use Supabase connection pooler URL for `DATABASE_URL` and direct connection URL for `DIRECT_URL` (required for Prisma migrations). Run migrations via `npx prisma migrate deploy`.

**Webhooks:** Configure external endpoints:
- Razorpay: `https://your-domain.com/api/webhooks/razorpay` (events: `payment_link.paid`, `subscription.*`)
- WhatsApp: `https://your-domain.com/api/webhooks/whatsapp` (verify token from `WHATSAPP_WEBHOOK_VERIFY_TOKEN`)

**Testing:**
```bash
pnpm test              # Vitest unit tests
pnpm test:e2e          # Playwright end-to-end tests
pnpm test:e2e:ui       # Playwright UI mode
```

## Design Decisions

**1. Webhook Idempotency via Database Unique Constraint**

Instead of in-memory deduplication (which fails across process restarts) or external caches, we insert every webhook event into `WebhookEvent` before processing. The unique constraint on `(provider, eventId)` is the actual guard — if a retry attempts to insert the same Razorpay payment ID, the insert fails and we exit early. This is simple, durable, and works without additional infrastructure. Tradeoff: one extra write per webhook, but negligible compared to the safety gain.

**2. Dual WhatsApp Integration (Bot + Templates)**

The system uses WhatsApp in two distinct ways: (a) **Bot commands** for sellers (free-form text parsed in `lib/whatsapp/bot.ts`) and (b) **Template messages** for automated customer reminders (pre-approved templates in `lib/whatsapp/templates.ts`). This separation exists because Meta's API requires template messages for outbound notifications to non-chat-initiated contacts, but bot commands need natural language parsing. Tradeoff: more complex integration logic, but enables both seller convenience and compliance with WhatsApp's business messaging rules.

**3. CA Referral Attribution Lock**

When a business signs up via a CA's referral link (`?ref=<code>`), `Business.caId` is set once and never updated. This permanent attribution ensures commission calculations are deterministic regardless of later account changes. The referral code itself is stored on `CAProfile.referralCode` and validated during onboarding. Tradeoff: prevents CAs from "stealing" existing clients retroactively, but means a business cannot switch CAs even if the original relationship ends.

## Known Limitations / Roadmap

**Current Gaps:**
- RazorpayX payouts (`lib/ca/payouts.ts`) have not been validated against a live RazorpayX account — the API shapes are inferred from docs and need sandbox testing before production use.
- Settings UI for notification preferences and reminder rules (`components/settings/`) have placeholder `TODO` handlers — the API endpoints (`/api/businesses/notification-preferences`, `/api/businesses/reminder-settings`) are not yet implemented.
- WhatsApp template approval process is manual — templates must be submitted and approved in Meta's dashboard before use.

**Roadmap:**
- Implement missing settings API endpoints
- Add automated template submission workflow
- Complete RazorpayX sandbox validation
- Add SMS reminder channel (currently WhatsApp + email only)
- Expand AI insights beyond the cached `AiInsight` model
- Add multi-language support for reminder templates

## System Design

![System Design Diagram](docs/system-design.png)

*Diagram showing the flow from web dashboard/WhatsApp bot through API routes to Prisma/Supabase, with external integrations for Razorpay, WhatsApp Cloud API, and Resend email.*

## Visual Proof

![Dashboard Screenshot](docs/dashboard-screenshot.png)
![WhatsApp Bot Flow](docs/whatsapp-bot-flow.png)
![Reminder Cadence Timeline](docs/reminder-cadence.png)

## API Reference

**Authentication:** Supabase-based session tokens passed via `Authorization: Bearer <token>` header.

### Webhooks

**POST /api/webhooks/razorpay**
- Handles `payment_link.paid` and `subscription.*` events
- Verifies HMAC-SHA256 signature using `RAZORPAY_WEBHOOK_SECRET`
- Idempotent via `WebhookEvent` table
- Response: 200 OK or 403 Forbidden

**POST /api/webhooks/whatsapp**
- Handles inbound messages and status updates
- Verifies `x-hub-signature-256` using `WHATSAPP_APP_SECRET`
- Routes to `handleInboundMessage()` for seller commands
- Response: 200 OK or 403 Forbidden

**GET /api/webhooks/whatsapp**
- Webhook verification endpoint for Meta
- Requires `hub.mode=subscribe` and `hub.verify_token` matching `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- Returns challenge string for verification

### Core Endpoints

**POST /api/auth/send-otp**
- Sends OTP to email for login
- Rate-limited via `RateLimit` table
- Body: `{ email: string }`

**POST /api/auth/verify-otp**
- Verifies OTP and creates Supabase session
- Body: `{ email: string, otp: string }`
- Returns session token

**POST /api/invoices**
- Creates a new invoice
- Auth required
- Body: `{ customerId: string, amount: number, dueDate: string, ... }`

**POST /api/reminders/send**
- Manually trigger a reminder for an invoice
- Auth required
- Body: `{ invoiceId: string, channel: 'WHATSAPP' | 'EMAIL' | 'BOTH', tone: 'GENTLE' | 'FIRM' | 'LEGAL' }`

**GET /api/dashboard/analytics**
- Returns business analytics (outstanding, recovered, collection rate)
- Auth required
- Query params: `period` (optional, default: '30d')

**POST /api/ca/register**
- Registers a new CA profile
- Body: `{ firmName: string, phone: string, icaiMembershipNumber: string, ... }`
- Triggers OTP verification flow

**GET /api/ca/earnings**
- Returns CA earnings and payout history
- Auth required (CA only)
- Query params: `month`, `year` (optional)

### Cron Endpoints

**POST /api/cron/reminder-engine**
- Runs daily reminder cadence
- Protected by `CRON_SECRET` header
- Returns: `{ sent: number, skipped: number, failed: number, errors: string[] }`

**POST /api/cron/ca-monthly-payout**
- Calculates and processes CA commission payouts
- Protected by `CRON_SECRET` header
- Returns: `{ processed: number, payouts: string[] }`
