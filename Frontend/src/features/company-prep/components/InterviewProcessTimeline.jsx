import { motion } from 'framer-motion'
import { FiClock } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './InterviewProcessTimeline.scss'

/**
 * InterviewProcessTimeline — ordered list of interview rounds.
 */
export default function InterviewProcessTimeline({ rounds }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="process-timeline">
      <h3 className="process-timeline__title">Interview Process</h3>
      <div className="process-timeline__list">
        {rounds.map((round, i) => (
          <motion.div
            key={round.name}
            className="process-step"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <span className="process-step__number">{i + 1}</span>
            <div className="process-step__body">
              <div className="process-step__header">
                <p className="process-step__name">{round.name}</p>
                {round.durationMinutes && (
                  <span className="process-step__duration"><FiClock /> {round.durationMinutes} min</span>
                )}
              </div>
              <p className="process-step__desc">{round.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
