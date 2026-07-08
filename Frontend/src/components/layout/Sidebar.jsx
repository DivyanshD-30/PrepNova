import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronsLeft, FiChevronsRight, FiLogOut, FiZap, FiX } from 'react-icons/fi'
import { NAV_GROUPS } from '../../config/navigation'
import { useAuth } from '../../features/auth/hooks/useAuth'
import './Sidebar.scss'

/**
 * Sidebar — primary navigation for the authenticated app shell.
 * @param {boolean} mobileOpen - controls visibility on small screens
 * @param {Function} onMobileClose
 */
export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()

  const onLogout = async () => {
    await handleLogout()
    navigate('/login')
  }

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sidebar-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}
        initial={false}
        animate={{ width: collapsed ? 84 : 280 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="sidebar__top">
          <NavLink to="/app/dashboard" className="sidebar__brand">
            <span className="sidebar__brand-icon">
              <FiZap />
            </span>
            {!collapsed && <span className="sidebar__brand-text">PrepNova</span>}
          </NavLink>
          <button className="sidebar__mobile-close" onClick={onMobileClose} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_GROUPS.map((group) => (
            <div className="sidebar__group" key={group.label}>
              {!collapsed && <p className="sidebar__group-label">{group.label}</p>}
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={onMobileClose}
                    className={({ isActive }) =>
                      `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="sidebar__link-icon">
                      <Icon />
                    </span>
                    {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__collapse-btn" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
            {!collapsed && <span>Collapse</span>}
          </button>

          <div className="sidebar__user">
            <div className="sidebar__avatar">{(user?.username || 'U')[0]?.toUpperCase()}</div>
            {!collapsed && (
              <div className="sidebar__user-info">
                <p className="sidebar__user-name">{user?.username || 'Guest'}</p>
                <p className="sidebar__user-email">{user?.email || ''}</p>
              </div>
            )}
            <button className="sidebar__logout" onClick={onLogout} title="Log out">
              <FiLogOut />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
