import { motion } from 'framer-motion'

const springBounce = {
  type: 'spring',
  stiffness: 250,
  damping: 12
}

/** Soil mound — shared across stages */
const Soil = () => (
  <g>
    <ellipse cx="160" cy="390" rx="72" ry="20" fill="#5C3D2E" />
    <ellipse cx="160" cy="387" rx="64" ry="16" fill="#6B5344" />
    <ellipse cx="160" cy="384" rx="54" ry="12" fill="#7D6350" opacity="0.45" />
  </g>
)

/**
 * Single basal leaf (lanceolate, Convallaria-style): broad elliptical blade
 * with visible midrib. `side` -1 = left, 1 = right.
 */
const BasalLeaf = ({
  side,
  tipX,
  tipY,
  width = 1,
  delay = 0,
  midribOpacity = 0.35
}) => {
  const baseX = 160 + side * 6
  const baseY = 382
  const shoulderX = 160 + side * 42
  const shoulderY = 310
  const w = 28 * width
  const outline =
    side < 0
      ? `M ${baseX} ${baseY}
         C ${baseX - 8} ${baseY - 30}, ${tipX + 18} ${tipY + 40}, ${tipX} ${tipY}
         C ${tipX - 6} ${tipY + 8}, ${baseX - w} ${shoulderY}, ${baseX - 14} ${baseY - 4}
         Z`
      : `M ${baseX} ${baseY}
         C ${baseX + 8} ${baseY - 30}, ${tipX - 18} ${tipY + 40}, ${tipX} ${tipY}
         C ${tipX + 6} ${tipY + 8}, ${baseX + w} ${shoulderY}, ${baseX + 14} ${baseY - 4}
         Z`

  const midrib =
    side < 0
      ? `M ${baseX - 2} ${baseY - 2} Q ${(baseX + tipX) / 2 - 12} ${(baseY + tipY) / 2} ${tipX + 2} ${tipY + 4}`
      : `M ${baseX + 2} ${baseY - 2} Q ${(baseX + tipX) / 2 + 12} ${(baseY + tipY) / 2} ${tipX - 2} ${tipY + 4}`

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springBounce, delay }}
      style={{ transformOrigin: `${baseX}px ${baseY}px` }}
    >
      <path d={outline} fill="#3D5A3F" opacity="0.35" />
      <path d={outline} fill="#4A6B47" />
      <path
        d={outline}
        fill="none"
        stroke="#5D7A55"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <path
        d={midrib}
        stroke="#2D4A30"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity={midribOpacity}
      />
    </motion.g>
  )
}

/** Nodding white bell hanging from raceme (opening downward). */
const Bell = ({ cx, cy, delay, scale = 1 }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale }}
    transition={{ ...springBounce, delay, duration: 0.35 }}
    style={{ transformOrigin: `${cx}px ${cy}px` }}
  >
    <line
      x1={cx}
      y1={cy - 9}
      x2={cx}
      y2={cy - 2}
      stroke="#6B8060"
      strokeWidth="0.9"
      opacity="0.7"
    />
    <path
      d={`M ${cx - 5} ${cy - 2}
          Q ${cx - 5.5} ${cy + 4} ${cx} ${cy + 8}
          Q ${cx + 5.5} ${cy + 4} ${cx + 5} ${cy - 2}
          Q ${cx} ${cy - 9} ${cx - 5} ${cy - 2}`}
      fill="#FEFEFE"
      stroke="#D8E8D4"
      strokeWidth="0.6"
    />
    <path
      d={`M ${cx - 3} ${cy + 1} Q ${cx} ${cy + 5.5} ${cx + 3} ${cy + 1}`}
      fill="none"
      stroke="#C8DCC0"
      strokeWidth="0.5"
      opacity="0.6"
    />
    <ellipse cx={cx} cy={cy - 4} rx="2" ry="1.3" fill="#F5FAF3" opacity="0.85" />
  </motion.g>
)

/** Tiny green bud before bloom */
const Bud = ({ cx, cy, delay }) => (
  <motion.ellipse
    cx={cx}
    cy={cy}
    rx="3.5"
    ry="5"
    fill="#5A7A52"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ ...springBounce, delay }}
  />
)

/** Arching flower scape (slender stalk) — path used for stem; bells placed along it. */
const SCAPE_PATH =
  'M 160 378 C 162 340, 168 295, 178 248 C 186 210, 192 175, 188 138 C 185 108, 178 88, 172 78'

const BELL_LAYOUT = [
  { t: 0.08, offX: 10, offY: 2 },
  { t: 0.18, offX: 11, offY: 3 },
  { t: 0.28, offX: 11, offY: 4 },
  { t: 0.38, offX: 10.5, offY: 5 },
  { t: 0.48, offX: 10, offY: 5 },
  { t: 0.58, offX: 9, offY: 5 },
  { t: 0.68, offX: 8, offY: 5 },
  { t: 0.78, offX: 7, offY: 4 },
  { t: 0.88, offX: 6, offY: 3 },
  { t: 0.96, offX: 5, offY: 2 }
]

