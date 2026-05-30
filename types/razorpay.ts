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
