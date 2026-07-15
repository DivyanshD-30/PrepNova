import { useEffect, useState } from 'react'
import { FiCheck, FiZap, FiUsers, FiMail } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { getPlans, checkout } from './services/subscription.api'
import './Subscription.scss'

const PLAN_ICONS = { free: <FiZap />, pro: <FiZap />, team: <FiUsers /> }

export default function Subscription() {
  const toast = useToast()
  const [status, setStatus] = useState('loading')
  const [plans, setPlans] = useState([])
  const [currentPlan, setCurrentPlan] = useState('free')
  const [loading, setLoading] = useState(null)

  const load = async () => {
    setStatus('loading')
    try {
      const data = await getPlans()
      setPlans(data.plans)
      setCurrentPlan(data.currentPlan)
      setStatus('ready')
    } catch { setStatus('error') }
  }

  useEffect(() => { load() }, [])

  const handleCheckout = async (planId) => {
    if (planId === 'free') return
    if (planId === 'team') {
      toast.success('Reach out to sales@prepnova.com to set up a Team plan.')
      return
    }
    setLoading(planId)
    try {
      const data = await checkout(planId)
      if (data.contactSales) {
        toast.success('Contact sales@prepnova.com for this plan.')
      } else {
        window.open(data.checkoutUrl, '_blank')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not start checkout.')
    } finally { setLoading(null) }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Subscription"
        title="Choose your plan"
        description="Upgrade to unlock unlimited AI reports, full prep tools, and priority support."
      />

      {status === 'loading' && <SkeletonGrid count={3} />}
      {status === 'error' && <ErrorState onRetry={load} />}

      {status === 'ready' && (
        <div className="subscription">
          <div className="subscription__grid">
            {plans.map(plan => (
              <GlassCard
                key={plan.id}
                padding="lg"
                hoverable
                glow={plan.highlighted ? 'primary' : 'default'}
                className={`subscription__card ${plan.highlighted ? 'subscription__card--highlighted' : ''}`}
              >
                {plan.highlighted && (
                  <div className="subscription__popular">Most Popular</div>
                )}

                <div className="subscription__plan-icon">{PLAN_ICONS[plan.id]}</div>
                <h3 className="subscription__plan-name">{plan.name}</h3>
                <p className="subscription__plan-desc">{plan.description}</p>

                <div className="subscription__price">
                  {plan.price === 0 ? (
                    <span className="subscription__price-amount">Free</span>
                  ) : (
                    <>
                      <span className="subscription__price-currency">$</span>
                      <span className="subscription__price-amount">{plan.price}</span>
                      <span className="subscription__price-cycle">/ {plan.billingCycle}</span>
                    </>
                  )}
                </div>

                <ul className="subscription__features">
                  {plan.features.map((f, i) => (
                    <li key={i} className="subscription__feature">
                      <FiCheck className="subscription__feature-icon" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  fullWidth
                  loading={loading === plan.id}
                  disabled={plan.id === currentPlan}
                  onClick={() => handleCheckout(plan.id)}
                  icon={plan.id === 'team' ? <FiMail /> : null}
                >
                  {plan.id === currentPlan ? 'Current Plan' : plan.cta}
                </Button>
              </GlassCard>
            ))}
          </div>

          <GlassCard padding="md" hoverable={false} className="subscription__note">
            <p>All plans include a 7-day free trial. No credit card required for the Free plan. Cancel anytime.</p>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
