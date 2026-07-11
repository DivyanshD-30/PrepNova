import { motion } from 'framer-motion'
import { FiMic, FiType } from 'react-icons/fi'
import './VoiceModeToggle.scss'

/**
 * VoiceModeToggle — switches the input mode between typing and voice.
 * Voice capture itself is a UI placeholder (no real speech-to-text wired
 * up yet) — see practice.data.js future endpoints for the real integration.
 *
 * @param {'text'|'voice'} mode
 * @param {Function} onChange
 */
export default function VoiceModeToggle({ mode, onChange }) {
  return (
    <div className="voice-toggle">
      <button
        className={`voice-toggle__btn ${mode === 'text' ? 'is-active' : ''}`}
        onClick={() => onChange('text')}
        type="button"
      >
        <FiType /> Text
      </button>
      <button
        className={`voice-toggle__btn ${mode === 'voice' ? 'is-active' : ''}`}
        onClick={() => onChange('voice')}
        type="button"
      >
        <FiMic /> Voice
        {mode === 'voice' && (
          <motion.span
            className="voice-toggle__pulse"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
      </button>
    </div>
  )
}
