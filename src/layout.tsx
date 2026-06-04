import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Layout() {
  return (
    <div className="relative flex flex-col overflow-hidden bg-bg-primary text-text-primary selection:bg-accent-indigo/30">
      <div className="absolute inset-0 radial-glow-main pointer-events-none z-0" />
      <div className="absolute inset-0 dot-pattern pointer-events-none z-0 opacity-50" />
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-accent-indigo/8 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] bg-accent-violet/6 rounded-full blur-[160px] pointer-events-none z-0" />

      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
