import { FiAward } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import EmptyState from '../../../components/ui/EmptyState'
import './Leaderboard.scss'

const MEDAL_COLORS = ['#fbbf24', '#cbd5e1', '#fb923c']

/**
 * Leaderboard — top scorers across all coding submissions.
 * @backend GET /api/coding/leaderboard
 */
export default function Leaderboard({ data }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="leaderboard">
      <h3 className="leaderboard__title"><FiAward /> Leaderboard</h3>
      {data.length === 0 ? (
        <EmptyState compact title="No submissions yet" description="Be the first to solve a problem." />
      ) : (
        <ul className="leaderboard__list">
          {data.map((entry, i) => (
            <li key={entry.userId} className="leaderboard-row">
              <span className="leaderboard-row__rank" style={i < 3 ? { color: MEDAL_COLORS[i] } : undefined}>
                {i + 1}
              </span>
              <span className="leaderboard-row__name">{entry.username}</span>
              <span className="leaderboard-row__score">{entry.totalScore}</span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}
