import { createBrowserRouter } from 'react-router'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import AppLayout from './components/layout/AppLayout'

// Auth
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Protected from './features/auth/components/Protected'

// Public
import Landing from './features/landing/Landing'

// Core
import Dashboard from './features/dashboard/Dashboard'
import Generator from './features/generator/Generator'
import Practice from './features/practice/Practice'

// Documents & Analysis
import ResumeAnalyzer from './features/resume-analyzer/ResumeAnalyzer'
import JdAnalyzer from './features/jd-analyzer/JdAnalyzer'

// Interview Prep
import Behavioral from './features/behavioral/Behavioral'
import CodingRound from './features/coding-round/CodingRound'
import HrRound from './features/hr-round/HrRound'
import CompanyPrep from './features/company-prep/CompanyPrep'

// Now fully implemented
import Roadmap from './features/roadmap/Roadmap'
import Flashcards from './features/flashcards/Flashcards'
import Notes from './features/notes/Notes'
import Bookmarks from './features/bookmarks/Bookmarks'
import Profile from './features/profile/Profile'
import Notifications from './features/notifications/Notifications'
import Subscription from './features/subscription/Subscription'
import SystemDesign from './features/system-design/SystemDesign'

// Still scaffolded
import ComingSoon from './pages/ComingSoon'

export const router = createBrowserRouter([
  // ---------- Public ----------
  {
    element: <PublicLayout />,
    children: [{ path: '/', element: <Landing /> }],
  },

  // ---------- Auth ----------
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  // ---------- Authenticated app ----------
  {
    path: '/app',
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },

      // AI Interview Generator
      { path: 'generator', element: <Generator /> },
      { path: 'generator/:interviewId', element: <Generator /> },

      // Practice Interview
      { path: 'practice', element: <Practice /> },
      { path: 'practice/:sessionId', element: <Practice /> },

      // Mock Video — camera/recording is browser-only, session backend ready but no UI page yet
      {
        path: 'mock-video',
        element: (
          <ComingSoon
            title="Mock Video Interview"
            description="Practice with a simulated webcam interview: timed questions, recording, and a fullscreen focus mode."
            endpoints={['POST /api/mock-video/session', 'GET /api/mock-video/session/:id', 'POST /api/mock-video/session/:id/recording']}
          />
        ),
      },

      // Documents & Analysis
      { path: 'resume-analyzer', element: <ResumeAnalyzer /> },
      { path: 'jd-analyzer', element: <JdAnalyzer /> },

      // Interview Prep
      { path: 'coding-round', element: <CodingRound /> },
      { path: 'system-design', element: <SystemDesign /> },
      { path: 'behavioral', element: <Behavioral /> },
      { path: 'hr-round', element: <HrRound /> },
      { path: 'company-prep', element: <CompanyPrep /> },

      // Growth & Study Tools
      { path: 'roadmap', element: <Roadmap /> },
      { path: 'flashcards', element: <Flashcards /> },
      { path: 'notes', element: <Notes /> },
      { path: 'bookmarks', element: <Bookmarks /> },

      // Account
      { path: 'profile', element: <Profile /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'subscription', element: <Subscription /> },
    ],
  },

  // Legacy route compatibility
  {
    path: '/interview/:interviewId',
    element: (
      <Protected>
        <Generator />
      </Protected>
    ),
  },
])
