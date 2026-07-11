import { useNavigate } from 'react-router'
import { FiArrowUpRight, FiClock } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import EmptyState from '../../../components/ui/EmptyState'
import './RecentInterviews.scss'

/**
 * RecentInterviews — list of past + scheduled interview sessions.
 * @backend GET /api/dashboard/recent-interviews
 *   Returns: [{ id, title, score, date, status }]
 */
export default function RecentInterviews({ data }) {
  const navigate = useNavigate()

  return (
    <GlassCard padding="lg" hoverable={false} className="recent-interviews">
      <div className="recent-interviews__header">
        <h3>Recent Interviews</h3>
        <button className="recent-interviews__view-all" onClick={() => navigate('/app/generator')}>
          New plan <FiArrowUpRight />
        </button>
      </div>

      {data.length === 0 ? (
        <EmptyState
          compact
          title="No interviews yet"
          description="Generate your first AI interview plan to see it here."
        />
      ) : (
        <ul className="recent-interviews__list">
          {data.map((item) => (
            <li
              key={item.id}
              className="recent-interview-row"
              onClick={() => navigate(`/app/generator/${item.id}`)}
            >
              <div className="recent-interview-row__main">
                <p className="recent-interview-row__role">{item.title || 'Untitled role'}</p>
              </div>

              <div className="recent-interview-row__meta">
                {item.status === 'scheduled' ? (
                  <Badge variant="accent" icon={<FiClock />}>Scheduled</Badge>
                ) : (
                  <Badge variant={item.score >= 80 ? 'success' : item.score >= 60 ? 'primary' : 'warning'}>
                    {item.score != null ? `${item.score} pts` : 'Pending'}
                  </Badge>
                )}
                <span className="recent-interview-row__date">{item.date}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}
