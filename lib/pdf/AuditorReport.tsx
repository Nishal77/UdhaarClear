import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'
import { AGEING_BUCKET_LABELS, type AgeingBreakdown } from '@/lib/utils/ageing'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, padding: 40, color: '#1F2937' },
  header: { marginBottom: 20, borderBottom: '2pt solid #FF6A39', paddingBottom: 10 },
  title: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#111827' },
  subtitle: { fontSize: 10, color: '#4B5563', marginTop: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, fontSize: 8, color: '#6B7280' },
  section: { marginTop: 15, marginBottom: 10 },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: '#374151', borderBottom: '1pt solid #E5E7EB', paddingBottom: 3, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  gridCol: { width: '50%', marginBottom: 6 },
  bold: { fontFamily: 'Helvetica-Bold' },
  table: { width: '100%', border: '0.5pt solid #E5E7EB', borderRadius: 4, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderBottom: '0.5pt solid #E5E7EB', padding: 6, fontFamily: 'Helvetica-Bold', fontSize: 9 },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #F3F4F6', padding: 6, fontSize: 8 },
  th: { flex: 1 },
  td: { flex: 1 },
  thRight: { flex: 1, textAlign: 'right' },
  tdRight: { flex: 1, textAlign: 'right' },
  footer: { marginTop: 40, borderTop: '0.5pt solid #E5E7EB', paddingTop: 15 },
  signatureTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 30 },
  signatureLine: { width: 150, borderBottom: '1pt solid #9CA3AF' }
})

interface AuditorReportProps {
  business: {
    name: string
    legalName?: string | null
    gstin?: string | null
    phone: string
  }
  stats: {
    totalInvoiced: number
    totalCollected: number
    collectionRate: number
    avgDsoValue: number
  }
  ageing: AgeingBreakdown
  invoices: Array<{
    invoiceNumber: string
    customer: { name: string }
    amount: number
    invoiceDate: Date
    dueDate: Date
    status: string
    paidAmount?: number | null
  }>
}

export function AuditorReport({ business, stats, ageing, invoices }: AuditorReportProps) {
  const today = new Date()
  const ageingBuckets: Array<keyof AgeingBreakdown> = ['0-30', '31-60', '61-90', '90+']

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reconciliation & Collection Auditor Report</Text>
          <Text style={styles.subtitle}>UdhaarClear verified business statements and debtor ledgers</Text>
          <View style={styles.metaRow}>
            <Text>Report Generated: {formatDate(today)}</Text>
            <Text>Platform: udhaarclear.in</Text>
          </View>
        </View>

        {/* Section 1: Business Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BUSINESS DETAILS</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text><Text style={styles.bold}>Legal Entity: </Text>{business.legalName ?? business.name}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text><Text style={styles.bold}>Phone: </Text>{business.phone}</Text>
            </View>
            {business.gstin && (
              <View style={styles.gridCol}>
                <Text><Text style={styles.bold}>GSTIN: </Text>{business.gstin}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Section 2: Summary Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECONCILIATION SUMMARY</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text><Text style={styles.bold}>Total Billed: </Text>{formatINR(stats.totalInvoiced)}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text><Text style={styles.bold}>Total Recovered: </Text>{formatINR(stats.totalCollected)}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text><Text style={styles.bold}>Collection Success Rate: </Text>{stats.collectionRate}%</Text>
            </View>
            <View style={styles.gridCol}>
              <Text><Text style={styles.bold}>Average DSO: </Text>{stats.avgDsoValue} Days</Text>
            </View>
          </View>
        </View>

        {/* Section 3: Ageing Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OUTSTANDING AGEING SUMMARY</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.th}>Bucket</Text>
              <Text style={styles.thRight}>Invoices</Text>
              <Text style={styles.thRight}>Outstanding Amount</Text>
            </View>
            {ageingBuckets.map((bucket) => (
              <View key={bucket} style={styles.tableRow}>
                <Text style={styles.td}>{AGEING_BUCKET_LABELS[bucket]}</Text>
                <Text style={styles.tdRight}>{ageing[bucket].count}</Text>
                <Text style={styles.tdRight}>{formatINR(ageing[bucket].amount)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section 4: Ledger Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OUTSTANDING & SETTLEMENTS LEDGER</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={{ width: '80px' }}>Invoice #</Text>
              <Text style={{ flex: 1 }}>Customer</Text>
              <Text style={{ width: '80px', textAlign: 'right' }}>Date</Text>
              <Text style={{ width: '80px', textAlign: 'right' }}>Status</Text>
              <Text style={{ width: '100px', textAlign: 'right' }}>Billed</Text>
              <Text style={{ width: '100px', textAlign: 'right' }}>Collected</Text>
            </View>

            {invoices.map((inv) => (
              <View key={inv.invoiceNumber} style={styles.tableRow}>
                <Text style={{ width: '80px' }}>{inv.invoiceNumber}</Text>
                <Text style={{ flex: 1 }}>{inv.customer.name}</Text>
                <Text style={{ width: '80px', textAlign: 'right' }}>{formatDate(inv.invoiceDate)}</Text>
                <Text style={{ width: '80px', textAlign: 'right' }}>{inv.status}</Text>
                <Text style={{ width: '100px', textAlign: 'right' }}>{formatINR(inv.amount)}</Text>
                <Text style={{ width: '100px', textAlign: 'right' }}>{formatINR(Number(inv.paidAmount ?? 0))}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section 5: Signatures */}
        <View style={styles.footer}>
          <Text style={styles.signatureTitle}>AUDITOR VERIFICATION SIGN-OFF</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View>
              <Text style={{ fontSize: 8, color: '#6B7280', marginBottom: 4 }}>Prepared By (Accounts Exec / Owner)</Text>
              <View style={styles.signatureLine} />
            </View>
            <View>
              <Text style={{ fontSize: 8, color: '#6B7280', marginBottom: 4 }}>Approved By (Authorized CA Auditor)</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>

      </Page>
    </Document>
  )
}
