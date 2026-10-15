import type { Data, Meal, Product } from './types'

export const SELECTED_MEALS_KEY = 'zakupy.selectedMeals'
export const IN_CART_KEY = 'zakupy.inCart'

function readIds(key: string, validIds: Set<string>): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id))
  } catch {
    return []
  }
}

function writeIds(key: string, ids: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(ids))
  } catch {
    // brak dostępu do storage (tryb prywatny, limit) — stan zostaje tylko w pamięci
  }
}

export const loadSelectedMeals = (data: Data) =>
  readIds(SELECTED_MEALS_KEY, new Set(data.meals.map((m) => m.id)))

export const loadInCart = (data: Data) =>
  readIds(IN_CART_KEY, new Set(data.products.map((p) => p.id)))

export const REMOVED_KEY = 'zakupy.removed'
export const loadRemoved = (data: Data) =>
  readIds(REMOVED_KEY, new Set(data.products.map((p) => p.id)))
export const saveRemoved = (ids: string[]) => writeIds(REMOVED_KEY, ids)

export const saveSelectedMeals = (ids: string[]) => writeIds(SELECTED_MEALS_KEY, ids)
export const saveInCart = (ids: string[]) => writeIds(IN_CART_KEY, ids)

export const CUSTOM_MEALS_KEY = 'zakupy.customMeals'
export const CUSTOM_PRODUCTS_KEY = 'zakupy.customProducts'

function readList(key: string): unknown[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

export function loadCustomProducts(data: Data): Product[] {
  return readList(CUSTOM_PRODUCTS_KEY).filter(
    (p): p is Product =>
      isObj(p) &&
      typeof p.id === 'string' &&
      typeof p.name === 'string' &&
      typeof p.category === 'string' &&
      data.categories.includes(p.category),
  )
}

export function loadCustomMeals(): Meal[] {
  return readList(CUSTOM_MEALS_KEY).filter(
    (m): m is Meal =>
      isObj(m) &&
      typeof m.id === 'string' &&
      typeof m.name === 'string' &&
      Array.isArray(m.products) &&
      m.products.every((id) => typeof id === 'string'),
  )
}

export const saveCustomProducts = (products: Product[]) => writeIds(CUSTOM_PRODUCTS_KEY, products)
export const saveCustomMeals = (meals: Meal[]) => writeIds(CUSTOM_MEALS_KEY, meals)

export const MUTED_KEY = 'zakupy.muted'

export function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === '1'
  } catch {
    return false
  }
}

export function saveMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTED_KEY, muted ? '1' : '0')
  } catch {
    // ignorujemy brak dostępu do storage
  }
}

export const LAST_SUCCESS_KEY = 'zakupy.lastSuccess'

export function loadLastSuccess(): string | null {
  try {
    return localStorage.getItem(LAST_SUCCESS_KEY)
  } catch {
    return null
  }
}

export function saveLastSuccess(value: string): void {
  try {
    localStorage.setItem(LAST_SUCCESS_KEY, value)
  } catch {
    // ignorujemy brak dostępu do storage
  }
}
