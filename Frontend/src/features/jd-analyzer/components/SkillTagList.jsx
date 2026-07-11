import { FiCheck, FiX, FiPlus } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './SkillTagList.scss'

const ICONS = { matched: FiCheck, missing: FiX, 'nice-to-have': FiPlus }

/**
 * SkillTagList — chip list for a category of skills (matched / missing / nice-to-have).
 * @param {'matched'|'missing'|'nice-to-have'} variant
 */
export default function SkillTagList({ title, skills, variant }) {
  const Icon = ICONS[variant]

  return (
    <GlassCard padding="lg" hoverable={false} className="skill-tag-list">
      <h3 className="skill-tag-list__title">{title}</h3>
      {skills.length === 0 ? (
        <p className="skill-tag-list__empty">None</p>
      ) : (
        <div className="skill-tag-list__chips">
          {skills.map((skill) => (
            <span key={skill} className={`skill-chip skill-chip--${variant}`}>
              <Icon /> {skill}
            </span>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
