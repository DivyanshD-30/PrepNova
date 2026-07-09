import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

/**
 * @route POST /api/auth/register
 */
export async function register({ username, email, password }) {
  const response = await api.post('/api/auth/register', { username, email, password })
  return response.data
}

/**
 * @route POST /api/auth/login
 */
export async function login({ email, password }) {
  const response = await api.post('/api/auth/login', { email, password })
  return response.data
}

/**
 * @route GET /api/auth/logout
 */
export async function logout() {
  const response = await api.get('/api/auth/logout')
  return response.data
}

/**
 * @route GET /api/auth/get-me
 */
export async function getMe() {
  const response = await api.get('/api/auth/get-me')
  return response.data
}

export default api
