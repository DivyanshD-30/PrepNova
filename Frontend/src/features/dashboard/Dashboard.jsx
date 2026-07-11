import { useEffect, useState } from 'react'
import { FiZap, FiTarget, FiClock, FiTrendingUp } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useAuth } from '../auth/hooks/useAuth'
import StatCard from './components/StatCard'
import ScoreTrendChart from './components/ScoreTrendChart'
import CategoryDonut from './components/CategoryDonut'
import ActivityHeatmap from './components/ActivityHeatmap'
import RecentInterviews from './components/RecentInterviews'
import AchievementsList from './components/AchievementsList'
import UpcomingInterviews from './components/UpcomingInterviews'
import XpBar from './components/XpBar'
import {
  CATEGORY_BREAKDOWN,
  ACHIEVEMENTS,
  UPCOMING_INTERVIEWS,
} from './dashboard.data'
import {
  getDashboardSummary,
  getScoreTrend,
  getRecentInterviews,
  getHeatmap,
} from './services/dashboard.api'
import './Dashboard.scss'

export default function Dashboard() {
  const { user } = useAuth()
  const [status, setStatus] = useState('loading')
  const [data, setData] = useState(null)

  const loadDashboard = async () => {
    setStatus('loading')
    try {
      const [summaryRes, trendRes, recentRes, heatmapRes] = await Promise.all([
        getDashboardSummary(),
        getScoreTrend(),
        getRecentInterviews(),
        getHeatmap(),
      ])

      setData({
        summary: summaryRes.summary,
        scoreTrend: trendRes.scoreTrend,
        categoryBreakdown: CATEGORY_BREAKDOWN,   // still static — no backend yet
        recentInterviews: recentRes.recentInterviews,
        achievements: ACHIEVEMENTS,               // still static — no backend yet
        heatmap: heatmapRes.heatmap,
        upcoming: UPCOMING_INTERVIEWS,            // still static — no backend yet
      })
      setStatus('ready')
    } catch (err) {
      console.error('Dashboard load error:', err)
      setStatus('error')
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.username || 'there'} 👋`}
        description="Here's how your interview prep is going this week."
        actions={<Button variant="primary" icon={<FiZap />}>Generate New Interview</Button>}
      />

      {status === 'loading' && <SkeletonGrid count={8} />}

      {status === 'error' && <ErrorState onRetry={loadDashboard} />}

      {status === 'ready' && data && (
        <div className="dashboard">
          <div className="dashboard__stats">
            <StatCard
              icon={<FiTarget />}
              value={data.summary.totalInterviews}
              label="Total Interviews"
              trend="+8 this week"
              glow="primary"
              delay={0}
            />
            <StatCard
              icon={<FiTrendingUp />}
              value={`${data.summary.averageScore}%`}
              label="Average Score"
              trend="+5%"
              glow="success"
              delay={0.05}
            />
            <StatCard
              icon={<FiZap />}
              value={`${data.summary.streakDays} days`}
              label="Current Streak"
              trend="Personal best"
              glow="secondary"
              delay={0.1}
            />
            <StatCard
              icon={<FiClock />}
              value={`${data.summary.hoursPracticed}h`}
              label="Hours Practiced"
              trend="+4h this week"
              glow="accent"
              delay={0.15}
            />
          </div>

          <div className="dashboard__xp">
            <XpBar xp={data.summary.xp} level={data.summary.level} nextLevelXp={data.summary.nextLevelXp} />
          </div>

          <div className="dashboard__grid">
            <div className="dashboard__col-main">
              <ScoreTrendChart data={data.scoreTrend} />
              <ActivityHeatmap data={data.heatmap} streakDays={data.summary.streakDays} />
              <RecentInterviews data={data.recentInterviews} />
            </div>

            <div className="dashboard__col-side">
              <CategoryDonut data={data.categoryBreakdown} />
              <UpcomingInterviews data={data.upcoming} />
              <AchievementsList data={data.achievements} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
