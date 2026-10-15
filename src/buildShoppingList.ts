import type { Data, ShoppingSection } from './types'

const collator = new Intl.Collator('pl')

export function buildShoppingList(
  selectedMealIds: string[],
  inCartIds: string[],
  data: Data,
): ShoppingSection[] {
  const productsById = new Map(data.products.map((p) => [p.id, p]))
  const mealsById = new Map(data.meals.map((m) => [m.id, m]))
  const inCart = new Set(inCartIds)

  const productIds = new Set<string>()
  for (const mealId of selectedMealIds) {
    for (const productId of mealsById.get(mealId)?.products ?? []) {
      if (productsById.has(productId)) productIds.add(productId)
    }
  }

  const sections: ShoppingSection[] = []
  for (const category of data.categories) {
    const items = [...productIds]
      .map((id) => productsById.get(id)!)
      .filter((p) => p.category === category)
      .map((p) => ({ id: p.id, name: p.name, inCart: inCart.has(p.id) }))
      .sort((a, b) => Number(a.inCart) - Number(b.inCart) || collator.compare(a.name, b.name))
    if (items.length > 0) sections.push({ category, items })
  }
  return sections
}
