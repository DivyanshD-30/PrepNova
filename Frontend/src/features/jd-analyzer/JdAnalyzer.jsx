import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiRotateCcw, FiClipboard } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import GlassCard from '../../components/ui/GlassCard'
import ErrorState from '../../components/ui/ErrorState'
import { useToast } from '../../components/ui/Toast'
import MatchScoreBar from './components/MatchScoreBar'
import SkillTagList from './components/SkillTagList'
import LearningSuggestions from './components/LearningSuggestions'
import { analyzeJd } from './services/jdAnalysis.api'
import './JdAnalyzer.scss'

/**
 * JdAnalyzer — paste a job description, see keyword/skill matching against
 * your profile, missing skills, and what to learn next.
 *
 * @backend POST /api/jd/analyze
 *   Uses the resume/self-description from your most recent AI Interview
 *   Generator report (if any) as profile context — generate an interview
 *   plan first for a more personalized match.
 */
export default function JdAnalyzer() {
  const toast = useToast()
  const [jobDescription, setJobDescription] = useState('')
  const [status, setStatus] = useState('idle') // idle | analyzing | ready | error
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyze = async () => {
    if (jobDescription.trim().length < 30) {
      toast.warning('Paste a full job description first (at least a few sentences).')
      return
    }
    setStatus('analyzing')
    try {
      const data = await analyzeJd(jobDescription)
      setAnalysis(data.analysis)
      setStatus('ready')
      toast.success('Job description analyzed!')
    } catch (err) {
      console.error('JD analysis error:', err)
      toast.error(err?.response?.data?.message || 'Could not analyze this job description.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setAnalysis(null)
    setStatus('idle')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Job Description Analyzer"
        title="See how well you match a role"
        description="Paste any job description to see keyword matches, missing skills, and a personalized learning plan."
        actions={
          status === 'ready' && (
            <Button variant="ghost" size="sm" icon={<FiRotateCcw />} onClick={handleReset}>
              Analyze another
            </Button>
          )
        }
      />

      {status === 'idle' && (
        <GlassCard padding="lg" hoverable={false} className="jd-analyzer__input-card">
          <div className="jd-analyzer__input-header">
            <span className="jd-analyzer__input-icon"><FiClipboard /></span>
            <h3>Paste Job Description</h3>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="jd-analyzer__textarea"
            placeholder="Paste the full job description here..."
            maxLength={6000}
          />
          <div className="jd-analyzer__footer">
            <span>{jobDescription.length} / 6000 chars</span>
            <Button variant="primary" size="lg" icon={<FiSearch />} onClick={handleAnalyze}>
              Analyze Match
            </Button>
          </div>
        </GlassCard>
      )}

      {status === 'analyzing' && (
        <GlassCard padding="lg" hoverable={false} className="jd-analyzer__analyzing">
          <motion.div
            className="jd-analyzer__pulse"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <FiSearch />
          </motion.div>
          <p className="jd-analyzer__analyzing-title">Comparing against your profile...</p>
          <p className="jd-analyzer__analyzing-sub">Matching keywords, skills, and seniority level.</p>
        </GlassCard>
      )}

      {status === 'error' && <ErrorState onRetry={handleAnalyze} description="Couldn't analyze this job description. Please try again." />}

      {status === 'ready' && analysis && (
        <div className="jd-analyzer__results">
          <MatchScoreBar
            percentage={analysis.matchPercentage}
            seniorityMatch={analysis.seniorityMatch}
            roleSummary={analysis.roleSummary}
          />

          <div className="jd-analyzer__skill-grid">
            <SkillTagList title="Matched Skills" skills={analysis.matchedSkills} variant="matched" />
            <SkillTagList title="Missing Skills" skills={analysis.missingSkills} variant="missing" />
            <SkillTagList title="Nice to Have" skills={analysis.niceToHaveSkills} variant="nice-to-have" />
          </div>

          <LearningSuggestions suggestions={analysis.learningSuggestions} />
        </div>
      )}
    </div>
  )
}
