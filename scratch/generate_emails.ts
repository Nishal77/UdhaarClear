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
  
  // GENTLE
  const gentle = buildReminderEmail('GENTLE', { ...dummyParams, daysOverdue: 1 })
  fs.writeFileSync(path.join(outputDir, 'gentle.html'), gentle.html)

  // FIRM
  const firm = buildReminderEmail('FIRM', { ...dummyParams, daysOverdue: 10 })
  fs.writeFileSync(path.join(outputDir, 'firm.html'), firm.html)

  // LEGAL
  const legal = buildReminderEmail('LEGAL', { ...dummyParams, daysOverdue: 28 })
  fs.writeFileSync(path.join(outputDir, 'legal.html'), legal.html)

  console.log('Generated email templates in scratch/ directory!')
}

main()
