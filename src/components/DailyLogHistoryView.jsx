import { useDailyLogContext } from '../context/DailyLogContext'
import { startOfDay, formatDateFull } from '../utils/dateUtils'

export default function DailyLogHistoryView() {
  const { foodItems } = useDailyLogContext()

  const grouped = Object.entries(
    foodItems.reduce((acc, item) => {
      const key = startOfDay(new Date(item.date)).toISOString()
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})
  )
    .sort(([a], [b]) => new Date(b) - new Date(a))

  return (
    <div className="page">
      <h1 className="page-header">Food Log History</h1>

      {grouped.length === 0 ? (
        <p className="text-secondary text-center mt-16">No history yet.</p>
      ) : (
        grouped.map(([dateKey, items]) => (
          <div key={dateKey} className="mb-12">
            <h2 className="subheader" style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {formatDateFull(dateKey)}
            </h2>
            <ul className="log-list">
              {items.map((item) => (
                <li key={item.id} className="log-item">
                  <span className="log-item-name">{item.name}</span>
                  <p className="log-item-macros">
                    Calories: {Math.round(item.calories)} · Protein: {Math.round(item.protein)}g
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}
