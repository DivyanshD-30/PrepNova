import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import EmptyState from '../../../components/ui/EmptyState'
import './BehavioralHistoryList.scss'

function scoreVariant(score) {
  if (score >= 80) return 'success'
  if (score >= 60) return 'primary'
  return 'warning'
}

/**
 * BehavioralHistoryList — past behavioral question attempts.
 * @backend GET /api/behavioral/history
 */
export default function BehavioralHistoryList({ data }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="behavioral-history">
      <h3 className="behavioral-history__title">Past Attempts</h3>
      {data.length === 0 ? (
        <EmptyState compact title="No attempts yet" description="Answer your first question to start building your history." />
      ) : (
        <ul className="behavioral-history__list">
          {data.map((item) => (
            <li key={item._id} className="behavioral-history-row">
              <div className="behavioral-history-row__main">
                <p className="behavioral-history-row__question">{item.question}</p>
                <Badge variant="default" size="sm">{item.category}</Badge>
              </div>
              <Badge variant={scoreVariant(item.score)} size="sm">{item.score}</Badge>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}
