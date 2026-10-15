import { PLANETS, type PlanetKind } from './planets'
import { SHIPS, type ShipKind } from './ships'

export interface Scene {
  ship: ShipKind
  planet: PlanetKind
}

let last = ''

/** Losuje statek i planetę; ziemniak (znak firmowy) trafia się najczęściej. */
export function pickScene(random: () => number = Math.random): Scene {
  const others = PLANETS.filter((p) => p !== 'potato')
  const pick = <T,>(list: T[]) => list[Math.min(list.length - 1, Math.floor(random() * list.length))]
  let scene: Scene
  let tries = 0
  do {
    scene = { ship: pick(SHIPS), planet: random() < 0.4 ? 'potato' : pick(others) }
  } while (`${scene.ship}/${scene.planet}` === last && ++tries < 5)
  if (`${scene.ship}/${scene.planet}` === last) {
    scene = { ...scene, ship: SHIPS[(SHIPS.indexOf(scene.ship) + 1) % SHIPS.length] }
  }
  last = `${scene.ship}/${scene.planet}`
  return scene
}
