'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileImportIcon } from '@hugeicons/core-free-icons'
import type { BulkImportResult } from '@/app/api/invoices/bulk-import/route'

/**
 * "Import from Tally/Excel" — the distribution hook from the PRD growth
 * plan. Lets an owner drop in their existing Tally ledger export (or any
 * spreadsheet with name/phone/amount columns) and bulk-create invoices
 * instead of typing them in one at a time.
 */
export function TallyImportButton() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)

  function handleButtonClick() {
    fileInputRef.current?.click()
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    // Reset the input so selecting the same file again still fires onChange.
    e.target.value = ''
    if (!file) return

    setIsImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/invoices/bulk-import', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) {
        toast.error(json.message ?? 'Import failed')
        return
      }

      const { invoicesCreated, customersCreated, skipped, rowErrors }: BulkImportResult = json
      describeImportResult({ invoicesCreated, customersCreated, skipped, rowErrors })
      router.refresh()
    } catch {
      toast.error('Something went wrong reading that file')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileSelected}
      />
      <button
        onClick={handleButtonClick}
        disabled={isImporting}
        className="flex items-center gap-2 rounded-xl border border-[#EBEAE6] bg-white px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-[#FAFAF8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HugeiconsIcon icon={FileImportIcon} size={15} />
        {isImporting ? 'Importing…' : 'Import from Tally/Excel'}
      </button>
    </>
  )
}

function describeImportResult({ invoicesCreated, customersCreated, skipped, rowErrors }: BulkImportResult) {
  const parts = [`Imported ${invoicesCreated} invoice${invoicesCreated === 1 ? '' : 's'}`]
  if (customersCreated > 0) parts.push(`${customersCreated} new customer${customersCreated === 1 ? '' : 's'}`)
  if (skipped > 0) parts.push(`${skipped} row${skipped === 1 ? '' : 's'} skipped`)
  const summary = parts.join(' · ')

  if (invoicesCreated === 0) {
    toast.error(summary)
  } else if (skipped > 0) {
    toast.warning(summary)
  } else {
    toast.success(summary)
  }

  // Show up to 3 specific row-level reasons so the owner can fix their
  // spreadsheet and re-upload, rather than guessing why rows were skipped.
  rowErrors.slice(0, 3).forEach((err) => {
    const label = err.rowNumber > 0 ? `Row ${err.rowNumber}: ` : ''
    toast.error(`${label}${err.reason}`)
  })
}
