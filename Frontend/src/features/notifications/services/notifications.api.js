import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000', withCredentials: true })
export async function getNotifications() { const res = await api.get('/api/notifications'); return res.data }
export async function markRead(id) { const res = await api.patch(`/api/notifications/${id}/read`); return res.data }
export async function markAllRead() { const res = await api.patch('/api/notifications/read-all'); return res.data }
export default api
