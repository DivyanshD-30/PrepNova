import './TagSelect.scss'

/**
 * TagSelect — chip-style select. Supports single or multi selection.
 * @param {string[]} options
 * @param {string|string[]} value
 * @param {Function} onChange
 * @param {boolean} multi
 */
export default function TagSelect({ options, value, onChange, multi = false }) {
  const isSelected = (opt) => (multi ? value.includes(opt) : value === opt)

  const handleClick = (opt) => {
    if (multi) {
      const next = isSelected(opt) ? value.filter((v) => v !== opt) : [...value, opt]
      onChange(next)
    } else {
      onChange(opt)
    }
  }

  return (
    <div className="tag-select">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          className={`tag-select__chip ${isSelected(opt) ? 'tag-select__chip--active' : ''}`}
          onClick={() => handleClick(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
