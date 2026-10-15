import { buildShoppingList } from './buildShoppingList'
import type { Data } from './types'

const data: Data = {
  categories: ['Warzywa', 'Nabiał', 'Suche', 'Napoje'],
  products: [
    { id: 'pomidory', name: 'Pomidory', category: 'Warzywa' },
    { id: 'cebula', name: 'Cebula', category: 'Warzywa' },
    { id: 'ogorek', name: 'Ogórek', category: 'Warzywa' },
    { id: 'czosnek', name: 'Czosnek', category: 'Warzywa' },
    { id: 'mleko', name: 'Mleko', category: 'Nabiał' },
    { id: 'makaron', name: 'Makaron', category: 'Suche' },
    { id: 'woda', name: 'Woda', category: 'Napoje' },
  ],
  meals: [
    { id: 'a', name: 'A', products: ['makaron', 'pomidory', 'cebula'] },
    { id: 'b', name: 'B', products: ['pomidory', 'mleko', 'ogorek'] },
    { id: 'c', name: 'C', products: ['czosnek'] },
  ],
}

describe('buildShoppingList', () => {
  it('deduplikuje produkt występujący w kilku posiłkach', () => {
    const ids = buildShoppingList(['a', 'b'], [], data).flatMap((s) => s.items.map((i) => i.id))
    expect(ids.filter((id) => id === 'pomidory')).toHaveLength(1)
  })

  it('sekcje w kolejności categories, puste pominięte', () => {
    const sections = buildShoppingList(['a', 'b'], [], data)
    expect(sections.map((s) => s.category)).toEqual(['Warzywa', 'Nabiał', 'Suche'])
  })

  it('alfabetycznie w sekcji, odhaczone na końcu', () => {
    const [warzywa] = buildShoppingList(['a', 'b', 'c'], ['cebula'], data)
    expect(warzywa.items.map((i) => i.name)).toEqual(['Czosnek', 'Ogórek', 'Pomidory', 'Cebula'])
    expect(warzywa.items.map((i) => i.inCart)).toEqual([false, false, false, true])
  })

  it('ignoruje nieznane id posiłków', () => {
    expect(buildShoppingList(['nie-ma'], [], data)).toEqual([])
    const sections = buildShoppingList(['nie-ma', 'c'], [], data)
    expect(sections).toHaveLength(1)
    expect(sections[0].items.map((i) => i.id)).toEqual(['czosnek'])
  })

  it('pomija usunięte produkty', () => {
    const sections = buildShoppingList(['a', 'b'], [], data, ['pomidory', 'mleko'])
    const ids = sections.flatMap((s) => s.items.map((i) => i.id))
    expect(ids).not.toContain('pomidory')
    expect(sections.map((s) => s.category)).toEqual(['Warzywa', 'Suche'])
  })
})
