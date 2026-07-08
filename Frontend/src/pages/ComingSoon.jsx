import { motion } from 'framer-motion'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import GlassCard from '../components/ui/GlassCard'
import './ComingSoon.scss'

/**
 * ComingSoon — scaffold page for features whose architecture exists
 * (route + sidebar entry) but whose full UI hasn't been built yet in
 * this pass. Swap this out page-by-page as each feature is delivered.
 *
 * @param {string} title
 * @param {string} description
 * @param {string[]} endpoints - future backend endpoints this page will call
 */
export default function ComingSoon({ title, description, endpoints = [] }) {
  return (
    <div>
      <PageHeader eyebrow="In Development" title={title} description={description} />
      <GlassCard padding="lg" hoverable={false}>
        <motion.div className="coming-soon" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Badge variant="primary">Architecture ready</Badge>
          <p className="coming-soon__text">
            This page&apos;s route, navigation entry, and layout are wired up. The full
            interactive UI for this feature is being built next and will use the
            same design system, dummy data, and animation patterns as the rest of
            the app.
          </p>
          {endpoints.length > 0 && (
            <div>
              <p className="coming-soon__label">Future backend endpoints</p>
              <ul className="coming-soon__endpoints">
                {endpoints.map((ep) => (
                  <li key={ep}>{ep}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </GlassCard>
    </div>
  )
}
