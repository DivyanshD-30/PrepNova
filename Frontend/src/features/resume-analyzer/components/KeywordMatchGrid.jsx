import { FiCheck, FiX } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './KeywordMatchGrid.scss'

/**
 * KeywordMatchGrid — shows which target keywords were found in the resume.
 */
export default function KeywordMatchGrid({ keywords }) {
  const foundCount = keywords.filter((k) => k.found).length

  return (
    <GlassCard padding="lg" hoverable={false} className="keyword-grid">
      <div className="keyword-grid__header">
        <h3>Keyword Coverage</h3>
        <span>{foundCount} / {keywords.length} found</span>
      </div>
      <div className="keyword-grid__list">
        {keywords.map((k) => (
          <span key={k.keyword} className={`keyword-chip ${k.found ? 'keyword-chip--found' : 'keyword-chip--missing'}`}>
            {k.found ? <FiCheck /> : <FiX />}
            {k.keyword}
          </span>
        ))}
      </div>
    </GlassCard>
  )
}
