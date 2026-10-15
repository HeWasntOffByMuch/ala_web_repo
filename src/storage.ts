import type { Data } from './types'

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

function writeIds(key: string, ids: string[]): void {
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

export const saveSelectedMeals = (ids: string[]) => writeIds(SELECTED_MEALS_KEY, ids)
export const saveInCart = (ids: string[]) => writeIds(IN_CART_KEY, ids)
