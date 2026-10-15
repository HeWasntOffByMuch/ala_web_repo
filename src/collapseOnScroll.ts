import type { UIEvent } from 'react'

const RANGE = 60 // px przewijania, po których nagłówek jest w pełni "zwinięty"

/**
 * Przewija się tylko `.main`, nagłówek stoi w miejscu. Postęp przewijania trafia do
 * zmiennej --p nagłówka, a CSS płynnie skaluje jego zawartość (bez zmiany wysokości).
 */
export function collapseOnScroll(e: UIEvent<HTMLElement>) {
  const el = e.currentTarget
  const hdr = el.parentElement?.querySelector<HTMLElement>('.hdr')
  const p = Math.min(1, Math.max(0, el.scrollTop / RANGE))
  hdr?.style.setProperty('--p', p.toFixed(3))
}
