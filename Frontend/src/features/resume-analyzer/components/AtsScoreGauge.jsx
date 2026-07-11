import { motion } from 'framer-motion'
import GlassCard from '../../../components/ui/GlassCard'
import './AtsScoreGauge.scss'

function scoreVariant(score) {
  if (score >= 80) return 'success'
  if (score >= 60) return 'primary'
  return 'warning'
}

/**
 * AtsScoreGauge — large circular ATS score + a breakdown of sub-scores.
 */
export default function AtsScoreGauge({ score, breakdown }) {
  const variant = scoreVariant(score)

  return (
    <GlassCard padding="lg" hoverable={false} glow={variant} className="ats-gauge">
      <p className="ats-gauge__label">ATS Compatibility Score</p>

      <div className="ats-gauge__ring" style={{ '--score': `${score}%` }} data-variant={variant}>
        <span className="ats-gauge__value">{score}</span>
        <span className="ats-gauge__pct">/ 100</span>
      </div>

      <p className="ats-gauge__summary">
        {score >= 80
          ? 'Excellent — your resume is well optimized for ATS systems.'
          : score >= 60
          ? 'Good, with room to improve keyword coverage and structure.'
          : 'Needs work — several ATS compatibility issues found.'}
      </p>

      <div className="ats-gauge__breakdown">
        {breakdown.map((item, i) => (
          <div className="ats-gauge__bar-row" key={item.label}>
            <span className="ats-gauge__bar-label">{item.label}</span>
            <div className="ats-gauge__bar-track">
              <motion.div
                className="ats-gauge__bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="ats-gauge__bar-value">{item.value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
