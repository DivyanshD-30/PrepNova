import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCpu, FiUser } from 'react-icons/fi'
import Badge from '../../../components/ui/Badge'
import './HrChatBubble.scss'

const TONE_VARIANT = { confident: 'success', neutral: 'default', hesitant: 'warning' }

/**
 * HrChatBubble — message in the HR round conversation. User messages can
 * carry a `detectedTone` badge — see ai.service.js generateHrReply() for
 * the exact limitation (text-only heuristic, not real emotion analysis).
 */
export default function HrChatBubble({ role, text, detectedTone, animateTyping = false }) {
  const [displayed, setDisplayed] = useState(animateTyping ? '' : text)

  useEffect(() => {
    if (!animateTyping) {
      setDisplayed(text)
      return
    }
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 14)
    return () => clearInterval(interval)
  }, [text, animateTyping])

  return (
    <motion.div
      className={`hr-chat-bubble hr-chat-bubble--${role}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="hr-chat-bubble__avatar">
        {role === 'ai' ? <FiCpu /> : <FiUser />}
      </span>
      <div className="hr-chat-bubble__content">
        <p>{displayed}</p>
        {detectedTone && (
          <Badge variant={TONE_VARIANT[detectedTone]} size="sm" className="hr-chat-bubble__tone">
            {detectedTone}
          </Badge>
        )}
      </div>
    </motion.div>
  )
}
