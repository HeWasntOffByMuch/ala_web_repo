import type { Meal } from './types'
import { footerClass, headerClass, primaryButton, rowClass, secondaryButton } from './ui'

interface Props {
  meals: Meal[]
  selected: string[]
  onToggle: (id: string) => void
  onClear: () => void
  onShowList: () => void
}

export default function MealsScreen({ meals, selected, onToggle, onClear, onShowList }: Props) {
  return (
    <>
      <header className={headerClass}>
        <h1>Posiłki</h1>
        <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
          Wybrano: {selected.length}
        </p>
      </header>
      <ul className="flex-1">
        {meals.map((meal) => {
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
