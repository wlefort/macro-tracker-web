import { useState } from 'react'
import { useDailyLogContext } from '../context/DailyLogContext'

export default function EditFoodItemModal({ item, onClose }) {
  const { updateFood } = useDailyLogContext()
  const [name, setName] = useState(item.name)
  const [calories, setCalories] = useState(item.calories)
  const [protein, setProtein] = useState(item.protein)
  const [carbs, setCarbs] = useState(item.carbs)
  const [fat, setFat] = useState(item.fat)
  const [servings, setServings] = useState(item.servings ?? 1.0)

  function handleSave() {
    updateFood({
      ...item,
      name,
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      servings: parseFloat(servings) || 1.0,
      originalCalories: parseFloat(calories) || 0,
      originalProtein: parseFloat(protein) || 0,
      originalCarbs: parseFloat(carbs) || 0,
      originalFat: parseFloat(fat) || 0,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 className="modal-title">Edit Food Item</h2>
        <div className="form-group">
          <label>Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Calories</label>
          <input className="input" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Protein (g)</label>
          <input className="input" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Carbs (g)</label>
          <input className="input" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fat (g)</label>
          <input className="input" type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Servings</label>
          <input className="input" type="number" step="0.1" value={servings} onChange={(e) => setServings(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-full mt-12" onClick={handleSave}>Done</button>
        <button className="btn btn-gray btn-full mt-8" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
