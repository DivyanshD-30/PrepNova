import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000', withCredentials: true })

export async function getFlashcards({ topic, difficulty } = {}) {
  const res = await api.get('/api/flashcards', { params: { topic, difficulty } })
  return res.data
}
export async function toggleFavorite(id, favorited) {
  const res = await api.post(`/api/flashcards/${id}/favorite`, { favorited })
  return res.data
}
export default api
