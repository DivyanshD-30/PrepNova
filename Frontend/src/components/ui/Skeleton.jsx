import './Skeleton.scss'

/**
 * Skeleton — shimmer loading placeholder.
 * @param {'text'|'title'|'circle'|'rect'|'card'} variant
 * @param {string|number} width
 * @param {string|number} height
 */
export function Skeleton({ variant = 'text', width, height, className = '', style = {} }) {
  return (
    <span
      className={`skeleton skeleton--${variant} ${className}`}
      style={{ width, height, ...style }}
    />
  )
}

/** Prebuilt skeleton for a glass card with title + lines, used on dashboards/lists */
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__top">
        <Skeleton variant="circle" width={42} height={42} />
        <div className="skeleton-card__heading">
          <Skeleton variant="title" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={`${90 - i * 10}%`} />
      ))}
    </div>
  )
}

/** Grid of skeleton cards for page-level loading states */
export function SkeletonGrid({ count = 6, lines = 3 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  )
}

export default Skeleton
