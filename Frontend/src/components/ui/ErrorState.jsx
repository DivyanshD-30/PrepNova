import { motion } from 'framer-motion'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'
import Button from './Button'
import './EmptyState.scss'

/**
 * ErrorState — shown when a request fails. Reuses EmptyState styling
 * with a danger-tinted icon and a retry action.
 */
export default function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this right now. Please try again.",
  onRetry,
  compact = false,
}) {
  return (
    <motion.div
      className={`empty-state empty-state--error ${compact ? 'empty-state--compact' : ''}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="empty-state__icon empty-state__icon--danger">
        <FiAlertTriangle />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__desc">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="md" icon={<FiRefreshCw />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </motion.div>
  )
}
