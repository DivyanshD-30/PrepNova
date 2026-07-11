import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './XpBar.scss'

/**
 * XpBar — shows current level + progress toward next level.
 */
export default function XpBar({ xp, level, nextLevelXp }) {
  const progress = Math.min((xp / nextLevelXp) * 100, 100)

  return (
    <GlassCard padding="lg" hoverable={false} glow="secondary" className="xp-bar">
      <div className="xp-bar__top">
        <div className="xp-bar__level">
          <span className="xp-bar__level-icon"><FiStar /></span>
          <div>
            <p className="xp-bar__level-title">Level {level}</p>
            <p className="xp-bar__level-sub">{xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</p>
          </div>
        </div>
        <p className="xp-bar__remaining">{(nextLevelXp - xp).toLocaleString()} XP to next level</p>
      </div>

      <div className="xp-bar__track">
        <motion.div
          className="xp-bar__fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </GlassCard>
  )
}
