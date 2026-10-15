import { Component, useEffect, useMemo, useRef, type ReactNode } from 'react'
import Hyperspace from './Hyperspace'
import { Emblem, SpeakerIcon } from './icons'
import { Planet, ShipArt } from './MissionScene'
import { playMission } from './sound'

interface Props {
  muted: boolean
  onToggleMute: () => void
  /** Pomiń i zostań na liście. */
  onClose: () => void
  /** Wróć do ekranu posiłków. */
  onReturn: () => void
}

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Sequence({ muted, onToggleMute, onClose, onReturn }: Props) {
  const reduced = useMemo(prefersReducedMotion, [])
  const root = useRef<HTMLDivElement>(null)
  const skip = useRef<HTMLButtonElement>(null)
  const back = useRef<HTMLButtonElement>(null)

  // dźwięk: start raz przy montowaniu, stop przy pominięciu lub zamknięciu
  useEffect(() => {
    const handle = playMission(reduced)
    return () => handle.stop()
  }, [reduced])

  useEffect(() => {
    skip.current?.focus()
    // przycisk końcowy dostaje fokus, gdy się pojawi
    const id = window.setTimeout(() => back.current?.focus(), reduced ? 0 : 5500)
    return () => window.clearTimeout(id)
  }, [reduced])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return onClose()
    if (e.key !== 'Tab') return
    const items = [...(root.current?.querySelectorAll<HTMLElement>('button') ?? [])]
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div ref={root} className="mc" role="dialog" aria-modal="true" aria-label="Misja wykonana" onKeyDown={onKeyDown}>
      <div className="mc-shake">
        <Hyperspace still={reduced} />
        <div className="mc-glow" />
        <ShipArt className="mc-ship-jump" />
      </div>

      <div className="mc-confirm">
        <b>PRODUKTY ZEBRANE</b>
        <span className="label">Status misji: 100%</span>
      </div>
      <div className="mc-jump">
        <b>PRZYGOTOWANIE DO SKOKU</b>
        <div className="mc-lamps" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <div className="mc-scene">
        <Planet className="mc-planet" />
        <ShipArt className="mc-ship" />
      </div>
      <div className="mc-flash" />
      <div className="mc-vignette" />

      <div className="mc-win">
        <div>
          <h2 className="mc-h">
            <span className="l1">MISJA</span> <span className="l2">WYKONANA</span>
          </h2>
          <p className="mc-sub">Galaktyka została zaopatrzona</p>
        </div>
        <div className="mc-bottom">
          <div className="mc-badge">
            <Emblem className="emblem" />
            <div>
              <b>MISTRZ ZAOPATRZENIA</b>
              <span>WSZYSTKIE PRODUKTY ZDOBYTE W JEDNEJ MISJI</span>
            </div>
          </div>
          <div className="mc-go">
            <button ref={back} type="button" className="btn btn-primary" onClick={onReturn}>
              Powrót do bazy ›
            </button>
          </div>
        </div>
      </div>

      <div className="mc-top">
        <button type="button" className="btn btn-ghost" aria-pressed={muted} onClick={onToggleMute}>
          <SpeakerIcon muted={muted} /> {muted ? 'Dźwięk wył.' : 'Dźwięk wł.'}
        </button>
        <button ref={skip} type="button" className="btn btn-ghost" onClick={onClose}>
          Pomiń ✕
        </button>
      </div>
    </div>
  )
}

/** Gdy efekt się wysypie, zamykamy go, a aplikacja działa dalej. */
class Boundary extends Component<{ onFail: () => void; children: ReactNode }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFail()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function MissionComplete(props: Props) {
  return (
    <Boundary onFail={props.onClose}>
      <Sequence {...props} />
    </Boundary>
  )
}
