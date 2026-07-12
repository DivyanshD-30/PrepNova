import { motion } from 'framer-motion'
import { FiUsers, FiTrendingUp, FiAlertTriangle, FiBookOpen, FiTarget, FiMessageCircle, FiShuffle } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './CategoryPicker.scss'

const ICONS = {
  Teamwork: FiUsers,
  Leadership: FiTrendingUp,
  'Conflict Resolution': FiAlertTriangle,
  'Failure & Learning': FiBookOpen,
  Ownership: FiTarget,
  Communication: FiMessageCircle,
}

/**
 * CategoryPicker — grid of behavioral question categories.
 * @future-endpoint GET /api/behavioral/categories (already real — provided via props)
 */
export default function CategoryPicker({ categories, onSelect }) {
  return (
    <div className="category-picker">
      <p className="category-picker__intro">
        Choose a category to get a fresh AI-generated behavioral question, or let us pick one at random.
      </p>

      <div className="category-picker__grid">
        {categories.map((cat, i) => {
          const Icon = ICONS[cat] || FiUsers
          return (
            <GlassCard key={cat} delay={i * 0.05} className="category-picker__card" padding="lg" onClick={() => onSelect(cat)}>
              <span className="category-picker__icon"><Icon /></span>
              <p>{cat}</p>
            </GlassCard>
          )
        })}

        <GlassCard delay={categories.length * 0.05} className="category-picker__card category-picker__card--random" padding="lg" onClick={() => onSelect(null)}>
          <span className="category-picker__icon category-picker__icon--random"><FiShuffle /></span>
          <p>Surprise me</p>
        </GlassCard>
      </div>
    </div>
  )
}
