import { useState } from 'react'
import MacroRingsView from './MacroRingsView'
import WaterTrackerView from './WaterTrackerView'
import HomeFeatureButton from './HomeFeatureButton'
import HealthKitPlaceholder from './HealthKitPlaceholder'
import { useDailyLogContext } from '../context/DailyLogContext'
import { useMacroGoalsContext } from '../context/MacroGoalsContext'

export default function HomeView() {
  const { totalWaterToday, addWater } = useDailyLogContext()
  const { waterGoalOz } = useMacroGoalsContext()
  const [waterInput, setWaterInput] = useState('')

  function handleAddWater() {
    const oz = parseFloat(waterInput)
    if (oz > 0) {
      addWater(oz)
      setWaterInput('')
    }
  }

  return (
    <div className="page">
      <h1 className="page-header">Home</h1>

      <MacroRingsView />

      <HealthKitPlaceholder />

      <div className="card water-section">
        <h2 className="subheader" style={{ textAlign: 'center' }}>Water Intake</h2>
        <WaterTrackerView current={totalWaterToday} goal={waterGoalOz} />
        <div className="water-add-row mt-12">
          <input
            className="input water-input"
            type="number"
            placeholder="oz"
            value={waterInput}
            onChange={(e) => setWaterInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddWater()}
          />
          <button className="btn btn-primary" onClick={handleAddWater}>
            Add Water
          </button>
        </div>
      </div>

      <div className="feature-buttons">
        <HomeFeatureButton
          title="AI Macro"
          to="/ai-macro"
          color="#34c759"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" />
            </svg>
          }
        />
        <HomeFeatureButton
          title="Exercise"
          to="/ai-exercise"
          color="#ff3b30"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1" /><path d="M9 20l3-8 3 8M6 20h12" />
            </svg>
          }
        />
        <HomeFeatureButton
          title="Scan Barcode"
          to="/barcode"
          color="#007aff"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="5" height="5" /><rect x="16" y="3" width="5" height="5" />
              <rect x="3" y="16" width="5" height="5" />
              <path d="M21 16h-3v3M21 21h-3M16 21v-3M11 3v5M8 8h5M11 13v3M3 11h5M13 11h3v3" />
            </svg>
          }
        />
      </div>
    </div>
  )
}
