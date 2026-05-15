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

function cubicPoint(s, u) {
  const mt = 1 - u
  return {
    x:
      mt * mt * mt * s.x0 +
      3 * mt * mt * u * s.x1 +
      3 * mt * u * u * s.x2 +
      u * u * u * s.x3,
    y:
      mt * mt * mt * s.y0 +
      3 * mt * mt * u * s.y1 +
      3 * mt * u * u * s.y2 +
      u * u * u * s.y3
  }
}

function cubicTangent(s, u) {
  const mt = 1 - u
  return {
    dx:
      3 * mt * mt * (s.x1 - s.x0) +
      6 * mt * u * (s.x2 - s.x1) +
      3 * u * u * (s.x3 - s.x2),
    dy:
      3 * mt * mt * (s.y1 - s.y0) +
      6 * mt * u * (s.y2 - s.y1) +
      3 * u * u * (s.y3 - s.y2)
  }
}

function pointOnStalk(segments, tGlobal) {
  const n = segments.length
  const f = Math.min(0.999, Math.max(0, tGlobal)) * n
  const i = Math.min(Math.floor(f), n - 1)
  const u = f - i
  return cubicPoint(segments[i], u)
}

/** Position + left normal + tangent angle (deg) along stalk */
function frameOnStalk(segments, tGlobal) {
  const n = segments.length
  const f = Math.min(0.999, Math.max(0, tGlobal)) * n
  const i = Math.min(Math.floor(f), n - 1)
  const u = f - i
  const s = segments[i]
  const p = cubicPoint(s, u)
  const { dx, dy } = cubicTangent(s, u)
  const len = Math.hypot(dx, dy) || 1
  const tx = dx / len
  const ty = dy / len
  const nx = -ty
  const ny = tx
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
  return { ...p, nx, ny, tx, ty, angleDeg }
}

/** Nodding lily-of-the-valley bell (cup + short pedicel), not radial “star” petals */
const BellFlower = ({ cx, cy, rotationDeg, delay, scale = 1 }) => (
  <g transform={`translate(${cx},${cy})`}>
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale }}
      transition={{ ...springBounce, delay, duration: 0.32 }}
      style={{ transformOrigin: '0px 0px' }}
    >
      <g transform={`rotate(${rotationDeg})`}>
        <line
          x1="0"
          y1="-5"
          x2="0"
          y2="4"
          stroke="#6B7F62"
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <path
          d="M -4.6 4
             C -5.6 8.2, -4.4 13.5, -1.4 15.8
             Q 0 16.8 1.4 15.8
             C 4.4 13.5, 5.6 8.2, 4.6 4
             Q 0 2.6 -4.6 4 Z"
          fill="#F7FAF6"
          stroke="#C4D6BE"
          strokeWidth="0.42"
        />
        <path
          d="M -3.2 5.5 Q 0 7 3.2 5.5"
          fill="none"
          stroke="#D8E6D2"
          strokeWidth="0.5"
          opacity="0.7"
        />
        <ellipse
          cx="-1.4"
          cy="9.5"
          rx="1.6"
          ry="3"
          fill="#FFFFFF"
          opacity="0.55"
          transform="rotate(-10)"
        />
      </g>
    </motion.g>
  </g>
)

/** Green bud before bloom */
const Bud = ({ cx, cy, delay }) => (
  <motion.ellipse
    cx={cx}
    cy={cy}
    rx="3.2"
    ry="4.8"
    fill="#5A7A52"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ ...springBounce, delay }}
  />
)

/**
 * Multiple arching scapes from the crown. Each has SVG path + cubic segments
 * (same structure as pointOnStalk). Flowers use `flowerTs`; buds use `budTs`.
 */
