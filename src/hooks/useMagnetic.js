import { useRef, useEffect } from 'react'
import gsap from 'gsap'

/**
 * Magnetic hover effect for an element.
 * The element is attracted toward the cursor within a radius.
 * @param {number} strength - 0..1 attraction strength
 * @returns ref to attach to the element
 */
export function useMagnetic(strength = 0.4) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)')
    if (mq.matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      xTo(relX * strength)
      yTo(relY * strength)
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return ref
}

/**
 * Wrapper to make a child feel magnetic without ref plumbing.
 */
export default function useMagneticWrap(strength = 0.4) {
  const ref = useMagnetic(strength)
  return { magnetRef: ref }
}