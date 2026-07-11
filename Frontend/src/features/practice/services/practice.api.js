import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

/**
 * @route POST /api/practice/session
 * Start a new session. Returns { session: { id, topic, messages } }
 */
export async function startSession(topic) {
  const res = await api.post('/api/practice/session', { topic })
  return res.data
}

/**
 * @route GET /api/practice/session/:id
 * Resume an existing session.
 */
export async function getSession(id) {
  const res = await api.get(`/api/practice/session/${id}`)
  return res.data
}

/**
 * @route POST /api/practice/session/:id/message
 * Send a user message. Returns { reply, done, progress }
 */
export async function sendMessage(sessionId, message) {
  const res = await api.post(`/api/practice/session/${sessionId}/message`, { message })
  return res.data
}

/**
 * @route PATCH /api/practice/session/:id/end
 * End a session early.
 */
export async function endSession(id) {
  const res = await api.patch(`/api/practice/session/${id}/end`)
  return res.data
}

export default api
