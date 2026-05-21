const APP_ID = 'bf899f5f'
const APP_KEY = '499f8e07c133d751f15f5f620f16edd1'

export async function lookupBarcode(upc) {
  const url = `https://trackapi.nutritionix.com/v2/search/item?upc=${upc}`
  const res = await fetch(url, {
    headers: {
      'x-app-id': APP_ID,
      'x-app-key': APP_KEY,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) return null

  const data = await res.json()
  const item = data?.foods?.[0]
  if (!item) return null

  return {
    name: item.food_name,
    calories: item.nf_calories ?? 0,
    protein: item.nf_protein ?? 0,
    carbs: item.nf_total_carbohydrate ?? 0,
    fat: item.nf_total_fat ?? 0,
  }
}
