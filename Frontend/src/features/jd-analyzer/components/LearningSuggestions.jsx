import { FiBookOpen } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import './LearningSuggestions.scss'

/**
 * LearningSuggestions — what to learn next, with reasoning and resources.
 */
export default function LearningSuggestions({ suggestions }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="learning-suggestions">
      <h3 className="learning-suggestions__title">
        <FiBookOpen /> What to Learn Next
      </h3>
      <div className="learning-suggestions__items">
        {suggestions.map((s) => (
          <div className="learning-item" key={s.skill}>
            <div className="learning-item__header">
              <Badge variant="primary">{s.skill}</Badge>
            </div>
            <p className="learning-item__reason">{s.reason}</p>
            <ul className="learning-item__resources">
              {s.resources.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
