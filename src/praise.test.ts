import { doneMessage, NAME, pickPraise, produkty } from './praise'

describe('praise', () => {
  it('każda pochwała zawiera imię, bez niezamienionych znaczników', () => {
    for (let i = 0; i < 40; i++) {
      const p = pickPraise(() => i / 40)
      expect(p).toContain(NAME)
      expect(p).not.toContain('{')
    }
  })
  it('dwie pochwały z rzędu są różne', () => {
    expect(pickPraise(() => 0.3)).not.toBe(pickPraise(() => 0.3))
  })
  it('odmienia "produkt"', () => {
    expect([1, 2, 5, 12, 22, 25].map(produkty)).toEqual([
      'produkt', 'produkty', 'produktów', 'produktów', 'produkty', 'produktów',
    ])
    expect(doneMessage(3)).toContain('3 produkty')
  })
})
