// Small logo used in right-panel header
export function AuthLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: '#ECA828' }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="8"
            y="12"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="white"
            fontFamily="system-ui"
          >
            ₹
          </text>
        </svg>
      </div>
      <span className="text-sm font-semibold text-gray-900">UdhaarClear</span>
    </div>
  )
}
