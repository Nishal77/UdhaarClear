// Branded left panel — visible on lg+ screens only

export function LeftPanel() {
  return (
    <div
      className="hidden lg:flex w-[480px] shrink-0 flex-col items-center justify-between py-12 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 38%, #2b2209 0%, #0d0c08 100%)',
      }}
    >
      {/* Warm amber glow layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(185, 125, 12, 0.18) 0%, transparent 65%)',
        }}
      />

      {/* Empty top spacer */}
      <div />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-14">
        {/* App icon */}
        <div
          className="mb-10 rounded-[28px] p-5 shadow-2xl"
          style={{ backgroundColor: '#1a1608' }}
        >
          <UdhaarClearIcon />
        </div>

        <h2 className="text-[22px] font-bold leading-snug text-white mb-4">
          One Platform to{' '}
          <span style={{ color: '#ECA828' }}>Recover</span>
          <br />
          All Your{' '}
          <span style={{ color: '#ECA828' }}>Payments</span>
        </h2>

        <p className="text-sm leading-relaxed" style={{ color: '#8a8270', maxWidth: '280px' }}>
          Stop chasing customers. Send smart WhatsApp reminders with UPI payment links and get paid
          faster.
        </p>

        {/* Slide indicator dots */}
        <div className="flex gap-2 mt-10">
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white/25" />
          <div className="w-2 h-2 rounded-full bg-white/25" />
        </div>
      </div>

      {/* Bottom spacer */}
      <div />
    </div>
  )
}

function UdhaarClearIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="26" cy="26" r="24" stroke="#ECA828" strokeWidth="2" opacity="0.4" />
      {/* Inner circle */}
      <circle cx="26" cy="26" r="16" fill="#ECA828" opacity="0.15" />
      {/* Rupee symbol */}
      <text
        x="26"
        y="32"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="#ECA828"
        fontFamily="system-ui"
      >
        ₹
      </text>
      {/* Return arrow arc */}
      <path
        d="M 40 26 A 14 14 0 0 1 26 40"
        stroke="#ECA828"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path d="M 24 38 L 26 41 L 29 38" stroke="#ECA828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
    </svg>
  )
}
