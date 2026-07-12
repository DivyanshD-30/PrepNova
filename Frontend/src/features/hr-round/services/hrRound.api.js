import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

/**
 * @route POST /api/hr-round/session
 */
export async function startSession(role) {
  const response = await api.post('/api/hr-round/session', { role })
  return response.data
}

/**
 * @route POST /api/hr-round/session/:id/message
 */
export async function sendMessage(sessionId, message) {
  const response = await api.post(`/api/hr-round/session/${sessionId}/message`, { message })
  return response.data
}

/**
 * @route GET /api/hr-round/session/:id
 */
export async function getSession(sessionId) {
  const response = await api.get(`/api/hr-round/session/${sessionId}`)
  return response.data
}

export default api
