import { useState, useCallback } from 'react'

const DEFAULTS = {
  age: 30,
  weight: 150,
  height: 65,
  goalType: 'maintain',
  targetRatePerWeek: 0.0,
  activityLevel: 'light',
  weightHistory: [],
  theme: 'system',
}

function load() {
  try {
    const raw = localStorage.getItem('userSettings')
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

export function useUserSettings() {
  const [settings, setSettings] = useState(load)

  const saveSettings = useCallback((updated) => {
    setSettings(updated)
    localStorage.setItem('userSettings', JSON.stringify(updated))
  }, [])

  const setSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('userSettings', JSON.stringify(next))
      return next
    })
  }, [])

  const logWeight = useCallback((weight) => {
    setSettings((prev) => {
      const entry = { id: crypto.randomUUID(), date: new Date().toISOString(), weight }
      const next = { ...prev, weightHistory: [...prev.weightHistory, entry] }
      localStorage.setItem('userSettings', JSON.stringify(next))
      return next
    })
  }, [])

  return { ...settings, saveSettings, setSetting, logWeight }
}
