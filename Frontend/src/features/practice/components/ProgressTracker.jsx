import { motion } from 'framer-motion'
import GlassCard from '../../../components/ui/GlassCard'
import './ProgressTracker.scss'

/**
 * ProgressTracker — shows turns completed vs session length.
 */
export default function ProgressTracker({ current, total, topic }) {
  const pct = Math.min((current / total) * 100, 100)

  return (
    <GlassCard padding="lg" hoverable={false} className="progress-tracker">
      <div className="progress-tracker__header">
        <p className="progress-tracker__label">Session Progress</p>
        <p className="progress-tracker__count">{Math.min(current, total)} / {total}</p>
      </div>
      <div className="progress-tracker__track">
        <motion.div
          className="progress-tracker__fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="progress-tracker__topic">Topic: <span>{topic}</span></p>
    </GlassCard>
  )
}
