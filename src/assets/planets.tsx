import { useId, useMemo, type ReactNode } from 'react'

export type PlanetKind = 'potato' | 'desert' | 'ice' | 'forest' | 'swamp' | 'lava'
export const PLANETS: PlanetKind[] = ['potato', 'desert', 'ice', 'forest', 'swamp', 'lava']

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const PCX = 400
const PCY = 700
const PRX = 570
const PRY = 500
const edgeY = (x: number) => PCY - PRY * Math.sqrt(Math.max(0, 1 - ((x - PCX) / PRX) ** 2))

interface Theme {
  stops: [string, string, string, string]
  tint: string // macierz koloru ziarna
  glow: string
  rim: string
  horizon: string
  horizonStroke: string
  seed: number
}

const THEMES: Record<PlanetKind, Theme> = {
  potato: { stops: ['#f0c27a', '#c98b46', '#7d4d22', '#2a160a'], tint: '.25 .13 .05', glow: '#ff8a3d', rim: '#bfe0ff', horizon: '#0a0806', horizonStroke: '#ff8a3d', seed: 11 },
  desert: { stops: ['#ffd99a', '#e0a35b', '#a35f2a', '#3a1d0d'], tint: '.45 .25 .1', glow: '#ffb35c', rim: '#ffe2b0', horizon: '#120a05', horizonStroke: '#ffb35c', seed: 21 },
  ice: { stops: ['#ffffff', '#cfe6f5', '#7fa6c4', '#1c2f45'], tint: '.8 .9 1', glow: '#78beff', rim: '#e8f6ff', horizon: '#07101a', horizonStroke: '#78beff', seed: 31 },
  forest: { stops: ['#5f9a58', '#2f6b3a', '#173d24', '#06130b'], tint: '.05 .25 .08', glow: '#7fcf92', rim: '#c9f5d4', horizon: '#040b06', horizonStroke: '#7fcf92', seed: 41 },
  swamp: { stops: ['#8b8a4e', '#566033', '#2c3520', '#0a0e08'], tint: '.2 .25 .08', glow: '#b8c46a', rim: '#d9e0a0', horizon: '#050704', horizonStroke: '#b8c46a', seed: 51 },
  lava: { stops: ['#5a3a34', '#2b1b19', '#120a09', '#050303'], tint: '.32 .09 .04', glow: '#ff5a1f', rim: '#ff8a56', horizon: '#050303', horizonStroke: '#ff5a1f', seed: 61 },
}

const jag = (r: () => number, x: number, y: number, steps: number, step: number) => {
  let d = `M${x} ${y}`
  for (let i = 0; i < steps; i++) {
    x += (r() - 0.5) * step * 1.6
    y += r() * step * 0.9 + 3
    d += `L${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

/** Elementy nieba, nad linią horyzontu. */
function Sky({ kind, u }: { kind: PlanetKind; u: string }) {
  switch (kind) {
    case 'potato':
      return (
        <>
          <circle cx="96" cy="118" r="30" fill={`url(#${u}moon)`} />
          <circle cx="84" cy="108" r="6" fill="#3d2a1a" opacity=".5" />
          <circle cx="108" cy="130" r="4" fill="#3d2a1a" opacity=".5" />
          <circle cx="170" cy="172" r="13" fill={`url(#${u}moon)`} opacity=".85" />
          <circle cx="690" cy="90" r="8" fill="#e8c897" opacity=".8" />
        </>
      )
    case 'desert':
      return (
        <>
          <circle cx="610" cy="130" r="70" fill={`url(#${u}sun1)`} />
          <circle cx="610" cy="130" r="25" fill="#fff0c4" />
          <circle cx="668" cy="162" r="48" fill={`url(#${u}sun2)`} />
          <circle cx="668" cy="162" r="16" fill="#ffc78a" />
        </>
      )
    case 'ice':
      return (
        <>
          <circle cx="120" cy="110" r="26" fill={`url(#${u}moon)`} />
          <circle cx="132" cy="104" r="5" fill="#425a73" opacity=".5" />
          <circle cx="660" cy="80" r="6" fill="#e8f6ff" opacity=".85" />
        </>
      )
    case 'forest':
      return (
        <>
          <circle cx="640" cy="150" r="95" fill={`url(#${u}giant)`} />
          <g fill="none" stroke="#7a3d1c" strokeOpacity=".5" strokeWidth="6">
            <path d="M560 128q80 -14 160 0M552 150q88 -10 176 0M560 174q80 -8 160 2" />
          </g>
          <circle cx="150" cy="130" r="9" fill="#e8f0d8" opacity=".8" />
        </>
      )
    case 'swamp':
      return (
        <>
          <circle cx="620" cy="110" r="34" fill="#e7ecc0" opacity=".85" />
          <circle cx="620" cy="110" r="62" fill="#e7ecc0" opacity=".12" />
        </>
      )
    case 'lava':
      return <circle cx="130" cy="120" r="90" fill={`url(#${u}ember)`} />
  }
}

