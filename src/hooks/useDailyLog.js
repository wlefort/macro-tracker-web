import { useState, useCallback } from 'react'
import { isToday, isSameDay } from '../utils/dateUtils'
import { getTotalCalories, getTotalProtein, getTotalCarbs, getTotalFat } from '../utils/foodUtils'

function load() {
  try {
    const raw = localStorage.getItem('foodItems')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist(items) {
  localStorage.setItem('foodItems', JSON.stringify(items))
}

export function useDailyLog() {
  const [foodItems, setFoodItems] = useState(load)

  const _set = useCallback((updater) => {
    setFoodItems((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persist(next)
      return next
    })
  }, [])

  const addFood = useCallback((item) => {
    _set((prev) => [...prev, item])
  }, [_set])

  const updateFood = useCallback((updated) => {
    _set((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
  }, [_set])

  const deleteFood = useCallback((id) => {
    _set((prev) => prev.filter((item) => item.id !== id))
  }, [_set])

  const addWater = useCallback((oz) => {
    const waterItem = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name: 'Water',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      waterOz: oz,
      servingSize: 1.0,
      servings: 1.0,
      originalCalories: 0,
      originalProtein: 0,
      originalCarbs: 0,
      originalFat: 0,
      originalServingSize: 1.0,
      imageData: null,
    }
    _set((prev) => [...prev, waterItem])
  }, [_set])

  const relogForToday = useCallback((item) => {
    const newItem = { ...item, id: crypto.randomUUID(), date: new Date().toISOString() }
    _set((prev) => [...prev, newItem])
  }, [_set])

  const todayItems = foodItems.filter((item) => isToday(item.date))

  const totalCaloriesToday = todayItems.reduce((s, i) => s + getTotalCalories(i), 0)
  const totalProteinToday = todayItems.reduce((s, i) => s + getTotalProtein(i), 0)
  const totalCarbsToday = todayItems.reduce((s, i) => s + getTotalCarbs(i), 0)
  const totalFatToday = todayItems.reduce((s, i) => s + getTotalFat(i), 0)
  const totalWaterToday = todayItems.reduce((s, i) => s + (i.waterOz || 0), 0)

  const itemsForDate = useCallback(
    (date) => foodItems.filter((item) => isSameDay(item.date, date)),
    [foodItems]
  )

  return {
    foodItems,
    todayItems,
    totalCaloriesToday,
    totalProteinToday,
    totalCarbsToday,
    totalFatToday,
    totalWaterToday,
    addFood,
    updateFood,
    deleteFood,
    addWater,
    relogForToday,
    itemsForDate,
  }
}
