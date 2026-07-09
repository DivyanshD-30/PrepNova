import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { FiBriefcase, FiUser, FiZap, FiInfo } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import { useToast } from '../../components/ui/Toast'
import { useInterview } from '../interview/hooks/useInterview'
import ResumeDropzone from './components/ResumeDropzone'
import TagSelect from './components/TagSelect'
import { EXPERIENCE_LEVELS, DIFFICULTY_LEVELS, TECH_STACKS, INTERVIEW_TYPES } from './generator.config'
import GeneratorReport from './GeneratorReport'
import './Generator.scss'

/**
 * Generator — the AI Interview Generator feature.
 *
 * The form below is wired to the REAL backend today via useInterview():
 *   @backend POST /api/interview/  (jobDescription, selfDescription, resume)
 *
 * The Company / Role / Experience / Difficulty / Tech Stack / Interview
 * Type fields are collected for a richer prompt and forward-compatibility,
 * but are NOT yet sent to the backend — see generator.config.js for the
 * exact future wiring notes.
 *
 * If a report already exists (e.g. navigated here with an interviewId),
 * this renders <GeneratorReport/> instead of the form.
 */
export default function Generator() {
  const { interviewId } = useParams()
  const { loading, generateReport } = useInterview()
  const navigate = useNavigate()
  const toast = useToast()

  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [experience, setExperience] = useState(EXPERIENCE_LEVELS[1])
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS[1])
  const [techStack, setTechStack] = useState([])
  const [interviewType, setInterviewType] = useState(INTERVIEW_TYPES[4])
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)

  // If we're viewing an existing report, render the report view instead.
  if (interviewId) {
    return <GeneratorReport />
  }

  const canSubmit = jobDescription.trim().length > 0 && (resumeFile || selfDescription.trim().length > 0)

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.warning('Add a job description, plus a resume or a quick self-description.')
      return
    }
    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile })
      toast.success('Your interview plan is ready!')
      navigate(`/app/generator/${data._id}`)
    } catch (err) {
      toast.error('Could not generate your interview plan. Please try again.')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="AI Interview Generator"
        title="Create your custom interview plan"
        description="Tell us about the role and your background — our AI builds a tailored technical, behavioral, and HR prep plan."
      />

      <div className="generator">
        {/* ---------- Targeting fields (UI-ready, not yet sent to backend) ---------- */}
        <GlassCard padding="lg" hoverable={false} className="generator__targeting">
          <div className="generator__targeting-header">
            <h3>Target Role</h3>
            <Badge variant="accent" icon={<FiInfo />}>Used to tailor your plan</Badge>
          </div>

          <div className="generator__field-grid">
            <div className="generator__field">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
              />
            </div>
            <div className="generator__field">
              <label htmlFor="role">Role</label>
              <input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
          </div>

          <div className="generator__field">
            <label>Experience Level</label>
            <TagSelect options={EXPERIENCE_LEVELS} value={experience} onChange={setExperience} />
          </div>

          <div className="generator__field">
            <label>Difficulty</label>
            <TagSelect options={DIFFICULTY_LEVELS} value={difficulty} onChange={setDifficulty} />
          </div>

          <div className="generator__field">
            <label>Tech Stack</label>
            <TagSelect options={TECH_STACKS} value={techStack} onChange={setTechStack} multi />
          </div>

          <div className="generator__field">
            <label>Interview Type</label>
            <TagSelect options={INTERVIEW_TYPES} value={interviewType} onChange={setInterviewType} />
          </div>
        </GlassCard>

        {/* ---------- Real backend fields ---------- */}
        <div className="generator__panels">
          <GlassCard padding="lg" hoverable={false} className="generator__panel">
            <div className="generator__panel-header">
              <span className="generator__panel-icon"><FiBriefcase /></span>
              <h3>Target Job Description</h3>
              <Badge variant="primary" size="sm">Required</Badge>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="generator__textarea"
              placeholder={"Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"}
              maxLength={5000}
            />
            <div className="generator__char-counter">{jobDescription.length} / 5000 chars</div>
          </GlassCard>

          <GlassCard padding="lg" hoverable={false} className="generator__panel">
            <div className="generator__panel-header">
              <span className="generator__panel-icon"><FiUser /></span>
              <h3>Your Profile</h3>
            </div>

            <div className="generator__sub-field">
              <label className="generator__sub-label">
                Upload Resume <Badge variant="success" size="sm">Best Results</Badge>
              </label>
              <ResumeDropzone file={resumeFile} onFileSelect={setResumeFile} />
            </div>

            <div className="generator__or-divider"><span>OR</span></div>

            <div className="generator__sub-field">
              <label className="generator__sub-label" htmlFor="selfDescription">Quick Self-Description</label>
              <textarea
                id="selfDescription"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                className="generator__textarea generator__textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            <div className="generator__info-box">
              <FiInfo />
              <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
            </div>
          </GlassCard>
        </div>

        <motion.div
          className="generator__footer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="generator__footer-info">AI-Powered Strategy Generation &bull; Approx 30s</span>
          <Button variant="primary" size="lg" icon={<FiZap />} loading={loading} onClick={handleSubmit}>
            Generate My Interview Strategy
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
