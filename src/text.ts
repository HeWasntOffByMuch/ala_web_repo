export const normalize = (s: string) =>
  s.toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/\p{M}/gu, '').trim()

/** Filtr po nazwie: ignoruje wielkość liter i polskie znaki. Pusta fraza zwraca wszystko. */
export function filterByName<T extends { name: string }>(items: T[], query: string): T[] {
  const q = normalize(query)
  return q ? items.filter((i) => normalize(i.name).includes(q)) : items
}
