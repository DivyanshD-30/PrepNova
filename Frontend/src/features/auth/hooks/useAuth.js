import { useContext, useEffect } from 'react'
import { AuthContext } from '../auth.context'
import { login, register, logout, getMe } from '../services/auth.api'

/**
 * Extracts a human-readable message from an Axios error / backend error shape.
 * Backend currently returns errors as { message } or { error } — this stays
 * forgiving of either shape so the UI never shows "[object Object]".
 */
function extractErrorMessage(err, fallback) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  const { user, setUser, loading, setLoading, error, setError } = context

  const handleLogin = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const data = await login({ email, password })
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const message = extractErrorMessage(err, 'Unable to log in. Please check your credentials.')
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const data = await register({ username, email, password })
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const message = extractErrorMessage(err, 'Unable to create your account. Please try again.')
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
      setUser(null)
      return { success: true }
    } catch (err) {
      // Even if the backend call fails, clear the local session so the user
      // isn't stuck behind a stale "logged in" state.
      setUser(null)
      return { success: false, message: extractErrorMessage(err, 'Logout request failed, but you have been signed out locally.') }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe()
        setUser(data.user)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getAndSetUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { user, loading, error, setError, handleRegister, handleLogin, handleLogout }
}
