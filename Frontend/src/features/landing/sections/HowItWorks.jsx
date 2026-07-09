import { motion } from 'framer-motion'
import Badge from '../../../components/ui/Badge'
import { HOW_IT_WORKS } from '../landing.data'
import './HowItWorks.scss'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works container">
      <div className="how-it-works__header">
        <Badge variant="accent">Process</Badge>
        <h2 className="how-it-works__title">
          From job posting to <span className="gradient-text">job offer</span>
        </h2>
      </div>

      <div className="how-it-works__timeline">
        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={step.title}
            className="how-step"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="how-step__marker">
              <span className="how-step__number">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="how-step__content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
