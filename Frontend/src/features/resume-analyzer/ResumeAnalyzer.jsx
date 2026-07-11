import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiZap, FiRotateCcw } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import GlassCard from '../../components/ui/GlassCard'
import ResumeDropzone from '../../components/ui/ResumeDropzone'
import ErrorState from '../../components/ui/ErrorState'
import { useToast } from '../../components/ui/Toast'
import AtsScoreGauge from './components/AtsScoreGauge'
import KeywordMatchGrid from './components/KeywordMatchGrid'
import SuggestionsList from './components/SuggestionsList'
import StrengthsWeaknesses from './components/StrengthsWeaknesses'
import AnalysisHistory from './components/AnalysisHistory'
import { analyzeResume, getResumeAnalysisHistory } from './services/resumeAnalysis.api'
import './ResumeAnalyzer.scss'

/**
 * ResumeAnalyzer — upload a resume, get an ATS score, strengths, weaknesses,
 * keyword coverage, and improvement suggestions.
 *
 * @backend POST /api/resume/analyze   (multipart, field name "resume")
 * @backend GET  /api/resume/history
 * @backend GET  /api/resume/analysis/:id
 */
export default function ResumeAnalyzer() {
  const toast = useToast()
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | analyzing | ready | error
  const [analysis, setAnalysis] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    getResumeAnalysisHistory()
      .then((data) => setHistory(data.history))
      .catch(() => {}) // history is non-critical; fail silently
  }, [])

  const handleAnalyze = async () => {
    if (!file) {
      toast.warning('Upload a resume first.')
      return
    }
    setStatus('analyzing')
    try {
      const data = await analyzeResume(file)
      setAnalysis(data.analysis)
      setHistory((prev) => [
        { id: data.analysis._id, fileName: data.analysis.fileName, atsScore: data.analysis.atsScore, analyzedAt: data.analysis.createdAt },
        ...prev,
      ])
      setStatus('ready')
      toast.success('Resume analysis complete!')
    } catch (err) {
      console.error('Resume analysis error:', err)
      toast.error(err?.response?.data?.message || 'Could not analyze your resume.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setFile(null)
    setAnalysis(null)
    setStatus('idle')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Resume Analyzer"
        title="Get your resume ATS-ready"
        description="Upload your resume to see your ATS compatibility score, strengths, weaknesses, and exactly what to fix."
        actions={
          status === 'ready' && (
            <Button variant="ghost" size="sm" icon={<FiRotateCcw />} onClick={handleReset}>
              Analyze another
            </Button>
          )
        }
      />

      {status === 'idle' && (
        <div className="resume-analyzer__upload-layout">
          <GlassCard padding="lg" hoverable={false} className="resume-analyzer__upload-card">
            <ResumeDropzone file={file} onFileSelect={setFile} />
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={<FiZap />}
              onClick={handleAnalyze}
              className="resume-analyzer__analyze-btn"
            >
              Analyze My Resume
            </Button>
          </GlassCard>

          <AnalysisHistory data={history} />
        </div>
      )}

      {status === 'analyzing' && (
        <GlassCard padding="lg" hoverable={false} className="resume-analyzer__analyzing">
          <motion.div
            className="resume-analyzer__pulse"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <FiZap />
          </motion.div>
          <p className="resume-analyzer__analyzing-title">Analyzing your resume...</p>
          <p className="resume-analyzer__analyzing-sub">Checking formatting, keywords, and structure against ATS standards.</p>
        </GlassCard>
      )}

      {status === 'error' && <ErrorState onRetry={handleAnalyze} description="Couldn't analyze your resume. Please try again." />}

      {status === 'ready' && analysis && (
        <div className="resume-analyzer__results">
          <div className="resume-analyzer__results-main">
            <StrengthsWeaknesses strengths={analysis.strengths} weaknesses={analysis.weaknesses} />
            <KeywordMatchGrid keywords={analysis.keywordMatches} />
            <SuggestionsList suggestions={analysis.suggestions} />
          </div>
          <div className="resume-analyzer__results-side">
            <AtsScoreGauge score={analysis.atsScore} breakdown={analysis.scoreBreakdown} />
          </div>
        </div>
      )}
    </div>
  )
}
