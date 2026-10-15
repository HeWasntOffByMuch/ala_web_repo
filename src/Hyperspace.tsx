import { useEffect, useRef } from 'react'

interface Star {
  a: number
  r: number
  big: boolean
  blue: boolean
}

/** Prędkość gwiazd w czasie (s od startu sekwencji): 0 = dryf, 1 = pełny skok. */
export function speedAt(t: number): number {
  if (t < 0.5) return 0.03
  if (t < 1.5) return 0.03 + (t - 0.5) * 0.09
  if (t < 3.0) {
    const k = (t - 1.5) / 1.5
    return 0.12 + 0.88 * k * k * k
  }
  if (t < 4) return 1 - 0.5 * (t - 3)
  return 0.5
}

/**
 * Pole gwiazd na canvasie. Gwiazdy lecą radialnie od środka, smugi rosną z prędkością.
 * Jedna ścieżka na kombinację (kolor × grubość), więc kilka wywołań stroke() na klatkę.
 */
export default function Hyperspace({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const g = canvas?.getContext('2d')
    if (!canvas || !g) return // brak canvasa: reszta sceny działa dalej

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const count = Math.min(340, Math.round((window.innerWidth * window.innerHeight) / 1800))
    const stars: Star[] = Array.from({ length: count }, () => ({
      a: Math.random() * Math.PI * 2,
      r: Math.random() ** 1.6,
      big: Math.random() < 0.22,
      blue: Math.random() < 0.7,
    }))

    const draw = (speed: number, dt: number) => {
      const cx = w / 2
      const cy = h * 0.42
      const R = Math.hypot(w, h) * 0.55
      g.clearRect(0, 0, w, h)
      const buckets = new Map<string, Path2D>()
      const trail = 0.015 + speed * 0.5
      for (const s of stars) {
        s.r += (0.02 + speed * 1.4) * (0.1 + s.r) * dt
        if (s.r > 1.1) {
          s.r = 0.01 + Math.random() * 0.05
          s.a = Math.random() * Math.PI * 2
        }
        const r0 = Math.max(0, s.r - trail * s.r)
        const cos = Math.cos(s.a)
        const sin = Math.sin(s.a)
        const key = `${s.blue ? 'b' : 'w'}${s.big ? 2 : 1}`
        let p = buckets.get(key)
        if (!p) buckets.set(key, (p = new Path2D()))
        p.moveTo(cx + cos * r0 * R, cy + sin * r0 * R)
        p.lineTo(cx + cos * s.r * R, cy + sin * s.r * R)
      }
      g.lineCap = 'round'
      for (const [key, p] of buckets) {
        g.strokeStyle = key[0] === 'b' ? 'rgba(120,190,255,0.85)' : 'rgba(240,248,255,0.9)'
        g.lineWidth = key[1] === '2' ? 2.2 : 1.1
        g.stroke(p)
      }
    }

    if (still) {
      draw(0.5, 0)
      return () => window.removeEventListener('resize', resize)
    }

    let raf = 0
    const start = performance.now()
    let last = start
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      draw(speedAt((now - start) / 1000), dt)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [still])

  return <canvas ref={ref} className="mc-canvas" aria-hidden />
}
