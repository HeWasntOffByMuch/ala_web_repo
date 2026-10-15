import { NAME, produkty } from './praise'

const W = 1080
const H = 1350

async function drawSvg(
  g: CanvasRenderingContext2D,
  el: Element | null | undefined,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  if (!el) return
  try {
    const clone = el.cloneNode(true) as SVGElement
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('width', String(w))
    clone.setAttribute('height', String(h))
    const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone))
    const img = new Image()
    img.src = src
    await img.decode()
    g.drawImage(img, x, y, w, h)
  } catch {
    /* karta bez tej grafiki jest nadal poprawna */
  }
}

function wrap(g: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (g.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

interface CardInput {
  count: number
  praise: string
  planet?: Element | null
  ship?: Element | null
}

/** Rysuje kartę „zakupy zrobione" (PNG) do wysłania. Zwraca null, jeśli canvas nie działa. */
export async function renderCard({ count, praise, planet, ship }: CardInput): Promise<Blob | null> {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const g = canvas.getContext('2d')
    if (!g) return null

    await Promise.all(
      ['700 120px Oswald', '600 40px "Barlow Semi Condensed"'].map((f) => document.fonts?.load(f).catch(() => {})),
    )

    g.fillStyle = '#02040a'
    g.fillRect(0, 0, W, H)
    const glow = g.createRadialGradient(W / 2, 560, 0, W / 2, 560, 700)
    glow.addColorStop(0, 'rgba(60,130,255,.45)')
    glow.addColorStop(1, 'rgba(60,130,255,0)')
    g.fillStyle = glow
    g.fillRect(0, 0, W, H)

    // smugi hiperprzestrzeni
    let s = 7
    const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296)
    g.lineCap = 'round'
    for (let i = 0; i < 170; i++) {
      const a = rnd() * Math.PI * 2
      const r0 = 120 + rnd() * 520
      const len = 30 + rnd() * 160
      g.strokeStyle = rnd() < 0.7 ? 'rgba(120,190,255,.8)' : 'rgba(240,248,255,.85)'
      g.lineWidth = 1 + rnd() * 2.4
      g.beginPath()
      g.moveTo(W / 2 + Math.cos(a) * r0, 560 + Math.sin(a) * r0)
      g.lineTo(W / 2 + Math.cos(a) * (r0 + len), 560 + Math.sin(a) * (r0 + len))
      g.stroke()
    }

    await drawSvg(g, planet, 0, 560, W, 790)
    await drawSvg(g, ship, 90, 510, 900, 429)

    const shade = g.createLinearGradient(0, 0, 0, H)
    shade.addColorStop(0, 'rgba(2,4,10,.85)')
    shade.addColorStop(0.28, 'rgba(2,4,10,0)')
    shade.addColorStop(0.62, 'rgba(2,4,10,0)')
    shade.addColorStop(1, 'rgba(2,4,10,.88)')
    g.fillStyle = shade
    g.fillRect(0, 0, W, H)

    g.textAlign = 'center'
    g.textBaseline = 'alphabetic'
    const ls = (px: number) => {
      ;(g as unknown as { letterSpacing: string }).letterSpacing = `${px}px`
    }
    ls(0)
    g.font = '700 210px Oswald, Impact, sans-serif'
    g.fillStyle = '#f0e2c5'
    g.fillText('MISJA', W / 2, 205)
    g.fillStyle = '#e76b37'
    g.shadowColor = 'rgba(231,107,55,.45)'
    g.shadowBlur = 40
    g.fillText('WYKONANA', W / 2, 410)
    g.shadowBlur = 0
    ls(9)
    g.font = '600 34px "Barlow Semi Condensed", sans-serif'
    g.fillStyle = '#f0e2c5'
    g.fillText('GALAKTYKA ZOSTAŁA ZAOPATRZONA', W / 2, 468)
    ls(0)

    g.font = '600 54px "Barlow Semi Condensed", sans-serif'
    g.fillStyle = '#f0e2c5'
    const lines = wrap(g, praise, 880)
    lines.forEach((l, i) => g.fillText(l, W / 2, 1040 + i * 66))
    const y = 1040 + lines.length * 66 + 30

    ls(2)
    g.font = '600 62px Oswald, Impact, sans-serif'
    g.fillStyle = '#d6a45d'
    g.fillText('MISTRZ ZAOPATRZENIA', W / 2, y + 30)
    ls(4)
    g.font = '600 32px "Barlow Semi Condensed", sans-serif'
    g.fillStyle = '#a39a86'
    const date = new Date().toLocaleDateString('pl-PL')
    g.fillText(`${NAME.toUpperCase()} · ${count} ${produkty(count).toUpperCase()} W KOSZYKU · ${date}`, W / 2, y + 90)

    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  } catch {
    return null
  }
}

export type ShareResult = 'shared' | 'cancelled' | 'fallback'

/** Arkusz udostępniania z obrazkiem, potem sam tekst, na końcu pobranie i kopia tekstu. */
export async function shareCompletion(blob: Blob | null, text: string): Promise<ShareResult> {
  const file = blob ? new File([blob], 'zakupy-zrobione.png', { type: 'image/png' }) : null
  try {
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text, title: 'Zakupy zrobione' })
      return 'shared'
    }
    if (navigator.share) {
      await navigator.share({ text, title: 'Zakupy zrobione' })
      return 'shared'
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled'
  }
  try {
    if (blob) {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'zakupy-zrobione.png'
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 2000)
    }
  } catch {
    /* pobranie jest opcjonalne */
  }
  try {
    await navigator.clipboard?.writeText(text)
  } catch {
    /* kopiowanie jest opcjonalne */
  }
  return 'fallback'
}
