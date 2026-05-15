import gattoSrc from './assets/gatto.png'

/** Static decorative cat sprite (faces left toward the plant). */
export default function GattoCharacter() {
  return (
    <div className="gatto-character" aria-hidden>
      <img src={gattoSrc} alt="" className="gatto-character__img" decoding="async" />
    </div>
  )
}
