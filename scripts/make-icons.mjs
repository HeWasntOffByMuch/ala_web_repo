// Generuje public/icon-192.png i icon-512.png z public/icon.svg (npm i sharp, node scripts/make-icons.mjs)
import sharp from 'sharp'
for (const size of [192, 512]) {
  await sharp('public/icon.svg').resize(size, size).png().toFile(`public/icon-${size}.png`)
}
