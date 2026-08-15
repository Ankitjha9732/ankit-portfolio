import { useEffect, useState } from 'react'

/**
 * Hook that reports a "quality" level for 3D scenes and animations based on
 * viewport width and capability/power.
 * Returns 'high' | 'low'.
 */
export function useGraphicQuality() {
  const [quality, setQuality] = useState('high')

  useEffect(() => {
    const compute = () => {
      const isMobile = window.innerWidth < 768
      const isTablet = window.innerWidth < 1024
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const coarse = window.matchMedia('(hover: none)').matches
      const weak = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
      if (reduce || isMobile || coarse || weak) {
        setQuality('low')
      } else if (isTablet) {
        setQuality('low')
      } else {
        setQuality('high')
      }
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  return quality
}

/**
 * Reports whether reduced motion is preferred.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      return false
    }
  })
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}