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
  // Quick-reply button tap on a template message. Meta sends `button.text`
  // (the visible label) and `button.payload` (auto-assigned, often equal to
  // the label). Present when type === 'button'.
  button?: { text?: string; payload?: string }
  // Interactive reply buttons (non-template). Present when type === 'interactive'.
  interactive?: {
    type?: string
    button_reply?: { id?: string; title?: string }
    list_reply?: { id?: string; title?: string }
  }
  // For a reply, the wamid of the message being replied to. For a quick-reply
  // button tap this is the original template message's id — which we stored as
  // Reminder.waMessageId, so it maps a tap straight back to its invoice.
  context?: { id?: string }
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
