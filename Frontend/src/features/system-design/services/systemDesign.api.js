import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000', withCredentials: true })
export async function getTopics() { const res = await api.get('/api/system-design/topics'); return res.data }
export async function getCaseStudy(id) { const res = await api.get(`/api/system-design/case/${id}`); return res.data }
export default api
