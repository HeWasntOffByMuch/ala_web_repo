import { useMemo } from 'react'
import type { Data } from '../types'
import { Button } from './Button'
import { CheckRow } from './CheckRow'
import { Screen } from './Screen'

interface MealsScreenProps {
  data: Data
  selectedMealIds: readonly string[]
  onToggleMeal: (id: string) => void
  onClearSelection: () => void
  onShowList: () => void
}

export function MealsScreen({ data, selectedMealIds, onToggleMeal, onClearSelection, onShowList }: MealsScreenProps) {
  const count = selectedMealIds.length
  const productNames = useMemo(() => new Map(data.products.map((p) => [p.id, p.name])), [data])

  return (
    <Screen
      title="Posiłki"
      status={`Wybrano: ${count}`}
      actions={
        <>
          <Button onClick={onClearSelection} disabled={count === 0}>
            Wyczyść wybór
          </Button>
          <Button variant="primary" onClick={onShowList} disabled={count === 0}>
            Lista zakupów
          </Button>
        </>
      }
    >
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {data.meals.map((meal) => (
          <CheckRow
            key={meal.id}
            label={meal.name}
            description={meal.products.map((id) => productNames.get(id) ?? id).join(', ')}
            checked={selectedMealIds.includes(meal.id)}
            onToggle={() => onToggleMeal(meal.id)}
            checkedStyle="highlight"
          />
        ))}
      </ul>
    </Screen>
  )
}
