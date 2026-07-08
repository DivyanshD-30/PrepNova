import { motion } from 'framer-motion'
import './GlassCard.scss'

/**
 * GlassCard — the base glassmorphic surface used across the entire app.
 *
 * @param {boolean} hoverable - lifts + glows on hover
 * @param {boolean} animate - fade/slide in on mount
 * @param {number} delay - stagger delay (seconds) for entrance animation
 * @param {'default'|'primary'|'secondary'|'accent'|'success'} glow - glow color on hover
 * @param {'none'|'sm'|'md'|'lg'} padding
 */
export default function GlassCard({
  children,
  hoverable = true,
  animate = true,
  delay = 0,
  glow = 'default',
  padding = 'md',
  className = '',
  as: Component = motion.div,
  ...rest
}) {
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
      }
    : {}

  return (
    <Component
      className={`glass-card glass-card--glow-${glow} glass-card--pad-${padding} ${
        hoverable ? 'glass-card--hoverable' : ''
      } ${className}`}
      {...animationProps}
      {...rest}
    >
      {children}
    </Component>
  )
}
