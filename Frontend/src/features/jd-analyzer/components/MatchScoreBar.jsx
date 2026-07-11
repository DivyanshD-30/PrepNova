import { motion } from 'framer-motion'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import './MatchScoreBar.scss'

function variantFor(pct) {
  if (pct >= 80) return 'success'
  if (pct >= 55) return 'primary'
  return 'warning'
}

/**
 * MatchScoreBar — overall profile-to-JD match percentage with summary.
 */
export default function MatchScoreBar({ percentage, seniorityMatch, roleSummary }) {
  const variant = variantFor(percentage)

  return (
    <GlassCard padding="lg" hoverable={false} glow={variant} className="match-score-bar">
      <div className="match-score-bar__top">
        <div>
          <p className="match-score-bar__label">Profile Match</p>
          <p className="match-score-bar__summary">{roleSummary}</p>
        </div>
        <Badge variant={variant} size="md">{seniorityMatch}</Badge>
      </div>

      <div className="match-score-bar__track">
        <motion.div
          className={`match-score-bar__fill match-score-bar__fill--${variant}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="match-score-bar__pct">{percentage}% match</p>
    </GlassCard>
  )
}
