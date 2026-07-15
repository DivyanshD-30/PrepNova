import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000', withCredentials: true })

export async function getNotes(params = {}) {
  const res = await api.get('/api/notes', { params })
  return res.data
}
export async function createNote(data) {
  const res = await api.post('/api/notes', data)
  return res.data
}
export async function updateNote(id, data) {
  const res = await api.patch(`/api/notes/${id}`, data)
  return res.data
}
export async function deleteNote(id) {
  const res = await api.delete(`/api/notes/${id}`)
  return res.data
}
export default api
