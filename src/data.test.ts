import data from './data.json'

const unique = (ids: string[]) => new Set(ids).size === ids.length

describe('data.json', () => {
  const productIds = new Set(data.products.map((p) => p.id))

  it('każdy produkt posiłku istnieje w products', () => {
    for (const meal of data.meals) {
      for (const id of meal.products) {
        expect(productIds.has(id), `${meal.id} -> ${id}`).toBe(true)
      }
    }
  })

  it('każda kategoria produktu istnieje w categories', () => {
    for (const p of data.products) {
      expect(data.categories, p.id).toContain(p.category)
    }
  })

  it('id produktów i posiłków są unikalne', () => {
    expect(unique(data.products.map((p) => p.id))).toBe(true)
    expect(unique(data.meals.map((m) => m.id))).toBe(true)
  })
})
