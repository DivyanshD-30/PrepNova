import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000', withCredentials: true })
export async function getBookmarks(type) { const res = await api.get('/api/bookmarks', { params: type ? { type } : {} }); return res.data }
export async function addBookmark(data) { const res = await api.post('/api/bookmarks', data); return res.data }
export async function deleteBookmark(id) { const res = await api.delete(`/api/bookmarks/${id}`); return res.data }
export default api
