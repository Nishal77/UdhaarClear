import { PageHeader } from '@/components/layout/PageHeader'
import { CustomerForm } from '@/components/customers/CustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Add Customer"
        description="Add a new debtor to start tracking their invoices"
      />
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
        <CustomerForm />
      </div>
    </div>
  )
}
