import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi'
import './Toast.scss'

const ToastContext = createContext(null)

const ICONS = {
  success: <FiCheckCircle />,
  error: <FiAlertCircle />,
  info: <FiInfo />,
  warning: <FiAlertTriangle />,
}

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message, { type = 'info', duration = 4000 } = {}) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration) {
        setTimeout(() => removeToast(id), duration)
      }
      return id
    },
    [removeToast]
  )

  const toast = {
    show: addToast,
    success: (msg, opts) => addToast(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => addToast(msg, { ...opts, type: 'error' }),
    info: (msg, opts) => addToast(msg, { ...opts, type: 'info' }),
    warning: (msg, opts) => addToast(msg, { ...opts, type: 'warning' }),
    dismiss: removeToast,
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`toast toast--${t.type}`}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              layout
            >
              <span className="toast__icon">{ICONS[t.type]}</span>
              <span className="toast__message">{t.message}</span>
              <button className="toast__close" onClick={() => removeToast(t.id)} aria-label="Dismiss notification">
                <FiX />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
