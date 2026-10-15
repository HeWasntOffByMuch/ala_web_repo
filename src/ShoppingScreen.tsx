import type { ShoppingSection } from './types'
import { CheckIcon, Emblem, Skyline } from './icons'
import SoundToggle from './SoundToggle'
import { collapseOnScroll } from './collapseOnScroll'

interface Props {
  sections: ShoppingSection[]
  done: number
  total: number
  complete: boolean
  muted: boolean
  onToggleMute: () => void
  removedCount: number
  onRemove: (id: string) => void
  onRestore: () => void
  onToggle: (id: string) => void
  onClearCart: () => void
  onBack: () => void
}

export default function ShoppingScreen({
  sections,
  done,
  total,
  complete,
  muted,
  onToggleMute,
  removedCount,
  onRemove,
  onRestore,
  onToggle,
  onClearCart,
  onBack,
}: Props) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const bar = (
    <div
      className={`prog ${complete ? 'done' : ''}`}
      role="progressbar"
      aria-label="Status misji"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="prog-fill" style={{ width: `${pct}%` }} />
    </div>
  )

  return (
    <>
      <header className="hdr">
        <div className="hdr-row">
          <Emblem className="emblem" style={{ width: 44, height: 44 }} />
          <div className="title-block">
            <h1 className="title" style={{ fontSize: 22, whiteSpace: 'nowrap' }}>
              Lista zaopatrzenia
            </h1>
            <p className="label">
              Zebrane: {done} / {total}
            </p>
          </div>
          <span className={`pct ${complete ? 'done' : ''}`}>{pct}%</span>
        </div>
        {bar}
      </header>

      <main className="main" onScroll={collapseOnScroll}>
        <div className="shopping-grid">
          <aside className="panel brackets" aria-label="Status misji">
            <div className="hdr-row">
              <span className="label">Status misji</span>
              <span className={`pct ${complete ? 'done' : ''}`}>{pct}%</span>
              <SoundToggle muted={muted} onToggle={onToggleMute} />
            </div>
            {bar}
            <div className="readouts">
              <div className="readout">
                <span className="label">Zebrane zasoby</span>
                <b>{done}</b>
              </div>
              <div className="readout">
                <span className="label">Pozostałe produkty</span>
                <b>{total - done}</b>
              </div>
            </div>
            <div className={`lamps ${complete ? 'done' : ''}`} aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={`lamp ${complete || i < Math.ceil(pct / 20) ? 'on' : ''} ${!complete && i === Math.ceil(pct / 20) - 1 ? 'blink' : ''}`} />
              ))}
            </div>
          </aside>

          <div className="sections">
            {sections.map((section) => (
              <section key={section.category}>
                <div className="sec-head">
                  <h2>{section.category}</h2>
                  <span className="sec-count">
                    {section.items.filter((i) => i.inCart).length}/{section.items.length}
                  </span>
                </div>
                <ul className="rows" style={{ paddingBlock: 4 }}>
                  {section.items.map((item) => (
                    <li key={item.id} className="item-wrap">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={item.inCart}
                        onClick={() => onToggle(item.id)}
                        className="row item"
                      >
                        <span className="chk" aria-hidden>
                          <CheckIcon />
                        </span>
                        <span className="row-name">{item.name}</span>
                      </button>
                      <button
                        type="button"
                        className="x-btn"
                        aria-label={`Usuń ${item.name}`}
                        onClick={() => onRemove(item.id)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {sections.length === 0 && <p className="empty">Lista jest pusta.</p>}
            {removedCount > 0 && (
              <button type="button" className="link-btn" onClick={onRestore}>
                Przywróć usunięte ({removedCount})
              </button>
            )}
          </div>
        </div>
        <Skyline className="horizon" />
      </main>

      <div className="dock">
        <button type="button" className="btn" onClick={onClearCart}>
          Wyczyść koszyk
        </button>
        <button type="button" className="btn btn-primary" onClick={onBack}>
          Wróć do posiłków
        </button>
      </div>
    </>
  )
}
