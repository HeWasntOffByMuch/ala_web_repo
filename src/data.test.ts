import { describe, expect, it } from 'vitest'
import data from './data.json'

describe('data.json', () => {
  it('every meal product references an existing product', () => {
    const productIds = new Set(data.products.map((p) => p.id))
    const missing = data.meals.flatMap((m) =>
      m.products.filter((id) => !productIds.has(id)).map((id) => `${m.id} → ${id}`),
    )
    expect(missing).toEqual([])
  })

  it('every product category exists in categories', () => {
    const categories = new Set(data.categories)
    const invalid = data.products.filter((p) => !categories.has(p.category)).map((p) => `${p.id} → ${p.category}`)
    expect(invalid).toEqual([])
  })

  it('product ids are unique', () => {
    const ids = data.products.map((p) => p.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })

  it('meal ids are unique', () => {
    const ids = data.meals.map((m) => m.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })
})
