export default function WaterTrackerView({ current, goal }) {
  const size = 100
  const strokeWidth = 10
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const pct = Math.min(current / Math.max(goal, 1), 1)
  const offset = circumference * (1 - pct)

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#32ade6" strokeWidth={strokeWidth} opacity={0.25}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#32ade6" strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="11" fill="currentColor"
      >
        {Math.round(current)}/{Math.round(goal)} oz
      </text>
    </svg>
  )
}
