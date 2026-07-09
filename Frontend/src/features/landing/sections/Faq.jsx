import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import Badge from '../../../components/ui/Badge'
import { FAQS } from '../landing.data'
import './Faq.scss'

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="faq container">
      <div className="faq__header">
        <Badge variant="accent">FAQ</Badge>
        <h2 className="faq__title">Questions, answered</h2>
      </div>

      <div className="faq__list">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`} key={item.q}>
              <button className="faq-item__question" onClick={() => setOpenIndex(isOpen ? -1 : i)}>
                <span>{item.q}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <FiChevronDown />
                </motion.span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="faq-item__answer-wrap"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="faq-item__answer">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
