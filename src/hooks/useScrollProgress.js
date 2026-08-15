import { useRef, useEffect } from 'react'

/**
 * Returns a mutable ref `progress` (0→1) representing how far the user has
 * travelled through a tall scroll container. Drives staged 3D scenes and
 * reading on the DOM side. Falls back to `fallback` under reduced motion so
 * scenes render a stable, finished composition.
 */
export function useScrollProgress(containerRef, fallback = 1) {
  const progress = useRef({ value: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      progress.current.value = fallback
      return
    }

    let raf = 0
    const update = () => {
      const r = container.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const usable = Math.max(1, r.height - vh)
      progress.current.value = Math.min(1, Math.max(0, -r.top / usable))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [containerRef, fallback])

  return progress
}