import { useState } from 'react'
import type { Meal, Product } from './types'
import { filterByName, normalize } from './text'
import { CheckIcon, Emblem } from './icons'

interface Props {
  categories: string[]
  products: Product[]
  onSave: (meal: Meal, newProducts: Product[]) => void
  onCancel: () => void
}

let counter = 0
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`

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
      <header className="hdr">
        <div className="hdr-row">
          <Emblem className="emblem" style={{ width: 44, height: 44 }} />
          <h1 className="title">Nowy posiłek</h1>
        </div>
      </header>
      <main className="main">
      <div style={{ display: 'grid', gap: 12, padding: '14px 14px 8px' }}>
        <label className="field-label label">
          Nazwa posiłku
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Zupa pomidorowa"
          />
        </label>
        <label className="field-label label">
          Produkty (wybrano: {chosen.length})
          <input
            type="search"
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj produktu lub wpisz nowy"
          />
        </label>
      </div>
      {trimmed !== '' && !exists && (
        <div style={{ display: 'flex', gap: 8, padding: '0 14px 12px' }}>
          <select
            aria-label="Kategoria nowego produktu"
            className="field"
            style={{ flex: 1, minWidth: 0 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button type="button" className="btn btn-primary" style={{ flex: 1.4 }} onClick={addProduct}>
            Dodaj „{trimmed}”
          </button>
        </div>
      )}
      <ul className="rows">
        {matches.map((p) => {
          const on = chosen.includes(p.id)
          return (
            <li key={p.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(p.id)}
                className="row"
              >
                <span className="chk" aria-hidden>
                  <CheckIcon />
                </span>
                <span className="row-name">{p.name}</span>
                <span className="row-meta">{p.category}</span>
              </button>
            </li>
          )
        })}
      </ul>
      </main>
      <div className="dock">
        <button type="button" className="btn" onClick={onCancel}>
          Anuluj
        </button>
        <button type="button" className="btn btn-primary" disabled={!canSave} onClick={save}>
          Zapisz posiłek
        </button>
      </div>
    </>
  )
}
