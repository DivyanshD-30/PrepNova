import { FiAward, FiLock } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './AchievementsList.scss'

/**
 * AchievementsList — small widget showing unlocked/locked badges.
 * @future-endpoint GET /api/dashboard/achievements
 */
export default function AchievementsList({ data }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="achievements-list">
      <h3 className="achievements-list__title">Achievements</h3>
      <ul className="achievements-list__items">
        {data.map((ach) => (
          <li key={ach.id} className={`achievement-row ${ach.unlocked ? 'is-unlocked' : ''}`}>
            <span className="achievement-row__icon">
              {ach.unlocked ? <FiAward /> : <FiLock />}
            </span>
            <div>
              <p className="achievement-row__title">{ach.title}</p>
              <p className="achievement-row__desc">{ach.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  )
}
