export const NAME = 'Johnny'

const PRAISES = [
  '{name}, lodówka jest bezpieczna. Dzięki Tobie!',
  '{name}, to był czysty profesjonalizm w alejkach.',
  'Dowódco {name}, żaden produkt nie uciekł.',
  '{name}, pełny koszyk i zero zapomnianych rzeczy. Mistrzostwo.',
  '{name}, kolacja jest uratowana.',
  'Brawo, {name}! Cała załoga będzie najedzona.',
  '{name}, ta lista nie miała z Tobą szans.',
  '{name}, kasjerka jeszcze długo będzie o Tobie opowiadać.',
  '{name}, pełna dostawa, zero strat. Szacunek.',
  '{name}, najlepszy zaopatrzeniowiec w galaktyce.',
  '{name}, dom zaopatrzony. Czas na zasłużony odpoczynek.',
  '{name}, tak się robi zakupy. Bez nerwów i bez wracania po jedną rzecz.',
  '{name}, cała załoga Ci dziękuje.',
  'Misja zakończona sukcesem, {name}. Jak zwykle.',
]

let last = -1

/** Losowa pochwała z imieniem; dwa wywołania z rzędu nie dają tej samej. */
export function pickPraise(random: () => number = Math.random): string {
  let i = Math.floor(random() * PRAISES.length)
  if (i === last) i = (i + 1) % PRAISES.length
  last = i
  return PRAISES[i].replaceAll('{name}', NAME)
}

export function produkty(n: number): string {
  if (n === 1) return 'produkt'
  const d = n % 10
  const t = n % 100
  return d >= 2 && d <= 4 && !(t >= 12 && t <= 14) ? 'produkty' : 'produktów'
}

export const doneMessage = (count: number) =>
  `Zakupy zrobione! ${count} ${produkty(count)} w koszyku. Wracam do bazy. – ${NAME}`
