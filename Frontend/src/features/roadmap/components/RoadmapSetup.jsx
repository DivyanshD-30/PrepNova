import { useState } from 'react'
import { FiZap } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Button from '../../../components/ui/Button'
import TagSelect from '../../generator/components/TagSelect'
import './RoadmapSetup.scss'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const DURATIONS = [4, 8, 12, 16]

/**
 * RoadmapSetup — form to generate a new learning roadmap.
 */
export default function RoadmapSetup({ onGenerate, loading }) {
  const [targetRole, setTargetRole] = useState('')
  const [currentLevel, setCurrentLevel] = useState(LEVELS[1])
  const [durationWeeks, setDurationWeeks] = useState(8)

  const handleSubmit = () => {
    if (!targetRole.trim()) return
    onGenerate({ targetRole, currentLevel, durationWeeks })
  }

  return (
    <GlassCard padding="lg" hoverable={false} className="roadmap-setup">
      <p className="roadmap-setup__intro">
        Tell us your target role and we'll build a week-by-week learning plan to get you interview-ready.
      </p>

      <div className="roadmap-setup__field">
        <label htmlFor="targetRole">Target Role</label>
        <input
          id="targetRole"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Senior Backend Engineer"
        />
      </div>

      <div className="roadmap-setup__field">
        <label>Current Level</label>
        <TagSelect options={LEVELS} value={currentLevel} onChange={setCurrentLevel} />
      </div>

      <div className="roadmap-setup__field">
        <label>Duration</label>
        <TagSelect
          options={DURATIONS.map((d) => `${d} weeks`)}
          value={`${durationWeeks} weeks`}
          onChange={(v) => setDurationWeeks(parseInt(v))}
        />
      </div>

      <Button variant="primary" size="lg" icon={<FiZap />} loading={loading} onClick={handleSubmit} fullWidth>
        Generate My Roadmap
      </Button>
    </GlassCard>
  )
}
