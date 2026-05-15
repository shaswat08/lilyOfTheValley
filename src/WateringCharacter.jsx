import spriteUrl from './assets/watering-sprite-alpha.png'

const COLS = 4
const SHEET_W = 1536
const SHEET_H = 1024
const CELL_W = SHEET_W / COLS
const CELL_H = SHEET_H / 2

/** Sprite sheet: 4×2 frames (384×512 each). `frameIndex` 0–7, left-to-right then top-to-bottom. */
export default function WateringCharacter({ frameIndex, displayWidth = 152 }) {
  const displayHeight = (CELL_H * displayWidth) / CELL_W
  const col = frameIndex % COLS
  const row = Math.floor(frameIndex / COLS)
  const bgW = (SHEET_W * displayWidth) / CELL_W
  const bgH = (SHEET_H * displayHeight) / CELL_H

  return (
    <div
      className="watering-character"
      style={{ width: displayWidth, height: displayHeight }}
      aria-hidden
    >
      <div
        className="watering-character__sheet"
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${spriteUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${bgW}px ${bgH}px`,
          backgroundPosition: `${-col * displayWidth}px ${-row * displayHeight}px`
        }}
      />
    </div>
  )
}
