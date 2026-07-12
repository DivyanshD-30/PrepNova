import { useState } from 'react'
import { FiPlay } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Button from '../../../components/ui/Button'
import './RoleSelector.scss'

const SUGGESTED_ROLES = ['Software Engineer', 'Product Manager', 'Data Analyst', 'Designer']

/**
 * RoleSelector — pick or type the role this HR round is for.
 */
export default function RoleSelector({ onStart, loading = false }) {
  const [role, setRole] = useState('')

  return (
    <GlassCard padding="lg" hoverable={false} className="role-selector">
      <p className="role-selector__intro">
        The HR round is a conversational interview covering motivation, fit, and soft skills —
        not technical questions. Tell us the role you're preparing for.
      </p>

      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="role-selector__input"
        placeholder="e.g. Senior Software Engineer"
        disabled={loading}
      />

      <div className="role-selector__suggestions">
        {SUGGESTED_ROLES.map((r) => (
          <button key={r} className="role-selector__chip" onClick={() => setRole(r)} disabled={loading}>
            {r}
          </button>
        ))}
      </div>

      <Button variant="primary" size="lg" icon={<FiPlay />} loading={loading} onClick={() => onStart(role || 'General')} fullWidth>
        Start HR Round
      </Button>
    </GlassCard>
  )
}
