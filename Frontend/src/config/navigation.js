import {
  FiHome,
  FiMessageSquare,
  FiVideo,
  FiFileText,
  FiClipboard,
  FiCode,
  FiLayers,
  FiUsers,
  FiMic,
  FiBriefcase,
  FiMap,
  FiCreditCard,
  FiBookOpen,
  FiBookmark,
  FiGrid,
  FiUser,
  FiBell,
  FiZap,
} from 'react-icons/fi'

/**
 * Single source of truth for the app's primary navigation.
 * Used by Sidebar (rendering) and app.routes.jsx (route generation).
 *
 * `backend` notes which API this page will eventually call —
 * helps future-you wire up Express routes with minimal guesswork.
 */
export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/app/dashboard', icon: FiGrid },
    ],
  },
  {
    label: 'Interview Prep',
    items: [
      { id: 'generator', label: 'AI Interview Generator', path: '/app/generator', icon: FiZap },
      { id: 'practice', label: 'Practice Interview', path: '/app/practice', icon: FiMessageSquare },
      { id: 'mock-video', label: 'Mock Video Interview', path: '/app/mock-video', icon: FiVideo },
      { id: 'coding-round', label: 'Coding Round', path: '/app/coding-round', icon: FiCode },
      { id: 'system-design', label: 'System Design Prep', path: '/app/system-design', icon: FiLayers },
      { id: 'behavioral', label: 'Behavioral Questions', path: '/app/behavioral', icon: FiUsers },
      { id: 'hr-round', label: 'HR Round', path: '/app/hr-round', icon: FiMic },
    ],
  },
  {
    label: 'Documents & Analysis',
    items: [
      { id: 'resume-analyzer', label: 'Resume Analyzer', path: '/app/resume-analyzer', icon: FiFileText },
      { id: 'jd-analyzer', label: 'Job Description Analyzer', path: '/app/jd-analyzer', icon: FiClipboard },
    ],
  },
  {
    label: 'Companies & Growth',
    items: [
      { id: 'company-prep', label: 'Company Preparation', path: '/app/company-prep', icon: FiBriefcase },
      { id: 'roadmap', label: 'Learning Roadmap', path: '/app/roadmap', icon: FiMap },
    ],
  },
  {
    label: 'Study Tools',
    items: [
      { id: 'flashcards', label: 'Flashcards', path: '/app/flashcards', icon: FiLayers },
      { id: 'notes', label: 'Notes', path: '/app/notes', icon: FiBookOpen },
      { id: 'bookmarks', label: 'Bookmarks', path: '/app/bookmarks', icon: FiBookmark },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'profile', label: 'Profile', path: '/app/profile', icon: FiUser },
      { id: 'notifications', label: 'Notifications', path: '/app/notifications', icon: FiBell },
      { id: 'subscription', label: 'Subscription', path: '/app/subscription', icon: FiCreditCard },
    ],
  },
]

// Flat list, handy for breadcrumbs / search / route generation
export const NAV_ITEMS_FLAT = NAV_GROUPS.flatMap((g) => g.items)

export const HOME_ICON = FiHome
