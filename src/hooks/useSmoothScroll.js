import { useEffect } from 'react'
import Lenis from 'lenis'
import { registerLenis } from '../lib/scroll'
import { gsap, ScrollTrigger } from '../animations/gsapSetup'

/**
 * Smooth scrolling with Lenis, synced with GSAP ScrollTrigger.
 * The instance is registered so the spatial navigator and inline CTAs
 * can animate the page to scene targets.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.4,
    })
    registerLenis(lenis)

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      registerLenis(null)
      ScrollTrigger.clearScrollMemory()
    }
  }, [])
}

export default useSmoothScroll