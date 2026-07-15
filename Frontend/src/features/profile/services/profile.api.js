import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000', withCredentials: true })
export async function getProfile() { const res = await api.get('/api/profile'); return res.data }
export async function updateProfile(data) { const res = await api.patch('/api/profile', data); return res.data }
export async function changePassword(data) { const res = await api.patch('/api/profile/password', data); return res.data }
export default api
