import type { ShoppingSection } from '../lib/buildShoppingList'
import { Button } from './Button'
import { CheckRow } from './CheckRow'
import { Screen } from './Screen'

interface ShoppingListScreenProps {
  sections: ShoppingSection[]
  onToggleProduct: (id: string) => void
  onClearCart: () => void
  onBack: () => void
}

export function ShoppingListScreen({ sections, onToggleProduct, onClearCart, onBack }: ShoppingListScreenProps) {
  const items = sections.flatMap((s) => s.items)
  const inCartCount = items.filter((i) => i.inCart).length

  return (
    <Screen
      title="Lista zakupów"
      status={`W koszyku: ${inCartCount}/${items.length}`}
      actions={
        <>
          <Button onClick={onClearCart} disabled={inCartCount === 0}>
            Wyczyść koszyk
          </Button>
          <Button variant="primary" onClick={onBack}>
            Wróć do posiłków
          </Button>
        </>
      }
    >
      {sections.length === 0 && <p className="px-4 py-8 text-center text-neutral-500">Brak produktów.</p>}
      {sections.map((section) => (
        <section key={section.category}>
          <h2 className="bg-neutral-100 px-4 py-2 text-xs font-semibold tracking-wide text-neutral-600 uppercase dark:bg-neutral-900 dark:text-neutral-400">
            {section.category}
          </h2>
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {section.items.map((item) => (
              <CheckRow
                key={item.id}
                label={item.name}
                checked={item.inCart}
                onToggle={() => onToggleProduct(item.id)}
                checkedStyle="strike"
              />
            ))}
          </ul>
        </section>
      ))}
    </Screen>
  )
}
