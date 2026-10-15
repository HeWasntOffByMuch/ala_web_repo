import { useId } from 'react'

export type ShipKind = 'saucer' | 'quad' | 'twin' | 'wedge'
export const SHIPS: ShipKind[] = ['saucer', 'quad', 'twin', 'wedge']

/**
 * Oryginalne wektorowe statki w klimacie kina kosmicznego z lat 70.:
 * dysk-frachtowiec, czteroskrzydłowy myśliwiec, myśliwiec z dwoma panelami
 * i klinowy krążownik. Wszystkie mają viewBox 420×200 i żarzące się silniki.
 */
function Defs({ u }: { u: string }) {
  return (
    <defs>
      <linearGradient id={`${u}hull`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a4937a" />
        <stop offset=".55" stopColor="#6a5d4b" />
        <stop offset="1" stopColor="#2c261e" />
      </linearGradient>
      <linearGradient id={`${u}plate`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b9a98d" />
        <stop offset="1" stopColor="#5a4e3e" />
      </linearGradient>
      <linearGradient id={`${u}steel`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8d9399" />
        <stop offset="1" stopColor="#363b41" />
      </linearGradient>
      <linearGradient id={`${u}thrust`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#78beff" stopOpacity="0" />
        <stop offset=".2" stopColor="#78beff" />
        <stop offset=".5" stopColor="#ffffff" />
        <stop offset=".8" stopColor="#78beff" />
        <stop offset="1" stopColor="#78beff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${u}jet`}>
        <stop offset="0" stopColor="#fff" />
        <stop offset=".45" stopColor="#a9d7ff" />
        <stop offset="1" stopColor="#78beff" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

const Jet = ({ u, x, y, r }: { u: string; x: number; y: number; r: number }) => (
  <>
    <circle cx={x} cy={y} r={r * 3} fill={`url(#${u}jet)`} opacity=".9" />
    <circle cx={x} cy={y} r={r} fill="#fff" />
  </>
)

function Saucer({ u }: { u: string }) {
  const vents = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return { x: 200 + Math.cos(a) * 112, y: 92 + Math.sin(a) * 27 }
  })
  return (
    <>
      <ellipse cx="205" cy="150" rx="170" ry="30" fill="#000" opacity=".35" />
      <path d="M318 74l92-14c6-1 10 4 8 9l-4 12c-1 4-4 6-8 6l-90 4z" fill={`url(#${u}plate)`} stroke="#2c261e" />
      <path d="M392 64l14-2-2 10-12 2z" fill="#78beff" opacity=".6" />
      <ellipse cx="200" cy="108" rx="192" ry="62" fill="#2c261e" />
      <ellipse cx="200" cy="98" rx="192" ry="62" fill={`url(#${u}hull)`} stroke="#d6c7aa" strokeOpacity=".25" />
      <ellipse cx="200" cy="92" rx="150" ry="42" fill={`url(#${u}plate)`} stroke="#2c261e" strokeOpacity=".6" />
      <g fill="none" stroke="#2c261e" strokeOpacity=".7" strokeWidth="1.2">
        <ellipse cx="200" cy="90" rx="104" ry="29" />
        <ellipse cx="200" cy="88" rx="46" ry="12" />
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2
          return (
            <path
              key={i}
              d={`M${200 + Math.cos(a) * 46} ${88 + Math.sin(a) * 12}L${200 + Math.cos(a) * 150} ${92 + Math.sin(a) * 42}`}
              opacity=".5"
            />
          )
        })}
      </g>
      <ellipse cx="200" cy="84" rx="34" ry="9" fill="#cdbd9f" stroke="#2c261e" strokeOpacity=".6" />
      {vents.map((v, i) => (
        <ellipse key={i} cx={v.x} cy={v.y} rx="7" ry="3.2" fill="#15110d" />
      ))}
      <path d="M268 62V46" stroke="#d6c7aa" strokeWidth="2" />
      <ellipse cx="268" cy="44" rx="17" ry="6" fill="#bdae92" stroke="#2c261e" />
      <path d="M54 126Q200 190 346 126" fill="none" stroke={`url(#${u}thrust)`} strokeWidth="30" strokeLinecap="round" opacity=".22" />
      <path d="M54 126Q200 190 346 126" fill="none" stroke={`url(#${u}thrust)`} strokeWidth="16" strokeLinecap="round" opacity=".5" />
      <path d="M54 126Q200 190 346 126" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".95" />
    </>
  )
}

/** Widok od rufy: cztery skrzydła w X, cztery dysze. */
function Quad({ u }: { u: string }) {
  const wing = (sx: number, sy: number) => {
    const x = (v: number) => 210 + sx * v
    const y = (v: number) => 100 + sy * v
    return (
      <g key={`${sx}${sy}`}>
        <path d={`M${x(26)} ${y(10)}L${x(184)} ${y(70)}L${x(184)} ${y(60)}L${x(26)} ${y(24)}z`} fill={`url(#${u}steel)`} stroke="#15181c" />
        <path d={`M${x(110)} ${y(40)}L${x(176)} ${y(66)}`} stroke="#e76b37" strokeWidth="5" strokeLinecap="round" />
        <path d={`M${x(60)} ${y(18)}L${x(160)} ${y(56)}`} stroke="#15181c" strokeOpacity=".5" />
        <path d={`M${x(184)} ${y(66)}L${x(204)} ${y(74)}`} stroke="#b9bfc5" strokeWidth="3" strokeLinecap="round" />
      </g>
    )
  }
  const jets: [number, number][] = [
    [176, 76],
    [244, 76],
    [176, 126],
    [244, 126],
  ]
  return (
    <>
      <ellipse cx="210" cy="176" rx="150" ry="14" fill="#000" opacity=".3" />
      {[wing(-1, -1), wing(1, -1), wing(-1, 1), wing(1, 1)]}
      <rect x="186" y="54" width="48" height="104" rx="22" fill={`url(#${u}steel)`} stroke="#15181c" />
      <path d="M198 54c2-18 22-18 24 0z" fill="#59616a" stroke="#15181c" />
      <path d="M210 40v16" stroke="#b9bfc5" strokeWidth="2" />
      {jets.map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r="19" fill="#15181c" stroke="#8d9399" />
          <Jet u={u} x={x} y={y} r={11} />
        </g>
      ))}
      <rect x="196" y="98" width="28" height="22" rx="4" fill="#2c3238" stroke="#8d9399" strokeOpacity=".6" />
    </>
  )
}

