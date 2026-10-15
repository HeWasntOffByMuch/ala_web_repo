import { useEffect, useRef, useState } from 'react'
import { Planet } from './assets/planets'
import { Ship } from './assets/ships'
import { pickScene, type Scene } from './assets/scene'
import { doneMessage, pickPraise } from './praise'
import { renderCard, shareCompletion, type ShareResult } from './shareCard'

const MESSAGES: Record<ShareResult, string> = {
  shared: 'Gotowe, wiadomość poszła.',
  cancelled: '',
  fallback:
    'Udostępnianie nie działa na tym urządzeniu. Obrazek został pobrany, a tekst skopiowany, o ile przeglądarka na to pozwala.',
}

interface Props {
  count: number
  praise?: string
  /** Statek i planeta na karcie; domyślnie losowe. */
  scene?: Scene
  /** Po jakim czasie przygotować obrazek w tle (ms), żeby nie dławić animacji. */
  prepareAfter?: number
  className?: string
}

export default function ShareButton({ count, praise, scene, prepareAfter = 0, className = 'btn' }: Props) {
  const [text] = useState(praise ?? pickPraise)
  const [own] = useState(() => scene ?? pickScene())
  const [staging, setStaging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const box = useRef<HTMLDivElement>(null)
  const job = useRef<Promise<Blob | null> | null>(null)
  const resolve = useRef<(b: Blob | null) => void>(() => {})

  // Obrazek powstaje z wyprzedzeniem, żeby kliknięcie od razu otwierało arkusz udostępniania.
  const prepare = () => {
    if (!job.current) {
      job.current = new Promise((res) => (resolve.current = res))
      setStaging(true)
    }
    return job.current
  }

  useEffect(() => {
    const id = window.setTimeout(prepare, prepareAfter)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!staging) return
    const svgs = box.current?.querySelectorAll('svg')
    void renderCard({ count, praise: text, planet: svgs?.[0], ship: svgs?.[1] }).then((blob) => {
      resolve.current(blob)
      setStaging(false)
    })
  }, [staging, count, text])

  const onClick = async () => {
    setBusy(true)
    setStatus('')
    const blob = await prepare()
    const result = await shareCompletion(blob, doneMessage(count))
    setStatus(MESSAGES[result])
    setBusy(false)
  }

  return (
    <>
      <button type="button" className={className} disabled={busy} onClick={onClick}>
        Wyślij żonie screena
      </button>
      <p className="share-status" role="status">
        {status}
      </p>
      {staging && (
        <div ref={box} aria-hidden style={{ position: 'absolute', left: -9999, top: 0, width: 1, height: 1, overflow: 'hidden' }}>
          <Planet kind={own.planet} />
          <Ship kind={own.ship} />
        </div>
      )}
    </>
  )
}
