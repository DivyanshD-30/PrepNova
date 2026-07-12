import { useEffect, useState } from 'react'
import { FiClock } from 'react-icons/fi'
import './Timer.scss'

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Timer — counts up from 0, calls onTick with the current second count.
 * @param {boolean} running
 */
export default function Timer({ running = true, onTick }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1
        onTick?.(next)
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  return (
    <span className="timer">
      <FiClock /> {formatTime(seconds)}
    </span>
  )
}
