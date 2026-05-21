export async function lookupBarcode(upc) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${upc}.json`
  const res = await fetch(url)
  if (!res.ok) return null

  const json = await res.json()
  const product = json?.product
  if (!product) return null

  const name = product.product_name || 'Unknown Item'
  const n = product.nutriments || {}
  const servingRaw = parseFloat(
    (product.serving_size || '100').replace(/[^0-9.]/g, '')
  ) || 100
  const scale = servingRaw / 100

  const calories =
    n['energy-kcal_serving'] ??
    (n['energy-kcal_100g'] ?? 0) * scale

  const protein =
    n['proteins_serving'] ??
    (n['proteins_100g'] ?? 0) * scale

  const carbs =
    n['carbohydrates_serving'] ??
    (n['carbohydrates_100g'] ?? 0) * scale

  const fat =
    n['fat_serving'] ??
    (n['fat_100g'] ?? 0) * scale

  return { name, calories, protein, carbs, fat }
}
