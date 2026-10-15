import { useId, useMemo } from 'react'

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const BOTTLE_COLORS = ['#e7a23d', '#3fb8a8', '#c4509a', '#7fcf92', '#e76b37', '#78beff', '#d6a45d']

/** Ściana za barem: łukowe wnęki z półkami i butelkami, wiszące lampy, ciepła poświata. */
export function BarBack({ className }: { className?: string }) {
  const u = useId().replace(/:/g, '')
  const shelves = useMemo(() => {
    const r = rng(5)
    return [70, 200, 330].map((cx, a) => {
      const bottles = [] as { x: number; y: number; w: number; h: number; c: string }[]
      for (const y of [330, 410]) {
        let x = cx - 52
        while (x < cx + 44) {
          const w = 9 + r() * 8
          const h = 22 + r() * 30
          bottles.push({ x, y: y - h, w, h, c: BOTTLE_COLORS[Math.floor(r() * BOTTLE_COLORS.length)] })
          x += w + 3 + r() * 4
        }
      }
      return { cx, a, bottles }
    })
  }, [])

  return (
    <svg className={className} viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`${u}wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1109" />
          <stop offset=".6" stopColor="#120a07" />
          <stop offset="1" stopColor="#0a0605" />
        </linearGradient>
        <radialGradient id={`${u}amber`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffb35c" stopOpacity=".75" />
          <stop offset="1" stopColor="#ffb35c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${u}niche`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2412" />
          <stop offset="1" stopColor="#140c07" />
        </linearGradient>
      </defs>
      <rect width="400" height="800" fill={`url(#${u}wall)`} />
      {/* poświata za półkami */}
      <ellipse cx="200" cy="360" rx="260" ry="190" fill={`url(#${u}amber)`} opacity=".35" />
      {shelves.map((s) => (
        <g key={s.cx}>
          <path d={`M${s.cx - 62} 440V270a62 62 0 0 1 124 0V440z`} fill={`url(#${u}niche)`} stroke="#c9873f" strokeOpacity=".55" strokeWidth="2" />
          <path d={`M${s.cx - 56} 434V272a56 56 0 0 1 112 0V434z`} fill="none" stroke="#000" strokeOpacity=".4" />
          <rect x={s.cx - 56} y="332" width="112" height="4" fill="#6b4524" />
          <rect x={s.cx - 56} y="412" width="112" height="4" fill="#6b4524" />
          {s.bottles.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.c} opacity=".9" />
              <rect x={b.x + b.w * 0.25} y={b.y - 7} width={b.w * 0.5} height="9" rx="2" fill={b.c} opacity=".9" />
              <rect x={b.x + 2} y={b.y + 3} width="2" height={b.h - 8} fill="#fff" opacity=".35" />
            </g>
          ))}
        </g>
      ))}
      {/* wiszące lampy */}
      {[46, 200, 354].map((x, i) => (
        <g key={x} className={`cn-lamp cn-lamp-${i}`}>
          <line x1={x} y1="0" x2={x} y2={48 + (i % 2) * 14} stroke="#6b4524" strokeWidth="1.5" />
          <circle cx={x} cy={74 + (i % 2) * 14} r="46" fill={`url(#${u}amber)`} />
          <path d={`M${x - 16} ${76 + (i % 2) * 14}a16 14 0 0 1 32 0z`} fill="#2a1a0e" stroke="#c9873f" strokeOpacity=".7" />
          <circle cx={x} cy={78 + (i % 2) * 14} r="5" fill="#ffe2b0" />
        </g>
      ))}
    </svg>
  )
}

/** Blat baru z przodu; zasłania dolną krawędź postaci. */
export function BarFront({ className }: { className?: string }) {
  const u = useId().replace(/:/g, '')
  return (
    <svg className={className} viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id={`${u}top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8672f" />
          <stop offset="1" stopColor="#5e3719" />
        </linearGradient>
        <linearGradient id={`${u}front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1810" />
          <stop offset="1" stopColor="#0d0705" />
        </linearGradient>
      </defs>
      <rect x="0" y="22" width="400" height="218" fill={`url(#${u}front)`} />
      <g stroke="#000" strokeOpacity=".45">
        {[50, 100, 150, 200, 250, 300, 350].map((x) => (
          <line key={x} x1={x} y1="36" x2={x} y2="240" />
        ))}
      </g>
      <rect x="0" y="0" width="400" height="26" fill={`url(#${u}top)`} />
      <rect x="0" y="0" width="400" height="3" fill="#ffd9a0" opacity=".6" />
      <rect x="0" y="26" width="400" height="3" fill="#e7a23d" opacity=".55" />
      {/* szklanki na blacie */}
      <g>
        <path d="M44 0l-4 -22h24l-4 22z" fill="#e7a23d" fillOpacity=".25" stroke="#ffe2b0" strokeOpacity=".7" />
        <path d="M43 -6h20l-1 6h-18z" fill="#e7a23d" opacity=".7" />
        <path d="M338 0l-3 -18h20l-3 18z" fill="#78beff" fillOpacity=".18" stroke="#d6ecff" strokeOpacity=".6" />
      </g>
    </svg>
  )
}
