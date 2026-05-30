import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 11, padding: 50, color: '#111' },
  header: { textAlign: 'center', marginBottom: 30 },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
  subtitle: { fontSize: 12, color: '#333' },
  section: { marginBottom: 16 },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 12, marginBottom: 6, borderBottom: '1pt solid #ccc', paddingBottom: 4 },
  row: { flexDirection: 'row', marginBottom: 3 },
  label: { fontFamily: 'Helvetica-Bold', width: 140 },
  value: { flex: 1 },
  body: { lineHeight: 1.6, marginBottom: 10 },
  disclaimer: { fontSize: 8, color: '#666', marginTop: 30, padding: 10, border: '1pt solid #ddd', borderRadius: 4 },
  signature: { marginTop: 40 },
  bold: { fontFamily: 'Helvetica-Bold' },
  red: { color: '#DC2626' },
  date: { textAlign: 'right', marginBottom: 20, color: '#666' },
})

interface LegalNoticeProps {
  business: {
    name: string
    legalName?: string | null
    gstin?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    phone: string
  }
  customer: {
    name: string
    gstin?: string | null
    address?: string | null
    city?: string | null
  }
  invoice: {
    invoiceNumber: string
    amount: number
    invoiceDate: Date
    dueDate: Date
    daysOverdue: number
  }
}

export function LegalNotice({ business, customer, invoice }: LegalNoticeProps) {
  const today = new Date()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>LEGAL DEMAND NOTICE</Text>
          <Text style={styles.subtitle}>Under the provisions of applicable laws of India</Text>
        </View>

        <Text style={styles.date}>Date: {formatDate(today)}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FROM</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Business:</Text>
            <Text style={styles.value}>{business.legalName ?? business.name}</Text>
          </View>
          {business.gstin && (
            <View style={styles.row}>
              <Text style={styles.label}>GSTIN:</Text>
              <Text style={styles.value}>{business.gstin}</Text>
            </View>
          )}
          {business.address && (
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{[business.address, business.city, business.state].filter(Boolean).join(', ')}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{business.phone}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{customer.name}</Text>
          </View>
          {customer.gstin && (
            <View style={styles.row}>
              <Text style={styles.label}>GSTIN:</Text>
              <Text style={styles.value}>{customer.gstin}</Text>
            </View>
          )}
          {customer.address && (
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{[customer.address, customer.city].filter(Boolean).join(', ')}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INVOICE DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.value}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.value}>{formatDate(invoice.invoiceDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>{formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount Due:</Text>
            <Text style={[styles.value, styles.bold]}>{formatINR(invoice.amount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Days Overdue:</Text>
            <Text style={[styles.value, styles.red]}>{invoice.daysOverdue} days</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTICE</Text>
          <Text style={styles.body}>
            This is to bring to your notice that as on {formatDate(today)}, the above-mentioned invoice
            amounting to {formatINR(invoice.amount)} remains unpaid despite being due on {formatDate(invoice.dueDate)}.
            The invoice has been outstanding for {invoice.daysOverdue} days.
          </Text>
          <Text style={styles.body}>
            Despite our repeated requests and reminders, you have failed to make the payment.
            You are hereby called upon to pay the outstanding amount of {formatINR(invoice.amount)}
            within 15 days of receipt of this notice.
          </Text>
          <Text style={styles.body}>
            Please note that in the event of failure to clear the outstanding dues within the stipulated period,
            we shall be constrained to initiate legal proceedings against you, which may include:
          </Text>
          <Text style={styles.body}>
            {`  • Civil suit for recovery of dues\n  • MSME Samadhaan portal complaint (if applicable)\n  • Section 138 of the Negotiable Instruments Act (if applicable)`}
          </Text>
          <Text style={styles.body}>
            All costs and expenses for such proceedings shall be recovered from you.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text style={styles.body}>Yours sincerely,</Text>
          <Text style={[styles.body, styles.bold]}>{business.legalName ?? business.name}</Text>
          <Text style={styles.body}>{formatDate(today)}</Text>
        </View>

        <View style={styles.disclaimer}>
          <Text>
            DISCLAIMER: This notice is computer-generated for informational purposes.
            For legally binding notices, consult a qualified advocate.
            This document does not constitute legal advice.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
