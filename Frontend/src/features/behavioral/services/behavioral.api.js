import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

/**
 * @route GET /api/behavioral/categories
 */
export async function getCategories() {
  const response = await api.get('/api/behavioral/categories')
  return response.data
}

/**
 * @route GET /api/behavioral/question?category=X
 */
export async function getQuestion(category) {
  const response = await api.get('/api/behavioral/question', { params: { category } })
  return response.data
}

/**
 * @route POST /api/behavioral/answer
 */
export async function submitAnswer({ question, category, userAnswer }) {
  const response = await api.post('/api/behavioral/answer', { question, category, userAnswer })
  return response.data
}

/**
 * @route GET /api/behavioral/history
 */
export async function getHistory() {
  const response = await api.get('/api/behavioral/history')
  return response.data
}

export default api
