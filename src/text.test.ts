import { filterByName } from './text'

const items = [{ name: 'Łosoś z ziemniakami' }, { name: 'Spaghetti' }, { name: 'Zupa' }]

describe('filterByName', () => {
  it('ignoruje wielkość liter i polskie znaki', () => {
    expect(filterByName(items, 'LOSOS')).toEqual([items[0]])
    expect(filterByName(items, 'ZIEMN')).toEqual([items[0]])
  })
  it('pusta fraza zwraca wszystko, brak trafień zwraca []', () => {
    expect(filterByName(items, '  ')).toHaveLength(3)
    expect(filterByName(items, 'xyz')).toEqual([])
  })
})
