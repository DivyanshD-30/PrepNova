import { FiStar } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import { TESTIMONIALS } from '../landing.data'
import './Testimonials.scss'

export default function Testimonials() {
  return (
    <section className="testimonials container">
      <div className="testimonials__header">
        <Badge variant="success">Success Stories</Badge>
        <h2 className="testimonials__title">
          People who <span className="gradient-text">got the offer</span>
        </h2>
      </div>

      <div className="testimonials__grid">
        {TESTIMONIALS.map((t, i) => (
          <GlassCard key={t.name} delay={(i % 2) * 0.1} className="testimonial-card" padding="lg">
            <div className="testimonial-card__stars">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FiStar key={idx} className={idx < t.rating ? 'is-filled' : ''} />
              ))}
            </div>
            <p className="testimonial-card__quote">&ldquo;{t.quote}&rdquo;</p>
            <div className="testimonial-card__author">
              <span className="testimonial-card__avatar">{t.name[0]}</span>
              <div>
                <p className="testimonial-card__name">{t.name}</p>
                <p className="testimonial-card__role">{t.role}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
