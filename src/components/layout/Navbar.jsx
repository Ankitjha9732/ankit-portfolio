import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useResponsive'
import { EASE } from '../../animations/gsapSetup'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const navRef = useRef(null)
  const lastY = useRef(0)
  const reduced = useReducedMotion()

  // Hide on scroll down / show on scroll up (desktop + mobile)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 40) {
        setHidden(false)
      } else if (y > lastY.current + 4) {
        setHidden(true)
      } else if (y < lastY.current - 4) {
        setHidden(false)
      }
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking
  useEffect(() => {
    const sections = document.querySelectorAll('section[id], [data-section]')
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id || entry.target.dataset.section)
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Entrance animation
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    if (reduced) {
      nav.style.opacity = '1'
      nav.style.transform = 'none'
      return
    }
    // Wait until the intro overlay is done
    const t = setTimeout(() => {
      gsap.fromTo(
        nav,
        { y: -70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: EASE.out }
      )
    }, 1400)
    return () => clearTimeout(t)
  }, [reduced])

  const scrollTo = (href) => {
    setMenuOpen(false)
    document.body.style.overflow = ''
    if (onNavigate) {
      onNavigate(href)
    } else {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={navRef}
      style={{ transform: hidden ? 'translateY(-110%)' : 'translateY(0)' }}
      className="fixed left-0 right-0 top-0 z-[80] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 opacity-0 transition-transform duration-300 ease-out"
    >
      {/* Logo */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault()
          scrollTo('#home')
        }}
        aria-label="Ankit Jha — home"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-edgebright bg-white/[0.03] backdrop-blur-sm hover:border-[#8B5CF6]/60 transition-colors"
      >
        <img
          src="/Untitled-design-transparent.png"
          alt=""
          className="h-7 w-7 rounded-full object-cover"
        />
      </a>

      {/* Desktop nav pill */}
      <div className="flex items-center rounded-full border border-edgebright bg-[#080808]/80 px-2 py-1.5 backdrop-blur-lg shadow-soft">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center lg:hidden"
        >
          <div className="relative h-3.5 w-4">
            <span
              className={`absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-[#F5F5F5] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}
            />
            <span className={`absolute left-0 top-[6px] block h-[1.5px] w-3/4 rounded-full bg-[#F5F5F5] transition-all duration-300 ${menuOpen ? 'opacity-0 -translate-x-1' : ''}`} />
            <span className={`absolute left-0 top-[12px] block h-[1.5px] w-full rounded-full bg-[#F5F5F5] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </div>
        </button>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1)
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo(link.href)
                }}
                aria-current={isActive ? 'true' : undefined}
                className={`relative px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 shadow-glow'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </nav>
      </div>

      {/* Right: resume / CTA (desktop) */}
      <a
        href="/Ankit's Resume.pdf"
        download="Ankit_Jha_Resume.pdf"
        className="hidden lg:inline-flex rounded-full border border-edgebright bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F5F5F5] backdrop-blur-sm hover:border-[#8B5CF6]/60 hover:text-white transition-colors"
      >
        Resume
      </a>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[-1] lg:hidden">
          <div
            className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
          />
          <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-2 pt-24">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo(link.href)
                }}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-[fadeIn_0.4s_ease_both] font-mono text-base uppercase tracking-[0.3em] text-[#F5F5F5] hover:text-[#a78bfa] py-3 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/Ankit's Resume.pdf"
              download="Ankit_Jha_Resume.pdf"
              className="mt-6 rounded-full border border-edgebright px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[#F5F5F5]"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </div>
  )
}