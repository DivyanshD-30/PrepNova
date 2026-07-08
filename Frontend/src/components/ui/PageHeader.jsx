import { motion } from 'framer-motion'
import './PageHeader.scss'

/**
 * PageHeader — consistent heading block for every feature page.
 * @param {string} eyebrow - small label above title (e.g. "AI Interview Generator")
 * @param {React.ReactNode} title
 * @param {string} description
 * @param {React.ReactNode} actions - buttons rendered on the right (desktop) / below (mobile)
 */
export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <motion.div
      className="page-header"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="page-header__text">
        {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
        <h1 className="page-header__title">{title}</h1>
        {description && <p className="page-header__desc">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </motion.div>
  )
}
