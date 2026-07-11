import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCpu, FiUser } from 'react-icons/fi'
import './ChatBubble.scss'

/**
 * ChatBubble — single message in the practice conversation.
 * AI messages type out character-by-character on first render.
 *
 * @param {'ai'|'user'} role
 * @param {string} text
 * @param {boolean} animateTyping - only true for the most recently added AI message
 */
export default function ChatBubble({ role, text, animateTyping = false }) {
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
      className={`chat-bubble chat-bubble--${role}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="chat-bubble__avatar">
        {role === 'ai' ? <FiCpu /> : <FiUser />}
      </span>
      <div className="chat-bubble__content">
        <p>{displayed}</p>
      </div>
    </motion.div>
  )
}
