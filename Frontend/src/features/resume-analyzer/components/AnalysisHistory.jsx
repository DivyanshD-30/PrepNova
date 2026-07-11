import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import EmptyState from '../../../components/ui/EmptyState'
import './AnalysisHistory.scss'

function scoreVariant(score) {
  if (score >= 80) return 'success'
  if (score >= 60) return 'primary'
  return 'warning'
}

/**
 * AnalysisHistory — list of previous resume analyses.
 * @future-endpoint GET /api/resume/history
 */
export default function AnalysisHistory({ data, onSelect }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="analysis-history">
      <h3 className="analysis-history__title">Past Analyses</h3>
      {data.length === 0 ? (
        <EmptyState compact title="No history yet" description="Your past resume analyses will show up here." />
      ) : (
        <ul className="analysis-history__list">
          {data.map((item) => (
            <li key={item.id} className="analysis-history-row" onClick={() => onSelect?.(item.id)}>
              <div className="analysis-history-row__main">
                <p className="analysis-history-row__name">{item.fileName}</p>
                <p className="analysis-history-row__date">{new Date(item.analyzedAt).toLocaleDateString()}</p>
              </div>
              <Badge variant={scoreVariant(item.atsScore)} size="sm">{item.atsScore}</Badge>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}
