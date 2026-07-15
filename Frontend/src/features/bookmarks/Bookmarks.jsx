import { useEffect, useState } from 'react'
import { FiTrash2, FiBookmark, FiFilter } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { getBookmarks, deleteBookmark } from './services/bookmarks.api'
import './Bookmarks.scss'

const TYPE_LABEL = { question: 'Question', company: 'Company', flashcard: 'Flashcard', note: 'Note' }
const TYPE_VARIANT = { question: 'primary', company: 'success', flashcard: 'warning', note: 'default' }
const FILTERS = ['All', 'question', 'company', 'flashcard', 'note']

export default function Bookmarks() {
  const toast = useToast()
  const [status, setStatus] = useState('loading')
  const [bookmarks, setBookmarks] = useState([])
  const [filter, setFilter] = useState('All')

  const load = async () => {
    setStatus('loading')
    try {
      const data = await getBookmarks()
      setBookmarks(data.bookmarks)
      setStatus('ready')
    } catch { setStatus('error') }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    try {
      await deleteBookmark(id)
      setBookmarks(prev => prev.filter(b => b._id !== id))
      toast.success('Bookmark removed.')
    } catch { toast.error('Could not remove bookmark.') }
  }

  const filtered = filter === 'All' ? bookmarks : bookmarks.filter(b => b.type === filter)

  return (
    <div>
      <PageHeader
        eyebrow="Bookmarks"
        title="Your saved items"
        description="All your bookmarked questions, companies, flashcards, and notes in one place."
      />
      {status === 'loading' && <SkeletonGrid count={6} />}
      {status === 'error' && <ErrorState onRetry={load} />}
      {status === 'ready' && (
        <div className="bookmarks">
          <div className="bookmarks__filters">
            <FiFilter style={{ color: 'var(--text-muted)', marginRight: 6 }} />
            {FILTERS.map(f => (
              <button key={f} className={`bookmarks__filter ${filter === f ? 'bookmarks__filter--active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'All' ? 'All' : TYPE_LABEL[f]}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <GlassCard padding="lg" hoverable={false} className="bookmarks__empty">
              <FiBookmark style={{ fontSize: 32, color: 'var(--text-muted)', marginBottom: 8 }} />
              <p>No bookmarks here yet.</p>
            </GlassCard>
          ) : (
            <div className="bookmarks__grid">
              {filtered.map(b => (
                <GlassCard key={b._id} padding="md" hoverable className="bookmarks__item">
                  <div className="bookmarks__item-header">
                    <Badge variant={TYPE_VARIANT[b.type]}>{TYPE_LABEL[b.type]}</Badge>
                    <button className="bookmarks__del" onClick={() => handleDelete(b._id)}><FiTrash2 /></button>
                  </div>
                  <p className="bookmarks__title">{b.title}</p>
                  <p className="bookmarks__date">{new Date(b.createdAt).toLocaleDateString()}</p>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
