import { FiCode, FiLayers, FiDatabase, FiCpu, FiUsers, FiServer, FiGitBranch, FiHash } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './FlashcardTopicPicker.scss'

const ICONS = {
  JavaScript: FiCode,
  React: FiLayers,
  'System Design': FiServer,
  'Data Structures': FiHash,
  Algorithms: FiCpu,
  Databases: FiDatabase,
  Behavioral: FiUsers,
  DevOps: FiGitBranch,
}

/**
 * FlashcardTopicPicker — grid of available flashcard topics.
 */
export default function FlashcardTopicPicker({ topics, onSelect }) {
  return (
    <div className="flashcard-topic-picker">
      <p className="flashcard-topic-picker__intro">Pick a topic to start reviewing flashcards.</p>
      <div className="flashcard-topic-picker__grid">
        {topics.map((topic, i) => {
          const Icon = ICONS[topic] || FiLayers
          return (
            <GlassCard key={topic} delay={i * 0.04} className="flashcard-topic-picker__card" padding="lg" onClick={() => onSelect(topic)}>
              <span className="flashcard-topic-picker__icon"><Icon /></span>
              <p>{topic}</p>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
