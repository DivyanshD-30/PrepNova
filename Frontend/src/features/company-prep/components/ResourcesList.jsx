import { FiBookOpen } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './ResourcesList.scss'

/**
 * ResourcesList — prep resources/resource types for a company.
 */
export default function ResourcesList({ resources }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="resources-list">
      <h3 className="resources-list__title"><FiBookOpen /> Prep Resources</h3>
      <ul className="resources-list__items">
        {resources.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </GlassCard>
  )
}
