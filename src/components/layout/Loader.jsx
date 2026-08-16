import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useResponsive'
import { signalSystemReady } from '../../lib/systemStart'

const PHRASES = ['INITIALIZING…', 'LOADING EXPERIENCE…', 'SYSTEM READY']

/**
 * Initial-page loading overlay. Mounts once at app start, plays a short
 * "system initialization" sequence (~1s), then fades out and unmounts.
 * Signals "system ready" the moment it begins fading so the Hero intro
 * hands off seamlessly. Skipped entirely for reduced-motion users.
 */
export default function Loader() {
  const reduced = useReducedMotion()
  const overlayRef = useRef(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (reduced) return
    const el = overlayRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el)
      const statusEl = q('[data-loader-status]')[0]
      const pctEl = q('[data-loader-pct]')[0]
      const fill = q('[data-loader-fill]')[0]

      const tl = gsap.timeline()
      tl.fromTo(
        q('[data-loader-inner]'),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
      )
        .to(fill, {
          scaleX: 1,
          duration: 0.55,
          ease: 'power2.inOut',
          onUpdate() {
            const p = Math.round(this.progress() * 100)
            if (pctEl) pctEl.textContent = `${p}%`
            if (statusEl) {
              statusEl.textContent =
                p < 25 ? PHRASES[0] : p < 65 ? PHRASES[1] : PHRASES[2]
            }
          },
        })
        .to(el, {
          opacity: 0,
          duration: 0.32,
          ease: 'power2.inOut',
          onStart: signalSystemReady,
          onComplete: () => setGone(true),
        })
    }, el)

    return () => ctx.revert()
  }, [reduced])

  if (reduced || gone) return null

  return (
    <div className="loader-overlay" ref={overlayRef} role="status" aria-label="Loading">
      <div data-loader-inner className="loader-inner">
        <p className="loader-kicker">Ankit Jha</p>
        <p className="loader-sub">Digital Developer — Portfolio</p>
        <p data-loader-status className="loader-status">
          {PHRASES[0]}
        </p>
        <div className="loader-bar">
          <div data-loader-fill className="loader-bar-fill" />
        </div>
        <p data-loader-pct className="loader-pct">
          0%
        </p>
      </div>
    </div>
  )
}