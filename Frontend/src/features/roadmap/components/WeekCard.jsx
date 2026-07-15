import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import './WeekCard.scss'

/**
 * WeekCard — one week of the roadmap: goal, focus areas, checkable tasks.
 */
export default function WeekCard({ week, onToggleTask, delay = 0 }) {
  const completedCount = week.tasks.filter((t) => t.completed).length
  const isWeekDone = completedCount === week.tasks.length && week.tasks.length > 0

  return (
    <GlassCard padding="lg" hoverable={false} delay={delay} className={`week-card ${isWeekDone ? 'week-card--done' : ''}`}>
      <div className="week-card__header">
        <Badge variant={isWeekDone ? 'success' : 'primary'}>Week {week.weekNumber}</Badge>
        <span className="week-card__progress">{completedCount} / {week.tasks.length}</span>
      </div>

      <h3 className="week-card__goal">{week.goal}</h3>

      <div className="week-card__focus-areas">
        {week.focusAreas.map((area) => (
          <Badge key={area} variant="default" size="sm">{area}</Badge>
        ))}
      </div>

      <ul className="week-card__tasks">
        {week.tasks.map((task) => (
          <li key={task._id} className={`week-task ${task.completed ? 'week-task--done' : ''}`}>
            <button className="week-task__checkbox" onClick={() => onToggleTask(task._id)} aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}>
              {task.completed && <FiCheck />}
            </button>
            <span className="week-task__title">{task.title}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  )
}
