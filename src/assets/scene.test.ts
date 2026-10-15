import { pickScene } from './scene'
import { PLANETS } from './planets'
import { SHIPS } from './ships'

describe('pickScene', () => {
  it('zwraca znane statek i planetę', () => {
    for (let i = 0; i < 50; i++) {
      const s = pickScene(() => (i * 0.137) % 1)
      expect(SHIPS).toContain(s.ship)
      expect(PLANETS).toContain(s.planet)
    }
  })
  it('nie powtarza tej samej sceny dwa razy z rzędu', () => {
    let n = 0
    const rnd = () => ((n++ * 0.37) % 1) // deterministyczny, ale zmienny
    const a = pickScene(() => 0.1)
    const b = pickScene(() => 0.1)
    expect(`${a.ship}${a.planet}`).not.toBe(`${b.ship}${b.planet}`)
    expect(rnd()).toBeGreaterThanOrEqual(0)
  })
})
