import type { Data } from '../types'

export const SELECTED_MEALS_KEY = 'zakupy.selectedMeals'
export const IN_CART_KEY = 'zakupy.inCart'

function readIds(key: string, validIds: readonly string[]): string[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  const valid = new Set(validIds)
  return [...new Set(parsed)].filter((id): id is string => typeof id === 'string' && valid.has(id))
}

function writeIds(key: string, ids: readonly string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(ids))
  } catch {
    // Storage unavailable (private mode, quota) — state just won't survive a reload.
  }
}

export function loadSelectedMeals(data: Data): string[] {
  return readIds(
    SELECTED_MEALS_KEY,
    data.meals.map((m) => m.id),
  )
}

export function loadInCart(data: Data): string[] {
  return readIds(
    IN_CART_KEY,
    data.products.map((p) => p.id),
  )
}

export function saveSelectedMeals(ids: readonly string[]): void {
  writeIds(SELECTED_MEALS_KEY, ids)
}

export function saveInCart(ids: readonly string[]): void {
  writeIds(IN_CART_KEY, ids)
}
