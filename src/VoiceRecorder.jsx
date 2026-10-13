import { useRef, useState } from 'react'
import { month12Copy } from './month12Copy.js'
import './VoiceRecorder.css'

const AUDIO_SOURCE = '/audio/anniversary-message.mp3'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function PlayIcon({ isPlaying }) {
  return isPlaying ? (
    <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M6 4h3v12H6zM11 4h3v12h-3z" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M6 3.5v13l10-6.5-10-6.5Z" /></svg>
  )
}

function ReplayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M4.2 8.1A6.2 6.2 0 1 1 4 11M4 4.5v4h4" />
    </svg>
  )
}

export default function VoiceRecorder() {
  const audioRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [hasEnded, setHasEnded] = useState(false)
  const [showEnding, setShowEnding] = useState(false)

  const isPlaying = status === 'playing'
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio || status === 'error') return

    if (isPlaying) {
      audio.pause()
      return
    }

    if (audio.ended) audio.currentTime = 0
    try {
      await audio.play()
    } catch {
      setStatus('error')
    }
  }

  async function replayRecording() {
    const audio = audioRef.current
    if (!audio || status === 'error') return
    audio.currentTime = 0
    setCurrentTime(0)
    try {
      await audio.play()
    } catch {
      setStatus('error')
    }
  }

  function seekTo(value) {
    const nextTime = Number(value)
    if (!audioRef.current || !Number.isFinite(nextTime)) return
    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function retryLoading() {
    if (!audioRef.current) return
    setStatus('loading')
    audioRef.current.load()
  }

  return (
    <div className={`recorder-wrap ${isPlaying ? 'is-playing' : ''}`}>
      <audio
        ref={audioRef}
        src={AUDIO_SOURCE}
        preload="metadata"
        onLoadStart={() => setStatus('loading')}
        onLoadedMetadata={(event) => {
          const actualDuration = event.currentTarget.duration
          if (Number.isFinite(actualDuration)) setDuration(actualDuration)
          setStatus((previousStatus) => previousStatus === 'loading' ? 'ready' : previousStatus)
        }}
        onCanPlay={() => setStatus((previousStatus) => previousStatus === 'loading' ? 'ready' : previousStatus)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setStatus('playing')}
        onPlaying={() => setStatus('playing')}
        onPause={(event) => {
          if (!event.currentTarget.ended) setStatus('paused')
        }}
        onEnded={() => {
          setCurrentTime(duration)
          setStatus('ended')
          setHasEnded(true)
          setShowEnding(true)
        }}
        onError={() => setStatus('error')}
      />

      <div className="recorder-shell">
        <div className="recorder-topline">
          <span className="device-name">SONORA <i>·</i> 120</span>
          <span className="device-light" aria-hidden="true" />
          <span className="device-type">VOICE / PLAYBACK</span>
        </div>

        <div className="recorder-display" aria-live="polite">
          <div className="display-meta">
            <span>{status === 'playing' ? 'NOW PLAYING' : status === 'error' ? 'AUDIO NOT FOUND' : status === 'loading' ? 'LOADING TAPE' : status === 'ended' ? 'END OF TAPE' : 'READY WHEN YOU ARE'}</span>
            <span className="display-counter">REC 001</span>
          </div>
          <div className="cassette" aria-label="Vintage cassette illustration">
            <div className="cassette-screw screw-one" />
            <div className="cassette-screw screw-two" />
            <div className="cassette-label">
              <span className="cassette-label-small">SIDE A · PERSONAL</span>
              <span className="cassette-label-title">FOR YOU</span>
              <span className="cassette-label-sub">RECORDING 001</span>
            </div>
            <div className="reel-window">
              <span className="reel reel-left"><i /><i /><i /></span>
              <span className="tape-line" />
              <span className="reel reel-right"><i /><i /><i /></span>
            </div>
            <div className="cassette-bottom-mark">60 MIN · TYPE I</div>
          </div>
          <div className="digital-readout">
            <span>{formatTime(currentTime)}</span>
            <span className="readout-slash">/</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 31 }, (_, index) => <i key={index} style={{ '--bar': `${20 + ((index * 19) % 73)}%` }} />)}
          </div>
        </div>

        <div className="recorder-controls">
          <label className="sr-only" htmlFor="recording-seek">Seek within recording</label>
          <input
            id="recording-seek"
            className="seek-slider"
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            style={{ '--seek-progress': `${progress}%` }}
            onChange={(event) => seekTo(event.target.value)}
            disabled={status === 'loading' || status === 'error' || duration <= 0}
          />
          <div className="time-labels"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
          <div className="button-bank">
            <button className="control-button replay-button" type="button" onClick={replayRecording} disabled={status === 'loading' || status === 'error'} aria-label="Replay recording from the beginning">
              <ReplayIcon /><span>REPLAY</span>
            </button>
            <button className="control-button play-button" type="button" onClick={togglePlayback} disabled={status === 'loading' || status === 'error'} aria-label={isPlaying ? 'Pause recording' : 'Play recording'}>
              <PlayIcon isPlaying={isPlaying} /><span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>
            <span className="control-caption" aria-live="polite">{status === 'loading' ? 'LOADING' : status === 'error' ? 'CHECK AUDIO' : status === 'playing' ? 'ON AIR' : status === 'ended' ? 'COMPLETE' : 'STANDBY'}</span>
          </div>
          {status === 'error' && (
            <div className="audio-error" role="alert">
              <p>Your recording isn't here yet. Add your M4A at <code>public/audio/anniversary-message.m4a</code>.</p>
              <button type="button" onClick={retryLoading}>Try again</button>
            </div>
          )}
        </div>
      </div>

      <div className="recorder-footnote"><span>NO. 001</span><span>KEEP THIS ONE CLOSE</span></div>

      {(hasEnded || showEnding) && (
        <section className="ending-note" aria-live="polite" aria-labelledby="ending-title">
          <p>{month12Copy.endingBody}</p>
          <h2 id="ending-title">{month12Copy.endingTitle}</h2>
        </section>
      )}
      {!showEnding && !hasEnded && (
        <button className="reveal-ending" type="button" onClick={() => setShowEnding(true)}>
          Read the closing note
        </button>
      )}
    </div>
  )
}