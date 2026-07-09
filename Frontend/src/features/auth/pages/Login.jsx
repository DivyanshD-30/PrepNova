import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiZap, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../../../components/ui/Toast'
import Button from '../../../components/ui/Button'
import GradientBlobs from '../../../components/ui/GradientBlobs'
import '../auth.form.scss'

export default function Login() {
  const { loading, handleLogin, error, setError } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const result = await handleLogin({ email, password })
    if (result.success) {
      toast.success('Welcome back! Redirecting to your dashboard...')
      navigate('/app/dashboard')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <main className="auth-page">
      <GradientBlobs intensity="default" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/" className="auth-card__brand">
          <span className="auth-card__brand-icon"><FiZap /></span>
          <span className="gradient-text">PrepNova</span>
        </Link>

        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Log in to continue your interview prep journey.</p>

        {error && (
          <motion.div
            className="auth-card__error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <FiAlertCircle />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form__group">
            <label htmlFor="email">Email address</label>
            <div className="auth-form__input-wrap">
              <FiMail className="auth-form__icon" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-form__group">
            <label htmlFor="password">Password</label>
            <div className="auth-form__input-wrap">
              <FiLock className="auth-form__icon" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-form__toggle-visibility"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Log in
          </Button>
        </form>

        <p className="auth-card__footer-text">
          Don&apos;t have an account? <Link to="/register">Create one free</Link>
        </p>
      </motion.div>
    </main>
  )
}