function pointOnScape(t) {
  const segments = [
    { x0: 160, y0: 378, x1: 162, y1: 340, x2: 168, y2: 295, x3: 178, y3: 248 },
    { x0: 178, y0: 248, x1: 186, y1: 210, x2: 192, y2: 175, x3: 188, y3: 138 },
    { x0: 188, y0: 138, x1: 185, y1: 108, x2: 178, y2: 88, x3: 172, y3: 78 }
  ]
  const n = segments.length
  const f = t * n
  const i = Math.min(Math.floor(f), n - 1)
  const u = f - i
  const s = segments[i]
  const mt = 1 - u
  const x =
    mt * mt * mt * s.x0 +
    3 * mt * mt * u * s.x1 +
    3 * mt * u * u * s.x2 +
    u * u * u * s.x3
  const y =
    mt * mt * mt * s.y0 +
    3 * mt * mt * u * s.y1 +
    3 * mt * u * u * s.y2 +
    u * u * u * s.y3
  return { x, y }
}

const Plant = ({ stage }) => {
  const plantContent = () => {
    switch (stage) {
      case 0:
        return (
          <g>
            <Soil />
            <motion.g
              initial={{ scale: 0, y: -12 }}
              animate={{ scale: 1, y: 0 }}
              transition={springBounce}
            >
              <ellipse cx="160" cy="376" rx="10" ry="6" fill="#7A5C48" />
              <ellipse cx="160" cy="374" rx="7" ry="4" fill="#8B7355" />
              <ellipse cx="158" cy="372" rx="2.5" ry="1.5" fill="#9A8060" opacity="0.7" />
            </motion.g>
          </g>
        )

      case 1:
        return (
          <g>
            <Soil />
            <motion.path
              d="M 160 378 Q 159 350 160 318 Q 161 295 160 275"
              stroke="#4A6B47"
              strokeWidth="3.2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
            />
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springBounce, delay: 0.55 }}
            >
              <path
                d="M 152 278 Q 160 265 168 278 Q 160 288 152 278"
                fill="#5D8A5E"
                stroke="#3D5A40"
                strokeWidth="0.8"
              />
              <path
                d="M 156 275 L 160 268 L 164 275"
                fill="none"
                stroke="#6BA86A"
                strokeWidth="1"
                opacity="0.7"
              />
            </motion.g>
          </g>
        )

      case 2:
        return (
          <g>
            <Soil />
            <BasalLeaf side={-1} tipX={108} tipY={168} width={0.85} delay={0.1} />
            <BasalLeaf side={1} tipX={212} tipY={172} width={0.82} delay={0.22} />
          </g>
        )

      case 3:
        return (
          <g>
            <Soil />
            <BasalLeaf side={-1} tipX={95} tipY={118} width={1} delay={0.08} />
            <BasalLeaf side={1} tipX={225} tipY={122} width={0.98} delay={0.15} />
            <motion.path
              d={SCAPE_PATH}
              stroke="#5A7050"
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.35, ease: 'easeOut' }}
            />
            <motion.path
              d={SCAPE_PATH}
              stroke="#7A9070"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              opacity="0.45"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.35, ease: 'easeOut' }}
            />
            {[
              { t: 0.35, offX: 8, offY: 4 },
              { t: 0.52, offX: 9, offY: 5 },
              { t: 0.7, offX: 8, offY: 5 },
              { t: 0.88, offX: 6, offY: 4 }
            ].map((b, i) => {
              const p = pointOnScape(b.t)
              return (
                <Bud
                  key={`bud-${i}`}
                  cx={p.x + b.offX}
                  cy={p.y + b.offY}
                  delay={0.9 + i * 0.08}
                />
              )
            })}
          </g>
        )

      case 4:
        return (
          <g>
            <Soil />
            <BasalLeaf side={-1} tipX={92} tipY={108} width={1.05} delay={0.05} />
            <BasalLeaf side={1} tipX={228} tipY={112} width={1.02} delay={0.12} />
            <motion.path
              d={SCAPE_PATH}
              stroke="#4F6348"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            />
            <motion.path
              d={SCAPE_PATH}
              stroke="#7D9075"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            />
            {BELL_LAYOUT.map((b, i) => {
              const p = pointOnScape(b.t)
              return (
                <Bell
                  key={`bell-${i}`}
                  cx={p.x + b.offX}
                  cy={p.y + b.offY}
                  delay={0.45 + i * 0.07}
                  scale={0.92 + (i % 3) * 0.04}
                />
              )
            })}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.35, duration: 0.5 }}
            >
              <ellipse cx="138" cy="384" rx="5" ry="6" fill="#B83C3C" opacity="0.9" />
              <ellipse cx="148" cy="386" rx="4" ry="5" fill="#C84848" opacity="0.85" />
              <ellipse cx="182" cy="385" rx="4.5" ry="5.5" fill="#B83C3C" opacity="0.88" />
            </motion.g>
          </g>
        )

      default:
        return null
    }
  }

  return (
    <svg
      viewBox="0 0 320 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {plantContent()}
    </svg>
  )
}

export default Plant
