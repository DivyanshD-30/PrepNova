import { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import GradientBlobs from '../ui/GradientBlobs'
import './AppLayout.scss'

/**
 * AppLayout — shell for every authenticated page (dashboard + all 18 features).
 * Renders Sidebar + Topbar persistently; <Outlet/> swaps the page content.
 */
export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="app-layout">
      <GradientBlobs intensity="subtle" />
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="app-layout__main">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} notificationCount={3} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
