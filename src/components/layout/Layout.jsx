import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import Intro from './Intro'
import Navbar from './Navbar'
import CustomCursor from '../shared/CustomCursor'

export default function Layout({ children }) {
  useSmoothScroll()

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <CustomCursor />
      <Intro />
      <Navbar />

      <main>{children}</main>

      <footer className="relative border-t border-edge bg-[#050505]">
        <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent" />
        <div className="container-custom py-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]/70">
            © 2024 Ankit Jha · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}