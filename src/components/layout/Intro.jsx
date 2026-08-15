import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Full-page cinematic intro.
 * Sequence: dark screen → "ANKIT JHA" clip reveal → violet particle bloom → zoom into hero.
 * Duration ~1.4s total. Skips entirely on subsequent visits (sessionStorage) and on reduced motion.
 * Uses pointer-events to remain non-blocking past the reveal.
 */
export default function Intro() {
  const rootRef = useRef(null)
  const nameRef = useRef(null)
  const subRef = useRef(null)
  const [done, setDone] = useState(() => {
    try {
      if (sessionStorage.getItem('ajp-intro-seen')) return true
    } catch {
      /* ignore */
    }
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
    } catch {
      /* ignore */
    }
    return false
  })

  useEffect(() => {
    // Already seen / reduced motion — nothing to animate
    if (done) return

    const root = rootRef.current
    const name = nameRef.current
    const sub = subRef.current
    if (!root || !name) return

    try {
      sessionStorage.setItem('ajp-intro-seen', '1')
    } catch {
      /* ignore */
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => setDone(true),
      })

      // 1. Name clips up
      tl.fromTo(
        name,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7 }
      )
        // 2. Subtitle fades in
        .fromTo(sub, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
        // 3. Hold a beat, then zoom out / fade the whole overlay
        .to(root, { scale: 1.06, autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.35')
    }, root)

    const timer = setTimeout(() => {
      // Safety: never block longer than ~2.2s
      setDone(true)
    }, 2200)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050505] pointer-events-none"
      aria-hidden="true"
    >
      {/* subtle violet radial bloom behind the name */}
      <div className="absolute left-1/2 top-1/2 h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B5CF6]/20 blur-[80px]" />
      <div className="overflow-hidden px-6">
        <h1
          ref={nameRef}
          className="select-none whitespace-nowrap font-black uppercase text-[#F5F5F5] -translate-y-px"
          style={{ fontFamily: "'Mitr', sans-serif", fontSize: 'clamp(2.2rem, 9vw, 7rem)', letterSpacing: '-0.04em' }}
        >
          <span className="bg-gradient-to-r from-[#a78bfa] to-[#8B5CF6] bg-clip-text text-transparent">
            Ankit Jha
          </span>
        </h1>
      </div>
      <p
        ref={subRef}
        className="mt-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[#A1A1AA]"
        style={{ opacity: 0 }}
      >
        Creative Developer
      </p>
    </div>
  )
}