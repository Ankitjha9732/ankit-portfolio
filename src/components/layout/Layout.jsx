import { useState, useEffect, useRef } from 'react'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout({ children }) {
  useSmoothScroll()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTicking = useRef(false)
  const menuOpenRef = useRef(false)

  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      if (scrollTicking.current) return
      scrollTicking.current = true

      requestAnimationFrame(() => {
        const currentY = window.scrollY
        const isMobile = window.innerWidth < 768

        if (isMobile && !menuOpenRef.current) {
          const delta = currentY - lastScrollY.current

          if (currentY < 25) {
            setNavHidden(false)
          } else if (delta > 3) {
            setNavHidden(true)
          } else if (delta < -3) {
            setNavHidden(false)
          }
        } else {
          setNavHidden(false)
        }

        lastScrollY.current = currentY
        scrollTicking.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reducedMotion])

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]

  const linkVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.08 + i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    }),
  }

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1F2937]">
      {/* Fixed Logo */}
      <motion.a
        href="#home"
        animate={navHidden ? { y: '-120%', opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-4 left-4 sm:left-6 lg:left-8 z-50 flex items-center justify-center"
        aria-label="Home"
        onClick={(e) => {
          e.preventDefault()
          const el = document.querySelector('#home')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <motion.img
          src="/Untitled-design-transparent.png"
          alt="Ankit Jha logo"
          whileHover={!reducedMotion ? { scale: 1.03 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="h-10 w-10 rounded-full object-cover"
        />
      </motion.a>

      {/* Floating Nav */}
      <motion.div
        animate={navHidden ? { y: '-120%', opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-4 right-4 lg:right-8 z-40"
      >
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="flex items-center rounded-full shadow-lg shadow-black/5 px-2"
            style={{
              background: '#F7F3E9',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.href.slice(1)
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={!reducedMotion ? { y: -2 } : {}}
                  onClick={(e) => {
                    e.preventDefault()
                    const el = document.querySelector(link.href)
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="relative px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#4B5563] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3E9] rounded-full"
                >
                  {!reducedMotion && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 rounded-full"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        background: 'radial-gradient(circle at center, rgba(217,119,6,0.08) 0%, transparent 70%)',
                      }}
                    />
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="navCapsule"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 2px 8px rgba(217,119,6,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                      }}
                    />
                  )}

                  <span className="relative z-10" style={{ color: isActive ? '#D97706' : undefined }}>
                    {link.label}
                  </span>
                </motion.a>
              )
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex md:hidden items-center justify-center w-11 h-11"
            aria-label="Toggle menu"
          >
            <div className="relative w-4 h-3.5">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-0 block h-[1.5px] w-full bg-[#1F2937] rounded-full origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, x: -4 } : { opacity: 1, x: 0 }}
                className="absolute left-0 top-[6px] block h-[1.5px] w-3/4 bg-[#1F2937] rounded-full origin-center"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-[12px] block h-[1.5px] w-full bg-[#1F2937] rounded-full origin-center"
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-30 md:hidden"
                onClick={() => {
                  setMenuOpen(false)
                  document.body.style.overflow = ''
                }}
              />
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden mt-2 md:mt-2 rounded-2xl shadow-lg shadow-black/5 min-w-[200px] z-40"
                style={{
                  background: '#F7F3E9',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
              <div className="flex flex-col py-2 px-3 space-y-0.5">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      setMenuOpen(false)
                      document.body.style.overflow = ''
                      setTimeout(() => {
                        const el = document.querySelector(link.href)
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 350)
                    }}
                    className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#4B5563] hover:text-[#D97706] transition-colors duration-200 py-1.5 px-3 rounded-lg"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        </motion.nav>
      </motion.div>

      {/* Spacer */}
      <div className="h-14 md:h-20" />

      <main className="bg-[#F7F3E9]">
        {children}
      </main>

      <footer className="border-t border-[#CFD3D8] bg-[#F7F3E9] py-8">
        <div className="container-custom text-center text-[#4B5563]">
          <p className="font-mono text-sm uppercase tracking-[0.2em]">&copy; 2024 Ankit Jha. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
