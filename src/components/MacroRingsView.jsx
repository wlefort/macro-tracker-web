import MacroRing from './MacroRing'
import { useDailyLogContext } from '../context/DailyLogContext'
import { useMacroGoalsContext } from '../context/MacroGoalsContext'

export default function MacroRingsView() {
  const { totalCaloriesToday, totalProteinToday, totalCarbsToday, totalFatToday } = useDailyLogContext()
  const { calorieGoal, proteinGoal, carbGoal, fatGoal } = useMacroGoalsContext()

  return (
    <div className="rings-container">
      <MacroRing label="Cals" value={totalCaloriesToday} goal={calorieGoal} color="#ff9500" />
      <MacroRing label="Protein" value={totalProteinToday} goal={proteinGoal} color="#ff3b30" />
      <MacroRing label="Carbs" value={totalCarbsToday} goal={carbGoal} color="#007aff" />
      <MacroRing label="Fat" value={totalFatToday} goal={fatGoal} color="#af52de" />
    </div>
  )
}
