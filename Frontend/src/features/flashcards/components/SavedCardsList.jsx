import { FiStar, FiBookmark } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import Badge from '../../../components/ui/Badge'
import EmptyState from '../../../components/ui/EmptyState'
import './SavedCardsList.scss'

const DIFFICULTY_VARIANT = { Easy: 'success', Medium: 'warning', Hard: 'danger' }

/**
 * SavedCardsList — flat list of favorited/bookmarked cards across all topics.
 */
export default function SavedCardsList({ cards }) {
  if (cards.length === 0) {
    return (
      <EmptyState
        title="No saved cards yet"
        description="Favorite or bookmark cards while reviewing a topic to find them here."
      />
    )
  }

  return (
    <div className="saved-cards-list">
      {cards.map((card) => (
        <GlassCard key={card._id} hoverable={false} padding="lg" className="saved-card">
          <div className="saved-card__top">
            <Badge variant="default" size="sm">{card.topic}</Badge>
            <Badge variant={DIFFICULTY_VARIANT[card.difficulty]} size="sm">{card.difficulty}</Badge>
            <div className="saved-card__icons">
              {card.isFavorite && <FiStar className="is-favorite" />}
              {card.isBookmarked && <FiBookmark className="is-bookmarked" />}
            </div>
          </div>
          <p className="saved-card__front">{card.front}</p>
          <p className="saved-card__back">{card.back}</p>
        </GlassCard>
      ))}
    </div>
  )
}
