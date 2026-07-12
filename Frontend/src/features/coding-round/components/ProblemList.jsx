import { motion } from 'framer-motion'
import { FiClock, FiTag } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import EmptyState from '../../../components/ui/EmptyState'
import './ProblemList.scss'

const DIFFICULTY_VARIANT = { Easy: 'success', Medium: 'warning', Hard: 'danger' }

/**
 * ProblemList — filterable list of coding problems.
 */
export default function ProblemList({ problems, topics, difficulties, filters, onFilterChange, onSelect }) {
  return (
    <div className="problem-list">
      <div className="problem-list__filters">
        <select value={filters.topic} onChange={(e) => onFilterChange({ ...filters, topic: e.target.value })}>
          <option value="">All Topics</option>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.difficulty} onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value })}>
          <option value="">All Difficulties</option>
          {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {problems.length === 0 ? (
        <EmptyState title="No problems found" description="Try a different topic or difficulty filter." />
      ) : (
        <div className="problem-list__grid">
          {problems.map((p, i) => (
            <GlassCard key={p._id} delay={i * 0.04} className="problem-card" padding="lg" onClick={() => onSelect(p._id)}>
              <div className="problem-card__top">
                <Badge variant={DIFFICULTY_VARIANT[p.difficulty]} size="sm">{p.difficulty}</Badge>
                <span className="problem-card__points">{p.points} pts</span>
              </div>
              <h3 className="problem-card__title">{p.title}</h3>
              <span className="problem-card__topic"><FiTag /> {p.topic}</span>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
