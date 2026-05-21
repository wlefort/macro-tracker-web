import { useState } from 'react'
import { useDailyLogContext } from '../context/DailyLogContext'
import { formatTime } from '../utils/dateUtils'
import ManualExerciseEntry from './ManualExerciseEntry'

export default function ExerciseReviewView() {
  const { todayItems, deleteFood } = useDailyLogContext()
  const [showManual, setShowManual] = useState(false)

  const exerciseItems = todayItems.filter(
    (item) => item.calories < 0 || item.name.toLowerCase().startsWith('exercise')
  )

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-12">
        <h1 className="page-header" style={{ marginBottom: 0 }}>Exercise</h1>
        <button className="btn btn-red" style={{ padding: '8px 14px' }} onClick={() => setShowManual(true)}>
          + Log
        </button>
      </div>

      <div className="card hk-note mb-12">
        HealthKit inferred-walk detection is not available in the browser.
        A future iOS Shortcut webhook integration is possible for automatic exercise import.
      </div>

      {exerciseItems.length === 0 ? (
        <p className="text-secondary text-center mt-16">No exercise logged today.</p>
      ) : (
        <ul className="log-list">
          {exerciseItems.map((item) => (
            <li key={item.id} className="log-item">
              <div className="log-item-header">
                <span className="log-item-name negative">{item.name}</span>
                <span className="log-item-time">{formatTime(item.date)}</span>
              </div>
              <p className="log-item-macros" style={{ color: 'var(--accent-red)' }}>
                {Math.abs(Math.round(item.calories))} kcal burned
              </p>
              <button className="delete-btn" onClick={() => deleteFood(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {showManual && <ManualExerciseEntry onClose={() => setShowManual(false)} />}
    </div>
  )
}
