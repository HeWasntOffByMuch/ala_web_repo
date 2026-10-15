import { useState } from 'react'
import type { Meal, Product } from './types'
import { filterByName, normalize } from './text'
import { footerClass, headerClass, primaryButton, rowClass, secondaryButton } from './ui'

interface Props {
  categories: string[]
  products: Product[]
  onSave: (meal: Meal, newProducts: Product[]) => void
  onCancel: () => void
}

let counter = 0
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`

export const inputClass =
  'min-h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-base dark:border-zinc-700 dark:bg-zinc-800'

export default function AddMealScreen({ categories, products, onSave, onCancel }: Props) {
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState<string[]>([])
  const [added, setAdded] = useState<Product[]>([])
  const [category, setCategory] = useState(categories[0])

  const all = [...products, ...added]
  const matches = filterByName(all, query)
  const trimmed = query.trim()
  const exists = all.some((p) => normalize(p.name) === normalize(trimmed))

  const toggle = (id: string) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const addProduct = () => {
    const product = { id: newId('moj-produkt'), name: trimmed, category }
    setAdded((a) => [...a, product])
    setChosen((c) => [...c, product.id])
    setQuery('')
  }

  const canSave = name.trim() !== '' && chosen.length > 0
  const save = () => {
    const usedNew = added.filter((p) => chosen.includes(p.id))
    onSave({ id: newId('moj-posilek'), name: name.trim(), products: chosen }, usedNew)
  }

  return (
    <>
      <header className={headerClass}>
        <h1>Nowy posiłek</h1>
      </header>
      <div className="flex flex-1 flex-col gap-3 p-4 pb-2">
        <label className="flex flex-col gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          Nazwa posiłku
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Zupa pomidorowa"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          Produkty (wybrano: {chosen.length})
          <input
            type="search"
            className={inputClass}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj produktu lub wpisz nowy"
          />
        </label>
      </div>
      {trimmed !== '' && !exists && (
        <div className="flex gap-2 px-4 pb-3">
          <select
            aria-label="Kategoria nowego produktu"
            className={`${inputClass} flex-1`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button type="button" className={`${primaryButton} flex-[1.4]`} onClick={addProduct}>
            Dodaj „{trimmed}”
          </button>
        </div>
      )}
      <ul>
        {matches.map((p) => {
          const on = chosen.includes(p.id)
          return (
            <li key={p.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(p.id)}
                className={`${rowClass} ${on ? 'bg-green-100 font-medium dark:bg-green-950' : ''}`}
              >
                <span
                  aria-hidden
                  className={`flex size-6 shrink-0 items-center justify-center rounded border-2 ${
                    on ? 'border-green-600 bg-green-600 text-white' : 'border-zinc-400 dark:border-zinc-600'
                  }`}
                >
                  {on && '✓'}
                </span>
                <span className="flex-1">{p.name}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{p.category}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="flex-1" />
      <div className={footerClass}>
        <button type="button" className={secondaryButton} onClick={onCancel}>
          Anuluj
        </button>
        <button type="button" className={primaryButton} disabled={!canSave} onClick={save}>
          Zapisz posiłek
        </button>
      </div>
    </>
  )
}
