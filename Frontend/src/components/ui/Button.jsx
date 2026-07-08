import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import './Button.scss'

/**
 * Reusable premium Button.
 *
 * @param {'primary'|'secondary'|'ghost'|'outline'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading
 * @param {boolean} fullWidth
 * @param {React.ReactNode} icon - icon rendered before children
 * @param {React.ReactNode} iconRight - icon rendered after children
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    icon = null,
    iconRight = null,
    className = '',
    children,
    disabled,
    ...rest
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      disabled={disabled || loading}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      {...rest}
    >
      <span className="btn__ripple-layer" />
      <span className="btn__content">
        {loading ? (
          <span className="btn__spinner" aria-hidden="true" />
        ) : (
          icon && <span className="btn__icon">{icon}</span>
        )}
        <span className="btn__label">{children}</span>
        {!loading && iconRight && <span className="btn__icon btn__icon--right">{iconRight}</span>}
      </span>
    </motion.button>
  )
})

export default Button
