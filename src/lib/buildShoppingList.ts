import type { Data } from '../types'

export interface ShoppingItem {
  id: string
  name: string
  inCart: boolean
}

export interface ShoppingSection {
  category: string
  items: ShoppingItem[]
}

const collator = new Intl.Collator('pl')

export function buildShoppingList(
  selectedMealIds: readonly string[],
  inCartIds: readonly string[],
  data: Data,
): ShoppingSection[] {
  const selected = new Set(selectedMealIds)
  const inCart = new Set(inCartIds)
  const productsById = new Map(data.products.map((p) => [p.id, p]))

  const productIds = new Set<string>()
  for (const meal of data.meals) {
    if (!selected.has(meal.id)) continue
    for (const id of meal.products) productIds.add(id)
  }

  const itemsByCategory = new Map<string, ShoppingItem[]>()
  for (const id of productIds) {
    const product = productsById.get(id)
    if (!product) continue
    const items = itemsByCategory.get(product.category) ?? []
    items.push({ id, name: product.name, inCart: inCart.has(id) })
    itemsByCategory.set(product.category, items)
  }

  return data.categories.flatMap((category) => {
    const items = itemsByCategory.get(category)
    if (!items) return []
    items.sort((a, b) => Number(a.inCart) - Number(b.inCart) || collator.compare(a.name, b.name))
    return [{ category, items }]
  })
}
