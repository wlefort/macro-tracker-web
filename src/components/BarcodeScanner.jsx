import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { lookupBarcode as nutritionixLookup } from '../api/nutritionixApi'
import { lookupBarcode as openFoodFactsLookup } from '../api/openFoodFactsApi'
import { makeFoodItem } from '../utils/foodUtils'
import { useDailyLogContext } from '../context/DailyLogContext'

export default function BarcodeScanner() {
  const navigate = useNavigate()
  const { addFood } = useDailyLogContext()
  const videoRef = useRef(null)
  const controlsRef = useRef(null)
  const [status, setStatus] = useState('starting')
  const [result, setResult] = useState(null)
  const [servings, setServings] = useState(1.0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const scannedRef = useRef(false)

  useEffect(() => {
    let active = true

    async function startScanner() {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const codeReader = new BrowserMultiFormatReader()

        const devices = await BrowserMultiFormatReader.listVideoInputDevices()
        const deviceId = devices.length > 0 ? devices[devices.length - 1].deviceId : undefined

        if (!videoRef.current || !active) return

        const controls = await codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          async (result, err) => {
            if (!result || scannedRef.current) return
            scannedRef.current = true
            controls.stop()
            const code = result.getText()
            await fetchNutrition(code)
          }
        )

        controlsRef.current = controls
        setStatus('scanning')
      } catch (e) {
        if (active) setError('Camera access denied or not available.')
        setStatus('error')
      }
    }

    startScanner()

    return () => {
      active = false
      controlsRef.current?.stop()
    }
  }, [])

  async function fetchNutrition(upc) {
    setIsLoading(true)
    setError('')
    try {
      let item = await nutritionixLookup(upc)
      if (!item) item = await openFoodFactsLookup(upc)
      if (item) {
        setResult(item)
        setServings(1.0)
      } else {
        setError('Product not found. Try another barcode.')
        scannedRef.current = false
        restartScanner()
      }
    } catch {
      setError('Network error. Try again.')
      scannedRef.current = false
      restartScanner()
    } finally {
      setIsLoading(false)
    }
  }

  async function restartScanner() {
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser')
      const codeReader = new BrowserMultiFormatReader()
      const devices = await BrowserMultiFormatReader.listVideoInputDevices()
      const deviceId = devices.length > 0 ? devices[devices.length - 1].deviceId : undefined
      const controls = await codeReader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        async (res) => {
          if (!res || scannedRef.current) return
          scannedRef.current = true
          controls.stop()
          await fetchNutrition(res.getText())
        }
      )
      controlsRef.current = controls
    } catch {}
  }

  function handleLog() {
    if (!result) return
    const item = makeFoodItem({
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      servingSize: servings,
      servings,
    })
    item.originalCalories = result.calories
    item.originalProtein = result.protein
    item.originalCarbs = result.carbs
    item.originalFat = result.fat
    item.originalServingSize = 1.0
    addFood(item)
    navigate('/')
  }

  function handleRescan() {
    setResult(null)
    setError('')
    scannedRef.current = false
    restartScanner()
  }

  return (
    <div className="page">
      <h1 className="page-header">Scan Barcode</h1>

      {!result && (
        <>
          <div className="scanner-container">
            <video ref={videoRef} className="scanner-video" autoPlay playsInline muted />
            {status === 'scanning' && <div className="scanner-line" />}
          </div>
          <p className="text-secondary text-center mt-8">
            {status === 'starting' ? 'Starting camera…' : 'Point at a barcode'}
          </p>
        </>
      )}

      {isLoading && <div className="spinner" />}
      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="macro-result-card mt-12">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{result.name}</h2>

          <div className="flex justify-between items-center mb-12">
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Servings:</span>
            <div className="serving-stepper">
              <button className="stepper-btn" onClick={() => setServings((s) => Math.max(0.2, +(s - 0.2).toFixed(1)))}>−</button>
              <span className="stepper-value">{servings.toFixed(1)}×</span>
              <button className="stepper-btn" onClick={() => setServings((s) => Math.min(10, +(s + 0.2).toFixed(1)))}>+</button>
            </div>
          </div>

          <div className="macro-result-row"><span>Calories</span><strong>{Math.round(result.calories * servings)} kcal</strong></div>
          <div className="macro-result-row"><span>Protein</span><strong>{(result.protein * servings).toFixed(1)} g</strong></div>
          <div className="macro-result-row"><span>Carbs</span><strong>{(result.carbs * servings).toFixed(1)} g</strong></div>
          <div className="macro-result-row"><span>Fat</span><strong>{(result.fat * servings).toFixed(1)} g</strong></div>

          <button className="btn btn-green btn-full mt-12" onClick={handleLog}>Log This Item</button>
          <button className="btn btn-gray btn-full mt-8" onClick={handleRescan}>Scan Again</button>
        </div>
      )}
    </div>
  )
}
