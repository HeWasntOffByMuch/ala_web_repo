import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { BarBack, BarFront } from './assets/cantinaScene'
import { DURATIONS, POSES, SEQUENCE, preloadDrinker } from './assets/drinker'
import { Emblem, SpeakerIcon } from './icons'
import { pickPraise } from './praise'
import ShareButton from './ShareButton'
import { playCantina } from './sound'

interface Props {
  count: number
  muted: boolean
  onToggleMute: () => void
  onClose: () => void
  onReturn: () => void
}

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const START_DELAY = 900 // ms od startu sceny do pierwszego łyka
const LOOPS = 2 // dwa łyki zamykają się w długości muzyki (~7 s)

/**
 * Sterownik animacji: kolejka timerów, w pełni anulowana przy odmontowaniu lub zmianie `active`.
 * Zwraca indeks aktualnej klatki. Po ostatnim cyklu zostaje klatka 0.
 */
function useDrinker(active: boolean): number {
  const [pose, setPose] = useState(0)
  useEffect(() => {
    if (!active) {
      setPose(0)
      return
    }
    const timers: number[] = []
    let t = START_DELAY
    for (let loop = 0; loop < LOOPS; loop++) {
      SEQUENCE.forEach((p, i) => {
        timers.push(window.setTimeout(() => setPose(p), t))
        t += DURATIONS[i]
      })
      t += 150
    }
    return () => timers.forEach(window.clearTimeout)
  }, [active])
  return pose
}

function Sequence({ count, muted, onToggleMute, onClose, onReturn }: Props) {
  const systemReduced = useMemo(prefersReducedMotion, [])
  const [full, setFull] = useState(false)
  const reduced = systemReduced && !full
  const [praise] = useState(pickPraise)
  const root = useRef<HTMLDivElement>(null)
  const skip = useRef<HTMLButtonElement>(null)
  const back = useRef<HTMLButtonElement>(null)
  const pose = useDrinker(!reduced)

  useEffect(() => {
    preloadDrinker()
    const handle = playCantina()
    return () => handle.stop()
  }, [])

  useEffect(() => {
    skip.current?.focus()
    const id = window.setTimeout(() => back.current?.focus(), reduced ? 0 : 2400)
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
    <div
      ref={root}
      className={`cn ${full ? 'cn-full' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Na zdrowie, Johnny"
      onKeyDown={onKeyDown}
    >
      <BarBack className="cn-back" />
      <div className="cn-haze" />

      <div className="cn-title">
        <h2 className="mc-h">
          <span className="l1">NA ZDROWIE,</span> <span className="l2">JOHNNY!</span>
        </h2>
        <p className="mc-sub">Zakupy zrobione</p>
      </div>

      <div className={`cn-figure ${pose === 0 ? 'idle' : ''} ${pose === 3 ? 'sip' : ''}`}>
        {POSES.map((src, i) => (
          <img key={i} src={src} alt="" className={i === pose ? 'active' : ''} draggable={false} />
        ))}
      </div>

      <BarFront className="cn-front" />

      <div className="cn-bottom">
        <p className="mc-praise cn-praise">{praise}</p>
        {reduced && (
          <button type="button" className="btn btn-ghost mc-fullbtn" onClick={() => setFull(true)}>
            Pokaż pełną animację
          </button>
        )}
        <div className="cn-share">
          <ShareButton count={count} praise={praise} variant="cantina" prepareAfter={1200} />
        </div>
        <div className="cn-go">
          <button ref={back} type="button" className="btn btn-primary" onClick={onReturn}>
            Powrót do bazy ›
          </button>
        </div>
      </div>

      <div className="mc-top">
        <button type="button" className="btn btn-ghost" aria-pressed={muted} onClick={onToggleMute}>
          <SpeakerIcon muted={muted} /> {muted ? 'Dźwięk wył.' : 'Dźwięk wł.'}
        </button>
        <Emblem className="emblem cn-emblem" />
        <button ref={skip} type="button" className="btn btn-ghost" onClick={onClose}>
          Pomiń ✕
        </button>
      </div>
    </div>
  )
}

/** Gdy scena się wysypie, zamykamy ją, a aplikacja działa dalej. */
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

export default function CantinaComplete(props: Props) {
  return (
    <Boundary onFail={props.onClose}>
      <Sequence {...props} />
    </Boundary>
  )
}