/** Cechy powierzchni, przycięte do kształtu planety. */
function Surface({ kind, r }: { kind: PlanetKind; r: () => number }) {
  const items = useMemo((): ReactNode => {
    switch (kind) {
      case 'potato':
        return Array.from({ length: 16 }, (_, i) => {
          const x = 130 + r() * 540
          const e = { x, y: edgeY(x) + 40 + r() * 190, rx: 9 + r() * 24, ry: 4 + r() * 9, rot: -20 + r() * 40 }
          return (
            <g key={i} transform={`rotate(${e.rot} ${e.x} ${e.y})`}>
              <ellipse cx={e.x} cy={e.y} rx={e.rx} ry={e.ry} fill="#4b2c12" opacity=".75" />
              <path d={`M${e.x - e.rx} ${e.y}a${e.rx} ${e.ry} 0 0 1 ${e.rx * 2} 0`} fill="none" stroke="#f5d79d" strokeOpacity=".5" strokeWidth="1.5" />
            </g>
          )
        })
      case 'desert':
        return Array.from({ length: 10 }, (_, i) => {
          const y = 250 + i * 26 + r() * 8
          const amp = 14 + r() * 18
          return (
            <g key={i} fill="none">
              <path d={`M-20 ${y}Q200 ${y - amp} 400 ${y}T820 ${y}`} stroke="#6b3a14" strokeOpacity=".4" strokeWidth="4" />
              <path d={`M-20 ${y - 5}Q200 ${y - amp - 5} 400 ${y - 5}T820 ${y - 5}`} stroke="#ffe2b0" strokeOpacity=".35" strokeWidth="2" />
            </g>
          )
        })
      case 'ice':
        return Array.from({ length: 14 }, (_, i) => (
          <path key={i} d={jag(r, 80 + r() * 640, edgeY(400) + 10 + r() * 60, 7, 24)} fill="none" stroke="#3f7aa6" strokeOpacity=".65" strokeWidth={1 + r() * 1.6} />
        ))
      case 'forest':
        return Array.from({ length: 150 }, (_, i) => {
          const x = 20 + r() * 760
          const y = edgeY(x) + 6 + r() * 210
          const c = ['#143822', '#1f4a2c', '#3b7a43', '#0b2415'][Math.floor(r() * 4)]
          return <circle key={i} cx={x} cy={y} r={5 + r() * 13} fill={c} opacity=".75" />
        })
      case 'swamp':
        return (
          <>
            {Array.from({ length: 11 }, (_, i) => {
              const x = 110 + r() * 580
              const y = edgeY(x) + 30 + r() * 170
              const rx = 24 + r() * 60
              return (
                <g key={i}>
                  <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.22} fill="#141a0d" opacity=".85" />
                  <ellipse cx={x} cy={y - 1} rx={rx} ry={rx * 0.22} fill="none" stroke="#c5cf7a" strokeOpacity=".35" />
                </g>
              )
            })}
            {Array.from({ length: 5 }, (_, i) => (
              <ellipse key={`m${i}`} cx={90 + i * 150} cy={edgeY(90 + i * 150) + 24 + r() * 24} rx={150} ry={22} fill="#dfe6b0" opacity=".1" />
            ))}
          </>
        )
      case 'lava':
        return (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {Array.from({ length: 12 }, (_, i) => {
              const d = jag(r, 60 + r() * 680, edgeY(400) + 6 + r() * 40, 8, 28)
              return (
                <g key={i}>
                  <path d={d} stroke="#ff5a1f" strokeWidth="5" opacity=".6" filter="url(#lavaGlowFilter)" />
                  <path d={d} stroke="#ffd08a" strokeWidth="1.6" />
                </g>
              )
            })}
          </g>
        )
    }
  }, [kind, r])
  return <>{items}</>
}

