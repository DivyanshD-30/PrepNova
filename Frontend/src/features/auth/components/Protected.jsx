import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import FullscreenLoader from '../../../components/ui/FullscreenLoader'

/**
 * Protected — route guard. Redirects to /login if no authenticated user.
 */
const Protected = ({ children }) => {
  const { loading, user } = useAuth()

  if (loading) {
    return <FullscreenLoader label="Checking your session..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default Protected
