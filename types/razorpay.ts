export interface RazorpayPaymentLinkPaidEvent {
  entity: string
  account_id: string
  event: 'payment_link.paid'
  contains: string[]
  payload: {
    payment_link: {
      entity: {
        id: string
        amount: number
        currency: string
        notes: {
          invoiceId: string
          businessId: string
        }
      }
    }
    payment: {
      entity: {
        id: string
        amount: number
        currency: string
        method: string
        status: string
        description: string
      }
    }
  }
}

export interface RazorpayWebhookPayload {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: Record<string, unknown>
}

export interface RazorpaySubscriptionEntity {
  id: string
  plan_id: string
  status: 'created' | 'authenticated' | 'active' | 'pending' | 'halted' | 'cancelled' | 'completed' | 'expired'
  current_start: number | null
  current_end: number | null
  notes: {
    businessId: string
    planTier: string
  }
}

/** Covers subscription.authenticated, subscription.activated, subscription.charged, subscription.cancelled, subscription.completed, subscription.halted */
export interface RazorpaySubscriptionEvent {
  entity: string
  account_id: string
  event:
    | 'subscription.authenticated'
    | 'subscription.activated'
    | 'subscription.charged'
    | 'subscription.cancelled'
    | 'subscription.completed'
    | 'subscription.halted'
  contains: string[]
  payload: {
    subscription: { entity: RazorpaySubscriptionEntity }
    payment?: { entity: { id: string; amount: number } }
  }
}
