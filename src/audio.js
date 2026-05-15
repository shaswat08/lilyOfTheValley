let audioContext = null

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

const createEnvelope = (ctx, startTime, attack = 0.01, decay = 0.1, sustain = 0.3, release = 0.3) => {
  return {
    attack,
    decay,
    sustain,
    release,
    startTime
  }
}

const playWaterDrop = () => {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(800, now)
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.15)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(now)
    oscillator.stop(now + 0.2)
  } catch (e) {
    console.log('Audio not available')
  }
}

const playSproutChime = () => {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const frequencies = [523.25, 659.25, 783.99]

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq * (0.95 + Math.random() * 0.1), now + i * 0.08)

      gainNode.gain.setValueAtTime(0, now + i * 0.08)
      gainNode.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start(now + i * 0.08)
      oscillator.stop(now + i * 0.08 + 0.4)
    })
  } catch (e) {
    console.log('Audio not available')
  }
}

const playHappyBoing = () => {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(300, now)
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.05)
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(now)
    oscillator.stop(now + 0.25)
  } catch (e) {
    console.log('Audio not available')
  }
}

const playFlowerDing = () => {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = 'triangle'
    const baseFreq = 1200 + Math.random() * 200
    oscillator.frequency.setValueAtTime(baseFreq, now)
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.15)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(now)
    oscillator.stop(now + 0.2)
  } catch (e) {
    console.log('Audio not available')
  }
}

const playBloomBell = () => {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const bellFreqs = [523.25, 659.25, 783.99, 1046.5]

    bellFreqs.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, now)

      const volume = 0.15 / (i + 1)
      gainNode.gain.setValueAtTime(0, now + i * 0.15)
      gainNode.gain.linearRampToValueAtTime(volume, now + i * 0.15 + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 1.2)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start(now + i * 0.15)
      oscillator.stop(now + i * 0.15 + 1.2)
    })

    const shimmer = ctx.createOscillator()
    const shimmerGain = ctx.createGain()
    shimmer.type = 'sine'
    shimmer.frequency.setValueAtTime(2093, now + 0.6)
    shimmerGain.gain.setValueAtTime(0, now + 0.6)
    shimmerGain.gain.linearRampToValueAtTime(0.05, now + 0.7)
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
    shimmer.connect(shimmerGain)
    shimmerGain.connect(ctx.destination)
    shimmer.start(now + 0.6)
    shimmer.stop(now + 1.5)
  } catch (e) {
    console.log('Audio not available')
  }
}

const playHoverWhoosh = () => {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(150, now)
    oscillator.frequency.linearRampToValueAtTime(300, now + 0.1)
    oscillator.frequency.linearRampToValueAtTime(200, now + 0.2)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.06, now + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(now)
    oscillator.stop(now + 0.2)
  } catch (e) {
    console.log('Audio not available')
  }
}

export {
  playWaterDrop,
  playSproutChime,
  playHappyBoing,
  playFlowerDing,
  playBloomBell,
  playHoverWhoosh
}