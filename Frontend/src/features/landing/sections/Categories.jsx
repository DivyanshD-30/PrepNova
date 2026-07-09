import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import { CATEGORIES } from '../landing.data'
import './Categories.scss'

export default function Categories() {
  return (
    <section className="categories container">
      <div className="categories__header">
        <Badge variant="secondary">Question Bank</Badge>
        <h2 className="categories__title">
          A question for <span className="gradient-text">every track</span>
        </h2>
      </div>

      <div className="categories__grid">
        {CATEGORIES.map((cat, i) => (
          <GlassCard key={cat.title} delay={(i % 4) * 0.06} className="category-card" padding="md">
            <p className="category-card__count">{cat.count}+</p>
            <p className="category-card__title">{cat.title}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
