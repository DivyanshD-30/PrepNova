import { motion } from 'framer-motion'
import Button from './Button'
import './EmptyState.scss'

/**
 * EmptyState — shown when a list/section has no data yet.
 *
 * @param {React.ReactNode} icon
 * @param {string} title
 * @param {string} description
 * @param {string} actionLabel
 * @param {Function} onAction
 */
export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <motion.div
      className={`empty-state ${compact ? 'empty-state--compact' : ''}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
