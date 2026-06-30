# SEED-001: CA / ICAI Registration Verification

## Overview
* **Title**: CA / ICAI Registration Verification
* **Author**: Antigravity
* **Status**: Seeded
* **Category**: Verification & Compliance
* **Trigger Condition**: Surfaces when building the CA/Auditor onboarding portal or implementing dashboard access control checks for accountants.

---

## 1. Context & Business Goal
In UdhaarClear, Chartered Accountants (CAs) act as Auditors who receive monthly reconciliation reports and verify them. To prevent impersonation and guarantee legal accountability, we must verify the validity of a CA's license before upgrading their account status to `CA_AUDITOR`.

---

## 2. API Providers (Where to Get the API)
Direct query integration with the official ICAI member directory is restricted. Instead, standard Indian fintech and SaaS applications consume verified third-party API aggregators that wrap ICAI registries:
1. **Sandbox (sandbox.co.in)**: Offers a dedicated `ICAI Member Verification API` returning professional details.
2. **Signzy (signzy.com)**: Highly popular KYC provider in India. Provides a CA verification endpoint returning active license status and COP (Certificate of Practice) parameters.
3. **Cashfree Verification Suite**: Integrates professional registries check.
4. **ZoopOne**: Alternative KYC aggregator with direct ICAI directory matching.

---

## 3. Verification & Matching Logic

### A. Input Parameters
The user (CA Auditor) must provide:
* `caMembershipNumber`: A 6-digit numeric registration code.
* `fullName`: Expected official name of the practitioner.

### B. Validation Sequence
```mermaid
graph TD
    A[Collect Membership Number & Name] --> B{Regex Match /^\d{6}$/}
    B -- No --> C[Return Format Error]
    B -- Yes --> D[Dispatch to KYC Provider Sandbox/Signzy]
    D --> E{API Response Success?}
    E -- No --> F[Log Alert & Fallback to Manual Verification]
    E -- Yes --> G{Verify Member Status == 'Active'}
    G -- No --> H[Reject: License Inactive]
    G -- Yes --> I{Verify COP Status == 'Active'/'Holding'}
    I -- No --> J[Reject: No Certificate of Practice]
    I -- Yes --> K{Name Similarity Match > 85%}
    K -- No --> L[Flag for Review: Name Mismatch]
    K -- Yes --> M[Approve: Set caVerified = true]
```

### C. Name Matching Algorithm (Levenshtein Distance)
Official ICAI registrations often differ slightly from social display names (e.g., "Nishal Poojary" vs "Nishal H. Poojary").
To prevent false negatives:
* Strip salutations ("CA", "Mr", "Ms").
* Remove middle initials.
* Calculate Levenshtein string similarity score:
  $$\text{Similarity} = \left(1 - \frac{\text{Levenshtein}(S_1, S_2)}{\max(\text{Length}(S_1), \text{Length}(S_2))}\right) \times 100$$
* Set acceptance threshold at **`>= 85%`**.

---

## 4. Prisma Schema Extension Suggestion
To support this feature in future sprints, extend the database schema:
```prisma
model Business {
  // ... existing fields
  caVerified           Boolean   @default(false)
  caMembershipNumber   String?   @db.VarChar(6)
  caOfficialName       String?
  caCopActive          Boolean   @default(false)
  caVerifiedAt         DateTime?
}
```
