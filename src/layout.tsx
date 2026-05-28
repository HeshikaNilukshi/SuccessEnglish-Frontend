import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-bg-primary text-text-primary overflow-x-hidden selection:bg-accent-indigo/30">
      {/* Dynamic atmospheric radial glows and dots */}
      <div className="absolute inset-0 radial-glow-main pointer-events-none z-0" />
      <div className="absolute inset-0 dot-pattern pointer-events-none z-0 opacity-50" />

      {/* Decorative gradient glowing orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-accent-indigo/8 rounded-full blur-[160px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] bg-accent-violet/6 rounded-full blur-[160px] pointer-events-none animate-pulse-slow z-0" />

      <Navbar />
      
      <main className="relative flex-grow z-10 w-full">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}
