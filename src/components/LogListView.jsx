import { useState } from 'react'
import { useDailyLogContext } from '../context/DailyLogContext'
import { getTotalCalories, getTotalProtein, getTotalCarbs, getTotalFat } from '../utils/foodUtils'
import { formatTime } from '../utils/dateUtils'
import EditFoodItemModal from './EditFoodItemModal'

export default function LogListView({ items }) {
  const { updateFood, deleteFood } = useDailyLogContext()
  const [editItem, setEditItem] = useState(null)
  const [zoomImage, setZoomImage] = useState(null)

  function changeServing(item, delta) {
    const next = Math.max(0.1, +((item.servingSize ?? 1) + delta).toFixed(1))
    updateFood({ ...item, servingSize: next })
  }

  return (
    <>
      <ul className="log-list">
        {items.map((item) => {
          const totalCal = getTotalCalories(item)
          const totalP = getTotalProtein(item)
          const totalC = getTotalCarbs(item)
          const totalF = getTotalFat(item)
          const isNeg = totalCal < 0

          return (
            <li key={item.id} className="log-item">
              <div className="log-item-header">
                <span className={`log-item-name${isNeg ? ' negative' : ''}`}>{item.name}</span>
                <span className="log-item-time">{formatTime(item.date)}</span>
              </div>

              <p className="log-item-macros">
                Cals: {Math.round(totalCal)} · P: {Math.round(totalP)}g · C: {Math.round(totalC)}g · F: {Math.round(totalF)}g
              </p>

              {item.waterOz > 0 && (
                <p className="log-item-macros">💧 {item.waterOz} oz water</p>
              )}

              {item.imageData && (
                <img
                  src={item.imageData}
                  alt={item.name}
                  className="food-thumb"
                  onClick={() => setZoomImage(item.imageData)}
                />
              )}

              <div className="log-item-actions">
                <div className="serving-stepper">
                  <button className="stepper-btn" onClick={() => changeServing(item, -0.1)}>−</button>
                  <span className="stepper-value">{(item.servingSize ?? 1).toFixed(1)}×</span>
                  <button className="stepper-btn" onClick={() => changeServing(item, 0.1)}>+</button>
                </div>
                <button className="btn btn-gray" style={{ fontSize: 12, padding: '5px 10px', marginLeft: 'auto' }} onClick={() => setEditItem(item)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteFood(item.id)}>Delete</button>
              </div>
            </li>
          )
        })}
      </ul>

      {editItem && <EditFoodItemModal item={editItem} onClose={() => setEditItem(null)} />}

      {zoomImage && (
        <div className="modal-overlay" onClick={() => setZoomImage(null)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <img src={zoomImage} alt="Food" style={{ maxWidth: '95vw', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </>
  )
}
