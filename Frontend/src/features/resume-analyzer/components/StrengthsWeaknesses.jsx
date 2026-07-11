import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './StrengthsWeaknesses.scss'

/**
 * StrengthsWeaknesses — side-by-side strengths and weaknesses lists.
 */
export default function StrengthsWeaknesses({ strengths, weaknesses }) {
  return (
    <div className="strengths-weaknesses">
      <GlassCard padding="lg" hoverable={false} glow="success" className="strengths-weaknesses__col">
        <h3 className="strengths-weaknesses__title strengths-weaknesses__title--success">
          <FiCheckCircle /> Strengths
        </h3>
        <ul>
          {strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </GlassCard>

      <GlassCard padding="lg" hoverable={false} glow="secondary" className="strengths-weaknesses__col">
        <h3 className="strengths-weaknesses__title strengths-weaknesses__title--warning">
          <FiAlertCircle /> Weaknesses
        </h3>
        <ul>
          {weaknesses.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </GlassCard>
    </div>
  )
}
