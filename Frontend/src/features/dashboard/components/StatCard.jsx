import GlassCard from '../../../components/ui/GlassCard'
import './StatCard.scss'

/**
 * StatCard — single metric tile used in dashboard summary row.
 * @param {React.ReactNode} icon
 * @param {string|number} value
 * @param {string} label
 * @param {string} trend - e.g. "+12%" — optional small trend indicator
 * @param {'up'|'down'|'neutral'} trendDirection
 * @param {'primary'|'secondary'|'accent'|'success'} glow
 */
export default function StatCard({ icon, value, label, trend, trendDirection = 'up', glow = 'primary', delay = 0 }) {
  return (
    <GlassCard glow={glow} delay={delay} padding="md" className="stat-card">
      <div className="stat-card__top">
        <span className={`stat-card__icon stat-card__icon--${glow}`}>{icon}</span>
        {trend && (
          <span className={`stat-card__trend stat-card__trend--${trendDirection}`}>{trend}</span>
        )}
      </div>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__label">{label}</p>
    </GlassCard>
  )
}
