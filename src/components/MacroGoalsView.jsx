import { useState } from 'react'
import { useMacroGoalsContext } from '../context/MacroGoalsContext'
import { useDailyLogContext } from '../context/DailyLogContext'

function ProgressRow({ label, current, goal, color }) {
  const pct = Math.min((current / Math.max(goal, 1)) * 100, 100)
  return (
    <div className="progress-row">
      <div className="progress-row-header">
        <span>{label}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{Math.round(current)} / {Math.round(goal)}</span>
      </div>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function MacroGoalsView() {
  const goals = useMacroGoalsContext()
  const {
    calorieGoal, proteinGoal, carbGoal, fatGoal, waterGoalOz,
    autoAdjustmentEnabled, saveGoals,
  } = goals

  const {
    totalCaloriesToday, totalProteinToday, totalCarbsToday,
    totalFatToday, totalWaterToday,
  } = useDailyLogContext()

  const [form, setForm] = useState({
    calorieGoal, proteinGoal, carbGoal, fatGoal, waterGoalOz, autoAdjustmentEnabled,
  })

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handleSave() {
    saveGoals({ ...goals, ...form })
  }

  return (
    <div className="page">
      <h1 className="page-header">Macro Goals</h1>

      <div className="card mb-12">
        <ProgressRow label="Calories" current={totalCaloriesToday} goal={form.calorieGoal} color="#ff9500" />
        <ProgressRow label="Protein (g)" current={totalProteinToday} goal={form.proteinGoal} color="#ff3b30" />
        <ProgressRow label="Carbs (g)" current={totalCarbsToday} goal={form.carbGoal} color="#007aff" />
        <ProgressRow label="Fat (g)" current={totalFatToday} goal={form.fatGoal} color="#af52de" />
        <ProgressRow label="Water (oz)" current={totalWaterToday} goal={form.waterGoalOz} color="#32ade6" />
      </div>

      <div className="settings-section">
        <div className="settings-section-header">Set Your Goals</div>

        <div className="settings-row">
          <label>Auto-Adjust Macros</label>
          <label className="toggle">
            <input type="checkbox" checked={form.autoAdjustmentEnabled} onChange={(e) => update('autoAdjustmentEnabled', e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>

        {form.autoAdjustmentEnabled && (
          <div className="settings-row">
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Macros are automatically adjusted. Disable to edit manually.
            </span>
          </div>
        )}

        <div className="settings-row">
          <label>Calories</label>
          <input
            className="settings-input"
            type="number"
            value={form.calorieGoal}
            disabled={form.autoAdjustmentEnabled}
            onChange={(e) => update('calorieGoal', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="settings-row">
          <label>Protein (g)</label>
          <input
            className="settings-input"
            type="number"
            value={form.proteinGoal}
            disabled={form.autoAdjustmentEnabled}
            onChange={(e) => update('proteinGoal', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="settings-row">
          <label>Carbs (g)</label>
          <input
            className="settings-input"
            type="number"
            value={form.carbGoal}
            disabled={form.autoAdjustmentEnabled}
            onChange={(e) => update('carbGoal', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="settings-row">
          <label>Fat (g)</label>
          <input
            className="settings-input"
            type="number"
            value={form.fatGoal}
            disabled={form.autoAdjustmentEnabled}
            onChange={(e) => update('fatGoal', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="settings-row">
          <label>Water Goal (oz)</label>
          <input
            className="settings-input"
            type="number"
            value={form.waterGoalOz}
            onChange={(e) => update('waterGoalOz', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <button className="btn btn-primary btn-full" onClick={handleSave}>
        Save Goals
      </button>
    </div>
  )
}
