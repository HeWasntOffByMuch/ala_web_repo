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
  noodles: (
    <>
      <path d={bowl} />
      <path d="M8 16c0-4 3-6 5-4s3 2 5 0 5-1 5 4" />
      <path d="M23 4v7M21 4v4M25 4v4" />
    </>
  ),
  rice: (
    <>
      <path d={bowl} />
      <path d="M7 16c1-5 5-8 9-8s8 3 9 8" />
      <path d="M12 12h.01M16 10h.01M20 12h.01M14 14h.01M18 14h.01" />
    </>
  ),
  fish: (
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
  wrap: (
    <>
      <path d="M5 21L21 5l6 6L11 27z" />
      <path d="M21 5c3 0 6 3 6 6M9 18l5 5" />
    </>
  ),
  pan: (
    <>
      <ellipse cx="14" cy="18" rx="10" ry="6" />
      <circle cx="11" cy="17" r="2.4" />
      <circle cx="17.5" cy="19" r="2.4" />
      <path d="M24 16l6-4" />
    </>
  ),
  can: (
    <>
      <ellipse cx="16" cy="10" rx="10" ry="4" />
      <path d="M6 10v12c0 2.2 4.5 4 10 4s10-1.8 10-4V10M6 16c0 2.2 4.5 4 10 4s10-1.8 10-4" />
    </>
  ),
  meatballs: (
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
  soup: (
    <>
      <path d={bowl} />
      <path d="M10 10c-2-2 2-3 0-6M16 10c-2-2 2-3 0-6" />
      <path d="M25 6l-5 9" />
    </>
  ),
  fries: (
    <>
      <path d="M5 15h13l-2 13H7z" />
      <path d="M8 15V6M11 15V4M14 15V6M17 15V8" />
      <circle cx="24" cy="12" r="3" />
      <circle cx="28" cy="15" r="2.6" />
      <circle cx="21" cy="15" r="2.6" />
      <path d="M24 17v8" />
    </>
  ),
  drumstick: (
    <>
      <path d="M20 6c4 0 7 3 6 7s-5 7-9 8l-4 2-3-3 2-4c1-4 4-10 8-10z" />
      <path d="M9 22l-4 4M5 26l-2-1M5 26l1 3" />
    </>
  ),
  salad: (
    <>
      <path d={bowl} />
      <path d="M8 15c0-4 3-7 8-7s8 3 8 7" />
      <path d="M12 12c1-3 3-4 4-4s3 1 4 4" />
    </>
  ),
  pancakes: (
    <>
      <ellipse cx="16" cy="22" rx="11" ry="4" />
      <ellipse cx="16" cy="16.5" rx="11" ry="4" />
      <ellipse cx="16" cy="11" rx="11" ry="4" />
      <path d="M12 11v5M20 11v4" />
    </>
  ),
  bread: (
    <>
      <path d="M8 26V14C5 13 4 9 7 7c2-2 5-1 9-1s7-1 9 1c3 2 2 6-1 7v12z" />
      <path d="M12 18v4M16 18v4M20 18v4" />
    </>
  ),
  fruit: (
    <>
      <path d="M16 9c-6-3-11 2-9 9 1 5 5 9 9 7 4 2 8-2 9-7 2-7-3-12-9-9z" />
      <path d="M16 9c0-3 1-5 3-6" />
    </>
  ),
  veg: (
    <>
      <path d="M22 6c3 0 4 3 2 5L10 26c-2 2-4 0-3-3l9-15c1-2 4-3 6-2z" />
      <path d="M22 6l3-3M22 6l1-4M22 6l4 1" />
    </>
  ),
}

/** Który rysunek pasuje do którego posiłku; reszta (też własne) dostaje talerz. */
const ICON_FOR: Record<string, string> = {
  'zolty-ryz': 'rice',
  'makaron-z-lososiem': 'fish',
  'makaron-z-burrata': 'noodles',
  'makaron-z-bobem-i-chorizo': 'noodles',
  'kurczak-pieczony': 'drumstick',
  'nozki-z-kurczaka': 'drumstick',
  'zapiekanka-ziemniaczana': 'meatballs',
  korytko: 'pan',
  'sniadaniowy-mix': 'bread',
  'salatka-ze-slonecznikiem': 'salad',
  'kurczak-z-orzechami-nerkowca': 'wrap',
  leniwe: 'soup',
  'omlet-z-jagodami': 'pan',
  'racuchy-z-jablkami': 'pancakes',
  nalesniki: 'pancakes',
  'tygodniowy-mix-warzyw': 'veg',
  'tygodniowy-mix-owocow': 'fruit',
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
      <g {...line}>{mealIcons[ICON_FOR[id]] ?? mealIcons[id] ?? fallback}</g>
    </svg>
  )
}
