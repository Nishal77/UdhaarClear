# UdhaarClear — India's MSME Payment Recovery Platform

UdhaarClear automates the entire debt collection lifecycle for Indian MSMEs, transitioning recovery from uncomfortable manual chasing to a polite, automated 5-phase WhatsApp and email sequence with integrated payment links.

---

## 🏗️ System Architecture

The diagram below outlines the core payment recovery flow, data loops, and third-party integrations:

```mermaid
graph TD
    %% Actors
    Seller["Seller / CA Firm"]
    Buyer["Buyer / Debtor"]

    %% Next.js Application Layer
    subgraph NextJS ["Next.js App Router (Vercel)"]
        UI["Seller Dashboard (React/TS)"]
        PayPage["Buyer Payment Page (/pay)"]
        CronEngine["Automated Cron Engine (/api/cron)"]
        RazorpayHook["Razorpay Webhook Handler"]
        WhatsAppHook["WhatsApp Status Webhook"]
    end

    %% Database & Persistence
    subgraph Data ["Supabase Cloud Database"]
        DB[("PostgreSQL Database")]
        Prisma["Prisma Client ORM"]
    end

    %% External Services
    subgraph Services ["External Integration Channels"]
        WABA["Meta WhatsApp Business API"]
        ResendAPI["Resend Email Service"]
        RazorpayAPI["Razorpay Payments Link API"]
    end

    %% Flow Connections
    Seller -->|Manages Invoices / Views Analytics| UI
    UI -->|Queries & Updates| Prisma
    Prisma -->|Reads & Writes| DB

    CronEngine -->|1. Polls Overdue Invoices| Prisma
    CronEngine -->|2. Selects Tone & Triggers Reminders| WABA
    CronEngine -->|3. Dispatches Fallback Emails| ResendAPI

    WABA -->|4. Delivers Reminders with Pay Link| Buyer
    Buyer -->|5. Opens Pay Link & Pays Invoice| PayPage
    PayPage -->|6. Generates Checkout Session| RazorpayAPI
    
    RazorpayAPI -->|7. Dispatches Payment Success Hook| RazorpayHook
    RazorpayHook -->|8. Updates Invoice to PAID| Prisma
    
    WABA -->|9. Returns Message Statuses| WhatsAppHook
    WhatsAppHook -->|10. Updates Delivery Logs (Read/Delivered)| Prisma
```

---

## 🛠️ Technology Stack
*   **Frontend**: Next.js 16 (App Router) + Tailwind CSS + TypeScript
*   **Database**: Supabase PostgreSQL with Prisma ORM
*   **Channels**: Meta WhatsApp Business API (WABA) + Resend Email Delivery
*   **Payments**: Razorpay Links & Direct UPI Gateway routing
*   **Verification**: ICAI/COP membership registry audits

---

## 🚀 Getting Started

1. **Clone the repository and install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file based on `.env.example` with your database connections, WhatsApp API keys, and Razorpay secrets.

3. **Start the local development server**:
   ```bash
   pnpm dev
   ```

4. **Verify TypeScript compilation**:
   ```bash
   pnpm type-check
   ```