/** Sylwetki na horyzoncie: miasta, wille lub drzewa. */
function Horizon({ kind, t }: { kind: PlanetKind; t: Theme }) {
  const items = useMemo(() => {
    const r = rng(t.seed + 100)
    const spans: [number, number][] = [
      [14, 150],
      [655, 790],
    ]
    const out: ReactNode[] = []
    for (const [from, to] of spans) {
      for (let x = from; x < to; x += 5 + r() * 9) {
        const y = edgeY(x)
        if (kind === 'swamp' || kind === 'forest') {
          const h = 16 + r() * 40
          out.push(
            <g key={x} stroke={t.horizon} strokeWidth="2.4" fill="none">
              <path d={`M${x} ${y + 3}V${y - h}M${x} ${y - h * 0.6}l-9 -9M${x} ${y - h * 0.8}l9 -10`} />
            </g>,
          )
        } else if (kind === 'desert') {
          const w = 8 + r() * 14
          out.push(<path key={x} d={`M${x} ${y + 4}a${w / 2} ${w / 2} 0 0 1 ${w} 0z`} fill={t.horizon} stroke={t.horizonStroke} strokeOpacity=".45" />)
        } else {
          const w = 4 + r() * 8
          out.push(<rect key={x} x={x} y={y - (6 + r() * (r() < 0.2 ? 46 : 20)) + 4} width={w} height={60} fill={t.horizon} stroke={t.horizonStroke} strokeOpacity=".45" strokeWidth=".8" />)
        }
      }
    }
    return out
  }, [kind, t])
  return <>{items}</>
}

/** Planeta od dołu kadru: zakrzywiony horyzont, niebo i sylwetki. */
export function Planet({ kind = 'potato', className }: { kind?: PlanetKind; className?: string }) {
  const u = useId().replace(/:/g, '')
  const t = THEMES[kind]
  const r = useMemo(() => rng(t.seed), [t.seed])
  return (
    <svg className={className} viewBox="0 0 800 460" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <radialGradient id={`${u}body`} cx="38%" cy="8%" r="95%">
          <stop offset="0" stopColor={t.stops[0]} />
          <stop offset=".35" stopColor={t.stops[1]} />
          <stop offset=".7" stopColor={t.stops[2]} />
          <stop offset="1" stopColor={t.stops[3]} />
        </radialGradient>
        <radialGradient id={`${u}sun`} cx="50%" cy="100%" r="60%">
          <stop offset="0" stopColor={t.glow} stopOpacity=".6" />
          <stop offset="1" stopColor={t.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}moon`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor={kind === 'ice' ? '#e8f6ff' : '#c9a276'} />
          <stop offset="1" stopColor={kind === 'ice' ? '#2b4a66' : '#3d2a1a'} />
        </radialGradient>
        <radialGradient id={`${u}sun1`}>
          <stop offset="0" stopColor="#ffe6a8" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffb35c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}sun2`}>
          <stop offset="0" stopColor="#ffb98a" stopOpacity=".85" />
          <stop offset="1" stopColor="#ff7a3d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}ember`}>
          <stop offset="0" stopColor="#ff7a3d" stopOpacity=".7" />
          <stop offset="1" stopColor="#ff3d1f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}giant`} cx="35%" cy="30%" r="85%">
          <stop offset="0" stopColor="#f2c58a" />
          <stop offset=".6" stopColor="#c0773c" />
          <stop offset="1" stopColor="#4a2410" />
        </radialGradient>
        <linearGradient id={`${u}rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={t.rim} stopOpacity="0" />
          <stop offset=".5" stopColor={t.rim} stopOpacity=".75" />
          <stop offset="1" stopColor={t.rim} stopOpacity="0" />
        </linearGradient>
        <filter id={`${u}lump`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency={kind === 'ice' ? 0.008 : 0.011} numOctaves="3" seed={t.seed % 9} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={kind === 'ice' ? 24 : 46} />
        </filter>
        <filter id={`${u}grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="4" seed="4" />
          <feColorMatrix values={`0 0 0 0 ${t.tint.split(' ')[0]}  0 0 0 0 ${t.tint.split(' ')[1]}  0 0 0 0 ${t.tint.split(' ')[2]}  0 0 0 1.2 -.35`} />
        </filter>
        <filter id="lavaGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <clipPath id={`${u}clip`}>
          <ellipse cx={PCX} cy={PCY} rx={PRX} ry={PRY} />
        </clipPath>
      </defs>

      <Sky kind={kind} u={u} />
      <ellipse cx={PCX} cy={PCY} rx={PRX + 30} ry={PRY + 30} fill={`url(#${u}sun)`} />
      <g filter={`url(#${u}lump)`}>
        <ellipse cx={PCX} cy={PCY} rx={PRX} ry={PRY} fill={`url(#${u}body)`} />
      </g>
      <g clipPath={`url(#${u}clip)`}>
        <rect width="800" height="460" filter={`url(#${u}grain)`} opacity={kind === 'ice' ? 0.35 : 0.55} />
        <Surface kind={kind} r={r} />
      </g>
      <ellipse cx={PCX} cy={PCY} rx={PRX} ry={PRY} fill="none" stroke={`url(#${u}rim)`} strokeWidth="2" />
      <Horizon kind={kind} t={t} />
    </svg>
  )
}
