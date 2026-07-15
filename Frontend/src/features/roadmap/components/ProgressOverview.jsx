import { motion } from 'framer-motion'
import { FiTarget } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './ProgressOverview.scss'

/**
 * ProgressOverview — overall completion across all weeks.
 */
export default function ProgressOverview({ roadmap }) {
  const allTasks = roadmap.weeks.flatMap((w) => w.tasks)
  const completed = allTasks.filter((t) => t.completed).length
  const total = allTasks.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <GlassCard padding="lg" hoverable={false} glow="primary" className="progress-overview">
      <div className="progress-overview__header">
        <div>
          <p className="progress-overview__role">{roadmap.targetRole}</p>
          <p className="progress-overview__sub">{roadmap.durationWeeks}-week plan &bull; {completed} / {total} tasks done</p>
        </div>
        <div className="progress-overview__pct">
          <FiTarget /> {pct}%
        </div>
      </div>

      <div className="progress-overview__track">
        <motion.div
          className="progress-overview__fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {roadmap.overview && <p className="progress-overview__overview">{roadmap.overview}</p>}
    </GlassCard>
  )
}
