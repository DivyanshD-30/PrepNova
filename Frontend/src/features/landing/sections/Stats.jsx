import { motion } from 'framer-motion'
import AnimatedCounter from '../components/AnimatedCounter'
import { STATS } from '../landing.data'
import './Stats.scss'

export default function Stats() {
  return (
    <section className="stats container">
      <div className="stats__grid">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stats__item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <p className="stats__value gradient-text">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="stats__label">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
