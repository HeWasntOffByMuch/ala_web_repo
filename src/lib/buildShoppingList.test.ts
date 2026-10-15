import { describe, expect, it } from 'vitest'
import type { Data } from '../types'
import { buildShoppingList } from './buildShoppingList'

const data: Data = {
  categories: ['Warzywa', 'Mięso', 'Nabiał', 'Suche'],
  products: [
    { id: 'makaron', name: 'Makaron', category: 'Suche' },
    { id: 'pomidory', name: 'Pomidory', category: 'Warzywa' },
    { id: 'czosnek', name: 'Czosnek', category: 'Warzywa' },
    { id: 'cebula', name: 'Cebula', category: 'Warzywa' },
    { id: 'losos', name: 'Łosoś', category: 'Mięso' },
    { id: 'mieso', name: 'Mięso mielone', category: 'Mięso' },
    { id: 'maslo', name: 'Masło', category: 'Nabiał' },
  ],
  meals: [
    { id: 'spaghetti', name: 'Spaghetti', products: ['makaron', 'pomidory', 'czosnek', 'cebula', 'mieso'] },
    { id: 'losos', name: 'Łosoś', products: ['losos', 'czosnek', 'maslo'] },
  ],
}

const ids = (sections: ReturnType<typeof buildShoppingList>) =>
  sections.map((s) => [s.category, s.items.map((i) => i.id)])

describe('buildShoppingList', () => {
  it('returns no sections when nothing is selected', () => {
    expect(buildShoppingList([], [], data)).toEqual([])
  })

  it('lists a product shared by several meals only once', () => {
    const sections = buildShoppingList(['spaghetti', 'losos'], [], data)
    const all = sections.flatMap((s) => s.items.map((i) => i.id))
    expect(all.filter((id) => id === 'czosnek')).toHaveLength(1)
    expect(new Set(all).size).toBe(all.length)
  })

  it('orders sections by categories and skips empty ones', () => {
    expect(buildShoppingList(['losos'], [], data).map((s) => s.category)).toEqual(['Warzywa', 'Mięso', 'Nabiał'])
    expect(buildShoppingList(['spaghetti'], [], data).map((s) => s.category)).toEqual(['Warzywa', 'Mięso', 'Suche'])
  })

  it('sorts items alphabetically (Polish collation) with in-cart items last', () => {
    expect(ids(buildShoppingList(['spaghetti', 'losos'], [], data))).toEqual([
      ['Warzywa', ['cebula', 'czosnek', 'pomidory']],
      ['Mięso', ['losos', 'mieso']],
      ['Nabiał', ['maslo']],
      ['Suche', ['makaron']],
    ])

    const sections = buildShoppingList(['spaghetti', 'losos'], ['cebula', 'losos'], data)
    expect(ids(sections)).toEqual([
      ['Warzywa', ['czosnek', 'pomidory', 'cebula']],
      ['Mięso', ['mieso', 'losos']],
      ['Nabiał', ['maslo']],
      ['Suche', ['makaron']],
    ])
    expect(sections[0]?.items.map((i) => i.inCart)).toEqual([false, false, true])
  })

  it('ignores unknown meal ids', () => {
    expect(buildShoppingList(['nope', 'losos'], [], data)).toEqual(buildShoppingList(['losos'], [], data))
    expect(buildShoppingList(['nope'], [], data)).toEqual([])
  })
})
