import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { estimateMacrosFromText, estimateMacrosFromImage } from '../api/claudeApi'
import { makeFoodItem } from '../utils/foodUtils'
import { useDailyLogContext } from '../context/DailyLogContext'
import ManualFoodEntry from './ManualFoodEntry'

export default function AIMacroEstimator() {
  const navigate = useNavigate()
  const { addFood } = useDailyLogContext()
  const [description, setDescription] = useState('')
  const [macros, setMacros] = useState(null)
  const [servings, setServings] = useState(1.0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageData, setImageData] = useState(null)
  const [imageMime, setImageMime] = useState('image/jpeg')
  const [imagePreview, setImagePreview] = useState(null)
  const [showManual, setShowManual] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  function handleImageFile(file) {
    if (!file) return
    const mime = file.type || 'image/jpeg'
    setImageMime(mime)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setImagePreview(dataUrl)
      const base64 = dataUrl.split(',')[1]
      setImageData(base64)
    }
    reader.readAsDataURL(file)
  }

  async function handleEstimate() {
    if (!description.trim() && !imageData) return
    setIsLoading(true)
    setError('')
    setMacros(null)
    try {
      const result = imageData
        ? await estimateMacrosFromImage(imageData, imageMime, description)
        : await estimateMacrosFromText(description)
      setMacros(result)
      setServings(1.0)
    } catch (e) {
      setError('Could not estimate macros. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleLog() {
    if (!macros) return
    const item = makeFoodItem({
      name: description.trim() || 'AI Estimated Meal',
      calories: macros.calories * servings,
      protein: macros.protein * servings,
      carbs: macros.carbs * servings,
      fat: macros.fat * servings,
      servingSize: servings,
      servings,
      imageData: imageData ? `data:${imageMime};base64,${imageData}` : null,
    })
    item.originalCalories = macros.calories
    item.originalProtein = macros.protein
    item.originalCarbs = macros.carbs
    item.originalFat = macros.fat
    item.originalServingSize = 1.0
    addFood(item)
    setDescription('')
    setMacros(null)
    setImageData(null)
    setImagePreview(null)
    setServings(1.0)
    navigate('/')
  }

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-12">
        <h1 className="page-header" style={{ marginBottom: 0 }}>AI Macro Estimator</h1>
        <button className="btn btn-gray" style={{ padding: '8px 12px' }} onClick={() => setShowManual(true)}>
          ✏️ Manual
        </button>
      </div>

      <div className="form-group">
        <label>Describe what you ate</label>
        <input
          className="input"
          placeholder="e.g. '2 eggs and toast'"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEstimate()}
        />
      </div>

      <div className="flex gap-8 mb-12">
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => cameraInputRef.current?.click()}>
          📷 Take Photo
        </button>
        <button className="btn btn-gray" style={{ flex: 1 }} onClick={() => fileInputRef.current?.click()}>
          🖼 Choose Photo
        </button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageFile(e.target.files[0])} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handleImageFile(e.target.files[0])} />

      {imagePreview && (
        <div className="mb-12">
          <img src={imagePreview} alt="Food" className="img-preview" />
          <button className="btn btn-gray" style={{ fontSize: 13, padding: '6px 12px' }} onClick={() => { setImageData(null); setImagePreview(null) }}>
            Clear Photo
          </button>
        </div>
      )}

      <button
        className="btn btn-primary btn-full"
        onClick={handleEstimate}
        disabled={isLoading || (!description.trim() && !imageData)}
      >
        {isLoading ? 'Estimating…' : 'Estimate Macros'}
      </button>

      {isLoading && <div className="spinner" />}
      {error && <p className="error-text">{error}</p>}

      {macros && (
        <div className="macro-result-card mt-12">
          <div className="flex justify-between items-center mb-12">
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Servings:</span>
            <div className="serving-stepper">
              <button className="stepper-btn" onClick={() => setServings((s) => Math.max(0.2, +(s - 0.2).toFixed(1)))}>−</button>
              <span className="stepper-value">{servings.toFixed(1)}×</span>
              <button className="stepper-btn" onClick={() => setServings((s) => Math.min(10, +(s + 0.2).toFixed(1)))}>+</button>
            </div>
          </div>
          <div className="macro-result-row"><span>Calories</span><strong>{Math.round(macros.calories * servings)} kcal</strong></div>
          <div className="macro-result-row"><span>Protein</span><strong>{(macros.protein * servings).toFixed(1)} g</strong></div>
          <div className="macro-result-row"><span>Carbs</span><strong>{(macros.carbs * servings).toFixed(1)} g</strong></div>
          <div className="macro-result-row"><span>Fat</span><strong>{(macros.fat * servings).toFixed(1)} g</strong></div>
          <button className="btn btn-green btn-full mt-12" onClick={handleLog}>
            Log to Daily Log
          </button>
        </div>
      )}

      {showManual && <ManualFoodEntry onClose={() => { setShowManual(false); navigate('/') }} />}
    </div>
  )
}
