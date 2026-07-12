import { motion } from 'framer-motion'
import GlassCard from '../../../components/ui/GlassCard'
import './StarBreakdownChart.scss'

const LABELS = [
  { key: 'situation', label: 'Situation' },
  { key: 'task', label: 'Task' },
  { key: 'action', label: 'Action' },
  { key: 'result', label: 'Result' },
]

/**
 * StarBreakdownChart — bar breakdown of Situation/Task/Action/Result scores.
 */
export default function StarBreakdownChart({ breakdown }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="star-breakdown">
      <h3 className="star-breakdown__title">STAR Method Breakdown</h3>
      <div className="star-breakdown__bars">
        {LABELS.map((item, i) => (
          <div className="star-breakdown__row" key={item.key}>
            <span className="star-breakdown__label">{item.label}</span>
            <div className="star-breakdown__track">
              <motion.div
                className="star-breakdown__fill"
                initial={{ width: 0 }}
                animate={{ width: `${breakdown[item.key]}%` }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="star-breakdown__value">{breakdown[item.key]}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
