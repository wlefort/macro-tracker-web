export default function MacroRing({ label, value, goal, color }) {
  const size = 70
  const strokeWidth = 8
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const pct = Math.min(value / Math.max(goal, 1), 1)
  const offset = circumference * (1 - pct)

  return (
    <div className="ring-wrapper">
      <svg className="ring-svg" width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x={size / 2} y={size / 2} className="ring-text">
          {Math.round(value)}/{Math.round(goal)}
        </text>
      </svg>
      <span className="ring-label">{label}</span>
    </div>
  )
}
