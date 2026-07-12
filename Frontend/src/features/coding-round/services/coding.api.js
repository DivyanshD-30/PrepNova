import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

/**
 * @route GET /api/coding/problems?topic=X&difficulty=Y
 */
export async function getProblems({ topic, difficulty } = {}) {
  const response = await api.get('/api/coding/problems', { params: { topic, difficulty } })
  return response.data
}

/**
 * @route GET /api/coding/problems/:id
 */
export async function getProblemById(id) {
  const response = await api.get(`/api/coding/problems/${id}`)
  return response.data
}

/**
 * @route POST /api/coding/submit
 */
export async function submitCode({ problemId, code, language, timeTakenSeconds }) {
  const response = await api.post('/api/coding/submit', { problemId, code, language, timeTakenSeconds })
  return response.data
}

/**
 * @route GET /api/coding/leaderboard
 */
export async function getLeaderboard() {
  const response = await api.get('/api/coding/leaderboard')
  return response.data
}

/**
 * @route GET /api/coding/submissions
 */
export async function getMySubmissions() {
  const response = await api.get('/api/coding/submissions')
  return response.data
}

export default api
