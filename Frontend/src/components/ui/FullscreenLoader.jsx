import { motion } from 'framer-motion'
import { FiZap } from 'react-icons/fi'
import './FullscreenLoader.scss'

/**
 * FullscreenLoader — full-viewport branded loading state.
 * Used during auth checks, page-level data fetches, etc.
 */
export default function FullscreenLoader({ label = 'Loading...' }) {
  return (
    <div className="fullscreen-loader">
      <motion.div
        className="fullscreen-loader__icon"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <FiZap />
      </motion.div>
      <motion.p
        className="fullscreen-loader__label"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {label}
      </motion.p>
    </div>
  )
}
