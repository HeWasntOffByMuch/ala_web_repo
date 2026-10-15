// Generuje ikony PWA z assets-src/icon-source.png (npm i sharp, node scripts/make-icons.mjs)
import sharp from 'sharp'

const SRC = 'assets-src/icon-source.png'
const TILE = { left: 114, top: 105, width: 1022, height: 1024 } // kafelek bez czarnego marginesu
const BG = { r: 2, g: 4, b: 10, alpha: 1 }

const tile = (size) => sharp(SRC).extract(TILE).resize(size, size)

// kafelek z przezroczystymi, zaokrąglonymi rogami
async function rounded(size) {
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#fff"/></svg>`,
  )
  return tile(size).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
}

for (const size of [192, 512]) {
  await sharp(await rounded(size)).png({ compressionLevel: 9, palette: true, quality: 92 }).toFile(`public/icon-${size}.png`)
}
await sharp(await rounded(64)).toFile('public/favicon.png')

// iOS sam zaokrągla ikonę, więc pełny kwadrat na ciemnym tle
await sharp({ create: { width: 180, height: 180, channels: 4, background: BG } })
  .composite([{ input: await rounded(180) }])
  .flatten({ background: BG })
  .png()
  .toFile('public/apple-touch-icon.png')

// maskable: grafika w bezpiecznej strefie (80%)
const inner = Math.round(512 * 0.8)
await sharp({ create: { width: 512, height: 512, channels: 4, background: BG } })
  .composite([{ input: await rounded(inner), gravity: 'centre' }])
  .png({ compressionLevel: 9, palette: true, quality: 92 })
  .toFile('public/icon-maskable-512.png')
