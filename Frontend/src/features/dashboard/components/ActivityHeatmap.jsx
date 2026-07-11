import { motion } from 'framer-motion'
import GlassCard from '../../../components/ui/GlassCard'
import './ActivityHeatmap.scss'

/**
 * ActivityHeatmap — GitHub-style grid showing daily practice intensity.
 * @future-endpoint GET /api/dashboard/heatmap
 */
export default function ActivityHeatmap({ data, streakDays }) {
  // group into weeks of 7 for column-based rendering
  const weeks = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <GlassCard padding="lg" hoverable={false} className="activity-heatmap">
      <div className="activity-heatmap__header">
        <div>
          <h3>Daily Streak</h3>
          <p>Your practice activity over the last 12 weeks</p>
        </div>
        <div className="activity-heatmap__streak">
          <span className="activity-heatmap__streak-value">{streakDays}</span>
          <span className="activity-heatmap__streak-label">day streak</span>
        </div>
      </div>

      <div className="activity-heatmap__grid">
        {weeks.map((week, wi) => (
          <div className="activity-heatmap__col" key={wi}>
            {week.map((cell) => (
              <motion.span
                key={cell.day}
                className={`activity-heatmap__cell activity-heatmap__cell--${cell.intensity}`}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: cell.day * 0.003 }}
                title={`Activity level ${cell.intensity}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="activity-heatmap__legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className={`activity-heatmap__cell activity-heatmap__cell--${level}`} />
        ))}
        <span>More</span>
      </div>
    </GlassCard>
  )
}
