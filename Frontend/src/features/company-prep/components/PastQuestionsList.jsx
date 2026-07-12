import Badge from '../../../components/ui/Badge'
import GlassCard from '../../../components/ui/GlassCard'
import './PastQuestionsList.scss'

const FREQ_VARIANT = { common: 'success', occasional: 'primary', rare: 'default' }

/**
 * PastQuestionsList — realistic past interview questions, grouped by category.
 */
export default function PastQuestionsList({ questions }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="past-questions">
      <h3 className="past-questions__title">Past Interview Questions</h3>
      <div className="past-questions__list">
        {questions.map((q, i) => (
          <div key={i} className="past-question-row">
            <div className="past-question-row__top">
              <Badge variant="default" size="sm">{q.category}</Badge>
              <Badge variant={FREQ_VARIANT[q.frequency]} size="sm">{q.frequency}</Badge>
            </div>
            <p className="past-question-row__text">{q.question}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
