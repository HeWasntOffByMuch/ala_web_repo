import type { ReactNode, SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Własne godło terminala: pierścień i czteroramienna gwiazda ze skrzydłami. */
export function Emblem(props: P) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden {...props}>
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" opacity=".55" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity=".6" />
      <path
        fill="currentColor"
        d="M32 10l3.2 15.8L51 29l-15.8 3.2L32 48l-3.2-15.8L13 29l15.8-3.2z"
      />
      <path fill="currentColor" d="M8 34c6-1 12 0 17 4l-5 3c-4-3-8-5-12-7zM56 34c-6-1-12 0-17 4l5 3c4-3 8-5 12-7z" />
      <path fill="currentColor" d="M20 46l6-3 3 6-5 2zM44 46l-6-3-3 6 5 2z" opacity=".8" />
    </svg>
  )
}

/** Schemat transportowca i mały księżyc do nagłówka. */
export function ShipSchematic(props: P) {
  return (
    <svg viewBox="0 0 230 70" aria-hidden {...props}>
      <g {...line} strokeWidth="1">
        <circle cx="16" cy="30" r="10" />
        <path d="M6 30h20M16 20v20" opacity=".4" />
        <ellipse cx="124" cy="38" rx="74" ry="21" />
        <ellipse cx="124" cy="36" rx="48" ry="12" />
        <ellipse cx="124" cy="35" rx="22" ry="6" />
        <path d="M124 17v42M76 26l96 20M76 46l96-20" opacity=".35" />
        <path d="M190 28l32-5v9l-30 8M160 22l22-9 10 2-20 12" />
        <path d="M54 44c-8 2-14 4-18 8h14" />
        <path d="M24 66h196" opacity=".35" strokeDasharray="3 4" />
        <path d="M60 14h20M64 10h12" opacity=".5" />
      </g>
    </svg>
  )
}

export function Skyline(props: P) {
  return (
    <svg viewBox="0 0 480 110" preserveAspectRatio="xMidYMax slice" aria-hidden {...props}>
      <defs>
        <linearGradient id="sk-glow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e76b37" stopOpacity=".5" />
          <stop offset="1" stopColor="#e76b37" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect y="30" width="480" height="80" fill="url(#sk-glow)" />
      <circle cx="368" cy="64" r="13" fill="#e76b37" opacity=".9" />
      <circle cx="338" cy="50" r="6" fill="#d6a45d" opacity=".7" />
      <path
        fill="#0b0e12"
        stroke="#e76b37"
        strokeOpacity=".55"
        d="M0 110V86c8-14 24-14 36-2l10-2c4-18 22-18 26 0l6-1V54h4V30h3v24h4v28h8c4-10 14-10 18 0h12V70h10l4-24h3l4 24h12V86c10-8 22-8 30 0h14c8-26 20-26 28 0h10V62h6V40h3v22h6v24h14c10-10 26-10 34 4l12-2c6-20 26-20 30-2l14 0V70l8-10h8l8 10v18h12c8-12 22-12 30 2l10-4c6-10 16-10 20 0h26V110z"
      />
      <path d="M92 46v-8M98 56l8-6" stroke="#e76b37" strokeOpacity=".6" />
    </svg>
  )
}

export const CartIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden {...p}>
    <g {...line} strokeWidth="2">
      <path d="M3 4h3l2.4 11h9.6l2-8H7" />
      <circle cx="10" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
    </g>
  </svg>
)

export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 20 20" aria-hidden {...p}>
    <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SpeakerIcon = ({ muted, ...p }: P & { muted: boolean }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...p}>
    <g {...line} strokeWidth="2">
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
      {muted ? <path d="M16 9l5 6M21 9l-5 6" /> : <path d="M15.5 9a4 4 0 010 6M18 6.5a8 8 0 010 11" />}
    </g>
  </svg>
)

const bowl = 'M4 16h24c0 6-5 10-12 10S4 22 4 16z'

const mealIcons: Record<string, ReactNode> = {
  spaghetti: (
    <>
      <path d={bowl} />
      <path d="M8 16c0-4 3-6 5-4s3 2 5 0 5-1 5 4" />
      <path d="M23 4v7M21 4v4M25 4v4" />
    </>
  ),
  'kurczak-curry': (
    <>
      <path d={bowl} />
      <path d="M7 16c1-5 5-8 9-8s8 3 9 8" />
      <path d="M12 12h.01M16 10h.01M20 12h.01M14 14h.01M18 14h.01" />
    </>
  ),
  'losos-ziemniaki': (
    <>
      <path d="M3 16c5-7 13-7 18 0-5 7-13 7-18 0z" />
      <path d="M21 16l8-6v12z" />
      <path d="M8 15h.01M13 11v10" />
    </>
  ),
  pizza: (
    <>
      <path d="M16 28L5 8c7-4 15-4 22 0z" />
      <circle cx="13" cy="13" r="1.8" />
      <circle cx="19" cy="14" r="1.8" />
      <circle cx="16" cy="20" r="1.5" />
    </>
  ),
  tortille: (
    <>
      <path d="M5 21L21 5l6 6L11 27z" />
      <path d="M21 5c3 0 6 3 6 6M9 18l5 5" />
    </>
  ),
  jajecznica: (
    <>
      <ellipse cx="14" cy="18" rx="10" ry="6" />
      <circle cx="11" cy="17" r="2.4" />
      <circle cx="17.5" cy="19" r="2.4" />
      <path d="M24 16l6-4" />
    </>
  ),
  'makaron-tunczyk': (
    <>
      <ellipse cx="16" cy="10" rx="10" ry="4" />
      <path d="M6 10v12c0 2.2 4.5 4 10 4s10-1.8 10-4V10M6 16c0 2.2 4.5 4 10 4s10-1.8 10-4" />
    </>
  ),
  kotlety: (
    <>
      <ellipse cx="16" cy="23" rx="13" ry="5" />
      <circle cx="11" cy="16" r="4" />
      <circle cx="21" cy="16" r="4" />
      <circle cx="16" cy="11" r="4" />
    </>
  ),
  chili: (
    <>
      <path d="M20 7c3 0 5 2 5 5 0 9-8 15-18 15 7-3 9-10 9-15 0-3 1-5 4-5z" />
      <path d="M20 7l2-4" />
    </>
  ),
  owsianka: (
    <>
      <path d={bowl} />
      <path d="M10 10c-2-2 2-3 0-6M16 10c-2-2 2-3 0-6" />
      <path d="M25 6l-5 9" />
    </>
  ),
  'frytki-brokuly': (
    <>
      <path d="M5 15h13l-2 13H7z" />
      <path d="M8 15V6M11 15V4M14 15V6M17 15V8" />
      <circle cx="24" cy="12" r="3" />
      <circle cx="28" cy="15" r="2.6" />
      <circle cx="21" cy="15" r="2.6" />
      <path d="M24 17v8" />
    </>
  ),
}

const fallback = (
  <>
    <circle cx="16" cy="16" r="11" />
    <circle cx="16" cy="16" r="6" />
  </>
)

export function MealIcon({ id, ...p }: P & { id: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden {...p}>
      <g {...line}>{mealIcons[id] ?? fallback}</g>
    </svg>
  )
}
