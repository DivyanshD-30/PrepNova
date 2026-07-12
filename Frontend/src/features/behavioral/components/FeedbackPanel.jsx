import { FiCheckCircle, FiAlertCircle, FiStar } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import './FeedbackPanel.scss'

function scoreVariant(score) {
  if (score >= 80) return 'success'
  if (score >= 60) return 'primary'
  return 'warning'
}

/**
 * FeedbackPanel — overall score, feedback, strengths/improvements, example answer.
 */
export default function FeedbackPanel({ attempt }) {
  const variant = scoreVariant(attempt.score)

  return (
    <div className="feedback-panel">
      <GlassCard padding="lg" hoverable={false} glow={variant} className="feedback-panel__score-card">
        <div className="feedback-panel__score-ring" data-variant={variant} style={{ '--score': `${attempt.score}%` }}>
          <span>{attempt.score}</span>
        </div>
        <div className="feedback-panel__score-text">
          <Badge variant={variant} icon={<FiStar />}>Overall Score</Badge>
          <p>{attempt.feedback}</p>
        </div>
      </GlassCard>

      <div className="feedback-panel__columns">
        <GlassCard padding="lg" hoverable={false} glow="success">
          <h3 className="feedback-panel__col-title feedback-panel__col-title--success">
            <FiCheckCircle /> Strengths
          </h3>
          <ul>
            {attempt.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </GlassCard>

        <GlassCard padding="lg" hoverable={false} glow="secondary">
          <h3 className="feedback-panel__col-title feedback-panel__col-title--warning">
            <FiAlertCircle /> Improvements
          </h3>
          <ul>
            {attempt.improvements.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </GlassCard>
      </div>

      <GlassCard padding="lg" hoverable={false} className="feedback-panel__example">
        <h3>Example Answer</h3>
        <p>{attempt.exampleAnswer}</p>
      </GlassCard>
    </div>
  )
}
