import { useEffect, useState } from 'react'
import { FiLayers, FiChevronRight, FiArrowLeft, FiServer, FiTrendingUp, FiAlertTriangle, FiBarChart2 } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { getTopics, getCaseStudy } from './services/systemDesign.api'
import './SystemDesign.scss'

const DIFF_VARIANT = { easy: 'success', medium: 'warning', hard: 'danger' }

export default function SystemDesign() {
  const toast = useToast()
  const [status, setStatus] = useState('loading')
  const [topics, setTopics] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const [caseStudy, setCaseStudy] = useState(null)
  const [caseStatus, setCaseStatus] = useState(null)

  const load = async () => {
    setStatus('loading')
    try {
      const data = await getTopics()
      setTopics(data.topics)
      setStatus('ready')
    } catch { setStatus('error') }
  }

  useEffect(() => { load() }, [])

  const handleSelect = async (topic) => {
    setSelected(topic)
    setCaseStudy(null)
    setCaseStatus('loading')
    try {
      const data = await getCaseStudy(topic.id)
      setCaseStudy(data.caseStudy)
      setCaseStatus('ready')
    } catch {
      setCaseStatus('error')
      toast.error('Could not generate case study.')
    }
  }

  const categories = ['All', ...new Set(topics.map(t => t.category))]
  const filtered = activeCategory === 'All' ? topics : topics.filter(t => t.category === activeCategory)

  if (selected) {
    return (
      <div>
        <PageHeader
          eyebrow="System Design"
          title={selected.label}
          description={`Difficulty: ${selected.difficulty} · Category: ${selected.category}`}
          actions={
            <Button variant="ghost" size="sm" icon={<FiArrowLeft />} onClick={() => setSelected(null)}>
              All Topics
            </Button>
          }
        />

        {caseStatus === 'loading' && (
          <GlassCard padding="lg" hoverable={false} className="sd__generating">
            <div className="sd__spinner" />
            <p>Generating case study with AI… this may take a few seconds.</p>
          </GlassCard>
        )}
        {caseStatus === 'error' && <ErrorState onRetry={() => handleSelect(selected)} />}
        {caseStatus === 'ready' && caseStudy && (
          <div className="sd__case">

            <GlassCard padding="lg" hoverable={false}>
              <h3 className="sd__section-title"><FiLayers /> Overview</h3>
              <p className="sd__body">{caseStudy.overview}</p>
            </GlassCard>

            <div className="sd__two-col">
              <GlassCard padding="lg" hoverable={false}>
                <h3 className="sd__section-title">Functional Requirements</h3>
                <ul className="sd__list">
                  {caseStudy.requirements?.functional?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </GlassCard>
              <GlassCard padding="lg" hoverable={false}>
                <h3 className="sd__section-title">Non-Functional Requirements</h3>
                <ul className="sd__list">
                  {caseStudy.requirements?.nonFunctional?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </GlassCard>
            </div>

            <GlassCard padding="lg" hoverable={false}>
              <h3 className="sd__section-title"><FiServer /> Key Components</h3>
              <div className="sd__components">
                {caseStudy.components?.map((c, i) => (
                  <div key={i} className="sd__component">
                    <div className="sd__component-header">
                      <span className="sd__component-name">{c.name}</span>
                      <Badge variant="default">{c.technology}</Badge>
                    </div>
                    <p className="sd__component-role">{c.role}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="sd__two-col">
              <GlassCard padding="lg" hoverable={false}>
                <h3 className="sd__section-title"><FiTrendingUp /> Scaling Strategies</h3>
                <ul className="sd__list">
                  {caseStudy.scalingStrategies?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </GlassCard>

              <GlassCard padding="lg" hoverable={false}>
                <h3 className="sd__section-title"><FiBarChart2 /> Estimations</h3>
                {caseStudy.estimations && (
                  <div className="sd__estimations">
                    {[
                      ['Daily Active Users', caseStudy.estimations.dau],
                      ['Peak Requests/sec', caseStudy.estimations.requestsPerSecond],
                      ['Storage / Year', caseStudy.estimations.storagePerYear],
                    ].map(([label, val]) => (
                      <div key={label} className="sd__estimation-row">
                        <span className="sd__est-label">{label}</span>
                        <span className="sd__est-val">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>

            <GlassCard padding="lg" hoverable={false}>
              <h3 className="sd__section-title"><FiAlertTriangle /> Design Tradeoffs</h3>
              <div className="sd__tradeoffs">
                {caseStudy.tradeoffs?.map((t, i) => (
                  <div key={i} className="sd__tradeoff">
                    <p className="sd__tradeoff-decision">{t.decision}</p>
                    <div className="sd__tradeoff-row">
                      <span className="sd__pro">✓ {t.pro}</span>
                      <span className="sd__con">✗ {t.con}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard padding="lg" hoverable={false} glow="primary">
              <h3 className="sd__section-title">💡 Interview Tips</h3>
              <ul className="sd__list">
                {caseStudy.interviewTips?.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </GlassCard>

          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="System Design"
        title="System Design Prep"
        description="Pick a topic to get an AI-generated architecture breakdown, components, tradeoffs, and interview tips."
      />

      {status === 'loading' && <SkeletonGrid count={6} />}
      {status === 'error' && <ErrorState onRetry={load} />}

      {status === 'ready' && (
        <div className="sd">
          <div className="sd__categories">
            {categories.map(c => (
              <button
                key={c}
                className={`sd__cat-pill ${activeCategory === c ? 'sd__cat-pill--active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >{c}</button>
            ))}
          </div>

          <div className="sd__grid">
            {filtered.map(topic => (
              <GlassCard key={topic.id} padding="md" hoverable className="sd__topic-card" onClick={() => handleSelect(topic)}>
                <div className="sd__topic-header">
                  <Badge variant={DIFF_VARIANT[topic.difficulty]}>{topic.difficulty}</Badge>
                  <Badge variant="default">{topic.category}</Badge>
                </div>
                <p className="sd__topic-label">{topic.label}</p>
                <div className="sd__topic-footer">
                  <span className="sd__topic-cta">View case study <FiChevronRight /></span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
