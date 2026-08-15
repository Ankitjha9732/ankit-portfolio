import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Custom cursor system:
 * - Small dot that follows the pointer exactly.
 * - A trailing ring that interpolates with a slight delay.
 * - Expands / changes state over interactive elements (links, buttons, [data-cursor]).
 * Only active on fine pointers (desktop). Disabled entirely on touch + reduced motion.
 */
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mqHover = window.matchMedia('(hover: none)')
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mqHover.matches || mqReduce.matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 })

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let shown = false

    const scaleDot = gsap.quickTo(dot, 'scale', { duration: 0.2, ease: 'power2.out' })
    const scaleRing = gsap.quickTo(ring, 'scale', { duration: 0.25, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      gsap.set(dot, { x: e.clientX, y: e.clientY, opacity: 1 })
      ringX(e.clientX)
      ringY(e.clientY)
      if (!shown) {
        shown = true
        gsap.to(ring, { opacity: 1, duration: 0.3 })
      }
    }

    const onOver = (e) => {
      const t = e.target.closest('a, button, [data-cursor], .magnetic, input, textarea, select, [role="button"]')
      if (t) {
        scaleDot(0.4)
        scaleRing(1.8)
        gsap.to(ring, { backgroundColor: 'rgba(139,92,246,0.12)', borderColor: 'rgba(139,92,246,0.6)', duration: 0.3 })
      } else {
        scaleDot(1)
        scaleRing(1)
        gsap.to(ring, { backgroundColor: 'rgba(139,92,246,0)', borderColor: 'rgba(139,92,246,0.4)', duration: 0.3 })
      }
    }

    const onDown = () => scaleRing(1.4)
    const onUp = () => scaleRing(1)
    const onLeaveDoc = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 })
      shown = false
    }
    const onEnterDoc = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeaveDoc)
    document.documentElement.addEventListener('mouseenter', onEnterDoc)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeaveDoc)
      document.documentElement.removeEventListener('mouseenter', onEnterDoc)
    }
  }, [])

  return (
    <>
      {/* Hide native cursor on fine pointers only */}
      <style>{`@media (hover:hover) and (pointer:fine) { * { cursor: none !important; } }`}</style>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.9)]"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border border-[#8B5CF6]/40"
      />
    </>
  )
}