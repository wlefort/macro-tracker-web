import { useState } from 'react'
import { makeFoodItem } from '../utils/foodUtils'
import { useDailyLogContext } from '../context/DailyLogContext'

export default function ManualFoodEntry({ onClose }) {
  const { addFood } = useDailyLogContext()
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')

  function handleLog() {
    const item = makeFoodItem({
      name: name.trim() || 'Manual Entry',
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
    })
    addFood(item)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 className="modal-title">Manual Food Entry</h2>
        <div className="form-group">
          <label>Food Name</label>
          <input className="input" placeholder="e.g. Grilled Chicken" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Calories</label>
          <input className="input" type="number" placeholder="0" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Protein (g)</label>
          <input className="input" type="number" placeholder="0" value={protein} onChange={(e) => setProtein(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Carbs (g)</label>
          <input className="input" type="number" placeholder="0" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fat (g)</label>
          <input className="input" type="number" placeholder="0" value={fat} onChange={(e) => setFat(e.target.value)} />
        </div>
        <button className="btn btn-green btn-full mt-12" onClick={handleLog}>
          Log Entry
        </button>
        <button className="btn btn-gray btn-full mt-8" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
