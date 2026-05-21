import { useState } from 'react'
import { useUserSettingsContext } from '../context/UserSettingsContext'
import { useMacroGoalsContext } from '../context/MacroGoalsContext'
import { calculateRecommendedMacros } from '../api/claudeApi'

const GOAL_TYPES = ['lose', 'maintain', 'gain']
const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active', 'very active', 'extra active']
const THEMES = ['system', 'light', 'dark']

export default function SettingsView() {
  const settings = useUserSettingsContext()
  const { saveSettings, logWeight, setSetting } = settings
  const { applyCalculatedMacros } = useMacroGoalsContext()

  const [form, setForm] = useState({
    age: settings.age,
    weight: settings.weight,
    height: settings.height,
    goalType: settings.goalType,
    targetRatePerWeek: settings.targetRatePerWeek,
    activityLevel: settings.activityLevel,
    calorieGoal: settings.calorieGoal ?? 2200,
    proteinGoal: settings.proteinGoal ?? 175,
    carbGoal: settings.carbGoal ?? 200,
    fatGoal: settings.fatGoal ?? 70,
    enableAutoAdjustment: settings.enableAutoAdjustment ?? false,
    theme: settings.theme ?? 'system',
  })
  const [isCalculating, setIsCalculating] = useState(false)
  const [calcError, setCalcError] = useState('')

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handleSave() {
    saveSettings({ ...settings, ...form })
  }

  function handleLogWeight() {
    logWeight(parseFloat(form.weight))
    handleSave()
  }

  async function handleRecalculate() {
    setIsCalculating(true)
    setCalcError('')
    try {
      const macros = await calculateRecommendedMacros({
        age: form.age,
        weight: form.weight,
        height: form.height,
        activityLevel: form.activityLevel,
        goalType: form.goalType,
        targetRatePerWeek: form.targetRatePerWeek,
      })
      applyCalculatedMacros(macros)
      setForm((f) => ({
        ...f,
        calorieGoal: macros.calories,
        proteinGoal: macros.protein,
        carbGoal: macros.carbs,
        fatGoal: macros.fat,
      }))
      logWeight(parseFloat(form.weight))
      handleSave()
    } catch {
      setCalcError('Could not calculate macros. Check your API key and try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="page">
      <h1 className="page-header">Settings</h1>

      <div className="settings-section">
        <div className="settings-section-header">Your Info</div>
        <div className="settings-row">
          <label>Age</label>
          <input className="settings-input" type="number" value={form.age} onChange={(e) => update('age', parseInt(e.target.value) || 0)} />
        </div>
        <div className="settings-row">
          <label>Weight (lbs)</label>
          <input className="settings-input" type="number" value={form.weight} onChange={(e) => update('weight', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="settings-row">
          <label>Height (inches)</label>
          <input className="settings-input" type="number" value={form.height} onChange={(e) => update('height', parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">Goal</div>
        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <label>Goal Type</label>
          <div className="segmented w-full">
            {GOAL_TYPES.map((g) => (
              <button
                key={g}
                className={`segmented-option${form.goalType === g ? ' active' : ''}`}
                onClick={() => update('goalType', g)}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-row">
          <label>Target ({form.targetRatePerWeek.toFixed(1)} lb/wk)</label>
          <input
            type="range" min="0" max="2" step="0.1"
            value={form.targetRatePerWeek}
            onChange={(e) => update('targetRatePerWeek', parseFloat(e.target.value))}
            style={{ width: 120 }}
          />
        </div>
        <div className="settings-row">
          <label>Activity Level</label>
          <select
            className="select"
            value={form.activityLevel}
            onChange={(e) => update('activityLevel', e.target.value)}
          >
            {ACTIVITY_LEVELS.map((l) => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="settings-row">
          <label>Auto Adjustment</label>
          <label className="toggle">
            <input type="checkbox" checked={form.enableAutoAdjustment} onChange={(e) => update('enableAutoAdjustment', e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">Macro Goals</div>
        {form.enableAutoAdjustment && (
          <div className="settings-row">
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Macros adjusted automatically. Disable auto-adjustment to edit.
            </span>
          </div>
        )}
        <div className="settings-row">
          <label>Calories</label>
          <input className="settings-input" type="number" value={form.calorieGoal} disabled={form.enableAutoAdjustment} onChange={(e) => update('calorieGoal', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="settings-row">
          <label>Protein (g)</label>
          <input className="settings-input" type="number" value={form.proteinGoal} disabled={form.enableAutoAdjustment} onChange={(e) => update('proteinGoal', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="settings-row">
          <label>Carbs (g)</label>
          <input className="settings-input" type="number" value={form.carbGoal} disabled={form.enableAutoAdjustment} onChange={(e) => update('carbGoal', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="settings-row">
          <label>Fat (g)</label>
          <input className="settings-input" type="number" value={form.fatGoal} disabled={form.enableAutoAdjustment} onChange={(e) => update('fatGoal', parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">Appearance</div>
        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <label>App Theme</label>
          <div className="segmented w-full">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`segmented-option${form.theme === t ? ' active' : ''}`}
                onClick={() => { update('theme', t); setSetting('theme', t) }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {calcError && <p className="error-text">{calcError}</p>}

      <button className="btn btn-gray btn-full mb-8" onClick={handleLogWeight}>
        Log Weight Only
      </button>
      <button
        className="btn btn-primary btn-full mb-8"
        onClick={handleRecalculate}
        disabled={isCalculating}
      >
        {isCalculating ? 'Calculating…' : 'Set Weight & Recalculate Macros'}
      </button>
      <button className="btn btn-green btn-full" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  )
}
