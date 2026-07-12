import { FiTrendingUp } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import './ConfidenceScoreCard.scss'

function scoreVariant(score) {
  if (score >= 80) return 'success'
  if (score >= 60) return 'primary'
  return 'warning'
}

/**
 * ConfidenceScoreCard — confidence score + summary shown when a session ends.
 *
 * Reminder: confidenceScore is a text-only heuristic (hedging language,
 * directness) read from the transcript — not real voice/facial emotion
 * analysis. See ai.service.js summarizeHrSession() for the exact limitation.
 */
export default function ConfidenceScoreCard({ confidenceScore, summary }) {
  if (confidenceScore == null) return null
  const variant = scoreVariant(confidenceScore)

  return (
    <GlassCard padding="lg" hoverable={false} glow={variant} className="confidence-score-card">
      <div className="confidence-score-card__top">
        <div className="confidence-score-card__ring" data-variant={variant} style={{ '--score': `${confidenceScore}%` }}>
          <span>{confidenceScore}</span>
        </div>
        <div>
          <Badge variant={variant} icon={<FiTrendingUp />}>Confidence Score</Badge>
          <p className="confidence-score-card__note">Based on tone, clarity, and directness across the conversation</p>
        </div>
      </div>
      <p className="confidence-score-card__summary">{summary}</p>
    </GlassCard>
  )
}
