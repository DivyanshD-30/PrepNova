import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

/**
 * @route POST /api/interview/generate
 */
export async function generateInterviewReport({ jobDescription, selfDescription, resumeFile }) {
  const formData = new FormData()
  formData.append('jobDescription', jobDescription)
  formData.append('selfDescription', selfDescription)
  if (resumeFile) {
    formData.append('resume', resumeFile)
  }
  const response = await api.post('/api/interview/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * @route GET /api/interview/reports
 */
export async function getAllInterviewReports() {
  const response = await api.get('/api/interview/reports')
  return response.data
}

/**
 * @route GET /api/interview/reports/:id
 */
export async function getInterviewReportById(id) {
  const response = await api.get(`/api/interview/reports/${id}`)
  return response.data
}

/**
 * @route POST /api/interview/resume-pdf
 * Returns a binary PDF blob.
 */
export async function generateResumePdf({ interviewReportId }) {
  const response = await api.post(
    '/api/interview/resume-pdf',
    { interviewReportId },
    { responseType: 'blob' }
  )
  return response.data
}

export default api
