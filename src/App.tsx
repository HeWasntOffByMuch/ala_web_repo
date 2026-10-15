import { useEffect, useMemo, useState } from 'react'
import data from './data.json'
import type { Data } from './types'
import { buildShoppingList } from './buildShoppingList'
import { loadInCart, loadSelectedMeals, saveInCart, saveSelectedMeals } from './storage'
import MealsScreen from './MealsScreen'
import ShoppingScreen from './ShoppingScreen'

const appData = data as Data

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

export default function App() {
  const [screen, setScreen] = useState<'meals' | 'list'>('meals')
  const [selectedMeals, setSelectedMeals] = useState(() => loadSelectedMeals(appData))
  const [inCart, setInCart] = useState(() => loadInCart(appData))

  useEffect(() => saveSelectedMeals(selectedMeals), [selectedMeals])
  useEffect(() => saveInCart(inCart), [inCart])

  const sections = useMemo(
    () => buildShoppingList(selectedMeals, inCart, appData),
    [selectedMeals, inCart],
  )

  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-white shadow-sm dark:bg-zinc-900">
      {screen === 'meals' ? (
        <MealsScreen
          meals={appData.meals}
          selected={selectedMeals}
          onToggle={(id) => setSelectedMeals((s) => toggle(s, id))}
          onClear={() => setSelectedMeals([])}
          onShowList={() => setScreen('list')}
        />
      ) : (
        <ShoppingScreen
          sections={sections}
          onToggle={(id) => setInCart((c) => toggle(c, id))}
          onClearCart={() => setInCart([])}
          onBack={() => setScreen('meals')}
        />
      )}
    </div>
  )
}
