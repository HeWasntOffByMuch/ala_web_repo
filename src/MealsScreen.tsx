import { useState } from 'react'
import type { Meal } from './types'
import { filterByName } from './text'
import { inputClass } from './AddMealScreen'
import { footerClass, headerClass, primaryButton, rowClass, secondaryButton } from './ui'

interface Props {
  meals: Meal[]
  selected: string[]
  onToggle: (id: string) => void
  onClear: () => void
  onShowList: () => void
  onAdd: () => void
}

export default function MealsScreen({ meals, selected, onToggle, onClear, onShowList, onAdd }: Props) {
  const [query, setQuery] = useState('')
  const visible = filterByName(meals, query)
  return (
    <>
      <header className={headerClass}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1>Posiłki</h1>
            <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              Wybrano: {selected.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="min-h-12 rounded-lg bg-zinc-200 px-4 text-base font-medium dark:bg-zinc-800"
          >
            + Nowy
          </button>
        </div>
        <input
          type="search"
          aria-label="Szukaj posiłku"
          placeholder="Szukaj posiłku"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputClass} mt-2 font-normal`}
        />
      </header>
      <ul className="flex-1">
        {visible.length === 0 && (
          <li className="p-4 text-zinc-500 dark:text-zinc-400">Brak posiłków dla „{query}”.</li>
        )}
        {visible.map((meal) => {
          const isSelected = selected.includes(meal.id)
          return (
            <li key={meal.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => onToggle(meal.id)}
                className={`${rowClass} ${isSelected ? 'bg-green-100 font-medium dark:bg-green-950' : ''}`}
              >
                <span
                  aria-hidden
                  className={`flex size-6 shrink-0 items-center justify-center rounded border-2 ${
                    isSelected
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-zinc-400 dark:border-zinc-600'
                  }`}
                >
                  {isSelected && '✓'}
                </span>
                {meal.name}
              </button>
            </li>
          )
        })}
      </ul>
      <div className={footerClass}>
        <button type="button" className={secondaryButton} onClick={onClear}>
          Wyczyść wybór
        </button>
        <button
          type="button"
          className={primaryButton}
          disabled={selected.length === 0}
          onClick={onShowList}
        >
          Lista zakupów
        </button>
      </div>
    </>
  )
}
