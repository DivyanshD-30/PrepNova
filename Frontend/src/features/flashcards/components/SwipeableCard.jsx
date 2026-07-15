import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiBookmark, FiRotateCw } from 'react-icons/fi'
import Badge from '../../../components/ui/Badge'
import './SwipeableCard.scss'

const DIFFICULTY_VARIANT = { Easy: 'success', Medium: 'warning', Hard: 'danger' }

/**
 * SwipeableCard — a single flashcard. Click/tap to flip, drag horizontally
 * and release past the threshold to advance to the next card.
 *
 * @param {Function} onSwipe - called with 'left' | 'right' when swiped past threshold
 * @param {Function} onToggleFavorite
 * @param {Function} onToggleBookmark
 */
export default function SwipeableCard({ card, onSwipe, onToggleFavorite, onToggleBookmark }) {
  const [flipped, setFlipped] = useState(false)

  const handleDragEnd = (e, info) => {
    if (info.offset.x > 120) onSwipe('right')
    else if (info.offset.x < -120) onSwipe('left')
  }

  return (
    <motion.div
      className="swipeable-card"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={`swipeable-card__inner ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((f) => !f)}>
        <div className="swipeable-card__face swipeable-card__face--front">
          <div className="swipeable-card__top">
            <Badge variant={DIFFICULTY_VARIANT[card.difficulty]} size="sm">{card.difficulty}</Badge>
            <span className="swipeable-card__flip-hint"><FiRotateCw /> Tap to flip</span>
          </div>
          <p className="swipeable-card__text">{card.front}</p>
        </div>

        <div className="swipeable-card__face swipeable-card__face--back">
          <div className="swipeable-card__top">
            <Badge variant="accent" size="sm">Answer</Badge>
            <span className="swipeable-card__flip-hint"><FiRotateCw /> Tap to flip</span>
          </div>
          <p className="swipeable-card__text">{card.back}</p>
        </div>
      </div>

      <div className="swipeable-card__actions">
        <button
          className={`swipeable-card__action ${card.isFavorite ? 'is-active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(card._id) }}
          aria-label="Toggle favorite"
        >
          <FiStar />
        </button>
        <button
          className={`swipeable-card__action ${card.isBookmarked ? 'is-active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(card._id) }}
          aria-label="Toggle bookmark"
        >
          <FiBookmark />
        </button>
      </div>
    </motion.div>
  )
}
