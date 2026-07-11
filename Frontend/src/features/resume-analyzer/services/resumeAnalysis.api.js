import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

/**
 * @route POST /api/resume/analyze
 * Uploads a resume PDF, returns { analysis }.
 */
export async function analyzeResume(resumeFile) {
  const formData = new FormData()
  formData.append('resume', resumeFile)
  const response = await api.post('/api/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * @route GET /api/resume/analysis/:id
 */
export async function getResumeAnalysisById(id) {
  const response = await api.get(`/api/resume/analysis/${id}`)
  return response.data
}

/**
 * @route GET /api/resume/history
 */
export async function getResumeAnalysisHistory() {
  const response = await api.get('/api/resume/history')
  return response.data
}

export default api
