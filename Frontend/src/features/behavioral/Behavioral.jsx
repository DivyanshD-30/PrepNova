import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiRotateCcw, FiInfo } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import CategoryPicker from './components/CategoryPicker'
import StarBreakdownChart from './components/StarBreakdownChart'
import FeedbackPanel from './components/FeedbackPanel'
import BehavioralHistoryList from './components/BehavioralHistoryList'
import { getCategories, getQuestion, submitAnswer, getHistory } from './services/behavioral.api'
import './Behavioral.scss'

/**
 * Behavioral — STAR-method behavioral question practice with AI feedback.
 *
 * @backend GET  /api/behavioral/categories
 * @backend GET  /api/behavioral/question?category=X
 * @backend POST /api/behavioral/answer
 * @backend GET  /api/behavioral/history
 */
export default function Behavioral() {
  const toast = useToast()
  const [categories, setCategories] = useState([])
  const [history, setHistory] = useState([])
  const [stage, setStage] = useState('categories') // categories | loading-question | answering | submitting | feedback | error
  const [current, setCurrent] = useState(null) // { question, category, whatInterviewerLooksFor }
  const [answer, setAnswer] = useState('')
  const [attempt, setAttempt] = useState(null)

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.categories))
      .catch(() => toast.error('Could not load categories.'))

    getHistory()
      .then((data) => setHistory(data.history))
      .catch(() => {}) // non-critical
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePickCategory = async (category) => {
    setStage('loading-question')
    try {
      const data = await getQuestion(category)
      setCurrent(data)
      setAnswer('')
      setStage('answering')
    } catch (err) {
      console.error('getQuestion error:', err)
      toast.error('Could not generate a question. Please try again.')
      setStage('error')
    }
  }

  const handleSubmit = async () => {
    if (answer.trim().length < 20) {
      toast.warning('Write a more complete answer (at least a couple of sentences).')
      return
    }
    setStage('submitting')
    try {
      const data = await submitAnswer({ question: current.question, category: current.category, userAnswer: answer })
      setAttempt(data.attempt)
      setHistory((prev) => [
        { _id: data.attempt._id, question: data.attempt.question, category: data.attempt.category, score: data.attempt.score },
        ...prev,
      ])
      setStage('feedback')
    } catch (err) {
      console.error('submitAnswer error:', err)
      toast.error(err?.response?.data?.message || 'Could not evaluate your answer.')
      setStage('answering')
    }
  }

  const handleRestart = () => {
    setCurrent(null)
    setAnswer('')
    setAttempt(null)
    setStage('categories')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Behavioral Questions"
        title="Master the STAR method"
        description="Practice behavioral questions and get AI feedback scored on Situation, Task, Action, and Result."
        actions={
          stage !== 'categories' && (
            <Button variant="ghost" size="sm" icon={<FiRotateCcw />} onClick={handleRestart}>
              New question
            </Button>
          )
        }
      />

      <div className="behavioral">
        <div className="behavioral__main">
          {stage === 'categories' && (
            <CategoryPicker categories={categories} onSelect={handlePickCategory} />
          )}

          {stage === 'loading-question' && <SkeletonCard lines={4} />}

          {stage === 'error' && <ErrorState onRetry={() => handlePickCategory(current?.category)} />}

          {(stage === 'answering' || stage === 'submitting') && current && (
            <GlassCard padding="lg" hoverable={false} className="behavioral__question-card">
              <Badge variant="primary">{current.category}</Badge>
              <h2 className="behavioral__question">{current.question}</h2>

              <div className="behavioral__hint">
                <FiInfo />
                <p>{current.whatInterviewerLooksFor}</p>
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="behavioral__textarea"
                placeholder="Structure your answer using STAR: describe the Situation, your Task, the Action you took, and the Result..."
                disabled={stage === 'submitting'}
              />

              <div className="behavioral__footer">
                <span>{answer.length} characters</span>
                <Button variant="primary" size="lg" icon={<FiSend />} loading={stage === 'submitting'} onClick={handleSubmit}>
                  Submit Answer
                </Button>
              </div>
            </GlassCard>
          )}

          {stage === 'feedback' && attempt && (
            <div className="behavioral__feedback-stage">
              <GlassCard padding="lg" hoverable={false} className="behavioral__question-card behavioral__question-card--recap">
                <Badge variant="default">{attempt.category}</Badge>
                <h2 className="behavioral__question">{attempt.question}</h2>
              </GlassCard>

              <StarBreakdownChart breakdown={attempt.starBreakdown} />
              <FeedbackPanel attempt={attempt} />

              <Button variant="primary" size="lg" icon={<FiRotateCcw />} onClick={handleRestart} fullWidth>
                Try Another Question
              </Button>
            </div>
          )}
        </div>

        <div className="behavioral__side">
          <BehavioralHistoryList data={history} />
        </div>
      </div>
    </div>
  )
}
