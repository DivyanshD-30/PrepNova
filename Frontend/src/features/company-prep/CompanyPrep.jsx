import { useEffect, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import CompanySearch from './components/CompanySearch'
import CompanyOverview from './components/CompanyOverview'
import InterviewProcessTimeline from './components/InterviewProcessTimeline'
import PastQuestionsList from './components/PastQuestionsList'
import SalaryInsightsTable from './components/SalaryInsightsTable'
import ResourcesList from './components/ResourcesList'
import { getFeaturedCompanies, getCompanyProfile } from './services/companyPrep.api'
import './CompanyPrep.scss'

/**
 * CompanyPrep — search or pick a company, see a full prep profile:
 * about, interview process, past questions, salary insights, resources.
 *
 * @backend GET /api/company-prep/featured
 * @backend GET /api/company-prep/search?q=X
 * @backend GET /api/company-prep/:slug
 *   First lookup of a new company generates + caches its profile with AI —
 *   so the bank grows organically as people search.
 */
export default function CompanyPrep() {
  const toast = useToast()
  const [featured, setFeatured] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [profile, setProfile] = useState(null)
  const [lastQuery, setLastQuery] = useState(null)

  useEffect(() => {
    getFeaturedCompanies()
      .then((data) => setFeatured(data.companies))
      .catch(() => {})
  }, [])

  const handleSelect = async (companyName) => {
    setStatus('loading')
    setLastQuery(companyName)
    try {
      const data = await getCompanyProfile(companyName)
      setProfile(data.profile)
      setStatus('ready')
    } catch (err) {
      console.error('getCompanyProfile error:', err)
      toast.error('Could not load this company profile.')
      setStatus('error')
    }
  }

  const handleBack = () => {
    setProfile(null)
    setStatus('idle')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Company Preparation"
        title={status === 'ready' && profile ? profile.name : 'Research any company'}
        description={
          status !== 'ready'
            ? 'Get a full interview-prep profile for any company — process, past questions, salary data, and resources.'
            : undefined
        }
        actions={
          status === 'ready' && (
            <Button variant="ghost" size="sm" icon={<FiArrowLeft />} onClick={handleBack}>
              Back to search
            </Button>
          )
        }
      />

      {status === 'idle' && <CompanySearch featured={featured} onSelect={handleSelect} />}

      {status === 'loading' && <SkeletonGrid count={4} />}

      {status === 'error' && <ErrorState onRetry={() => handleSelect(lastQuery)} />}

      {status === 'ready' && profile && (
        <div className="company-prep__results">
          <div className="company-prep__main">
            <CompanyOverview profile={profile} />
            <InterviewProcessTimeline rounds={profile.interviewProcess} />
            <PastQuestionsList questions={profile.pastQuestions} />
          </div>
          <div className="company-prep__side">
            <SalaryInsightsTable insights={profile.salaryInsights} />
            <ResourcesList resources={profile.resources} />
          </div>
        </div>
      )}
    </div>
  )
}
