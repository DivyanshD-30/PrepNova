import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZap, FiMenu, FiX } from 'react-icons/fi'
import Button from '../ui/Button'
import { useAuth } from '../../features/auth/hooks/useAuth'
import './Navbar.scss'

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-icon"><FiZap /></span>
          <span className="navbar__brand-text">PrepNova</span>
        </Link>

        <nav className="navbar__links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>

        <div className="navbar__actions">
          {user ? (
            <Button variant="primary" size="sm" onClick={() => navigate('/app/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Get Started Free
              </Button>
            </>
          )}
        </div>

        <button className="navbar__mobile-toggle" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))}
            <div className="navbar__mobile-actions">
              {user ? (
                <Button variant="primary" fullWidth onClick={() => navigate('/app/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="secondary" fullWidth onClick={() => navigate('/login')}>
                    Log in
                  </Button>
                  <Button variant="primary" fullWidth onClick={() => navigate('/register')}>
                    Get Started Free
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
