import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000', withCredentials: true })
export async function getPlans() { const res = await api.get('/api/subscription/plans'); return res.data }
export async function checkout(planId) { const res = await api.post('/api/subscription/checkout', { planId }); return res.data }
export default api
