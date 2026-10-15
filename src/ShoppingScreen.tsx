import type { ShoppingSection } from './types'
import { footerClass, headerClass, primaryButton, rowClass, secondaryButton } from './ui'

interface Props {
  sections: ShoppingSection[]
  onToggle: (id: string) => void
  onClearCart: () => void
  onBack: () => void
}

export default function ShoppingScreen({ sections, onToggle, onClearCart, onBack }: Props) {
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
                <li key={item.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.inCart}
                    onClick={() => onToggle(item.id)}
                    className={`${rowClass} ${
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
                </li>
              ))}
            </ul>
          </section>
        ))}
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
