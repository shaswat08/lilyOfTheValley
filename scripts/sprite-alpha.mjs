import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const srcPath = path.join(root, 'img', 'sprite.png')
const outPath = path.join(root, 'src', 'assets', 'watering-sprite-alpha.png')

const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
if (channels !== 4) throw new Error(`Expected RGBA, got ${channels} channels`)

const threshold = 28
for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  if (r <= threshold && g <= threshold && b <= threshold) {
    data[i + 3] = 0
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })

await sharp(data, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(outPath)

console.log(`Wrote ${outPath} (${width}x${height})`)
