import { loadLastSuccess, saveLastSuccess } from './storage'

export type SuccessVariant = 'hyperspace' | 'cantina'

/** Naprzemiennie: hiperprzestrzeń, kantyna, hiperprzestrzeń... Ostatni wybór pamiętamy w storage. */
export function nextVariant(): SuccessVariant {
  const next: SuccessVariant = loadLastSuccess() === 'hyperspace' ? 'cantina' : 'hyperspace'
  saveLastSuccess(next)
  return next
}
