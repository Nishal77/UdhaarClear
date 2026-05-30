'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'

interface OtpInputProps {
  length?: number
  onComplete: (otp: string) => void
  disabled?: boolean
}

export function OtpInput({ length = 6, onComplete, disabled = false }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, raw: string) {
    if (!/^\d*$/.test(raw)) return

    const digit = raw.slice(-1)
    const next = [...values]
    next[index] = digit
    setValues(next)

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    const full = next.join('')
    if (full.length === length && !next.includes('')) {
      onComplete(full)
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (values[index]) {
        // clear current box
        const next = [...values]
        next[index] = ''
        setValues(next)
      } else if (index > 0) {
        // move to previous box
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return

    const next = [...values]
    pasted.split('').forEach((char, i) => {
      next[i] = char
    })
    setValues(next)

    const focusIndex = Math.min(pasted.length, length - 1)
    inputRefs.current[focusIndex]?.focus()

    if (pasted.length === length) {
      onComplete(pasted)
    }
  }

  return (
    <div className="flex gap-3">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 rounded-xl border border-gray-200 text-center text-xl font-semibold text-gray-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  )
}
