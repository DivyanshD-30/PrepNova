import { motion } from 'framer-motion'
import { FiCpu } from 'react-icons/fi'
import './TypingIndicator.scss'

export default function TypingIndicator() {
  return (
    <motion.div
      className="typing-indicator"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <span className="typing-indicator__avatar"><FiCpu /></span>
      <div className="typing-indicator__dots">
        <span /><span /><span />
      </div>
    </motion.div>
  )
}
