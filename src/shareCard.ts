import { POSES } from './assets/drinker'
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

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/** Karta „na zdrowie" w stylu kantyny: półki z butelkami, postać z szklanką, podpis. */
export async function renderCantinaCard({ count, praise }: { count: number; praise: string }): Promise<Blob | null> {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const g = canvas.getContext('2d')
    if (!g) return null
    await Promise.all(
      ['700 120px Oswald', '600 40px "Barlow Semi Condensed"'].map((f) => document.fonts?.load(f).catch(() => {})),
    )
    const bg = g.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#1d1109')
    bg.addColorStop(1, '#0a0605')
    g.fillStyle = bg
    g.fillRect(0, 0, W, H)
    const glow = g.createRadialGradient(W / 2, 640, 0, W / 2, 640, 620)
    glow.addColorStop(0, 'rgba(255,179,92,.38)')
    glow.addColorStop(1, 'rgba(255,179,92,0)')
    g.fillStyle = glow
    g.fillRect(0, 0, W, H)

    // półki z butelkami
    const cols = ['#e7a23d', '#3fb8a8', '#c4509a', '#7fcf92', '#e76b37', '#78beff', '#d6a45d']
    let s = 3
    const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296)
    for (const cx of [190, 540, 890]) {
      g.fillStyle = '#2a190c'
      g.strokeStyle = 'rgba(201,135,63,.55)'
      g.lineWidth = 4
      g.beginPath()
      g.moveTo(cx - 150, 1000)
      g.lineTo(cx - 150, 560)
      g.arc(cx, 560, 150, Math.PI, 0)
      g.lineTo(cx + 150, 1000)
      g.closePath()
      g.fill()
      g.stroke()
      for (const y of [700, 900]) {
        g.fillStyle = '#6b4524'
        g.fillRect(cx - 140, y, 280, 10)
        let x = cx - 134
        while (x < cx + 110) {
          const w = 24 + rnd() * 20
          const h = 56 + rnd() * 80
          g.fillStyle = cols[Math.floor(rnd() * cols.length)]
          g.globalAlpha = 0.9
          g.fillRect(x, y - h, w, h)
          g.fillRect(x + w * 0.25, y - h - 18, w * 0.5, 20)
          g.globalAlpha = 1
          x += w + 8 + rnd() * 10
        }
      }
    }

    const shade = g.createLinearGradient(0, 0, 0, H)
    shade.addColorStop(0, 'rgba(10,6,5,.85)')
    shade.addColorStop(0.3, 'rgba(10,6,5,0)')
    shade.addColorStop(0.7, 'rgba(10,6,5,0)')
    shade.addColorStop(1, 'rgba(10,6,5,.9)')
    g.fillStyle = shade
    g.fillRect(0, 0, W, H)

    // postać (klatka z łykiem), dolna krawędź schowana za blatem
    const img = await loadImage(POSES[3])
    if (img) {
      const ph = 760
      const pw = (img.width / img.height) * ph
      g.shadowColor = 'rgba(0,0,0,.7)'
      g.shadowBlur = 40
      g.drawImage(img, (W - pw) / 2, 1070 - ph, pw, ph)
      g.shadowBlur = 0
    }
    // blat
    const top = g.createLinearGradient(0, 1070, 0, 1100)
    top.addColorStop(0, '#a8672f')
    top.addColorStop(1, '#5e3719')
    g.fillStyle = '#1a0f09'
    g.fillRect(0, 1070, W, H - 1070)
    g.fillStyle = top
    g.fillRect(0, 1070, W, 32)
    g.fillStyle = 'rgba(255,217,160,.6)'
    g.fillRect(0, 1070, W, 4)

    g.textAlign = 'center'
    g.textBaseline = 'alphabetic'
    const ls = (px: number) => {
      ;(g as unknown as { letterSpacing: string }).letterSpacing = `${px}px`
    }
    ls(0)
    g.font = '700 150px Oswald, Impact, sans-serif'
    g.fillStyle = '#f0e2c5'
    g.fillText('NA ZDROWIE,', W / 2, 190)
    g.fillStyle = '#e76b37'
    g.shadowColor = 'rgba(231,107,55,.45)'
    g.shadowBlur = 36
    g.fillText('JOHNNY!', W / 2, 340)
    g.shadowBlur = 0
    ls(9)
    g.font = '600 34px "Barlow Semi Condensed", sans-serif'
    g.fillStyle = '#d6a45d'
    g.fillText('ZAKUPY ZROBIONE', W / 2, 396)
    ls(0)

    g.font = '600 46px "Barlow Semi Condensed", sans-serif'
    g.fillStyle = '#f0e2c5'
    const lines = wrap(g, praise, 880)
    lines.forEach((l, i) => g.fillText(l, W / 2, 1170 + i * 56))
    ls(4)
    g.font = '600 30px "Barlow Semi Condensed", sans-serif'
    g.fillStyle = '#a39a86'
    g.fillText(
      `${NAME.toUpperCase()} · ${count} ${produkty(count).toUpperCase()} W KOSZYKU · ${new Date().toLocaleDateString('pl-PL')}`,
      W / 2,
      1170 + lines.length * 56 + 44,
    )
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  } catch {
    return null
  }
}
