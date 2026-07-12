import { FiDollarSign } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './SalaryInsightsTable.scss'

/**
 * SalaryInsightsTable — role/level/range salary data points.
 */
export default function SalaryInsightsTable({ insights }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="salary-table">
      <h3 className="salary-table__title"><FiDollarSign /> Salary Insights</h3>
      <div className="salary-table__rows">
        <div className="salary-table__row salary-table__row--head">
          <span>Role</span>
          <span>Level</span>
          <span>Range</span>
        </div>
        {insights.map((row, i) => (
          <div key={i} className="salary-table__row">
            <span>{row.role}</span>
            <span>{row.level}</span>
            <span className="salary-table__range">{row.range}</span>
          </div>
        ))}
      </div>
      <p className="salary-table__disclaimer">
        Estimates for general orientation only — actual offers vary by location, team, and negotiation.
      </p>
    </GlassCard>
  )
}
