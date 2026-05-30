import type {
  User,
  Business,
  Customer,
  Invoice,
  Reminder,
  Subscription,
  CAProfile,
  InvoiceStatus,
  ReminderTone,
  ReminderStatus,
  PlanTier,
} from '@prisma/client'

export type {
  User,
  Business,
  Customer,
  Invoice,
  Reminder,
  Subscription,
  CAProfile,
  InvoiceStatus,
  ReminderTone,
  ReminderStatus,
  PlanTier,
}

export type CustomerWithInvoiceSummary = Customer & {
  _count: { invoices: number }
  invoiceSummary?: {
    total: number
    outstanding: number
    overdue: number
  }
}

export type InvoiceWithCustomer = Invoice & {
  customer: Customer
}

export type InvoiceWithAll = Invoice & {
  customer: Customer
  business: Business
  reminders: Reminder[]
}

export type ReminderWithInvoice = Reminder & {
  invoice: Invoice & { customer: Customer }
}

export type DashboardStats = {
  totalOutstanding: number
  totalOverdue: number
  overdueCount: number
  collectedThisMonth: number
  remindersSentToday: number
}
