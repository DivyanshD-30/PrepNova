import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

/**
 * @route POST /api/jd/analyze
 * Sends a job description, returns { analysis }.
 */
export async function analyzeJd(jobDescription) {
  const response = await api.post('/api/jd/analyze', { jobDescription })
  return response.data
}

export default api
