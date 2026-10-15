import { useState } from 'react'
import type { Meal } from './types'
import { filterByName } from './text'
import { CartIcon, CheckIcon, Emblem, MealIcon, ShipSchematic, Skyline, SpeakerIcon } from './icons'

interface Props {
  meals: Meal[]
  selected: string[]
  muted: boolean
  onToggleMute: () => void
  onToggle: (id: string) => void
  onClear: () => void
  onShowList: () => void
  onAdd: () => void
}

export default function MealsScreen({
  meals,
  selected,
  muted,
  onToggleMute,
  onToggle,
  onClear,
  onShowList,
  onAdd,
}: Props) {
  const [query, setQuery] = useState('')
  const visible = filterByName(meals, query)
  return (
    <>
      <header className="hdr">
        <div className="hdr-row">
          <Emblem className="emblem" />
          <div>
            <h1 className="title">Posiłki</h1>
            <p className="label">
              Wybrano: {selected.length} / {meals.length}
            </p>
          </div>
          <ShipSchematic className="hdr-art" />
        </div>
      </header>
      <div className="search-row">
        <input
          type="search"
          className="field"
          aria-label="Szukaj posiłku"
          placeholder="Szukaj posiłku..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn btn-primary btn-square" aria-label="Dodaj posiłek" onClick={onAdd}>
          +
        </button>
      </div>
      <main className="main">
        <ul className="rows meals">
          {visible.length === 0 && <li className="empty">Brak posiłków dla „{query}”.</li>}
          {visible.map((meal) => (
            <li key={meal.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={selected.includes(meal.id)}
                onClick={() => onToggle(meal.id)}
                className="row"
              >
                <span className="chk" aria-hidden>
                  <CheckIcon />
                </span>
                <span className="row-name">{meal.name}</span>
                <MealIcon id={meal.id} className="row-icon" />
              </button>
            </li>
          ))}
        </ul>
        <Skyline className="horizon" />
      </main>
      <div className="dock">
        <button type="button" className="btn btn-ghost" aria-pressed={muted} onClick={onToggleMute} aria-label={muted ? 'Włącz dźwięk' : 'Wyłącz dźwięk'}>
          <SpeakerIcon muted={muted} />
        </button>
        <button type="button" className="btn" onClick={onClear}>
          Wyczyść wybór
        </button>
        <button type="button" className="btn btn-primary" disabled={selected.length === 0} onClick={onShowList}>
          <CartIcon /> Lista zakupów
        </button>
      </div>
    </>
  )
}
