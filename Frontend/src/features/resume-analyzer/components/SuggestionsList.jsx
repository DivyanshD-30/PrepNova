import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import './SuggestionsList.scss'

const IMPACT_VARIANT = { high: 'danger', medium: 'warning', low: 'default' }

/**
 * SuggestionsList — actionable resume improvement suggestions, ranked by impact.
 */
export default function SuggestionsList({ suggestions }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="suggestions-list">
      <h3 className="suggestions-list__title">Suggestions to Improve</h3>
      <div className="suggestions-list__items">
        {suggestions.map((s, i) => (
          <div className="suggestion-item" key={s.title}>
            <div className="suggestion-item__header">
              <p className="suggestion-item__title">{s.title}</p>
              <Badge variant={IMPACT_VARIANT[s.impact]} size="sm">{s.impact} impact</Badge>
            </div>
            <p className="suggestion-item__detail">{s.detail}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
