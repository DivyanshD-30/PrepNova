import { useEffect, useState } from 'react'
import { FiCheck, FiTarget, FiAward } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { getRoadmap, updateProgress } from './services/roadmap.api'
import './Roadmap.scss'

export default function Roadmap() {
  const toast = useToast()
  const [status, setStatus] = useState('loading')
  const [roadmap, setRoadmap] = useState(null)
  const [completed, setCompleted] = useState([])
  const [saving, setSaving] = useState(null)

  const load = async () => {
    setStatus('loading')
    try {
      const data = await getRoadmap()
      setRoadmap(data.roadmap)
      setCompleted(data.roadmap.completedTopics || [])
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (topicId) => {
    const isCompleted = completed.includes(topicId)
    const next = isCompleted
      ? completed.filter(t => t !== topicId)
      : [...completed, topicId]
    setCompleted(next)
    setSaving(topicId)
    try {
      await updateProgress({ topicId, completed: !isCompleted })
    } catch {
      setCompleted(completed)
      toast.error('Could not save progress.')
    } finally {
      setSaving(null)
    }
  }

  const handleRoleChange = async (role) => {
    try {
      const data = await updateProgress({ targetRole: role })
      setRoadmap(prev => ({ ...prev, role }))
      setCompleted(data.progress.completedTopics || [])
      toast.success(`Switched to ${role}`)
    } catch {
      toast.error('Could not switch role.')
    }
  }

  const categories = roadmap ? [...new Set(roadmap.topics.map(t => t.category))] : []
  const pct = roadmap ? Math.round((completed.length / roadmap.topics.length) * 100) : 0

  return (
    <div>
      <PageHeader
        eyebrow="Learning Roadmap"
        title="Your personalised prep roadmap"
        description="Check off topics as you complete them. Switch roles to change the roadmap."
      />

      {status === 'loading' && <SkeletonGrid count={6} />}
      {status === 'error' && <ErrorState onRetry={load} />}

      {status === 'ready' && roadmap && (
        <div className="roadmap">
          <div className="roadmap__header-row">
            <GlassCard padding="md" hoverable={false} className="roadmap__progress-card">
              <div className="roadmap__progress-top">
                <span className="roadmap__progress-label"><FiTarget /> Progress</span>
                <span className="roadmap__progress-pct">{pct}%</span>
              </div>
              <div className="roadmap__bar-bg">
                <div className="roadmap__bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <p className="roadmap__progress-sub">{completed.length} / {roadmap.topics.length} topics completed</p>
            </GlassCard>

            <GlassCard padding="md" hoverable={false} className="roadmap__role-card">
              <p className="roadmap__role-label"><FiAward /> Target Role</p>
              <div className="roadmap__role-pills">
                {roadmap.roles.map(r => (
                  <button
                    key={r}
                    className={`roadmap__role-pill ${r === roadmap.role ? 'roadmap__role-pill--active' : ''}`}
                    onClick={() => handleRoleChange(r)}
                  >{r}</button>
                ))}
              </div>
            </GlassCard>
          </div>

          {categories.map(cat => (
            <div key={cat} className="roadmap__category">
              <h3 className="roadmap__category-title">{cat}</h3>
              <div className="roadmap__topics">
                {roadmap.topics.filter(t => t.category === cat).map(topic => {
                  const done = completed.includes(topic.id)
                  return (
                    <GlassCard
                      key={topic.id}
                      padding="md"
                      hoverable
                      className={`roadmap__topic ${done ? 'roadmap__topic--done' : ''}`}
                      onClick={() => handleToggle(topic.id)}
                    >
                      <div className="roadmap__topic-inner">
                        <div className={`roadmap__check ${done ? 'roadmap__check--done' : ''}`}>
                          {(done || saving === topic.id) && <FiCheck />}
                        </div>
                        <span className="roadmap__topic-label">{topic.label}</span>
                        {done && <Badge variant="success">Done</Badge>}
                      </div>
                    </GlassCard>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
