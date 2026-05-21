import MacroRingsView from './MacroRingsView'
import LogListView from './LogListView'
import { useDailyLogContext } from '../context/DailyLogContext'
import { useMacroGoalsContext } from '../context/MacroGoalsContext'

export default function DailySummaryView() {
  const {
    todayItems,
    totalCaloriesToday,
    totalProteinToday,
    totalCarbsToday,
    totalFatToday,
  } = useDailyLogContext()
  const { calorieGoal, proteinGoal, carbGoal, fatGoal } = useMacroGoalsContext()

  const remCal = Math.max(0, calorieGoal - totalCaloriesToday)
  const remP = Math.max(0, proteinGoal - totalProteinToday)
  const remC = Math.max(0, carbGoal - totalCarbsToday)
  const remF = Math.max(0, fatGoal - totalFatToday)

  const foodItems = todayItems.filter((i) => i.waterOz === 0 || i.name !== 'Water')

  return (
    <div className="page">
      <h1 className="page-header">Daily Summary</h1>

      <MacroRingsView />

      <div className="remaining-row">
        <div className="remaining-macro">
          <div className="remaining-macro-value" style={{ color: '#ff9500' }}>{Math.round(remCal)}</div>
          <div className="remaining-macro-label">Cal left</div>
        </div>
        <div className="remaining-macro">
          <div className="remaining-macro-value" style={{ color: '#ff3b30' }}>{Math.round(remP)}g</div>
          <div className="remaining-macro-label">Protein</div>
        </div>
        <div className="remaining-macro">
          <div className="remaining-macro-value" style={{ color: '#007aff' }}>{Math.round(remC)}g</div>
          <div className="remaining-macro-label">Carbs</div>
        </div>
        <div className="remaining-macro">
          <div className="remaining-macro-value" style={{ color: '#af52de' }}>{Math.round(remF)}g</div>
          <div className="remaining-macro-label">Fat</div>
        </div>
      </div>

      {todayItems.length === 0 ? (
        <p className="text-secondary text-center mt-16">No items logged today.</p>
      ) : (
        <LogListView items={todayItems} />
      )}
    </div>
  )
}
