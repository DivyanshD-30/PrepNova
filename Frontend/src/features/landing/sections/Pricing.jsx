import { useNavigate } from 'react-router'
import { FiCheck } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { PRICING_PLANS } from '../landing.data'
import './Pricing.scss'

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <section id="pricing" className="pricing container">
      <div className="pricing__header">
        <Badge variant="primary">Pricing</Badge>
        <h2 className="pricing__title">
          Simple plans, <span className="gradient-text">serious results</span>
        </h2>
        <p className="pricing__subtitle">Start free. Upgrade when you're ready to go all-in on your search.</p>
      </div>

      <div className="pricing__grid">
        {PRICING_PLANS.map((plan, i) => (
          <GlassCard
            key={plan.name}
            delay={i * 0.08}
            glow={plan.highlighted ? 'primary' : 'default'}
            className={`pricing-card ${plan.highlighted ? 'pricing-card--highlighted' : ''}`}
            padding="lg"
          >
            {plan.highlighted && <span className="pricing-card__ribbon">Most Popular</span>}
            <p className="pricing-card__name">{plan.name}</p>
            <div className="pricing-card__price">
              <span className="pricing-card__amount">{plan.price}</span>
              <span className="pricing-card__period">{plan.period}</span>
            </div>
            <p className="pricing-card__desc">{plan.description}</p>

            <ul className="pricing-card__features">
              {plan.features.map((f) => (
                <li key={f}><FiCheck /> {f}</li>
              ))}
            </ul>

            <Button
              variant={plan.highlighted ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              onClick={() => navigate('/register')}
            >
              {plan.cta}
            </Button>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