const STALKS = [
  {
    id: 'left',
    path: 'M 154 379 C 132 338, 112 285, 108 228 C 104 182, 110 140, 122 102',
    segments: [
      { x0: 154, y0: 379, x1: 132, y1: 338, x2: 112, y2: 285, x3: 108, y3: 228 },
      { x0: 108, y0: 228, x1: 104, y1: 182, x2: 110, y2: 140, x3: 122, y3: 102 }
    ],
    flowerTs: [
      0.22, 0.28, 0.34, 0.4, 0.46, 0.52, 0.58, 0.64, 0.7, 0.76, 0.82, 0.9
    ],
    budTs: [0.35, 0.58, 0.82],
    pathDelay: 0.32,
    stemWidth: 2.4
  },
  {
    id: 'center',
    path: 'M 160 378 C 162 340, 168 295, 178 248 C 186 210, 192 175, 188 138 C 185 108, 178 88, 172 78',
    segments: [
      { x0: 160, y0: 378, x1: 162, y1: 340, x2: 168, y2: 295, x3: 178, y3: 248 },
      { x0: 178, y0: 248, x1: 186, y1: 210, x2: 192, y2: 175, x3: 188, y3: 138 },
      { x0: 188, y0: 138, x1: 185, y1: 108, x2: 178, y2: 88, x3: 172, y3: 78 }
    ],
    flowerTs: [
      0.16, 0.23, 0.3, 0.37, 0.44, 0.51, 0.58, 0.65, 0.72, 0.79, 0.86, 0.93
    ],
    budTs: [0.3, 0.52, 0.75],
    pathDelay: 0.38,
    stemWidth: 2.7
  },
  {
    id: 'right',
    path: 'M 166 379 C 188 332, 212 275, 218 218 C 222 168, 214 125, 198 92',
    segments: [
      { x0: 166, y0: 379, x1: 188, y1: 332, x2: 212, y2: 275, x3: 218, y3: 218 },
      { x0: 218, y0: 218, x1: 222, y1: 168, x2: 214, y2: 125, x3: 198, y3: 92 }
    ],
    flowerTs: [
      0.24, 0.3, 0.36, 0.42, 0.48, 0.54, 0.6, 0.66, 0.72, 0.78, 0.84, 0.9
    ],
    budTs: [0.36, 0.62],
    pathDelay: 0.44,
    stemWidth: 2.5
  },
  {
    id: 'far-right',
    path: 'M 170 381 C 198 360, 228 310, 242 250 C 252 195, 246 145, 228 108',
    segments: [
      { x0: 170, y0: 381, x1: 198, y1: 360, x2: 228, y2: 310, x3: 242, y3: 250 },
      { x0: 242, y0: 250, x1: 252, y1: 195, x2: 246, y2: 145, x3: 228, y3: 108 }
    ],
    flowerTs: [
      0.3, 0.36, 0.42, 0.48, 0.54, 0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 0.96
    ],
    budTs: [0.4, 0.65],
    pathDelay: 0.52,
    stemWidth: 2.2
  }
]

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
            {STALKS.map((stalk, si) => (
              <g key={stalk.id}>
                <motion.path
                  d={stalk.path}
                  stroke="#5A7050"
                  strokeWidth={stalk.stemWidth + 0.6}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.05,
                    delay: stalk.pathDelay,
                    ease: 'easeOut'
                  }}
                />
                <motion.path
                  d={stalk.path}
                  stroke="#8FA688"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.05,
                    delay: stalk.pathDelay,
                    ease: 'easeOut'
                  }}
                />
                {stalk.budTs.map((t, bi) => {
                  const fr = frameOnStalk(stalk.segments, t)
                  return (
                    <Bud
                      key={`${stalk.id}-bud-${bi}`}
                      cx={fr.x + fr.nx * 5}
                      cy={fr.y + fr.ny * 5}
                      delay={0.85 + si * 0.06 + bi * 0.05}
                    />
                  )
                })}
              </g>
            ))}
          </g>
        )

      case 4:
        return (
          <g>
            <Soil />
            <BasalLeaf side={-1} tipX={92} tipY={108} width={1.05} delay={0.05} />
            <BasalLeaf side={1} tipX={228} tipY={112} width={1.02} delay={0.12} />
            {STALKS.map((stalk, si) => (
              <g key={stalk.id}>
                <motion.path
                  d={stalk.path}
                  stroke="#4F6348"
                  strokeWidth={stalk.stemWidth + 0.5}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.15 + si * 0.05,
                    ease: 'easeOut'
                  }}
                />
                <motion.path
                  d={stalk.path}
                  stroke="#7D9075"
                  strokeWidth="0.9"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.38"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.15 + si * 0.05,
                    ease: 'easeOut'
                  }}
                />
                {stalk.flowerTs.map((t, fi) => {
                  const fr = frameOnStalk(stalk.segments, t)
                  const ox = fr.nx * 4.3
                  const oy = fr.ny * 4.3
                  const rot = fr.angleDeg + 90
                  return (
                    <BellFlower
                      key={`${stalk.id}-fl-${fi}`}
                      cx={fr.x + ox}
                      cy={fr.y + oy}
                      rotationDeg={rot}
                      delay={0.4 + si * 0.06 + fi * 0.045}
                      scale={0.86 + (fi % 3) * 0.03}
                    />
                  )
                })}
              </g>
            ))}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
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
