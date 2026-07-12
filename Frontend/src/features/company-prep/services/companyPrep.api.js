import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

/**
 * @route GET /api/company-prep/featured
 */
export async function getFeaturedCompanies() {
  const response = await api.get('/api/company-prep/featured')
  return response.data
}

/**
 * @route GET /api/company-prep/search?q=goo
 */
export async function searchCompanies(query) {
  const response = await api.get('/api/company-prep/search', { params: { q: query } })
  return response.data
}

function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/**
 * @route GET /api/company-prep/:slug
 */
export async function getCompanyProfile(companyName) {
  const slug = slugify(companyName)
  const response = await api.get(`/api/company-prep/${slug}`)
  return response.data
}

export default api