/** Dwa wielkie panele sześciokątne po bokach kapsuły z silnikiem jonowym. */
function Twin({ u }: { u: string }) {
  const hex = (cx: number, r = 80) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 3
      return [cx + Math.cos(a) * r * 0.86, 100 + Math.sin(a) * r] as const
    })
  const pts = (cx: number, r?: number) => hex(cx, r).map((p) => p.join(',')).join(' ')
  return (
    <>
      <ellipse cx="210" cy="182" rx="170" ry="11" fill="#000" opacity=".3" />
      {[78, 342].map((cx) => (
        <g key={cx}>
          <polygon points={pts(cx)} fill={`url(#${u}steel)`} stroke="#b9bfc5" strokeOpacity=".5" strokeWidth="2" />
          <polygon points={pts(cx, 52)} fill="none" stroke="#15181c" strokeOpacity=".6" strokeWidth="2" />
          <polygon points={pts(cx, 22)} fill="#15181c" stroke="#8d9399" strokeOpacity=".5" />
          <g stroke="#15181c" strokeOpacity=".55" strokeWidth="2">
            {hex(cx).map(([x, y], i) => (
              <line key={i} x1={cx} y1={100} x2={x} y2={y} />
            ))}
          </g>
        </g>
      ))}
      <rect x="150" y="92" width="120" height="16" fill="#59616a" stroke="#15181c" />
      <circle cx="210" cy="100" r="46" fill={`url(#${u}steel)`} stroke="#b9bfc5" strokeOpacity=".6" strokeWidth="2" />
      <circle cx="210" cy="100" r="34" fill="none" stroke="#15181c" strokeOpacity=".5" strokeWidth="2" />
      <circle cx="210" cy="100" r="22" fill="#15181c" stroke="#8d9399" />
      <Jet u={u} x={210} y={100} r={12} />
      <path d="M166 100h8M246 100h8M210 56v8M210 136v8" stroke="#15181c" strokeWidth="3" />
    </>
  )
}

/** Klinowy krążownik od strony rufy: trzy wielkie dysze i wieża dowodzenia. */
function Wedge({ u }: { u: string }) {
  return (
    <>
      <ellipse cx="210" cy="176" rx="190" ry="14" fill="#000" opacity=".3" />
      <polygon points="210,22 412,146 8,146" fill={`url(#${u}hull)`} stroke="#d6c7aa" strokeOpacity=".3" strokeWidth="1.5" />
      <polygon points="210,42 372,138 48,138" fill={`url(#${u}plate)`} stroke="#2c261e" strokeOpacity=".6" />
      <g stroke="#2c261e" strokeOpacity=".55" fill="none">
        <path d="M210 42V138M210 70L120 138M210 70L300 138M210 96L84 138M210 96L336 138" />
        <path d="M150 104h120M118 120h184" />
      </g>
      <rect x="8" y="146" width="404" height="22" fill="#2c261e" stroke="#d6c7aa" strokeOpacity=".2" />
      <rect x="186" y="104" width="48" height="34" fill="#59616a" stroke="#15181c" />
      <rect x="196" y="90" width="28" height="16" fill="#8d9399" stroke="#15181c" />
      <path d="M180 138a14 14 0 0128 0M232 138a14 14 0 0128 0" fill="#6a5d4b" stroke="#15181c" />
      <path d="M210 90V72M204 72h12" stroke="#d6c7aa" strokeWidth="2" />
      {[96, 210, 324].map((x) => (
        <g key={x}>
          <circle cx={x} cy="158" r="17" fill="#15181c" stroke="#8d9399" />
          <Jet u={u} x={x} y={158} r={10} />
        </g>
      ))}
      {[150, 270, 54, 366].map((x) => (
        <circle key={x} cx={x} cy="158" r="6" fill="#bfe0ff" />
      ))}
    </>
  )
}

export function Ship({ kind = 'saucer', className }: { kind?: ShipKind; className?: string }) {
  const u = useId().replace(/:/g, '')
  return (
    <svg className={className} viewBox="0 0 420 200" aria-hidden>
      <Defs u={u} />
      {kind === 'quad' ? <Quad u={u} /> : kind === 'twin' ? <Twin u={u} /> : kind === 'wedge' ? <Wedge u={u} /> : <Saucer u={u} />}
    </svg>
  )
}
