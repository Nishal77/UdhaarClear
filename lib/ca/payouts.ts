/**
 * RazorpayX Payouts — creates a Contact + Fund Account for a CA (once), then
 * issues a monthly NEFT payout of their commission.
 *
 * IMPORTANT: RazorpayX Payouts is a genuinely different product from
 * standard Razorpay Payments, which is what lib/razorpay/client.ts already
 * wraps elsewhere in this codebase (buyer payment links, subscriptions). It
 * needs its own RazorpayX business account and its own API keys — the
 * installed `razorpay` npm package's typed surface doesn't cover Contacts
 * or Payouts at all (only standard-Payments Fund Accounts, which require a
 * different kind of customer_id and can't be used for this), so this calls
 * RazorpayX's REST endpoints directly.
 *
 * NEEDS LIVE VALIDATION: this has not been tested against a real RazorpayX
 * account from this environment — verify request/response shapes against
 * RazorpayX's current API docs and a sandbox account before running real
 * payouts with it.
 */

const RAZORPAYX_BASE_URL = 'https://api.razorpay.com/v1'

function getAuthHeader(): string {
  const keyId = process.env.RAZORPAYX_KEY_ID
  const keySecret = process.env.RAZORPAYX_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new Error('RazorpayX credentials are not configured (RAZORPAYX_KEY_ID / RAZORPAYX_KEY_SECRET)')
  }
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
}

async function razorpayXPost<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${RAZORPAYX_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(`RazorpayX API error (${path}): ${JSON.stringify(error)}`)
  }

  return res.json()
}

export interface CAPayoutDestination {
  caProfileId: string
  name: string
  phone: string
  bankAccountNo: string
  bankIfsc: string
  bankAccountName: string
}

export interface ContactAndFundAccountIds {
  razorpayContactId: string
  razorpayFundAccountId: string
}

/**
 * Creates the RazorpayX Contact + Fund Account for a CA the first time
 * they're paid, and reuses the stored IDs on every payout after that.
 */
export async function ensureContactAndFundAccount(
  destination: CAPayoutDestination,
  existing?: { razorpayContactId?: string | null; razorpayFundAccountId?: string | null }
): Promise<ContactAndFundAccountIds> {
  let contactId = existing?.razorpayContactId ?? null

  if (!contactId) {
    const contact = await razorpayXPost<{ id: string }>('/contacts', {
      name: destination.name,
      contact: destination.phone,
      type: 'vendor',
      reference_id: destination.caProfileId,
    })
    contactId = contact.id
  }

  let fundAccountId = existing?.razorpayFundAccountId ?? null

  if (!fundAccountId) {
    const fundAccount = await razorpayXPost<{ id: string }>('/fund_accounts', {
      contact_id: contactId,
      account_type: 'bank_account',
      bank_account: {
        name: destination.bankAccountName,
        ifsc: destination.bankIfsc,
        account_number: destination.bankAccountNo,
      },
    })
    fundAccountId = fundAccount.id
  }

  return { razorpayContactId: contactId, razorpayFundAccountId: fundAccountId }
}

export interface CreatePayoutParams {
  fundAccountId: string
  amountRupees: number
  narration: string
  /** Doubles as RazorpayX's idempotency key — retrying with the same value returns the original payout instead of creating a duplicate. */
  referenceId: string
}

export interface PayoutResult {
  razorpayPayoutId: string
  status: string
}

export async function createPayout(params: CreatePayoutParams): Promise<PayoutResult> {
  const accountNumber = process.env.RAZORPAYX_ACCOUNT_NUMBER
  if (!accountNumber) {
    throw new Error('RAZORPAYX_ACCOUNT_NUMBER is not configured')
  }

  const payout = await razorpayXPost<{ id: string; status: string }>('/payouts', {
    account_number: accountNumber,
    fund_account_id: params.fundAccountId,
    amount: Math.round(params.amountRupees * 100), // RazorpayX amounts are in paise
    currency: 'INR',
    mode: 'NEFT',
    purpose: 'payout',
    queue_if_low_balance: true,
    reference_id: params.referenceId,
    narration: params.narration,
  })

  return { razorpayPayoutId: payout.id, status: payout.status }
}
