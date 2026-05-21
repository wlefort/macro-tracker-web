export function getTotalCalories(item) {
  return item.originalCalories * (item.servingSize / Math.max(item.originalServingSize, 0.1))
}

export function getTotalProtein(item) {
  return item.originalProtein * (item.servingSize / Math.max(item.originalServingSize, 0.1))
}

export function getTotalCarbs(item) {
  return item.originalCarbs * (item.servingSize / Math.max(item.originalServingSize, 0.1))
}

export function getTotalFat(item) {
  return item.originalFat * (item.servingSize / Math.max(item.originalServingSize, 0.1))
}

export function makeFoodItem({ name, calories, protein, carbs, fat, waterOz = 0, servingSize = 1.0, servings = 1.0, imageData = null }) {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    name,
    calories,
    protein,
    carbs,
    fat,
    waterOz,
    servingSize,
    servings,
    originalCalories: calories,
    originalProtein: protein,
    originalCarbs: carbs,
    originalFat: fat,
    originalServingSize: 1.0,
    imageData,
  }
}
