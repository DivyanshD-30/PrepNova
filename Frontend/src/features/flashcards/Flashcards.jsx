import { useEffect, useState } from 'react'
import { FiHeart, FiRotateCcw, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { getFlashcards, toggleFavorite } from './services/flashcards.api'
import './Flashcards.scss'

const DIFF_VARIANT = { easy: 'success', medium: 'warning', hard: 'danger' }

export default function Flashcards() {
  const toast = useToast()
  const [status, setStatus] = useState('loading')
  const [cards, setCards] = useState([])
  const [topics, setTopics] = useState([])
  const [activeTopic, setActiveTopic] = useState('All')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const load = async () => {
    setStatus('loading')
    try {
      const data = await getFlashcards()
      setCards(data.flashcards)
      setTopics(['All', ...data.topics])
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => { load() }, [])

  const filtered = activeTopic === 'All' ? cards : cards.filter(c => c.topic === activeTopic)
  const card = filtered[index]

  const handleTopic = (t) => { setActiveTopic(t); setIndex(0); setFlipped(false) }
  const handlePrev = () => { setIndex(i => Math.max(0, i - 1)); setFlipped(false) }
  const handleNext = () => { setIndex(i => Math.min(filtered.length - 1, i + 1)); setFlipped(false) }
  const handleFlip = () => setFlipped(f => !f)

  const handleFavorite = async (e) => {
    e.stopPropagation()
    const next = !card.favorited
    setCards(prev => prev.map(c => c._id === card._id ? { ...c, favorited: next } : c))
    try {
      await toggleFavorite(card._id, next)
    } catch {
      setCards(prev => prev.map(c => c._id === card._id ? { ...c, favorited: !next } : c))
      toast.error('Could not update favorite.')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Flashcards"
        title="Quick topic review"
        description="Swipe through flashcards by topic. Click to reveal the answer."
      />

      {status === 'loading' && <SkeletonGrid count={4} />}
      {status === 'error' && <ErrorState onRetry={load} />}

      {status === 'ready' && (
        <div className="flashcards">
          <div className="flashcards__topics">
            {topics.map(t => (
              <button
                key={t}
                className={`flashcards__topic-pill ${activeTopic === t ? 'flashcards__topic-pill--active' : ''}`}
                onClick={() => handleTopic(t)}
              >{t}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <GlassCard padding="lg" hoverable={false} className="flashcards__empty">
              <p>No flashcards for this topic yet.</p>
            </GlassCard>
          ) : (
            <>
              <div className="flashcards__counter">{index + 1} / {filtered.length}</div>

              <div className={`flashcards__card-wrap ${flipped ? 'flashcards__card-wrap--flipped' : ''}`} onClick={handleFlip}>
                <div className="flashcards__card-inner">
                  <GlassCard padding="lg" hoverable={false} className="flashcards__card flashcards__card--front">
                    <div className="flashcards__card-top">
                      <Badge variant={DIFF_VARIANT[card.difficulty]}>{card.difficulty}</Badge>
                      <Badge variant="default">{card.topic}</Badge>
                      <button className={`flashcards__fav ${card.favorited ? 'flashcards__fav--active' : ''}`} onClick={handleFavorite}>
                        <FiHeart />
                      </button>
                    </div>
                    <p className="flashcards__question">{card.question}</p>
                    <p className="flashcards__hint">Click to reveal answer</p>
                  </GlassCard>

                  <GlassCard padding="lg" hoverable={false} className="flashcards__card flashcards__card--back">
                    <div className="flashcards__card-top">
                      <Badge variant="primary">Answer</Badge>
                      <button className={`flashcards__fav ${card.favorited ? 'flashcards__fav--active' : ''}`} onClick={handleFavorite}>
                        <FiHeart />
                      </button>
                    </div>
                    <p className="flashcards__answer">{card.answer}</p>
                  </GlassCard>
                </div>
              </div>

              <div className="flashcards__nav">
                <Button variant="ghost" icon={<FiChevronLeft />} onClick={handlePrev} disabled={index === 0}>Prev</Button>
                <Button variant="ghost" icon={<FiRotateCcw />} onClick={() => setFlipped(false)}>Flip back</Button>
                <Button variant="ghost" iconRight={<FiChevronRight />} onClick={handleNext} disabled={index === filtered.length - 1}>Next</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
