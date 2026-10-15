import { useEffect, useMemo, useState } from 'react'
import data from './data.json'
import type { Data, Meal, Product } from './types'
import { buildShoppingList } from './buildShoppingList'
import {
  loadCustomMeals,
  loadCustomProducts,
  loadInCart,
  loadRemoved,
  loadSelectedMeals,
  saveCustomMeals,
  saveCustomProducts,
  saveInCart,
  saveRemoved,
  saveSelectedMeals,
} from './storage'
import AddMealScreen from './AddMealScreen'
import MealsScreen from './MealsScreen'
import ShoppingScreen from './ShoppingScreen'

const baseData = data as Data

const mergeData = (products: Product[], meals: Meal[]): Data => ({
  categories: baseData.categories,
  products: [...baseData.products, ...products],
  meals: [...baseData.meals, ...meals],
})

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

export default function App() {
  const [screen, setScreen] = useState<'meals' | 'list' | 'add'>('meals')
  const [customProducts, setCustomProducts] = useState(() => loadCustomProducts(baseData))
  const [customMeals, setCustomMeals] = useState(loadCustomMeals)
  const appData = useMemo(() => mergeData(customProducts, customMeals), [customProducts, customMeals])
  const [selectedMeals, setSelectedMeals] = useState(() => loadSelectedMeals(appData))
  const [inCart, setInCart] = useState(() => loadInCart(appData))
  const [removed, setRemoved] = useState(() => loadRemoved(appData))

  useEffect(() => saveSelectedMeals(selectedMeals), [selectedMeals])
  useEffect(() => saveInCart(inCart), [inCart])
  useEffect(() => saveRemoved(removed), [removed])
  useEffect(() => saveCustomProducts(customProducts), [customProducts])
  useEffect(() => saveCustomMeals(customMeals), [customMeals])

  const sections = useMemo(
    () => buildShoppingList(selectedMeals, inCart, appData, removed),
    [selectedMeals, inCart, appData, removed],
  )

  const removedCount = useMemo(
    () =>
      buildShoppingList(selectedMeals, [], appData).reduce((n, sec) => n + sec.items.length, 0) -
      sections.reduce((n, sec) => n + sec.items.length, 0),
    [selectedMeals, appData, sections],
  )

  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-white shadow-sm dark:bg-zinc-900">
      {screen === 'add' ? (
        <AddMealScreen
          categories={appData.categories}
          products={appData.products}
          onCancel={() => setScreen('meals')}
          onSave={(meal, newProducts) => {
            setCustomProducts((p) => [...p, ...newProducts])
            setCustomMeals((m) => [...m, meal])
            setScreen('meals')
          }}
        />
      ) : screen === 'meals' ? (
        <MealsScreen
          meals={appData.meals}
          onAdd={() => setScreen('add')}
          selected={selectedMeals}
          onToggle={(id) => setSelectedMeals((s) => toggle(s, id))}
          onClear={() => {
            setSelectedMeals([])
            setRemoved([])
          }}
          onShowList={() => setScreen('list')}
        />
      ) : (
        <ShoppingScreen
          sections={sections}
          removedCount={removedCount}
          onRemove={(id) => setRemoved((r) => (r.includes(id) ? r : [...r, id]))}
          onRestore={() => setRemoved([])}
          onToggle={(id) => setInCart((c) => toggle(c, id))}
          onClearCart={() => setInCart([])}
          onBack={() => setScreen('meals')}
        />
      )}
    </div>
  )
}
