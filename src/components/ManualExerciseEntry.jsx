import { useState } from 'react'
import { makeFoodItem } from '../utils/foodUtils'
import { useDailyLogContext } from '../context/DailyLogContext'

export default function ManualExerciseEntry({ onClose }) {
  const { addFood } = useDailyLogContext()
  const [activity, setActivity] = useState('')
  const [minutes, setMinutes] = useState('')

  function handleLog() {
    const duration = parseFloat(minutes) || 0
    const caloriesBurned = duration * 5
    const item = makeFoodItem({
      name: `Exercise: ${activity || 'Activity'}`,
      calories: -caloriesBurned,
      protein: 0,
      carbs: 0,
      fat: 0,
    })
    addFood(item)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 className="modal-title">Log Exercise</h2>
        <div className="form-group">
          <label>Exercise Type</label>
          <input className="input" placeholder="e.g. Running" value={activity} onChange={(e) => setActivity(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Duration (minutes)</label>
          <input className="input" type="number" placeholder="0" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </div>
        {minutes && (
          <p className="text-secondary mb-12">
            Est. calories burned: ~{Math.round((parseFloat(minutes) || 0) * 5)} kcal
          </p>
        )}
        <button className="btn btn-green btn-full mt-12" onClick={handleLog}>
          Log Exercise
        </button>
        <button className="btn btn-gray btn-full mt-8" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
