import { motion } from 'framer-motion'
import './GradientBlobs.scss'

/**
 * Floating animated gradient blobs used as ambient background decoration.
 * Purely decorative — aria-hidden, pointer-events disabled.
 *
 * @param {'default'|'subtle'|'vivid'} intensity
 * @param {'full'|'top'|'bottom'} position - where blobs concentrate
 */
export default function GradientBlobs({ intensity = 'default', position = 'full' }) {
  return (
    <div className={`gradient-blobs gradient-blobs--${intensity} gradient-blobs--${position}`} aria-hidden="true">
      <motion.span
        className="blob blob--1"
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="blob blob--2"
        animate={{ x: [0, -50, 40, 0], y: [0, 50, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="blob blob--3"
        animate={{ x: [0, 40, -60, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="gradient-blobs__grid" />
    </div>
  )
}
