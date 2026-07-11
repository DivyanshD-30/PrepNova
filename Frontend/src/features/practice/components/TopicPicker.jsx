import { motion } from 'framer-motion'
import { FiCode, FiServer, FiLayers, FiUsers, FiPlay } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Button from '../../../components/ui/Button'
import { PRACTICE_TOPICS } from '../practice.data'
import './TopicPicker.scss'

const ICONS = {
  frontend: FiCode,
  backend: FiServer,
  'system-design': FiLayers,
  behavioral: FiUsers,
}

/**
 * TopicPicker — shown before a practice session starts.
 * @param {Function} onStart - called with the selected topic id
 */
export default function TopicPicker({ onStart }) {
  return (
    <div className="topic-picker">
      <motion.p
        className="topic-picker__intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Choose a focus area to start a live, conversational mock interview with our AI interviewer.
      </motion.p>

      <div className="topic-picker__grid">
        {PRACTICE_TOPICS.map((topic, i) => {
          const Icon = ICONS[topic.id]
          return (
            <GlassCard key={topic.id} delay={i * 0.06} className="topic-picker__card" padding="lg">
              <span className="topic-picker__icon"><Icon /></span>
              <h3>{topic.label}</h3>
              <Button variant="secondary" size="sm" icon={<FiPlay />} onClick={() => onStart(topic.id)}>
                Start Practice
              </Button>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
