export interface WhatsAppWebhookVerify {
  'hub.mode': string
  'hub.verify_token': string
  'hub.challenge': string
}

export interface WhatsAppMessage {
  id: string
  from: string
  timestamp: string
  type: string
  text?: { body: string }
}

export interface WhatsAppStatus {
  id: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  recipient_id: string
}

export interface WhatsAppWebhookPayload {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: { display_phone_number: string; phone_number_id: string }
        messages?: WhatsAppMessage[]
        statuses?: WhatsAppStatus[]
      }
      field: string
    }>
  }>
}
