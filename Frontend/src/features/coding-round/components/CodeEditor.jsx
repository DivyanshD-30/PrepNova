import { useRef } from 'react'
import './CodeEditor.scss'

/**
 * CodeEditor — lightweight textarea-based code editor with line numbers
 * and Tab-to-indent support. Not a full Monaco/CodeMirror integration —
 * that's a heavier dependency this stack doesn't have yet. Good enough for
 * short interview-style solutions; swap for @monaco-editor/react later if
 * you want full IntelliSense/syntax highlighting.
 */
export default function CodeEditor({ value, onChange, language = 'javascript' }) {
  const textareaRef = useRef(null)
  const lines = value.split('\n').length

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = textareaRef.current
      const start = el.selectionStart
      const end = el.selectionEnd
      const newValue = value.slice(0, start) + '  ' + value.slice(end)
      onChange(newValue)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2
      })
    }
  }

  return (
    <div className="code-editor">
      <div className="code-editor__header">
        <span className="code-editor__lang">{language}</span>
        <span className="code-editor__lines">{lines} lines</span>
      </div>
      <div className="code-editor__body">
        <div className="code-editor__gutter" aria-hidden="true">
          {Array.from({ length: lines }).map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="code-editor__textarea"
          spellCheck={false}
          placeholder="// Write your solution here"
        />
      </div>
    </div>
  )
}
