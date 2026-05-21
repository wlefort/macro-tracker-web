import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { estimateExerciseCalories } from '../api/claudeApi'
import { makeFoodItem } from '../utils/foodUtils'
import { useDailyLogContext } from '../context/DailyLogContext'
import { useUserSettingsContext } from '../context/UserSettingsContext'
import ManualExerciseEntry from './ManualExerciseEntry'

export default function AIExerciseEstimator() {
  const navigate = useNavigate()
  const { addFood } = useDailyLogContext()
  const { age, weight, height } = useUserSettingsContext()
  const [description, setDescription] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showManual, setShowManual] = useState(false)

  async function handleEstimate() {
    if (!description.trim()) return
    setIsLoading(true)
    setError('')
    setCaloriesBurned('')
    try {
      const result = await estimateExerciseCalories(description, { age, weight, height })
      setCaloriesBurned(result)
    } catch {
      setError('Could not estimate calories. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleLog() {
    const parsed = parseFloat(caloriesBurned)
    if (isNaN(parsed) || parsed <= 0 || parsed >= 5000) {
      setError('Unreasonable or unreadable value returned.')
      return
    }
    const rounded = Math.round(parsed)
    const item = makeFoodItem({
      name: `Exercise: ${description}`,
      calories: -rounded,
      protein: 0,
      carbs: 0,
      fat: 0,
    })
    item.originalCalories = -rounded
    addFood(item)
    setDescription('')
    setCaloriesBurned('')
    navigate('/')
  }

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-12">
        <h1 className="page-header" style={{ marginBottom: 0 }}>AI Exercise Estimator</h1>
        <button className="btn btn-gray" style={{ padding: '8px 12px' }} onClick={() => setShowManual(true)}>
          ✏️ Manual
        </button>
      </div>

      <div className="form-group">
        <label>Describe your exercise</label>
        <input
          className="input"
          placeholder="e.g. '30 min light jogging'"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEstimate()}
        />
      </div>

      <button
        className="btn btn-red btn-full"
        onClick={handleEstimate}
        disabled={isLoading || !description.trim()}
      >
        {isLoading ? 'Estimating…' : 'Estimate Calories Burned'}
      </button>

      {isLoading && <div className="spinner" />}
      {error && <p className="error-text">{error}</p>}

      {caloriesBurned && !isLoading && (
        <div className="macro-result-card mt-12 text-center">
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>Estimated Calories Burned</p>
          <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent-red)' }}>{caloriesBurned}</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>kcal</p>
          <button className="btn btn-green btn-full" onClick={handleLog}>
            Log to Daily Log
          </button>
        </div>
      )}

      {showManual && <ManualExerciseEntry onClose={() => { setShowManual(false); navigate('/') }} />}
    </div>
  )
}
