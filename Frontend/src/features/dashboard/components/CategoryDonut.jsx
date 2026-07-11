import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import GlassCard from '../../../components/ui/GlassCard'
import './CategoryDonut.scss'

const COLORS = ['#a78bfa', '#f472b6', '#60a5fa', '#34d399']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="donut-tooltip">
      <span className="donut-tooltip__dot" style={{ background: item.payload.fill }} />
      {item.name}: {item.value}%
    </div>
  )
}

/**
 * CategoryDonut — breakdown of practice time/sessions by interview category.
 * @future-endpoint GET /api/dashboard/category-breakdown
 */
export default function CategoryDonut({ data }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="category-donut">
      <div className="category-donut__header">
        <h3>Practice Breakdown</h3>
        <p>Where you've spent your prep time</p>
      </div>

      <div className="category-donut__body">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <ul className="category-donut__legend">
          {data.map((entry, i) => (
            <li key={entry.name}>
              <span className="category-donut__dot" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="category-donut__legend-name">{entry.name}</span>
              <span className="category-donut__legend-value">{entry.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  )
}
