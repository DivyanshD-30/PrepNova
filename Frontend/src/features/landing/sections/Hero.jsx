import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import { FiArrowRight, FiPlay, FiZap, FiCheckCircle } from 'react-icons/fi'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import './Hero.scss'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero">
      <div className="container hero__inner">
        <motion.div
          className="hero__text"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Badge variant="primary" icon={<FiZap />}>AI-Powered Interview Prep</Badge>

          <h1 className="hero__title">
            Walk into any interview <span className="gradient-text">already prepared</span>
          </h1>

          <p className="hero__subtitle">
            PrepNova builds a complete, AI-tailored interview plan from your resume and
            target role — then lets you practice it with a live AI interviewer until
            you're confident.
          </p>

          <div className="hero__actions">
            <Button variant="primary" size="lg" icon={<FiZap />} onClick={() => navigate('/register')}>
              Generate My Interview Plan
            </Button>
            <Button variant="secondary" size="lg" icon={<FiPlay />}>
              Watch demo
            </Button>
          </div>

          <div className="hero__trust">
            <FiCheckCircle /> No credit card required &bull; Free plan available
          </div>
        </motion.div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__panel">
            <div className="hero__panel-header">
              <span className="hero__dot hero__dot--red" />
              <span className="hero__dot hero__dot--yellow" />
              <span className="hero__dot hero__dot--green" />
              <span className="hero__panel-title">AI Interviewer — Live Session</span>
            </div>

            <div className="hero__chat">
              <motion.div
                className="hero__bubble hero__bubble--ai"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Tell me about a time you optimized a slow-loading page. What was your approach?
              </motion.div>

              <motion.div
                className="hero__bubble hero__bubble--user"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                I profiled the bundle, found a 2MB chart library only used on one route, and lazy-loaded it...
              </motion.div>

              <motion.div
                className="hero__typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                <span className="hero__typing-dot" />
                <span className="hero__typing-dot" />
                <span className="hero__typing-dot" />
              </motion.div>
            </div>

            <div className="hero__panel-footer">
              <div className="hero__score-ring">
                <span>87</span>
              </div>
              <div>
                <p className="hero__score-label">Match Score</p>
                <p className="hero__score-sub">Strong fit for Senior Frontend role</p>
              </div>
            </div>
          </div>

          <motion.div
            className="hero__floating-card hero__floating-card--1"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FiCheckCircle /> Technical round passed
          </motion.div>
          <motion.div
            className="hero__floating-card hero__floating-card--2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <FiArrowRight /> 12-day roadmap ready
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
