import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'
import GradientBlobs from '../ui/GradientBlobs'

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <GradientBlobs intensity="default" />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
