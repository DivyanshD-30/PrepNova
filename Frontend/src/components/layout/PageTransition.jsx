import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

/**
 * PageTransition — wraps a page's content for a consistent fade/slide
 * transition on mount. Use AnimatePresence at the router level (App.jsx)
 * for exit animations between routes.
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
