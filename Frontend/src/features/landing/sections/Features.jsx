import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import { FEATURES } from '../landing.data'
import './Features.scss'

export default function Features() {
  return (
    <section id="features" className="features container">
      <div className="features__header">
        <Badge variant="primary">Platform</Badge>
        <h2 className="features__title">
          Everything you need to <span className="gradient-text">land the offer</span>
        </h2>
        <p className="features__subtitle">
          One platform covering every stage of the interview process — from your first
          AI-generated plan to your final HR round.
        </p>
      </div>

      <div className="features__grid">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon
          return (
            <GlassCard key={feature.title} glow={feature.glow} delay={(i % 3) * 0.08} className="feature-card">
              <span className={`feature-card__icon feature-card__icon--${feature.glow}`}>
                <Icon />
              </span>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.description}</p>
            </GlassCard>
          )
        })}
      </div>
    </section>
  )
}
