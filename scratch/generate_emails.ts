import { buildReminderEmail, ReminderEmailParams } from '../lib/email/templates/payment-reminder'
import * as fs from 'fs'
import * as path from 'path'

const dummyParams: ReminderEmailParams = {
  reminderId: 'preview-mode-no-id',
  customerName: 'Vivek Kumar',
  businessName: 'JP Constructions',
  businessPhone: '+918789876567',
  businessGstin: '27AAAAA0000A1Z5',
  businessCity: 'Mumbai',
  invoiceNumber: '456782',
  invoiceDate: '06/06/2026',
  dueDate: '07/06/2026',
  amount: '₹3,000',
  daysOverdue: 1,
  paymentLink: 'https://udhaarclear.in/pay/cmq2hy2w80001gyuiawkt1121',
  bankAccountNo: '918789876567',
  bankIfsc: 'SBIN0003490',
  bankAccountName: 'JP Constructions',
  upiId: 'sbi3490@ibl'
}

const main = () => {
  const outputDir = __dirname

  // All 10 scheduled days: -3, 0, 3, 7, 10, 15, 21, 28, 35, 42
  const schedule = [
    { day: -3, tone: 'GENTLE' as const },
    { day: 0,  tone: 'GENTLE' as const },
    { day: 3,  tone: 'GENTLE' as const },
    { day: 7,  tone: 'GENTLE' as const },
    { day: 10, tone: 'FIRM' as const },
    { day: 15, tone: 'FIRM' as const },
    { day: 21, tone: 'FIRM' as const },
    { day: 28, tone: 'LEGAL' as const },
    { day: 35, tone: 'LEGAL' as const },
    { day: 42, tone: 'LEGAL' as const }
  ]

  for (const s of schedule) {
    const filename = `day_${s.day}.html`
    const { html } = buildReminderEmail(s.tone, { ...dummyParams, daysOverdue: s.day })
    fs.writeFileSync(path.join(outputDir, filename), html)
    console.log(`Generated: ${filename}`)
  }

  console.log('Successfully generated all 10 email templates in scratch/ directory!')
}

main()
