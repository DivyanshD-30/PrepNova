import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

export async function getDashboardSummary() {
  const res = await api.get('/api/dashboard/summary')
  return res.data
}

export async function getScoreTrend() {
  const res = await api.get('/api/dashboard/score-trend')
  return res.data
}

export async function getRecentInterviews() {
  const res = await api.get('/api/dashboard/recent-interviews')
  return res.data
}

export async function getHeatmap() {
  const res = await api.get('/api/dashboard/heatmap')
  return res.data
}

export default api
