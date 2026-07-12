import { FiCheck, FiX } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './TestCasePanel.scss'

/**
 * TestCasePanel — shows visible test cases before submission, and pass/fail
 * results (including hidden cases) after submission.
 */
export default function TestCasePanel({ visibleTestCases, results }) {
  if (results) {
    return (
      <GlassCard padding="lg" hoverable={false} className="test-case-panel">
        <h3 className="test-case-panel__title">
          Results — {results.filter((r) => r.passed).length} / {results.length} passed
        </h3>
        <div className="test-case-panel__list">
          {results.map((r, i) => (
            <div key={i} className={`test-result ${r.passed ? 'test-result--pass' : 'test-result--fail'}`}>
              <span className="test-result__icon">{r.passed ? <FiCheck /> : <FiX />}</span>
              <div className="test-result__body">
                <p className="test-result__case">Test case {i + 1}{r.input ? `: ${r.input}` : ''}</p>
                {r.reasoning && <p className="test-result__reasoning">{r.reasoning}</p>}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard padding="lg" hoverable={false} className="test-case-panel">
      <h3 className="test-case-panel__title">Visible Test Cases</h3>
      <div className="test-case-panel__list">
        {visibleTestCases.map((tc, i) => (
          <div key={i} className="test-case-static">
            <p><span>Input:</span> {tc.input}</p>
            <p><span>Expected:</span> {tc.expectedOutput}</p>
          </div>
        ))}
      </div>
      <p className="test-case-panel__hidden-note">
        Plus hidden test cases evaluated only on submission.
      </p>
    </GlassCard>
  )
}
