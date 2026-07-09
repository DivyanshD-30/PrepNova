import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'

/**
 * AnimatedCounter — counts up from 0 to `value` when scrolled into view.
 */
export default function AnimatedCounter({ value, suffix = '', duration = 1.6 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const startTime = performance.now()

    const step = (now) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, value, duration])

  return (
    <motion.span ref={ref}>
      {display.toLocaleString()}{suffix}
    </motion.span>
  )
}
