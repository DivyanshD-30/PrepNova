import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiDownload, FiCode, FiUsers, FiMap } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import { SkeletonCard } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useInterview } from '../interview/hooks/useInterview'
import './GeneratorReport.scss'

const NAV_ITEMS = [
  { id: 'technical', label: 'Technical Questions', icon: FiCode },
  { id: 'behavioral', label: 'Behavioral Questions', icon: FiUsers },
  { id: 'roadmap', label: 'Road Map', icon: FiMap },
]

function QuestionCard({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <GlassCard padding="none" hoverable={false} className="report-q-card" delay={index * 0.04}>
      <button className="report-q-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="report-q-card__index">Q{index + 1}</span>
        <p className="report-q-card__question">{item.question}</p>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <FiChevronDown />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="report-q-card__body-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="report-q-card__body">
              <div className="report-q-card__section">
                <Badge variant="accent" size="sm">Intention</Badge>
                <p>{item.intention}</p>
              </div>
              <div className="report-q-card__section">
                <Badge variant="success" size="sm">Model Answer</Badge>
                <p>{item.answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

function RoadMapDay({ day, index }) {
  return (
    <GlassCard padding="lg" delay={index * 0.06} className="roadmap-day" hoverable={false}>
      <div className="roadmap-day__header">
        <Badge variant="primary">Day {day.day}</Badge>
        <h3>{day.focus}</h3>
      </div>
      <ul className="roadmap-day__tasks">
        {day.tasks.map((task, i) => (
          <li key={i}>
            <span className="roadmap-day__bullet" />
            {task}
          </li>
        ))}
      </ul>
    </GlassCard>
  )
}

/**
 * GeneratorReport — displays a generated interview plan.
 * @backend GET /api/interview/report/:interviewId
 * @backend POST /api/interview/resume/pdf/:interviewReportId
 */
export default function GeneratorReport() {
  const [activeNav, setActiveNav] = useState('technical')
  const { report, getReportById, loading, getResumePdf } = useInterview()
  const { interviewId } = useParams()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!interviewId) return
    setStatus('loading')
    getReportById(interviewId)
      .then(() => setStatus('ready'))
      .catch(() => setStatus('error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId])

  if (status === 'loading' || loading || !report) {
    return (
      <div>
        <PageHeader eyebrow="AI Interview Generator" title="Preparing your plan..." />
        <div className="generator-report__loading-grid">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return <ErrorState onRetry={() => getReportById(interviewId)} description="Couldn't load this interview plan." />
  }

  const scoreVariant = report.matchScore >= 80 ? 'success' : report.matchScore >= 60 ? 'primary' : 'warning'

  return (
    <div className="generator-report">
      <PageHeader
        eyebrow="AI Interview Generator"
        title={report.title || 'Your Interview Plan'}
        description="A tailored technical, behavioral, and HR prep plan built from your profile and the job description."
        actions={
          <Button variant="secondary" icon={<FiDownload />} onClick={() => getResumePdf(interviewId)}>
            Download Resume
          </Button>
        }
      />

      <div className="generator-report__layout">
        {/* ---------- Nav ---------- */}
        <nav className="generator-report__nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`generator-report__nav-item ${activeNav === item.id ? 'is-active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <Icon /> {item.label}
              </button>
            )
          })}
        </nav>

        {/* ---------- Content ---------- */}
        <main className="generator-report__content">
          {activeNav === 'technical' && (
            <section>
              <div className="generator-report__section-header">
                <h2>Technical Questions</h2>
                <span>{report.technicalQuestions.length} questions</span>
              </div>
              <div className="generator-report__q-list">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'behavioral' && (
            <section>
              <div className="generator-report__section-header">
                <h2>Behavioral Questions</h2>
                <span>{report.behavioralQuestions.length} questions</span>
              </div>
              <div className="generator-report__q-list">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'roadmap' && (
            <section>
              <div className="generator-report__section-header">
                <h2>Preparation Road Map</h2>
                <span>{report.preparationPlan.length}-day plan</span>
              </div>
              <div className="generator-report__roadmap-list">
                {report.preparationPlan.map((day, i) => (
                  <RoadMapDay key={day.day} day={day} index={i} />
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ---------- Sidebar ---------- */}
        <aside className="generator-report__sidebar">
          <GlassCard padding="lg" hoverable={false} className="match-score-card">
            <p className="match-score-card__label">Match Score</p>
            <div
              className={`match-score-card__ring match-score-card__ring--${scoreVariant}`}
              style={{ '--score': `${report.matchScore}%` }}
            >
              <span>{report.matchScore}</span>
              <span className="match-score-card__pct">%</span>
            </div>
            <p className="match-score-card__sub">Strong match for this role</p>
          </GlassCard>

          <GlassCard padding="lg" hoverable={false}>
            <p className="generator-report__skill-label">Skill Gaps</p>
            <div className="generator-report__skill-list">
              {report.skillGaps.map((gap, i) => (
                <Badge
                  key={i}
                  variant={gap.severity === 'high' ? 'danger' : gap.severity === 'medium' ? 'warning' : 'default'}
                >
                  {gap.skill}
                </Badge>
              ))}
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  )
}
