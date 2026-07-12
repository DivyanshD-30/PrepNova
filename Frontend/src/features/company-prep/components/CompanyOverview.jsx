import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import './CompanyOverview.scss'

/**
 * CompanyOverview — about, industry badge, and culture notes.
 */
export default function CompanyOverview({ profile }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="company-overview">
      <div className="company-overview__header">
        <span className="company-overview__avatar">{profile.name[0]}</span>
        <div>
          <h2>{profile.name}</h2>
          <Badge variant="primary" size="sm">{profile.industry}</Badge>
        </div>
      </div>
      <p className="company-overview__about">{profile.about}</p>
      {profile.cultureNotes && (
        <div className="company-overview__culture">
          <p className="company-overview__culture-label">Interview Culture</p>
          <p>{profile.cultureNotes}</p>
        </div>
      )}
    </GlassCard>
  )
}
