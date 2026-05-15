import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

/**
 * Remove baked-in checkerboard / flat light backgrounds from the cat sprite.
 * Edge flood-fill through "light neutral" pixels only; colored cat pixels block
 * the flood. Tune LUM_MIN / CHROMA_MAX if edges need adjustment.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const srcPath = path.join(root, 'img', 'gatto.png')
const outPath = path.join(root, 'src', 'assets', 'gatto.png')

const LUM_MIN = 170
const CHROMA_MAX = 48

const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

const { width: w, height: h, channels } = info
if (channels !== 4) throw new Error(`Expected RGBA, got ${channels} channels`)

const visited = new Uint8Array(w * h)
const q = []

const lumAt = (i) =>
  data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114

const isNeutralLight = (i) => {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  const chroma = mx - mn
  return lumAt(i) >= LUM_MIN && chroma <= CHROMA_MAX
}

const tryVisit = (x, y) => {
  if (x < 0 || x >= w || y < 0 || y >= h) return
  const p = y * w + x
  if (visited[p]) return
  const i = p * 4
  if (data[i + 3] === 0) {
    visited[p] = 1
    return
  }
  if (!isNeutralLight(i)) return
  visited[p] = 1
  data[i + 3] = 0
  q.push(p)
}

for (let x = 0; x < w; x++) {
  tryVisit(x, 0)
  tryVisit(x, h - 1)
}
for (let y = 0; y < h; y++) {
  tryVisit(0, y)
  tryVisit(w - 1, y)
}

const dirs = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
]

while (q.length) {
  const p = q.pop()
  const x = p % w
  const y = (p / w) | 0
  for (const [dx, dy] of dirs) {
    tryVisit(x + dx, y + dy)
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })

await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(outPath)

console.log(`Wrote ${outPath} (${w}x${h}) — edge flood, LUM_MIN=${LUM_MIN} CHROMA_MAX=${CHROMA_MAX}`)
