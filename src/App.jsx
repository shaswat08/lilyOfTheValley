import { useState, useMemo, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Plant from './Plant'
import WateringCharacter from './WateringCharacter'
import GattoCharacter from './GattoCharacter'
import {
  playWaterDrop,
  playSproutChime,
  playHappyBoing,
  playFlowerDing,
  playBloomBell,
  playHoverWhoosh
} from './audio'
import './index.css'

const STAGE_LABELS = [
  'A tiny seed...',
  'A green sprout',
  'Two delicate leaves',
  'Flower stalk rises',
  'Lily of the Valley'
]
const MESSAGES = [
  '',
  'Spring is coming~',
  'Growing stronger...',
  'Almost there...',
  "Beautiful, isn't it?"
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Frames played per water (subset of sheet). Pour is index `2` in this list → sheet frame `2`. */
const WATER_ANIM_FRAMES = [0, 1, 2, 3, 4, 5]
const POUR_STEP_INDEX = 2
const FRAME_MS = 120
const IDLE_SMILE_FRAME = 7

function App() {
  const [stage, setStage] = useState(0)
  const [spriteFrame, setSpriteFrame] = useState(IDLE_SMILE_FRAME)
  const [isWatering, setIsWatering] = useState(false)
  const [showDroplets, setShowDroplets] = useState(false)
  const [showEffects, setShowEffects] = useState(false)
  const [isWiggling, setIsWiggling] = useState(false)
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  const [dropletKey, setDropletKey] = useState(0)
  const [effectsKey, setEffectsKey] = useState(0)

  const wateringLockRef = useRef(false)

  const createDroplets = useMemo(() => {
    const droplets = []
    for (let i = 0; i < 8; i++) {
      droplets.push({
        id: `d-${i}`,
        left: 100 + Math.random() * 120,
        delay: Math.random() * 0.3
      })
    }
    return droplets
  }, [dropletKey])

  const createSparkles = useMemo(() => {
    const symbols = ['✨', '⭐', '✦']
    const sparkles = []
    for (let i = 0; i < 6; i++) {
      sparkles.push({
        id: `s-${i}`,
        left: 120 + Math.random() * 80,
        delay: Math.random() * 0.5,
        symbol: symbols[Math.floor(Math.random() * symbols.length)]
      })
    }
    return sparkles
  }, [effectsKey])

  const createHearts = useMemo(() => {
    const hearts = []
    for (let i = 0; i < 4; i++) {
      hearts.push({
        id: `h-${i}`,
        left: 130 + Math.random() * 60,
        delay: Math.random() * 0.4
      })
    }
    return hearts
  }, [effectsKey])

  const applyGrowthAfterPour = useCallback((fromStage) => {
    const newStage = fromStage + 1
    setStage(newStage)

    setDropletKey((k) => k + 1)
    setEffectsKey((k) => k + 1)
    setShowDroplets(true)
    setShowEffects(true)
    setIsWiggling(true)

    setTimeout(() => {
      setShowDroplets(false)
    }, 1500)

    setTimeout(() => {
      setShowEffects(false)
    }, 2000)

    setTimeout(() => {
      setIsWiggling(false)
    }, 800)

    setTimeout(() => {
      playSproutChime()
      setTimeout(() => {
        playHappyBoing()
      }, 300)
    }, 500)

    if (newStage === 4) {
      setTimeout(() => {
        playBloomBell()
        setShowCompletionMessage(true)
        for (let i = 0; i < 12; i++) {
          setTimeout(() => playFlowerDing(), i * 80)
        }
      }, 1200)
    } else {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => playFlowerDing(), 600 + i * 100)
      }
    }
  }, [])

  const handleWater = useCallback(() => {
    if (stage === 4 || wateringLockRef.current) return

    const startStage = stage
    wateringLockRef.current = true
    setIsWatering(true)

    ;(async () => {
      try {
        playWaterDrop()

        for (let i = 0; i < WATER_ANIM_FRAMES.length; i++) {
          setSpriteFrame(WATER_ANIM_FRAMES[i])
          await sleep(FRAME_MS)
          if (i === POUR_STEP_INDEX) {
            applyGrowthAfterPour(startStage)
          }
        }
      } finally {
        setSpriteFrame(IDLE_SMILE_FRAME)
        setIsWatering(false)
        wateringLockRef.current = false
      }
    })()
  }, [stage, applyGrowthAfterPour])

  const handleHover = () => {
    if (stage < 4 && !isWatering) {
      playHoverWhoosh()
    }
  }

  const plantVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -30
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    wiggle: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: [0, -3, 3, -2, 2, 0],
      transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 30,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="app">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="plant-stage">
          <div className="watering-character-slot">
            <WateringCharacter frameIndex={spriteFrame} />
          </div>

          <div className="plant-container">
            <motion.div
              className="soil-container"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={`plant-${stage}`}
                variants={plantVariants}
                initial="hidden"
                animate={isWiggling ? 'wiggle' : 'visible'}
                exit="exit"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}
              >
                <Plant stage={stage} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {showDroplets &&
                createDroplets.map((droplet) => (
                  <motion.div
                    key={`droplet-${droplet.id}`}
                    className="water-droplet"
                    style={{ left: `${droplet.left}px`, top: '50px' }}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{
                      opacity: [1, 1, 0],
                      y: 300,
                      x:
                        (parseInt(droplet.id.split('-')[1], 10) % 2 === 0 ? 1 : -1) *
                        Math.random() *
                        30
                    }}
                    transition={{
                      duration: 0.8 + Math.random() * 0.3,
                      delay: droplet.delay,
                      ease: 'easeIn'
                    }}
                  />
                ))}
            </AnimatePresence>

            <AnimatePresence>
              {showEffects &&
                createSparkles.map((sparkle) => (
                  <motion.div
                    key={`sparkle-${sparkle.id}`}
                    className="sparkle"
                    style={{
                      left: `${sparkle.left}px`,
                      bottom: '150px',
                      fontSize: '18px'
                    }}
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 0.5, 0],
                      y: -60
                    }}
                    transition={{
                      duration: 1,
                      delay: sparkle.delay
                    }}
                  >
                    {sparkle.symbol}
                  </motion.div>
                ))}
            </AnimatePresence>

            <AnimatePresence>
              {showEffects &&
                createHearts.map((heart) => (
                  <motion.div
                    key={`heart-${heart.id}`}
                    className="heart"
                    style={{ left: `${heart.left}px`, bottom: '120px' }}
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 0.8, 0],
                      y: -80
                    }}
                    transition={{
                      duration: 1.2,
                      delay: heart.delay
                    }}
                  >
                    💕
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          <div className="gatto-character-slot">
            <GattoCharacter />
          </div>
        </div>

        <p className="stage-label">{STAGE_LABELS[stage]}</p>

        <AnimatePresence>
          {stage > 0 && MESSAGES[stage] && (
            <motion.p
              key={`message-${stage}`}
              className="stage-label"
              style={{ fontSize: '0.9rem', color: '#A89B8C', marginTop: '-0.5rem' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              {MESSAGES[stage]}
            </motion.p>
          )}
        </AnimatePresence>

        {showCompletionMessage && (
          <motion.p
            className="complete-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            It bloomed just for you 🌸
          </motion.p>
        )}

        <motion.button
          className="water-btn"
          onClick={handleWater}
          onMouseEnter={handleHover}
          disabled={stage === 4 || isWatering}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {stage === 4 ? 'Already bloomed!' : isWatering ? 'Watering…' : 'Water it 💧'}
        </motion.button>
      </motion.div>

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="ambient-particle"
          style={{
            width: `${4 + (i % 3) * 2}px`,
            height: `${4 + (i % 3) * 2}px`,
            left: `${10 + i * 18}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 1.3}s`,
            animationDuration: `${6 + (i % 4)}s`
          }}
        />
      ))}
    </div>
  )
}

export default App
