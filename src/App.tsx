import { useEffect, useState } from 'react'
import { MealsScreen } from './components/MealsScreen'
import { ShoppingListScreen } from './components/ShoppingListScreen'
import rawData from './data.json'
import { buildShoppingList } from './lib/buildShoppingList'
import { loadInCart, loadSelectedMeals, saveInCart, saveSelectedMeals } from './lib/storage'
import type { Data } from './types'

const defaultData: Data = rawData

function toggle(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
}

export default function App({ data = defaultData }: { data?: Data }) {
  const [screen, setScreen] = useState<'meals' | 'list'>('meals')
  const [selectedMeals, setSelectedMeals] = useState(() => loadSelectedMeals(data))
  const [inCart, setInCart] = useState(() => loadInCart(data))

  useEffect(() => saveSelectedMeals(selectedMeals), [selectedMeals])
  useEffect(() => saveInCart(inCart), [inCart])
  useEffect(() => window.scrollTo(0, 0), [screen])

  if (screen === 'list') {
    return (
      <ShoppingListScreen
        sections={buildShoppingList(selectedMeals, inCart, data)}
        onToggleProduct={(id) => setInCart((ids) => toggle(ids, id))}
        onClearCart={() => setInCart([])}
        onBack={() => setScreen('meals')}
      />
    )
  }

  return (
    <MealsScreen
      data={data}
      selectedMealIds={selectedMeals}
      onToggleMeal={(id) => setSelectedMeals((ids) => toggle(ids, id))}
      onClearSelection={() => setSelectedMeals([])}
      onShowList={() => setScreen('list')}
    />
  )
}
