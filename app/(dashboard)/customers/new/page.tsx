import { PageHeader } from '@/components/layout/PageHeader'
import { CustomerForm } from '@/components/customers/CustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Add Customer"
        description="Add a new debtor to start tracking their invoices"
      />
      <div className="rounded-[22px] bg-white p-8 border border-[#EBEAE6]/60">
        <CustomerForm />
      </div>
    </div>
  )
}
