import { nextVariant } from './successVariant'

describe('nextVariant', () => {
  it('zaczyna od hiperprzestrzeni i potem na zmianę z kantyną', () => {
    expect([nextVariant(), nextVariant(), nextVariant(), nextVariant()]).toEqual([
      'hyperspace',
      'cantina',
      'hyperspace',
      'cantina',
    ])
  })
  it('pamięta ostatni wariant po przeładowaniu', () => {
    localStorage.setItem('zakupy.lastSuccess', 'hyperspace')
    expect(nextVariant()).toBe('cantina')
  })
})
