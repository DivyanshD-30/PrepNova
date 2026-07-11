import { FiCalendar } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import EmptyState from '../../../components/ui/EmptyState'
import './UpcomingInterviews.scss'

/**
 * UpcomingInterviews — small widget listing scheduled mock/real interviews.
 * @future-endpoint GET /api/dashboard/upcoming
 */
export default function UpcomingInterviews({ data }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="upcoming-interviews">
      <h3 className="upcoming-interviews__title">Upcoming</h3>

      {data.length === 0 ? (
        <EmptyState compact title="Nothing scheduled" description="Plan your next mock interview to stay on track." />
      ) : (
        <ul className="upcoming-interviews__list">
          {data.map((item) => (
            <li key={item.id} className="upcoming-row">
              <span className="upcoming-row__icon"><FiCalendar /></span>
              <div className="upcoming-row__main">
                <p className="upcoming-row__role">{item.role}</p>
                <p className="upcoming-row__company">{item.company}</p>
              </div>
              <div className="upcoming-row__time">
                <p>{item.date}</p>
                <p>{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}
