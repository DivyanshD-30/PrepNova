import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import { FiArrowRight } from 'react-icons/fi'
import Button from '../../../components/ui/Button'
import './FinalCta.scss'

export default function FinalCta() {
  const navigate = useNavigate()

  return (
    <section className="final-cta container">
      <motion.div
        className="final-cta__panel"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="final-cta__title">
          Your next offer starts with <span className="gradient-text">one plan</span>
        </h2>
        <p className="final-cta__subtitle">
          Join thousands of candidates using AI to prepare smarter, not harder.
        </p>
        <Button variant="primary" size="lg" iconRight={<FiArrowRight />} onClick={() => navigate('/register')}>
          Generate My Interview Plan
        </Button>
      </motion.div>
    </section>
  )
}
