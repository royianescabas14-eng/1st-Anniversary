import { useEffect, useState } from 'react'
import VoiceRecorder from './VoiceRecorder.jsx'
import { month12Copy } from './month12Copy.js'
import './Month12.css'

const UNLOCK_AT = new Date('2026-10-13T16:00:00.000Z').getTime()
const COUNTDOWN_ENABLED = true

function SparkleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className="sparkle-mark">
      <path d="M14 1.5c1.4 6.1 4.4 9.1 12.5 12.5C18.4 17.4 15.4 20.4 14 26.5 12.6 20.4 9.6 17.4 1.5 14 9.6 10.6 12.6 7.6 14 1.5Z" />
    </svg>
  )
}

export default function Month12() {
  const [isOpen, setIsOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!COUNTDOWN_ENABLED) return undefined

    const updateCountdown = () => {
      const currentTime = Date.now()
      setNow(currentTime)
      if (currentTime >= UNLOCK_AT) window.clearInterval(intervalId)
    }
    const intervalId = window.setInterval(updateCountdown, 1000)
    updateCountdown()
    return () => window.clearInterval(intervalId)
  }, [])

  const secondsLeft = Math.max(0, Math.ceil((UNLOCK_AT - now) / 1000))
  const countdown = {
    days: Math.floor(secondsLeft / 86400),
    hours: Math.floor((secondsLeft % 86400) / 3600),
    minutes: Math.floor((secondsLeft % 3600) / 60),
    seconds: secondsLeft % 60,
  }

  return (
    <main className="anniversary-page">
      <div className="page-grain" aria-hidden="true" />
      <header className="page-header">
        <span className="edition-mark"><SparkleMark /> A YEAR WITH YOU</span>
        <span className="header-date">14 · 10 · 26</span>
      </header>

      {COUNTDOWN_ENABLED && now < UNLOCK_AT ? (
        <section className="countdown-screen" aria-labelledby="countdown-title">
          <div className="intro-stamp" aria-hidden="true">XII</div>
          <p className="eyebrow">A LITTLE MORE, THEN IT'S OURS</p>
          <h1 id="countdown-title">Until midnight, <span>Lalove</span></h1>
          <p className="countdown-copy">Secret</p>
          <div className="countdown-clock" aria-label="Time remaining until the recording unlocks">
            {Object.entries(countdown).map(([unit, value]) => (
              <div className="countdown-unit" key={unit}>
                <span className="countdown-value">{String(value).padStart(2, '0')}</span>
                <span className="countdown-label">{unit}</span>
              </div>
            ))}
          </div>
          <p className="unlock-note">UNLOCKS OCTOBER 14 · 12:00 AM<br />PHILIPPINE TIME (UTC+8)</p>
        </section>
      ) : !isOpen ? (
        <section className="intro-screen" aria-labelledby="intro-title">
          <div className="intro-stamp" aria-hidden="true">XII</div>
          <p className="eyebrow">ONE YEAR, AND A LITTLE MORE TO SAY</p>
          <h1 id="intro-title">{month12Copy.introTitle}</h1>
          <p className="intro-copy">{month12Copy.introBody}</p>
          <button className="open-button" onClick={() => setIsOpen(true)}>
            <span>Open Your Recording</span>
            <span className="button-arrow" aria-hidden="true">↗</span>
          </button>
          <p className="intro-footnote">MADE WITH LOVE · OCTOBER 2026</p>
        </section>
      ) : (
        <section className="recording-screen" aria-label="First anniversary voice recording">
          <div className="recording-heading">
            <p className="eyebrow">A LITTLE SOMETHING, JUST FOR YOU</p>
            <h1>Press play, <span>Lalove.</span></h1>
          </div>
          <VoiceRecorder />
          <p className="recording-whisper">{month12Copy.recorderWhisper}</p>
          <NoteDetails />
        </section>
      )}

      <footer className="page-footer">
        <span>MONTH TWELVE</span>
        <span className="footer-heart" aria-hidden="true">♡</span>
        <span>ALWAYS, YOURS</span>
      </footer>
    </main>
  )
}

function NoteDetails() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <details className="note-details" open={isExpanded} onToggle={(event) => setIsExpanded(event.currentTarget.open)}>
      <summary>{month12Copy.noteHeading}</summary>
      <p>{month12Copy.noteBody}</p>
    </details>
  )
}