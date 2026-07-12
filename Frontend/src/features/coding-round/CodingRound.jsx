import { useEffect, useState } from 'react'
import { FiPlay, FiArrowLeft, FiSend } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import ProblemList from './components/ProblemList'
import CodeEditor from './components/CodeEditor'
import TestCasePanel from './components/TestCasePanel'
import Timer from './components/Timer'
import Leaderboard from './components/Leaderboard'
import { getProblems, getProblemById, submitCode, getLeaderboard } from './services/coding.api'
import './CodingRound.scss'

const DIFFICULTY_VARIANT = { Easy: 'success', Medium: 'warning', Hard: 'danger' }

/**
 * CodingRound — list problems, solve in an editor against test cases,
 * track a timer, submit for AI review, and see a leaderboard.
 *
 * @backend GET  /api/coding/problems
 * @backend GET  /api/coding/problems/:id
 * @backend POST /api/coding/submit
 * @backend GET  /api/coding/leaderboard
 */
export default function CodingRound() {
  const toast = useToast()
  const [view, setView] = useState('list') // list | solving | result
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [problems, setProblems] = useState([])
  const [topics, setTopics] = useState([])
  const [difficulties, setDifficulties] = useState([])
  const [filters, setFilters] = useState({ topic: '', difficulty: '' })
  const [leaderboard, setLeaderboard] = useState([])

  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submission, setSubmission] = useState(null)

  const loadProblems = (f = filters) => {
    setStatus('loading')
    getProblems(f)
      .then((data) => {
        setProblems(data.problems)
        setTopics(data.topics)
        setDifficulties(data.difficulties)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(() => {
    loadProblems()
    getLeaderboard().then((data) => setLeaderboard(data.leaderboard)).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (next) => {
    setFilters(next)
    loadProblems(next)
  }

  const handleSelectProblem = async (id) => {
    try {
      const data = await getProblemById(id)
      setProblem(data.problem)
      setCode(data.problem.starterCode)
      setSeconds(0)
      setSubmission(null)
      setView('solving')
    } catch (err) {
      toast.error('Could not load this problem.')
    }
  }

  const handleSubmit = async () => {
    if (code.trim().length < 10) {
      toast.warning('Write a solution before submitting.')
      return
    }
    setSubmitting(true)
    try {
      const data = await submitCode({ problemId: problem._id, code, language: 'javascript', timeTakenSeconds: seconds })
      setSubmission(data.submission)
      setView('result')
      getLeaderboard().then((d) => setLeaderboard(d.leaderboard)).catch(() => {})
      toast.success(`Submitted! ${data.submission.passedCount}/${data.submission.totalCount} test cases passed.`)
    } catch (err) {
      console.error('submitCode error:', err)
      toast.error(err?.response?.data?.message || 'Could not submit your solution.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackToList = () => {
    setView('list')
    setProblem(null)
    setSubmission(null)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Coding Round"
        title={view === 'list' ? 'Sharpen your coding skills' : problem?.title}
        description={
          view === 'list'
            ? 'Practice real interview-style coding problems with AI-reviewed submissions.'
            : undefined
        }
        actions={
          view !== 'list' ? (
            <Button variant="ghost" size="sm" icon={<FiArrowLeft />} onClick={handleBackToList}>
              Back to problems
            </Button>
          ) : undefined
        }
      />

      {view === 'list' && (
        <div className="coding-round__list-layout">
          <div className="coding-round__list-main">
            {status === 'loading' && <SkeletonGrid count={6} />}
            {status === 'error' && <ErrorState onRetry={() => loadProblems()} />}
            {status === 'ready' && (
              <ProblemList
                problems={problems}
                topics={topics}
                difficulties={difficulties}
                filters={filters}
                onFilterChange={handleFilterChange}
                onSelect={handleSelectProblem}
              />
            )}
          </div>
          <div className="coding-round__list-side">
            <Leaderboard data={leaderboard} />
          </div>
        </div>
      )}

      {view === 'solving' && problem && (
        <div className="coding-round__solving">
          <div className="coding-round__problem-panel">
            <GlassCard padding="lg" hoverable={false}>
              <div className="coding-round__problem-meta">
                <Badge variant={DIFFICULTY_VARIANT[problem.difficulty]}>{problem.difficulty}</Badge>
                <Badge variant="default">{problem.topic}</Badge>
                <Timer running={view === 'solving'} onTick={setSeconds} />
              </div>
              <p className="coding-round__description">{problem.description}</p>

              {problem.examples?.length > 0 && (
                <div className="coding-round__examples">
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="coding-round__example">
                      <p><span>Input:</span> {ex.input}</p>
                      <p><span>Output:</span> {ex.output}</p>
                      {ex.explanation && <p className="coding-round__example-explain">{ex.explanation}</p>}
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints?.length > 0 && (
                <div className="coding-round__constraints">
                  <p className="coding-round__constraints-title">Constraints</p>
                  <ul>{problem.constraints.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </div>
              )}
            </GlassCard>

            <TestCasePanel visibleTestCases={problem.visibleTestCases} />
          </div>

          <div className="coding-round__editor-panel">
            <CodeEditor value={code} onChange={setCode} language="javascript" />
            <Button variant="primary" size="lg" icon={<FiSend />} loading={submitting} onClick={handleSubmit} fullWidth>
              Submit Solution
            </Button>
          </div>
        </div>
      )}

      {view === 'result' && submission && problem && (
        <div className="coding-round__result">
          <GlassCard padding="lg" hoverable={false} glow={submission.passedCount === submission.totalCount ? 'success' : 'primary'}>
            <div className="coding-round__result-header">
              <div>
                <p className="coding-round__result-score">{submission.score} pts</p>
                <p className="coding-round__result-sub">
                  {submission.passedCount} / {submission.totalCount} test cases passed
                </p>
              </div>
              <Button variant="primary" icon={<FiPlay />} onClick={() => setView('solving')}>
                Keep Editing
              </Button>
            </div>
            <p className="coding-round__result-feedback">{submission.feedback}</p>
          </GlassCard>

          <TestCasePanel results={submission.testResults} />

          <Button variant="secondary" size="lg" onClick={handleBackToList} fullWidth>
            Back to Problems
          </Button>
        </div>
      )}
    </div>
  )
}
