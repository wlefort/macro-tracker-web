import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { useDailyLogContext } from '../context/DailyLogContext'
import { useUserSettingsContext } from '../context/UserSettingsContext'
import { startOfDay } from '../utils/dateUtils'

const RANGES = ['7 Days', '30 Days', 'YTD', 'Custom']

function getRangeStart(range, customStart) {
  const now = new Date()
  if (range === '7 Days') return new Date(now.getTime() - 7 * 864e5)
  if (range === '30 Days') return new Date(now.getTime() - 30 * 864e5)
  if (range === 'YTD') return new Date(now.getFullYear(), 0, 1)
  return customStart
}

export default function ProgressGraphView() {
  const { foodItems } = useDailyLogContext()
  const { weightHistory } = useUserSettingsContext()
  const [range, setRange] = useState('7 Days')
  const [customStart, setCustomStart] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d
  })
  const [customEnd, setCustomEnd] = useState(new Date())

  const rangeStart = getRangeStart(range, customStart)
  const rangeEnd = range === 'Custom' ? customEnd : new Date()

  const calorieData = Object.entries(
    foodItems
      .filter((i) => {
        const d = new Date(i.date)
        return d >= rangeStart && d <= rangeEnd
      })
      .reduce((acc, item) => {
        const key = startOfDay(new Date(item.date)).toLocaleDateString([], { month: 'short', day: 'numeric' })
        acc[key] = (acc[key] || 0) + item.calories
        return acc
      }, {})
  )
    .map(([date, calories]) => ({ date, calories: Math.round(calories) }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const weightData = (weightHistory || [])
    .filter((e) => {
      const d = new Date(e.date)
      return d >= rangeStart && d <= rangeEnd
    })
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      weight: e.weight,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="page">
      <h1 className="page-header">Progress</h1>

      <div className="segmented mb-12">
        {RANGES.map((r) => (
          <button key={r} className={`segmented-option${range === r ? ' active' : ''}`} onClick={() => setRange(r)}>
            {r}
          </button>
        ))}
      </div>

      {range === 'Custom' && (
        <div className="card mb-12">
          <div className="form-group">
            <label>Start Date</label>
            <input className="input" type="date" value={customStart.toISOString().slice(0, 10)} onChange={(e) => setCustomStart(new Date(e.target.value + 'T00:00:00'))} />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input className="input" type="date" value={customEnd.toISOString().slice(0, 10)} onChange={(e) => setCustomEnd(new Date(e.target.value + 'T23:59:59'))} />
          </div>
        </div>
      )}

      <div className="card mb-12">
        <h2 className="subheader">Calorie Intake</h2>
        {calorieData.length === 0 ? (
          <p className="text-secondary">No food data yet. Log meals to see your progress.</p>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="calories" fill="#007aff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="subheader">Weight Over Time</h2>
        {weightData.length === 0 ? (
          <p className="text-secondary">No weight entries yet. Log your weight in Settings.</p>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#ff3b30" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
