import { useEffect, useState, useCallback } from 'react'
import { FiPlus, FiTrash2, FiSearch, FiTag } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { getNotes, createNote, updateNote, deleteNote } from './services/notes.api'
import './Notes.scss'

function useDebounce(fn, delay) {
  const [timer, setTimer] = useState(null)
  return useCallback((...args) => {
    clearTimeout(timer)
    setTimer(setTimeout(() => fn(...args), delay))
  }, [fn, delay, timer])
}

export default function Notes() {
  const toast = useToast()
  const [status, setStatus] = useState('loading')
  const [notes, setNotes] = useState([])
  const [folders, setFolders] = useState([])
  const [tags, setTags] = useState([])
  const [active, setActive] = useState(null)
  const [search, setSearch] = useState('')
  const [activeFolder, setActiveFolder] = useState('All')
  const [saving, setSaving] = useState(false)

  const load = async (params = {}) => {
    try {
      const data = await getNotes(params)
      setNotes(data.notes)
      setFolders(['All', ...data.folders])
      setTags(data.tags)
      if (!active && data.notes.length > 0) setActive(data.notes[0])
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => { load() }, [])

  const saveNote = useCallback(async (id, changes) => {
    setSaving(true)
    try {
      const updated = await updateNote(id, changes)
      setNotes(prev => prev.map(n => n._id === id ? updated.note : n))
      if (active?._id === id) setActive(updated.note)
    } catch {
      toast.error('Could not save note.')
    } finally {
      setSaving(false)
    }
  }, [active, toast])

  const debouncedSave = useCallback(
    (() => {
      let t
      return (id, changes) => {
        clearTimeout(t)
        t = setTimeout(() => saveNote(id, changes), 700)
      }
    })(),
    [saveNote]
  )

  const handleCreate = async () => {
    try {
      const data = await createNote({ title: 'Untitled Note', content: '', folder: activeFolder === 'All' ? 'General' : activeFolder })
      setNotes(prev => [data.note, ...prev])
      setActive(data.note)
    } catch {
      toast.error('Could not create note.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNote(id)
      const remaining = notes.filter(n => n._id !== id)
      setNotes(remaining)
      setActive(remaining[0] || null)
      toast.success('Note deleted.')
    } catch {
      toast.error('Could not delete note.')
    }
  }

  const handleTitleChange = (val) => {
    setActive(prev => ({ ...prev, title: val }))
    debouncedSave(active._id, { title: val })
  }

  const handleContentChange = (val) => {
    setActive(prev => ({ ...prev, content: val }))
    debouncedSave(active._id, { content: val })
  }

  const handleSearch = async (val) => {
    setSearch(val)
    await load(val ? { search: val } : {})
  }

  const filtered = activeFolder === 'All' ? notes : notes.filter(n => n.folder === activeFolder)

  return (
    <div>
      <PageHeader
        eyebrow="Notes"
        title="Your markdown notepad"
        description="Create and organise notes by folder and tag. Changes auto-save."
        actions={<Button variant="primary" size="sm" icon={<FiPlus />} onClick={handleCreate}>New Note</Button>}
      />

      {status === 'loading' && <SkeletonGrid count={4} />}
      {status === 'error' && <ErrorState onRetry={() => load()} />}

      {status === 'ready' && (
        <div className="notes">
          <div className="notes__sidebar">
            <div className="notes__search">
              <FiSearch />
              <input
                placeholder="Search notes..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>

            <div className="notes__folders">
              {folders.map(f => (
                <button
                  key={f}
                  className={`notes__folder ${activeFolder === f ? 'notes__folder--active' : ''}`}
                  onClick={() => setActiveFolder(f)}
                >{f}</button>
              ))}
            </div>

            <div className="notes__list">
              {filtered.length === 0 && (
                <p className="notes__empty">No notes yet. Create one!</p>
              )}
              {filtered.map(n => (
                <div
                  key={n._id}
                  className={`notes__item ${active?._id === n._id ? 'notes__item--active' : ''}`}
                  onClick={() => setActive(n)}
                >
                  <p className="notes__item-title">{n.title || 'Untitled'}</p>
                  <p className="notes__item-preview">{n.content?.slice(0, 60) || 'Empty note'}</p>
                  {n.tags?.length > 0 && (
                    <div className="notes__item-tags">
                      {n.tags.slice(0, 2).map(t => <Badge key={t} variant="default">{t}</Badge>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="notes__editor">
            {!active ? (
              <GlassCard padding="lg" hoverable={false} className="notes__no-selection">
                <p>Select a note or create a new one.</p>
              </GlassCard>
            ) : (
              <GlassCard padding="lg" hoverable={false} className="notes__editor-card">
                <div className="notes__editor-header">
                  <input
                    className="notes__title-input"
                    value={active.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="Note title..."
                  />
                  <div className="notes__editor-actions">
                    {saving && <span className="notes__saving">Saving...</span>}
                    <button className="notes__delete-btn" onClick={() => handleDelete(active._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {active.tags?.length > 0 && (
                  <div className="notes__editor-tags">
                    <FiTag />
                    {active.tags.map(t => <Badge key={t} variant="default">{t}</Badge>)}
                  </div>
                )}

                <textarea
                  className="notes__content"
                  value={active.content}
                  onChange={e => handleContentChange(e.target.value)}
                  placeholder="Start writing your note... (Markdown is supported)"
                />
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
