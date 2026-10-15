import { useEffect, useMemo, useRef, useState } from 'react'
import data from './data.json'
import type { Data, Meal, Product } from './types'
import { buildShoppingList, countItems, isComplete } from './buildShoppingList'
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
import MissionComplete from './MissionComplete'
import ShoppingScreen from './ShoppingScreen'
import { isMuted, playCheck, setMuted, unlockAudio } from './sound'

const baseData = data as Data

const mergeData = (products: Product[], meals: Meal[]): Data => ({
  categories: baseData.categories,
  products: [...baseData.products, ...products],
  meals: [...baseData.meals, ...meals],
})

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

const buzz = (ms: number) => {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* opcjonalne */
  }
}

export default function App() {
  const [screen, setScreen] = useState<'meals' | 'list' | 'add'>('meals')
  const [customProducts, setCustomProducts] = useState(() => loadCustomProducts(baseData))
  const [customMeals, setCustomMeals] = useState(loadCustomMeals)
  const appData = useMemo(() => mergeData(customProducts, customMeals), [customProducts, customMeals])
  const [selectedMeals, setSelectedMeals] = useState(() => loadSelectedMeals(appData))
  const [inCart, setInCart] = useState(() => loadInCart(appData))
  const [removed, setRemoved] = useState(() => loadRemoved(appData))
  const [muted, setMutedState] = useState(isMuted)
  const [celebrating, setCelebrating] = useState(false)
  // true od chwili ukończenia listy do momentu, gdy znów pojawi się coś do kupienia
  const celebrated = useRef(false)

  useEffect(() => saveSelectedMeals(selectedMeals), [selectedMeals])
  useEffect(() => saveInCart(inCart), [inCart])
  useEffect(() => saveRemoved(removed), [removed])
  useEffect(() => saveCustomProducts(customProducts), [customProducts])
  useEffect(() => saveCustomMeals(customMeals), [customMeals])

  const sections = useMemo(
    () => buildShoppingList(selectedMeals, inCart, appData, removed),
    [selectedMeals, inCart, appData, removed],
  )
  const { total, done, remaining } = countItems(sections)
  const complete = isComplete(sections)

  useEffect(() => {
    if (remaining > 0 || total === 0) celebrated.current = false
  }, [remaining, total])

  const removedCount = useMemo(
    () => countItems(buildShoppingList(selectedMeals, [], appData)).total - total,
    [selectedMeals, appData, total],
  )

  const toggleMuted = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
    if (!next) unlockAudio()
  }

  const toggleInCart = (id: string) => {
    unlockAudio()
    const adding = !inCart.includes(id)
    const next = toggle(inCart, id)
    setInCart(next)
    playCheck(adding)
    buzz(adding ? 12 : 6)
    // ukończenie wywołuje sekwencję tylko przez odhaczenie i tylko raz na sesję
    if (adding && !celebrated.current && isComplete(buildShoppingList(selectedMeals, next, appData, removed))) {
      celebrated.current = true
      setCelebrating(true)
    }
  }

  return (
    <div className="shell brackets">
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
          selected={selectedMeals}
          muted={muted}
          onToggleMute={toggleMuted}
          onAdd={() => setScreen('add')}
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
          done={done}
          total={total}
          complete={complete}
          muted={muted}
          onToggleMute={toggleMuted}
          removedCount={removedCount}
          onRemove={(id) => setRemoved((r) => (r.includes(id) ? r : [...r, id]))}
          onRestore={() => setRemoved([])}
          onToggle={toggleInCart}
          onClearCart={() => setInCart([])}
          onBack={() => setScreen('meals')}
          onReplay={() => {
            unlockAudio()
            setCelebrating(true)
          }}
        />
      )}
      {celebrating && (
        <MissionComplete
          muted={muted}
          onToggleMute={toggleMuted}
          onClose={() => setCelebrating(false)}
          onReturn={() => {
            setCelebrating(false)
            setScreen('meals')
          }}
        />
      )}
    </div>
  )
}
