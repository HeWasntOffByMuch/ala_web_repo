import type { ShoppingSection } from './types'
import { footerClass, headerClass, primaryButton, rowClass, secondaryButton } from './ui'

interface Props {
  sections: ShoppingSection[]
  removedCount: number
  onRemove: (id: string) => void
  onRestore: () => void
  onToggle: (id: string) => void
  onClearCart: () => void
  onBack: () => void
}

export default function ShoppingScreen({ sections, removedCount, onRemove, onRestore, onToggle, onClearCart, onBack }: Props) {
  return (
    <>
      <header className={headerClass}>
        <h1>Lista zakupów</h1>
      </header>
      <div className="flex-1">
        {sections.map((section) => (
          <section key={section.category}>
            <h2 className="bg-zinc-100 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {section.category}
            </h2>
            <ul>
              {section.items.map((item) => (
                <li key={item.id} className="flex">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.inCart}
                    onClick={() => onToggle(item.id)}
                    className={`${rowClass} flex-1 ${
                      item.inCart ? 'text-zinc-400 line-through dark:text-zinc-600' : ''
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex size-6 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                        item.inCart
                          ? 'border-zinc-400 bg-zinc-400 text-white dark:border-zinc-600 dark:bg-zinc-600'
                          : 'border-zinc-400 dark:border-zinc-600'
                      }`}
                    >
                      {item.inCart && '✓'}
                    </span>
                    {item.name}
                  </button>
                  <button
                    type="button"
                    aria-label={`Usuń ${item.name}`}
                    onClick={() => onRemove(item.id)}
                    className="min-h-12 w-14 shrink-0 border-b border-zinc-200 text-xl text-zinc-400 dark:border-zinc-800 dark:text-zinc-500"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {sections.length === 0 && (
          <p className="p-4 text-zinc-500 dark:text-zinc-400">Lista jest pusta.</p>
        )}
        {removedCount > 0 && (
          <button
            type="button"
            onClick={onRestore}
            className="min-h-12 w-full px-4 text-left text-base text-green-700 dark:text-green-400"
          >
            Przywróć usunięte ({removedCount})
          </button>
        )}
      </div>
      <div className={footerClass}>
        <button type="button" className={secondaryButton} onClick={onClearCart}>
          Wyczyść koszyk
        </button>
        <button type="button" className={primaryButton} onClick={onBack}>
          Wróć do posiłków
        </button>
      </div>
    </>
  )
}
