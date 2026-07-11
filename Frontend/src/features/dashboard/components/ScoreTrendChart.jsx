import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import GlassCard from '../../../components/ui/GlassCard'
import './ScoreTrendChart.scss'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="score-tooltip">
      <p className="score-tooltip__label">{label}</p>
      <p className="score-tooltip__value">{payload[0].value} pts</p>
    </div>
  )
}

/**
 * ScoreTrendChart — area chart of interview match-scores over the last 7 days.
 * @future-endpoint GET /api/dashboard/score-trend
 */
export default function ScoreTrendChart({ data }) {
  return (
    <GlassCard padding="lg" hoverable={false} className="score-trend-chart">
      <div className="score-trend-chart__header">
        <h3>Score Trend</h3>
        <p>Your average interview score over the last 7 days</p>
      </div>

      <div className="score-trend-chart__canvas">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#a78bfa"
              strokeWidth={2.5}
              fill="url(#scoreGradient)"
              dot={{ r: 3, fill: '#a78bfa', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
