import p0 from './pose_00.png'
import p1 from './pose_01.png'
import p2 from './pose_02.png'
import p3 from './pose_03.png'
import p4 from './pose_04.png'
import p5 from './pose_05.png'

/**
 * Klatki postaci (z handoffu animacji). Wszystkie mają ten sam rozmiar 300×314 i tę samą
 * pozycję głowy, więc podmiana obrazków nie powoduje skoków. To nie szkielet, tylko
 * przełączane rysunki, więc ruch jest delikatny i oparty na tej kolejności.
 */
export const POSES = [p0, p1, p2, p3, p4, p5]
export const POSE_ASPECT = 300 / 314

/** Kolejność klatek i czasy (ms) z animation.json: 3,59 s na jedno picie. */
export const SEQUENCE = [0, 1, 2, 3, 2, 4, 0]
export const DURATIONS = [500, 330, 480, 800, 330, 650, 500]
export const CYCLE_MS = DURATIONS.reduce((a, b) => a + b, 0)

let warmed = false
/** Wczytuje klatki z wyprzedzeniem, żeby przy pierwszym pokazie nic nie mrugało. */
export function preloadDrinker() {
  if (warmed) return
  warmed = true
  for (const src of POSES) {
    const img = new Image()
    img.src = src
  }
}
