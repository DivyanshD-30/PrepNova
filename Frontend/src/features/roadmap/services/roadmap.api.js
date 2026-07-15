import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000', withCredentials: true })

export async function getRoadmap() {
  const res = await api.get('/api/roadmap')
  return res.data
}
export async function updateProgress(payload) {
  const res = await api.patch('/api/roadmap/progress', payload)
  return res.data
}
export default api
