import { useState, useCallback } from 'react'

const DEFAULTS = {
  calorieGoal: 2200,
  proteinGoal: 175,
  carbGoal: 200,
  fatGoal: 70,
  waterGoalOz: 64,
  autoAdjustmentEnabled: false,
}

function load() {
  try {
    const raw = localStorage.getItem('macroGoals')
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

export function useMacroGoals() {
  const [goals, setGoals] = useState(load)

  const saveGoals = useCallback((updated) => {
    setGoals(updated)
    localStorage.setItem('macroGoals', JSON.stringify(updated))
  }, [])

  const setGoal = useCallback((key, value) => {
    setGoals((prev) => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('macroGoals', JSON.stringify(next))
      return next
    })
  }, [])

  const applyCalculatedMacros = useCallback((macros) => {
    setGoals((prev) => {
      const next = {
        ...prev,
        calorieGoal: macros.calories,
        proteinGoal: macros.protein,
        carbGoal: macros.carbs,
        fatGoal: macros.fat,
      }
      localStorage.setItem('macroGoals', JSON.stringify(next))
      return next
    })
  }, [])

  return { ...goals, saveGoals, setGoal, applyCalculatedMacros }
}
