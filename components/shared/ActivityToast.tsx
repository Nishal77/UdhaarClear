'use client'

import { useEffect, useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType = 'payment' | 'reminder' | 'opened' | 'escalation' | 'partial'

export interface ActivityEvent {
  id: string
  type: EventType
  customerName: string
  amount?: string
  detail: string
  time: string
}

// ─── Trigger Helper ───────────────────────────────────────────────────────────

export function triggerActivityToast(event: Omit<ActivityEvent, 'id' | 'time'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app-activity-toast', { detail: event }))
  }
}

// ─── Per-type config (label + dot color only) ─────────────────────────────────

const CFG: Record<EventType, { label: string; dot: string; amountColor: string }> = {
  payment:    { label: 'Payment received', dot: '#16A34A', amountColor: '#15803D' },
  reminder:   { label: 'Reminder sent',    dot: '#2563EB', amountColor: '#1D4ED8' },
  opened:     { label: 'Invoice opened',   dot: '#6366F1', amountColor: '#4338CA' },
  escalation: { label: 'Escalated',        dot: '#DC2626', amountColor: '#B91C1C' },
  partial:    { label: 'Partial payment',  dot: '#0EA5E9', amountColor: '#0284C7' },
}

const DURATION = 4800  // ms each toast lives

// ─── Toast Card ───────────────────────────────────────────────────────────────

function ToastCard({ event, onDismiss }: { event: ActivityEvent; onDismiss: (id: string) => void }) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'leave'>('enter')
  const c = CFG[event.type]

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'),  30)
    const t2 = setTimeout(() => setPhase('leave'), DURATION - 300)
    const t3 = setTimeout(() => onDismiss(event.id), DURATION)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [event.id, onDismiss])

  const visible = phase === 'show'

  return (
    <div
      style={{
        transform: visible
          ? 'translateY(0) scale(1)'
          : phase === 'enter'
          ? 'translateY(12px) scale(0.97)'
          : 'translateY(4px) scale(0.99)',
        opacity: visible ? 1 : 0,
        transition: visible
          ? 'transform 0.44s cubic-bezier(0.22,1,0.36,1), opacity 0.22s ease'
          : 'transform 0.26s ease-in, opacity 0.2s ease-in',
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '296px',
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.07)',
          borderRadius: '14px',
          padding: '12px 12px 12px 14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          boxSizing: 'border-box',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Progress underline */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          background: `${c.dot}22`,
          borderRadius: '0 0 14px 14px',
          animation: `uc-shrink ${DURATION}ms linear forwards`,
          transformOrigin: 'left',
          width: '100%',
        }} />

        {/* Dot indicator */}
        <div style={{
          flexShrink: 0,
          marginTop: '3px',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: c.dot,
        }} />

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Label row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#6B7280',
              letterSpacing: '0.01em',
            }}>
              {c.label}
            </span>
            <span style={{
              fontSize: '10.5px',
              color: '#9CA3AF',
              fontWeight: 500,
              flexShrink: 0,
              marginLeft: '8px',
            }}>
              {event.time}
            </span>
          </div>

          {/* Customer + amount */}
          <p style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 700,
            color: '#111827',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}>
            {event.customerName}
            {event.amount && (
              <span style={{ color: c.amountColor }}> · {event.amount}</span>
            )}
          </p>

          {/* Detail */}
          <p style={{
            margin: '3px 0 0',
            fontSize: '11px',
            fontWeight: 500,
            color: '#9CA3AF',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1,
          }}>
            {event.detail}
          </p>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(event.id)}
          style={{
            flexShrink: 0,
            marginTop: '1px',
            width: '16px',
            height: '16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#D1D5DB',
            fontSize: '16px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            borderRadius: '4px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#6B7280' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#D1D5DB' }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ActivityToast() {
  const [toasts, setToasts] = useState<ActivityEvent[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    const handleActivity = (e: Event) => {
      const customEvent = e as CustomEvent<Omit<ActivityEvent, 'id' | 'time'>>
      const newEvent: ActivityEvent = {
        ...customEvent.detail,
        id: `t-${Date.now()}-${Math.random()}`,
        time: 'Just now',
      }
      setToasts(prev => [...prev.slice(-2), newEvent])
    }

    window.addEventListener('app-activity-toast', handleActivity)
    return () => window.removeEventListener('app-activity-toast', handleActivity)
  }, [])

  return (
    <>
      <style>{`
        @keyframes uc-shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
      <div
        aria-live="polite"
        aria-label="Live activity"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <ToastCard event={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </>
  )
}
