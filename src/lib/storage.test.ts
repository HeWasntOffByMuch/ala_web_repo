import { describe, expect, it } from 'vitest'
import type { Data } from '../types'
import {
  IN_CART_KEY,
  SELECTED_MEALS_KEY,
  loadInCart,
  loadSelectedMeals,
  saveInCart,
  saveSelectedMeals,
} from './storage'

const data: Data = {
  categories: ['Suche'],
  products: [
    { id: 'makaron', name: 'Makaron', category: 'Suche' },
    { id: 'ryz', name: 'Ryż', category: 'Suche' },
  ],
  meals: [
    { id: 'spaghetti', name: 'Spaghetti', products: ['makaron'] },
    { id: 'risotto', name: 'Risotto', products: ['ryz'] },
  ],
}

describe('storage', () => {
  it('returns empty arrays when nothing is stored', () => {
    expect(loadSelectedMeals(data)).toEqual([])
    expect(loadInCart(data)).toEqual([])
  })

  it('saves and loads both keys', () => {
    saveSelectedMeals(['risotto', 'spaghetti'])
    saveInCart(['ryz'])

    expect(JSON.parse(localStorage.getItem(SELECTED_MEALS_KEY)!)).toEqual(['risotto', 'spaghetti'])
    expect(JSON.parse(localStorage.getItem(IN_CART_KEY)!)).toEqual(['ryz'])
    expect(loadSelectedMeals(data)).toEqual(['risotto', 'spaghetti'])
    expect(loadInCart(data)).toEqual(['ryz'])
  })

  it('drops ids that no longer exist in data', () => {
    localStorage.setItem(SELECTED_MEALS_KEY, JSON.stringify(['gone', 'spaghetti']))
    localStorage.setItem(IN_CART_KEY, JSON.stringify(['ryz', 'gone', 'spaghetti']))

    expect(loadSelectedMeals(data)).toEqual(['spaghetti'])
    expect(loadInCart(data)).toEqual(['ryz'])
  })

  it.each(['{not json', '"makaron"', '{"a":1}', 'null', '42'])('returns [] for corrupted value %j', (raw) => {
    localStorage.setItem(SELECTED_MEALS_KEY, raw)
    localStorage.setItem(IN_CART_KEY, raw)

    expect(loadSelectedMeals(data)).toEqual([])
    expect(loadInCart(data)).toEqual([])
  })
})
