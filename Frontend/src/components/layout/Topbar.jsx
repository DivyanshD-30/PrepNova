import { useNavigate } from 'react-router'
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi'
import './Topbar.scss'

/**
 * Topbar — sticky header inside the authenticated app shell.
 * @param {Function} onMenuClick - opens mobile sidebar drawer
 * @param {number} notificationCount
 */
export default function Topbar({ onMenuClick, notificationCount = 0 }) {
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <FiMenu />
      </button>

      <div className="topbar__search">
        <FiSearch className="topbar__search-icon" />
        <input type="text" placeholder="Search questions, companies, topics..." />
        <kbd className="topbar__kbd">⌘K</kbd>
      </div>

      <div className="topbar__actions">
        <button
          className="topbar__icon-btn"
          onClick={() => navigate('/app/notifications')}
          aria-label="Notifications"
        >
          <FiBell />
          {notificationCount > 0 && <span className="topbar__badge">{notificationCount}</span>}
        </button>
      </div>
    </header>
  )
}
