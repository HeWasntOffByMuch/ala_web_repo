import { useMemo } from 'react'

/** Deterministyczny generator, żeby scena wyglądała tak samo przy każdym odtworzeniu. */
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

/** Ziemniaczana planeta z kraterami-"oczkami", sylwetkami miast i księżycami. */
export function Planet({ className }: { className?: string }) {
  const { eyes, towers } = useMemo(() => {
    const r = rng(11)
    const eyes = Array.from({ length: 16 }, () => {
      const x = 130 + r() * 540
      const top = edgeY(x)
      return { x, y: top + 40 + r() * 190, rx: 9 + r() * 24, ry: 4 + r() * 9, rot: -20 + r() * 40 }
    })
    const towers: { x: number; y: number; w: number; h: number }[] = []
    for (const [from, to] of [
      [14, 150],
      [655, 790],
    ]) {
      for (let x = from; x < to; x += 5 + r() * 9) {
        const w = 4 + r() * 8
        towers.push({ x, y: edgeY(x + w / 2), w, h: 6 + r() * (r() < 0.2 ? 46 : 20) })
      }
    }
    return { eyes, towers }
  }, [])

  return (
    <svg className={className} viewBox="0 0 800 460" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <radialGradient id="pl-body" cx="38%" cy="8%" r="95%">
          <stop offset="0" stopColor="#f0c27a" />
          <stop offset=".35" stopColor="#c98b46" />
          <stop offset=".7" stopColor="#7d4d22" />
          <stop offset="1" stopColor="#2a160a" />
        </radialGradient>
        <radialGradient id="pl-sun" cx="50%" cy="100%" r="60%">
          <stop offset="0" stopColor="#ff8a3d" stopOpacity=".6" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moon" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#c9a276" />
          <stop offset="1" stopColor="#3d2a1a" />
        </radialGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#78beff" stopOpacity="0" />
          <stop offset=".5" stopColor="#bfe0ff" stopOpacity=".7" />
          <stop offset="1" stopColor="#78beff" stopOpacity="0" />
        </linearGradient>
        <filter id="lump" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="46" />
        </filter>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="4" seed="4" />
          <feColorMatrix values="0 0 0 0 .25  0 0 0 0 .13  0 0 0 0 .05  0 0 0 1.2 -.35" />
        </filter>
        <clipPath id="pl-clip">
          <ellipse cx={PCX} cy={PCY} rx={PRX} ry={PRY} />
        </clipPath>
      </defs>

      <circle cx="96" cy="118" r="30" fill="url(#moon)" />
      <circle cx="84" cy="108" r="6" fill="#3d2a1a" opacity=".5" />
      <circle cx="108" cy="130" r="4" fill="#3d2a1a" opacity=".5" />
      <circle cx="170" cy="172" r="13" fill="url(#moon)" opacity=".85" />
      <circle cx="690" cy="90" r="8" fill="#e8c897" opacity=".8" />

      <ellipse cx={PCX} cy={PCY} rx={PRX + 30} ry={PRY + 30} fill="url(#pl-sun)" />
      <g filter="url(#lump)">
        <ellipse cx={PCX} cy={PCY} rx={PRX} ry={PRY} fill="url(#pl-body)" />
      </g>
      <g clipPath="url(#pl-clip)">
        <rect width="800" height="460" filter="url(#grain)" opacity=".55" />
        {eyes.map((e, i) => (
          <g key={i} transform={`rotate(${e.rot} ${e.x} ${e.y})`}>
            <ellipse cx={e.x} cy={e.y} rx={e.rx} ry={e.ry} fill="#4b2c12" opacity=".75" />
            <path
              d={`M${e.x - e.rx} ${e.y}a${e.rx} ${e.ry} 0 0 1 ${e.rx * 2} 0`}
              fill="none"
              stroke="#f5d79d"
              strokeOpacity=".5"
              strokeWidth="1.5"
            />
          </g>
        ))}
      </g>
      <ellipse cx={PCX} cy={PCY} rx={PRX} ry={PRY} fill="none" stroke="url(#rim)" strokeWidth="2" />
      <g fill="#0a0806" stroke="#ff8a3d" strokeOpacity=".45" strokeWidth=".8">
        {towers.map((t, i) => (
          <rect key={i} x={t.x} y={t.y - t.h + 4} width={t.w} height={t.h} />
        ))}
      </g>
    </svg>
  )
}

/** Wektorowy transportowiec w stylu retro: dysk, kabina z boku, żarzący się silnik. */
export function ShipArt({ className }: { className?: string }) {
  const vents = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return { x: 200 + Math.cos(a) * 112, y: 92 + Math.sin(a) * 27 }
  })
  return (
    <svg className={className} viewBox="0 0 420 200" aria-hidden>
      <defs>
        <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a4937a" />
          <stop offset=".55" stopColor="#6a5d4b" />
          <stop offset="1" stopColor="#2c261e" />
        </linearGradient>
        <linearGradient id="plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9a98d" />
          <stop offset="1" stopColor="#5a4e3e" />
        </linearGradient>
        <linearGradient id="thrust" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#78beff" stopOpacity="0" />
          <stop offset=".2" stopColor="#78beff" />
          <stop offset=".5" stopColor="#ffffff" />
          <stop offset=".8" stopColor="#78beff" />
          <stop offset="1" stopColor="#78beff" stopOpacity="0" />
        </linearGradient>
        <filter id="bloom" x="-20%" y="-60%" width="140%" height="240%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <ellipse cx="205" cy="150" rx="170" ry="30" fill="#000" opacity=".35" />
      {/* kabina i dysza z boku */}
      <path d="M318 74l92-14c6-1 10 4 8 9l-4 12c-1 4-4 6-8 6l-90 4z" fill="url(#plate)" stroke="#2c261e" />
      <path d="M392 64l14-2 -2 10-12 2z" fill="#78beff" opacity=".6" />
      <ellipse cx="200" cy="108" rx="192" ry="62" fill="#2c261e" />
      <ellipse cx="200" cy="98" rx="192" ry="62" fill="url(#hull)" stroke="#d6c7aa" strokeOpacity=".25" />
      <ellipse cx="200" cy="92" rx="150" ry="42" fill="url(#plate)" stroke="#2c261e" strokeOpacity=".6" />
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
      {/* antena radarowa */}
      <path d="M268 62V46" stroke="#d6c7aa" strokeWidth="2" />
      <ellipse cx="268" cy="44" rx="17" ry="6" fill="#bdae92" stroke="#2c261e" />
      {/* silnik */}
      <path d="M36 118Q200 196 364 118l-12 12Q200 206 48 130z" fill="url(#thrust)" filter="url(#bloom)" opacity=".95" />
      <path d="M54 126Q200 190 346 126" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".95" />
    </svg>
  )
}
