import {
  CUSTOM_MEALS_KEY,
  CUSTOM_PRODUCTS_KEY,
  IN_CART_KEY,
  loadCustomMeals,
  loadCustomProducts,
  saveCustomMeals,
  saveCustomProducts,
  SELECTED_MEALS_KEY,
  loadInCart,
  loadSelectedMeals,
  saveInCart,
  saveSelectedMeals,
} from './storage'
import type { Data } from './types'

const data: Data = {
  categories: ['K'],
  products: [
    { id: 'p1', name: 'P1', category: 'K' },
    { id: 'p2', name: 'P2', category: 'K' },
  ],
  meals: [
    { id: 'm1', name: 'M1', products: ['p1'] },
    { id: 'm2', name: 'M2', products: ['p2'] },
  ],
}

describe('storage', () => {
  it('zapisuje i odczytuje oba klucze', () => {
    saveSelectedMeals(['m1', 'm2'])
    saveInCart(['p2'])
    expect(localStorage.getItem(SELECTED_MEALS_KEY)).toBe('["m1","m2"]')
    expect(localStorage.getItem(IN_CART_KEY)).toBe('["p2"]')
    expect(loadSelectedMeals(data)).toEqual(['m1', 'm2'])
    expect(loadInCart(data)).toEqual(['p2'])
  })

  it('filtruje nieistniejące id przy odczycie', () => {
    saveSelectedMeals(['m1', 'stary-posilek'])
    saveInCart(['stary-produkt', 'p1'])
    expect(loadSelectedMeals(data)).toEqual(['m1'])
    expect(loadInCart(data)).toEqual(['p1'])
  })

  it('uszkodzony JSON lub zły typ daje pustą tablicę', () => {
    localStorage.setItem(SELECTED_MEALS_KEY, '{nie json')
    localStorage.setItem(IN_CART_KEY, '{"a":1}')
    expect(loadSelectedMeals(data)).toEqual([])
    expect(loadInCart(data)).toEqual([])
  })

  it('brak wartości daje pustą tablicę', () => {
    expect(loadSelectedMeals(data)).toEqual([])
  })
})

describe('custom data', () => {
  it('zapisuje i odczytuje własne posiłki i produkty, odrzuca śmieci', () => {
    saveCustomProducts([{ id: 'moj-1', name: 'Rzodkiewka', category: 'K' }])
    saveCustomMeals([{ id: 'moj-m', name: 'Sałatka', products: ['moj-1', 'p1'] }])
    expect(loadCustomProducts(data)).toHaveLength(1)
    expect(loadCustomMeals()).toHaveLength(1)

    localStorage.setItem(
      CUSTOM_PRODUCTS_KEY,
      JSON.stringify([{ id: 'x', name: 'X', category: 'Nie ma' }, 5, null]),
    )
    localStorage.setItem(CUSTOM_MEALS_KEY, '{zepsute')
    expect(loadCustomProducts(data)).toEqual([])
    expect(loadCustomMeals()).toEqual([])
  })
})
