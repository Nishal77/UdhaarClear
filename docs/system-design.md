# UdhaarClear System Design Diagram

## Mermaid Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Dashboard<br/>Next.js App Router]
        WHATSAPP[WhatsApp Bot<br/>Seller Commands]
    end

    subgraph "API Layer"
        AUTH[Auth API<br/>Supabase OTP]
        INVOICES[Invoices API]
        REMINDERS[Reminders API]
        ANALYTICS[Analytics API]
        CA[CA API<br/>Referral Program]
        WEBHOOK_RAZORPAY[Razorpay Webhook<br/>/api/webhooks/razorpay]
        WEBHOOK_WA[WhatsApp Webhook<br/>/api/webhooks/whatsapp]
        CRON_REMINDER[Cron: Reminder Engine<br/>Daily]
        CRON_CA[Cron: CA Payouts<br/>Monthly]
    end

    subgraph "Business Logic Layer"
        REMINDER_SERVICE[Reminder Service<br/>Tone Escalation]
        WHATSAPP_BOT[WhatsApp Bot Handler<br/>Command Parsing]
        PAYMENT_ROUTING[Payment Routing]
        CA_EARNINGS[CA Earnings Calculator<br/>TDS Deduction]
        CA_PAYOUTS[CA Payouts<br/>RazorpayX Integration]
    end

    subgraph "Data Layer"
        PRISMA[(Prisma ORM)]
        POSTGRES[(PostgreSQL<br/>Supabase)]
        SUPABASE_AUTH[(Supabase Auth)]
        SUPABASE_STORAGE[(Supabase Storage<br/>Invoice Documents)]
    end

    subgraph "External Services"
        RAZORPAY[Razorpay<br/>Payment Links]
        RAZORPAYX[RazorpayX<br/>Payouts]
        WHATSAPP_API[WhatsApp Cloud API<br/>Meta]
        RESEND[Resend<br/>Email Service]
        SENTRY[Sentry<br/>Error Tracking]
    end

    %% Client to API connections
    WEB --> AUTH
    WEB --> INVOICES
    WEB --> REMINDERS
    WEB --> ANALYTICS
    WEB --> CA
    
    WHATSAPP --> WEBHOOK_WA

    %% Webhook connections
    RAZORPAY --> WEBHOOK_RAZORPAY
    WHATSAPP_API --> WEBHOOK_WA

    %% API to Business Logic
    INVOICES --> PAYMENT_ROUTING
    REMINDERS --> REMINDER_SERVICE
    WEBHOOK_WA --> WHATSAPP_BOT
    CA --> CA_EARNINGS
    CRON_CA --> CA_PAYOUTS
    CRON_REMINDER --> REMINDER_SERVICE

    %% Business Logic to External Services
    PAYMENT_ROUTING --> RAZORPAY
    REMINDER_SERVICE --> WHATSAPP_API
    REMINDER_SERVICE --> RESEND
    CA_PAYOUTS --> RAZORPAYX
    WHATSAPP_BOT --> WHATSAPP_API

    %% All components to Data Layer
    AUTH --> SUPABASE_AUTH
    INVOICES --> PRISMA
    REMINDERS --> PRISMA
    ANALYTICS --> PRISMA
    CA --> PRISMA
    WEBHOOK_RAZORPAY --> PRISMA
    WEBHOOK_WA --> PRISMA
    REMINDER_SERVICE --> PRISMA
    WHATSAPP_BOT --> PRISMA
    CA_EARNINGS --> PRISMA
    CA_PAYOUTS --> PRISMA
    CRON_REMINDER --> PRISMA
    CRON_CA --> PRISMA

    PRISMA --> POSTGRES
    INVOICES --> SUPABASE_STORAGE

    %% Error tracking
    WEB --> SENTRY
    WEBHOOK_RAZORPAY --> SENTRY
    WEBHOOK_WA --> SENTRY
    CRON_REMINDER --> SENTRY
    CRON_CA --> SENTRY

    %% Styling
    classDef client fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    classDef api fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef logic fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef data fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef external fill:#ffebee,stroke:#b71c1c,stroke-width:2px

    class WEB,WHATSAPP client
    class AUTH,INVOICES,REMINDERS,ANALYTICS,CA,WEBHOOK_RAZORPAY,WEBHOOK_WA,CRON_REMINDER,CRON_CA api
    class REMINDER_SERVICE,WHATSAPP_BOT,PAYMENT_ROUTING,CA_EARNINGS,CA_PAYOUTS logic
    class PRISMA,POSTGRES,SUPABASE_AUTH,SUPABASE_STORAGE data
    class RAZORPAY,RAZORPAYX,WHATSAPP_API,RESEND,SENTRY external
```

## Data Flow Summary

### Invoice Creation Flow
1. Seller creates invoice via Web Dashboard or WhatsApp Bot command
2. Invoice stored in PostgreSQL via Prisma
3. Payment link generated via Razorpay
4. Reminder cadence scheduled (auto-reminder enabled)

### Payment Collection Flow
1. Buyer pays via Razorpay payment link
2. Razorpay sends webhook to `/api/webhooks/razorpay`
3. Webhook verified via HMAC-SHA256 signature
4. Idempotency check via `WebhookEvent` table
5. Invoice marked as PAID, reminders stopped
6. Confirmation sent via WhatsApp template + email

### Reminder Cadence Flow
1. Daily cron job queries unpaid invoices
2. Calculates days overdue, determines reminder phase
3. Sends reminder via WhatsApp template + email
4. Tone escalates: GENTLE → FIRM → LEGAL
5. Day 28: Human gate - requires seller approval for legal notice
6. All reminders logged to `Reminder` table

### CA Referral Flow
1. CA registers with ICAI verification (OTP to phone)
2. CA gets unique referral code
3. Business signs up via referral link
4. `Business.caId` permanently set (attribution lock)
5. Monthly cron calculates commission per (CA, client, month)
6. TDS deducted, aggregated into `CAPayout`
7. Payout triggered via RazorpayX NEFT

## Key Design Decisions

1. **Webhook Idempotency**: Database unique constraint on `(provider, eventId)` prevents duplicate processing
2. **Dual WhatsApp Integration**: Bot commands for sellers + template messages for automated reminders
3. **CA Attribution Lock**: `Business.caId` set once at signup, never updated for permanent commission attribution

## How to Convert to PNG

1. Install Mermaid CLI: `npm install -g @mermaid-js/mermaid-cli`
2. Convert: `mmdc -i system-design.md -o system-design.png -t neutral -b transparent`
3. Or use online tool: https://mermaid.live/
