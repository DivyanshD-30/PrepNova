import './Badge.scss'

/**
 * Badge — small pill label for tags, statuses, severity markers.
 * @param {'default'|'primary'|'secondary'|'accent'|'success'|'warning'|'danger'} variant
 * @param {'sm'|'md'} size
 */
export default function Badge({ variant = 'default', size = 'sm', icon, children, className = '' }) {
  return (
    <span className={`badge badge--${variant} badge--${size} ${className}`}>
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  )
}
